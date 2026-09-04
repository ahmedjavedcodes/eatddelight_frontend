import { apiFetch } from "./client";
import type { ContactMessage, ContactMessageInput } from "./types";

export function submitContactMessage(input: ContactMessageInput) {
  return apiFetch<ContactMessage>("/contact", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
