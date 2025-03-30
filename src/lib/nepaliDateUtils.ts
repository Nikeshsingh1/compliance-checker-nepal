
import NepaliDate from 'nepali-date-converter';
import { format as formatDate } from 'date-fns';

export function toNepaliDate(date: Date): NepaliDate {
  return new NepaliDate(date);
}

export function formatNepaliDate(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  return `${nepaliDate.getBS().year} ${nepaliDate.getMonthName()} ${nepaliDate.getDate()}`;
}

export function formatNepaliDateShort(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  return `${nepaliDate.getBS().year}-${nepaliDate.getBS().month + 1}-${nepaliDate.getDate()}`;
}

export function formatNepaliDateWithEnglish(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  const englishDate = formatDate(date, 'MMM d, yyyy');
  return `${nepaliDate.getBS().year} ${nepaliDate.getMonthName()} ${nepaliDate.getDate()} (${englishDate})`;
}

export function getNepaliMonthName(date: Date): string {
  const nepaliDate = toNepaliDate(date);
  return nepaliDate.getMonthName();
}

export function getNepaliYear(date: Date): number {
  const nepaliDate = toNepaliDate(date);
  return nepaliDate.getBS().year;
}

export function getNepaliDay(date: Date): number {
  const nepaliDate = toNepaliDate(date);
  return nepaliDate.getDate();
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

