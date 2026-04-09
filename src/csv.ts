import type { Candidate, Level, Gender, InterviewStatus } from './types';

export function exportAllCSV(candidates: Candidate[]): void {
  const headers = ['Name', 'Email', 'Phone', 'Level', 'Gender', 'Interview Status', 'Result', 'Interview Date', 'Years Exp', 'Salary Expectation', 'Salary Type', 'Created At'];

  const rows = candidates.map((c) => [
    escapeCsv(c.name),
    escapeCsv(c.gmail),
    escapeCsv(c.phone),
    c.level,
    c.gender,
    c.interviewStatus,
    c.interview?.result || '',
    c.interview?.interviewDate || '',
    c.interview?.yearsExp || '',
    c.interview?.salaryExpectation || '',
    c.interview?.salaryType || '',
    c.createdAt,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const validLevels: Level[] = ['Senior', 'Beginner', 'Newbie'];
const validGenders: Gender[] = ['Male', 'Female', 'Other'];
const validStatuses: InterviewStatus[] = ['Confirmed', 'Rejected', 'No Response'];

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

export interface ImportResult {
  unique: Candidate[];
  duplicates: Candidate[];
  intraDuplicates: Candidate[];
}

export function deduplicateCandidates(
  incoming: Candidate[],
  existing: Candidate[]
): ImportResult {
  const existingEmails = new Set(existing.map((c) => c.gmail.toLowerCase()));
  const existingPhones = new Set(existing.map((c) => c.phone.replace(/\D/g, '')));

  const seenEmails = new Set<string>();
  const unique: Candidate[] = [];
  const duplicates: Candidate[] = [];
  const intraDuplicates: Candidate[] = [];

  for (const candidate of incoming) {
    const email = candidate.gmail.toLowerCase();
    const phone = candidate.phone.replace(/\D/g, '');

    if (existingEmails.has(email) || (phone && existingPhones.has(phone))) {
      duplicates.push(candidate);
    } else if (seenEmails.has(email)) {
      intraDuplicates.push(candidate);
    } else {
      seenEmails.add(email);
      unique.push(candidate);
    }
  }

  return { unique, duplicates, intraDuplicates };
}

export function importCSV(file: File): Promise<Candidate[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter((l) => l.trim());
        if (lines.length < 2) {
          reject(new Error('CSV file is empty'));
          return;
        }

        const candidates: Candidate[] = [];
        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          if (cols.length < 3) continue;

          const name = cols[0]?.trim();
          const gmail = cols[1]?.trim();
          const phone = cols[2]?.trim();
          if (!name || !gmail || !phone) continue;

          const level = validLevels.includes(cols[3]?.trim() as Level) ? (cols[3].trim() as Level) : 'Beginner';
          const gender = validGenders.includes(cols[4]?.trim() as Gender) ? (cols[4].trim() as Gender) : 'Other';
          const status = validStatuses.includes(cols[5]?.trim() as InterviewStatus)
            ? (cols[5].trim() as InterviewStatus)
            : 'No Response';

          candidates.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
            name,
            gmail,
            phone,
            linkCV: '',
            level,
            gender,
            interviewStatus: status,
            interviewConfirmed: status === 'Confirmed',
            createdAt: new Date().toISOString(),
            interview: null,
            activityLog: [],
          });
        }
        resolve(candidates);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
