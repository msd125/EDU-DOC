// Utilidades para gestionar el orden de las columnas

// Función para guardar el orden de columnas en localStorage
export const saveColumnOrder = (order: (string | number)[]) => {
  try {
    localStorage.setItem('columnOrder', JSON.stringify(order));
  } catch (error) {
    console.error('Error saving column order to localStorage:', error);
  }
};

// Función para obtener el orden de columnas guardado
export const getColumnOrder = (): (string | number)[] => {
  try {
    const saved = localStorage.getItem('columnOrder');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading column order from localStorage:', error);
    return [];
  }
};

// Reordenar un arreglo basado en el orden especificado
export const reorderColumns = <T extends { id: string | number }>(
  columns: T[],
  order: (string | number)[]
): T[] => {
  // Si no hay orden especificado, devolver las columnas como están
  if (!order || order.length === 0) return columns;
  
  // Crear una copia para no mutar el arreglo original
  const result = [...columns];
  
  // Ordenar basado en el índice en el arreglo de orden
  result.sort((a, b) => {
    const indexA = order.indexOf(a.id);
    const indexB = order.indexOf(b.id);
    
    // Si ambos están en el orden, comparar sus posiciones
    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }
    
    // Si sólo uno está en el orden, ponerlo primero
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;
    
    // Si ninguno está en el orden, mantener el orden original
    return 0;
  });
  
  return result;
};
