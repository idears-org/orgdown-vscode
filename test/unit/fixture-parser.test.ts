import { describe, it, expect } from 'vitest';
import { parseFixtureFile } from '@common/fixture-parser';

describe('Fixture Parser Unit Tests', () => {
  it('should parse a simple test case with a single result', () => {
    const content = `
#+NAME: A simple test
#+BEGIN_FIXTURE
* A headline
#+END_FIXTURE
#+EXPECTED: headlineLevel1Regex
| Group # | Expected Value |
|---------+----------------|
| 5       | A headline     |
    `;
    const testCases = parseFixtureFile(content);
    expect(testCases).toHaveLength(1);
    expect(testCases[0].name).toBe('A simple test');
    expect(testCases[0].input).toBe('* A headline');
    expect(testCases[0].results).toHaveLength(1);
    expect(testCases[0].results[0].regex).toBe('headlineLevel1Regex');
    expect(testCases[0].results[0].shouldMatch).toBe(true);
    expect(testCases[0].results[0].expectedCaptures).toEqual([{ index: 5, value: 'A headline' }]);
  });

  it('should handle a test case with no-match', () => {
    const content = `
#+NAME: A no-match test
#+BEGIN_FIXTURE
not a headline
#+END_FIXTURE
#+EXPECTED: headlineLevel1Regex
no-match
    `;
    const testCases = parseFixtureFile(content);
    expect(testCases).toHaveLength(1);
    expect(testCases[0].results[0].shouldMatch).toBe(false);
    expect(testCases[0].results[0].expectedCaptures).toBeUndefined();
  });

  it('should handle one-to-many results for a single input', () => {
    const content = `
#+NAME: One input, two results
#+BEGIN_FIXTURE
* A headline
#+END_FIXTURE
#+EXPECTED: headlineLevel1Regex
| 5 | A headline |
#+EXPECTED: headlineDetectRegex
| 1 | * A headline |
    `;
    const testCases = parseFixtureFile(content);
    expect(testCases).toHaveLength(2);
    expect(testCases[0].name).toBe('One input, two results');
    expect(testCases[1].name).toBe('One input, two results');
    expect(testCases[0].input).toBe('* A headline');
    expect(testCases[1].input).toBe('* A headline');
    expect(testCases[0].results[0].regex).toBe('headlineLevel1Regex');
    expect(testCases[1].results[0].regex).toBe('headlineDetectRegex');
  });

  it('should correctly parse content that looks like a delimiter', () => {
    const content = `
#+NAME: A nested test
#+BEGIN_FIXTURE
#+BEGIN_SRC python
print("hello")
#+END_SRC
#+END_FIXTURE
#+EXPECTED: someRegex
| 1 | some value |
    `;
    const testCases = parseFixtureFile(content);
    expect(testCases).toHaveLength(1);
    expect(testCases[0].input).toBe('#+BEGIN_SRC python\nprint("hello")\n#+END_SRC');
  });

  it('should handle blank lines between expected and end of fixture', () => {
    const content = `
#+NAME: Blank lines test
#+BEGIN_FIXTURE
Input text
#+END_FIXTURE


#+EXPECTED: someRegex
no-match
    `;
    const testCases = parseFixtureFile(content);
    expect(testCases).toHaveLength(1);
    expect(testCases[0].name).toBe('Blank lines test');
  });

  it('should return an empty array if no tests are found', () => {
    const content = `
* A regular org file

With no test cases.
    `;
    const testCases = parseFixtureFile(content);
    expect(testCases).toHaveLength(0);
  });
});
