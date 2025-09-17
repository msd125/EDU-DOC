export type ColumnLike = { id: string | number; [key: string]: any };

export function saveColumnOrder(columnOrder?: (string | number)[]): void;
export function getColumnOrder(): (string | number)[];
export function resetColumnOrder(): void;
export function orderColumns<T extends ColumnLike>(columns: T[], orderIds: (string | number)[]): T[];
export function reorderArray<T>(list: T[], startIndex: number, endIndex: number): T[];
