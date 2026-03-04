/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateXpStats } from "../components/xp/XpRules";

const GoalsContext = createContext(null);
const STORAGE_KEY = "goal-tracker-goals-v1";

function parseStoredGoals(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

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
  const [goals, setGoals] = useState(() => parseStoredGoals(localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const q = query(collection(db, "goals"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        setGoals(list);
      } catch (error) {
        console.error("Failed to fetch goals from Firestore:", error);
        // Keep local copy if cloud is unavailable.
        setGoals(parseStoredGoals(localStorage.getItem(STORAGE_KEY)));
      }
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
      unit: payload.unit || "Sessions",
      priority: payload.priority || "Medium",
      startDate: payload.startDate || "",
      endDate: payload.endDate || "",
      deadline: payload.deadline || "",
      frequency: payload.frequency || "",
      color: payload.color || "#2563eb",
      notes: payload.notes || "",
      logs: [],
      completedAt: null,
      deletedAt: null,
      previousStatus: null,
      createdAt: now,
      updatedAt: now,
    };

    const tempId = crypto.randomUUID();
    const localGoal = { ...goal, id: tempId };
    setGoals((prev) => [localGoal, ...prev]);

    try {
      const docRef = await addDoc(collection(db, "goals"), goal);
      const cloudGoal = { ...goal, id: docRef.id };
      setGoals((prev) => prev.map((g) => (g.id === tempId ? cloudGoal : g)));
      return cloudGoal;
    } catch (error) {
      console.error("Failed to create goal in Firestore, using local fallback:", error);
      return localGoal;
    }
  };

  const addProgress = async (goalId, amount = 1) => {
    const step = Math.max(1, Number(amount) || 1);
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        // Do not update paused, deleted, or already completed goals.
        if (
          goal.id !== goalId ||
          goal.status === "paused" ||
          goal.status === "completed" ||
          goal.status === "deleted"
        ) {
          return goal;
        }
        const nextProgress = Math.min(goal.target, goal.progress + step);
        const becameCompleted = nextProgress >= goal.target && goal.status !== "completed";
        const status = nextProgress >= goal.target ? "completed" : goal.status;
        return {
          ...goal,
          progress: nextProgress,
          status,
          logs: [...(goal.logs || []), { date: now, amount: step }],
          completedAt: becameCompleted ? now : goal.completedAt,
          updatedAt: now,
        };
      })
    );
  };

  const deleteGoal = (goalId) => {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId || goal.status === "deleted") return goal;
        return {
          ...goal,
          previousStatus: goal.status,
          status: "deleted",
          deletedAt: now,
          updatedAt: now,
        };
      })
    );
  };

  const togglePause = (goalId) => {
    setGoals((prev) =>
      prev.map((goal) => {
        // Completed and deleted goals stay unchanged.
        if (goal.id !== goalId || goal.status === "completed" || goal.status === "deleted") return goal;
        return {
          ...goal,
          status: goal.status === "paused" ? "active" : "paused",
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const restoreGoal = (goalId) => {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId || goal.status !== "deleted") return goal;
        const restoredStatus =
          goal.previousStatus && goal.previousStatus !== "deleted" ? goal.previousStatus : "active";
        return {
          ...goal,
          status: restoredStatus,
          previousStatus: null,
          deletedAt: null,
          updatedAt: now,
        };
      })
    );
  };

  const restoreCompletedGoal = (goalId) => {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId || goal.status !== "completed") return goal;
        return {
          ...goal,
          status: "active",
          completedAt: null,
          updatedAt: now,
        };
      })
    );
  };

  const updateGoal = (goalId, updates) => {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        return {
          ...goal,
          ...updates,
          // Keep target numeric after edits from form fields.
          target: Number(updates.target ?? goal.target) || goal.target,
          completedAt:
            updates.status === "completed"
              ? goal.completedAt || now
              : updates.status && updates.status !== "completed"
              ? null
              : goal.completedAt,
          updatedAt: now,
        };
      })
    );
  };

  const stats = useMemo(() => {
    const visibleGoals = goals.filter((goal) => goal.status !== "deleted");
    const activeGoals = visibleGoals.filter((goal) => goal.status === "active");
    const pausedGoals = visibleGoals.filter((goal) => goal.status === "paused");
    const completedGoals = visibleGoals.filter((goal) => goal.status === "completed");

    // Average progress percentage across visible goals.
    const completionRate =
      visibleGoals.length === 0
        ? 0
        : Math.round(
            (visibleGoals.reduce((acc, goal) => acc + Math.min(goal.progress / goal.target, 1), 0) /
              visibleGoals.length) *
              100
          );

    const streak = calculateStreak(visibleGoals);
    const { xpTotal, level, streakBonus } = calculateXpStats(visibleGoals, streak);

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
      restoreGoal,
      restoreCompletedGoal,
      updateGoal,
      stats,
    }),
    [goals, stats]
  );

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) throw new Error("useGoals must be used within GoalsProvider");
  return context;
}
