import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";
import { Appointment } from "./src/types";

// Helper for generating random IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to appointments JSON database
const DATA_DIR = path.join(process.cwd(), "data");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

// Core Dental Services list
const DENTAL_SERVICES = [
  {
    id: "svc_checkup",
    name: "Comprehensive Dental Checkup",
    description: "Full exam with modern digital X-Rays, periodontal mapping, oral oncology screening, and clean hygiene consultation.",
    duration: "45 mins",
    price: "$79",
    category: "preventive",
    popular: true
  },
  {
    id: "svc_cleaning",
    name: "Professional Hygiene & Scaling",
    description: "Plaque/tartar scaling, professional air polishing, gum care and customized enamel fortification treatment.",
    duration: "45 mins",
    price: "$119",
    category: "preventive",
    popular: false
  },
  {
    id: "svc_whitening",
    name: "Laser Teeth Whitening",
    description: "High-intensity professional laser bleaching to lift deep stains, offering up to 8 shades brighter in just one session.",
    duration: "60 mins",
    price: "$299",
    category: "cosmetic",
    popular: true
  },
  {
    id: "svc_filling",
    name: "Aesthetic Composite Filling",
    description: "State-of-the-art tooth-colored composite restorations which bond seamlessly to natural enamel for strength and invisible repair.",
    duration: "45 mins",
    price: "$149",
    category: "restorative",
    popular: false
  },
  {
    id: "svc_rootcanal",
    name: "Root Canal Therapy",
    description: "Highly precise, micro-endodontic therapy designed to save damaged natural teeth and render them completely pain-free.",
    duration: "90 mins",
    price: "$599",
    category: "restorative",
    popular: false
  },
  {
    id: "svc_implant_consult",
    name: "Dental Implant Consultation",
    description: "3D CBCT digital imaging scan, anatomical bone viability assessment, and surgical custom restoration roadmap.",
    duration: "30 mins",
    price: "Free",
    category: "consultation",
    popular: false
  }
];

// Initialize JSON list database
async function initDatabase() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(APPOINTMENTS_FILE);
    } catch {
      // Create empty db with template mock data so the app has some initial bookings for staff to see!
      const initialBookings: Appointment[] = [
        {
          id: "appt_1",
          patientName: "Alice Jenkins",
          patientEmail: "alice.jenkins@example.com",
          patientPhone: "(555) 234-5678",
          serviceId: "svc_whitening",
          serviceName: "Laser Teeth Whitening",
          appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days from now
          appointmentTime: "10:00 AM",
          status: "approved",
          notes: "Sensitive lower teeth; prefers extra protection.",
          createdAt: new Date().toISOString()
        },
        {
          id: "appt_2",
          patientName: "Marcus Vance",
          patientEmail: "marcus.v@example.com",
          patientPhone: "(555) 876-5432",
          serviceId: "svc_checkup",
          serviceName: "Comprehensive Dental Checkup",
          appointmentDate: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0], // 4 days from now
          appointmentTime: "02:30 PM",
          status: "pending",
          notes: "Hasn't been to a dentist in 3 years. Needs full exam.",
          createdAt: new Date().toISOString()
        },
        {
          id: "appt_3",
          patientName: "Sophia Martinez",
          patientEmail: "sophia.m@example.com",
          patientPhone: "(555) 432-1098",
          serviceId: "svc_cleaning",
          serviceName: "Professional Hygiene & Scaling",
          appointmentDate: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday (completed)
          appointmentTime: "09:00 AM",
          status: "completed",
          notes: "Routine semi-annual cleanup.",
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
        }
      ];
      await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(initialBookings, null, 2), "utf-8");
    }
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

// Read appointments
async function readAppointments(): Promise<Appointment[]> {
  try {
    const data = await fs.readFile(APPOINTMENTS_FILE, "utf-8");
    return JSON.parse(data) as Appointment[];
  } catch (error) {
    console.error("Error reading file:", error);
    return [];
  }
}

// Write appointments
async function writeAppointments(appointments: Appointment[]): Promise<boolean> {
  try {
    await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing file:", error);
    return false;
  }
}

