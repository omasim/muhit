import { useEffect, useRef } from "react";
import {
  MuhitDataGrid,
  type DataGridInstance,
  type DataGridOptions,
  type GridView,
} from "muhit-ui";
import "muhit-ui/styles";
export type MuhitGridProps = DataGridOptions & {
  selected?: string[];
  onReady?: (grid: DataGridInstance) => void;
};
/** Stable columns/load references avoid unnecessary remounts; callbacks remain current. */
export function MuhitGrid(props: MuhitGridProps) {
  const host = useRef<HTMLDivElement>(null),
    grid = useRef<DataGridInstance | null>(null),
    latest = useRef(props),
    snapshot = useRef<GridView | null>(null);
  useEffect(() => {
    latest.current = props;
  });
  useEffect(() => {
    if (!host.current) return;
    const p = latest.current;
    const instance = MuhitDataGrid.mount(host.current, {
      ...p,
      onStateChange: (s) => latest.current.onStateChange?.(s),
      onRowsChange: (r, c) => latest.current.onRowsChange?.(r, c),
      onSelectionChange: (ids) => latest.current.onSelectionChange?.(ids),
      onColumnLayoutChange: (v) => latest.current.onColumnLayoutChange?.(v),
    });
    grid.current = instance;
    if (snapshot.current) instance.restoreView(snapshot.current);
    p.onReady?.(instance);
    return () => {
      snapshot.current = instance.getView();
      instance.destroy();
      grid.current = null;
    };
  }, [
    props.columns,
    props.load,
    props.exportRows,
    props.locale,
    props.dir,
    props.messages,
    props.selectable,
    props.title,
    props.description,
  ]);
  useEffect(() => {
    if (!props.load && props.rows) grid.current?.setRows(props.rows);
  }, [props.rows, props.columns, props.load, props.locale, props.dir]);
  useEffect(() => {
    if (props.state) grid.current?.setState(props.state);
  }, [props.state, props.locale, props.dir]);
  useEffect(() => {
    if (props.columnLayout) grid.current?.setColumnLayout(props.columnLayout);
  }, [props.columnLayout, props.locale, props.dir]);
  useEffect(() => {
    if (props.selected) grid.current?.setSelected(props.selected);
  }, [props.selected, props.locale, props.dir]);
  return <div ref={host} />;
}
