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
            email: localUser?.email || "",
            focusArea: localUser?.focusArea || "study",
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
        setUser(readLocalFakeUser());
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const loginFake = async (name = "", options = {}) => {
    const email = String(options.email || "").trim();
    const focusArea = options.focusArea || "study";
    try {
      const cred = await signInAnonymously(auth);
      const authUser = {
        uid: cred.user.uid,
        name: name.trim(),
        email,
        focusArea,
        provider: "firebase",
      };
      setUser(authUser);
      localStorage.setItem(LOCAL_FAKE_AUTH_KEY, JSON.stringify(authUser));
      return authUser;
    } catch {
      const localUser = {
        uid: crypto.randomUUID(),
        name: name.trim(),
        email,
        focusArea,
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
    } catch {}
    localStorage.removeItem(LOCAL_FAKE_AUTH_KEY);
    setUser(null);
  };

  const updateProfile = (updates = {}) => {
    setUser((prev) => {
      if (!prev?.uid) return prev;
      const next = {
        ...prev,
        ...updates,
        name:
          typeof updates.name === "string" ? updates.name.trim() : prev.name,
        email:
          typeof updates.email === "string" ? updates.email.trim() : prev.email,
      };
      localStorage.setItem(LOCAL_FAKE_AUTH_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user?.uid),
      loginFake,
      logout,
      updateProfile,
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
