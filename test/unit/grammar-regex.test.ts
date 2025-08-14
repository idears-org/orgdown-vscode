import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import * as regexes from '@common/grammar/regex';
import { parseFixtureFile } from '@common/fixture-parser';

const fixturesDir = path.resolve(__dirname, '../fixtures');

describe('Grammar Regex Unit Tests', () => {
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

            let pattern = regexPattern;
            let flags = '';
            if (pattern.startsWith('(?i)')) {
              flags = 'i';
              pattern = pattern.substring(4);
            }
            const regex = new RegExp(pattern, flags);

            const match = testCase.input.match(regex);

            if (result.shouldMatch) {
              expect(match, `Expected a match for input: \\"${testCase.input}\\"`).not.toBeNull();
              if (result.expectedCaptures) {
                validateCaptureGroups(match!, result.expectedCaptures);
              }
            } else {
              expect(match, `Expected no match for input: \\"${testCase.input}\\"`).toBeNull();
            }
          });
        }
      }
    });
  }
});

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
