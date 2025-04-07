
/**
 * Common utility functions
 */

// Generate a proper UUID for database compatibility
export function generateUUID(): string {
  return crypto.randomUUID();
}
