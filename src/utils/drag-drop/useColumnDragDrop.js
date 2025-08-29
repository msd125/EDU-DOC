import React from 'react';
import { saveColumnOrder, getColumnOrder, orderColumns, resetColumnOrder } from './utils';

/**
 * Esta es una implementación básica con HTML5 Drag and Drop nativo
 * para permitir reordenar las columnas de la tabla
 */
function useColumnDragDrop(columns, onReorder) {
  // Estado para las columnas ordenadas
  const [orderedColumns, setOrderedColumns] = React.useState(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });

  // Actualizar cuando cambien las columnas externas
  React.useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(orderColumns(columns, savedOrder));
  }, [columns]);

  // Función para resetear al orden original
  const resetToDefaultOrder = React.useCallback(() => {
    resetColumnOrder();
    setOrderedColumns([...columns]);
    if (onReorder) {
      onReorder([...columns]);
    }
  }, [columns, onReorder]);

  // Función para guardar el nuevo orden
  const updateColumnOrder = React.useCallback((newOrder) => {
    setOrderedColumns(newOrder);
    saveColumnOrder(newOrder.map(col => col.id));
    if (onReorder) {
      onReorder(newOrder);
    }
  }, [onReorder]);

  // Objeto de handlers para el drag and drop
  const dragHandlers = React.useMemo(() => ({
    onDragStart: (e, index) => {
      e.dataTransfer.setData('text/plain', index);
      e.target.classList.add('dragging');
    },
    onDragOver: (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    },
    onDragEnter: (e) => {
      e.target.classList.add('drag-over');
    },
    onDragLeave: (e) => {
      e.target.classList.remove('drag-over');
    },
    onDrop: (e, dropIndex) => {
      e.preventDefault();
      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
      
      if (dragIndex === dropIndex) return;
      
      // Crear un nuevo array con el orden actualizado
      const newOrderedColumns = [...orderedColumns];
      const itemToMove = newOrderedColumns.splice(dragIndex, 1)[0];
      newOrderedColumns.splice(dropIndex, 0, itemToMove);
      
      // Actualizar estado y guardar
      updateColumnOrder(newOrderedColumns);
      
      // Limpiar clases CSS
      document.querySelectorAll('.dragging, .drag-over').forEach(el => {
        el.classList.remove('dragging');
        el.classList.remove('drag-over');
      });
    },
    onDragEnd: () => {
      document.querySelectorAll('.dragging, .drag-over').forEach(el => {
        el.classList.remove('dragging');
        el.classList.remove('drag-over');
      });
    }
  }), [orderedColumns, updateColumnOrder]);

  return {
    orderedColumns,
    resetToDefaultOrder,
    updateColumnOrder,
    dragHandlers
  };
}

export default useColumnDragDrop;
