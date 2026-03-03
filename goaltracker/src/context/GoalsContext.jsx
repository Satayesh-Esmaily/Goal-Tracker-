import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateXpStats } from "../components/xp/XpRules";

const GoalsContext = createContext(null);
const STORAGE_KEY = "goal-tracker-goals-v1";

// Convert any date input to YYYY-MM-DD so different logs of the same day can be grouped.
function toDayKey(input = new Date()) {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toISOString().slice(0, 10);
}

// Streak = number of consecutive days with at least one progress log.
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
    if (diff === 1) {
      streak += 1;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
}

// Local storage can be empty or broken; this keeps app startup safe.
function parseStoredGoals(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function GoalsProvider({ children }) {
  const [goals, setGoals] = useState(() => parseStoredGoals(localStorage.getItem(STORAGE_KEY)));

  // Persist every change so data survives page refresh.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const createGoal = (payload) => {
    const now = new Date().toISOString();
    const target = Number(payload.target) || 1;
    const goal = {
      id: crypto.randomUUID(),
      title: payload.title?.trim() || "Untitled Goal",
      category: payload.category || "Personal",
      type: payload.type || "daily",
      target,
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
      startTime: payload.startTime || "",
      endTime: payload.endTime || "",
      difficulty: payload.difficulty || "",
      motivation: payload.motivation || "",
      reminderTime: payload.reminderTime || "",
      reminderDays: payload.reminderDays || "",
      estimatedDuration: payload.estimatedDuration || "",
      milestones: payload.milestones || "",
      successCriteria: payload.successCriteria || "",
      reward: payload.reward || "",
      tags: payload.tags || "",
      visibility: payload.visibility || "",
      logs: [],
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    // Add newest goals at the top for better visibility.
    setGoals((prev) => [goal, ...prev]);
    return goal;
  };

  const addProgress = (goalId, amount = 1) => {
    // Normalize user input to a positive numeric step.
    const step = Math.max(1, Number(amount) || 1);
    const now = new Date().toISOString();
    setGoals((prev) =>
      prev.map((goal) => {
        // Do not update paused or already completed goals.
        if (goal.id !== goalId || goal.status === "paused" || goal.status === "completed") {
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
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  const togglePause = (goalId) => {
    setGoals((prev) =>
      prev.map((goal) => {
        // Completed goals stay completed.
        if (goal.id !== goalId || goal.status === "completed") return goal;
        return {
          ...goal,
          status: goal.status === "paused" ? "active" : "paused",
          updatedAt: new Date().toISOString(),
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
    const activeGoals = goals.filter((goal) => goal.status === "active");
    const pausedGoals = goals.filter((goal) => goal.status === "paused");
    const completedGoals = goals.filter((goal) => goal.status === "completed");

    // Average progress percentage across all goals.
    const completionRate =
      goals.length === 0
        ? 0
        : Math.round(
            (goals.reduce((acc, goal) => acc + Math.min(goal.progress / goal.target, 1), 0) /
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

  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error("useGoals must be used within GoalsProvider");
  }
  return context;
}
