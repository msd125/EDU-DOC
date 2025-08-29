import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { saveColumnOrder, getColumnOrder, orderColumns } from './columnUtils';

// Tipo constante para drag & drop
const COLUMN_TYPE = 'table-column';

// Componente de encabezado arrastrable
function DraggableHeader({ column, index, moveColumn }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: COLUMN_TYPE,
    item: { id: column.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: COLUMN_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        // Actualizar el índice arrastrado para que las transiciones sean suaves
        draggedItem.index = index;
      }
    },
  });

  const opacity = isDragging ? 0.4 : 1;
  
  // Combinamos las referencias de drag y drop en un único elemento
  const ref = (element) => {
    dragRef(element);
    dropRef(element);
  };

  return (
    <div 
      ref={ref} 
      className="draggable-header"
      style={{ opacity, cursor: 'move' }}
    >
      {column.name}
      <span className="drag-handle">⋮</span>
    </div>
  );
}

// Componente principal para manejar columnas arrastrables
function DraggableColumnHeaders({ columns, onColumnOrderChange }) {
  // Estado para las columnas ordenadas
  const [orderedColumns, setOrderedColumns] = useState(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });

  // Actualizar cuando cambien las columnas externas
  useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(orderColumns(columns, savedOrder));
  }, [columns]);

  // Función para mover una columna
  const moveColumn = (dragIndex, hoverIndex) => {
    const draggedColumn = orderedColumns[dragIndex];
    const newOrderedColumns = [...orderedColumns];
    
    // Eliminar el elemento arrastrado
    newOrderedColumns.splice(dragIndex, 1);
    
    // Insertar el elemento en la nueva posición
    newOrderedColumns.splice(hoverIndex, 0, draggedColumn);
    
    // Actualizar el estado
    setOrderedColumns(newOrderedColumns);
    
    // Guardar el nuevo orden
    const newColumnIds = newOrderedColumns.map(col => col.id);
    saveColumnOrder(newColumnIds);
    
    // Notificar al componente padre
    if (onColumnOrderChange) {
      onColumnOrderChange(newOrderedColumns);
    }
  };

  return (
    <div className="draggable-column-container">
      {orderedColumns.map((column, index) => (
        <DraggableHeader
          key={column.id}
          column={column}
          index={index}
          moveColumn={moveColumn}
        />
      ))}
    </div>
  );
}

// Componente contenedor con DndProvider
export default function TableHeaderWithDnd({ columns, onColumnOrderChange }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableColumnHeaders 
        columns={columns} 
        onColumnOrderChange={onColumnOrderChange} 
      />
    </DndProvider>
  );
}
