export function sortAndFilterGoals(goals, { tab = "all", search = "", sortBy = "newest" }) {
  const normalizedSearch = search.trim().toLowerCase();
  const searched = goals.filter((goal) => goal.title.toLowerCase().includes(normalizedSearch));
  const tabFiltered = tab === "all" ? searched : searched.filter((goal) => goal.status === tab);

  return [...tabFiltered].sort((a, b) => {
    if (sortBy === "progress") {
      const aPercent = Math.round((a.progress / a.target) * 100);
      const bPercent = Math.round((b.progress / b.target) * 100);
      return bPercent - aPercent;
    }

    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
