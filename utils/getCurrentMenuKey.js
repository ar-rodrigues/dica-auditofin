// Utility to get the current menu key based on pathname and sidebarItems
export function getCurrentMenuKey(pathname, sidebarItems) {
  // 1. Exact match
  for (const item of sidebarItems) {
    if (item.url === pathname) return item.key;
    if (item.children) {
      const childMatch = item.children.find((child) => child.url === pathname);
      if (childMatch) return childMatch.key;
    }
  }

  // 2. Starts-with match (for dynamic/detailed routes)
  for (const item of sidebarItems) {
    if (item.url && pathname.startsWith(item.url)) return item.key;
    if (item.children) {
      const childMatch = item.children.find(
        (child) => child.url && pathname.startsWith(child.url)
      );
      if (childMatch) return childMatch.key;
    }
  }

  // 3. Fallback
  return "1"; // Default to dashboard
}
