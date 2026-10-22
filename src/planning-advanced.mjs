import { fields, clone, date, text, id } from "./suite-core.mjs";
const formatters = new Map();
const localPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;
function wall(value) {
  if (typeof value !== "string" || !localPattern.test(value))
    throw TypeError("Invalid local time");
  const seconds = value.length === 16 ? value + ":00" : value;
  const [whole, fraction = ""] = seconds.split(".");
  const full = whole + "." + fraction.padEnd(3, "0");
  const n = Date.parse(full + "Z");
  if (!Number.isFinite(n) || new Date(n).toISOString().slice(0, 23) !== full)
    throw TypeError("Invalid local time");
  return { full, n };
}
export function formatLocalDateTime(value, timeZone = "UTC") {
  date(value);
  let formatter = formatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    });
    if (formatters.size >= 32)
      formatters.delete(formatters.keys().next().value);
    formatters.set(timeZone, formatter);
  }
  const parts = formatter.formatToParts(new Date(value));
  const get = (k) => parts.find((x) => x.type === k).value;
  const fraction = new Date(value).toISOString().slice(19, 23);
  return (
    `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:${get("second")}` +
    (fraction === ".000" ? "" : fraction)
  );
}
export function localDateTimeToUTC(
  value,
  timeZone = "UTC",
  disambiguation = "reject",
) {
  const { full, n } = wall(value);
  if (!["reject", "earlier", "later"].includes(disambiguation))
    throw TypeError("Invalid disambiguation");
  const offsets = new Set();
  // Sample both sides of transitions; no dependence on the host machine timezone.
  for (let h = -48; h <= 48; h += 6) {
    const t = n + h * 3600000;
    offsets.add(
      Date.parse(
        formatLocalDateTime(new Date(t).toISOString(), timeZone) + "Z",
      ) - t,
    );
  }
  const matches = [...offsets]
    .map((offset) => n - offset)
    .filter(
      (t) =>
        wall(formatLocalDateTime(new Date(t).toISOString(), timeZone)).full ===
        full,
    )
    .sort((a, b) => a - b);
  if (!matches.length) throw RangeError("Nonexistent local time");
  if (matches.length > 1 && disambiguation === "reject")
    throw RangeError("Ambiguous local time");
  return new Date(
    disambiguation === "later" ? matches.at(-1) : matches[0],
  ).toISOString();
}
export function createRecurringEvents(event, rule) {
  fields(
    event,
    ["id", "title", "start", "end", "resource", "description"],
    ["id", "title", "start", "end"],
  );
  id(event.id);
  text(event.title, "title", 160);
  date(event.start);
  date(event.end);
  if (event.resource !== undefined) text(event.resource, "resource", 120);
  if (event.description !== undefined)
    text(event.description, "description", 2000);
  if (event.end <= event.start) throw TypeError("Invalid interval");
  fields(
    rule,
    [
      "frequency",
      "interval",
      "count",
      "timeZone",
      "exceptions",
      "disambiguation",
    ],
    ["frequency", "count", "timeZone"],
  );
  const interval = rule.interval ?? 1;
  if (
    !["daily", "weekly"].includes(rule.frequency) ||
    !Number.isInteger(interval) ||
    interval < 1 ||
    interval > 52 ||
    !Number.isInteger(rule.count) ||
    rule.count < 1 ||
    rule.count > 100
  )
    throw TypeError("Invalid recurrence");
  const exceptions = rule.exceptions ?? [];
  if (
    !Array.isArray(exceptions) ||
    exceptions.length > 100 ||
    new Set(exceptions).size !== exceptions.length
  )
    throw TypeError("Invalid exceptions");
  for (const d of exceptions) wall(d + "T00:00");
  const first = wall(formatLocalDateTime(event.start, rule.timeZone)),
    last = wall(formatLocalDateTime(event.end, rule.timeZone)),
    step = 86400000 * interval * (rule.frequency === "weekly" ? 7 : 1),
    result = [];
  for (let i = 0; i < rule.count; i++) {
    const startLocal = new Date(first.n + i * step).toISOString().slice(0, 23),
      endLocal = new Date(last.n + i * step).toISOString().slice(0, 23);
    if (exceptions.includes(startLocal.slice(0, 10))) continue;
    const next = {
      ...clone(event),
      id: event.id + "-r" + i,
      start: localDateTimeToUTC(startLocal, rule.timeZone, rule.disambiguation),
      end: localDateTimeToUTC(endLocal, rule.timeZone, rule.disambiguation),
    };
    id(next.id);
    if (next.end <= next.start) throw TypeError("Invalid occurrence interval");
    result.push(next);
  }
  return result;
}
export function capacityAvailable(events, candidate, capacity = 1) {
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000)
    throw TypeError("Invalid resource capacity");
  const points = [];
  for (const e of [...events.filter((x) => x.id !== candidate.id), candidate]) {
    date(e.start);
    date(e.end);
    if (e.end <= e.start) throw TypeError("Invalid interval");
    if ((e.resource || "") !== (candidate.resource || "")) continue;
    const start = Math.max(Date.parse(e.start), Date.parse(candidate.start)),
      end = Math.min(Date.parse(e.end), Date.parse(candidate.end));
    if (start < end) points.push([start, 1], [end, -1]);
  }
  points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let used = 0;
  return points.every(([, delta]) => (used += delta) <= capacity);
}
export function safeDocumentURL(value) {
  if (typeof value !== "string" || value.length > 2048)
    throw TypeError("Invalid URL");
  const u = new URL(value);
  if (u.protocol !== "https:" || u.username || u.password)
    throw TypeError("HTTPS URL without credentials required");
  return u.href;
}
export function validateMarks(marks, textValue) {
  if (!Array.isArray(marks) || marks.length > 200)
    throw TypeError("Invalid marks");
  let end = 0;
  for (const m of marks) {
    fields(m, ["from", "to", "bold", "italic", "href"], ["from", "to"]);
    if (
      !Number.isInteger(m.from) ||
      !Number.isInteger(m.to) ||
      m.from < end ||
      m.to <= m.from ||
      m.to > textValue.length
    )
      throw TypeError("Invalid range");
    for (const k of ["bold", "italic"])
      if (m[k] !== undefined && typeof m[k] !== "boolean")
        throw TypeError("Invalid mark");
    if (m.href !== undefined) safeDocumentURL(m.href);
    end = m.to;
  }
  return clone(marks);
}
export function formatTextRange(block, from, to, style) {
  fields(style, ["bold", "italic", "href"], []);
  for (const k of ["bold", "italic"])
    if (style[k] !== undefined && typeof style[k] !== "boolean")
      throw TypeError("Invalid style");
  if (style.href !== undefined) safeDocumentURL(style.href);
  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 0 ||
    to <= from ||
    to > block.text.length
  )
    throw TypeError("Select text first");
  const old = validateMarks(block.marks || [], block.text);
  const bounds = [
    ...new Set([
      0,
      block.text.length,
      from,
      to,
      ...old.flatMap((m) => [m.from, m.to]),
    ]),
  ].sort((a, b) => a - b);
  const marks = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i],
      b = bounds[i + 1],
      prior = old.find((m) => m.from <= a && m.to >= b),
      next = {
        ...(prior || {}),
        ...(a >= from && b <= to ? style : {}),
        from: a,
        to: b,
      };
    if (next.bold || next.italic || next.href) {
      const last = marks.at(-1);
      if (
        last &&
        last.to === a &&
        last.bold === next.bold &&
        last.italic === next.italic &&
        last.href === next.href
      )
        last.to = b;
      else marks.push(next);
    }
  }
  return { ...clone(block), marks: validateMarks(marks, block.text) };
}
export function diffWords(before, after) {
  if (
    typeof before !== "string" ||
    typeof after !== "string" ||
    before.length > 10000 ||
    after.length > 10000
  )
    throw TypeError("Invalid diff text");
  const a = before.match(/\s+|[^\s]+/gu) || [],
    b = after.match(/\s+|[^\s]+/gu) || [];
  // Bounded LCS; avoid quadratic work on very long text.
  if (a.length * b.length > 250000)
    return [
      { kind: "removed", text: before },
      { kind: "added", text: after },
    ].filter((x) => x.text);
  const rows = Array.from(
    { length: a.length + 1 },
    () => new Uint16Array(b.length + 1),
  );
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      rows[i][j] =
        a[i] === b[j]
          ? rows[i + 1][j + 1] + 1
          : Math.max(rows[i + 1][j], rows[i][j + 1]);
  const out = [];
  const push = (kind, text) => {
    if (out.at(-1)?.kind === kind) out.at(-1).text += text;
    else out.push({ kind, text });
  };
  let i = 0,
    j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      push("equal", a[i++]);
      j++;
    } else if (
      i < a.length &&
      (j === b.length || rows[i + 1][j] >= rows[i][j + 1])
    )
      push("removed", a[i++]);
    else push("added", b[j++]);
  }
  return out;
}
export function replaceBlockText(block, value) {
  if (typeof value !== "string" || value.length > 10000)
    throw TypeError("Invalid text");
  const old = block.text;
  let start = 0,
    end = 0;
  while (
    start < old.length &&
    start < value.length &&
    old[start] === value[start]
  )
    start++;
  while (
    end < old.length - start &&
    end < value.length - start &&
    old[old.length - 1 - end] === value[value.length - 1 - end]
  )
    end++;
  const oldEnd = old.length - end,
    newEnd = value.length - end,
    delta = value.length - old.length;
  const marks = (block.marks || [])
    .map((m) =>
      m.to <= start
        ? m
        : m.from >= oldEnd
          ? { ...m, from: m.from + delta, to: m.to + delta }
          : {
              ...m,
              from: Math.min(m.from, start),
              to: m.to > oldEnd ? m.to + delta : newEnd,
            },
    )
    .filter((m) => m.to > m.from);
  return {
    ...clone(block),
    text: value,
    ...(block.marks ? { marks: validateMarks(marks, value) } : {}),
  };
}
