import React, { useState, useEffect } from "react";
import { DentalService, Appointment } from "../types";
import { CalendarDays, Clock, User, Mail, Phone, Notebook, BadgeCheck, FileText, CheckCircle, ArrowRight } from "lucide-react";

interface AppointmentFormProps {
  services: DentalService[];
  preselectedServiceId: string;
  onBookingSuccess: (newAppt: Appointment) => void;
}

export default function AppointmentForm({ services, preselectedServiceId, onBookingSuccess }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    serviceId: preselectedServiceId || "",
    appointmentDate: "",
    appointmentTime: "",
    notes: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState<Appointment | null>(null);

  // Sync preselectedServiceId when tab is switched/service clicked
  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  // Restrict appointment dates to today + 1 day minimum (tomorrow onwards or today)
  const getMinDateString = () => {
    const today = new Date();
    // Get YYYY-MM-DD
    return today.toISOString().split("T")[0];
  };

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM"
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required.";
    }
    if (!formData.patientEmail.trim() || !/\S+@\S+\.\S+/.test(formData.patientEmail)) {
      newErrors.patientEmail = "A valid email address is required.";
    }
    if (!formData.patientPhone.trim()) {
      newErrors.patientPhone = "Phone number is required for verification.";
    }
    if (!formData.serviceId) {
      newErrors.serviceId = "Please choose a dental treatment.";
    }
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = "Please choose a calendar date.";
    } else {
      // Don't book sundays
      const dateObj = new Date(formData.appointmentDate);
      if (dateObj.getUTCDay() === 0) {
        newErrors.appointmentDate = "Clinic is closed on Sundays. Please choose Mon - Sat.";
      }
    }
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = "Please select a time slot.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || "Failed to save booking.");
      }

      const bookedAppt = (await response.json()) as Appointment;
      setTicket(bookedAppt);
      onBookingSuccess(bookedAppt);

      // Reset form variables
      setFormData({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        serviceId: "",
        appointmentDate: "",
        appointmentTime: "",
        notes: ""
      });
    } catch (err: any) {
      alert("Submission Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj = services.find((s) => s.id === formData.serviceId);

  // If a booking is successful, render the elegant checkin receipt ticket
  if (ticket) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4" id="booking-success-ticket">
        <div className="bg-[#fdfdfb] rounded-3xl border border-natural-border shadow-xl overflow-hidden">
          {/* Header Receipt Card */}
          <div className="bg-[#5A5A40] text-white p-8 text-center relative border-b border-[#D4D9C1]">
            <div className="w-16 h-16 rounded-full bg-[#fdfdfb] text-natural-primary flex items-center justify-center mx-auto mb-4 shadow">
              <CheckCircle className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-serif font-bold">Herbal Treatment Booked</h3>
            <p className="text-[10px] text-natural-secondary mt-1.5 uppercase tracking-widest font-bold">
              Thank you for trusting LuminaSMILES Care
            </p>
            <div className="absolute left-0 right-0 bottom-0 h-4 bg-[#fdfdfb]" style={{ clipPath: "polygon(0% 100%, 5% 40%, 10% 100%, 15% 40%, 20% 100%, 25% 40%, 30% 100%, 35% 40%, 40% 100%, 45% 40%, 50% 100%, 55% 40%, 60% 100%, 65% 40%, 70% 100%, 75% 40%, 80% 100%, 85% 40%, 90% 100%, 95% 40%, 100% 100%)" }}></div>
          </div>

          {/* Ticket Information */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <span className="text-[10px] text-natural-text-gray font-extrabold uppercase tracking-widest">
                Verification Reference ID
              </span>
              <p className="font-mono text-base font-bold text-natural-title mt-1 uppercase tracking-wider">
                {ticket.id}
              </p>
            </div>

            <div className="border-t border-natural-border pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <span className="text-natural-text-gray block uppercase tracking-wider text-[9px]">Patient Name</span>
                  <span className="text-natural-title text-sm mt-0.5 block">{ticket.patientName}</span>
                </div>
                <div>
                  <span className="text-natural-text-gray block uppercase tracking-wider text-[9px]">Phone Number</span>
                  <span className="text-natural-title text-sm mt-0.5 block">{ticket.patientPhone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
                <div>
                  <span className="text-natural-text-gray block uppercase tracking-wider text-[9px]">Target Procedure</span>
                  <span className="text-[#5A5A40] text-sm font-bold mt-0.5 block">{ticket.serviceName}</span>
                </div>
                <div>
                  <span className="text-natural-text-gray block uppercase tracking-wider text-[9px]">Current Status</span>
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-bold uppercase bg-natural-secondary/20 text-natural-primary border border-natural-border px-2 py-0.5 rounded-full mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] animate-pulse"></span>
                    {ticket.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2 border-t border-natural-border pt-4">
                <div>
                  <span className="text-natural-text-gray block uppercase tracking-wider text-[9px]">Appointment Date</span>
                  <span className="text-natural-title text-sm mt-0.5 block">
                    {new Date(ticket.appointmentDate + "T00:00:00").toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-natural-text-gray block uppercase tracking-wider text-[9px]">Time Slot</span>
                  <span className="text-natural-title text-sm mt-0.5 block">{ticket.appointmentTime}</span>
                </div>
              </div>
            </div>

            <div className="bg-natural-bg-gray/80 rounded-2xl p-4 border border-natural-border">
              <span className="text-[10px] text-natural-text-muted font-extrabold uppercase tracking-widest block">
                Next Steps For Patient
              </span>
              <p className="text-xs text-natural-text-muted leading-relaxed mt-1 font-medium">
                Our Patient Coordinator will contact you shortly via <strong className="text-natural-title">{ticket.patientEmail}</strong> to confirm clinical availability and authorize our board checklist. Please save this verification ticket reference for your arrival records.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setTicket(null)}
                className="w-full bg-[#5A5A40] hover:bg-[#4d4d36] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                id="book-another-btn"
              >
                Create Another Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#fdfdfb]" id="booking-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Header Title */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#9a9a8b] font-sans">
            RAPID RESERVATIONS
          </span>
          <h2 className="text-3xl font-serif font-bold text-natural-title tracking-tight mt-1">
            Book Holistic Healing Consult
          </h2>
          <p className="mt-2 text-natural-text-muted text-xs sm:text-xs">
            Reserve your clinical schedule below. Our administrative staff will review and approve.
          </p>
        </div>

        {/* Real Dynamic Booking Form */}
        <form onSubmit={handleSubmit} className="bg-[#f7f7f2] border border-natural-border rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
          
          {/* Patient Bio Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* patient name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
                Full Patient Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#9a9a8b]" />
                <input
                  type="text"
                  placeholder="Johnathan Doe"
                  value={formData.patientName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                  className={`w-full bg-white rounded-xl border pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all ${
                    errors.patientName ? "border-rose-500" : "border-natural-border text-natural-title"
                  }`}
                  id="book-patientName-input"
                />
              </div>
              {errors.patientName && <p className="text-[10px] font-semibold text-rose-500">{errors.patientName}</p>}
            </div>

            {/* patient phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#9a9a8b]" />
                <input
                  type="tel"
                  placeholder="(555) 000-0000"
                  value={formData.patientPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, patientPhone: e.target.value }))}
                  className={`w-full bg-white rounded-xl border pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all ${
                    errors.patientPhone ? "border-rose-500" : "border-natural-border text-natural-title"
                  }`}
                  id="book-patientPhone-input"
                />
              </div>
              {errors.patientPhone && <p className="text-[10px] font-semibold text-rose-500">{errors.patientPhone}</p>}
            </div>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#9a9a8b]" />
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={formData.patientEmail}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientEmail: e.target.value }))}
                className={`w-full bg-white rounded-xl border pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all ${
                  errors.patientEmail ? "border-rose-500" : "border-natural-border text-natural-title"
                }`}
                id="book-patientEmail-input"
              />
            </div>
            {errors.patientEmail && <p className="text-[10px] font-semibold text-rose-500">{errors.patientEmail}</p>}
          </div>

          <div className="border-t border-natural-border my-6"></div>

          {/* Service Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
              Select Biocompatible Treatment Required *
            </label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
              className={`w-full bg-white rounded-xl border px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all ${
                errors.serviceId ? "border-rose-500" : "border-natural-border text-natural-title"
              }`}
              id="book-service-select"
            >
              <option value="">-- Choose a standard dental treatment --</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name} — ({svc.price})
                </option>
              ))}
            </select>
            {selectedServiceObj && (
              <div className="p-3 bg-natural-secondary/20 rounded-xl border border-natural-border flex justify-between items-center text-xs text-natural-primary">
                <span>⚡ Selected care includes: <strong>{selectedServiceObj.duration} duration slot</strong>.</span>
                <span className="font-bold underline">{selectedServiceObj.price} Cash Price</span>
              </div>
            )}
            {errors.serviceId && <p className="text-[10px] font-semibold text-rose-500">{errors.serviceId}</p>}
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Calendar date picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
                Select Clinic Date * (Mon - Sat)
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#9a9a8b]" />
                <input
                  type="date"
                  min={getMinDateString()}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, appointmentDate: e.target.value }))}
                  className={`w-full bg-white rounded-xl border pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all ${
                    errors.appointmentDate ? "border-rose-500" : "border-natural-border text-natural-title"
                  }`}
                  id="book-appointmentDate-input"
                />
              </div>
              {errors.appointmentDate && <p className="text-[10px] font-semibold text-rose-500">{errors.appointmentDate}</p>}
            </div>

            {/* Time slot pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
                Preferred Time Slot *
              </label>
              <select
                value={formData.appointmentTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, appointmentTime: e.target.value }))}
                className={`w-full bg-white rounded-xl border px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all ${
                  errors.appointmentTime ? "border-rose-500" : "border-natural-border text-natural-title"
                }`}
                id="book-appointmentTime-select"
              >
                <option value="">-- Choose Arrival Hour --</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && <p className="text-[10px] font-semibold text-rose-500">{errors.appointmentTime}</p>}
            </div>

          </div>

          {/* Notes area */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-natural-title uppercase tracking-wider font-sans">
              Additional Complaints or Dental History (Optional)
            </label>
            <div className="relative">
              <Notebook className="absolute left-3.5 top-3 w-4.5 h-4.5 text-[#9a9a8b]" />
              <textarea
                rows={3}
                placeholder="Mention any current teeth sensitivity, cosmetic desires, or details about dental insurance..."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-white rounded-xl border border-natural-border pl-11 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all text-natural-title"
                id="book-notes-textarea"
              />
            </div>
          </div>

          {/* Submission button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:opacity-50"
            id="book-submit-btn"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
                Transmitting Clinical File...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Register Appointment Slot
                <ArrowRight className="w-4 h-4 text-natural-secondary" />
              </span>
            )}
          </button>
        </form>

      </div>
    </section>
  );
}
