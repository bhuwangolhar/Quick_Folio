/**
 * Retry wrapper for async functions
 * @param fn - Async function to retry
 * @param retries - Number of retries (default 5)
 * @param delay - Delay between retries in ms (default 2000)
 * @returns Result of the function or throws if all retries fail
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 5,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return fetchWithRetry(fn, retries - 1, delay);
  }
}
