// src/grammar/regex.ts
// Centralized Org Mode regex definitions for grammar, tests, and codegen
// All regex patterns used in the TextMate grammar are defined here as the single source of truth

// #region HEADLINES
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
// Atomic regex fragments for Org headlines
export const starsFragment = '(\\*+)\\s+'; // 1. stars (any level)
export const starsLevel1Fragment = '(\\*)\\s+'; // 1. stars (level 1)
export const starsLevel2Fragment = '(\\*{2})\\s+'; // 1. stars (level 2)
export const starsLevel3Fragment = '(\\*{3})\\s+'; // 1. stars (level 3)
export const starsLevel4Fragment = '(\\*{4})\\s+'; // 1. stars (level 4)
export const starsLevel5Fragment = '(\\*{5})\\s+'; // 1. stars (level 5)
export const starsLevel6Fragment = '(\\*{6,})\\s+'; // 1. stars (level 6+)
export const todoFragment = '(?:(TODO|DONE|WAITING|NEXT|COMMENT)\\s+)?'; // 2. todo keyword
export const priorityFragment = '(?:(\\[#([A-Z0-9])\\])\\s*)?'; // 3. priority block, 4. letter
export const headlineTextFragment = '(.*?)'; // 5. headline text (non-greedy, can be empty)
export const cookieFragment = '(?:\\s+(\\[[0-9/%]+\\]))?'; // 6. progress/cookie
export const tagsFragment = '(?:\\s*(:[^ \\t:][^ \\t]*:))?'; // 7. tags (allowing special chars)

// Compose full headline regex for each level
export const headlineDetectRegex = `^(\\*+\\s+.*)`;
// Match a single-star Org headline with all possible elements
export const headlineLevel1Regex = `^${starsLevel1Fragment}${todoFragment}${priorityFragment}${headlineTextFragment}${cookieFragment}${tagsFragment}\\s*$`;
export const headlineLevel2Regex = `^${starsLevel2Fragment}${todoFragment}${priorityFragment}${headlineTextFragment}${cookieFragment}${tagsFragment}\\s*$`;
export const headlineLevel3Regex = `^${starsLevel3Fragment}${todoFragment}${priorityFragment}${headlineTextFragment}${cookieFragment}${tagsFragment}\\s*$`;
export const headlineLevel4Regex = `^${starsLevel4Fragment}${todoFragment}${priorityFragment}${headlineTextFragment}${cookieFragment}${tagsFragment}\\s*$`;
export const headlineLevel5Regex = `^${starsLevel5Fragment}${todoFragment}${priorityFragment}${headlineTextFragment}${cookieFragment}${tagsFragment}\\s*$`;
export const headlineLevel6Regex = `^${starsLevel6Fragment}${todoFragment}${priorityFragment}${headlineTextFragment}${cookieFragment}${tagsFragment}\\s*$`;
// #endregion HEADLINES

// #region LISTS
/**
 * Lists - ordered, unordered, description
 */
export const unorderedListRegex = '^(\\s*)([-+])\\s+(?:\\[( |X|-)\\])?';
export const orderedListRegex = '^(\\s*)(\\d+[.)])\\s+(?:\\[( |X|-)\\])?';
// This regex is used inside an unordered list to find the description separator.
export const descriptionSeparatorRegex = '(.*?)\\s*(::)\\s*';
// This regex is used inside an ordered list to find a counter.
export const listCounterRegex = '\\[@(\\d+)\\]';
// #endregion LISTS

// #region HORIZONTAL_RULES
/**
 * Horizontal rules
 */
export const horizontalRuleRegex = '^(\\s*)(-{5,})\\s*$';
// #endregion HORIZONTAL_RULES

// #region BLOCKS
/**
 * Block parameters
 */
export const blockParameterRegex = '(:[a-zA-Z0-9_-]+)\\s+((?:\\"[^\\"]*\\"|\'[^\']*\'|[^\\s:]+))';

/**
 * Standard Blocks - Verbatim (no inline markup)
 */
export const standardBlockVerbatimBeginRegex = '(?i)^(\\s*)(#\\+BEGIN_)(COMMENT|EXAMPLE)(?: (.*))?$';
export const standardBlockVerbatimEndRegex = '(?i)^(\\s*)(#\\+END_)(\\3)\\s*$';

/**
 * Standard Blocks - Markup (allows inline markup)
 */
export const standardBlockMarkupBeginRegex = '(?i)^(\\s*)(#\\+BEGIN_)(QUOTE|CENTER|VERSE)(?: (.*))?$';
export const standardBlockMarkupEndRegex = '(?i)^(\\s*)(#\\+END_)(\\3)\\s*$|(?=^\\*+\\s)';

/**
 * Source Code Blocks
 */
export const srcBlockBeginRegex = '(?i)^(\\s*)(#\\+BEGIN_SRC)[ \\t]*(.*)$';
export const srcBlockEndRegex = '(?i)^(\\s*)(#\\+END_SRC)\\s*$|(?=^\\*+\\s)';
export const srcBlockWhileRegex = '(?i)^(?!\\s*#\\+END_SRC|(?=^\\*+\\s))';

export const srcSwitchRegex = '(?i)([-+][a-zA-Z0-9]+(?:\\s+\\"[^\\"]*\\")?)';

/**
 * Customized Blocks
 */
export const customizedBlockBeginRegex = '(?i)^(\\s*)(#\\+BEGIN_)([a-zA-Z0-9_-]+)(?: (.*))?$';
export const customizedBlockEndRegex = '(?i)^(\\s*)(#\\+END_)(\\3)\\s*$';
export const customizedBlockWhileRegex = '(?i)^(\\s*)(#\\+END_)(\\3)\\s*$';

/**
 * Dynamic Blocks
 */
export const dynamicBlockBeginRegex = '(?i)^(\\s*)(#\\+BEGIN:)\\s+([a-zA-Z0-9_-]+)(?: (.*))?$';
export const dynamicBlockEndRegex = '(?i)^(\\s*)(#\\+END:)\\s*$';
// #endregion BLOCKS

/**
 * Keywords - matches org-mode keywords like #+TITLE: value
 */
export const keywordRegex = '^\\s*(#\\+([A-Z_]+):)\\s*(.*)';

/**
 * Drawers - PROPERTIES, LOGBOOK, etc.
 */
export const drawerBeginRegex = '^\\s*:(PROPERTIES|LOGBOOK):\\s*$';
export const drawerEndRegex = '^\\s*:END:\\s*$';

/**
 * Tables
 */
export const tableRegex = '^\\s*\\|.*\\|$';

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
