export interface ParsedTipBody {
  code: string;
  language: string;
  explanation: string;
}

export function parseTipBody(body: string, fallbackLang = "text"): ParsedTipBody {
  const fenceRe = /^```(\w+)?\n([\s\S]*?)^```/m;
  const match = body.match(fenceRe);

  if (!match) {
    return { code: "", language: fallbackLang, explanation: body.trim() };
  }

  const language = match[1] ?? fallbackLang;
  const code = match[2].trimEnd();
  const after = body.slice(body.indexOf(match[0]) + match[0].length).trim();

  return { code, language, explanation: after };
}
