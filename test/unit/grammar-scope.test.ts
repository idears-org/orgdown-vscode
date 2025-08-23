import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { parseFixtureFile, ScopeExpectation } from '@common/fixture-parser';
import { Registry, IGrammar, parseRawGrammar, IToken } from 'vscode-textmate';
import { OnigScanner, OnigString, loadWASM } from 'vscode-oniguruma';

const repoRoot = path.resolve(__dirname, '../..');
const fixturesDir = path.resolve(repoRoot, 'test/fixtures');

let grammar: IGrammar | null = null;

// Helpers
type Candidate = {
  lineIndex: number;
  start: number;
  end: number;
  alignedExact: boolean;
  intersection: Set<string>;
  union: Set<string>;
  nearestExactDelta?: number;
};

function unionScopes(tokens: IToken[]): Set<string> {
  const s = new Set<string>();
  for (let ti = 0; ti < tokens.length; ti++) {
    const t = tokens[ti];
    for (let si = 0; si < t.scopes.length; si++) {
      s.add(t.scopes[si]);
    }
  }
  return s;
}

function intersectionScopes(tokens: IToken[]): Set<string> {
  if (tokens.length === 0) {
    return new Set<string>();
  }
  const inter = new Set<string>(tokens[0].scopes);
  for (let i = 1; i < tokens.length; i++) {
    const cur = new Set<string>(tokens[i].scopes);
    for (const v of Array.from(inter)) {
      if (!cur.has(v)) {
        inter.delete(v);
      }
    }
  }
  return inter;
}

