import React from "react";
import { Clock, MapPin, Sparkles, Award, ShieldCheck, Heart } from "lucide-react";

export default function AboutClinic() {
  const doctors = [
    {
      name: "Dr. Eleanor Vance, DDS",
      role: "Lead Biological & Cosmetic Dentist",
      bio: "Harvard Dental graduate with 15+ years of clinical tenure focusing on modern comfortable procedures.",
      specialty: "Invisalign Platinum & Cosmetic Fillings",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
    },
    {
      name: "Dr. Aaron Patel, DMD, MS",
      role: "Consultant Endodontist & Implant Specialist",
      bio: "Board-certified oral surgeon specializing in painless root canals and safe digital dental implants.",
      specialty: "Micro-Surgical RCT & 3D Restorations",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
    }
  ];

  const features = [
    {
      icon: Award,
      title: "Painless Anesthesia Tiers",
      desc: "Our high-tech computer-assisted numbing system (The Wand) guarantees completely prick-free comfort for all dental restoration work."
    },
    {
      icon: ShieldCheck,
      title: "Ultra-Low Dose Digital X-Rays",
      desc: "We utilize advanced sensor machinery with up to 90% reduced radiation compared to traditional dental film scanners."
    },
    {
      icon: Heart,
      title: "Relaxation Entertainment Options",
      desc: "Settle back with clean noise-canceling headsets, ambient overhead TV screens, and clinical massage chairs in every op room."
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-natural-border" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-natural-secondary/30 border border-natural-border text-natural-primary text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-natural-primary" />
              INTEGRATIVE BIOLOGICAL ORTHODONTICS
            </div>
            <h2 className="text-3xl font-serif font-bold text-natural-title tracking-tight sm:text-4xl">
              Why Patients Love LuminaSMILES
            </h2>
            <p className="text-natural-text-muted text-sm sm:text-base leading-relaxed">
              Founded in 2012, we set out to build a clinical environment that completely dismantles dental stress. By investing in biocompatible materials, clean ambient filtration, and gentle dental methods, we've transformed visits from a clinical chore into a relaxing wellness experience.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
              <div className="p-5 rounded-xl bg-natural-bg-gray/60 border border-natural-border">
                <div className="flex items-center gap-2 mb-3.5 font-bold text-natural-title text-sm">
                  <Clock className="w-4 h-4 text-natural-primary" /> Clinic Hours
                </div>
                <ul className="text-xs text-natural-text-muted space-y-2 font-medium">
                  <li className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold text-natural-title">8:00 AM - 5:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold text-natural-title">9:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between text-rose-700 font-bold">
                    <span>Sunday</span>
                    <span className="uppercase">Emergency Line</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-natural-bg-gray/60 border border-natural-border">
                <div className="flex items-center gap-2 mb-3.5 font-bold text-natural-title text-sm">
                  <MapPin className="w-4 h-4 text-natural-primary" /> Clinic Address
                </div>
                <p className="text-xs text-natural-text-muted leading-relaxed font-semibold">
                  102 Dental Care Blvd, Suite A <br />
                  West Medical District, CA 90210
                </p>
                <p className="text-[11px] text-natural-text-gray mt-3.5 italic">
                  * Reserved parking lot free for patients in the rear.
                </p>
              </div>
            </div>
          </div>

          {/* Features highlight */}
          <div className="space-y-6">
            <h3 className="font-serif font-bold text-natural-title text-lg uppercase tracking-wider text-center lg:text-left">
              Advanced Clinical Milestones
            </h3>
            <div className="space-y-4">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-natural-bg-gray/40 hover:bg-natural-secondary/20 border border-natural-border transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-natural-secondary/30 flex items-center justify-center text-natural-primary shrink-0 border border-natural-border">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-natural-title text-sm">{item.title}</h4>
                      <p className="text-xs text-natural-text-muted leading-relaxed mt-1">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="border-t border-natural-border pt-16">
          <div className="text-center md:max-w-xl md:mx-auto mb-12">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#9a9a8b] mb-1 font-sans">
              TRUSTED SPECIALISTS
            </h3>
            <h4 className="text-2xl font-serif font-bold text-natural-title tracking-tight sm:text-3xl">
              Meet Our Board-Certified Clinicians
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {doctors.map((doc, idx) => (
              <div key={idx} className="bg-natural-bg-gray/30 border border-natural-border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left transition-all hover:shadow-xs">
                <img
                  src={doc.avatar}
                  alt={doc.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full object-cover shrink-0 ring-4 ring-natural-secondary/30"
                />
                <div className="space-y-2">
                  <div>
                    <h5 className="font-serif font-bold text-natural-title text-base">{doc.name}</h5>
                    <span className="block text-xs font-bold text-natural-primary">{doc.role}</span>
                  </div>
                  <p className="text-xs text-natural-text-muted leading-relaxed">
                    {doc.bio}
                  </p>
                  <span className="inline-block text-[9px] uppercase tracking-wider font-extrabold bg-[#D4D9C1]/50 text-natural-primary px-2.5 py-1.5 rounded-lg border border-natural-border/60">
                    {doc.specialty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
