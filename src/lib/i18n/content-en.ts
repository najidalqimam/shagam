import type { SiteContent, SiteSettings } from "@/lib/cms/types";

export function defaultSiteContentEn(): SiteContent {
  return {
    navLinks: [
      { href: "#services", label: "Services" },
      { href: "#how", label: "How it works" },
      { href: "#why", label: "Why Shagam" },
      { href: "#operators", label: "Operators" },
      { href: "#enterprise", label: "Beneficiaries" },
      { href: "#contact", label: "Contact" },
    ],
    stats: [
      { value: "Hours", label: "to first qualified quote" },
      { value: "13", label: "service families in the catalog" },
      { value: "100%", label: "compliance-documented missions" },
      { value: "5", label: "operator qualification levels" },
    ],
    complianceChecks: [
      "Aircraft registration and remote-pilot certificate",
      "Activity license and operation permit",
      "Third-party liability insurance",
      "Compliant electronic invoicing",
    ],
    steps: [
      {
        num: "01",
        title: "Choose the service",
        body: "From a clear catalog—no prior technical or regulatory knowledge required.",
      },
      {
        num: "02",
        title: "Define the site",
        body: "Draw the area on the map or upload a boundary file; we check restricted zones automatically.",
      },
      {
        num: "03",
        title: "Receive offers",
        body: "From operators who passed license, insurance, and capability checks for this exact service.",
      },
      {
        num: "04",
        title: "Approve and track",
        body: "A signed electronic contract, a permit tied to the mission, and live execution tracking.",
      },
      {
        num: "05",
        title: "Receive and pay",
        body: "Proof of completion matching the agreed standard, and a compliant invoice after your approval.",
      },
    ],
    services: [
      {
        title: "Facade and surface cleaning",
        body: "Clean building and tower facades without scaffolding, ropes, or shutting the building down.",
        meta: "Physical delivery · Level 3 — Specialist",
        kind: "physical",
      },
      {
        title: "Agricultural spraying and seeding",
        body: "Spray pesticides and nutrients and sow seed with precision and a controlled buffer zone.",
        meta: "Physical delivery · Level 3 — Specialist",
        kind: "physical",
      },
      {
        title: "Construction progress monitoring",
        body: "Periodic documentation, quantity takeoffs, and progress comparisons over time.",
        meta: "Data product · Level 2 — Certified",
        kind: "data",
      },
      {
        title: "Energy and utility network inspection",
        body: "Visual and thermal inspection of towers, lines, and transformers without shutting down operations.",
        meta: "Data product · Level 2 — Certified",
        kind: "data",
      },
      {
        title: "Thermal survey of solar farms",
        body: "Detect failed panels and hotspots with a panel-level report.",
        meta: "Data product · Level 2 — Certified",
        kind: "data",
      },
      {
        title: "Confined and hard-to-reach structures",
        body: "Inspect tanks, stacks, and structures that are difficult or unsafe to enter.",
        meta: "Physical delivery · Level 3 — Specialist",
        kind: "physical",
      },
      {
        title: "Real-estate photography and marketing",
        body: "Processed aerial photos and video plus virtual tours ready to publish.",
        meta: "Data product · Level 1 — Verified",
        kind: "data",
      },
      {
        title: "Events and occasions photography",
        body: "Aerial coverage of private and official events with shots and clips ready to publish.",
        meta: "Data product · Level 1 — Verified",
        kind: "data",
      },
      {
        title: "Surveying, mapping, and volumes",
        body: "Orthomosaics, terrain models, point clouds, and volume calculations.",
        meta: "Data product · Level 2 — Certified",
        kind: "data",
      },
      {
        title: "Site security monitoring",
        body: "Perimeter and site monitoring with live feed and incident logging.",
        meta: "Live monitoring · Level 2 — Certified",
        kind: "live",
      },
      {
        title: "Environmental and land monitoring",
        body: "Change detection, index maps, and recurring monitoring reports.",
        meta: "Data product · Level 2 — Certified",
        kind: "data",
      },
      {
        title: "Search, rescue, and emergency support",
        body: "Rapid aerial support for search and response in coordination with the competent authority.",
        meta: "Live monitoring · Level 3 — Specialist",
        kind: "live",
      },
      {
        title: "Cargo delivery",
        body: "Moving defined payloads between approved points—coming in a future expansion.",
        meta: "Coming soon",
        kind: "soon",
      },
    ],
    serviceFilters: [
      { id: "all", label: "All" },
      { id: "physical", label: "Physical" },
      { id: "data", label: "Data" },
      { id: "live", label: "Live monitoring" },
    ],
    whyItems: [
      {
        title: "Truly qualified operators",
        body: "You only see offers from operators we have verified for licenses, insurance, and capability for this exact service—filtering happens before the offer, not after.",
      },
      {
        title: "Competitive, transparent pricing",
        body: "Multiple comparable offers by price, timeline, and quality record—instead of a single opaque bid. Your budget ceiling is never shown to operators.",
      },
      {
        title: "Documented compliance",
        body: "Every mission carries a record of licenses, permits, insurance, and the responsible pilot—exportable in one file for any review or audit.",
      },
      {
        title: "Agreed proof of completion",
        body: "We define what “done” means before booking, not after delivery. Each service has a predefined evidence standard—so handover disputes disappear.",
      },
    ],
    operatorPerks: [
      "Invitations matched to your capabilities, equipment, and coverage—not broadcast to everyone.",
      "One compliance vault: upload licenses and insurance once, reuse them on every mission.",
      "Renewal alerts at 60, 30, and 7 days so you never lose eligibility over a forgotten date.",
      "Payment assurance after the client accepts completion.",
      "A documented quality record you can cite when bidding.",
    ],
    operatorLevels: [
      {
        level: "0",
        title: "Registered",
        body: "Profile submitted—visible in the network but not cleared to bid.",
      },
      {
        level: "1",
        title: "Verified",
        body: "Identity, commercial registration, and licenses have been checked.",
      },
      {
        level: "2",
        title: "Certified",
        body: "Proven competence per service and cleared for standard missions.",
      },
      {
        level: "3",
        title: "Specialist",
        body: "Cleared for high-risk services with an operational safety study.",
      },
      {
        level: "4",
        title: "Enterprise partner",
        body: "Framework agreement, dedicated capacity, and auditable operations.",
      },
    ],
    enterpriseItems: [
      {
        title: "Framework agreement",
        body: "Pre-agreed rates and terms—every request is a drawdown, not a new negotiation.",
      },
      {
        title: "Multi-site programs",
        body: "Scheduled recurring services across all your sites with unified reporting.",
      },
      {
        title: "Roles and approval limits",
        body: "Internal roles and approval thresholds that mirror your procurement process.",
      },
      {
        title: "Auditable compliance record",
        body: "Full export of documents for any request in any internal or external review.",
      },
      {
        title: "Public-sector procurement fit",
        body: "Paths and procedures designed for government engagement.",
      },
      {
        title: "Integrate with your systems",
        body: "Raise requests directly from your asset or maintenance management system.",
      },
    ],
    complianceItems: [
      "Aircraft registration and remote-pilot certificate valid on the execution date—not only at signup.",
      "Activity license and operation permit tied to the mission before it is scheduled.",
      "Third-party liability insurance appropriate to the service type and risk level.",
      "Classification of any imagery or data produced before it is shared with any party.",
      "Compliant electronic invoice linked to the contract and permit numbers.",
    ],
    faqs: [
      {
        q: "How long until the first quote?",
        a: "For standard low-risk services, the first qualified offer often arrives within hours of a complete request. High-risk services—like facade cleaning and agricultural spraying—take longer because permits and safety studies are part of preparation.",
      },
      {
        q: "Do I need to know the aircraft or sensor type?",
        a: "No. The request form asks about the outcome, site, and operational needs. From that, the platform determines the right aircraft class and payload and matches an operator who has them.",
      },
      {
        q: "Who is responsible for permits?",
        a: "The operator obtains the permit; the platform verifies it exists, is valid, and is linked to the mission before scheduling. No mission moves to “Scheduled” without that.",
      },
      {
        q: "How do I know the work was done as agreed?",
        a: "The proof-of-completion standard is set when the request is created—before booking. No invoice is issued until you accept that evidence; you can request correction or open a dispute.",
      },
      {
        q: "Are my data and imagery kept in the Kingdom?",
        a: "Yes. Geospatial and personal data are hosted in Saudi Arabia. Every output is classified before sharing, and no data is re-licensed without your explicit approval under the request terms.",
      },
      {
        q: "Can I request multiple sites or recurring work?",
        a: "Yes. Recurring services can be scheduled under one program, and enterprise accounts can use a framework agreement with agreed rates, drawdowns, and unified reporting.",
      },
      {
        q: "What if I get no offers?",
        a: "That means no qualified operator is available in your area and time window. The platform notifies you immediately, suggests expanding geography or timing, and alerts our team to address the coverage gap.",
      },
      {
        q: "How is pricing calculated?",
        a: "By scope, service type, risk level, site distance, airspace constraints, timing, and required outputs. Recurring and multi-site agreements get better rates.",
      },
    ],
    cities: [
      "Riyadh",
      "Jeddah",
      "Dammam",
      "Makkah",
      "Madinah",
      "Abha",
      "Tabuk",
      "Other",
    ],
    serviceOptions: [
      "Facade and surface cleaning",
      "Agricultural spraying and seeding",
      "Construction progress monitoring",
      "Energy and utility network inspection",
      "Thermal survey of solar farms",
      "Confined and hard-to-reach structures",
      "Real-estate photography and marketing",
      "Events and occasions photography",
      "Surveying, mapping, and volumes",
      "Site security monitoring",
      "Environmental and land monitoring",
      "Search, rescue, and emergency support",
      "Not sure yet",
    ],
    hero: {
      eyebrow: "Request the service… we go to it",
      title: "Don’t hunt for an operator—define the outcome and let Shagam handle the rest",
      body: "Finding a qualified operator, managing permits, execution, verification, and invoicing—in one path.",
      primaryCta: "Request a service now",
      secondaryCta: "How does the platform work?",
    },
    how: {
      eyebrow: "How it works",
      title: "Five steps from need to handover",
      body: "Everything between choosing the service and releasing payment is managed by the platform; you define the outcome.",
    },
    contact: {
      eyebrow: "Get started",
      title: "Request a service or register as an operator",
      body: "Fill in the form and our team will reach out. Submitting does not commit you until you accept an offer.",
    },
    why: {
      eyebrow: "Why Shagam",
      title: "One service… one accountable party",
      body: "The gap is not technology or operators. What was missing is a party that stands between both sides and owns the process.",
    },
    operators: {
      eyebrow: "For operators",
      title: "Join the Shagam network",
      body: "If you have aircraft, crew, and valid licenses, you don’t need more clients—you need a steady channel and a compliance file you don’t rebuild every time.",
      cta: "Register as an operator",
    },
    enterprise: {
      eyebrow: "For organizations",
      title: "Contract once instead of negotiating every request",
      body: "If you have multiple sites or recurring needs, an enterprise account turns each request into a drawdown from an existing agreement.",
      cta: "Talk to enterprise accounts",
    },
    compliance: {
      eyebrow: "Compliance and safety",
      title: "What you buy is not flight time",
      body: "It is assurance that what was done is lawful, documented, and legally retainable and usable. That layer is the product itself—not an add-on.",
    },
    faq: {
      eyebrow: "FAQ",
      title: "What clients usually ask",
    },
    servicesSection: {
      eyebrow: "Services",
      title: "Service catalog",
      body: "Each service has its own request model and a predefined delivery standard—no one generic form for everything.",
      cta: "Request a service now",
    },
  };
}

export function defaultSettingsEn(): SiteSettings {
  return {
    siteName: "Shagam",
    tagline: "Drone services platform",
    footerText:
      "Drone services platform — request the service and we go to it.",
    copyrightName: "Shagam · Developed by Najid AL-Qimam",
    contactEmail: "",
    contactPhone: "",
    whatsapp: "",
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    adminNotes: "",
  };
}

export const siteContentEn = defaultSiteContentEn();
export const siteSettingsEn = defaultSettingsEn();
