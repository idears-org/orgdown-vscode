import { describe, it, expect } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import * as regexes from '@common/grammar/regex';

const fixturesDir = path.resolve(__dirname, '../fixtures');

describe('Grammar Regex Unit Tests', () => {
  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.org'));

  for (const file of fixtureFiles) {
    describe(`Testing ${file}`, () => {
      const content = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
      const testCases = parseFixtures(content);

      for (const testCase of testCases) {
        it(`${testCase.name} should ${testCase.shouldMatch ? 'match' : 'not match'} with ${testCase.regex}`, () => {
          // Validate regex exists and create RegExp instance
          const regexPattern = (regexes as any)[testCase.regex];
          expect(regexPattern, `Regex '${testCase.regex}' not found in regex.ts`).toBeDefined();
          expect(regexPattern, `'${testCase.regex}' is not a string`).toBeTypeOf('string');

          let pattern = regexPattern;
          let flags = '';
          if (pattern.startsWith('(?i)')) {
            flags = 'i';
            pattern = pattern.substring(4);
          }
          const regex = new RegExp(pattern, flags);

          // Test the match
          const match = testCase.input.match(regex);

          if (testCase.shouldMatch) {
            expect(match, `Expected a match for input: "${testCase.input}"`).not.toBeNull();

            if (testCase.expectedCaptures) {
              validateCaptureGroups(match!, testCase.expectedCaptures);
            }
          } else {
            expect(match, `Expected no match for input: "${testCase.input}"`).toBeNull();
          }
        });
      }
    });
  }
});

interface TestCase {
  name: string;
  input: string;
  regex: string;
  shouldMatch: boolean;
  expectedCaptures?: { index: number; value: string | undefined }[];
}

function parseWhitespaceSyntax(value: string): string {
  if (value === '<tab>') {
    return '\t';
  }
  const spaceMatch = value.match(/^<sp:(\d+)>$/);
  if (spaceMatch) {
    return ' '.repeat(parseInt(spaceMatch[1], 10));
  }
  return value;
}

function validateCaptureGroups(match: RegExpMatchArray, expectedCaptures: { index: number; value: string | undefined }[]) {
  for (const expected of expectedCaptures) {
    const actual = match[expected.index];
    let expectedValue: string | undefined = expected.value;

    if (expectedValue === 'undefined') {
      expectedValue = undefined;
    } else if (typeof expectedValue === 'string') {
      expectedValue = parseWhitespaceSyntax(expectedValue);
    }

    expect(actual, `Group ${expected.index} expected "${expected.value}" but got "${actual}"`).toEqual(expectedValue);
  }
}

function parseFixtures(content: string): TestCase[] {
  const tests: TestCase[] = [];
  const lines = content.split('\n');

  let currentTestCase = {
    name: null as string | null,
    input: null as string | null,
    inSrcBlock: false,
    srcContent: [] as string[]
  };

  const resetTestCase = () => {
    currentTestCase.name = null;
    currentTestCase.input = null;
    currentTestCase.inSrcBlock = false;
    currentTestCase.srcContent = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Ignore case for #+NAME:
    if (line.trim().toLowerCase().startsWith('#+name:')) {
      resetTestCase();
      currentTestCase.name = line.replace(/^\s*#\+name:/i, '').trim();
      continue;
    }

    // Only process begin_src org (ignore case)
    const beginSrcMatch = line.trim().match(/^#\+begin_src\s+(\w+)/i);
    if (beginSrcMatch) {
      const lang = beginSrcMatch[1].toLowerCase();
      if (lang === 'org') {
        currentTestCase.inSrcBlock = true;
        currentTestCase.srcContent = [];
      } else {
        currentTestCase.inSrcBlock = false;
      }
      continue;
    }

    // Ignore case for #+END_SRC
    if (line.trim().toLowerCase().startsWith('#+end_src')) {
      if (currentTestCase.inSrcBlock) {
        currentTestCase.inSrcBlock = false;
        currentTestCase.input = currentTestCase.srcContent.join('\n');
      }
      continue;
    }

    if (currentTestCase.inSrcBlock) {
      currentTestCase.srcContent.push(line);
      continue;
    }

    // Ignore case for #+RESULTS:
    if (line.trim().toLowerCase().startsWith('#+results:') && currentTestCase.name && currentTestCase.input !== null) {
      const regexName = line.replace(/^\s*#\+results:/i, '').trim();
      const { shouldMatch, expectedCaptures } = parseExpectedResults(lines, i + 1);

      tests.push({
        name: currentTestCase.name,
        input: currentTestCase.input,
        regex: regexName,
        shouldMatch,
        expectedCaptures: shouldMatch && expectedCaptures.length > 0 ? expectedCaptures : undefined,
      });
    }
  }

  return tests;
}

function parseExpectedResults(lines: string[], startIndex: number) {
  let shouldMatch = true;
  const expectedCaptures: { index: number; value: string | undefined }[] = [];

  for (let j = startIndex; j < lines.length; j++) {
    const line = lines[j].trim();

    // Stop parsing when we hit the next test case structure
    if (line.startsWith('#+NAME:') || line.startsWith('#+BEGIN_SRC') || line.startsWith('#+RESULTS:')) {
      break;
    }

    if (line === 'no-match') {
      shouldMatch = false;
      break;
    }

    if (line.startsWith('|') && line.includes('|')) {
      const parts = line.split('|');
      if (parts.length >= 3) { // A valid row | col1 | col2 | splits into 4 parts
          const groupNumStr = parts[1].trim();
          if (groupNumStr !== 'Group #' && !isNaN(parseInt(groupNumStr, 10))) {
              const index = parseInt(groupNumStr, 10);
              const value = parts[2].trim(); // Value is at index 2
              expectedCaptures.push({ index, value });
          }
      }
    }
  }

  return { shouldMatch, expectedCaptures };
}
