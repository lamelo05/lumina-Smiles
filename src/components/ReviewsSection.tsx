import React from "react";
import { Star, Smile, Sparkles } from "lucide-react";
import { Review } from "../types";

export default function ReviewsSection() {
  const reviews: Review[] = [
    {
      id: "rev_1",
      author: "Samantha K. (Dental Hygiene)",
      rating: 5,
      text: "Dr. Eleanor is incredible! I have severe dentist anxiety, but her biological perspective and painless computer numbing was completely unnoticeable. The herbal hygiene sweep left my teeth feeling pristine.",
      date: "May 12, 2026"
    },
    {
      id: "rev_2",
      author: "Robert L. (Active Whitening)",
      rating: 5,
      text: "Absolute game changer. Did the Organic Whitening package. 60 minutes in the therapeutic chair watching documentary programs, and my teeth look stunning. Zero gum sensitivity. Brilliant staff and bio-clinical venue.",
      date: "June 01, 2026"
    },
    {
      id: "rev_3",
      author: "Elena G. (Biotech Root Canal)",
      rating: 5,
      text: "I was in agonizing pain with a cracked molar. Dr. Patel fit me in for an emergency root canal immediately. It was 100% painless! He kept checking on me and explained the technology. Saved my natural tooth completely.",
      date: "June 14, 2026"
    }
  ];

  return (
    <section className="py-16 bg-natural-title text-natural-bg-light" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center md:max-w-xl md:mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#5A5A40]/40 text-natural-secondary border border-[#5A5A40]/50 text-xs font-semibold uppercase tracking-wider mb-2 font-sans">
            <Smile className="w-3.5 h-3.5 text-natural-secondary" />
            Verified Patient Voice
          </div>
          <h2 className="text-3xl font-serif font-bold tracking-tight text-white sm:text-4xl">
            Why Patients Rate Us 5/5 Stars
          </h2>
          <p className="mt-3 text-[#a4a495] text-xs sm:text-xs font-sans">
            Read transparent reviews from patients who experienced our gentle, biocompatible, technology-centered care.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#33332d] border border-[#5A5A40]/30 rounded-2xl p-6 hover:border-[#D4D9C1]/30 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Stars and rating */}
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-natural-secondary fill-natural-secondary/90" />
                  ))}
                  <span className="text-natural-secondary text-xs font-bold ml-1.5 font-sans">5.0 Excellent</span>
                </div>

                {/* Text comment */}
                <p className="text-xs sm:text-sm text-natural-bg-light leading-relaxed italic font-serif">
                  "{rev.text}"
                </p>
              </div>

              {/* Author details */}
              <div className="border-t border-[#5A5A40]/40 pt-4 mt-6 flex justify-between items-center text-xs font-sans">
                <span className="font-bold text-[#D4D9C1]">{rev.author}</span>
                <span className="text-[#9a9a8b] font-medium">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregated Promo Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-[#33332d]/50 border border-[#5A5A40]/40 rounded-2xl py-4 px-6 max-w-lg mx-auto font-sans">
            <span className="text-sm font-bold text-natural-secondary">🔥 Overall Rating: 4.93 stars based on 2,541 patients</span>
            <span className="hidden sm:inline text-[#5A5A40]">|</span>
            <span className="text-xs font-medium text-[#c4c4b5]">Updated: Summer 2026</span>
          </div>
        </div>

      </div>
    </section>
  );
}
