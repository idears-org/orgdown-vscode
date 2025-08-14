import fs from 'fs-extra';
import path from 'path';

const fixturesDir = path.resolve(__dirname, '../test/fixtures');
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
  const fileTitleMatch = content.match(/^#\\+TITLE: (.+)$/m);
  const fileTitle = fileTitleMatch ? fileTitleMatch[1] : 'Untitled Test Suite';

  const header = [
    `#+TITLE: Inspection for ${originalFilename} (Auto-Generated)`,
    `# DO NOT EDIT. Run \\'pnpm build:inspections\\' to regenerate.`,
    '',
    `* Fixture: ${originalFilename}`,
    `#+DESCRIPTION: ${fileTitle}`,
    '',
  ].join('\\n');

  // 1. Clean Pass: Use a regex to find and remove all unit test blocks.
  const unitTestRegex = /\\n\* 2. Unit Test Cases[\\s\\S]*/;
  const integrationContent = content.replace(unitTestRegex, '');

  return header + '\\n' + integrationContent;
}

buildInspections().catch(console.error);
