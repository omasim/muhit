import { mountPlanningExample, type SavedPlanning } from "./PlanningAdapter";
import { useEffect, useRef, useState } from "react";
import { mountResources, type Controller } from "muhit-ui/resources";
import "muhit-ui/styles/planning.css";
import "muhit-ui/styles/content.css";
import "muhit-ui/styles/suite.css";
const data = [
  {
    id: "research",
    title: "Workspace resource",
    owner: "Ece",
    type: "Research",
    updatedAt: "2026-10-22T10:00:00.000Z",
  },
];
function Resources() {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<Controller | null>(null);
  useEffect(() => {
    if (!host.current) return;
    api.current = mountResources(host.current, data, { locale: "en" });
    return () => {
      api.current?.destroy();
      api.current = null;
    };
  }, []);
  return (
    <section data-testid="workspace-extension">
      <button
        onClick={() =>
          api.current?.update([
            ...data,
            { ...data[0], id: "second", title: "Second resource" },
          ])
        }
      >
        Update workspace resources
      </button>
      <div ref={host} />
    </section>
  );
}
function Planning({ saved }: { saved: SavedPlanning }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => mountPlanningExample(host.current!, saved), [saved]);
  return <section data-testid="planning-extension" ref={host} />;
}
export function WorkspaceExtension() {
  const [open, setOpen] = useState(false);
  const saved = useRef<SavedPlanning>({});
  return (
    <>
      <button onClick={() => setOpen((v) => !v)}>
        {open ? "Close workspace extension" : "Open workspace extension"}
      </button>
      {open && (
        <>
          <Resources />
          <Planning saved={saved.current} />
        </>
      )}
    </>
  );
}
