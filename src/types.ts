// ===== Core Types =====

export type ActivityAction =
  | 'created'
  | 'status_changed'
  | 'level_changed'
  | 'profile_updated'
  | 'assessment_recorded'
  | 'assessment_updated'
  | 'result_changed'
  | 'deleted'
  | 'restored';

export interface ActivitySnapshot {
  result?: string;
  interviewStatus?: string;
  level?: string;
  yearsExp?: string;
  salaryExpectation?: string;
  salaryType?: 'monthly' | 'yearly';
  skill?: string;
}

export interface ActivityLogEntry {
  action: ActivityAction;
  timestamp: string;
  details?: string;
  snapshot?: ActivitySnapshot;
}

export interface Interview {
  strength: string;
  weakness: string;
  background: string;
  skill: string;
  yearsExp: string;
  result: ResultValue | '';
  note: string;
  interviewDate: string;
  salaryExpectation: string;
  salaryType: 'monthly' | 'yearly';
}

export type Level = 'Senior' | 'Beginner' | 'Newbie';
export type Gender = 'Male' | 'Female' | 'Other';
export type InterviewStatus = 'Confirmed' | 'Rejected' | 'No Response';
export type ResultValue =
  | 'Potential Talented'
  | 'Hired'
  | 'Rejected'
  | 'Future Consideration';

export type SortField = 'name' | 'level' | 'status' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface Candidate {
  id: string;
  name: string;
  phone: string;
  gmail: string;
  linkCV: string;
  level: Level;
  gender: Gender;
  interviewStatus: InterviewStatus;
  interviewConfirmed: boolean;
  createdAt: string;
  interview: Interview | null;
  activityLog: ActivityLogEntry[];
}



// ===== Design Tokens =====

export interface ColorSet {
  bg: string;
  text: string;
  border?: string;
  icon?: string;
}

export interface ResultOption {
  value: ResultValue | '';
  label: string;
}
