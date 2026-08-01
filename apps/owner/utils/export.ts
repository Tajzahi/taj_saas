import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function exportToExcel(data: any[], filename: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
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
