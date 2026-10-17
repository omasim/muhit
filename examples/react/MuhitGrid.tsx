import { useEffect, useRef } from "react";
import {
  MuhitDataGrid,
  type DataGridInstance,
  type DataColumn,
  type DataRow,
} from "muhit-ui";
import "muhit-ui/styles";
/** Keep columns stable (useMemo/module constant). React owns the host, Muhit owns its children. */
export function MuhitGrid({
  columns,
  rows,
}: {
  columns: DataColumn[];
  rows: DataRow[];
}) {
  const host = useRef<HTMLDivElement>(null),
    grid = useRef<DataGridInstance | null>(null);
  useEffect(() => {
    if (!host.current) return;
    grid.current = MuhitDataGrid.mount(host.current, { columns, rows: [] });
    return () => {
      grid.current?.destroy();
      grid.current = null;
    };
  }, [columns]);
  useEffect(() => {
    grid.current?.setRows(rows);
  }, [rows, columns]);
  return <div ref={host} />;
}
