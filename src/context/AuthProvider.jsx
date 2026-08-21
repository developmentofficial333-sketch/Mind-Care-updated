import { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../firebase/auth";
import { getOrProvisionProviderProfile } from "../clinical/firebase/providerProfiles";
import { getAdminProfile } from "../firebase/adminAccess";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [providerProfile, setProviderProfile] = useState(null);
  const [loadingProviderProfile, setLoadingProviderProfile] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loadingAdminProfile, setLoadingAdminProfile] = useState(false);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    subscribeToAuthChanges((firebaseUser) => {
      if (cancelled) return;
      setUser(firebaseUser);
      setInitializing(false);
    })
      .then((unsub) => {
        unsubscribe = unsub;
      })
      .catch((err) => {
        // Firebase isn't configured (or auth otherwise failed to start up) —
        // treat this as "signed out" instead of leaving `initializing` stuck
        // at true forever, which would blank every protected route.
        console.error("Auth initialization failed:", err);
        if (!cancelled) {
          setUser(null);
          setInitializing(false);
        }
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  // Looked up alongside auth state (rather than lazily per-page, the way
  // memberProfiles is) because ProviderRoute needs to know immediately
  // whether a freshly-signed-in user is an approved provider.
  useEffect(() => {
    if (!user) {
      setProviderProfile(null);
      setLoadingProviderProfile(false);
      return;
    }
    let cancelled = false;
    setLoadingProviderProfile(true);
    getOrProvisionProviderProfile(user.uid, user.email)
      .then((profile) => {
        if (!cancelled) setProviderProfile(profile);
      })
      .catch((err) => {
        console.error("Failed to load provider profile:", err);
        if (!cancelled) setProviderProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingProviderProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Separate from providerProfile above: an account can be an admin, a
  // provider, both, or neither — these are independent role checks, not a
  // hierarchy, so they're fetched and exposed separately.
  useEffect(() => {
    if (!user) {
      setAdminProfile(null);
      setLoadingAdminProfile(false);
      return;
    }
    let cancelled = false;
    setLoadingAdminProfile(true);
    getAdminProfile(user.uid)
      .then((profile) => {
        if (!cancelled) setAdminProfile(profile);
      })
      .catch((err) => {
        console.error("Failed to load admin profile:", err);
        if (!cancelled) setAdminProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingAdminProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const isApprovedProvider = providerProfile?.role === "provider" && providerProfile?.status === "approved";
  const isAdmin = adminProfile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        providerProfile,
        loadingProviderProfile,
        isApprovedProvider,
        adminProfile,
        loadingAdminProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
