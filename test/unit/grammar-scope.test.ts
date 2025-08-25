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
  alignedExact: boolean; // retained for debug only
  intersection: Set<string>;
  union: Set<string>;
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
            // Helper to evaluate a single node with optional parent region constraint
            const evalNode = (node: { text: string; mustContain: string[]; mustNotContain: string[] }, parentRegion?: { lineIndex: number; start: number; end: number }) => {
              const candidates: Candidate[] = [];
              const parent = parentRegion;

              for (let li = 0; li < lines.length; li++) {
                // If anchored to a parent region, only consider the same line
                if (parent && li !== parent.lineIndex) {
                  continue;
                }
                const line = lines[li];
                if (!node.text) {
                  continue;
                }
                let pos = line.indexOf(node.text);
                while (pos !== -1) {
                  const end = pos + node.text.length;
                  // If anchored to a parent region, candidate must be within parent span
                  if (parent) {
                    if (!(pos >= parent.start && end <= parent.end)) {
                      pos = line.indexOf(node.text, pos + 1);
                      continue;
                    }
                  }
                  const { tokens } = tokenizedLines[li];

                  const alignedExact = tokens.find(
                    (t) => t.startIndex === pos && line.slice(t.startIndex, t.endIndex) === node.text,
                  );

                  const overlapping = tokens.filter((t) => t.startIndex < end && t.endIndex > pos);

                  if (overlapping.length > 0) {
                    const inter = intersectionScopes(overlapping);
                    const uni = unionScopes(overlapping);

                    candidates.push({
                      lineIndex: li,
                      start: pos,
                      end,
                      alignedExact: Boolean(alignedExact),
                      intersection: inter,
                      union: uni,
                    });
                  }

                  pos = line.indexOf(node.text, pos + 1);
                }
              }

              // Choose the best candidate (elegant rule):
              // - Filter by: no forbidden in INTERSECTION; all expected in UNION
              // - Pick earliest by (lineIndex, start)
              let chosen: Candidate | undefined;
              for (let ci = 0; ci < candidates.length; ci++) {
                const c = candidates[ci];
                const hasForbidden = node.mustNotContain.some((fs) => c.intersection.has(fs));
                if (hasForbidden) {
                  continue;
                }
                const hasAllExpected = node.mustContain.every((es) => c.union.has(es));
                if (!hasAllExpected) {
                  continue;
                }
                if (!chosen) {
                  chosen = c;
                  continue;
                }
                if (c.lineIndex < chosen.lineIndex || (c.lineIndex === chosen.lineIndex && c.start < chosen.start)) {
                  chosen = c;
                }
              }

              if (!chosen && candidates.length > 0) {
                candidates.sort((a, b) => (a.lineIndex - b.lineIndex) || (a.start - b.start));
                chosen = candidates[0]; // best-effort for error messages
              }

              expect(
                chosen,
                `No token/region candidate found for '${node.text}' in test '${testCase.name}'`,
              ).toBeDefined();
              if (!chosen) {
                throw new Error(`No candidate resolved for '${node.text}' in '${testCase.name}'`);
              }

              const picked = chosen as Candidate;
              const foundIntersection = picked.intersection;
              const foundUnion = picked.union;

              for (let mi = 0; mi < node.mustContain.length; mi++) {
                const expectedScope = node.mustContain[mi];
                const ok = foundIntersection.has(expectedScope);
                expect(
                  ok,
                  `Expected scope '${expectedScope}' for '${node.text}' in '${testCase.name}', but it was not found. Intersection: ${[...foundIntersection].join(', ')}, Union: ${[...foundUnion].join(', ')}`,
                ).toBe(true);
              }

              for (let fi = 0; fi < node.mustNotContain.length; fi++) {
                const forbiddenScope = node.mustNotContain[fi];
                const bad = foundIntersection.has(forbiddenScope);
                expect(
                  bad,
                  `Forbidden scope '${forbiddenScope}' for '${node.text}' in '${testCase.name}' was found. Intersection: ${[...foundIntersection].join(', ')}, Union: ${[...foundUnion].join(', ')}`,
                ).toBe(false);
              }
              return { lineIndex: picked.lineIndex, start: picked.start, end: picked.end };
            };

            const walk = (nodes: Array<{ text: string; mustContain: string[]; mustNotContain: string[]; children?: any }>, parentRegion?: { lineIndex: number; start: number; end: number }) => {
              for (const n of nodes) {
                const region = evalNode(n, parentRegion);
                if (n.children && n.children.length > 0) {
                  walk(n.children, region);
                }
              }
            };

            if (expectation.tree && expectation.tree.length > 0) {
              walk(expectation.tree);
            } else {
              // Fallback to flat assertions order (no explicit tree provided)
              for (const a of expectation.assertions) {
                evalNode(a as any);
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
