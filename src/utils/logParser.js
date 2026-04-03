/**
 * Parses a free-text daily log into structured work items.
 *
 * Supported patterns:
 *   @ProjectName: description of work done
 *   - bullet point without project
 *   Regular text (treated as a single item)
 *
 * Lines starting with "!" are treated as priority notes.
 */
export function parseLogContent(content, projects) {
  if (!content?.trim()) return { items: [], priorityNotes: '' };

  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const items = [];
  const priorityLines = [];

  // Build a lookup: lowercased project name → project
  const nameMap = {};
  projects.forEach((p) => {
    nameMap[p.name.toLowerCase()] = p;
  });

  for (const line of lines) {
    // Priority notes start with !
    if (line.startsWith('!')) {
      priorityLines.push(line.slice(1).trim());
      continue;
    }

    // Check for @ProjectName: pattern
    const atMatch = line.match(/^[-•]?\s*@([^:]+):\s*(.+)/);
    if (atMatch) {
      const projectQuery = atMatch[1].trim().toLowerCase();
      const text = atMatch[2].trim();
      const matchedProject = findProject(projectQuery, nameMap);

      items.push({
        text,
        projectId: matchedProject?.id || null,
        projectName: matchedProject?.name || atMatch[1].trim(),
        taskId: null,
        hoursSpent: extractHours(text),
        tags: extractTags(text),
      });
      continue;
    }

    // Regular bullet point or line
    const cleaned = line.replace(/^[-•]\s*/, '').trim();
    if (cleaned) {
      items.push({
        text: cleaned,
        projectId: null,
        projectName: null,
        taskId: null,
        hoursSpent: extractHours(cleaned),
        tags: extractTags(cleaned),
      });
    }
  }

  return {
    items,
    priorityNotes: priorityLines.join('\n'),
  };
}

function findProject(query, nameMap) {
  // Exact match first
  if (nameMap[query]) return nameMap[query];

  // Partial match — find first project whose name contains the query
  for (const [name, project] of Object.entries(nameMap)) {
    if (name.includes(query) || query.includes(name)) return project;
  }

  return null;
}

function extractHours(text) {
  // Match patterns like "2h", "1.5h", "3 hours", "45m", "30 min"
  const hourMatch = text.match(/(\d+\.?\d*)\s*h(?:ours?|rs?)?/i);
  if (hourMatch) return parseFloat(hourMatch[1]);

  const minMatch = text.match(/(\d+)\s*m(?:in(?:utes?)?)?/i);
  if (minMatch) return parseFloat(minMatch[1]) / 60;

  return null;
}

function extractTags(text) {
  // Match #tag patterns
  const matches = text.match(/#(\w+)/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}
