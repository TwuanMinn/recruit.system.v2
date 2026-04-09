import type { AppState, AppAction } from './types';
import { STORAGE_KEY } from './constants';

export const initialState: AppState = {
  candidates: [],
  view: 'list',
  selectedCandidate: null,
  showForm: false,
  showInterview: false,
  showEditCandidate: false,
  searchTerm: '',
  filterLevel: 'all',
  filterResult: 'all',
};

function persistCandidates(candidates: AppState['candidates']) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
  } catch {
    // Storage full or unavailable – silently fail
  }
}

export function reducer(state: AppState, action: AppAction): AppState {
  let next: AppState;

  switch (action.type) {
    case 'LOAD_CANDIDATES':
      return { ...state, candidates: action.payload };

    case 'ADD_CANDIDATE':
      next = {
        ...state,
        candidates: [...state.candidates, action.payload],
        showForm: false,
      };
      persistCandidates(next.candidates);
      return next;

    case 'UPDATE_CANDIDATE':
      next = {
        ...state,
        candidates: state.candidates.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
        showInterview: false,
        showEditCandidate: false,
        selectedCandidate: action.payload,
      };
      persistCandidates(next.candidates);
      return next;

    case 'DELETE_CANDIDATE':
      next = {
        ...state,
        candidates: state.candidates.filter((c) => c.id !== action.payload),
        selectedCandidate: null,
        view: 'list',
      };
      persistCandidates(next.candidates);
      return next;

    case 'SELECT':
      return {
        ...state,
        selectedCandidate: action.payload,
        view: 'detail',
        showInterview: false,
        showEditCandidate: false,
      };

    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'TOGGLE_FORM':
      return { ...state, showForm: !state.showForm };

    case 'TOGGLE_INTERVIEW':
      return {
        ...state,
        showInterview: !state.showInterview,
        showEditCandidate: false,
      };

    case 'TOGGLE_EDIT_CANDIDATE':
      return {
        ...state,
        showEditCandidate: !state.showEditCandidate,
        showInterview: false,
      };

    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };

    case 'SET_FILTER_LEVEL':
      return { ...state, filterLevel: action.payload };

    case 'SET_FILTER_RESULT':
      return { ...state, filterResult: action.payload };

    default:
      return state;
  }
}
