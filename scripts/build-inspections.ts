import fs from 'fs-extra';
import path from 'path';

const fixturesDir = path.resolve(__dirname, '../test/fixtures');
// Integration tests read from test/inspections
const inspectionsDir = path.resolve(__dirname, '../test/inspections');

async function buildInspections() {
  await fs.ensureDir(inspectionsDir);
  await fs.emptyDir(inspectionsDir);

  const fixtureFiles = await fs.readdir(fixturesDir);

  for (const fixtureFile of fixtureFiles) {
    if (path.extname(fixtureFile) !== '.org') {
      continue;
    }

    const fixturePath = path.join(fixturesDir, fixtureFile);
    const inspectionPath = path.join(inspectionsDir, fixtureFile.replace('.org', '.inspection.org'));

    const content = await fs.readFile(fixturePath, 'utf-8');
    const compiledContent = compileFixture(content, fixtureFile);

    await fs.writeFile(inspectionPath, compiledContent);
  }
}

function compileFixture(content: string, originalFilename: string): string {
  const lines = content.split('\n');
  let compiledLines: string[] = [];
  let currentHeadlineLevel = 0;

  const fileTitleMatch = content.match(/^#\+TITLE: (.+)$/m);
  const fileTitle = fileTitleMatch ? fileTitleMatch[1] : 'Untitled Test Suite';

  compiledLines.push(`#+TITLE: Inspection for ${originalFilename} (Auto-Generated)`);
  compiledLines.push(`# DO NOT EDIT. Run 'pnpm build:inspections' to regenerate.`);
  compiledLines.push('');
  compiledLines.push(`* Fixture: ${originalFilename}`);
  compiledLines.push(`#+DESCRIPTION: ${fileTitle}`);
  compiledLines.push('');


  let isOrgBlock = false;
  let srcContent: string[] = [];
  let testName: string | null = null;
  let testDescription: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.trim().toLowerCase();

    if (lower.startsWith('#+name:')) {
      testName = line.replace(/^\s*#\+name:/i, '').trim();
      continue;
    }

    if (lower.startsWith('#+description:')) {
      testDescription = line.replace(/^\s*#\+description:/i, '').trim();
      continue;
    }

    // Only process begin_fixture (ignore case)

    if (lower.startsWith('#+begin_fixture')) {
      isOrgBlock = true;
      continue;
    }

    if (lower.startsWith('#+end_fixture')) {
      isOrgBlock = false;
      continue;
    }

    // Check for #+EXPECTED: and see if the next non-empty, non-table line is 'no-match'
    if (lower.startsWith('#+expected') && testName) {
      // Look ahead for 'no-match' (skip empty and table lines)
      let j = i + 1;
      let foundNoMatch = false;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine === '') { j++; continue; }
        if (nextLine.startsWith('|')) { j++; continue; }
        if (nextLine.toLowerCase() === 'no-match') { foundNoMatch = true; break; }
        break;
      }
      if (!foundNoMatch) {
        const parentLevel = currentHeadlineLevel + 1;
        compiledLines.push(`${'*'.repeat(parentLevel)} Test: ${testName}`);
        if (testDescription) {
          compiledLines.push(`  #+DESCRIPTION: ${testDescription}`);
        }
        const transformedSrc = transformSrcContent(srcContent.join('\n'), parentLevel);
        compiledLines.push(transformedSrc);
        compiledLines.push('');
      }
      srcContent = [];
      testName = null;
      testDescription = null;
      continue;
    }

    if (isOrgBlock) {
      srcContent.push(line);
    } else if (line.match(/^(\*{1,6}) /)) {
      const match = line.match(/^(\*{1,6}) /)!;
      currentHeadlineLevel = match[1].length;
      compiledLines.push(`${'*'.repeat(currentHeadlineLevel + 1)}${line.substring(currentHeadlineLevel)}`);
    } else if (!lower.startsWith('#+expected') &&
               !line.startsWith('|') &&
               !lower.startsWith('#+property') &&
               lower !== 'no-match'
              ) {
      compiledLines.push(line);
    }
  }

  return compiledLines.join('\n');
}

function transformSrcContent(content: string, parentLevel: number): string {
  const lines = content.split('\n');
  const transformed: string[] = [];
  let currentSublevel = 0;

  for (const line of lines) {
    const headlineMatch = line.match(/^(\*{1,6}) /);
    if (headlineMatch) {
      const level = headlineMatch[1].length;
      currentSublevel = level;
      const newLevel = parentLevel + level;
      transformed.push(`${'*'.repeat(newLevel)}${line.substring(level)}`);
    } else {
      const indent = '  '.repeat(currentSublevel);
      transformed.push(`${indent}${line}`);
    }
  }
  return transformed.join('\n');
}

buildInspections().catch(console.error);
