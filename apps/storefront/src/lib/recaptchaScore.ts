/** Pure score gate for reCAPTCHA v3 (safe on server + client). */
export function captchaPassed(success: boolean, score: number, minScore: number): boolean {
  return success && score >= minScore
}
