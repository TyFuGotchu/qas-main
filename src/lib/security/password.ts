export const PASSWORD_MIN_LENGTH = 10;
export const PASSWORD_MAX_LENGTH = 128;

export const PASSWORD_REQUIREMENTS_HINT =
  "At least 10 characters with uppercase, lowercase, and a number.";

export interface PasswordValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return {
      valid: false,
      error: `Password must be at most ${PASSWORD_MAX_LENGTH} characters`,
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      error: "Password must include a lowercase letter",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must include an uppercase letter",
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      error: "Password must include a number",
    };
  }

  return { valid: true };
}