// src/grammar/regex.ts
// Centralized Org Mode regex definitions for grammar, tests, and codegen
// All regex patterns used in the TextMate grammar are defined here as the single source of truth

/**
 * Headlines - matches org-mode headlines with various elements
 * Capture groups:
 * 1. stars (*, **, ***, etc.)
 * 2. todo keyword (TODO, DONE, WAITING, NEXT, COMMENT)
 * 3. priority block ([#A], [#B], [#C])
 * 4. priority letter (A, B, C)
 * 5. headline text (main title)
 * 6. progress/cookie ([1/3], [50%], etc.)
 * 7. tags (:tag1:tag2:)
 */
export const headlineDetectRegex = '^(\\*+\\s+.*)';
// Match a single-star Org headline with all possible elements
export const headlineLevel1Regex =
  '^(\\*)\\s+' +                                // 1. Capture stars (headline level), require at least one space after
  '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?' + // 2. Optionally capture a TODO keyword, followed by space
  '(?:(\\[#([A-Z0-9])\\])\\s*)?' +              // 3. Optionally capture a priority block [#A], 4. and its letter
  '(.*?)' +                                     // 5. Capture headline text (can be empty, non-greedy)
  '(?:\\s+(\\[[0-9/%]+\\]))?' +                 // 6. Optionally capture progress/cookie like [1/3] or [50%]
  '(?:\\s*(:[^ \\t:][^ \\t]*:))?' +             // 7. Optionally capture tags (allowing special characters), leading spaces allowed
  '\\s*$';                                      // Match trailing spaces and end of line
export const headlineLevel2Regex =
  '^(\\*{2})\\s+' +                             // 1. Capture stars (headline level), require at least one space after
  '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?' + // 2. Optionally capture a TODO keyword, followed by space
  '(?:(\\[#([A-Z0-9])\\])\\s*)?' +              // 3. Optionally capture a priority block [#A], 4. and its letter
  '(.*?)' +                                     // 5. Capture headline text (can be empty, non-greedy)
  '(?:\\s+(\\[[0-9/%]+\\]))?' +                 // 6. Optionally capture progress/cookie like [1/3] or [50%]
  '(?:\\s*(:[^ \\t:][^ \\t]*:))?' +             // 7. Optionally capture tags (allowing special characters), leading spaces allowed
  '\\s*$';                                      // Match trailing spaces and end of line
export const headlineLevel3Regex =
  '^(\\*{3})\\s+' +                             // 1. Capture stars (headline level), require at least one space after
  '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?' + // 2. Optionally capture a TODO keyword, followed by space
  '(?:(\\[#([A-Z0-9])\\])\\s*)?' +              // 3. Optionally capture a priority block [#A], 4. and its letter
  '(.*?)' +                                     // 5. Capture headline text (can be empty, non-greedy)
  '(?:\\s+(\\[[0-9/%]+\\]))?' +                 // 6. Optionally capture progress/cookie like [1/3] or [50%]
  '(?:\\s*(:[^ \\t:][^ \\t]*:))?' +             // 7. Optionally capture tags (allowing special characters), leading spaces allowed
  '\\s*$';                                      // Match trailing spaces and end of line
export const headlineLevel4Regex =
  '^(\\*{4})\\s+' +                             // 1. Capture stars (headline level), require at least one space after
  '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?' + // 2. Optionally capture a TODO keyword, followed by space
  '(?:(\\[#([A-Z0-9])\\])\\s*)?' +              // 3. Optionally capture a priority block [#A], 4. and its letter
  '(.*?)' +                                     // 5. Capture headline text (can be empty, non-greedy)
  '(?:\\s+(\\[[0-9/%]+\\]))?' +                 // 6. Optionally capture progress/cookie like [1/3] or [50%]
  '(?:\\s*(:[^ \\t:][^ \\t]*:))?' +             // 7. Optionally capture tags (allowing special characters), leading spaces allowed
  '\\s*$';                                      // Match trailing spaces and end of line
export const headlineLevel5Regex =
  '^(\\*{5})\\s+' +                             // 1. Capture stars (headline level), require at least one space after
  '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?' + // 2. Optionally capture a TODO keyword, followed by space
  '(?:(\\[#([A-Z0-9])\\])\\s*)?' +              // 3. Optionally capture a priority block [#A], 4. and its letter
  '(.*?)' +                                     // 5. Capture headline text (can be empty, non-greedy)
  '(?:\\s+(\\[[0-9/%]+\\]))?' +                 // 6. Optionally capture progress/cookie like [1/3] or [50%]
  '(?:\\s*(:[^ \\t:][^ \\t]*:))?' +             // 7. Optionally capture tags (allowing special characters), leading spaces allowed
  '\\s*$';                                      // Match trailing spaces and end of line
