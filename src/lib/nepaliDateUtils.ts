
import NepaliDate from 'nepali-date-converter';
import { format as formatDate } from 'date-fns';

export function toNepaliDate(date: Date): NepaliDate {
  return new NepaliDate(date);
}

export function formatNepaliDate(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  return `${nepaliDate.getBS().year} ${nepaliMonths[nepaliDate.getBS().month]} ${nepaliDate.getBS().day}`;
}

export function formatNepaliDateShort(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  return `${nepaliDate.getBS().year}-${nepaliDate.getBS().month + 1}-${nepaliDate.getBS().day}`;
}

export function formatNepaliDateWithEnglish(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  const englishDate = formatDate(date, 'MMM d, yyyy');
  return `${nepaliDate.getBS().year} ${nepaliMonths[nepaliDate.getBS().month]} ${nepaliDate.getBS().day} (${englishDate})`;
}

export function getNepaliMonthName(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  return nepaliMonths[nepaliDate.getBS().month];
}

export function getNepaliYear(date: Date): number {
  const nepaliDate = toNepaliDate(date);
  return nepaliDate.getBS().year;
}

export function getNepaliDay(date: Date): number {
  const nepaliDate = toNepaliDate(date);
  return nepaliDate.getBS().day;
}

export function getNepaliDateObject(date: Date): { year: number; month: number; day: number } {
  const nepaliDate = toNepaliDate(date);
  return {
    year: nepaliDate.getBS().year,
    month: nepaliDate.getBS().month,
    day: nepaliDate.getBS().day
  };
}

export function getEnglishDateFromNepaliBS(year: number, month: number, day: number): Date {
  try {
    const nepaliDate = new NepaliDate(year, month, day);
    return nepaliDate.toJsDate(); // Fixed: changed toJSDate to toJsDate
  } catch (error) {
    console.error("Invalid Nepali date", error);
    return new Date();
  }
}

export function getNepaliMonthDays(year: number, month: number): number {
  // Get the number of days in the given Nepali month
  const daysInMonth = [31, 31, 31, 32, 31, 31, 30, 30, 29, 30, 29, 31]; // Default for most years
  
  // Some years might have different days in certain months
  // This is a simplified version; a complete implementation would need to check specific exceptions
  return daysInMonth[month];
}

export function getFirstDayOfNepaliMonth(year: number, month: number): number {
  // Get the weekday (0-6) of the first day of the given Nepali month
  // This is an approximation, as the actual calculation is complex
  const nepaliDate = new NepaliDate(year, month, 1);
  const jsDate = nepaliDate.toJsDate(); // Fixed: changed toJSDate to toJsDate
  return jsDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
}

export const nepaliMonths = [
  'Baishakh', 
  'Jestha', 
  'Ashadh', 
  'Shrawan', 
  'Bhadra', 
  'Ashwin', 
  'Kartik', 
  'Mangsir', 
  'Poush', 
  'Magh', 
  'Falgun', 
  'Chaitra'
];

export const nepaliWeekdays = [
  'आइतबार', // Sunday
  'सोमबार', // Monday
  'मंगलबार', // Tuesday
  'बुधबार', // Wednesday
  'बिहिबार', // Thursday
  'शुक्रबार', // Friday
  'शनिबार'  // Saturday
];
