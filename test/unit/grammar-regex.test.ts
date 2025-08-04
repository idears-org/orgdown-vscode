// grammar-regex.test.ts
// Automated regex group/scope mapping test for Orgdown

// This test suite scans all fixture files in test/colorize-fixtures/.
// Each fixture must contain a #+BEGIN_COMMENT block with parameters and test cases with expected groups, e.g.:
//   #+BEGIN_COMMENT :regex headlineRegex :description ...
//   ...
//   #+END_COMMENT
//
//   # Test Case 1: Simple headline
//   * Simple headline
//   # Expected groups: [1: "*", 2: undefined, 3: undefined, 4: undefined, 5: "Simple headline", 6: undefined]
//
// The script extracts test cases and their expected group mappings, then validates the regex matches correctly.

import fs from 'fs';
import path from 'path';
import * as regexes from '../../src/grammar/regex';
import assert from 'assert';

interface TestCase {
  name: string;
  input: string;
  expectedGroups: (string | undefined)[];
  regexName?: string;
}

suite('grammar-regex', () => {
  const fixturesDir = path.join(__dirname, '../colorize-fixtures');
  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => /^F\d{2}.*\.org$/.test(f));

  fixtureFiles.forEach(file => {
    const filePath = path.join(fixturesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Extract the #+BEGIN_COMMENT ... #+END_COMMENT block containing metadata
    const commentBlockMatch = content.match(/#\+BEGIN_COMMENT([^\n]*)\n([\s\S]*?)#\+END_COMMENT/);
    if (!commentBlockMatch) { return; }
    const blockParams = commentBlockMatch[1];

    // Parse the block parameters to extract the default regex name
    const regexParamMatch = blockParams.match(/:regex\s+(\w+)/);
    const defaultRegexName = regexParamMatch ? regexParamMatch[1] : undefined;

    // Extract test cases from the content after the comment block
    const testSection = content.replace(/#\+BEGIN_COMMENT[\s\S]*?#\+END_COMMENT\s*/, '');
    const testCases = parseTestCases(testSection);

    if (testCases.length === 0) { return; }

    test(`${file} [per-case regex]`, () => {
      testCases.forEach(testCase => {
        // Support per-test-case regex selection via # Use: <regexName> annotation
        const regexName = testCase.regexName || defaultRegexName;
        if (!regexName) {
          throw new Error(`No regex specified for test case "${testCase.name}" in ${file}`);
        }
        const regex = (regexes as any)[regexName];
        if (!regex) {
          throw new Error(`Regex "${regexName}" not found in regex.ts`);
        }
        const regexPattern = typeof regex === 'string' ? new RegExp(regex) : regex;

        const match = regexPattern.exec(testCase.input);
        assert(match, `No match for test case "${testCase.name}" [${regexName}]: ${testCase.input}`);

        // Validate each expected group
        testCase.expectedGroups.forEach((expectedValue, index) => {
          const actualValue = match[index];
          if (expectedValue === undefined) {
            assert(
              actualValue === undefined,
              `Test case "${testCase.name}" [${regexName}]: Group ${index} should be undefined, but got "${actualValue}"`
            );
          } else {
            assert(
              actualValue === expectedValue,
              `Test case "${testCase.name}" [${regexName}]: Group ${index} should be "${expectedValue}", but got "${actualValue}"`
            );
          }
        });
      });
    });
  });
});

function parseTestCases(content: string): TestCase[] {
  const testCases: TestCase[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for test case headers like "# Test Case 1: Simple headline"
    const testCaseMatch = line.match(/^# Test Case \d+: (.+)$/);
    if (testCaseMatch) {
      const testName = testCaseMatch[1];

      // The next non-empty, non-comment line should be the input
      let inputLine = '';
      let expectedGroupsLine = '';
      let regexName: string | undefined;

      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (!nextLine) {
          continue;
        }

        if (nextLine.startsWith('#')) {
          // Check for per-test-case regex annotation
          const useRegexMatch = nextLine.match(/^# Use:\s*(\w+)/);
          if (useRegexMatch) {
            regexName = useRegexMatch[1];
            continue;
          }
          // Check if this is an expected groups line
          if (nextLine.startsWith('# Expected groups:')) {
            expectedGroupsLine = nextLine;
            break;
          }
          // Skip other comment lines
          continue;
        } else {
          inputLine = nextLine;
        }
      }

      if (inputLine && expectedGroupsLine) {
        const expectedGroups = parseExpectedGroups(expectedGroupsLine);
        testCases.push({
          name: testName,
          input: inputLine,
          expectedGroups,
          regexName
        });
      }
    }
  }

  return testCases;
}

function parseExpectedGroups(line: string): (string | undefined)[] {
  // Parse line like: # Expected groups: [1: "*", 2: "TODO", 3: undefined, 4: "A", 5: "text", 6: ":tags:"]
  const match = line.match(/# Expected groups:\s*\[(.*)\]/);
  if (!match) {
    return [];
  }

  const groupsStr = match[1];
  const groups: (string | undefined)[] = [];

  // Split by commas, but be careful about commas inside quoted strings
  const parts = groupsStr.split(/,(?=\s*\d+:)/).map(part => part.trim());

  parts.forEach(part => {
    const groupMatch = part.match(/^(\d+):\s*(.+)$/);
    if (groupMatch) {
      const index = parseInt(groupMatch[1], 10);
      const value = groupMatch[2].trim();

      if (value === 'undefined') {
        groups[index] = undefined;
      } else {
        // Remove quotes if present
        groups[index] = value.replace(/^"(.*)"$/, '$1');
      }
    }
  });

  return groups;
}
