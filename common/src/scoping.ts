// common/src/scoping.ts
// Single Source of Truth for TextMate Scopes

// =================================================================
// 1. ABSTRACT STRUCTURAL SCOPES
// =================================================================
// These scopes are for defining the hierarchical structure of the
// document and are not typically styled directly.

/** The entire file header, from the beginning to the first heading. */
export const META_HEADER = 'meta.file.header.org';

/** The entire outline node, from a headline to the next. */
export const META_NODE = 'meta.outline-node.org';

/** Any single-line keyword-like directive. */
export const META_DIRECTIVE = 'meta.directive.org';

/** Any block-level element (begin-end, drawer, etc.). */
export const META_BLOCK = 'meta.block.org';

/** Any block defined by `#+BEGIN...` and `#+END...`. */
export const META_BEGIN_END_BLOCK = 'meta.block.begin-end.org';

/** Any drawer block defined by `:NAME:` and `:END:`. */
export const META_DRAWER = 'meta.block.drawer.org';

// =================================================================
// 2. DETAILED IMPLEMENTATIONS
// =================================================================

// region Headlines
// =================================================================

/** The entire headline block, applied to the whole line. */
export const HEADING_BLOCK = 'markup.heading.org';

/** The headline level, e.g., heading.1.org */
export const HEADING_LEVEL_1 = 'markup.heading.1.org';
export const HEADING_LEVEL_2 = 'markup.heading.2.org';
export const HEADING_LEVEL_3 = 'markup.heading.3.org';
export const HEADING_LEVEL_4 = 'markup.heading.4.org';
export const HEADING_LEVEL_5 = 'markup.heading.5.org';
export const HEADING_LEVEL_6 = 'markup.heading.6.org';

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

// endregion

// region Lists
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

// endregion

// region Horizontal Rules
// =================================================================

/** A horizontal rule, e.g., `-----`. */
export const HORIZONTAL_RULE = 'meta.separator.org';

// endregion

// region Generic Block Parts
// =================================================================

/** Leading whitespace for lists and blocks. */
export const LEADING_WHITESPACE = 'string.other.whitespace.leading.org';

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

// endregion

// region Specific Blocks
// =================================================================

/** The meta scope for the entire standard block. */
export const BLOCK_STANDARD_META = 'meta.block.begin-end.standard.org';

/** The content area of a standard block. */
export const BLOCK_STANDARD_CONTENT = 'markup.block.standard.org';

/** The meta scope for the entire source block. */
export const BLOCK_SRC_META = 'meta.block.begin-end.src.org';

/** The content area of a source block. */
export const BLOCK_SRC_CONTENT = 'markup.block.src.org';

/** The language identifier in a source block, e.g., `python`. */
export const BLOCK_LANGUAGE = 'entity.name.type.language.org';

/** A switch in a source block, e.g., `-n` or `+n`. */
export const BLOCK_SWITCH = 'storage.modifier.switch.org';

/** The meta scope for the entire dynamic block. */
export const DYNAMIC_BLOCK_META = 'meta.block.begin-end.dynamic.org';

/** The content area of a dynamic block. */
export const DYNAMIC_BLOCK_CONTENT = 'markup.block.dynamic.org';

/** The meta scope for the entire customized block. */
export const BLOCK_CUSTOMIZED_META = 'meta.block.begin-end.customized.org';

/** The content area of a customized block. */
export const BLOCK_CUSTOMIZED_CONTENT = 'markup.block.customized.org';

// endregion

// region Keyword-Like Lines
// =================================================================

/** The entire keyword line, e.g., `#+TITLE: My Title`. */
export const KEYWORD = 'meta.directive.keyword.org';

/** The keyword key, e.g., `#+TITLE:`. */
export const KEYWORD_KEY = 'keyword.other.org';

/** The name of the keyword, e.g., `TITLE`. */
export const KEYWORD_NAME = 'entity.name.function.org';

/** The value of the keyword, e.g., `My Title`. */
export const KEYWORD_VALUE = 'string.unquoted.org';

/** The meta scope for a link abbreviation line. */
export const LINK_ABBREVIATION_META = 'meta.directive.link-abbreviation.org';

