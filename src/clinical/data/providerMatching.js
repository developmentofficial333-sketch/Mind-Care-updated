/**
 * Heuristic keyword match between a quiz "need" and a provider's listed
 * concerns — a simple relevance ranking, not a clinical assessment. Score
 * is capped below 100% so the UI never implies a certainty a plain keyword
 * match can't back up.
 */
function scoreProvider(provider, need, language) {
  if (!need) return { score: 0, matched: false, speaksLanguage: true };

  const concernsLower = provider.concerns.map((c) => c.toLowerCase());
  const hits = need.matchKeywords.filter((keyword) =>
    concernsLower.some((concern) => concern.includes(keyword.toLowerCase()))
  ).length;

  const speaksLanguage = !language || language === "Both" || provider.languages.includes(language);

  if (hits === 0) return { score: 0, matched: false, speaksLanguage };

  const score = Math.min(98, 70 + hits * 14 + (speaksLanguage ? 4 : 0));
  return { score, matched: true, speaksLanguage };
}

/** Ranks a given list of providers by relevance to `need`/`language`, best match first. */
export function matchProviders(providers, need, language) {
  return providers
    .map((provider) => ({ provider, ...scoreProvider(provider, need, language) }))
    .sort((a, b) => b.score - a.score);
}
