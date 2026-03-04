/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInAnonymously, signOut } from "firebase/auth";
import { auth } from "../firebase";

const LOCAL_FAKE_AUTH_KEY = "goal-tracker-fake-auth";
const AuthContext = createContext(null);

function readLocalFakeUser() {
  try {
    const raw = localStorage.getItem(LOCAL_FAKE_AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.uid) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readLocalFakeUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          const localUser = readLocalFakeUser();
          const authUser = {
            uid: firebaseUser.uid,
            name: localUser?.name || firebaseUser.displayName || "",
            provider: "firebase",
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_FAKE_AUTH_KEY, JSON.stringify(authUser));
        } else {
          const localUser = readLocalFakeUser();
          setUser(localUser);
        }
        setLoading(false);
      },
      () => {
        // Keep app usable if Firebase auth listener fails.
        setUser(readLocalFakeUser());
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const loginFake = async (name = "") => {
    try {
      const cred = await signInAnonymously(auth);
      const authUser = {
        uid: cred.user.uid,
        name: name.trim(),
        provider: "firebase",
      };
      setUser(authUser);
      localStorage.setItem(LOCAL_FAKE_AUTH_KEY, JSON.stringify(authUser));
      return authUser;
    } catch {
      // Fallback mode if anonymous auth is disabled in Firebase.
      const localUser = {
        uid: crypto.randomUUID(),
        name: name.trim(),
        provider: "local-fallback",
      };
      setUser(localUser);
      localStorage.setItem(LOCAL_FAKE_AUTH_KEY, JSON.stringify(localUser));
      return localUser;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore signOut error in fallback mode
    }
    localStorage.removeItem(LOCAL_FAKE_AUTH_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user?.uid),
      loginFake,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
