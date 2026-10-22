// Internal calendar edit boundary. Public validation remains in planning.mjs.
import {
  localDateTimeToUTC,
  formatLocalDateTime,
} from "./planning-advanced.mjs";
export function calendarCandidate(base, draft, timeZone, disambiguation) {
  const candidate = {
    ...(base ? structuredClone(base) : {}),
    id: draft.id,
    title: draft.title,
    start: editedTime(base?.start, draft.start, timeZone, disambiguation),
    end: editedTime(base?.end, draft.end, timeZone, disambiguation),
  };
  // Clearing the resource is intentional; unrelated stored fields survive editing.
  const resource = draft.resource.trim();
  if (resource) candidate.resource = resource;
  else delete candidate.resource;
  return candidate;
}
export function calendarEditIsStale(items, editingId, base) {
  if (!editingId) return false;
  const current = items.find((item) => item.id === editingId);
  if (!current || !base) return true;
  return ["id", "title", "start", "end", "resource", "description"].some(
    (key) => current[key] !== base[key],
  );
}

function editedTime(original, input, timeZone, disambiguation) {
  // A title-only edit must retain the exact instant, including a DST fold choice.
  if (
    original &&
    Date.parse(input + "Z") ===
      Date.parse(formatLocalDateTime(original, timeZone) + "Z")
  )
    return original;
  return localDateTimeToUTC(input, timeZone, disambiguation);
}
