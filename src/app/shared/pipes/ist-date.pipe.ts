import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Formats timestamps as Indian Standard Time (IST).
 * SQLite CURRENT_TIMESTAMP values are UTC without a "Z" suffix — we normalize those first.
 *
 * Default output (two lines):
 *   03/07/2026
 *   09:35:12 PM IST
 */
@Pipe({ name: 'istDate', standalone: true, pure: true })
export class IstDatePipe implements PipeTransform {
  private datePipe = new DatePipe('en-IN');

  transform(value: string | Date | null | undefined, format?: string): string {
    if (!value) return '';
    const date = this.normalize(value);
    if (isNaN(date.getTime())) return '';

    if (format) {
      const formatted = this.datePipe.transform(date, format, 'Asia/Kolkata');
      return formatted ? `${formatted} IST` : '';
    }

    const datePart = this.datePipe.transform(date, 'dd/MM/yyyy', 'Asia/Kolkata') ?? '';
    const timePart = this.datePipe.transform(date, 'hh:mm:ss a', 'Asia/Kolkata') ?? '';
    return `${datePart}\n${timePart} IST`;
  }

  private normalize(value: string | Date): Date {
    if (value instanceof Date) return value;
    const isUnzonedTimestamp = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}(\.\d+)?$/.test(value);
    const normalized = isUnzonedTimestamp ? `${value.replace(' ', 'T')}Z` : value;
    return new Date(normalized);
  }
}
