import { useEffect, useState } from "react";
import { subscribeToAuthChanges } from "../firebase/auth";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let unsubscribe;
    let cancelled = false;

    subscribeToAuthChanges((firebaseUser) => {
      if (cancelled) return;
      setUser(firebaseUser);
      setInitializing(false);
    }).then((unsub) => {
      unsubscribe = unsub;
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return <AuthContext.Provider value={{ user, initializing }}>{children}</AuthContext.Provider>;
}
