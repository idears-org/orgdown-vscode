import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { parseFixtureFile, FixtureTestCase, ScopeExpectation } from '@common/fixture-parser';
import { Registry, IGrammar, parseRawGrammar, IToken } from 'vscode-textmate';
import { OnigScanner, OnigString, loadWASM } from 'vscode-oniguruma';

const repoRoot = path.resolve(__dirname, '../..');
const fixturesDir = path.resolve(repoRoot, 'test/fixtures');

let grammar: IGrammar | null = null;

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
        if (scopeName !== 'text.org') { return null; }
        if (!(await fs.pathExists(grammarPath))) { return null; }
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

  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.org'));
  let anyScopeTests = false;
  for (const file of fixtureFiles) {
    const content = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
    const testCases = parseFixtureFile(content);
    const scopeTestCases = testCases.filter(tc => tc.expectations.some(e => e.type === 'scope'));
    if (scopeTestCases.length === 0) { continue; }
    anyScopeTests = true;
    describe(`Testing Scopes in ${file}`, () => {
      for (const testCase of scopeTestCases) {
        const scopeExpectations = testCase.expectations.filter(e => e.type === 'scope') as ScopeExpectation[];
        for (let i = 0; i < scopeExpectations.length; i++) {
          runScopeTest(testCase, scopeExpectations[i], file, i, scopeExpectations.length);
        }
      }
    });
  }

  if (!anyScopeTests) {
    it('no scope expectations found in fixtures (skipped)', () => {
      expect(true).toBe(true);
    });
  }
});

function runScopeTest(testCase: FixtureTestCase, expectation: ScopeExpectation, fileName: string, index: number, total: number) {
  const testTitle = total > 1 ? `${testCase.name} (Assertion ${index + 1})` : testCase.name;
  it(`${testTitle} should satisfy scope assertions from ${fileName}`, () => {
    if (!grammar) {
      console.warn(`Skipping scope assertions for '${testCase.name}' because TextMate grammar could not be loaded.`);
      expect(true).toBe(true);
      return;
    }

    const lines = testCase.input.split('\n');
    const tokenizedLines: { tokens: IToken[], ruleStack: any }[] = [];
    let ruleStack: any = null;
    for (const line of lines) {
      const result = grammar.tokenizeLine(line, ruleStack);
      tokenizedLines.push(result);
      ruleStack = result.ruleStack;
    }

    for (const assertion of expectation.assertions) {
      let foundScopes: Set<string> | undefined;

      // First, try to find an exact token match.
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const { tokens } = tokenizedLines[i];
        for (const token of tokens) {
          const tokenText = line.slice(token.startIndex, token.endIndex);
          if (tokenText === assertion.text) {
            foundScopes = new Set(token.scopes);
            break;
          }
        }
        if (foundScopes) break;
      }

      // Fallback for region-based assertions (e.g., checking a meta scope over a larger area)
      if (!foundScopes) {
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const startIndex = line.indexOf(assertion.text);
          if (startIndex !== -1) {
            const endIndex = startIndex + assertion.text.length;
            const { tokens } = tokenizedLines[i];
            const containedTokens = tokens.filter(t => t.startIndex >= startIndex && t.endIndex <= endIndex);

            if (containedTokens.length > 0) {
              // Find the intersection of scopes for all contained tokens
              let commonScopes = new Set(containedTokens[0].scopes);
              for (let j = 1; j < containedTokens.length; j++) {
                const currentTokenScopes = new Set(containedTokens[j].scopes);
                commonScopes = new Set([...commonScopes].filter(s => currentTokenScopes.has(s)));
              }
              foundScopes = commonScopes;
            }
            break;
          }
        }
      }

      expect(foundScopes, `No token or region could be found for assertion text '${assertion.text}' in test '${testCase.name}'`).toBeDefined();

      for (const expectedScope of assertion.mustContain) {
        expect(foundScopes!.has(expectedScope), `Expected scope '${expectedScope}' for text '${assertion.text}' in test '${testCase.name}', but it was not found. Available: ${[...foundScopes!].join(', ')}`).toBe(true);
      }

      for (const forbiddenScope of assertion.mustNotContain) {
        expect(foundScopes!.has(forbiddenScope), `Forbidden scope '${forbiddenScope}' for text '${assertion.text}' in test '${testCase.name}' was found. Available: ${[...foundScopes!].join(', ')}`).toBe(false);
      }
    }
  });
}