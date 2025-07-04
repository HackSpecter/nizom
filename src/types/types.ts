export interface FormData {
  name: string;
  contact: string;
  instagram: string;
  expectations: string;
  submissionDate: string;
  id: string;
}

export interface AdminFilters {
  startDate: string;
  endDate: string;
  searchTerm: string;
  status?: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'contacted';

export interface Submission {
  id: string;
  name: string;
  contact: string;
  instagram: string;
  expectations: string;
  status: SubmissionStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}