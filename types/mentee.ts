export type MeetingStatus = 'pending' | 'rejected' | 'completed';

export interface Meeting {
  id: string;
  menteeId: string;
  dateTime: string;
  status: MeetingStatus;
  notes?: string;
}

export interface PrayerRequest {
  id: string;
  menteeId: string;
  request: string;
  dateCreated: string;
  isAnswered: boolean;
  dateAnswered?: string;
}

export interface Mentee {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  preferredFrequency: number; // in days
  lastMeetingDate?: string;
  nextRecommendedDate?: string;
  meetings: Meeting[];
  prayerRequests: PrayerRequest[];
  unavailableTimes: {
    dayOfWeek?: number;
    weekOfMonth?: number;
    specificDates?: string[];
  };
}