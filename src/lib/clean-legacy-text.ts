const legacyReplacements: Array<[RegExp, string]> = [
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
  [/â€œ/g, '"'],
  [/â€/g, '"'],
  [/â€"/g, '"'],
  [/â€³/g, '"'],
  [/â€²/g, "'"],
  [/â€¦/g, "..."],
  [/â€“/g, "-"],
  [/â€”/g, "-"],
  [/Â·/g, "·"],
  [/Â©/g, "©"],
  [/Ã±/g, "ñ"],
  [/Ã¡/g, "á"],
  [/Ã©/g, "é"],
  [/Ã‰/g, "É"],
  [/Ã/g, "Á"],
];

export function cleanLegacyText(input?: string | null) {
  if (!input) {
    return "";
  }

  let output = input;

  for (const [pattern, replacement] of legacyReplacements) {
    output = output.replace(pattern, replacement);
  }

  return output.replace(/\s+/g, " ").trim();
}

export function cleanLegacyList(values: string[] = []) {
  return values.map((value) => cleanLegacyText(value)).filter(Boolean);
}
