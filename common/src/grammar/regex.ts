// src/grammar/regex.ts
// Centralized Org Mode regex definitions for grammar, tests, and codegen
// All regex patterns used in the TextMate grammar are defined here as the single source of truth

/**
 * Interface for regex patterns used in TextMate grammar
 */
export interface RegexPattern {
  /** The native JavaScript RegExp object */
  regex: RegExp;
  /** The source string for TextMate grammar injection */
  source: string;
  /** Make it compatible with string usage */
  toString(): string;
}

/**
 * Create a regex pattern with both native RegExp and source string
 * For case-insensitive patterns, adds (?i) prefix for TextMate compatibility
 */
function createRegexPattern(regex: RegExp): RegexPattern {
  let source = regex.source;

  // Add TextMate inline flags if needed
  if (regex.flags.includes('i')) {
    source = `(?i)${source}`;
  }
  if (regex.flags.includes('m')) {
    source = `(?m)${source}`;
  }
  if (regex.flags.includes('s')) {
    source = `(?s)${source}`;
  }

  return {
    regex,
    source,
    toString: () => source
  };
}

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
export const starsFragment = createRegexPattern(/(\*+)\s+/); // 1. stars (any level)
export const starsLevel1Fragment = createRegexPattern(/(\*)\s+/); // 1. stars (level 1)
export const starsLevel2Fragment = createRegexPattern(/(\*{2})\s+/); // 1. stars (level 2)
export const starsLevel3Fragment = createRegexPattern(/(\*{3})\s+/); // 1. stars (level 3)
export const starsLevel4Fragment = createRegexPattern(/(\*{4})\s+/); // 1. stars (level 4)
export const starsLevel5Fragment = createRegexPattern(/(\*{5})\s+/); // 1. stars (level 5)
export const starsLevel6Fragment = createRegexPattern(/(\*{6,})\s+/); // 1. stars (level 6+)
export const todoFragment = createRegexPattern(/(?:(TODO|DONE|WAITING|NEXT|COMMENT)\s+)?/); // 2. todo keyword
export const priorityFragment = createRegexPattern(/(?:(\[#([A-Z0-9])\])\s*)?/); // 3. priority block, 4. letter
export const headlineTextFragment = createRegexPattern(/(.*?)/); // 5. headline text (non-greedy, can be empty)
export const cookieFragment = createRegexPattern(/(?:\s+(\[[0-9/%]+\]))?/); // 6. progress/cookie
export const tagsFragment = createRegexPattern(/(?:\s*(:[^ \t:][^ \t]*:))?/); // 7. tags (allowing special chars)

// Compose full headline regex for each level
export const headlineDetectRegex = createRegexPattern(/^(\*+\s+.*)/);
export const headlineDetectToCloseBlockRegex = createRegexPattern(/(?=^\*+\s)/);
// Match a single-star Org headline with all possible elements
export const headlineLevel1Regex = createRegexPattern(new RegExp(`^${(starsLevel1Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`));
export const headlineLevel2Regex = createRegexPattern(new RegExp(`^${(starsLevel2Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`));
export const headlineLevel3Regex = createRegexPattern(new RegExp(`^${(starsLevel3Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`));
export const headlineLevel4Regex = createRegexPattern(new RegExp(`^${(starsLevel4Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`));
export const headlineLevel5Regex = createRegexPattern(new RegExp(`^${(starsLevel5Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`));
export const headlineLevel6Regex = createRegexPattern(new RegExp(`^${(starsLevel6Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`));
// #endregion HEADLINES

// #region LISTS
/**
 * Lists - ordered, unordered, description
 */
export const unorderedListRegex = createRegexPattern(/^(\s*)([-+])\s+(?:\[( |X|-)\])?/);
export const orderedListRegex = createRegexPattern(/^(\s*)(\d+[.)])\s+(?:\[( |X|-)\])?/);
// This regex is used inside an unordered list to find the description separator.
export const descriptionSeparatorRegex = createRegexPattern(/(.*?)\s*(::)\s*/);
// This regex is used inside an ordered list to find a counter.
export const listCounterRegex = createRegexPattern(/\[@(\d+)\]/);
// #endregion LISTS

// #region HORIZONTAL_RULES
/**
 * Horizontal rules
 */
export const horizontalRuleRegex = createRegexPattern(/^(\s*)(-{5,})\s*$/);
// #endregion HORIZONTAL_RULES

// #region BLOCKS
/**
 * Block parameters
 */
export const blockParameterRegex = createRegexPattern(/(:[a-zA-Z0-9_-]+)\s+((?:"[^"]*"|'[^']*'|[^\s:]+))/);

/**
 * Standard Blocks - Verbatim (no inline markup)
 */
export const standardBlockVerbatimBeginRegex = createRegexPattern(/^(\s*)(#\+BEGIN_)(COMMENT|EXAMPLE)(?: (.*))?$/i);
export const standardBlockVerbatimEndRegex = createRegexPattern(/^(\s*)(#\+END_)(\3)\s*$/i);

/**
 * Standard Blocks - Markup (allows inline markup)
 */
export const standardBlockMarkupBeginRegex = createRegexPattern(/^(\s*)(#\+BEGIN_)(QUOTE|CENTER|VERSE)(?: (.*))?$/i);
export const standardBlockMarkupEndRegex = createRegexPattern(new RegExp(`^(\\s*)(#\\+END_)(\\3)\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`, 'i'));

/**
 * Source Code Blocks
 */
export const srcBlockBeginRegex = createRegexPattern(/^(\s*)(#\+BEGIN_SRC)[ \t]*(.*)$/i);
export const srcBlockEndRegex = createRegexPattern(new RegExp(`^(\\s*)(#\\+END_SRC)\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`, 'i'));
export const srcBlockWhileRegex = createRegexPattern(new RegExp(`^(?!\\s*#\\+END_SRC|${(headlineDetectToCloseBlockRegex as any).regex.source})`, 'i'));

export const srcSwitchRegex = createRegexPattern(/(?:^|\s)([-+][a-zA-Z0-9]+(?:\s+"[^"]*")?)/);

/**
 * Customized Blocks
 */
export const customizedBlockBeginRegex = createRegexPattern(/^(\s*)(#\+BEGIN_)([a-zA-Z0-9_-]+)(?: (.*))?$/i);
export const customizedBlockEndRegex = createRegexPattern(/^(\s*)(#\+END_)(\3)\s*$/i);
export const customizedBlockWhileRegex = createRegexPattern(/^(\s*)(#\+END_)(\3)\s*$/i);

/**
 * Dynamic Blocks
 */
export const dynamicBlockBeginRegex = createRegexPattern(/^(\s*)(#\+BEGIN:)\s+([a-zA-Z0-9_-]+)(?: (.*))?$/i);
export const dynamicBlockEndRegex = createRegexPattern(new RegExp(`^(\\s*)(#\\+END:)\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`, 'i'));
// #endregion BLOCKS

// #region KEYWORD
/**
 * Keywords - matches org-mode keywords like #+TITLE: value
 */
export const keywordRegex = createRegexPattern(/^\s*(#\+([^:]+):)\s*(.*)\s*$/);
// #endregion KEYWORD


// #region DRAWERS
/**
 * Drawers - General purpose, excludes PROPERTIES
 */
export const genericDrawerBeginRegex = createRegexPattern(/^\s*:(?!END|PROPERTIES)([A-Z_]+):\s*$/i);

// #region PROPERTIES
/**
 * Matches the beginning of a properties drawer.
 */
export const propertyDrawerBeginRegex = createRegexPattern(
  /^\s*:PROPERTIES:\s*$/i
);

/**
 * Matches a single property line.
 * Capture groups:
 * 1. Key (e.g., "Owner")
 * 2. Value (e.g., "Alice")
 */
export const propertyRegex = createRegexPattern(
  /^\s*:([a-zA-Z0-9_+-]+):(?:[ \t]+(.*))?[ \t]*$/
);
// #endregion PROPERTIES

export const drawerEndRegex = createRegexPattern(new RegExp(`^\\s*:END:\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`, 'i'));
// #endregion DRAWERS


// #region TIMESTAMPS
// =================================================================
// Timestamps
// =================================================================

// Matches a single active timestamp. The negative lookbehind ensures it's not the end of a range.
export const timestampActiveRegex = createRegexPattern(/<\d{4}-\d{2}-\d{2}[^>]*?(?<!-->)>/);

// Matches a single inactive timestamp. The negative lookbehind ensures it's not the end of a range.
export const timestampInactiveRegex = createRegexPattern(/\[\d{4}-\d{2}-\d{2}[^\]]*?(?<!--)\]/);

// Matches a full active timestamp range.
export const timestampActiveRangeRegex = createRegexPattern(/<\d{4}-\d{2}-\d{2}[^>]*>--<\d{4}-\d{2}-\d{2}[^>]*>/);

// Matches a full inactive timestamp range.
export const timestampInactiveRangeRegex = createRegexPattern(/\[\d{4}-\d{2}-\d{2}[^\]]*\]--\[\d{4}-\d{2}-\d{2}[^\]]*\]/);
// #endregion TIMESTAMPS

// #region PLANNING_LINES
/**
 * Planning lines - SCHEDULED, DEADLINE, CLOSED
 * Uses dedicated timestamp patterns for better accuracy
 */
export const planningLineRegex = createRegexPattern(new RegExp(
  `^\\s*(SCHEDULED|DEADLINE|CLOSED):\\s*(${timestampActiveRangeRegex.source}|${timestampActiveRegex.source}|${timestampInactiveRangeRegex.source}|${timestampInactiveRegex.source})\\s*$`,
  'i'
));
// #endregion PLANNING_LINES


// #region LINKS
/**
 * Matches a standard Org Mode link, e.g., [[target][description]].
 * This regex is designed to be used with nested patterns.
 * Capture groups:
 * 1. Begin punctuation `[[`
 * 2. Link target
 * 3. Separator `][` (optional)
 * 4. Description (optional)
 * 5. End punctuation `]]`
 */
export const linkRegex = createRegexPattern(
  /(\[\[)(.*?)(?:(\]\[)(.*?))?(\]\])/
);

/**
 * Matches the protocol part of a link target.
 */
export const linkProtocolRegex = createRegexPattern(
  /\b([a-zA-Z0-9_+-]+):/
);

/**
 * Matches a link abbreviation definition, e.g., #+LINK: key url.
 * Capture groups:
 * 1. Leading whitespace
 * 2. The `#+LINK:` keyword
 * 3. The abbreviation key (e.g., "gh")
 * 4. The URL template (e.g., "https://github.com/%s")
 */
export const linkAbbreviationRegex = createRegexPattern(
  /^(\s*)(#\+LINK:)\s+([a-zA-Z0-9_-]+)\s+(.*)$/i
);
// #endregion LINKS

/**
 * Tables
 */
export const tableRegex = createRegexPattern(/^\s*\|.*\|$/);

/**
 * Footnotes
 */
export const footnoteDefinitionRegex = createRegexPattern(/^\[fn:([^\]]+)\]/);
export const footnoteReferenceRegex = createRegexPattern(/\[fn:([^\]]+)\]/);

/**
 * Paragraphs
 */
export const paragraphBeginRegex = createRegexPattern(/^(?=\S)/);
export const paragraphEndRegex = createRegexPattern(/^\s*$/);

/**
 * Inline markup
 */
export const boldRegex = createRegexPattern(/(\*)[^\s*](.*?)[^\s*](\*)/);
export const italicRegex = createRegexPattern(/(\/)[^\s\/](.*?)[^\s\/](\/)/);
export const underlineRegex = createRegexPattern(/(_)[^\s_](.*?)[^\s_](_)/);
export const strikethroughRegex = createRegexPattern(/(\+)[^\s+](.*?[^\s+])(\+)/);
export const codeRegex = createRegexPattern(/(~)[^\s~](.*?)[^\s~](~)/);
export const verbatimRegex = createRegexPattern(/(=)[^\s=](.*?)[^\s=](=)/);

/**
 * LaTeX
 */
export const latexRegex = createRegexPattern(/(\$)[^$\n]+?(\$)|(\\[(])[^\n]+?(\\[)])|(\\[\[])[^\n]+?(\\[\]])/);

/**
 * Entities and subscripts/superscripts
 */
export const entitiesRegex = createRegexPattern(/\\[a-zA-Z]+(\{\})?/);
export const subSuperScriptRegex = createRegexPattern(/[_^](\{[^}]+\}|\S)/);
