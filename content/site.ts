// Every line of copy on the site lives here. Facts come only from the client brief
// (Instagram, WhatsApp Business profile and catalogue). Anything unconfirmed is listed
// in CONFIRM at the bottom and must be checked with the client before launch.

export type ServiceId = "sun-film" | "ppf" | "ceramic" | "detailing";
export type GlassZone = "windscreen" | "front" | "rear" | "back";

const PRIMARY_PHONE = "+91 95112 02540";
const PRIMARY_PHONE_E164 = "919511202540";

export const site = {
  name: "The Car Care",
  wordmark: "THE CAR CARE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thecarcare.vercel.app",
  meta: {
    title: "The Car Care | PPF, Sun Film & Ceramic Coating in Pune",
    description:
      "Sun control films, paint protection film and ceramic coating, fitted by hand at our Dhankawadi studio or at your doorstep in Pune.",
    ogAlt: "The Car Care. We protect what you drive.",
  },

  contact: {
    phones: [
      { label: PRIMARY_PHONE, href: "tel:+919511202540" },
      { label: "+91 75586 58837", href: "tel:+917558658837" },
    ],
    whatsappNumber: PRIMARY_PHONE_E164,
    email: "thecarcare.in@gmail.com",
    address: {
      lines: [
        "Wing-C, Nataraj Residency, Hatti Chowk",
        "near Bank of Maharashtra, Raut Bag Society",
        "Pratibha Nagar, Dhankawadi",
        "Pune, Maharashtra 411043",
      ],
      street:
        "Wing-C, Nataraj Residency, Hatti Chowk, near Bank of Maharashtra, Raut Bag Society, Pratibha Nagar, Dhankawadi",
      locality: "Pune",
      region: "Maharashtra",
      postalCode: "411043",
      country: "IN",
      short: "Dhankawadi, Pune 411043",
    },
    hoursConfirmed: false,
    hoursNote: "Usually 9 am to 6 pm. Message us to book a slot.",
    hoursShort: "Usually 9 am to 6 pm",
    instagram: { handle: "@thecarcare.in", href: "https://www.instagram.com/thecarcare.in/" },
    facebook: { handle: "thecarcare.in", href: "https://www.facebook.com/thecarcare.in" },
  },

  messages: {
    general: "Hi The Car Care, I found your website and I'd like to protect my car.",
    fab: "Hi The Car Care, I'd like to ask about protecting my car.",
    offer: "Hi The Car Care, I saw the 20% off and free installation offer on sun control films. Is it still on?",
  },

  nav: {
    links: [
      { href: "#services", label: "Services" },
      { href: "#sun-film", label: "Sun film" },
      { href: "#ppf", label: "PPF" },
      { href: "#ceramic", label: "Ceramic" },
      { href: "#visit", label: "Visit" },
    ],
    cta: "Book on WhatsApp",
    menuLabel: "Menu",
    call: "Call",
    whatsapp: "WhatsApp",
  },

  hero: {
    lead: "We don't just detail cars.",
    title: ["We protect", "what you drive."],
    sub: "Sun control films, paint protection film and ceramic coating, fitted by hand at our Dhankawadi studio or at your doorstep in Pune.",
    primary: "Book on WhatsApp",
    secondary: "Explore services",
    facts: [
      { icon: "film", text: "Garware and GSWF films" },
      { icon: "shield", text: "3 and 5 year warranty on selected products" },
      { icon: "house", text: "Doorstep installation in Pune" },
      { icon: "sun", text: "Up to 99% UV rejection" },
    ],
    imageAlt:
      "A deep blue SUV coupe in a bright white car protection studio, lit by long overhead light panels",
  },

  ticker: {
    label: "Film brands and products we fit",
    items: ["Garware Hi-Tech Films", "Fronty", "International SRC", "IceCool Shield", "Safety Glazing", "GSWF Defender PPF"],
    pause: "Pause the moving list",
    play: "Play the moving list",
  },

  services: {
    title: "One car. Four layers of care.",
    intro: "Most of what we fit is invisible once it's on. This is where each layer sits.",
    carLabel: "Line drawing of a car",
    items: [
      {
        id: "sun-film",
        name: "Sun control films",
        body: "Garware Hi-Tech films on your windows that block up to 99% of UV rays and cut the glare. You pick the product and a road-legal shade; we fit it at the studio or at your doorstep.",
        facts: ["Up to 99% UV rejection", "Road-legal shades", "3 and 5 year warranty on selected products"],
        zoneLabel: "the windows, tinted with sun control film and stopping UV rays",
        cta: "Ask about sun film",
        message: "Hi The Car Care, I'd like to know about sun control film for my car.",
      },
      {
        id: "ppf",
        name: "Paint protection film",
        body: "A clear GSWF Defender film laid over your paint. It takes stone chips and scratches, and its self-healing top coat can heal light swirls.",
        facts: ["Self-healing", "Hydrophobic", "Non-yellowing"],
        zoneLabel: "the bonnet, bumper, mirrors and door edges, covered with paint protection film",
        cta: "Ask about PPF",
        message: "Hi The Car Care, I'd like to know about paint protection film (PPF) for my car.",
      },
      {
        id: "ceramic",
        name: "Ceramic coating",
        body: "A thin, hard layer over the paint that adds a deep gloss. Water beads and rolls off, so washing gets easier.",
        facts: ["Deep gloss", "Water beads and rolls off", "Easier washing"],
        zoneLabel: "the full body line, with a gloss highlight from ceramic coating",
        cta: "Ask about ceramic coating",
        message: "Hi The Car Care, I'd like to know about ceramic coating for my car.",
      },
      {
        id: "detailing",
        name: "Detailing",
        body: "Every car that comes to us gets professional care and attention to every detail. Tell us what yours needs and we'll plan the work around it.",
        facts: ["Professional care", "Attention to every detail", "Planned around your car"],
        zoneLabel: "the interior, with seats and dashboard outlined for detailing",
        cta: "Ask about detailing",
        message: "Hi The Car Care, I'd like to know about detailing for my car.",
      },
    ] satisfies {
      id: ServiceId;
      name: string;
      body: string;
      facts: string[];
      zoneLabel: string;
      cta: string;
      message: string;
    }[],
  },

  sunFilm: {
    title: "Protect your car. Protect your comfort.",
    intro: "Film on your windows works every time the sun is out. It does four things for you.",
    benefits: [
      {
        n: "1",
        title: "Up to 99% UV rejection",
        line: "Helps protect your skin and your car's interior from harmful UV rays.",
        image: "sunfilm-fitting",
        alt: "Gloved hands smoothing sun control film onto a rear side window with a blue squeegee, a sunny Pune street outside",
      },
      {
        n: "2",
        title: "Protects the interior from fading",
        line: "Helps preserve leather, dashboards and interior finishes from fading and cracking.",
        image: "interior-sunlight",
        alt: "Tan leather seats and a dashboard in warm late-afternoon sunlight",
      },
      {
        n: "3",
        title: "Holds shattered glass together",
        line: "Safety films can help hold shattered glass in place.",
        image: "safety-glass",
        alt: "A cracked rear side window held in its frame by a clear safety film",
      },
      {
        n: "4",
        title: "Less glare, clearer view",
        line: "A more comfortable drive in bright conditions.",
        image: "glare-drive",
        alt: "The view from the driver's seat toward a low morning sun over hills outside Pune",
      },
    ],
    compare: {
      label: "Compare the drive without and with sun control film",
      before: "Without film",
      after: "With film",
      caption: "Illustration: the same view with and without glare.",
    },
    offer: {
      active: true,
      text: "20% off + free installation on sun control films.",
      detail: "Selected products, for a limited time. Ask us for details.",
      cta: "Ask about the offer",
    },
    shade: {
      title: "Road-legal shades, no challan worries.",
      intro: "Pick a window and slide to the shade you like. The guide stops at the darkest shade the law allows.",
      vltExplainer: "VLT is the share of visible light the glass lets through. Higher means lighter.",
      zonesLabel: "Window",
      zones: [
        { id: "windscreen", label: "Windscreen", min: 70 },
        { id: "front", label: "Front side windows", min: 50 },
        { id: "rear", label: "Rear side windows", min: 50 },
        { id: "back", label: "Rear window", min: 70 },
      ] satisfies { id: GlassZone; label: string; min: number }[],
      max: 90,
      sliderLabel: "Visible light through the glass",
      darker: "Darker",
      lighter: "Clearer",
      limit: "Darker than this isn't road-legal in India.",
      legal:
        "In India, film on car glass is legal only as certified safety glazing that meets IS 2553 (Part 2):2019. It must let through at least 70% of visible light on the windscreen and the rear window, and at least 50% on the side windows (Central Motor Vehicles Rules, Rule 100, as amended from 1 April 2021).",
      disclaimer: "General information, not legal advice.",
      cta: "Ask which film suits your car",
      diagramLabel: "Diagram of a car's glass with sunlight and UV rays",
    },
  },

  ppf: {
    title: "Scratch it. Watch it heal.",
    intro: "Paint protection film is a clear layer over your paint, and its self-healing top coat can heal light swirls. Try it on the panel.",
    canvasLabel: "Draw on the paint",
    canvasHintTouch: "Draw on the paint with your finger, then let go.",
    canvasHintPointer: "Draw on the paint, then let go.",
    canvasAria: "Paint panel. Draw on it to scratch it, then let go to watch it heal.",
    scratch: "Scratch it",
    heal: "Heal it",
    reset: "Reset",
    healed: "Healed.",
    productTitle: "GSWF Defender PPF",
    properties: ["Hydrophobic", "Self-healing", "Non-yellowing", "High stretchability", "Impact resistant"],
    coverageTitle: "Coverage",
    coverage: "Cover the high-impact areas (bonnet, bumper, mirrors and door edges) or the whole car.",
    imageAlt: "Gloved hands laying clear paint protection film over a deep blue bonnet with a squeegee",
    cta: "Ask about PPF",
    message: "Hi The Car Care, I'd like to know about paint protection film (PPF) for my car.",
  },

  ceramic: {
    title: "A deeper gloss. An easier wash.",
    intro: "A ceramic coating bonds a thin, hard layer to your paint. Drag the handle to compare.",
    compare: {
      label: "Compare paint before and after ceramic coating",
      before: "Before",
      after: "After",
      caption: "Illustration: the same panel without and with a coating.",
    },
    facts: [
      { title: "Water beads and rolls off", body: "Rain and wash water run off instead of sitting on the paint." },
      { title: "A deep, glassy gloss", body: "Reflections look sharper and the colour looks richer." },
      { title: "Washing gets easier", body: "Dirt lets go of the coated surface more easily." },
    ],
    beadingAlt: "Round water beads sitting on a deep blue ceramic-coated bonnet",
    imageAlt: "The curved front fender of a deep blue car with long, sharp light reflections",
    cta: "Ask about ceramic coating",
    message: "Hi The Car Care, I'd like to know about ceramic coating for my car.",
  },

  why: {
    title: "Why The Car Care",
    doorstep: {
      title: "We come to you.",
      body: "Doorstep installation across Pune.",
      alt: "An installer fitting film to a white SUV in a housing society parking bay",
    },
    brand: { title: "Your brand, your shade", body: "Garware or GSWF, in road-legal shades." },
    warranty: { years: "3 and 5", title: "year warranty", body: "On selected products. Ask us for the terms." },
    craft: { title: "Premium products. Expert workmanship.", body: "Every car gets attention to every detail." },
    whatsapp: { title: "Message us anytime.", cta: "Chat on WhatsApp" },
  },

  process: {
    title: "From message to finished.",
    steps: [
      { title: "Message us", body: "Tell us your car and what you want protected, on WhatsApp or a call." },
      { title: "Pick film and shade", body: "We help you choose the brand, the product and a road-legal shade." },
      { title: "Installation", body: "At our studio or at your doorstep, by appointment." },
      { title: "Warranty and care", body: "Selected products carry a 3 or 5 year warranty, and we share aftercare tips." },
    ],
  },

  faq: {
    title: "Before you book",
    intro: "Ask us anything on WhatsApp. These come up most.",
    items: [
      {
        q: "Is sun film legal on cars in India?",
        a: "Yes, if it's certified safety glazing. The film must meet IS 2553 (Part 2):2019 and let through at least 70% of visible light on the windscreen and rear window, and at least 50% on the side windows. We help you pick a road-legal shade. General information, not legal advice.",
      },
      {
        q: "Can you install at my home or office?",
        a: "Yes. We offer doorstep installation in Pune. Message us your area and we'll confirm a slot.",
      },
      {
        q: "PPF or ceramic coating: what's the difference?",
        a: "PPF is a clear physical film that takes stone chips and scratches and can heal light swirls. A ceramic coating is a thin, hard layer that adds gloss and makes washing easier. Many owners use both.",
      },
      {
        q: "Which brands do you use?",
        a: "Garware Hi-Tech Films for sun control film and GSWF for paint protection film.",
      },
      {
        q: "Is there a warranty?",
        a: "Selected products carry a 3 or 5 year warranty. Ask us for the terms on the product you choose.",
      },
      {
        q: "How long does it take?",
        a: "It depends on the service and your car. Message us your car model and we'll tell you.",
      },
    ],
  },

  visit: {
    title: "Bring your car. Or we'll come to you.",
    marathi: "कारण प्रत्येक गाडीला काळजी हवी.",
    addressTitle: "Studio",
    contactTitle: "Call or write",
    socialTitle: "Follow",
    map: {
      title: "Dhankawadi, Pune",
      load: "Show the map",
      open: "Open in Google Maps",
      iframeTitle: "Map showing The Car Care in Dhankawadi, Pune",
    },
    enquiry: {
      title: "Get a quote on WhatsApp",
      intro: "Fill this in and we'll open WhatsApp with your message ready to send.",
      car: { label: "Car make and model", placeholder: "e.g. Hyundai Creta", error: "Add your car's make and model." },
      services: {
        label: "What would you like?",
        options: ["Sun control film", "PPF", "Ceramic coating", "Detailing"],
        error: "Pick at least one service.",
      },
      where: { label: "Where", studio: "At the studio", doorstep: "At my doorstep" },
      area: { label: "Your area", placeholder: "e.g. Kothrud", error: "Add your area so we can plan the visit." },
      notes: { label: "Anything else? (optional)", placeholder: "Shade, colour, timing, questions" },
      preview: "Your message",
      submit: "Send on WhatsApp",
      noScript: "Message us on WhatsApp",
    },
  },

  footer: {
    tagline: "Because every car deserves care.",
    explore: "Explore",
    contact: "Contact",
    visit: "Visit",
    links: [
      { href: "#services", label: "Services" },
      { href: "#sun-film", label: "Sun film" },
      { href: "#ppf", label: "PPF" },
      { href: "#ceramic", label: "Ceramic coating" },
      { href: "#why", label: "Why us" },
      { href: "#process", label: "How it works" },
      { href: "#faq", label: "Questions" },
      { href: "#visit", label: "Visit" },
    ],
    rights: "The Car Care",
  },

  notFound: {
    title: "Nothing parked here.",
    body: "The page you're looking for isn't on this site.",
    cta: "Back to the homepage",
  },

  a11y: {
    skip: "Skip to content",
    fab: "Chat with The Car Care on WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Site menu",
    home: "The Car Care, back to top",
    newTab: "(opens WhatsApp)",
  },
} as const;

