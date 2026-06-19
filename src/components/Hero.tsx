import React from "react";
import { Sparkles, Calendar, BadgeCheck, ShieldCheck, Heart, Star } from "lucide-react";

interface HeroProps {
  onBookClick: () => void;
  onServicesClick: () => void;
}

export default function Hero({ onBookClick, onServicesClick }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-natural-bg-gray/50 py-16 lg:py-24 border-b border-natural-border">
      {/* Delicate background glows matching natural minerals */}
      <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,rgba(212,217,193,0.15),white)] opacity-60"></div>
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#D4D9C1]/20 to-[#fdfdfb] opacity-50 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-natural-secondary/30 border border-natural-border text-natural-primary text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-natural-primary animate-spin-slow" />
              SOCIALLY RESPONSIBLE, ORGANIC DENTAL SOLUTIONS
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-natural-title tracking-tight leading-[1.12]">
              A Healthier Smile, <br />
              <span className="text-natural-primary italic font-medium">
                Rooted in Care & Trust
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-natural-text-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Experience gentle, state-of-the-art biological dentistry. From advanced preventative cleanings to non-toxic materials and natural therapy supports, we pair pristine hygiene with standard-setting clinical rigor.
            </p>

            {/* Core Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-natural-secondary/20 flex items-center justify-center text-natural-primary">
                  <BadgeCheck className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-natural-title">Board Certified</span>
                  <span className="block text-xs text-natural-text-muted">Physicians & Staff</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-natural-secondary/20 flex items-center justify-center text-natural-primary">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-natural-title">Biocompatible</span>
                  <span className="block text-xs text-natural-text-muted">Safe, clean materials</span>
                </div>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 justify-center sm:justify-start">
                <div className="w-8 h-8 rounded-full bg-natural-secondary/20 flex items-center justify-center text-natural-primary">
                  <Heart className="w-4.5 h-4.5 fill-natural-secondary/10" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-sm text-natural-title">Five-Star Rating</span>
                  <span className="block text-xs text-natural-text-muted">2,500+ Local Patients</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onBookClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-natural-primary text-white shadow-md shadow-[#5a5a4022] hover:bg-[#484833] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                id="hero-book-cta"
              >
                <Calendar className="w-5 h-5 text-natural-secondary" />
                Schedule Healing Treatment
              </button>
              <button
                onClick={onServicesClick}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold border border-natural-border text-natural-primary bg-white hover:bg-natural-bg-gray transition-colors flex items-center justify-center"
                id="hero-services-cta"
              >
                View Transparent Pricing
              </button>
            </div>
          </div>

          {/* Graphical Promo Card Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-sm rounded-2xl bg-natural-title text-natural-bg-light p-6 shadow-xl overflow-hidden border border-[#3c3c33]">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-[#D4D9C1]/10 blur-xl"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-natural-secondary bg-[#5A5A40]/40 border border-natural-primary/30 px-2 py-1 rounded">
                    New Patient Holistic Special
                  </span>
                  <h3 className="text-2xl font-serif font-black tracking-tight mt-2 text-white">
                    NatureStart 2026
                  </h3>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-natural-primary rounded text-natural-secondary text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-natural-secondary/80 text-natural-secondary" />
                  4.9
                </div>
              </div>

              <div className="space-y-4 border-t border-natural-primary/50 pt-4 mb-6 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[#a4a495]">Complex Biological Review</span>
                  <span className="font-semibold text-natural-bg-light">Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a4a495]">Eco-Friendly Digital X-Rays</span>
                  <span className="font-semibold text-natural-bg-light">Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#a4a495]">Herbal Polish & Scale Sweep</span>
                  <span className="font-semibold text-natural-bg-light">Included</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-dashed border-[#5A5A40]">
                  <span className="font-bold text-[#a4a495]">True Medical Value</span>
                  <span className="line-through text-natural-text-muted text-sm">$380</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span className="text-[#D4D9C1] uppercase tracking-wider text-xs">Organic Initiative Trial</span>
                  <span className="text-3xl text-natural-secondary font-serif font-extrabold">$79</span>
                </div>
              </div>

              <button
                onClick={onBookClick}
                className="w-full bg-[#5A5A40] hover:bg-[#68684d] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                id="hero-promo-btn"
              >
                Claim Herbal Trial Special
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
