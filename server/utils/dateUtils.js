/**
 * Date Utility Functions for Bill Scheduling and Calculations
 */

/**
 * Formats a Date object or ISO string to YYYY-MM-DD format
 * @param {Date|string|number} date 
 * @returns {string} YYYY-MM-DD
 */
export function toDateString(date) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date passed to toDateString: ${date}`);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Adds integer number of days to a date
 * @param {Date|string|number} date 
 * @param {number} days 
 * @returns {Date}
 */
export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Number(days));
  return d;
}

/**
 * Computes difference in calendar days between two dates (date2 - date1)
 * @param {Date|string|number} date1 
 * @param {Date|string|number} date2 
 * @returns {number}
 */
export function diffInDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const msDiff = d2.getTime() - d1.getTime();
  return Math.round(msDiff / (1000 * 60 * 60 * 24));
}

/**
 * Checks if targetDate has passed relative to referenceDate (date < reference)
 * @param {Date|string} targetDate 
 * @param {Date|string} referenceDate 
 * @returns {boolean}
 */
export function isPastDate(targetDate, referenceDate = new Date()) {
  const tStr = toDateString(targetDate);
  const refStr = toDateString(referenceDate);
  return tStr < refStr;
}

/**
 * Checks if two dates fall on the same calendar day
 * @param {Date|string} dateA 
 * @param {Date|string} dateB 
 * @returns {boolean}
 */
export function isSameDay(dateA, dateB) {
  return toDateString(dateA) === toDateString(dateB);
}

