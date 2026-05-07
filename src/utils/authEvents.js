export const AUTH_LOGOUT_EVENT = "auth:logout";

export const triggerAuthLogout = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
  }
};
