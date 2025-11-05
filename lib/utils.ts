import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slug from 'slugify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export const slugify = (str: string): string => {
  // const slug = str
  //   .trim() // Remove leading/trailing whitespace
  //   .replace(/\s+/g, '-') // Replace one or more whitespace chars with single hyphen
  //   .replace(/[*+~.()'"!:@]/g, '') // Remove special characters
  //   .toLowerCase();
  return slug(str, {
    replacement: '-',
    lower: true,
    trim: true
  });
};
