export const BUSINESS_NAME = "Gagan Mobile Care" as const;
export const BUSINESS_ADDRESS = "Shop 14, Lajpat Nagar Central Market, New Delhi – 110024" as const;
export const BUSINESS_PHONE = "+91 98112 00410" as const;
export const BUSINESS_PHONE_RAW = "919811200410" as const;
export const WHATSAPP_URL = `https://wa.me/${BUSINESS_PHONE_RAW}` as const;
export const BUSINESS_EMAIL = "" as const; // Not yet confirmed with Gagan
export const BUSINESS_HOURS = [
  { day: "Monday–Saturday", open: "10:00", close: "21:00" },
  { day: "Sunday", open: "11:00", close: "19:00" },
] as const;
export const BUSINESS_SERVICES = [
  "screen-replacement",
  "battery-replacement",
  "charging-port",
  "camera-repair",
  "back-glass",
  "water-damage",
  "software",
  "speaker-mic",
  "other",
] as const;
export type BusinessService = (typeof BUSINESS_SERVICES)[number];
