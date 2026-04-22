const ADMIN_SESSION_KEY = "yaoyaoweiba_admin_auth";
const ADMIN_SECRET_KEY = "yaoyaoweiba_admin_secret";

export function getAdminPassword() {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "yaoyaoweiba123";
}

export function verifyAdminPassword(input: string) {
  return input === getAdminPassword();
}

export function isAdminAuthed() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function setAdminSecret(password: string) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(ADMIN_SECRET_KEY, password);
}

export function getAdminSecret() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_SECRET_KEY) || "";
}

export function clearAdminSecret() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ADMIN_SECRET_KEY);
}

export function setAdminAuthed(value: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_SESSION_KEY, value ? "true" : "false");
  if (!value) {
    clearAdminSecret();
  }
}
