import {
  mountCalendar,
  mountDocumentEditor,
  createRecurringEvents,
  capacityAvailable,
  localDateTimeToUTC,
  type CalendarDraft,
  type Event as CalendarEvent,
  type DocumentSnapshot,
} from "muhit-ui/planning";
import { createRemoteSearch } from "muhit-ui/search";
export interface SavedPlanning {
  calendar?: CalendarDraft;
  items?: CalendarEvent[];
  editor?: DocumentSnapshot;
}
export function mountPlanningExample(root: HTMLElement, saved: SavedPlanning) {
  const calendarHost = document.createElement("div"),
    editorHost = document.createElement("div"),
    controls = document.createElement("div");
  root.append(calendarHost, controls, editorHost);
  const calendar = mountCalendar(calendarHost, saved.items || [], {
    locale: "en",
    date: "2026-10-22",
    draft: saved.calendar,
    resourceCapacities: { Studio: 2 },
  });
  const editor = mountDocumentEditor(
    editorHost,
    { title: "Project notes", blocks: [] },
    { locale: "en", snapshot: saved.editor },
  );
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.dataset.testid = "adapter-status";
  const results = document.createElement("ul");
  results.dataset.testid = "adapter-results";
  const remote = createRemoteSearch<{ id: string; title: string }>(
    async (request, signal) => {
      const response = await fetch(
        "/api/resources?" +
          new URLSearchParams(
            Object.entries(request).map(([k, v]) => [k, String(v)]),
          ),
        { signal },
      );
      if (!response.ok) throw Error("Unavailable");
      return response.json();
    },
  );
  let dead = false,
    page = 1;
  const cleanups: Array<() => void> = [];
  function action(label: string, run: () => void) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.className = "mh-suite-button";
    button.addEventListener("click", run);
    controls.append(button);
    cleanups.push(() => button.removeEventListener("click", run));
  }
  action("Apply weekly example", () => {
    try {
      const d = calendar.getDraft(),
        existing = calendar.getSnapshot().items;
      const series = createRecurringEvents(
        {
          id: "series-" + Date.now(),
          title: d.title,
          start: localDateTimeToUTC(d.start, "UTC"),
          end: localDateTimeToUTC(d.end, "UTC"),
          ...(d.resource ? { resource: d.resource } : {}),
        },
        {
          frequency: "weekly",
          count: 3,
          timeZone: "UTC",
          exceptions: ["2026-10-29"],
        },
      );
      for (const event of series) {
        if (
          !capacityAvailable(
            existing,
            event,
            event.resource === "Studio" ? 2 : 1,
          )
        )
          throw Error("Capacity exceeded");
        existing.push(event);
      }
      calendar.update(existing);
      status.textContent = "Applied 2 local occurrences; October 29 excluded.";
    } catch {
      status.textContent = "Cannot apply series; draft preserved.";
    }
  });
  async function search(next: number) {
    status.textContent = "Searching…";
    try {
      const result = await remote.search("Research", {
        page: next,
        pageSize: 2,
      });
      if (dead || !result) return;
      page = result.page;
      results.replaceChildren(
        ...result.items.map((item) => {
          const li = document.createElement("li");
          li.textContent = item.title;
          return li;
        }),
      );
      status.textContent = `Page ${page}; ${result.total} matches`;
    } catch {
      if (!dead) status.textContent = "Search failed; results preserved.";
    }
  }
  action("Search remote resources", () => {
    void search(1);
  });
  action("Next resource page", () => {
    void search(page + 1);
  });
  action("Cancel remote search", () => {
    remote.cancel();
    status.textContent = "Cancelled; results preserved.";
  });
  controls.append(status, results);
  return () => {
    dead = true;
    saved.calendar = calendar.getDraft();
    saved.items = calendar.getSnapshot().items;
    saved.editor = editor.getSnapshot();
    remote.destroy();
    calendar.destroy();
    editor.destroy();
    cleanups.forEach((fn) => fn());
    root.replaceChildren();
  };
}
