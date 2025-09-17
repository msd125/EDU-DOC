declare module './DraggableColumns.jsx' {
  import React from 'react';

  export type ColumnLike = {
    id: string | number;
    name: string;
    type?: string;
    options?: string[];
    [key: string]: any;
  };

  export interface DraggableColumnsJsxProps {
    columns: ColumnLike[];
    themeColor?: string;
    onEditColumn: (id: string | number) => void;
    onDeleteColumn: (id: string | number, name: string) => void;
    onFillColumn?: (id: string | number, value: any) => void;
    onColumnsReorder: (newColumns: ColumnLike[]) => void;
  }

  const DraggableColumns: React.FC<DraggableColumnsJsxProps>;
  export default DraggableColumns;

  // Named helpers exported by the JS implementation
  export function saveColumnOrder(order: (string | number)[]): void;
  export function getColumnOrder(): (string | number)[] | null;
  export function getOrderedColumns(
    columns: ColumnLike[],
    savedOrder: (string | number)[] | null
  ): ColumnLike[];
}
