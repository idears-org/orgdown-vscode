import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import * as regexes from '@common/grammar/regex';
import { parseFixtureFile, FixtureTestCase, RegexExpectation } from '@common/fixture-parser';
import { OnigScanner, OnigString, loadWASM } from 'vscode-oniguruma';

const repoRoot = path.resolve(__dirname, '../..');
const fixturesDir = path.resolve(repoRoot, 'test/fixtures');

describe('Grammar Regex Unit Tests', () => {
  beforeAll(async () => {
    const wasmPath = path.resolve(repoRoot, 'node_modules/vscode-oniguruma/release/onig.wasm');
    const wasmBin = await fs.readFile(wasmPath);
    await loadWASM(wasmBin.buffer);
  });

  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.org'));

  for (const file of fixtureFiles) {
    const content = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
    const testCases = parseFixtureFile(content);
    const hasRegexTests = testCases.some(tc => tc.expectations.some(e => e.type === 'regex'));

    if (hasRegexTests) {
      describe(`Testing Regex in ${file}`, () => {
        for (const testCase of testCases) {
          const regexExpectations = testCase.expectations.filter(e => e.type === 'regex') as RegexExpectation[];
          for (const expectation of regexExpectations) {
            runRegexTest(testCase, expectation);
          }
        }
      });
    }
  }
});

function runRegexTest(testCase: FixtureTestCase, expectation: RegexExpectation) {
  it(`${testCase.name} should ${expectation.shouldMatch ? 'match' : 'not match'} with regex ${expectation.name}`, () => {
    const regexPattern = (regexes as any)[expectation.name];
    expect(regexPattern, `Regex '${expectation.name}' not found in regex.ts`).toBeDefined();

    const regexSource = regexPattern.source;
    const scanner = new OnigScanner([regexSource]);
    const onigString = new OnigString(testCase.input);
    const match = scanner.findNextMatchSync(onigString, 0);

    if (expectation.shouldMatch) {
      expect(match, `Expected a match for input: "${testCase.input}"`).not.toBeNull();
      if (expectation.captures) {
        const adaptedMatch = adaptOnigurumaMatch(match!, onigString);
        validateCaptureGroups(adaptedMatch, expectation.captures);
      }
    } else {
      expect(match, `Expected no match for input: "${testCase.input}"`).toBeNull();
    }
  });
}

function adaptOnigurumaMatch(match: any, onigString: OnigString): RegExpMatchArray {
  const result: any = {
    index: match.captureIndices[0].start,
    input: onigString.content,
  };
  for (let i = 0; i < match.captureIndices.length; i++) {
    const capture = match.captureIndices[i];
    result[i] = (capture.start === -1 || capture.end === -1) ? undefined : onigString.content.substring(capture.start, capture.end);
  }
  return result as RegExpMatchArray;
}

function validateCaptureGroups(match: RegExpMatchArray, expectedCaptures: { index: number; value: string | undefined }[]) {
  for (const expected of expectedCaptures) {
    const actual = match[expected.index];
    const expectedValue = expected.value === 'undefined' ? undefined : expected.value;
  // Some optional groups may be reported as empty strings by Oniguruma; treat '' as undefined when that's expected
  const normalized = (actual === '' && expectedValue === undefined) ? undefined : actual;
  expect(normalized).toBe(expectedValue);
  }
}
