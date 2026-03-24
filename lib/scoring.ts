/** Maps raw score ratio to displayed pass probability (0–100). */
export function scoreToPassProbability(correct: number, total: number): number {
  if (total <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, correct / total));
  // Simple MVP curve: emphasize preparation gap without being harsh at low scores
  const adjusted = Math.round(ratio * 92 + 4);
  return Math.min(100, Math.max(0, adjusted));
}
