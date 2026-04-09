import { useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import { exportAllCSV, importCSV, deduplicateCandidates } from '../csv';
import { useCandidateStore } from '../store/useCandidateStore';
import type { Candidate } from '../types';

export function useExport() {
  const candidates = useCandidateStore((s) => s.candidates);
  const batchAddCandidates = useCandidateStore((s) => s.batchAddCandidates);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    const total = candidates.length;
    const confirmed = candidates.filter((c) => c.interviewStatus === 'Confirmed').length;
    const denied = candidates.filter((c) => c.interviewStatus === 'Rejected').length;
    const noResponse = candidates.filter((c) => c.interviewStatus === 'No Response').length;
    const senior = candidates.filter((c) => c.level === 'Senior').length;
    const beginner = candidates.filter((c) => c.level === 'Beginner').length;
    const newbie = candidates.filter((c) => c.level === 'Newbie').length;
    const hired = candidates.filter((c) => c.interview?.result === 'Hired').length;
    const potential = candidates.filter((c) => c.interview?.result === 'Potential Talented').length;
    const rejected = candidates.filter((c) => c.interview?.result === 'Rejected').length;
    const future = candidates.filter((c) => c.interview?.result === 'Future Consideration').length;
    const exportDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    doc.setFillColor(77, 73, 217);
    doc.rect(0, 0, 210, 22, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recruitment Report', 14, 14);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${exportDate}`, 196, 14, { align: 'right' });

    doc.setTextColor(30, 30, 60);

    autoTable(doc, {
      head: [['Overview', 'Count', '%']],
      body: [
        ['Total Candidates', String(total), '100%'],
        ['Confirmed', String(confirmed), total ? `${Math.round((confirmed / total) * 100)}%` : '0%'],
        ['Denied', String(denied), total ? `${Math.round((denied / total) * 100)}%` : '0%'],
        ['No Response', String(noResponse), total ? `${Math.round((noResponse / total) * 100)}%` : '0%'],
      ],
      startY: 28,
      margin: { left: 14, right: 110 },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [77, 73, 217], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'center' } },
    });

    autoTable(doc, {
      head: [['Level', 'Count', '%']],
      body: [
        ['Senior', String(senior), total ? `${Math.round((senior / total) * 100)}%` : '0%'],
        ['Beginner', String(beginner), total ? `${Math.round((beginner / total) * 100)}%` : '0%'],
        ['Newbie', String(newbie), total ? `${Math.round((newbie / total) * 100)}%` : '0%'],
      ],
      startY: 28,
      margin: { left: 110, right: 14 },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2.5 },
      headStyles: { fillColor: [56, 189, 248], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 1: { halign: 'center' }, 2: { halign: 'center' } },
    });

    const resultsY = (doc as Record<string, any>).lastAutoTable.finalY + 6;
    autoTable(doc, {
      head: [['Application Results', 'Hired', 'Potential Talented', 'Rejected', 'Future Consideration']],
      body: [
        [
          'Count',
          String(hired),
          String(potential),
          String(rejected),
          String(future),
        ],
        [
          '%',
          total ? `${Math.round((hired / total) * 100)}%` : '0%',
          total ? `${Math.round((potential / total) * 100)}%` : '0%',
          total ? `${Math.round((rejected / total) * 100)}%` : '0%',
          total ? `${Math.round((future / total) * 100)}%` : '0%',
        ],
      ],
      startY: resultsY,
      margin: { left: 14, right: 14 },
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2.5, halign: 'center' },
      headStyles: { fillColor: [34, 197, 94], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 0: { halign: 'left', fontStyle: 'bold' } },
    });

    const tableStartY = (doc as Record<string, any>).lastAutoTable.finalY + 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(77, 73, 217);
    doc.text('Candidate Details', 14, tableStartY);
    doc.setDrawColor(77, 73, 217);
    doc.setLineWidth(0.4);
    doc.line(14, tableStartY + 2, 196, tableStartY + 2);

    const tableColumn = ['Name', 'Email', 'Phone', 'Level', 'Status', 'Result', 'Exp (yrs)', 'Salary'];
    const tableRows: string[][] = candidates.map((cand: Candidate) => [
      cand.name,
      cand.gmail,
      cand.phone,
      cand.level,
      cand.interviewStatus === 'Rejected' ? 'Denied' : (cand.interviewStatus || 'No Response'),
      cand.interview?.result || 'N/A',
      cand.interview?.yearsExp || '',
      cand.interview?.salaryExpectation ? `${cand.interview.salaryExpectation} (${cand.interview.salaryType})` : '',
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY + 5,
      theme: 'striped',
      styles: { fontSize: 7.5, cellPadding: 2.5 },
      headStyles: { fillColor: [77, 73, 217], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 255] },
    });

    doc.save(`recruitment_report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported successfully');
  }, [candidates]);

  const handleExportCSV = useCallback(() => {
    exportAllCSV(candidates);
    toast.success('CSV exported successfully');
  }, [candidates]);

  const handleExportExcel = useCallback(() => {
    const rows = candidates.map((c: Candidate) => ({
      Name: c.name,
      Email: c.gmail,
      Phone: c.phone,
      Level: c.level,
      Gender: c.gender,
      'Int. Status': c.interviewStatus || 'No Response',
      'Interview Result': c.interview?.result || '',
      'Years Exp': c.interview?.yearsExp || '',
      'Salary Expectation': c.interview?.salaryExpectation || '',
      'Salary Type': c.interview?.salaryType || '',
      'Created At': c.createdAt,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
    XLSX.writeFile(wb, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Excel exported successfully');
  }, [candidates]);

  const handleImportCSV = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onCSVFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importCSV(file);
      const { unique, duplicates, intraDuplicates } = deduplicateCandidates(imported, candidates);

      if (unique.length > 0) {
        batchAddCandidates(unique);
      }

      const skipped = duplicates.length + intraDuplicates.length;
      if (unique.length > 0 && skipped === 0) {
        toast.success(`Imported ${unique.length} candidates`);
      } else if (unique.length > 0 && skipped > 0) {
        toast.success(`Imported ${unique.length} new candidates, ${skipped} duplicate${skipped > 1 ? 's' : ''} skipped`);
      } else if (unique.length === 0 && skipped > 0) {
        toast(`All ${skipped} candidate${skipped > 1 ? 's' : ''} already exist — nothing imported`, { icon: '⚠️' });
      } else {
        toast.error('No valid candidates found in CSV');
      }
    } catch {
      toast.error('Failed to import CSV file');
    }
    e.target.value = '';
  }, [candidates, batchAddCandidates]);

  return {
    fileInputRef,
    exportToPDF,
    handleExportCSV,
    handleExportExcel,
    handleImportCSV,
    onCSVFileSelected,
  };
}
