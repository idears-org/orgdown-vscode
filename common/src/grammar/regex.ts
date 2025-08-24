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
export const starsFragment = createRegexPattern(
  /(\*+)\s+/
); // 1. stars (any level)
export const starsLevel1Fragment = createRegexPattern(
  /(\*)\s+/
); // 1. stars (level 1)
export const starsLevel2Fragment = createRegexPattern(
  /(\*{2})\s+/
); // 1. stars (level 2)
export const starsLevel3Fragment = createRegexPattern(
  /(\*{3})\s+/
); // 1. stars (level 3)
export const starsLevel4Fragment = createRegexPattern(
  /(\*{4})\s+/
); // 1. stars (level 4)
export const starsLevel5Fragment = createRegexPattern(
  /(\*{5})\s+/
); // 1. stars (level 5)
export const starsLevel6Fragment = createRegexPattern(
  /(\*{6,})\s+/
); // 1. stars (level 6+)
export const todoFragment = createRegexPattern(
  /(?:(TODO|DONE|WAITING|NEXT|COMMENT)\s+)?/
); // 2. todo keyword
export const priorityFragment = createRegexPattern(
  /(?:(\[#([A-Z0-9])\])\s*)?/
); // 3. priority block, 4. letter
export const headlineTextFragment = createRegexPattern(
  /(.*?)/
); // 5. headline text (non-greedy, can be empty)
export const cookieFragment = createRegexPattern(
  /(?:\s+(\[[0-9/%]+\]))?/
); // 6. progress/cookie
export const tagsFragment = createRegexPattern(
  /(?:\s*(:[^ \t:][^ \t]*:))?/
); // 7. tags (allowing special chars)

// Compose full headline regex for each level
export const headlineDetectRegex = createRegexPattern(
  /^(\*+\s+.*)/
);
export const activeHeadlineDetectRegex = createRegexPattern(
  /^(\*+\s+(?!COMMENT\b|.*\s:ARCHIVE:).*)/i
);
export const inactiveHeadlineDetectRegex = createRegexPattern(
  /^(\*+\s+(?:COMMENT\b\s.*|.*:ARCHIVE:))/i
);
export const endOfSectionRegex = createRegexPattern(
  /(?=^\*+\s)/i
);
export const headlineDetectToCloseBlockRegex = createRegexPattern(
  /(?=^\*+\s)/
);
// Match a single-star Org headline with all possible elements
export const headlineLevel1Regex = createRegexPattern(
  new RegExp(
    `^${(starsLevel1Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`
  ));
export const headlineLevel2Regex = createRegexPattern(
  new RegExp(
    `^${(starsLevel2Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`
  ));
export const headlineLevel3Regex = createRegexPattern(
  new RegExp(
    `^${(starsLevel3Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`
  ));
export const headlineLevel4Regex = createRegexPattern(
  new RegExp(
    `^${(starsLevel4Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`
  ));
export const headlineLevel5Regex = createRegexPattern(
  new RegExp(
    `^${(starsLevel5Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`
  ));
export const headlineLevel6Regex = createRegexPattern(
  new RegExp(
    `^${(starsLevel6Fragment as any).regex.source}${(todoFragment as any).regex.source}${(priorityFragment as any).regex.source}${(headlineTextFragment as any).regex.source}${(cookieFragment as any).regex.source}${(tagsFragment as any).regex.source}\\s*$`
  ));
// #endregion HEADLINES

// #region LISTS
/**
 * Lists - ordered, unordered, description
 */
export const unorderedListRegex = createRegexPattern(
  /^(\s*)([-+])\s+(?:\[( |X|-)\])?/
);
export const orderedListRegex = createRegexPattern(
  /^(\s*)(\d+[.)])\s+(?:\[( |X|-)\])?/
);
// This regex is used inside an unordered list to find the description separator.
export const descriptionSeparatorRegex = createRegexPattern(
  /(.*?)\s*(::)\s*/
);
// This regex is used inside an ordered list to find a counter.
export const listCounterRegex = createRegexPattern(
  /\[@(\d+)\]/
);
// #endregion LISTS

// #region HORIZONTAL_RULES
/**
 * Horizontal rules
 */
export const horizontalRuleRegex = createRegexPattern(
  /^(\s*)(-{5,})\s*$/
);
// #endregion HORIZONTAL_RULES

// #region COMMENTS
/**
 * Line comments - lines starting with optional whitespace, then '# ' (hash + space)
 * Per Org manual 13.6, such lines are treated as comments and not exported.
 */
export const lineCommentRegex = createRegexPattern(
  /^\s*#\s.*$/
);

/**
 * Comment block
 */
export const commentBlockBeginRegex = createRegexPattern(
  /^(\s*)(#\+BEGIN_COMMENT)\s*$/i
);
export const commentBlockEndRegex = createRegexPattern(
  /^(\s*)(#\+END_COMMENT)\s*$/i
);
// #endregion COMMENTS

// #region BLOCKS
/**
 * Block parameters
 */
export const blockParameterRegex = createRegexPattern(
  /(:[a-zA-Z0-9_-]+)\s+((?:"[^"]*"|'[^']*'|[^\s:]+))/
);

/**
 * Standard Blocks - Verbatim (no inline markup)
 */
export const standardBlockVerbatimBeginRegex = createRegexPattern(
  /^(\s*)(#\+BEGIN_)(COMMENT|EXAMPLE)(?: (.*))?$/i
);
export const standardBlockVerbatimEndRegex = createRegexPattern(
  /^(\s*)(#\+END_)(\3)\s*$/i
);

/**
 * Standard Blocks - Markup (allows inline markup)
 */
export const standardBlockMarkupBeginRegex = createRegexPattern(
  /^(\s*)(#\+BEGIN_)(QUOTE|CENTER|VERSE)(?: (.*))?$/i
);
export const standardBlockMarkupEndRegex = createRegexPattern(
  new RegExp(
    `^(\\s*)(#\\+END_)(\\3)\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`,
    'i'
  ));

/**
 * Source Code Blocks
 */
export const srcBlockBeginRegex = createRegexPattern(
  /^(\s*)(#\+BEGIN_SRC)[ \t]*(.*)$/i
);
export const srcBlockEndRegex = createRegexPattern(
  new RegExp(
    `^(\\s*)(#\\+END_SRC)\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`,
    'i'
  ));
export const srcBlockWhileRegex = createRegexPattern(
  new RegExp(
    `^(?!\\s*#\\+END_SRC|${(headlineDetectToCloseBlockRegex as any).regex.source})`,
    'i'
  ));

export const srcSwitchRegex = createRegexPattern(
  /(?:^|\s)([-+][a-zA-Z0-9]+(?:\s+"[^"]*")?)/
);

/**
 * Customized Blocks
 */
export const customizedBlockBeginRegex = createRegexPattern(
  /^(\s*)(#\+BEGIN_)([a-zA-Z0-9_-]+)(?: (.*))?$/i
);
export const customizedBlockEndRegex = createRegexPattern(
  /^(\s*)(#\+END_)(\3)\s*$/i
);
export const customizedBlockWhileRegex = createRegexPattern(
  /^(\s*)(#\+END_)(\3)\s*$/i
);

/**
 * Dynamic Blocks
 */
export const dynamicBlockBeginRegex = createRegexPattern(
  /^(\s*)(#\+BEGIN:)\s+([a-zA-Z0-9_-]+)(?: (.*))?$/i
);
export const dynamicBlockEndRegex = createRegexPattern(
  new RegExp(
    `^(\\s*)(#\\+END:)\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`,
    'i'
  ));
// #endregion BLOCKS

// #region KEYWORD
/**
 * Generic fallback for keywords. Excludes keywords that have their own dedicated rules.
 */
export const genericKeywordRegex = createRegexPattern(
  /^\s*(#\+(?!LINK|SCHEDULED|DEADLINE|CLOSED|INCLUDE)([^:]+):)\s*(.*)\s*$/i
);
// #endregion KEYWORD

/**
 * Macro definition: "#+MACRO: name body"
 * Capture groups:
 * 1 = leading keyword ("#+MACRO:")
 * 2 = macro name
 * 3 = macro body
 */
export const macroDefinitionRegex = createRegexPattern(
  /^\s*(#\+MACRO:)\s+([a-zA-Z_][a-zA-Z0-9_-]*)\s+(.*)$/i
);


// #region DRAWERS
/**
 * Drawers - General purpose, excludes PROPERTIES
 */
export const genericDrawerBeginRegex = createRegexPattern(
  /^\s*:(?!END|PROPERTIES)([A-Z_]+):\s*$/i
);

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
  /^\s*:([a-zA-Z0-9_+-]+):(?:[ \t]*(.*))?$/
);
// #endregion PROPERTIES

export const drawerEndRegex = createRegexPattern(
  new RegExp(
    `^\\s*:END:\\s*$|${(headlineDetectToCloseBlockRegex as any).regex.source}`,
    'i'
  ));
// #endregion DRAWERS


// #region TIMESTAMPS
// =================================================================
// Timestamps
// =================================================================

// Matches a single active timestamp. The negative lookbehind ensures it's not the end of a range.
export const timestampActiveRegex = createRegexPattern(
  /<\d{4}-\d{2}-\d{2}[^>]*?(?<!-->)>/
);

// Matches a single inactive timestamp. The negative lookbehind ensures it's not the end of a range.
export const timestampInactiveRegex = createRegexPattern(
  /\[\d{4}-\d{2}-\d{2}[^\]]*?(?<!--)\]/
);

// Matches a full active timestamp range.
export const timestampActiveRangeRegex = createRegexPattern(
  /<\d{4}-\d{2}-\d{2}[^>]*>--<\d{4}-\d{2}-\d{2}[^>]*>/
);

// Matches a full inactive timestamp range.
export const timestampInactiveRangeRegex = createRegexPattern(
  /\[\d{4}-\d{2}-\d{2}[^\]]*\]--\[\d{4}-\d{2}-\d{2}[^\]]*\]/
);
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

/**
 * Plain and angle-bracket links
 */
export const plainLinkRegex = createRegexPattern(
  /(https?|ftp|file):\/\/[^\s<>]+/i
);
export const angleBracketLinkRegex = createRegexPattern(
  /<(https?:\/\/[^>]+)>/i
);
// #endregion LINKS

// #region TABLE
/**
 * Tables
 */
export const tableRegex = createRegexPattern(
  /^\s*\|.*\|$/
);
// #endregion

// #region INCLUDE DIRECTIVE
/**
 * Include directive - matches a full line include with path and optional options
 * Capture groups:
 * 1 = the include keyword token (#+INCLUDE:)
 * 2 = the include path (quoted, angle-bracketed, or bare)
 */
export const includeDirectiveBeginRegex = createRegexPattern(
  /^\s*(#\+INCLUDE:)\s+("[^"]+"|<[^>]+>|[^ \t]+)(?=\s|$)/i
);

/**
 * Include directive (inline) - for table cell content where we are not at BOL
 * Capture groups:
 * 1 = the include keyword token (#+INCLUDE:)
 * 2 = the include path (quoted, angle-bracketed, or bare)
 */
export const includeDirectiveInlineBeginRegex = createRegexPattern(
  /(?:^|\|)\s*(#\+INCLUDE:)\s+("[^"]+"|<[^>]+>|[^ \t|]+)(?=\s|$)/i
);
// #endregion INCLUDE DIRECTIVE

// #region FOOTNOTES
/**
 * Footnotes
 */
// Footnote reference: [fn:LABEL]
export const footnoteReferenceRegex = createRegexPattern(
  /\[fn:([^:\]]+)\]/
);

// Anonymous footnote reference: [fn]
export const footnoteAnonymousReferenceRegex = createRegexPattern(
  /\[fn\]/
);

// Inline footnote definition: [fn:: a definition]
export const footnoteInlineDefinitionRegex = createRegexPattern(
  /\[fn::\s*(.*?)\]/
);

// Footnote definition start - capture groups designed to match fixtures' expectations:
// 1 = leading indent
// 2 = full marker (e.g. "[fn:label]")
// 3 = label
// 4 = separator whitespace
// 5 = content (rest of the line)
export const footnoteDefinitionStartRegex = createRegexPattern(
  /^(\s*)(\[fn:([^\]]+)\])(\s*)(.*)$/
);
// #endregion

// #region PARAGRAPHS
/**
 * Paragraphs
 */
export const paragraphBeginRegex = createRegexPattern(
  /^(?=\S)(?!\*+\s)/
);
export const paragraphEndRegex = createRegexPattern(
  new RegExp(
    `${'(?=^\\s*$)'}|${(headlineDetectToCloseBlockRegex as any).regex.source}`,
    'm'
  )
);
// #endregion

// #region INLINE_MARKUP
export const boldBeginRegex = createRegexPattern(
  /(?<=^|\s|\|)(\*)(?=[^\s*])(?=.*?([^\s*])\*(?!\w))/
);
export const boldEndRegex = createRegexPattern(
  /(?<=[^\s*])(\*)(?!\w)/
);

export const italicBeginRegex = createRegexPattern(
  /(?<=^|\s)(\/)(?=[^\s\/])(?=.*?([^\s\/])\/(?!\w))/
);
export const italicEndRegex = createRegexPattern(
  /(?<=[^\s\/])(\/)(?!\w)/
);

export const underlineBeginRegex = createRegexPattern(
  /(?<=^|\s)(_)(?=[^\s_])(?=.*?([^\s_])_(?!\w))/
);
export const underlineEndRegex = createRegexPattern(
  /(?<=[^\s_])(_)(?!\w)/
);

export const strikethroughBeginRegex = createRegexPattern(
  /(?<=^|\s)(\+)(?=[^\s+])(?=.*?([^\s+])\+(?!\w))/
);
export const strikethroughEndRegex = createRegexPattern(
  /(?<=[^\s+])(\+)(?!\w)/
);

export const codeBeginRegex = createRegexPattern(
  /(?<=^|\s)(~)(?=[^\s~])(?=.*?([^\s~])~(?!\w))/
);
export const codeEndRegex = createRegexPattern(
  /(?<=[^\s~])(~)(?!\w)/
);

export const verbatimBeginRegex = createRegexPattern(
  /(?<=^|\s)(=)(?=[^\s=])(?=.*?([^\s=])=(?!\w))/
);
export const verbatimEndRegex = createRegexPattern(
  /(?<=[^\s=])(=)(?!\w)/
);


/**
 * LaTeX
 */
export const latexInlineRegex = createRegexPattern(
  /\$\$.*?\$\$|\$.*?\$|\\\(.*?\\\)|\\\[.*?\\\]/
);
export const latexEnvironmentBeginRegex = createRegexPattern(
  /\\begin\{([a-zA-Z*]+)\}/
);
export const latexEnvironmentEndRegex = createRegexPattern(/\\end\{\\1\}/);

/**
 * Inline macro - matches Org Mode inline macro usages like {{{name}}} or {{{name(arg)}}}
 * Capture groups:
 * 1 = opening braces "{{{"
 * 2 = macro body (name and optional args)
 * 3 = closing braces "}}}"
 */
export const inlineMacroRegex = createRegexPattern(
  /(\{\{\{)([^}\n]+?)(\}\}\})/
);

// Macro name fragment (used inside inline macro body)
export const macroNameFragment = createRegexPattern(/[a-zA-Z_][a-zA-Z0-9_-]*/);

// Macro arguments fragment - matches a parenthesized argument list (simplified)
// Capture includes parentheses so grammar can assign parameter scope to the inner content if desired.
export const macroArgsFragment = createRegexPattern(/\([^\)]*\)/);

/**
 * Entities and subscripts/superscripts
 */
export const entitiesRegex = createRegexPattern(
  /\[a-zA-Z]+(\{\})?/
);
export const subSuperScriptRegex = createRegexPattern(
  /[_^](\{[^}]+\}|\S)/
);
// #endregion
