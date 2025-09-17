// Global ambient type declarations for JS utility modules
declare module './components/DraggableColumns.jsx' {
  import * as React from 'react';
  type ColumnType = { id: string | number; name: string; type?: string; options?: string[] };
  interface Props {
    columns: ColumnType[];
    themeColor?: string;
    onEditColumn: (id: string | number) => void;
    onDeleteColumn: (id: string | number, name: string) => void;
    onFillColumn?: (id: string | number, value: any) => void;
    onColumnsReorder: (columns: ColumnType[]) => void;
  }
  const DraggableColumns: React.FC<Props>;
  export default DraggableColumns;
}

declare module './utils/drag-drop/columnUtils' {
  export function saveColumnOrder(order: Array<string | number>): void;
  export function getColumnOrder(): Array<string | number>;
  export function orderColumns<T extends { id: string | number }>(columns: T[], orderIds: Array<string | number>): T[];
  export function resetColumnOrder(): void;
  export function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[];
}
