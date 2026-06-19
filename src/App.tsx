import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServicesPanel from "./components/ServicesPanel";
import AboutClinic from "./components/AboutClinic";
import AppointmentForm from "./components/AppointmentForm";
import ReviewsSection from "./components/ReviewsSection";
import StaffDashboard from "./components/StaffDashboard";
import { DentalService, Appointment } from "./types";
import { Sparkles, Phone, Mail, MapPin, Smile, MessageSquareQuote } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [services, setServices] = useState<DentalService[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedServiceIdForBooking, setSelectedServiceIdForBooking] = useState<string>("");
  const [isStaffAuthenticated, setIsStaffAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load standard services on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        setIsLoading(true);
        // Load services
        const servicesRes = await fetch("/api/services");
        if (servicesRes.ok) {
          const serviceList = await servicesRes.json();
          setServices(serviceList);
        }

        // Load appointments (staff query, but safe for initial layout)
        const appointmentsRes = await fetch("/api/appointments");
        if (appointmentsRes.ok) {
          const apptList = await appointmentsRes.json();
          setAppointments(apptList);
        }

        // Check if staff has been logged in
        const storedToken = localStorage.getItem("staff_access_token");
        if (storedToken === "dental_auth_token_secret_admin") {
          setIsStaffAuthenticated(true);
        }
      } catch (error) {
        console.error("Failed to connect to backend:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialData();
  }, []);

  // Fetch updated appointments periodically or after actions
  const refreshAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      if (response.ok) {
        const apptList = await response.json();
        setAppointments(apptList);
      }
    } catch (err) {
      console.error("Failed to reload list from server:", err);
    }
  };

  const handleStaffLogin = () => {
    setIsStaffAuthenticated(true);
    localStorage.setItem("staff_access_token", "dental_auth_token_secret_admin");
  };

  const handleStaffLogout = () => {
    setIsStaffAuthenticated(false);
    localStorage.removeItem("staff_access_token");
    setCurrentTab("home");
  };

  const handleSelectServiceFromGrid = (serviceId: string) => {
    setSelectedServiceIdForBooking(serviceId);
    setCurrentTab("book");
  };

  const handleHeroBookCTA = () => {
    setSelectedServiceIdForBooking("");
    setCurrentTab("book");
  };

  const handleHeroServicesCTA = () => {
    setCurrentTab("home");
    // Smooth scroll down to the services section after tab swap
    setTimeout(() => {
      const elem = document.getElementById("services-section");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // If loading spinner is needed
  if (isLoading && services.length === 0) {
    return (
      <div className="min-h-screen bg-[#fdfdfb] flex flex-col items-center justify-center space-y-4" id="app-loading-spinner">
        <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white scale-110 animate-bounce">
          <Smile className="w-7 h-7 stroke-[2.25] text-natural-secondary" />
        </div>
        <p className="text-sm font-serif font-bold text-natural-title tracking-tight">Initializing LuminaSMILES Platform...</p>
        <span className="text-xs text-[#7a7a6b] font-medium font-sans uppercase tracking-widest">Powering bio-dental database & archives</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfdfb] text-natural-title flex flex-col justify-between font-sans">
      
      {/* Clinic top info & Navigation header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onStaffLogout={handleStaffLogout}
        isStaffAuthenticated={isStaffAuthenticated}
      />

      {/* Main Single Page Tab Content */}
      <main className="flex-grow">
        {currentTab === "home" && (
          <div className="animate-fade-in" id="tab-home-view">
            {/* Promo-advertising hero */}
            <Hero
              onBookClick={handleHeroBookCTA}
              onServicesClick={handleHeroServicesCTA}
            />
            {/* Services with price index */}
            <ServicesPanel
              services={services}
              onSelectService={handleSelectServiceFromGrid}
            />
            {/* Doctor roster */}
            <AboutClinic />
            {/* Patient comments */}
            <ReviewsSection />
          </div>
        )}

        {currentTab === "book" && (
          <div className="animate-fade-in" id="tab-booking-view">
            <AppointmentForm
              services={services}
              preselectedServiceId={selectedServiceIdForBooking}
              onBookingSuccess={refreshAppointments}
            />
          </div>
        )}

        {currentTab === "staff" && (
          <div className="animate-fade-in" id="tab-staff-view">
            <StaffDashboard
              services={services}
              appointments={appointments}
              setAppointments={setAppointments}
              isAuthenticated={isStaffAuthenticated}
              onLoginSuccess={handleStaffLogin}
            />
          </div>
        )}
      </main>

      {/* Beautiful High-Conversion Advertising Footer */}
      <footer className="bg-[#2d2d24] text-[#a4a495] border-t border-[#5A5A40]/40 pt-16 pb-8 font-sans" id="footer-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white">
                <Smile className="w-5.5 h-5.5 text-natural-secondary" />
              </div>
              <span className="font-serif font-black text-lg tracking-tight text-white block">
                LuminaSMILES
              </span>
            </div>
            <p className="text-xs text-[#a4a495] leading-relaxed font-semibold font-sans">
              Top-tier biological dentistry crafted with organic principles. Merging advanced biotech diagnostics with peaceful, biological therapy models.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#33332d] border border-[#5A5A40]/50 rounded-md text-[9px] uppercase font-bold tracking-wider text-natural-secondary">
              <Sparkles className="w-3.5 h-3.5" /> Bio-Dental Practice Board Certified
            </div>
          </div>

          {/* Quick links & navigation */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Patient Center</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => setCurrentTab("home")} className="hover:text-natural-secondary transition-colors text-left">Our Standard Treatments</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("book")} className="hover:text-natural-secondary transition-colors text-left">Book appointment online</button>
              </li>
              <li>
                <button onClick={handleHeroServicesCTA} className="hover:text-natural-secondary transition-colors text-left font-semibold">Pricing index list</button>
              </li>
              <li>
                <span className="text-[#6d6d5c]">Patient records lookup (Coming soon)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-widest mb-4">Quick Contact</h4>
            <ul className="space-y-3 text-xs font-medium">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-natural-secondary shrink-0" />
                <span>Call clinic: (555) 555-SMILE</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-natural-secondary shrink-0" />
                <span>Email care: care@luminasmiles.example</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-natural-secondary shrink-0 mt-0.5" />
                <span>102 Dental Care Blvd, Suite A<br />West Medical District, CA 90210</span>
              </li>
            </ul>
          </div>

          {/* Marketing Special CTA block */}
          <div className="bg-[#33332d] border border-[#5A5A40]/40 rounded-2xl p-5 space-y-3">
            <h5 className="font-extrabold text-white text-xs">Join our newsletter</h5>
            <p className="text-[10px] text-[#a4a495] leading-relaxed font-semibold">
              Obtain biological tips on dental hygiene and custom procedural discounts.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="email@example.com"
                className="bg-[#2d2d24] border border-[#5A5A40]/40 rounded-lg px-2.5 py-1.5 text-[10px] w-full text-white focus:outline-none focus:border-natural-secondary"
                id="footer-email-newsletter"
              />
              <button
                onClick={() => alert("Thank you. You've been subscribed for biological dental tips!")}
                className="px-3 bg-[#5A5A40] hover:bg-[#4a4a34] text-white font-bold rounded-lg text-[10px] transition-colors"
                id="footer-newsletter-btn"
              >
                Sign
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright and compliance */}
        <div className="border-t border-[#33332d] pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#6d6d4e] font-semibold uppercase tracking-wider">
          <span>&copy; {new Date().getFullYear()} LuminaSMILES Dental Care. All clinical rights reserved.</span>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-natural-secondary">Privacy Policy</a>
            <span>|</span>
            <a href="#rules" className="hover:text-natural-secondary">Dental Practice Guidelines</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
