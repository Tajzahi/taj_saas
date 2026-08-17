import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Sanitizes a cell string to prevent CSV/Excel Formula Injection (SEC-015).
 * Prepends a single quote if the field starts with '=', '+', '-', '@', '\t', or '\r'.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  
  // Prefix dangerous formula characters
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  
  // Escape inner double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

export function buildCsvString(data: Record<string, unknown>[]): string {
  if (!data || data.length === 0) return '\uFEFF';

  const headers = Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(headers.map(sanitizeCsvCell).join(','));

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => sanitizeCsvCell(row[header]));
    csvRows.push(values.join(','));
  }

  return '\uFEFF' + csvRows.join('\r\n');
}

/**
 * Exports JSON array to Excel-compatible CSV file with UTF-8 BOM and formula sanitization.
 */
export function exportToExcel(data: Record<string, unknown>[], filename: string) {
  if (!data || data.length === 0) return;

  const csvContent = buildCsvString(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPDF(columns: string[], data: any[][], filename: string, title?: string) {
  const doc = new jsPDF();
  
  if (title) {
    doc.setFontSize(14);
    doc.text(title, 14, 15);
  }
  
  autoTable(doc, {
    startY: title ? 20 : 14,
    head: [columns],
    body: data,
    theme: 'grid',
    headStyles: { fillColor: [249, 115, 22] }, // orange-500
    styles: { fontSize: 8 },
  });

  doc.save(`${filename}.pdf`);
}
