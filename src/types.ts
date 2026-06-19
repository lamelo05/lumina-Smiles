export interface DentalService {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  category: 'preventive' | 'cosmetic' | 'restorative' | 'consultation';
  popular?: boolean;
}

export type AppointmentStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM (or specific slots, e.g., "09:00 AM")
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}
