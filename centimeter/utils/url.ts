export function backendBaseUrl(): string {
  return (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
}