describe('Grammar Scope Unit Tests', () => {
  beforeAll(async () => {
    const wasmPath = path.resolve(repoRoot, 'node_modules/vscode-oniguruma/release/onig.wasm');
    const wasmBin = await fs.readFile(wasmPath);
    await loadWASM(wasmBin.buffer);

    const onigLib = Promise.resolve({
      createOnigScanner: (patterns: string[]) => new OnigScanner(patterns),
      createOnigString: (s: string) => new OnigString(s),
    });

    const grammarPath = path.resolve(repoRoot, 'syntaxes/org.tmLanguage.json');
    const registry = new Registry({
      onigLib: onigLib as any,
      loadGrammar: async (scopeName: string) => {
        if (scopeName !== 'text.org') {
          return null;
        }
        if (!(await fs.pathExists(grammarPath))) {
          return null;
        }
        const content = await fs.readFile(grammarPath, 'utf8');
        return parseRawGrammar(content, grammarPath);
      },
    } as any);

    try {
      grammar = await registry.loadGrammar('text.org');
    } catch {
      grammar = null;
    }
  });

  const fixtureFiles = fs.readdirSync(fixturesDir).filter((f) => f.endsWith('.org'));
  let anyScopeTests = false;

  for (const file of fixtureFiles) {
    const content = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
    const testCases = parseFixtureFile(content);
    const scopeTestCases = testCases.filter((tc) => tc.expectations.some((e) => e.type === 'scope'));
    if (scopeTestCases.length === 0) {
      continue;
    }
    anyScopeTests = true;

    describe(`Scopes: ${file}`, () => {
      for (const testCase of scopeTestCases) {
        it(testCase.name, () => {
          expect(grammar, 'Grammar failed to load; ensure syntaxes/org.tmLanguage.json exists').toBeTruthy();
          if (!grammar) {
            return;
          }

          const lines = testCase.input.split('\n');
          const tokenizedLines: { tokens: IToken[] }[] = [];
          let ruleStack: any = null;
          for (let i = 0; i < lines.length; i++) {
            const r = grammar.tokenizeLine(lines[i], ruleStack);
            tokenizedLines.push({ tokens: r.tokens });
            ruleStack = r.ruleStack;
          }

          const scopeExpectations = testCase.expectations.filter((e) => e.type === 'scope') as ScopeExpectation[];
          for (const expectation of scopeExpectations) {
            for (const assertion of expectation.assertions) {
              const candidates: Candidate[] = [];

              for (let li = 0; li < lines.length; li++) {
                const line = lines[li];
                if (!assertion.text) {
                  continue;
                }
                let pos = line.indexOf(assertion.text);
                while (pos !== -1) {
                  const end = pos + assertion.text.length;
                  const { tokens } = tokenizedLines[li];

                  const alignedExact = tokens.find(
                    (t) => t.startIndex === pos && line.slice(t.startIndex, t.endIndex) === assertion.text,
                  );

                  const overlapping = tokens.filter((t) => t.startIndex < end && t.endIndex > pos);

                  if (overlapping.length > 0) {
                    const inter = intersectionScopes(overlapping);
                    const uni = unionScopes(overlapping);

                    const exactMatches = tokens.filter((t) => line.slice(t.startIndex, t.endIndex) === assertion.text);
                    let nearestExactDelta: number | undefined = undefined;
                    if (exactMatches.length > 0) {
                      exactMatches.sort((a, b) => Math.abs(a.startIndex - pos) - Math.abs(b.startIndex - pos));
                      nearestExactDelta = Math.abs(exactMatches[0].startIndex - pos);
                    }

                    candidates.push({
                      lineIndex: li,
                      start: pos,
                      end,
                      alignedExact: Boolean(alignedExact),
                      intersection: inter,
                      union: uni,
                      nearestExactDelta,
                    });
                  }

                  pos = line.indexOf(assertion.text, pos + 1);
                }
              }

              // Choose the best candidate
              let chosen: Candidate | undefined;
              for (let ci = 0; ci < candidates.length; ci++) {
                const c = candidates[ci];
                const hasForbidden = assertion.mustNotContain.some((fs) => c.intersection.has(fs));
                if (hasForbidden) {
                  continue;
                }
                const hasAllExpected = assertion.mustContain.every((es) => c.union.has(es));
                if (!hasAllExpected) {
                  continue;
                }
                if (!chosen) {
                  chosen = c;
                } else {
                  if (c.alignedExact && !chosen.alignedExact) {
                    chosen = c;
                  } else if (c.alignedExact === chosen.alignedExact) {
                    const da = c.nearestExactDelta ?? Number.MAX_SAFE_INTEGER;
                    const db = chosen.nearestExactDelta ?? Number.MAX_SAFE_INTEGER;
                    if (da < db) {
                      chosen = c;
                    }
                  }
                }
              }

              if (!chosen && candidates.length > 0) {
                candidates.sort((a, b) => {
                  if (a.alignedExact && !b.alignedExact) {
                    return -1;
                  }
                  if (!a.alignedExact && b.alignedExact) {
                    return 1;
                  }
                  const da = a.nearestExactDelta ?? Number.MAX_SAFE_INTEGER;
                  const db = b.nearestExactDelta ?? Number.MAX_SAFE_INTEGER;
                  if (da !== db) {
                    return da - db;
                  }
                  if (a.lineIndex !== b.lineIndex) {
                    return a.lineIndex - b.lineIndex;
                  }
                  return a.start - b.start;
                });
                chosen = candidates[0];
              }

              expect(
                chosen,
                `No token/region candidate found for '${assertion.text}' in test '${testCase.name}'`,
              ).toBeDefined();
              if (!chosen) {
                continue; // type narrowing
              }

              const foundIntersection = chosen.intersection;
              const foundUnion = chosen.union;

              for (let mi = 0; mi < assertion.mustContain.length; mi++) {
                const expectedScope = assertion.mustContain[mi];
                const ok = foundUnion.has(expectedScope);
                expect(
                  ok,
                  `Expected scope '${expectedScope}' for '${assertion.text}' in '${testCase.name}', but it was not found. Intersection: ${[...foundIntersection].join(', ')}, Union: ${[...foundUnion].join(', ')}`,
                ).toBe(true);
              }

              for (let fi = 0; fi < assertion.mustNotContain.length; fi++) {
                const forbiddenScope = assertion.mustNotContain[fi];
                const bad = foundIntersection.has(forbiddenScope);
                expect(
                  bad,
                  `Forbidden scope '${forbiddenScope}' for '${assertion.text}' in '${testCase.name}' was found. Intersection: ${[...foundIntersection].join(', ')}, Union: ${[...foundUnion].join(', ')}`,
                ).toBe(false);
              }
            }
          }
        });
      }
    });
  }

  it('Sanity: at least one scope test discovered', () => {
    expect(anyScopeTests).toBe(true);
  });
});
