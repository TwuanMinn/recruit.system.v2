// ===== Core Types =====

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
}

export interface AppState {
  candidates: Candidate[];
  view: 'list' | 'detail';
  selectedCandidate: Candidate | null;
  showForm: boolean;
  showInterview: boolean;
  showEditCandidate: boolean;
  searchTerm: string;
  filterLevel: 'all' | Level;
  filterResult: 'all' | ResultValue | '';
}

export type AppAction =
  | { type: 'ADD_CANDIDATE'; payload: Candidate }
  | { type: 'UPDATE_CANDIDATE'; payload: Candidate }
  | { type: 'DELETE_CANDIDATE'; payload: string }
  | { type: 'SELECT'; payload: Candidate }
  | { type: 'SET_VIEW'; payload: 'list' | 'detail' }
  | { type: 'TOGGLE_FORM' }
  | { type: 'TOGGLE_INTERVIEW' }
  | { type: 'TOGGLE_EDIT_CANDIDATE' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER_LEVEL'; payload: 'all' | Level }
  | { type: 'SET_FILTER_RESULT'; payload: 'all' | ResultValue | '' }
  | { type: 'LOAD_CANDIDATES'; payload: Candidate[] };

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
