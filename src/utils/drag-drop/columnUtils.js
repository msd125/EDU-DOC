/**
 * Utility functions for column drag and drop
 */

// LocalStorage key for saving column order
const COLUMN_ORDER_KEY = 'columnOrderv1';

/**
 * Save column order to localStorage
 * @param {Array} columnOrder - Array of column IDs in the desired order
 */
export function saveColumnOrder(columnOrder = []) {
  if (!columnOrder || !Array.isArray(columnOrder)) return;
  try {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnOrder));
  } catch (e) {
    console.error('Error saving column order to localStorage:', e);
  }
}

/**
 * Get column order from localStorage
 * @returns {Array} - Array of column IDs in saved order, or empty array if not found
 */
export function getColumnOrder() {
  try {
    const savedOrder = localStorage.getItem(COLUMN_ORDER_KEY);
    return savedOrder ? JSON.parse(savedOrder) : [];
  } catch (e) {
    console.error('Error retrieving column order from localStorage:', e);
    return [];
  }
}

/**
 * Reset column order in localStorage
 */
export function resetColumnOrder() {
  try {
    localStorage.removeItem(COLUMN_ORDER_KEY);
  } catch (e) {
    console.error('Error resetting column order in localStorage:', e);
  }
}

/**
 * Order columns based on saved order
 * @param {Array} columns - Original columns array
 * @param {Array} orderIds - Array of column IDs in the desired order
 * @returns {Array} - Reordered columns
 */
export function orderColumns(columns, orderIds) {
  if (!columns || !columns.length) return [];
  if (!orderIds || !orderIds.length) return [...columns];

  // Create a map for quick lookup
  const columnMap = new Map(columns.map(col => [col.id, col]));
  
  // First, add columns in the specified order if they exist
  const orderedColumns = [];
  orderIds.forEach(id => {
    if (columnMap.has(id)) {
      orderedColumns.push(columnMap.get(id));
      columnMap.delete(id);
    }
  });
  
  // Then add any remaining columns that weren't in the order
  columnMap.forEach(column => orderedColumns.push(column));
  
  return orderedColumns;
}

/**
 * Reorder an array based on drag and drop operation
 * @param {Array} list - The array to reorder
 * @param {number} startIndex - The index of the dragged item
 * @param {number} endIndex - The index where the item is dropped
 * @returns {Array} - The reordered array
 */
export function reorderArray(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}
