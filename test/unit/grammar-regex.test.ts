import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import * as regexes from '@common/grammar/regex';
import { parseFixtureFile } from '@common/fixture-parser';
import { OnigScanner, OnigString, loadWASM } from 'vscode-oniguruma';

const fixturesDir = path.resolve(__dirname, '../fixtures');

describe('Grammar Regex Unit Tests', () => {
  beforeAll(async () => {
    const wasmPath = path.resolve(__dirname, '../../node_modules/vscode-oniguruma/release/onig.wasm');
    const wasmBin = await fs.readFile(wasmPath);
    await loadWASM(wasmBin.buffer);
  });

  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.org'));

  for (const file of fixtureFiles) {
    describe(`Testing ${file}`, () => {
      const content = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
      const testCases = parseFixtureFile(content);

      for (const testCase of testCases) {
        for (const result of testCase.results) {
          it(`${testCase.name} should ${result.shouldMatch ? 'match' : 'not match'} with ${result.regex}`, () => {
            const regexPattern = (regexes as any)[result.regex];
            expect(regexPattern, `Regex '${result.regex}' not found in regex.ts`).toBeDefined();
            expect(regexPattern, `'${result.regex}' is not a string`).toBeTypeOf('string');

            const scanner = new OnigScanner([regexPattern]);
            const onigString = new OnigString(testCase.input);
            const match = scanner.findNextMatchSync(onigString, 0);

            if (result.shouldMatch) {
              expect(match, `Expected a match for input: "${testCase.input}"`).not.toBeNull();
              if (result.expectedCaptures) {
                const adaptedMatch = adaptOnigurumaMatch(match!, onigString);
                validateCaptureGroups(adaptedMatch, result.expectedCaptures);
              }
            } else {
              expect(match, `Expected no match for input: "${testCase.input}"`).toBeNull();
            }
          });
        }
      }
    });
  }
});

function adaptOnigurumaMatch(match: any, onigString: OnigString): RegExpMatchArray {
    const result: any = {
        index: match.captureIndices[0].start,
        input: onigString.content,
    };
    for (let i = 0; i < match.captureIndices.length; i++) {
        const capture = match.captureIndices[i];
        if (capture.start === -1 || capture.end === -1) {
            result[i] = undefined;
        } else {
            result[i] = onigString.content.substring(capture.start, capture.end);
        }
    }
    return result as RegExpMatchArray;
}

function validateCaptureGroups(match: RegExpMatchArray, expectedCaptures: { index: number; value: string | undefined }[]) {
  for (const expected of expectedCaptures) {
    const actual = match[expected.index];
    const expectedRaw = expected.value;

    let expectedProcessed: string | undefined = expectedRaw;

    if (expectedRaw === 'undefined') {
      expectedProcessed = undefined;
    }

    if (actual !== expectedProcessed) {
      throw new Error(`Group ${expected.index} failed validation. Expected '${expectedProcessed}', but got '${actual}'.`);
    }
    // Using a raw assertion to avoid any framework magic
    expect(actual === expectedProcessed).toBe(true);
  }
}