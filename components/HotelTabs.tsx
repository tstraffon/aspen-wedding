"use client";

import { useState } from "react";

type Hotel = {
  name: string;
  category: string;
  description: string;
  website: string;
  atmosphere: string;
  location: string;
  distance: string;
  featured?: boolean;
};

const nicerHotels: Hotel[] = [
  {
    name: "The Limelight Hotel",
    category: "Boutique Comfort",
    description:
      "A more contemporary mountain experience with excellent amenities, located just a few blocks from the Jerome.",
    website: "https://www.limelighthotels.com/aspen",
    atmosphere: "Modern & Alpine",
    location: "Wagner Park",
    distance: "5 min walk",
  },
  {
    name: "The Mollie Aspen",
    category: "Stylish & Social",
    description:
      "A beautifully redesigned boutique hotel with a vibrant social scene, rooftop pool, and mountain views right in the heart of downtown.",
    website: "https://www.themollieaspen.com",
    atmosphere: "Boutique Chic",
    location: "Downtown Core",
    distance: "3 min walk",
  },
];

const affordableHotels: Hotel[] = [
  {
    name: "The Gant",
    category: "Condominiums",
    description:
      "Spacious condo-style suites with full kitchens, fireplaces, and a heated pool. A great option for families or groups looking for extra space.",
    website: "https://www.gantaspen.com",
    atmosphere: "Condo / Resort",
    location: "Edge of Downtown",
    distance: "10 min walk",
  },
  {
    name: "St. Moritz Lodge",
    category: "Classic Lodge",
    description:
      "A charming, family-owned lodge offering affordable rooms, a hot tub, and heated pool just steps from the gondola.",
    website: "https://www.stmoritzlodge.com",
    atmosphere: "Cozy & Classic",
    location: "Near Gondola",
    distance: "8 min walk",
  },
  {
    name: "Tyrolean Lodge",
    category: "Budget-Friendly",
    description:
      "One of Aspen's best values with a European alpine feel, outdoor pool, and a prime location within walking distance of everything.",
    website: "https://www.tyroleanlodge.com",
    atmosphere: "European Alpine",
    location: "Downtown West",
    distance: "7 min walk",
  },
  {
    name: "Aspen Mountain Lodge",
    category: "Mountain Value",
    description:
      "A comfortable and affordable option close to the base of Aspen Mountain, with complimentary breakfast and a relaxed vibe.",
    website: "https://www.aspenmountainlodge.com",
    atmosphere: "Casual Mountain",
    location: "Near Lift 1A",
    distance: "12 min walk",
  },
  {
    name: "Aspen Square Condominium Hotel",
    category: "Extended Stay & Condos",
    description:
      "Ideal for families or groups who prefer a kitchen and fireplace. Located right in the heart of the village near the gondola.",
    website: "https://www.aspensquarehotel.com",
    atmosphere: "Condo / Private",
    location: "Core / Gondola",
    distance: "8 min walk",
  },
  {
    name: "Hearthstone House",
    category: "Historic B&B",
    description:
      "A charming bed and breakfast in a beautifully restored Victorian home, offering an intimate and personal Aspen experience with daily breakfast.",
    website: "https://www.hearthstonehouse.com",
    atmosphere: "Intimate B&B",
    location: "West End",
    distance: "10 min walk",
  },
];

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div
      className={`hotel-card p-8 md:p-10 border hover:border-primary/20 transition-all duration-300 ${
        hotel.featured
          ? "hotel-card-featured bg-surface border-outline/10 hover:border-primary/30"
          : "bg-surface-variant/20 border-outline/5"
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <span className={`font-label text-[11px] uppercase tracking-[0.3em] block mb-2 ${hotel.featured ? "text-primary" : "text-on-surface-variant"}`}>
            {hotel.category}
          </span>
          <h3 className={`font-headline text-on-surface ${hotel.featured ? "text-3xl" : "text-2xl"}`}>
            {hotel.name}
          </h3>
        </div>
        {!hotel.featured && (
          <a
            className="btn-outline-glow px-8 py-3 font-label text-[11px] uppercase tracking-[0.2em] shrink-0 border border-outline text-on-surface-variant hover:border-primary hover:text-primary"
            href={hotel.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Website
          </a>
        )}
      </div>
      <p className="text-on-surface-variant leading-relaxed mb-6 max-w-xl">
        {hotel.description}
      </p>
      <div className="hotel-meta grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-outline/10">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
            Atmosphere
          </p>
          <p className="text-sm font-label text-on-surface">
            {hotel.atmosphere}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
            Location
          </p>
          <p className="text-sm font-label text-on-surface">{hotel.location}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1">
            Distance
          </p>
          <p className="text-sm font-label text-on-surface">{hotel.distance}</p>
        </div>
      </div>
    </div>
  );
}

function CompactHotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <div className="hotel-card p-6 bg-surface-variant/20 border border-outline/5 hover:border-primary/20 transition-all duration-300 group">
      <span className="font-label text-[11px] uppercase tracking-[0.3em] text-on-surface-variant block mb-2">
        {hotel.category}
      </span>
      <h3 className="font-headline text-lg text-on-surface mb-3 group-hover:text-primary transition-colors">
        {hotel.name}
      </h3>
      <div className="flex items-center gap-4 text-on-surface-variant text-sm mb-4">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary/50 text-base">
            directions_walk
          </span>
          {hotel.distance}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary/50 text-base">
            location_on
          </span>
          {hotel.location}
        </span>
      </div>
      <a
        className="font-label text-[11px] uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors"
        href={hotel.website}
        target="_blank"
        rel="noopener noreferrer"
      >
        Visit Website &rarr;
      </a>
    </div>
  );
}

export default function HotelTabs() {
  const [activeTab, setActiveTab] = useState<"nicer" | "affordable">("nicer");

  return (
    <div>
      {/* Hotel Jerome note */}
      <p className="text-on-surface-variant leading-relaxed font-light mb-10">
        While Hotel Jerome is our primary venue and a beautiful, historic Aspen
        icon… it&apos;s also incredibly expensive. We do not recommend you stay
        there, as there are more affordable options within walking distance.
      </p>

      {/* Tab buttons */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setActiveTab("nicer")}
          className={`flex-1 group relative px-6 py-4 rounded-lg font-label text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border ${
            activeTab === "nicer"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-surface-variant/20 border-outline/10 text-on-surface-variant hover:border-outline/30 hover:text-on-surface"
          }`}
        >
          <span className="block text-sm font-headline normal-case tracking-normal mb-1">
            Nicer
          </span>
          <span className="opacity-60">$400 – $800 / night</span>
        </button>
        <button
          onClick={() => setActiveTab("affordable")}
          className={`flex-1 group relative px-6 py-4 rounded-lg font-label text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border ${
            activeTab === "affordable"
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-surface-variant/20 border-outline/10 text-on-surface-variant hover:border-outline/30 hover:text-on-surface"
          }`}
        >
          <span className="block text-sm font-headline normal-case tracking-normal mb-1">
            More Affordable
          </span>
          <span className="opacity-60">$100 – $400 / night</span>
        </button>
      </div>

      {/* Hotel cards */}
      {activeTab === "nicer" ? (
        <div className="space-y-6">
          {nicerHotels.map((hotel) => (
            <HotelCard key={hotel.name} hotel={hotel} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {affordableHotels.map((hotel) => (
            <CompactHotelCard key={hotel.name} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
