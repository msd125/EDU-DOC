import React from 'react';
import useColumnDragDrop from './useColumnDragDrop';
import './DraggableColumns.css';

/**
 * Componente para renderizar columnas arrastrables
 * @param {Object} props 
 * @param {Array} props.columns - Array de objetos columna con {id, name, etc}
 * @param {Function} props.onReorder - Callback cuando se reordena
 * @param {Function} props.renderColumn - Función para renderizar el contenido de cada columna
 * @returns {React.Component}
 */
const DraggableColumns = ({ columns, onReorder, renderColumn }) => {
  // Usar el hook custom para manejar el drag & drop
  const { orderedColumns, resetToDefaultOrder, dragHandlers } = useColumnDragDrop(columns, onReorder);

  // Estilo para las columnas
  const columnStyle = {
    padding: '8px',
    cursor: 'move',
    userSelect: 'none',
    transition: 'background-color 0.2s ease'
  };

  return (
    <div className="draggable-columns-container">
      <div className="draggable-columns-header">
        <button 
          onClick={resetToDefaultOrder}
          className="reset-order-button"
        >
          إعادة ترتيب الافتراضي
        </button>
      </div>
      <div className="draggable-columns">
        {orderedColumns.map((column, index) => (
          <div
            key={column.id || index}
            draggable
            onDragStart={(e) => dragHandlers.onDragStart(e, index)}
            onDragOver={dragHandlers.onDragOver}
            onDragEnter={dragHandlers.onDragEnter}
            onDragLeave={dragHandlers.onDragLeave}
            onDrop={(e) => dragHandlers.onDrop(e, index)}
            onDragEnd={dragHandlers.onDragEnd}
            className="draggable-column"
            style={columnStyle}
            data-column-id={column.id}
          >
            {renderColumn ? renderColumn(column, index) : column.name || column.title || `Column ${index + 1}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DraggableColumns;
