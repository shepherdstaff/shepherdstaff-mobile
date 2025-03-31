import { create } from 'zustand';
import { Mentee, Meeting, PrayerRequest } from '@/types/mentee';

interface MenteeStore {
  mentees: Mentee[];
  addMentee: (mentee: Mentee) => void;
  updateMeeting: (menteeId: string, meeting: Meeting) => void;
  addPrayerRequest: (menteeId: string, request: PrayerRequest) => void;
  updatePrayerRequest: (menteeId: string, requestId: string, isAnswered: boolean) => void;
}

export const useMenteeStore = create<MenteeStore>((set) => ({
  mentees: [],
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
}));