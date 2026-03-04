import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateXpStats } from "../components/xp/XpRules";

const GoalsContext = createContext(null);

function toDayKey(input = new Date()) {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toISOString().slice(0, 10);
}

function calculateStreak(goals) {
  const uniqueDays = new Set();
  goals.forEach((goal) => {
    (goal.logs || []).forEach((log) => uniqueDays.add(toDayKey(log.date)));
  });

  if (uniqueDays.size === 0) return 0;

  const dayMs = 24 * 60 * 60 * 1000;
  const loggedDays = [...uniqueDays]
    .map((day) => new Date(day))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date(toDayKey());
  const latest = loggedDays[0];
  const gap = Math.floor((today.getTime() - latest.getTime()) / dayMs);

  if (gap > 1) return 0;

  let streak = 1;
  for (let i = 1; i < loggedDays.length; i += 1) {
    const prev = loggedDays[i - 1];
    const curr = loggedDays[i];
    const diff = Math.floor((prev.getTime() - curr.getTime()) / dayMs);
    if (diff === 1) streak += 1;
    else if (diff > 1) break;
  }

  return streak;
}

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      const q = query(collection(db, "goals"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGoals(list);
    };
    fetchGoals();
  }, []);

  const createGoal = async (payload) => {
    const now = new Date().toISOString();
    const goal = {
      title: payload.title?.trim() || "Untitled Goal",
      category: payload.category || "Personal",
      type: payload.type || "daily",
      target: Number(payload.target) || 1,
      progress: 0,
      status: "active",
      logs: [],
      createdAt: now,
      updatedAt: now,
      color: payload.color || "#2563eb",
      notes: payload.notes || "",
    };
    const docRef = await addDoc(collection(db, "goals"), goal);
    setGoals((prev) => [{ ...goal, id: docRef.id }, ...prev]);
    return { ...goal, id: docRef.id };
  };

  const addProgress = async (goalId, amount = 1) => {
    const step = Math.max(1, Number(amount) || 1);
    const now = new Date().toISOString();
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || goal.status === "paused" || goal.status === "completed")
      return;

    const nextProgress = Math.min(goal.target, goal.progress + step);
    const status = nextProgress >= goal.target ? "completed" : goal.status;
    const updatedGoal = {
      ...goal,
      progress: nextProgress,
      status,
      logs: [...(goal.logs || []), { date: now, amount: step }],
      completedAt: nextProgress >= goal.target ? now : goal.completedAt,
      updatedAt: now,
    };
    const goalRef = doc(db, "goals", goalId);
    await updateDoc(goalRef, updatedGoal);
    setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));
  };

  const deleteGoal = async (goalId) => {
    await deleteDoc(doc(db, "goals", goalId));
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const togglePause = async (goalId) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal || goal.status === "completed") return;
    const newStatus = goal.status === "paused" ? "active" : "paused";
    const updatedGoal = {
      ...goal,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(doc(db, "goals", goalId), updatedGoal);
    setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));
  };

  const updateGoal = async (goalId, updates) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;
    const now = new Date().toISOString();
    const updatedGoal = {
      ...goal,
      ...updates,
      target: Number(updates.target ?? goal.target) || goal.target,
      completedAt:
        updates.status === "completed"
          ? now
          : updates.status !== "completed"
          ? null
          : goal.completedAt,
      updatedAt: now,
    };
    await updateDoc(doc(db, "goals", goalId), updatedGoal);
    setGoals((prev) => prev.map((g) => (g.id === goalId ? updatedGoal : g)));
  };

  const stats = useMemo(() => {
    const activeGoals = goals.filter((g) => g.status === "active");
    const pausedGoals = goals.filter((g) => g.status === "paused");
    const completedGoals = goals.filter((g) => g.status === "completed");
    const completionRate =
      goals.length === 0
        ? 0
        : Math.round(
            (goals.reduce(
              (acc, goal) => acc + Math.min(goal.progress / goal.target, 1),
              0
            ) /
              goals.length) *
              100
          );
    const streak = calculateStreak(goals);
    const { xpTotal, level, streakBonus } = calculateXpStats(goals, streak);
    return {
      activeCount: activeGoals.length,
      pausedCount: pausedGoals.length,
      completedCount: completedGoals.length,
      completionRate,
      xpTotal,
      streak,
      level,
      streakBonus,
    };
  }, [goals]);

  const value = useMemo(
    () => ({
      goals,
      createGoal,
      addProgress,
      deleteGoal,
      togglePause,
      updateGoal,
      stats,
    }),
    [goals, stats]
  );

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) throw new Error("useGoals must be used within GoalsProvider");
  return context;
}
