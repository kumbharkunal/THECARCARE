import { contact } from "@/content/site";

// Google Maps links for the studio: open the address in Maps, or embed it (the embed loads
// only when someone asks for the map).
const query = encodeURIComponent(`The Car Care, ${contact.address.street}, ${contact.address.locality} ${contact.address.postalCode}`);
export const MAPS_OPEN = `https://www.google.com/maps/search/?api=1&query=${query}`;
export const MAPS_EMBED = `https://www.google.com/maps?q=${query}&output=embed`;
