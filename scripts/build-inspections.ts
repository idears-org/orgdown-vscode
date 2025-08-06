import fs from 'fs-extra';
import path from 'path';

const fixturesDir = path.resolve(__dirname, '../test/fixtures');
const inspectionsDir = path.resolve(__dirname, '../test/inspections');

async function buildInspections() {
  await fs.ensureDir(inspectionsDir);
  await fs.emptyDir(inspectionsDir);

  const fixtureFiles = await fs.readdir(fixturesDir);

  for (const fixtureFile of fixtureFiles) {
    if (path.extname(fixtureFile) !== '.org') continue;

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

  let inSrcBlock = false;
  let srcContent: string[] = [];
  let testName: string | null = null;
  let testDescription: string | null = null;

  for (const line of lines) {
    if (line.startsWith('#+NAME:')) {
      testName = line.replace('#+NAME: ', '').trim();
      continue;
    }

    if (line.startsWith('#+DESCRIPTION:')) {
      testDescription = line.replace('#+DESCRIPTION: ', '').trim();
      continue;
    }

    if (line.startsWith('#+BEGIN_SRC')) {
      inSrcBlock = true;
      continue;
    }

    if (line.startsWith('#+END_SRC')) {
      inSrcBlock = false;
      if (testName) {
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

    if (inSrcBlock) {
      srcContent.push(line);
    } else if (line.match(/^(\*{1,6}) /)) {
      const match = line.match(/^(\*{1,6}) /)!;
      currentHeadlineLevel = match[1].length;
      compiledLines.push(`${'*'.repeat(currentHeadlineLevel + 1)}${line.substring(currentHeadlineLevel)}`);
    } else if (!line.startsWith('#+RESULTS') && !line.startsWith('|') && !line.startsWith('#+PROPERTY')) {
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
