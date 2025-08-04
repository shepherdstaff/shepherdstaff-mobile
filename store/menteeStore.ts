import { create } from 'zustand';
import { Mentee, Meeting, PrayerRequest } from '@/types/mentee';
import { menteeAPI } from '@/services/menteeAPI';

interface MenteeStore {
  mentees: Mentee[];
  loading: boolean;
  error: string | null;
  
  // Data fetching
  fetchMentees: () => Promise<void>;
  
  // Local state management
  addMentee: (mentee: Mentee) => void;
  updateMeeting: (menteeId: string, meeting: Meeting) => void;
  addPrayerRequest: (menteeId: string, request: PrayerRequest) => void;
  updatePrayerRequest: (menteeId: string, requestId: string, isAnswered: boolean) => void;
  
  // API operations
  createMentee: (mentee: Omit<Mentee, 'id'>) => Promise<void>;
  updateMenteeData: (id: string, mentee: Partial<Mentee>) => Promise<void>;
  createMeeting: (meeting: Omit<Meeting, 'id'>) => Promise<void>;
  updateMeetingData: (id: string, meeting: Partial<Meeting>) => Promise<void>;
}

export const useMenteeStore = create<MenteeStore>((set, get) => ({
  mentees: [],
  loading: false,
  error: null,

  // Fetch mentees from API
  fetchMentees: async () => {
    set({ loading: true, error: null });
    try {
      const mentees = await menteeAPI.getMentees();
      set({ mentees, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch mentees',
        loading: false 
      });
    }
  },

  // Local state management
  addMentee: (mentee) =>
    set((state) => ({
      mentees: [...state.mentees, mentee],
    })),

  updateMeeting: (menteeId, meeting) =>
    set((state) => ({
      mentees: state.mentees.map((mentee) =>
        mentee.id === menteeId
          ? {
              ...mentee,
              meetings: mentee.meetings.map((m) =>
                m.id === meeting.id ? meeting : m
              ),
            }
          : mentee
      ),
    })),

  addPrayerRequest: (menteeId, request) =>
    set((state) => ({
      mentees: state.mentees.map((mentee) =>
        mentee.id === menteeId
          ? {
              ...mentee,
              prayerRequests: [...mentee.prayerRequests, request],
            }
          : mentee
      ),
    })),

  updatePrayerRequest: (menteeId, requestId, isAnswered) =>
    set((state) => ({
      mentees: state.mentees.map((mentee) =>
        mentee.id === menteeId
          ? {
              ...mentee,
              prayerRequests: mentee.prayerRequests.map((request) =>
                request.id === requestId
                  ? { ...request, isAnswered, dateAnswered: new Date().toISOString() }
                  : request
              ),
            }
          : mentee
      ),
    })),

  // API operations
  createMentee: async (menteeData) => {
    set({ loading: true, error: null });
    try {
      const newMentee = await menteeAPI.createMentee(menteeData);
      set((state) => ({
        mentees: [...state.mentees, newMentee],
        loading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create mentee',
        loading: false 
      });
    }
  },

  updateMenteeData: async (id, menteeData) => {
    set({ loading: true, error: null });
    try {
      const updatedMentee = await menteeAPI.updateMentee(id, menteeData);
      set((state) => ({
        mentees: state.mentees.map((mentee) =>
          mentee.id === id ? updatedMentee : mentee
        ),
        loading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update mentee',
        loading: false 
      });
    }
  },

  createMeeting: async (meetingData) => {
    set({ loading: true, error: null });
    try {
      const newMeeting = await menteeAPI.createMeeting(meetingData);
      set((state) => ({
        mentees: state.mentees.map((mentee) =>
          mentee.id === newMeeting.menteeId
            ? { ...mentee, meetings: [...mentee.meetings, newMeeting] }
            : mentee
        ),
        loading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create meeting',
        loading: false 
      });
    }
  },

  updateMeetingData: async (id, meetingData) => {
    set({ loading: true, error: null });
    try {
      const updatedMeeting = await menteeAPI.updateMeeting(id, meetingData);
      get().updateMeeting(updatedMeeting.menteeId, updatedMeeting);
      set({ loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update meeting',
        loading: false 
      });
    }
  },
}));