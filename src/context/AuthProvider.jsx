import { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../firebase/auth";
import { getProviderProfile } from "../clinical/firebase/providerProfiles";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [providerProfile, setProviderProfile] = useState(null);
  const [loadingProviderProfile, setLoadingProviderProfile] = useState(false);

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
    getProviderProfile(user.uid)
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

  const isApprovedProvider = providerProfile?.role === "provider" && providerProfile?.status === "approved";

  return (
    <AuthContext.Provider
      value={{ user, initializing, providerProfile, loadingProviderProfile, isApprovedProvider }}
    >
      {children}
    </AuthContext.Provider>
  );
}