export const WA_PHONE = PRIMARY_PHONE_E164;

// Facts the client must confirm before launch. Never rendered on the page.
export type ConfirmItem = { topic: string; question: string; onSiteNow: string };

export const CONFIRM: ConfirmItem[] = [
  {
    topic: "Offer",
    question: "Is the 20% off + free installation offer on sun control films still running? Terms and end date?",
    onSiteNow: "Shown (offer.active = true), worded as selected products for a limited time.",
  },
  {
    topic: "Hours",
    question: "Opening hours for every day of the week.",
    onSiteNow: "\"Usually 9 am to 6 pm\". WhatsApp only shows Friday 09:00 to 18:00. No live open/closed status.",
  },
  {
    topic: "Warranty",
    question: "Which products carry the 3-year warranty and which the 5-year warranty?",
    onSiteNow: "\"3 and 5 year warranty on selected products\".",
  },
  {
    topic: "Doorstep coverage",
    question: "Doorstep area (Pune only, or PCMC too) and which services can be done at the doorstep?",
    onSiteNow: "\"Doorstep installation in Pune\"; the hero mentions doorstep fitting for all three services.",
  },
  {
    topic: "Mumbai",
    question: "Do you also serve Mumbai? The WhatsApp description says \"The car care mumbai\".",
    onSiteNow: "Pune only.",
  },
  {
    topic: "WhatsApp number",
    question: "Which number is the WhatsApp Business number?",
    onSiteNow: "+91 95112 02540 for every WhatsApp link; +91 75586 58837 shown as a second phone.",
  },
  {
    topic: "Studio visits",
    question: "Do customers visit Nataraj Residency (a residential building), or come by appointment?",
    onSiteNow: "\"our Dhankawadi studio\" in the hero; installation \"by appointment\" in the process.",
  },
  {
    topic: "Address spelling",
    question: "Exact spelling of the address. The profile says \"Nataraj recidency\".",
    onSiteNow: "\"Nataraj Residency\".",
  },
  {
    topic: "Film compliance",
    question: "Are the car films you sell CMVR-compliant safety glazing (IS 2553 Part 2:2019)?",
    onSiteNow: "The site presents road-legal shades and the CMVR VLT limits as general information.",
  },
  {
    topic: "Brand logos",
    question: "Permission to show the Garware and GSWF logos.",
    onSiteNow: "Brand and product names shown as text only.",
  },
  { topic: "Prices", question: "Prices for each service.", onSiteNow: "No prices shown." },
  { topic: "Years in business", question: "Years in business.", onSiteNow: "Not shown." },
  { topic: "Owner", question: "The owner's name.", onSiteNow: "Not shown." },
  {
    topic: "Photos",
    question: "Real photos of your work to replace the AI illustrations.",
    onSiteNow: "AI images used as atmosphere only.",
  },
  {
    topic: "Google Business Profile",
    question: "Google Business Profile link and reviews.",
    onSiteNow: "No reviews or ratings shown; map uses the address.",
  },
  {
    topic: "Marathi line",
    question: "OK to show \"कारण प्रत्येक गाडीला काळजी हवी.\" (because every car deserves care)?",
    onSiteNow: "Shown in the Visit section.",
  },
  {
    topic: "PPF coverage",
    question: "Coverage options for PPF: high-impact areas, full car, or both?",
    onSiteNow: "Both described.",
  },
  {
    topic: "Detailing scope",
    question: "What does detailing include (interior, exterior, both)?",
    onSiteNow: "Described in general terms only.",
  },
  {
    topic: "Logo files",
    question: "We used your original logo files, not the redrawn PNGs. Is this the current logo?",
    onSiteNow: "Original mark and lockup, white background removed.",
  },
];
