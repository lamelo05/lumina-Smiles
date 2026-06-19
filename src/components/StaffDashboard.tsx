import React, { useState, useEffect } from "react";
import { Appointment, DentalService, AppointmentStatus } from "../types";
import {
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Calendar,
  Clock,
  User,
  Shield,
  Briefcase,
  TrendingUp,
  Activity,
  AlertCircle,
  Sparkles,
  ClipboardList,
  Edit,
  DollarSign,
  Undo
} from "lucide-react";

interface StaffDashboardProps {
  services: DentalService[];
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  isAuthenticated: boolean;
  onLoginSuccess: () => void;
}

export default function StaffDashboard({
  services,
  appointments,
  setAppointments,
  isAuthenticated,
  onLoginSuccess
}: StaffDashboardProps) {
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0,
    revenue: 0
  });

  // Editor states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    serviceId: "",
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
    status: "" as AppointmentStatus
  });

  // Calculate statistics from appointment state
  useEffect(() => {
    let pending = 0;
    let approved = 0;
    let completed = 0;
    let revenue = 0;

    appointments.forEach((appt) => {
      if (appt.status === "pending") pending++;
      if (appt.status === "approved") approved++;
      if (appt.status === "completed") completed++;

      // calculate earnings from service price mapping
      const svc = services.find((s) => s.id === appt.serviceId);
      if (svc && (appt.status === "approved" || appt.status === "completed")) {
        const priceNum = parseInt(svc.price.replace(/[^0-9]/g, ""));
        if (!isNaN(priceNum)) {
          revenue += priceNum;
        }
      }
    });

    setStats({
      total: appointments.length,
      pending,
      approved,
      completed,
      revenue
    });
  }, [appointments, services]);

  // Handle staff credentials verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) {
      setLoginError("Please enter the system passcode.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const response = await fetch("/api/staff/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: passwordInput })
      });

      if (!response.ok) {
        throw new Error("Invalid passcode. Please try again.");
      }

      onLoginSuccess();
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Staff Action: Update Status
  const handleUpdateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Could not update status.");
      
      const updatedAppt = (await response.json()) as Appointment;
      setAppointments((prev) => prev.map((a) => (a.id === id ? updatedAppt : a)));
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Staff Action: Delete Appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this appointment from records?")) return;

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Could not delete record.");

      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (editingId === id) setEditingId(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // open edit modal inline
  const startEditing = (appt: Appointment) => {
    setEditingId(appt.id);
    setEditForm({
      patientName: appt.patientName,
      patientPhone: appt.patientPhone,
      patientEmail: appt.patientEmail,
      serviceId: appt.serviceId,
      appointmentDate: appt.appointmentDate,
      appointmentTime: appt.appointmentTime,
      notes: appt.notes || "",
      status: appt.status
    });
  };

  // save inline editing
  const saveEditing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      const response = await fetch(`/api/appointments/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error("Could not update appointment details.");

      const updated = (await response.json()) as Appointment;
      setAppointments((prev) => prev.map((a) => (a.id === editingId ? updated : a)));
      setEditingId(null);
    } catch (err: any) {
      alert("Error saving: " + err.message);
    }
  };

  // Search and Filter records
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.patientPhone.includes(searchTerm) ||
      appt.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Auth Guard Screen (Sign In page)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 px-4" id="staff-auth-screen">
        <div className="bg-[#fdfdfb] rounded-3xl border border-natural-border p-8 shadow-xl">
          <div className="text-center space-y-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-natural-secondary/20 border border-natural-border flex items-center justify-center text-natural-primary mx-auto">
              <Shield className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-natural-title tracking-tight">Staff Portal Access</h3>
              <p className="text-xs text-natural-text-muted mt-1 font-sans">Authorized clinical staff verification only.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 font-sans">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-natural-title uppercase tracking-wider">
                Enter Clinic Passcode *
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white border border-natural-border rounded-xl px-4 py-3 text-sm font-semibold text-natural-title focus:ring-2 focus:ring-[#5A5A40]/10 focus:border-[#5A5A40] focus:outline-none transition-all"
                id="staff-passcode-input"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-1.5 items-center text-rose-800 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-[#5A5A40] hover:bg-[#4d4d36] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
              id="staff-login-submit"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4"></span>
                  Validating Credentials...
                </span>
              ) : (
                "Authorize Sign-In"
              )}
            </button>
          </form>

          {/* User-friendly indicator helpful for reviewing/previewing */}
          <div className="mt-8 pt-5 border-t border-dashed border-natural-border text-center font-sans">
            <p className="text-xs font-bold text-[#c47c4d] bg-[#c47c4d]/10 border border-[#c47c4d]/20 rounded-xl p-3 inline-block">
              🔑 Demo Access Code: <span className="font-bold underline text-natural-title">smile123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Staff Dashboard Area
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10" id="staff-admin-dashboard">
      
      {/* Title head */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-natural-border pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-natural-primary font-sans">
            Internal Operations
          </span>
          <h2 className="text-2xl font-serif font-bold text-natural-title tracking-tight sm:text-3xl mt-1">
            Appointment Management Lounge
          </h2>
          <p className="text-natural-text-muted text-xs sm:text-xs">
            Administer bookings, adjust clinical schedules, run status updates, and view procedure metrics.
          </p>
        </div>
        <div className="flex bg-[#f7f7f2] px-3 py-2 rounded-xl border border-natural-border items-center gap-2 text-xs font-bold text-natural-title font-sans">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#5A5A40] animate-pulse"></span>
          <span>Security Token Active: Dental Admin</span>
        </div>
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 font-sans">
        {/* Total stats */}
        <div className="bg-[#fdfdfb] border border-natural-border p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-natural-text-muted">
            <span className="text-natural-title font-bold uppercase tracking-wider text-[10px]">Total Records</span>
            <ClipboardList className="w-5 h-5 text-natural-primary" />
          </div>
          <p className="font-serif font-bold text-3xl text-natural-title mt-2">{stats.total}</p>
          <span className="text-[10px] text-natural-text-muted block font-medium mt-1">Bookings submitted</span>
        </div>

        {/* Pending Triage */}
        <div className="bg-[#fdfdfb] border border-natural-border p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-natural-title font-bold uppercase tracking-wider text-[10px]">Pending Actions</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-natural-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#5A5A40]"></span>
            </span>
          </div>
          <p className="font-serif font-bold text-3xl text-[#c47c4d] mt-2">{stats.pending}</p>
          <span className="text-[10px] text-natural-text-muted block font-medium mt-1">Require triage review</span>
        </div>

        {/* Scheduled/Approved */}
        <div className="bg-[#fdfdfb] border border-natural-border p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-natural-text-muted">
            <span className="text-natural-title font-bold uppercase tracking-wider text-[10px]">Scheduled Visits</span>
            <Calendar className="w-5 h-5 text-natural-primary" />
          </div>
          <p className="font-serif font-bold text-3xl text-natural-primary mt-2">{stats.approved}</p>
          <span className="text-[10px] text-natural-text-muted block font-medium mt-1">Confirmed with clients</span>
        </div>

        {/* Completed treatments */}
        <div className="bg-[#fdfdfb] border border-natural-border p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center text-natural-text-muted">
            <span className="text-natural-title font-bold uppercase tracking-wider text-[10px]">Completed Cases</span>
            <Check className="w-5 h-5 text-natural-primary" />
          </div>
          <p className="font-serif font-bold text-3xl text-natural-title mt-2">{stats.completed}</p>
          <span className="text-[10px] text-natural-text-muted block font-medium mt-1">Discharged patients</span>
        </div>

        {/* Financial projections */}
        <div className="col-span-2 lg:col-span-1 bg-[#2d2d24] p-5 rounded-2xl text-[#fdfdfb] border border-[#5A5A40]/30 shadow-md">
          <div className="flex justify-between items-center text-[#D4D9C1]">
            <span className="font-bold uppercase tracking-wider text-[10px]">Projected Income</span>
            <DollarSign className="w-4.5 h-4.5" />
          </div>
          <p className="font-serif font-bold text-3xl text-[#D4D9C1] mt-2">${stats.revenue}</p>
          <span className="text-[10px] text-natural-secondary block font-medium mt-1">From approved & done</span>
        </div>
      </div>

      {/* Inline Rescheduling / Metadata Editor panel if active */}
      {editingId && (
        <div className="bg-[#f7f7f2] border border-natural-border p-6 rounded-2xl space-y-4" id="staff-edit-box">
          <div className="flex justify-between items-center border-b border-natural-border pb-3 font-sans">
            <h3 className="font-serif font-bold text-natural-title text-sm flex items-center gap-1.5">
              <Edit className="w-4.5 h-4.5 text-natural-primary" />
              Adjusting Patient Details & Schedule: {editingId}
            </h3>
            <button
              onClick={() => setEditingId(null)}
              className="text-natural-text-muted hover:text-natural-title text-xs font-bold"
              id="close-edit-btn"
            >
              Cancel Adjustments
            </button>
          </div>

          <form onSubmit={saveEditing} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end font-sans">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-natural-title uppercase">Patient Name</label>
              <input
                type="text"
                value={editForm.patientName}
                onChange={(e) => setEditForm((prev) => ({ ...prev, patientName: e.target.value }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-patientName"
              />
            </div>
            
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-natural-title uppercase">Patient Phone</label>
              <input
                type="text"
                value={editForm.patientPhone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, patientPhone: e.target.value }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-patientPhone"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-natural-title uppercase">Service Treatment</label>
              <select
                value={editForm.serviceId}
                onChange={(e) => setEditForm((prev) => ({ ...prev, serviceId: e.target.value }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-service"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-natural-title uppercase font-bold">Appointment status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as AppointmentStatus }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-status"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-natural-title uppercase">Calendar Date</label>
              <input
                type="date"
                value={editForm.appointmentDate}
                onChange={(e) => setEditForm((prev) => ({ ...prev, appointmentDate: e.target.value }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-date"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-natural-title uppercase font-bold">Preferred Slot</label>
              <select
                value={editForm.appointmentTime}
                onChange={(e) => setEditForm((prev) => ({ ...prev, appointmentTime: e.target.value }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-time"
              >
                <option value="08:00 AM">08:00 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-[10px] font-bold text-natural-title uppercase">Internal Care Notes</label>
              <input
                type="text"
                placeholder="Dental insurance validation, sensitivity complaints..."
                value={editForm.notes}
                onChange={(e) => setEditForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-white border border-natural-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#5A5A40] text-natural-title"
                id="edit-notes"
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 border border-natural-border rounded-lg text-xs font-bold text-natural-title hover:bg-natural-bg-gray"
                id="cancel-edit-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#5A5A40] hover:bg-[#4d4d36] text-white rounded-lg text-xs font-bold shadow-sm"
                id="save-edit-btn"
              >
                Apply Clinical Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Database Table Container */}
      <div className="bg-[#fdfdfb] border border-natural-border rounded-2xl overflow-hidden shadow-xs">
        
        {/* Table Filters Header */}
        <div className="p-5 border-b border-natural-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#f7f7f2] font-sans">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-natural-text-muted" />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-natural-border rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-natural-title focus:outline-none focus:border-[#5A5A40]"
              id="search-bookings-input"
            />
          </div>

          {/* Status filter selection pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-natural-text-muted uppercase tracking-wider mr-2 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter status:
            </span>
            {[
              { id: "all", label: "All Bookings" },
              { id: "pending", label: "Pending" },
              { id: "approved", label: "Approved" },
              { id: "completed", label: "Completed" },
              { id: "cancelled", label: "Cancelled" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? "bg-[#5A5A40] text-white shadow-xs"
                    : "bg-white border border-natural-border text-natural-title hover:text-natural-primary"
                }`}
                id={`filter-${tab.id}-tab`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* Scrollable table contents */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-16 space-y-3 font-sans">
            <AlertCircle className="w-10 h-10 text-natural-text-muted mx-auto" />
            <p className="text-sm font-bold text-natural-title">No appointments fit search constraints.</p>
            <p className="text-xs text-natural-text-muted">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left border-collapse" id="appointments-data-table">
              <thead>
                <tr className="bg-[#f7f7f2] text-[10px] font-black uppercase text-natural-text-muted border-b border-natural-border tracking-wider">
                  <th className="py-3.5 px-5">Ref ID</th>
                  <th className="py-3.5 px-5">Patient Name</th>
                  <th className="py-3.5 px-5">Treatment Service</th>
                  <th className="py-3.5 px-5">Scheduled Schedule</th>
                  <th className="py-3.5 px-5">Internal Notes</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                  <th className="py-3.5 px-5 text-right">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-natural-border font-medium text-xs text-natural-title">
                {filteredAppointments.map((appt) => {
                  let statusColor = "bg-natural-bg-gray text-natural-title border-natural-border";
                  if (appt.status === "pending") statusColor = "bg-[#c47c4d]/10 text-[#c47c4d] border-[#c47c4d]/30";
                  if (appt.status === "approved") statusColor = "bg-[#5A5A40]/10 text-natural-primary border-[#5A5A40]/30";
                  if (appt.status === "completed") statusColor = "bg-[#2d2d24]/10 text-[#2d2d24] border-[#2d2d24]/30";
                  if (appt.status === "cancelled") statusColor = "bg-rose-50 text-rose-700 border-rose-200";

                  return (
                    <tr key={appt.id} className="hover:bg-natural-bg-gray/50 transition-colors">
                      {/* Ref ID */}
                      <td className="py-4 px-5">
                        <span className="font-mono text-[10px] font-bold text-natural-text-muted uppercase">
                          {appt.id}
                        </span>
                      </td>

                      {/* Patient metadata */}
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-bold text-natural-title">{appt.patientName}</p>
                          <p className="text-[10px] text-natural-text-muted mt-0.5">{appt.patientEmail}</p>
                          <p className="text-[10px] text-natural-text-muted">{appt.patientPhone}</p>
                        </div>
                      </td>

                      {/* Service procedure */}
                      <td className="py-4 px-5">
                        <span className="font-semibold text-natural-title">
                          {appt.serviceName}
                        </span>
                      </td>

                      {/* Scheduled timing */}
                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-natural-title">
                            <Calendar className="w-3.5 h-3.5 text-natural-primary" />
                            {appt.appointmentDate}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-natural-text-muted font-semibold">
                            <Clock className="w-3.5 h-3.5 text-natural-text-muted" />
                            {appt.appointmentTime}
                          </span>
                        </div>
                      </td>

                      {/* Patient/Admin notes */}
                      <td className="py-4 px-5 max-w-[200px] truncate">
                        <p className="italic text-natural-text-muted text-[11px]">
                          {appt.notes || <span className="text-natural-text-muted/40 font-normal">No internal remarks.</span>}
                        </p>
                      </td>

                      {/* Badge status */}
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${statusColor}`} id={`status-${appt.id}-badge`}>
                          {appt.status}
                        </span>
                      </td>

                      {/* Command actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex gap-1.5 justify-end items-center">
                          {/* Approve action */}
                          {appt.status === "pending" && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "approved")}
                              className="p-1 px-2.5 rounded bg-[#5A5A40]/10 text-[#5A5A40] border border-[#5A5A40]/20 hover:bg-[#5A5A40] hover:text-white transition-colors font-bold text-[10px]"
                              title="Approve Booking"
                              id={`approve-${appt.id}-btn`}
                            >
                              Approve
                            </button>
                          )}
                          
                          {/* Complete action */}
                          {appt.status === "approved" && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "completed")}
                              className="p-1 px-2.5 rounded bg-natural-title/10 text-natural-title border border-natural-title/20 hover:bg-natural-title hover:text-white transition-colors font-bold text-[10px]"
                              title="Set Complete"
                              id={`complete-${appt.id}-btn`}
                            >
                              Clinical Complete
                            </button>
                          )}

                          {/* Action toggle fallback for cancelled */}
                          {appt.status === "cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "pending")}
                              className="p-1 px-2 gap-1 rounded bg-[#f7f7f2] text-natural-title border border-natural-border hover:bg-natural-bg-gray transition-colors font-bold text-[10px]"
                              title="Revert back to pending"
                              id={`revert-${appt.id}-btn`}
                            >
                              Reopen
                            </button>
                          )}

                          {/* Cancel treatment if active */}
                          {(appt.status === "pending" || appt.status === "approved") && (
                            <button
                              onClick={() => handleUpdateStatus(appt.id, "cancelled")}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Cancel Appointment"
                              id={`cancel-${appt.id}-btn`}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit inline button */}
                          <button
                            onClick={() => startEditing(appt)}
                            className="p-1.5 text-natural-title hover:bg-natural-bg-gray rounded transition-colors"
                            title="Edit Details / Reschedule"
                            id={`edit-${appt.id}-btn`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete item */}
                          <button
                            onClick={() => handleDeleteAppointment(appt.id)}
                            className="p-1.5 text-natural-text-muted hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Permanently"
                            id={`delete-${appt.id}-btn`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
