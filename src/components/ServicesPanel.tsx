import React, { useState } from "react";
import { DentalService } from "../types";
import { Sparkles, Activity, ShieldAlert, BadgeInfo, CheckCircle } from "lucide-react";

interface ServicesPanelProps {
  services: DentalService[];
  onSelectService: (serviceId: string) => void;
}

export default function ServicesPanel({ services, onSelectService }: ServicesPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Dental Treatments" },
    { id: "preventive", name: "Preventive Care" },
    { id: "cosmetic", name: "Cosmetic & Smiles" },
    { id: "restorative", name: "Surgical & Restoration" }
  ];

  const filteredServices = services.filter((svc) => {
    if (activeCategory === "all") return true;
    return svc.category === activeCategory;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "preventive":
        return "bg-natural-bg-gray text-natural-primary border-natural-border";
      case "cosmetic":
        return "bg-natural-secondary/30 text-natural-primary border-natural-secondary";
      case "restorative":
        return "bg-[#D4D9C1]/40 text-[#484833] border-[#c4c9b0]";
      default:
        return "bg-natural-bg-light text-natural-text-muted border-natural-border";
    }
  };

  return (
    <section className="py-16 bg-natural-bg-gray/40 border-b border-natural-border" id="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center md:max-w-3xl md:mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#9a9a8b] mb-2 font-sans">
            INTELLIGENT DENTAL CARE
          </h2>
          <p className="text-3xl font-serif font-bold text-natural-title tracking-tight sm:text-4xl">
            Our Transparent Clinical Offerings
          </p>
          <p className="mt-3 text-natural-text-muted text-sm sm:text-base leading-relaxed">
            Choose from our fully-transparent treatment menu. All materials are certified non-toxic and biocompatible. No hidden charges or arbitrary extra fees.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all focus:outline-none ${
                activeCategory === cat.id
                  ? "bg-[#5A5A40] text-white border border-[#5A5A40] shadow-sm"
                  : "bg-white border border-natural-border text-[#7a7a6b] hover:text-[#2d2d24] hover:border-[#9a9a8b]"
              }`}
              id={`filter-${cat.id}-btn`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className={`group relative bg-[#fdfdfb] border rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                svc.popular 
                  ? "border-[#5A5A40] ring-1 ring-[#5a5a4033]"
                  : "border-natural-border"
              }`}
            >
              {svc.popular && (
                <span className="absolute -top-3 right-4 px-2.5 py-1 text-[9px] font-bold text-white bg-natural-primary rounded-full flex items-center gap-1 shadow-sm uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-natural-secondary" /> RECOMMENDED
                </span>
              )}

              <div className="space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded border ${getCategoryBadgeColor(svc.category)}`}>
                    {svc.category}
                  </span>
                  <div className="text-right">
                    <span className="block text-2.5xl font-serif font-bold text-natural-title leading-none">
                      {svc.price}
                    </span>
                    <span className="text-[10px] text-[#9a9a8b] font-bold uppercase tracking-wider block mt-1">
                      Fixed treatment rate
                    </span>
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="text-lg font-serif font-bold text-natural-title group-hover:text-natural-primary transition-colors">
                  {svc.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-natural-text-muted leading-relaxed min-h-[4.5rem]">
                  {svc.description}
                </p>

                {/* Duration indicator */}
                <div className="flex items-center gap-1.5 text-xs text-natural-text-gray border-t border-natural-border pt-3">
                  <Activity className="w-4 h-4 text-natural-primary" />
                  <span>Est. Duration: </span>
                  <span className="font-semibold text-[#5A5A40]">{svc.duration}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectService(svc.id)}
                className="mt-6 w-full py-2.5 px-4 rounded-xl text-center text-xs font-bold transition-all bg-natural-bg-gray text-natural-primary border border-natural-border group-hover:bg-[#5A5A40] group-hover:text-white group-hover:border-[#5A5A40] focus:outline-none flex items-center justify-center gap-2 uppercase tracking-wide"
                id={`book-svc-${svc.id}-btn`}
              >
                <span>Select for appointment</span>
              </button>
            </div>
          ))}
        </div>

        {/* Informative Help Alert Banner */}
        <div className="mt-12 p-5 bg-white border border-natural-border rounded-2xl flex flex-col sm:flex-row gap-4 items-center sm:items-start justify-between shadow-xs">
          <div className="flex gap-3 items-center sm:items-start text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-natural-bg-gray flex items-center justify-center text-natural-primary shrink-0 mx-auto border border-natural-border">
              <BadgeInfo className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-sm text-natural-title">Connecting Insurance Supports</p>
              <p className="text-xs text-natural-text-muted leading-relaxed mt-0.5">
                We support most classic PPO direct-billing networks. Indicate your provider details during appointment entry for our pre-billing evaluation.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0 justify-center">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#fdfdfb] text-[#5A5A40] px-2.5 py-1.5 rounded-lg border border-natural-border">
              <CheckCircle className="w-3.5 h-3.5 text-natural-primary" /> Delta Dental
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#fdfdfb] text-[#5A5A40] px-2.5 py-1.5 rounded-lg border border-natural-border">
              <CheckCircle className="w-3.5 h-3.5 text-natural-primary" /> MetLife Elite Network
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#fdfdfb] text-[#5A5A40] px-2.5 py-1.5 rounded-lg border border-natural-border">
              <CheckCircle className="w-3.5 h-3.5 text-natural-primary" /> Cigna Certified
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
