export const BUSINESS_NAME = "Gagan Mobile Hospital" as const;
export const BUSINESS_ADDRESS = "Village Baran, Sirhand Road, Patiala, Punjab – 147004" as const;
export const BUSINESS_PHONE = "+91 98140 36114" as const;
export const BUSINESS_GSTIN = "" as const; // Fill in once GST number is received
export const BUSINESS_PHONE_RAW = "919814036114" as const;
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
