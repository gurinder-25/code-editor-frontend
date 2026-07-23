const KEYWORDS =
  "if|else|elif|for|while|return|function|def|int|float|double|char|void|class|public|private|protected|static|const|let|var|new|import|from|include|using|namespace|std|cout|cin|print|println|printf|echo|puts|input|scanf|true|false|null|None|True|False|in|range|struct|switch|case|default|break|continue|try|catch|except|finally|throw|raise|end|do|then|fi|and|or|not|is";

const PATTERN = new RegExp(
  "(\\/\\/[^\\n]*|#[^\\n]*)|" +
    "(`(?:\\\\.|[^`\\\\])*`|\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\])*')|" +
    "\\b(\\d+\\.?\\d*)\\b|" +
    "\\b(" +
    KEYWORDS +
    ")\\b",
  "g",
);

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Returns HTML for the highlight overlay. Input is escaped before spans are added. */
export function highlight(code: string): string {
  return escapeHtml(code).replace(PATTERN, (m, cmt, str, num, key) => {
    if (cmt) return `<span class="tok-comment">${cmt}</span>`;
    if (str) return `<span class="tok-string">${str}</span>`;
    if (num) return `<span class="tok-number">${num}</span>`;
    if (key) return `<span class="tok-keyword">${key}</span>`;
    return m;
  });
}
