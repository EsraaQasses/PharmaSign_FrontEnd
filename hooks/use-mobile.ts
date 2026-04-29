/**
 * useIsMobile hook.
 *
 * In React Native, we are ALWAYS on mobile.
 * This hook exists for compatibility with components
 * that conditionally render based on platform.
 */
export function useIsMobile() {
  return true;
}
