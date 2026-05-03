/**
 * Normalizes phone numbers to Syrian local format (09xxxxxxxx).
 * 
 * If user enters 9xxxxxxxx, it adds 0.
 * If user enters 09xxxxxxxx, it keeps it.
 * Rejects other formats by returning as is (validation handles validity).
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return "";
  let trimmed = phone.trim();
  
  // Remove +963 if present
  if (trimmed.startsWith("+963")) {
    trimmed = trimmed.substring(4);
  }
  
  // Convert 9xxxxxxxx to 09xxxxxxxx
  if (trimmed.length === 9 && trimmed.startsWith("9")) {
    return `0${trimmed}`;
  }
  
  return trimmed;
};
