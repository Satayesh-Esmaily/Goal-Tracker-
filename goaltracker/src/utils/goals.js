// Helpers for searching, filtering, and sorting goals in the list page.
export function sortAndFilterGoals(goals, { tab = "all", search = "", sortBy = "newest" }) {
  // Normalize user query to keep search case-insensitive.
  const normalizedSearch = search.trim().toLowerCase();
  const searched = goals.filter((goal) => goal.title.toLowerCase().includes(normalizedSearch));
  // "all" shows everything, otherwise filter by status tab.
  const tabFiltered = tab === "all" ? searched : searched.filter((goal) => goal.status === tab);

  return [...tabFiltered].sort((a, b) => {
    if (sortBy === "progress") {
      // Compare by completion percentage, highest first.
      const aPercent = Math.round((a.progress / a.target) * 100);
      const bPercent = Math.round((b.progress / b.target) * 100);
      return bPercent - aPercent;
    }

    if (sortBy === "category") {
      // Alphabetical category sorting.
      return a.category.localeCompare(b.category);
    }

    // Default: newest created goal first.
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

