import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Grammar Scope Naming', () => {
  const grammarPath = path.join(__dirname, '../../syntaxes/org.tmLanguage.json');
  const allowedPrefixes = [
    'markup.', 'meta.', 'source.', 'comment.', 'string.', 'constant.', 'entity.', 'punctuation.'
  ];
  const allowedIncludes = [
    'source.', 'text.', 'meta.', 'markup.', 'comment.', 'string.', 'constant.', 'entity.', 'punctuation.'
  ];

  function isAllowedScope(scope: string) {
    return allowedPrefixes.some(prefix => scope.startsWith(prefix));
  }
  function isAllowedInclude(scope: string) {
    return allowedIncludes.some(prefix => scope.startsWith(prefix));
  }

  function checkGrammarScopes(grammar: any) {
    const problems: string[] = [];
    function checkPatterns(patterns: any[], parent: string) {
      for (const pat of patterns) {
        if (pat.name && !isAllowedScope(pat.name)) {
          problems.push(`[name] ${parent}: ${pat.name}`);
        }
        if (pat.contentName && !isAllowedScope(pat.contentName)) {
          problems.push(`[contentName] ${parent}: ${pat.contentName}`);
        }
        if (pat.patterns) {
          checkPatterns(pat.patterns, `${parent}/${pat.name || pat.contentName || 'unnamed'}`);
        }
        if (pat.include && typeof pat.include === 'string') {
          if (pat.include.startsWith('#')) {
            continue;
          }
          if (!isAllowedInclude(pat.include)) {
            problems.push(`[include] ${parent}: ${pat.include}`);
          }
        }
      }
    }
    if (grammar.patterns) { checkPatterns(grammar.patterns, 'root'); }
    if (grammar.repository) {
      for (const key of Object.keys(grammar.repository)) {
        const repo = grammar.repository[key];
        if (repo.patterns) { checkPatterns(repo.patterns, `repository.${key}`); }
      }
    }
    return problems;
  }
  it('should have only standard and theme-compatible scopes and includes', () => {
    if (!fs.existsSync(grammarPath)) {
      throw new Error('org.tmLanguage.json not found. Please build grammar first.');
    }
    const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
    const problems = checkGrammarScopes(grammar);
    expect(problems.length).toBe(0);
  });
});