/** The `#+LINK:` keyword itself. */
export const LINK_ABBREVIATION_KEYWORD = 'keyword.other.link.abbreviation.org';

/** The abbreviation key, e.g., `gh`. */
export const LINK_ABBREVIATION_KEY = 'variable.parameter.link.abbreviation.org';

/** The URL template for an abbreviation. */
export const LINK_ABBREVIATION_URL =
  'string.unquoted.link.abbreviation.url.org';

/** The meta scope for the entire planning line. */
export const PLANNING_LINE_META = 'meta.directive.planning.org';

/** The keyword for a planning line. */
export const PLANNING_KEYWORD = 'keyword.control.task-management.org';

/** The timestamp for a planning line. */
export const PLANNING_TIMESTAMP = 'constant.other.timestamp.planning.org';

// endregion

// region Drawers
// =================================================================

/** The keyword for the beginning of a drawer. */
export const DRAWER_BEGIN_KEYWORD = 'keyword.control.block.drawer.begin.org';

/** The keyword for the end of a drawer. */
export const DRAWER_END_KEYWORD = 'keyword.control.block.drawer.end.org';

/** The name of a drawer. */
export const DRAWER_NAME = 'entity.name.function.drawer.org';

/** The content of a drawer. */
export const DRAWER_CONTENT = 'markup.block.drawer.content.org';

/** The meta scope for the entire properties drawer. */
export const PROPERTY_DRAWER_META = 'meta.block.drawer.property.org';

/** The keyword for the beginning of a properties drawer. */
export const PROPERTY_DRAWER_BEGIN_KEYWORD =
  'punctuation.definition.property-drawer.begin.org';

/** The keyword for the end of a properties drawer. */
export const PROPERTY_DRAWER_END_KEYWORD =
  'punctuation.definition.property-drawer.end.org';

/** The meta scope for a single property line. */
export const PROPERTY_META = 'meta.property.org';

/** The key of a property, e.g., `:Key:`. */
export const PROPERTY_KEY = 'entity.name.property.org';

/** The value of a property. */
export const PROPERTY_VALUE = 'variable.other.property.value.org';

// endregion

// region Timestamps
// =================================================================

/** An active timestamp, e.g., `<2025-08-01 Fri>`. */
export const TIMESTAMP_ACTIVE = 'constant.other.timestamp.active.org';

/** An inactive timestamp, e.g., `[2025-08-01 Fri]`. */
export const TIMESTAMP_INACTIVE = 'constant.other.timestamp.inactive.org';

/** An active timestamp range, e.g., `<2025-08-01>--<2025-08-02>`. */
export const TIMESTAMP_ACTIVE_RANGE = 'constant.other.timestamp.active.range.org';

/** An inactive timestamp range, e.g., `[2025-08-01]--[2025-08-02]`. */
export const TIMESTAMP_INACTIVE_RANGE = 'constant.other.timestamp.inactive.range.org';

// endregion

// region Inline Markup
// =================================================================

export const BOLD = 'markup.bold.org';
export const ITALIC = 'markup.italic.org';
export const UNDERLINE = 'markup.underline.org';
export const STRIKETHROUGH = 'markup.strikethrough.org';
export const CODE = 'markup.inline.raw.org';
export const VERBATIM = 'markup.inline.raw.org';
export const LINK = 'markup.underline.link.org';

/** The entire link structure, e.g., [[...]]. */
export const LINK_META = 'meta.link.org';

/** The opening brackets of a link, e.g., `[[`. */
export const LINK_BEGIN_PUNCTUATION = 'punctuation.definition.link.begin.org';

/** The closing brackets of a link, e.g., `]]`. */
export const LINK_END_PUNCTUATION = 'punctuation.definition.link.end.org';

/** The separator between target and description, e.g., `][`. */
export const LINK_SEPARATOR_PUNCTUATION = 'punctuation.separator.link.org';

/** The description part of a link. */
export const LINK_DESCRIPTION = 'string.other.link.description.org';

/** The protocol of a link, e.g., `http:`, `file:`. */
export const LINK_PROTOCOL = 'keyword.other.link.protocol.org';

// endregion
