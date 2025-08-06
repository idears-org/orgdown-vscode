import { describe, it, beforeAll } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import * as regexes from '@common/grammar/regex';

const fixturesDir = path.resolve(__dirname, '../fixtures');

describe('Grammar Regex Unit Tests', () => {
  let expect: Chai.ExpectStatic;

  beforeAll(async () => {
    const chai = await import('chai');
    expect = chai.expect;
  });

  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.org'));

  for (const file of fixtureFiles) {
    const content = fs.readFileSync(path.join(fixturesDir, file), 'utf8');
    const testCases = parseFixtures(content);

    for (const testCase of testCases) {
      it(`${file} - ${testCase.name} with ${testCase.regex}`, () => {
        const regex = (regexes as any)[testCase.regex];
        expect(regex, `Regex '${testCase.regex}' not found in regex.ts`).to.exist;

        const match = testCase.input.match(regex);

        if (testCase.shouldMatch) {
          expect(match, `Expected a match for input: "${testCase.input}"`).to.not.be.null;
          if (testCase.expectedCaptures) {
            const actualCaptures = match!.slice(1);
            for (const expected of testCase.expectedCaptures) {
                const actual = actualCaptures[expected.index - 1];
                const expectedValue = expected.value === 'undefined' ? undefined : expected.value;
                expect(actual).to.deep.equal(expectedValue, `Group ${expected.index} did not match`);
            }
          }
        } else {
          expect(match, `Expected no match for input: "${testCase.input}"`).to.be.null;
        }
      });
    }
  }
});

interface TestCase {
  name: string;
  input: string;
  regex: string;
  shouldMatch: boolean;
  expectedCaptures?: { index: number; value: string | undefined }[];
}

function parseFixtures(content: string): TestCase[] {
  const tests: TestCase[] = [];
  const lines = content.split('\n');

  let currentName: string | null = null;
  let currentInput: string | null = null;
  let inSrcBlock = false;
  let srcContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#+NAME:')) {
      currentName = line.replace('#+NAME:', '').trim();
      continue;
    }

    if (line.startsWith('#+BEGIN_SRC')) {
      inSrcBlock = true;
      srcContent = [];
      continue;
    }

    if (line.startsWith('#+END_SRC')) {
      inSrcBlock = false;
      currentInput = srcContent.join('\n');
      continue;
    }

    if (inSrcBlock) {
      srcContent.push(line);
      continue;
    }

    if (line.startsWith('#+RESULTS:')) {
      if (currentName && currentInput !== null) {
        const regex = line.replace('#+RESULTS:', '').trim();
        let shouldMatch = true;
        const expectedCaptures: { index: number; value: string | undefined }[] = [];

        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith('#+NAME:') && !lines[j].startsWith('#+BEGIN_SRC') && !lines[j].startsWith('#+RESULTS:')) {
          const resultsLine = lines[j].trim();
          if (resultsLine === 'no-match') {
            shouldMatch = false;
            break;
          }
          if (resultsLine.startsWith('|')) {
            const parts = resultsLine.split('|').map(s => s.trim()).filter(Boolean);
            if (parts.length === 2 && parts[0] !== 'Group #') {
              const index = parseInt(parts[0], 10);
              const value = parts[1];
              expectedCaptures.push({ index, value });
            }
          }
          j++;
        }

        tests.push({
          name: currentName,
          input: currentInput,
          regex,
          shouldMatch,
          expectedCaptures: shouldMatch && expectedCaptures.length > 0 ? expectedCaptures : undefined,
        });
      }
    }
  }

  return tests;
}