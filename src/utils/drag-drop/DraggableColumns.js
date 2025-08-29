import React, { useState, useEffect, useCallback } from 'react';

// Importamos las utilidades básicas
import {
  saveColumnOrder,
  getColumnOrder,
  orderColumns,
  reorderArray
} from './utils';

// Componente para manejar el arrastre de columnas sin utilizar bibliotecas externas
const DraggableColumns = ({ columns, onReorder }) => {
  // Estado para columnas ordenadas
  const [orderedColumns, setOrderedColumns] = useState(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });

  // Estado para seguimiento del arrastre
  const [dragging, setDragging] = useState(null);
  const [over, setOver] = useState(null);

  // Actualizar cuando cambien las columnas desde fuera
  useEffect(() => {
    if (columns && columns.length > 0) {
      const savedOrder = getColumnOrder();
      setOrderedColumns(orderColumns(columns, savedOrder));
    }
  }, [columns]);

  // Manejadores de eventos de arrastre
  const handleDragStart = useCallback((e, index) => {
    setDragging(index);
    
    // Efecto visual para el elemento arrastrado
    if (e.target) {
      e.target.style.opacity = '0.6';
      e.target.style.border = '2px dashed #0ea5e9';
    }
    
    // Establece los datos que se están arrastrando
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    setOver(index);
  }, []);

  const handleDragEnd = useCallback((e) => {
    setDragging(null);
    setOver(null);
    
    // Restaurar estilos
    if (e.target) {
      e.target.style.opacity = '1';
      e.target.style.border = '';
    }
  }, []);

  const handleDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    
    const dragIndex = Number(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;
    
    // Reordenar las columnas
    const newOrderedColumns = reorderArray(orderedColumns, dragIndex, dropIndex);
    
    // Actualizar estado
    setOrderedColumns(newOrderedColumns);
    
    // Guardar en localStorage
    saveColumnOrder(newOrderedColumns.map(col => col.id));
    
    // Notificar al componente padre
    onReorder(newOrderedColumns);
    
    setDragging(null);
    setOver(null);
  }, [orderedColumns, onReorder]);

  return (
    <div className="draggable-columns-container">
      {orderedColumns.map((column, index) => (
        <div 
          key={column.id}
          className={`draggable-column ${dragging === index ? 'dragging' : ''} ${over === index ? 'drag-over' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, index)}
          style={{
            cursor: 'grab',
            padding: '8px',
            margin: '4px',
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            boxShadow: dragging === index ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          {column.name}
          <span className="drag-handle ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="12" height="12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  );
};

export default DraggableColumns;
