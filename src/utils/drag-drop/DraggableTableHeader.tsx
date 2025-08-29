import React, { useState, useEffect } from 'react';
import { EditColumnModal } from '../components/EditColumnModal';
import { saveColumnOrder, getColumnOrder, orderColumns } from './columnUtils';

// Tipo de columna
interface ColumnType {
  id: string | number;
  name: string;
  type?: string;
  color?: string;
  options?: string[];
  [key: string]: any;
}

interface DraggableTableHeaderProps {
  columns: ColumnType[];
  onEditColumn?: (id: string | number, data: any) => void;
  onDeleteColumn?: (id: string | number, name: string) => void;
  onColumnOrderChange?: (columns: ColumnType[]) => void;
  themeColor?: string;
}

export const DraggableTableHeader: React.FC<DraggableTableHeaderProps> = ({
  columns,
  onEditColumn,
  onDeleteColumn,
  onColumnOrderChange,
  themeColor = '#2e8540',
}) => {
  // Estado para columnas ordenadas
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>(() => {
    const savedOrder = getColumnOrder();
    return orderColumns(columns, savedOrder);
  });

  // Estado para columna que se está editando
  const [editingColumn, setEditingColumn] = useState<ColumnType | null>(null);
  
  // Estado para el arrastre
  const [draggingColIndex, setDraggingColIndex] = useState<number | null>(null);

  // Actualizar cuando cambien las columnas externas
  useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(orderColumns(columns, savedOrder));
  }, [columns]);

  // Manejadores para drag & drop
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggingColIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Añadir clase para estilos durante el arrastre
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('dragging');
    }
    
    // Establecer efecto de movimiento
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('drag-over');
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    // Remover todas las clases de estilo
    document.querySelectorAll('.dragging, .drag-over').forEach(el => {
      el.classList.remove('dragging', 'drag-over');
    });
    
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    
    if (dragIndex === dropIndex || isNaN(dragIndex)) return;
    
    // Crear un nuevo array con el orden actualizado
    const newOrderedColumns = [...orderedColumns];
    const [draggedColumn] = newOrderedColumns.splice(dragIndex, 1);
    newOrderedColumns.splice(dropIndex, 0, draggedColumn);
    
    // Actualizar estado local
    setOrderedColumns(newOrderedColumns);
    
    // Guardar en localStorage
    const columnIds = newOrderedColumns.map(col => col.id);
    saveColumnOrder(columnIds);
    
    // Notificar al componente padre
    if (onColumnOrderChange) {
      onColumnOrderChange(newOrderedColumns);
    }
    
    setDraggingColIndex(null);
  };

  const handleDragEnd = () => {
    // Limpiar clases de estilo
    document.querySelectorAll('.dragging, .drag-over').forEach(el => {
      el.classList.remove('dragging', 'drag-over');
    });
    
    setDraggingColIndex(null);
  };

  // Función para obtener color de contraste
  const getContrastColor = (hex: string | undefined): string => {
    if (!hex) return '#fff';
    let c = hex.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 170 ? '#222' : '#fff';
  };

  // Función para obtener color de fondo con transparencia
  const getHeaderBg = (color?: string) => {
    if (!color) return `rgba(46,133,64,0.08)`;
    let c = color.replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r},${g},${b},0.08)`;
  };

  return (
    <>
      <div className="draggable-table-header" style={{ display: 'flex', flexDirection: 'row' }}>
        {/* Columna fija para nombres */}
        <div className="header-cell fixed-column" style={{ minWidth: '200px' }}>
          <div className="cell-content" style={{ padding: '10px', fontWeight: 'bold' }}>
            الاسم
          </div>
        </div>
        
        {/* Columnas arrastrables */}
        <div className="scrollable-headers" style={{ display: 'flex', overflow: 'auto' }}>
          {orderedColumns.map((column, index) => (
            <div
              key={column.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`header-cell ${draggingColIndex === index ? 'dragging' : ''}`}
              style={{
                minWidth: '150px',
                backgroundColor: getHeaderBg(column.color || themeColor),
                borderBottom: `2px solid ${column.color || themeColor}`,
                position: 'relative',
                cursor: 'grab',
              }}
            >
              <div 
                className="cell-content"
                style={{ 
                  padding: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{column.name}</span>
                
                <div className="header-actions" style={{ display: 'flex', gap: '4px' }}>
                  {onEditColumn && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingColumn(column);
                      }}
                      className="edit-btn"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                  )}
                  
                  {onDeleteColumn && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteColumn(column.id, column.name);
                      }}
                      className="delete-btn"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
                
                {/* Indicador de arrastre */}
                <div 
                  className="drag-handle"
                  style={{
                    position: 'absolute',
                    right: '2px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    opacity: 0.5,
                    fontSize: '16px'
                  }}
                >
                  ⋮
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal de edición */}
      {editingColumn && onEditColumn && (
        <EditColumnModal
          column={editingColumn}
          onClose={() => setEditingColumn(null)}
          onSave={(data) => {
            onEditColumn(editingColumn.id, data);
            setEditingColumn(null);
          }}
        />
      )}

      <style jsx>{`
        .draggable-table-header {
          user-select: none;
          width: 100%;
          overflow-x: auto;
        }
        
        .header-cell {
          transition: all 0.2s ease;
        }
        
        .header-cell.dragging {
          opacity: 0.4;
          border: 1px dashed #999;
        }
        
        .header-cell.drag-over {
          border: 1px dashed #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .drag-handle {
          cursor: grab;
        }
        
        .header-actions {
          visibility: hidden;
        }
        
        .header-cell:hover .header-actions {
          visibility: visible;
        }
      `}</style>
    </>
  );
};
