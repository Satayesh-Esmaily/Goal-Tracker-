const BASE_XP_PER_LOG = 10;
const COMPLETION_BONUS_XP = 50;
const EARLY_COMPLETION_BONUS_XP = 20;

const PRIORITY_MULTIPLIER = {
  low: 1,
  medium: 1.2,
  high: 1.5,
};

const TYPE_MULTIPLIER = {
  daily: 1,
  count: 1.1,
  time: 1.2,
};

export function getStreakBonus(streak) {
  if (streak >= 14) return 20;
  if (streak >= 7) return 10;
  if (streak >= 3) return 5;
  return 0;
}

export function getGoalLogXp(goal) {
  const priorityKey = (goal.priority || "medium").toLowerCase();
  const typeKey = (goal.type || "daily").toLowerCase();
  const priorityMultiplier = PRIORITY_MULTIPLIER[priorityKey] ?? 1.2;
  const typeMultiplier = TYPE_MULTIPLIER[typeKey] ?? 1;
  const xpPerLog = Math.round(
    BASE_XP_PER_LOG * priorityMultiplier * typeMultiplier
  );

  return (goal.logs || []).reduce((acc) => acc + xpPerLog, 0);
}

export function getGoalCompletionXp(goal) {
  if (goal.status !== "completed") return 0;

  let xp = COMPLETION_BONUS_XP;
  if (goal.deadline && goal.completedAt) {
    const deadline = new Date(goal.deadline);
    const completedAt = new Date(goal.completedAt);
    if (
      !Number.isNaN(deadline.getTime()) &&
      !Number.isNaN(completedAt.getTime()) &&
      completedAt <= deadline
    ) {
      xp += EARLY_COMPLETION_BONUS_XP;
    }
  }

  return xp;
}

export function calculateXpStats(goals, streak) {
  const logsXp = goals.reduce((acc, goal) => acc + getGoalLogXp(goal), 0);
  const completionXp = goals.reduce(
    (acc, goal) => acc + getGoalCompletionXp(goal),
    0
  );
  const streakBonus = getStreakBonus(streak);
  const xpTotal = logsXp + completionXp + streakBonus;
  const level = Math.floor(Math.sqrt(xpTotal / 100)) + 1;

  return {
    xpTotal,
    level,
    streakBonus,
    logsXp,
    completionXp,
  };
}