// Start Server Setup
async function start() {
  await initDatabase();

  // API Route - Get all dental services
  app.get("/api/services", (req, res) => {
    res.json(DENTAL_SERVICES);
  });

  // API Route - Get all appointments (Staff view)
  app.get("/api/appointments", async (req, res) => {
    const appointments = await readAppointments();
    // Sort by date then time
    appointments.sort((a, b) => {
      const dateCompare = a.appointmentDate.localeCompare(b.appointmentDate);
      if (dateCompare !== 0) return dateCompare;
      return a.appointmentTime.localeCompare(b.appointmentTime);
    });
    res.json(appointments);
  });

  // API Route - Create new appointment (Patient Booking)
  app.post("/api/appointments", async (req, res) => {
    const { patientName, patientEmail, patientPhone, serviceId, appointmentDate, appointmentTime, notes } = req.body;

    // Basic validation
    if (!patientName || !patientEmail || !patientPhone || !serviceId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    const service = DENTAL_SERVICES.find((s) => s.id === serviceId);
    if (!service) {
      return res.status(404).json({ error: "Selected service could not be found." });
    }

    const newAppointment: Appointment = {
      id: "appt_" + generateId(),
      patientName,
      patientEmail,
      patientPhone,
      serviceId,
      serviceName: service.name,
      appointmentDate,
      appointmentTime,
      status: "pending",
      notes: notes || "",
      createdAt: new Date().toISOString()
    };

    const appointments = await readAppointments();
    appointments.push(newAppointment);
    const success = await writeAppointments(appointments);

    if (success) {
      res.status(201).json(newAppointment);
    } else {
      res.status(500).json({ error: "Could not save appointment in database." });
    }
  });

  // API Route - Update appointment status or details (Staff editing / scheduling)
  app.put("/api/appointments/:id", async (req, res) => {
    const { id } = req.params;
    const { status, appointmentDate, appointmentTime, notes, patientName, patientPhone, patientEmail, serviceId } = req.body;

    const appointments = await readAppointments();
    const index = appointments.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    const appointment = appointments[index];

    // Build updated fields cleanly
    if (status) appointment.status = status;
    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    if (notes !== undefined) appointment.notes = notes;
    if (patientName) appointment.patientName = patientName;
    if (patientPhone) appointment.patientPhone = patientPhone;
    if (patientEmail) appointment.patientEmail = patientEmail;
    
    if (serviceId) {
      const service = DENTAL_SERVICES.find((s) => s.id === serviceId);
      if (service) {
        appointment.serviceId = serviceId;
        appointment.serviceName = service.name;
      }
    }

    const success = await writeAppointments(appointments);
    if (success) {
      res.json(appointment);
    } else {
      res.status(500).json({ error: "Could not update appointment in database." });
    }
  });

  // API Route - Delete appointment
  app.delete("/api/appointments/:id", async (req, res) => {
    const { id } = req.params;
    const appointments = await readAppointments();
    const filtered = appointments.filter((a) => a.id !== id);

    if (appointments.length === filtered.length) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    const success = await writeAppointments(filtered);
    if (success) {
      res.json({ success: true, message: "Appointment deleted successfully." });
    } else {
      res.status(500).json({ error: "Could not delete appointment from database." });
    }
  });

  // API Route - Verify staff credentials (simple password for portal access)
  app.post("/api/staff/login", (req, res) => {
    const { password } = req.body;
    // Password is demo-friendly: "smile123"
    if (password === "smile123") {
      res.json({ success: true, token: "dental_auth_token_secret_admin" });
    } else {
      res.status(401).json({ success: false, error: "Incorrect staff password" });
    }
  });

  // API Route - Dental stats overview
  app.get("/api/stats", async (req, res) => {
    const appointments = await readAppointments();
    
    const countStatus = {
      pending: 0,
      approved: 0,
      completed: 0,
      cancelled: 0,
    };
    
    const servicePopularity: Record<string, { count: number, name: string }> = {};
    
    appointments.forEach((appt) => {
      // count statuses
      if (appt.status in countStatus) {
        countStatus[appt.status]++;
      }
      
      // count services
      if (!servicePopularity[appt.serviceId]) {
        servicePopularity[appt.serviceId] = {
          count: 0,
          name: appt.serviceName,
        };
      }
      servicePopularity[appt.serviceId].count++;
    });

    res.json({
      total: appointments.length,
      byStatus: countStatus,
      popularServices: Object.values(servicePopularity).sort((a,b) => b.count - a.count),
    });
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dental server running on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Critical server failures:", err);
});
