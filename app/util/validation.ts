export function validateDisplayName(displayName: unknown): displayName is string {
  return typeof displayName === 'string' && displayName.length > 3
}

export function validateEmail(email: unknown): email is string {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}
