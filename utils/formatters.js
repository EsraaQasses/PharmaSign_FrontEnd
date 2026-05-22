/**
 * Normalizes Arabic-Indic numerals (٠-٩) to Western/English numerals (0-9).
 * Also normalizes Eastern Arabic-Indic numerals (۰-۹) used in Persian/Urdu just in case.
 */
export const normalizeArabicNumerals = (str) => {
  if (!str) return "";
  
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  const easternNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  
  return str.replace(/[٠-٩]/g, (w) => arabicNumbers.indexOf(w))
            .replace(/[۰-۹]/g, (w) => easternNumbers.indexOf(w));
};

/**
 * Parses and normalizes birth dates to YYYY-MM-DD.
 * Accepts DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, YYYY/MM/DD.
 * Converts Arabic numerals to English numerals first.
 * Validates actual calendar days.
 */
export const parseAndNormalizeDate = (dateStr) => {
  if (!dateStr) return null;
  const normalized = normalizeArabicNumerals(dateStr).trim();
  
  const ddMMyyyy = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/;
  const yyyyMMdd = /^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/;
  
  let day, month, year;
  
  let match = normalized.match(ddMMyyyy);
  if (match) {
    day = parseInt(match[1], 10);
    month = parseInt(match[2], 10);
    year = parseInt(match[3], 10);
  } else {
    match = normalized.match(yyyyMMdd);
    if (match) {
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10);
      day = parseInt(match[3], 10);
    } else {
      return null;
    }
  }
  
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;
  if (year < 1900 || year > 2100) return null;
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return null;
  
  const formattedMonth = month.toString().padStart(2, '0');
  const formattedDay = day.toString().padStart(2, '0');
  
  return `${year}-${formattedMonth}-${formattedDay}`;
};

