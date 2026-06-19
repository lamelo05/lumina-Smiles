import React from "react";
import { Smile, Calendar, Sparkles, UserCheck, Shield } from "lucide-react";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onStaffLogout: () => void;
  isStaffAuthenticated: boolean;
}

export default function Header({ currentTab, setCurrentTab, onStaffLogout, isStaffAuthenticated }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-natural-border shadow-xs">
      {/* Top Clinic Info Bar - Olive Sage & Warm Sand */}
      <div className="bg-natural-primary text-natural-bg-light/90 text-xs py-2 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#D4D9C1]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#D4D9C1] animate-pulse"></span>
              Accepting New Patients
            </span>
            <span className="hidden md:inline text-white/20">|</span>
            <span className="hidden md:inline">📞 Clinical emergency line: (555) 911-7645</span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <span>📅 Mon - Fri: 8:00 AM - 5:00 PM | Sat: 9:00 AM - 2:00 PM</span>
            <span className="hidden lg:inline">📍 102 Dental Care Blvd, Suite A</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => setCurrentTab("home")}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="w-10 h-10 rounded-full bg-natural-primary flex items-center justify-center text-white shadow-md shadow-[#5a5a4022] group-hover:scale-105 transition-transform">
              <Smile className="w-5.5 h-5.5 stroke-[2.25] text-natural-bg-light" />
            </div>
            <div>
              <span className="block font-serif font-bold text-xl tracking-tight text-natural-primary transition-colors">
                LuminaSMILES
              </span>
              <span className="block text-[9px] font-bold tracking-widest text-[#9a9a8b] uppercase -mt-0.5">
                ORGANIC DENTAL HEALTH
              </span>
            </div>
          </button>

          {/* Links */}
          <nav className="flex items-center gap-1 sm:gap-4 font-semibold text-xs uppercase tracking-widest">
            <button
              onClick={() => setCurrentTab("home")}
              className={`px-3 py-2 rounded-xl transition-colors focus:outline-none ${
                currentTab === "home"
                  ? "bg-natural-bg-gray text-natural-title font-bold"
                  : "text-[#7a7a6b] hover:text-natural-title hover:bg-[#fdfdfb]"
              }`}
              id="nav-home-btn"
            >
              Treatments & Info
            </button>
            <button
              onClick={() => setCurrentTab("book")}
              className={`relative px-3 py-2 rounded-xl transition-all focus:outline-none flex items-center gap-1.5 ${
                currentTab === "book"
                  ? "bg-[#D4D9C1]/40 text-natural-primary font-bold border border-[#D4D9C1]"
                  : "text-natural-primary hover:text-natural-primary hover:bg-natural-bg-gray"
              }`}
              id="nav-booking-btn"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Treatment
              <span className="absolute -top-1 -right-0.5 flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5A5A40] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5A5A40]"></span>
              </span>
            </button>
            
            {isStaffAuthenticated ? (
              <div className="flex items-center gap-2 border-l border-natural-border pl-4">
                <button
                  onClick={() => setCurrentTab("staff")}
                  className={`px-3 py-2 rounded-xl transition-colors focus:outline-none flex items-center gap-1.5 ${
                    currentTab === "staff"
                      ? "bg-natural-primary text-white font-bold"
                      : "text-natural-primary hover:bg-natural-bg-gray"
                  }`}
                  id="nav-staff-dashboard-btn"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Staff lounge
                </button>
                <button
                  onClick={onStaffLogout}
                  className="px-2 py-1.5 text-[10px] text-rose-700 hover:bg-rose-50 rounded-lg transition-colors font-bold uppercase tracking-wider"
                  id="nav-logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab("staff")}
                className={`px-3 py-2 rounded-xl border transition-all focus:outline-none flex items-center gap-1.5 ${
                  currentTab === "staff"
                    ? "bg-natural-title text-white border-natural-title"
                    : "text-[#7a7a6b] border-natural-border hover:border-[#9a9a8b] hover:bg-natural-bg-gray"
                }`}
                id="nav-staff-login-btn"
              >
                <Shield className="w-3.5 h-3.5" />
                Staff Lounge
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
