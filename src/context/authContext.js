import { createContext } from "react";

export const AuthContext = createContext({
  user: null,
  initializing: true,
  providerProfile: null,
  loadingProviderProfile: false,
  isApprovedProvider: false,
  adminProfile: null,
  loadingAdminProfile: false,
  isAdmin: false,
});