export const headlineLevel6Regex =
  '^(\\*{6,})\\s+' +                             // 1. Capture stars (headline level), require at least one space after
  '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?' + // 2. Optionally capture a TODO keyword, followed by space
  '(?:(\\[#([A-Z0-9])\\])\\s*)?' +              // 3. Optionally capture a priority block [#A], 4. and its letter
  '(.*?)' +                                     // 5. Capture headline text (can be empty, non-greedy)
  '(?:\\s+(\\[[0-9/%]+\\]))?' +                 // 6. Optionally capture progress/cookie like [1/3] or [50%]
  '(?:\\s*(:[^ \\t:][^ \\t]*:))?' +             // 7. Optionally capture tags (allowing special characters), leading spaces allowed
  '\\s*$';                                      // Match trailing spaces and end of line

/**
 * Keywords - matches org-mode keywords like #+TITLE: value
 */
export const keywordRegex = '^\\s*(#\\+([A-Z_]+):)\\s*(.*)';

/**
 * Blocks - various org-mode block patterns
 */
export const quoteBlockBeginRegex = '(?i)^#\\+BEGIN_QUOTE';
export const quoteBlockEndRegex = '(?i)^#\\+END_QUOTE';
export const exampleBlockBeginRegex = '(?i)^#\\+BEGIN_EXAMPLE';
export const exampleBlockEndRegex = '(?i)^#\\+END_EXAMPLE';
export const verseBlockBeginRegex = '(?i)^#\\+BEGIN_VERSE';
export const verseBlockEndRegex = '(?i)^#\\+END_VERSE';
export const centerBlockBeginRegex = '(?i)^#\\+BEGIN_CENTER';
export const centerBlockEndRegex = '(?i)^#\\+END_CENTER';
export const commentBlockBeginRegex = '(?i)^#\\+BEGIN_COMMENT';
export const commentBlockEndRegex = '(?i)^#\\+END_COMMENT';

/**
 * Drawers - PROPERTIES, LOGBOOK, etc.
 */
export const drawerBeginRegex = '^\\s*:(PROPERTIES|LOGBOOK):\\s*$';
export const drawerEndRegex = '^\\s*:END:\\s*$';

/**
 * Lists - ordered, unordered, description
 */
export const unorderedListRegex = '^(\\s*)([-+])\\s+(?:\\[( |X|-)\\])?';
export const orderedListRegex = '^(\\s*)(\\d+[.)])\\s+(?:\\[( |X|-)\\])?';
export const descriptionListRegex = '^(\\s*).+?\\s*::\\s*';

/**
 * Tables
 */
export const tableRegex = '^\\s*\\|.*\\|$';

/**
 * Horizontal rules
 */
export const horizontalRuleRegex = '^\\s*-{5,}\\s*$';

/**
 * Footnotes
 */
export const footnoteDefinitionRegex = '^\\[fn:([^\\]]+)\\]';
export const footnoteReferenceRegex = '\\[fn:([^\\]]+)\\]';

/**
 * Paragraphs
 */
export const paragraphBeginRegex = '^(?=\\S)';
export const paragraphEndRegex = '^\\s*$';

/**
 * Links
 */
export const linkRegex = '(\\[\\[)([^]]+?)(?:(?:\\]\\[)([^]]+?))?()';

/**
 * Timestamps
 */
export const timestampActiveRegex = '<[0-9]{4}-[0-9]{2}-[0-9]{2}.*?>';
export const timestampInactiveRegex = '\\[[0-9]{4}-[0-9]{2}-[0-9]{2}.*?\\]';

/**
 * Inline markup
 */
export const boldRegex = '(\\*)[^\\s*](.*?)[^\\s*](\\*)';
export const italicRegex = '(/)[^\\s/](.*?)[^\\s/](/)';
export const underlineRegex = '(_)[^\\s_](.*?)[^\\s_](_)';
export const strikethroughRegex = '(\\+)[^\\s+](.*?[^\\s+])(\\+)';
export const codeRegex = '(~)[^\\s~](.*?)[^\\s~](~)';
export const verbatimRegex = '(=)[^\\s=](.*?)[^\\s=](=)';

/**
 * LaTeX
 */
export const latexRegex = '(\\$)[^$\\n]+?(\\$)|(\\\\[(])[^\\n]+?(\\\\[)])|(\\\\[\\[])[^\\n]+?(\\\\[\\]])';

/**
 * Entities and subscripts/superscripts
 */
export const entitiesRegex = '\\\\[a-zA-Z]+(\\{\\})?';
export const subSuperScriptRegex = '[_^]({[^}]+}|\\\\S)';
