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
// Generic Scopes
// =================================================================

/** Leading whitespace for lists and blocks. */
export const LEADING_WHITESPACE = 'string.other.whitespace.leading.org';


// =================================================================
// Blocks (Generic)
// =================================================================

/** A meta scope for any block, for uniform styling. */
export const BLOCK_META = 'meta.block.org';

/** The content of a block. */
export const BLOCK_CONTENT = 'markup.block.org';

/** The keyword of a block, e.g., `#+BEGIN_SRC`, `#+END_QUOTE`. */
export const BLOCK_KEYWORD = 'keyword.control.block.org';

/** The name of a block, e.g., `QUOTE`, `SRC`. */
export const BLOCK_NAME = 'entity.name.function.block.org';

/** The parameters of a block. */
export const BLOCK_PARAMETERS = 'variable.parameter.block.org';

/** The key of a parameter, e.g., `:results`. */
export const BLOCK_PARAMETER_KEY = 'keyword.other.property.key.org';

/** The value of a parameter, e.g., `output`. */
export const BLOCK_PARAMETER_VALUE = 'string.unquoted.property.value.org';


// =================================================================
// Standard Blocks (Specific)
// =================================================================

/** The meta scope for the entire standard block. */
export const BLOCK_STANDARD_META = 'meta.block.standard.org';

/** The content area of a standard block. */
export const BLOCK_STANDARD_CONTENT = 'markup.block.standard.org';


// =================================================================
// Source Blocks (Specific)
// =================================================================

/** The meta scope for the entire source block. */
export const BLOCK_SRC_META = 'meta.block.src.org';

/** The content area of a source block. */
export const BLOCK_SRC_CONTENT = 'markup.block.src.org';

/** The language identifier in a source block, e.g., `python`. */
export const BLOCK_LANGUAGE = 'entity.name.type.language.org';

/** A switch in a source block, e.g., `-n` or `+n`. */
export const BLOCK_SWITCH = 'storage.modifier.switch.org';

// =================================================================
// Dynamic Blocks (Specific)
// =================================================================

/** The meta scope for the entire dynamic block. */
export const DYNAMIC_BLOCK_META = 'meta.block.dynamic.org';

/** The content area of a dynamic block. */
export const DYNAMIC_BLOCK_CONTENT = 'markup.block.dynamic.org';


// =================================================================
// Customized Blocks (Specific)
// =================================================================

/** The meta scope for the entire customized block. */
export const BLOCK_CUSTOMIZED_META = 'meta.block.customized.org';

/** The content area of a customized block. */
export const BLOCK_CUSTOMIZED_CONTENT = 'markup.block.customized.org';


// =================================================================
// Keywords
// =================================================================

/** The entire keyword line, e.g., `#+TITLE: My Title`. */
export const KEYWORD = 'meta.keyword.org';

/** The keyword key, e.g., `#+TITLE:`. */
export const KEYWORD_KEY = 'keyword.other.org';

/** The name of the keyword, e.g., `TITLE`. */
export const KEYWORD_NAME = 'entity.name.function.org';

/** The value of the keyword, e.g., `My Title`. */
export const KEYWORD_VALUE = 'string.unquoted.org';


// =================================================================
// Drawers
// =================================================================

/** The meta scope for the entire drawer. */
export const DRAWER_META = 'meta.block.drawer.org';

/** The keyword for the beginning of a drawer. */
export const DRAWER_BEGIN_KEYWORD = 'keyword.control.block.drawer.begin.org';

/** The keyword for the end of a drawer. */
export const DRAWER_END_KEYWORD = 'keyword.control.block.drawer.end.org';

/** The name of a drawer. */
export const DRAWER_NAME = 'entity.name.function.drawer.org';

/** The content of a drawer. */
export const DRAWER_CONTENT = 'markup.block.drawer.content.org';


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
