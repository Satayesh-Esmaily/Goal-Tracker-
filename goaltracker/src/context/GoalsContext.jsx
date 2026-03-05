import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { calculateXpStats } from "../components/xp/XpRules";
import { useAuth } from "./AuthContext";

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
  const { user, loading: authLoading } = useAuth();
  const storageKey = user?.uid ? `${STORAGE_KEY}:${user.uid}` : STORAGE_KEY;
  const [goals, setGoals] = useState(() =>
    parseStoredGoals(localStorage.getItem(storageKey))
  );

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(goals));
  }, [goals, storageKey]);

  useEffect(() => {
    const fetchGoals = async () => {
      if (authLoading) return;

      if (!user?.uid) {
        setGoals(parseStoredGoals(localStorage.getItem(storageKey)));
        return;
      }

      try {
        const q = query(
          collection(db, "goals"),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));
        const sortedCloudGoals = list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const localGoals = parseStoredGoals(localStorage.getItem(storageKey));

        // Protect against accidental wipe if cloud returns empty while local still has data.
        if (sortedCloudGoals.length === 0 && localGoals.length > 0) {
          setGoals(localGoals);
          return;
        }

        setGoals(sortedCloudGoals);
      } catch (error) {
        console.error("Failed to fetch goals from Firestore:", error);

        setGoals(parseStoredGoals(localStorage.getItem(storageKey)));
      }
    };

    fetchGoals();
  }, [user?.uid, storageKey, authLoading]);

  const persistGoalPatch = async (goalId, patch) => {
    if (!user?.uid || !goalId) return;
    try {
      await updateDoc(doc(db, "goals", goalId), patch);
    } catch (error) {
      console.error("Failed to sync goal update to Firestore:", error);
    }
  };

  const createGoal = async (payload) => {
    const now = new Date().toISOString();
    const goal = {
      userId: user?.uid || null,
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
      startTime: payload.startTime || "",
      endTime: payload.endTime || "",
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

    if (!user?.uid) return localGoal;

    try {
      const docRef = await addDoc(collection(db, "goals"), goal);
      const cloudGoal = { ...goal, id: docRef.id };
      setGoals((prev) => prev.map((g) => (g.id === tempId ? cloudGoal : g)));
      return cloudGoal;
    } catch (error) {
      console.error(
        "Failed to create goal in Firestore, using local fallback:",
        error
      );
      return localGoal;
    }
  };

  const addProgress = async (goalId, amount = 1) => {
    const step = Math.max(1, Number(amount) || 1);
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (
          goal.id !== goalId ||
          goal.status === "paused" ||
          goal.status === "completed" ||
          goal.status === "deleted"
        ) {
          return goal;
        }
        const nextProgress = Math.min(goal.target, goal.progress + step);
        const becameCompleted =
          nextProgress >= goal.target && goal.status !== "completed";
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
    const targetGoal = goals.find((goal) => goal.id === goalId);
    if (!targetGoal) return;
    const nextProgress = Math.min(
      targetGoal.target,
      targetGoal.progress + step
    );
    const becameCompleted =
      nextProgress >= targetGoal.target && targetGoal.status !== "completed";
    const status =
      nextProgress >= targetGoal.target ? "completed" : targetGoal.status;
    await persistGoalPatch(goalId, {
      progress: nextProgress,
      status,
      logs: [...(targetGoal.logs || []), { date: now, amount: step }],
      completedAt: becameCompleted ? now : targetGoal.completedAt,
      updatedAt: now,
    });
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
    persistGoalPatch(goalId, {
      status: "deleted",
      deletedAt: now,
      updatedAt: now,
    });
  };

  const togglePause = (goalId) => {
    const now = new Date().toISOString();
    const targetGoal = goals.find((goal) => goal.id === goalId);
    setGoals((prev) =>
      prev.map((goal) => {
        if (
          goal.id !== goalId ||
          goal.status === "completed" ||
          goal.status === "deleted"
        )
          return goal;
        return {
          ...goal,
          status: goal.status === "paused" ? "active" : "paused",
          updatedAt: now,
        };
      })
    );
    if (
      !targetGoal ||
      targetGoal.status === "completed" ||
      targetGoal.status === "deleted"
    ) {
      return;
    }
    persistGoalPatch(goalId, {
      status: targetGoal.status === "paused" ? "active" : "paused",
      updatedAt: now,
    });
  };

  const restoreGoal = (goalId) => {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId || goal.status !== "deleted") return goal;
        const restoredStatus =
          goal.previousStatus && goal.previousStatus !== "deleted"
            ? goal.previousStatus
            : "active";
        return {
          ...goal,
          status: restoredStatus,
          previousStatus: null,
          deletedAt: null,
          updatedAt: now,
        };
      })
    );
    const targetGoal = goals.find((goal) => goal.id === goalId);
    const restoredStatus =
      targetGoal?.previousStatus && targetGoal.previousStatus !== "deleted"
        ? targetGoal.previousStatus
        : "active";
    persistGoalPatch(goalId, {
      status: restoredStatus,
      previousStatus: null,
      deletedAt: null,
      updatedAt: now,
    });
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
    persistGoalPatch(goalId, {
      status: "active",
      completedAt: null,
      updatedAt: now,
    });
  };

  const updateGoal = (goalId, updates) => {
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) return goal;
        return {
          ...goal,
          ...updates,

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
    const targetGoal = goals.find((goal) => goal.id === goalId);
    if (!targetGoal) return;
    const nextStatus = updates.status ?? targetGoal.status;
    persistGoalPatch(goalId, {
      ...updates,
      target: Number(updates.target ?? targetGoal.target) || targetGoal.target,
      completedAt:
        nextStatus === "completed"
          ? targetGoal.completedAt || now
          : nextStatus !== "completed"
          ? null
          : targetGoal.completedAt,
      updatedAt: now,
    });
  };

  const stats = useMemo(() => {
    const visibleGoals = goals.filter((goal) => goal.status !== "deleted");
    const activeGoals = visibleGoals.filter((goal) => goal.status === "active");
    const pausedGoals = visibleGoals.filter((goal) => goal.status === "paused");
    const completedGoals = visibleGoals.filter(
      (goal) => goal.status === "completed"
    );

    const completionRate =
      visibleGoals.length === 0
        ? 0
        : Math.round(
            (visibleGoals.reduce(
              (acc, goal) => acc + Math.min(goal.progress / goal.target, 1),
              0
            ) /
              visibleGoals.length) *
              100
          );

    const streak = calculateStreak(visibleGoals);
    const { xpTotal, level, streakBonus } = calculateXpStats(
      visibleGoals,
      streak
    );

    const categoryProgress = visibleGoals.reduce((acc, goal) => {
      const pct = Math.round((goal.progress / goal.target) * 100);
      if (acc[goal.category]) {
        acc[goal.category] = Math.round((acc[goal.category] + pct) / 2);
      } else {
        acc[goal.category] = pct;
      }
      return acc;
    }, {});

    return {
      activeCount: activeGoals.length,
      pausedCount: pausedGoals.length,
      completedCount: completedGoals.length,
      completionRate,
      xpTotal,
      streak,
      level,
      streakBonus,
      categoryProgress,
    };
  }, [goals]);

  const value = {
    goals,
    createGoal,
    addProgress,
    deleteGoal,
    togglePause,
    restoreGoal,
    restoreCompletedGoal,
    updateGoal,
    stats,
  };

  return (
    <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) throw new Error("useGoals must be used within GoalsProvider");
  return context;
}
