export interface FixtureTestResult {
  regex: string;
  shouldMatch: boolean;
  expectedCaptures?: { index: number; value: string }[];
}

// A FixtureTestCase represents one #+NAME block, which can contain multiple
// #+EXPECTED blocks (one-to-many testing).
export interface FixtureTestCase {
  name: string;
  input: string;
  results: FixtureTestResult[];
}

function parseExpectedBlock(lines: string[], startIndex: number): { results: FixtureTestResult[]; endIndex: number } {
  const allResults: FixtureTestResult[] = [];
  let currentIndex = startIndex;

  while (currentIndex < lines.length && lines[currentIndex].trim().toLowerCase().startsWith('#+expected:')) {
    const expectedLine = lines[currentIndex];
    const regexName = expectedLine.replace(/^\s*#\+expected:/i, '').trim();
    const tableLines: string[] = [];
    let shouldMatch = true;
    let blockEndIndex = currentIndex;

    for (let j = currentIndex + 1; j < lines.length; j++) {
      const line = lines[j].trim();
      if (line.startsWith('#+NAME:') || line.startsWith('#+BEGIN_FIXTURE') || line.startsWith('#+EXPECTED:')) {
        blockEndIndex = j - 1;
        break;
      }
      if (line.toLowerCase() === 'no-match') {
        shouldMatch = false;
      } else if (line.startsWith('|')) {
        tableLines.push(line);
      }
      blockEndIndex = j;
    }

    const expectedCaptures = tableLines
      .map(line => {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 3) {
          const groupNumStr = parts[1];
          if (groupNumStr !== 'Group #' && !isNaN(parseInt(groupNumStr, 10))) {
            return { index: parseInt(groupNumStr, 10), value: parts[2] };
          }
        }
        return null;
      })
      .filter((item): item is { index: number; value: string } => item !== null);

    allResults.push({
      regex: regexName,
      shouldMatch,
      expectedCaptures: shouldMatch ? expectedCaptures : undefined,
    });

    currentIndex = blockEndIndex + 1;
    while (currentIndex < lines.length && lines[currentIndex].trim() === '') {
      currentIndex++;
    }
  }

  return { results: allResults, endIndex: currentIndex - 1 };
}

export function parseFixtureFile(content: string): FixtureTestCase[] {
  const tests: FixtureTestCase[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim().toLowerCase().startsWith('#+name:')) {
      continue;
    }

    const testName = line.replace(/^\s*#\+name:/i, '').trim();
    const containerStartLine = i + 1;

    if (containerStartLine >= lines.length || !lines[containerStartLine].trim().toLowerCase().startsWith('#+begin_fixture')) {
      continue;
    }

    const contentStartIndex = containerStartLine + 1;
    let contentEndIndex = -1;

    for (let j = contentStartIndex; j < lines.length; j++) {
      if (lines[j].trim().toLowerCase().startsWith('#+end_fixture')) {
        contentEndIndex = j;
        break;
      }
    }

    if (contentEndIndex === -1) {
      continue; // Unmatched BEGIN_FIXTURE
    }

    const input = lines.slice(contentStartIndex, contentEndIndex).join('\n');
    i = contentEndIndex;

    let lookaheadIndex = i + 1;
    while (lookaheadIndex < lines.length && lines[lookaheadIndex].trim() === '') {
      lookaheadIndex++;
    }

    if (lookaheadIndex < lines.length && lines[lookaheadIndex].trim().toLowerCase().startsWith('#+expected:')) {
      const { results, endIndex } = parseExpectedBlock(lines, lookaheadIndex);
      // Create a test case for each result.
      for (const result of results) {
        tests.push({
          name: testName,
          input,
          results: [result],
        });
      }
      i = endIndex;
    }
  }

  return tests;
}
