/**
 * Utilidades para la funcionalidad de arrastrar y soltar columnas
 * 
 * Este archivo contiene funciones básicas para implementar
 * la funcionalidad de arrastrar y soltar columnas en una tabla
 */

// Función para guardar el orden de las columnas en localStorage
export const saveColumnOrder = (order) => {
  try {
    localStorage.setItem('columnOrder', JSON.stringify(order));
  } catch (error) {
    console.error('Error al guardar el orden de columnas:', error);
  }
};

// Función para recuperar el orden de las columnas desde localStorage
export const getColumnOrder = () => {
  try {
    const saved = localStorage.getItem('columnOrder');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error al recuperar el orden de columnas:', error);
    return [];
  }
};

// Función para reordenar elementos en un array
export const reorderArray = (array, startIndex, endIndex) => {
  const result = Array.from(array);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Función para ordenar columnas según un orden guardado
export const orderColumns = (columns, savedOrder) => {
  if (!savedOrder || savedOrder.length === 0) return columns;
  
  // Crear un mapa para búsqueda rápida de índices
  const orderMap = new Map();
  savedOrder.forEach((id, index) => {
    orderMap.set(id, index);
  });
  
  // Ordenar según el mapa
  return [...columns].sort((a, b) => {
    const indexA = orderMap.has(a.id) ? orderMap.get(a.id) : Infinity;
    const indexB = orderMap.has(b.id) ? orderMap.get(b.id) : Infinity;
    return indexA - indexB;
  });
};

// Función para resetear el orden guardado
export const resetColumnOrder = () => {
  localStorage.removeItem('columnOrder');
};

export default {
  saveColumnOrder,
  getColumnOrder,
  reorderArray,
  orderColumns,
  resetColumnOrder
};
