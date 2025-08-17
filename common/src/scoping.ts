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
/** The name of a block, e.g., `QUOTE`. */
export const BLOCK_NAME = 'entity.name.function.org-block.org';

// =================================================================
// Standard Blocks
// =================================================================

/** The meta scope for the entire standard block. */
export const BLOCK_STANDARD_META = 'meta.block.standard.org';

/** The content area of a standard block. */
export const BLOCK_STANDARD_CONTENT = 'markup.block.standard.org';

/** The begin keyword of a standard block, e.g., `#+BEGIN_QUOTE`. */
export const BLOCK_STANDARD_BEGIN_KEYWORD = 'keyword.control.block.standard.begin.org';

/** The end keyword of a standard block, e.g., `#+END_QUOTE`. */
export const BLOCK_STANDARD_END_KEYWORD = 'keyword.control.block.standard.end.org';

/** The name of a standard block, e.g., `QUOTE`. */
export const BLOCK_STANDARD_NAME = 'entity.name.function.standard-block.org';


// =================================================================
// Source Blocks
// =================================================================

/** The meta scope for the entire source block. */
export const BLOCK_SRC_META = 'meta.block.src.org';

/** The code content itself in a source block. */
export const BLOCK_SRC_CONTENT = 'markup.block.src.org';

/** The begin keyword of a source block, e.g., `#+BEGIN_SRC`. */
export const BLOCK_SRC_BEGIN_KEYWORD = 'keyword.control.block.src.begin.org';

/** The end keyword of a source block, e.g., `#+END_SRC`. */
export const BLOCK_SRC_END_KEYWORD = 'keyword.control.block.src.end.org';

/** The language identifier in a source block, e.g., `python`. */
export const BLOCK_LANGUAGE = 'entity.name.type.language.org';

/** A switch in a source block, e.g., `-n` or `+n`. */
export const BLOCK_SWITCH = 'storage.modifier.switch.org';

/** The key of a header argument, e.g., `:results`. */
export const BLOCK_HEADER_KEY = 'keyword.other.property.key.org';

/** The value of a header argument, e.g., `output`. */
export const BLOCK_HEADER_VALUE = 'string.unquoted.property.value.org';

// =================================================================
// Dynamic Blocks
// =================================================================

/** The meta scope for the entire dynamic block. */
export const DYNAMIC_BLOCK_META = 'meta.block.dynamic.org';

/** The begin keyword of a dynamic block, e.g., `#+BEGIN:`. */
export const DYNAMIC_BLOCK_BEGIN_KEYWORD = 'keyword.control.block.dynamic.begin.org';

/** The end keyword of a dynamic block, e.g., `#+END:`. */
export const DYNAMIC_BLOCK_END_KEYWORD = 'keyword.control.block.dynamic.end.org';

/** The name of a dynamic block, e.g., `clocktable`. */
export const DYNAMIC_BLOCK_NAME = 'entity.name.function.dynamic-block.org';

/** The parameters of a dynamic block. */
export const DYNAMIC_BLOCK_PARAMETERS = 'variable.parameter.block.org';


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
