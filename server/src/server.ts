import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  DocumentSymbol,
  SymbolKind,
  FoldingRange,
  FoldingRangeKind,
  DocumentSymbolParams,
  FoldingRangeParams,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((_params: InitializeParams) => {
  // Capture workspace folders if provided
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      documentSymbolProvider: true,
      foldingRangeProvider: true,
    },
  };
  return result;
});

documents.listen(connection);
connection.listen();

// Simple Org headline regex for server-side features (kept lenient)
const headlineRe = /^(\*+)\s+(.+?)\s*(?::[\w@:]+:)?\s*$/;

function parseHeadlines(text: string) {
  type Node = { level: number; title: string; start: number; end: number; children: Node[] };
  const lines = text.split(/\r?\n/);
  const roots: Node[] = [];
  const stack: Node[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(headlineRe);
    if (!m) {
      continue;
    }
    const level = m[1].length;
    const title = m[2];
    const node: Node = { level, title, start: i, end: i, children: [] };
    // place into hierarchy
    while (stack.length && stack[stack.length - 1].level >= level) {
      const popped = stack.pop()!;
      // close section end at previous line if possible
      popped.end = Math.max(popped.end, i - 1);
    }
    if (stack.length) {
      stack[stack.length - 1].children.push(node);
    } else {
      roots.push(node);
    }
    stack.push(node);
  }
  // close remaining nodes till EOF
  if (lines.length > 0) {
    while (stack.length) {
      const n = stack.pop()!;
      n.end = Math.max(n.end, lines.length - 1);
    }
  }
  return roots;
}

connection.onDocumentSymbol((params: DocumentSymbolParams): DocumentSymbol[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }
  const roots = parseHeadlines(doc.getText());

  const toSymbols = (nodes: any[]): DocumentSymbol[] => nodes.map(n => ({
    name: n.title,
    kind: SymbolKind.String,
    range: {
      start: { line: n.start, character: 0 },
      end: { line: n.end, character: 0 },
    },
    selectionRange: {
      start: { line: n.start, character: 0 },
      end: { line: n.start, character: 0 },
    },
    children: toSymbols(n.children),
  }));
  return toSymbols(roots);
});

connection.onFoldingRanges((params: FoldingRangeParams): FoldingRange[] => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) {
    return [];
  }
  const roots = parseHeadlines(doc.getText());
  const folds: FoldingRange[] = [];
  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.end > n.start) {
        folds.push({ startLine: n.start, endLine: n.end, kind: FoldingRangeKind.Region });
      }
      if (n.children?.length) {
        walk(n.children);
      }
    }
  };
  walk(roots);
  return folds;
});
