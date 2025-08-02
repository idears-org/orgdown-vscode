// test/unit/colorization.test.ts
// Snapshot-based grammar regression test for Orgdown

// @ts-check
import * as assert from 'assert';
import * as vscode from 'vscode';
import { join, basename, dirname } from 'path';
import * as fs from 'fs';

function hasThemeChange(d: any, p: any) {
    let keys = Object.keys(d);
    for (let key of keys) {
        if (d[key] !== p[key]) {
            return true;
        }
    }
    return false;
}

function assertUnchangedTokens(testFixurePath: any, done: any) {
    let fileName = basename(testFixurePath);
    vscode.commands.executeCommand('_workbench.captureSyntaxTokens', vscode.Uri.file(testFixurePath)).then(data => {
        try {
            let resultsFolderPath = join(dirname(dirname(testFixurePath)), 'colorize-results');
            if (!fs.existsSync(resultsFolderPath)) {
                fs.mkdirSync(resultsFolderPath);
            }
            let resultPath = join(resultsFolderPath, fileName.replace('.', '_') + '.json');
            if (fs.existsSync(resultPath)) {
                let previousData = JSON.parse(fs.readFileSync(resultPath).toString());
                try {
                    assert.deepEqual(data, previousData);
                } catch (e) {
                    fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'), { flag: 'w' });
                    if (Array.isArray(data) && Array.isArray(previousData) && data.length === previousData.length) {
                        for (let i = 0; i < data.length; i++) {
                            let d = data[i];
                            let p = previousData[i];
                            if (d.c !== p.c || hasThemeChange(d.r, p.r)) {
                                throw e;
                            }
                        }
                        // different but no tokenization or color change: no failure
                    } else {
                        throw e;
                    }
                }
            } else {
                fs.writeFileSync(resultPath, JSON.stringify(data, null, '\t'));
            }
            done();
        } catch (e) {
            done(e);
        }
    }, done);
}

suite('colorization', () => {
    console.log('Colorization test suite started');
    // Always resolve fixtures from the project root, not the compiled output
    const extensionColorizeFixturePath = join(process.cwd(), 'test', 'colorize-fixtures');

    // 自动打开一个 org 文件，确保扩展被激活
    setup(async () => {
        const files = fs.readdirSync(extensionColorizeFixturePath).filter(f => f.endsWith('.org'));
        if (files.length > 0) {
            const doc = await vscode.workspace.openTextDocument(join(extensionColorizeFixturePath, files[0]));
            await vscode.window.showTextDocument(doc);
            console.log('Opened org file to activate extension:', files[0]);
        }
    });

    if (fs.existsSync(extensionColorizeFixturePath)) {
        let fixturesFiles = fs.readdirSync(extensionColorizeFixturePath);
        console.log('Found fixture files:', fixturesFiles);
        fixturesFiles.forEach(fixturesFile => {
            test(fixturesFile, function (done) {
                console.log('Running test for:', fixturesFile);
                assertUnchangedTokens(join(extensionColorizeFixturePath, fixturesFile), done);
            });
        });
    } else {
        console.log('No colorize-fixtures directory found');
    }
});
