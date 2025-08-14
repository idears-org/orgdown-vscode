// common/src/scoping.ts
// Single Source of Truth for TextMate Scopes

// =================================================================
// Headlines
// =================================================================

/** The entire headline block, applied to the whole line. */
export const HEADING_BLOCK = 'markup.heading.org';

/** The headline level, e.g., heading.1.org */
export const HEADING_LEVEL_1 = 'heading.1.org';
export const HEADING_LEVEL_2 = 'heading.2.org';
export const HEADING_LEVEL_3 = 'heading.3.org';
export const HEADING_LEVEL_4 = 'heading.4.org';
export const HEADING_LEVEL_5 = 'heading.5.org';
export const HEADING_LEVEL_6 = 'heading.6.org';

/** The leading stars, e.g., `*` or `**`. */
export const HEADING_PUNCTUATION = 'punctuation.definition.heading.org';

/** A TODO keyword, e.g., `TODO`, `DONE`. */
export const TODO_KEYWORD = 'keyword.other.todo.org';

/** The entire priority cookie, e.g., `[#A]`. */
export const PRIORITY_COOKIE = 'constant.other.priority.org';

/** The letter inside a priority cookie, e.g., `A`. */
export const PRIORITY_VALUE = 'constant.other.priority.value.org';

/** The main title text of the headline. */
export const HEADING_TITLE = 'entity.name.section.org';

/** The progress cookie, e.g., `[50%]`. */
export const PROGRESS_COOKIE = 'constant.other.progress.org';

/** A tag, e.g., `:work:`. */
export const TAG = 'entity.name.tag.org';


// =================================================================
// Lists
// =================================================================

/** An unordered list item's text content. */
export const LIST_UNORDERED_TEXT = 'markup.list.unnumbered.org';

/** An ordered list item's text content. */
export const LIST_ORDERED_TEXT = 'markup.list.numbered.org';

/** The bullet of a list item, e.g., `-`, `+`, `1.`. */
export const LIST_BULLET = 'punctuation.definition.list.begin.org';

/** A checkbox, including the brackets. */
export const CHECKBOX = 'constant.language.checkbox.org';

/** The term in a description list. */
export const DESCRIPTION_TERM = 'entity.name.tag.description.term.org';

/** The `::` separator in a description list. */
export const DESCRIPTION_SEPARATOR = 'punctuation.separator.key-value.org';

/** The counter in an ordered list, e.g., `[@5]`. */
export const LIST_COUNTER = 'constant.numeric.list-counter.org';

/** The numeric value inside a counter, e.g., `5`. */
export const LIST_COUNTER_VALUE = 'constant.numeric.value.org';


// =================================================================
// Horizontal Rules
// =================================================================

/** A horizontal rule, e.g., `-----`. */
export const HORIZONTAL_RULE = 'meta.separator.org';


// =================================================================
// Blocks
// =================================================================

/** A meta scope for any block, for uniform styling. */
export const BLOCK_META = 'meta.block.org';

// =================================================================
// Standard Blocks
// =================================================================

/** A standard block, e.g., `#+BEGIN_QUOTE`...`#+END_QUOTE`. */
export const BLOCK_STANDARD = 'markup.raw.block.org';

/** The begin/end keyword of a block, e.g., `#+BEGIN_QUOTE`. */
export const BLOCK_KEYWORD = 'punctuation.definition.raw.org';

/** The name of a block, e.g., `QUOTE`. */
export const BLOCK_NAME = 'entity.name.function.org-block.org';


// =================================================================
// Source Blocks
// =================================================================

/** A source code block, e.g., `#+BEGIN_SRC python`...`#+END_SRC`. */
export const BLOCK_SRC = 'markup.fenced_code.block.org';

/** The language identifier in a source block, e.g., `python`. */
export const BLOCK_LANGUAGE = 'entity.name.type.language.org';

/** A switch in a source block, e.g., `-n` or `+n`. */
export const BLOCK_SWITCH = 'storage.modifier.switch.org';

/** The key of a header argument, e.g., `:results`. */
export const BLOCK_HEADER_KEY = 'keyword.other.property.key.org';

/** The value of a header argument, e.g., `output`. */
export const BLOCK_HEADER_VALUE = 'string.unquoted.property.value.org';


// =================================================================
// Keywords
// =================================================================

/** The entire keyword line, e.g., `#+TITLE: My Title`. */
export const KEYWORD_META = 'meta.keyword.option.org';

/** The keyword marker itself, e.g., `#+TITLE:`. */
export const KEYWORD_MARKER = 'keyword.other.org';

/** The name of the keyword, e.g., `TITLE`. */
export const KEYWORD_NAME = 'support.constant.keyword.org';

/** The value of the keyword, e.g., `My Title`. */
export const KEYWORD_VALUE = 'string.unquoted.value.org';


// =================================================================
// Inline Markup
// =================================================================

export const BOLD = 'markup.bold.org';
export const ITALIC = 'markup.italic.org';
export const UNDERLINE = 'markup.underline.org';
export const STRIKETHROUGH = 'markup.strikethrough.org';
export const CODE = 'markup.inline.raw.org';
export const VERBATIM = 'markup.inline.raw.org';
export const LINK = 'markup.underline.link.org';

/** The leading whitespace for a list item. */
export const LIST_WHITESPACE = 'string.other.whitespace.leading.org';
