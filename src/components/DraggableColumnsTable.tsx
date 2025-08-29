import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Interface for the column type
interface ColumnType {
  id: string | number;
  name: string;
  type?: string;
  options?: string[];
}

// Props for the DraggableColumnsTable component
interface DraggableColumnsTableProps {
  columns: ColumnType[];
  onReorder: (newOrder: ColumnType[]) => void;
  children: React.ReactNode; // The fixed header elements (like serial number and name)
  renderColumn: (column: ColumnType, index: number) => React.ReactNode; // Function to render each column
}

// Helper functions for local storage
const saveColumnOrder = (order: (string | number)[]) => {
  try {
    localStorage.setItem('columnOrder', JSON.stringify(order));
  } catch (error) {
    console.error('Error saving column order to localStorage:', error);
  }
};

const getColumnOrder = (): (string | number)[] => {
  try {
    const saved = localStorage.getItem('columnOrder');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading column order from localStorage:', error);
    return [];
  }
};

// Function to reorder columns based on the saved order
const reorderColumns = <T extends { id: string | number }>(
  columns: T[],
  order: (string | number)[]
): T[] => {
  if (!order || order.length === 0) return columns;
  
  // Create a map for quick lookup
  const orderMap = new Map<string | number, number>();
  order.forEach((id, index) => {
    orderMap.set(id, index);
  });
  
  // Copy columns to avoid mutating the original array
  const result = [...columns];
  
  // Sort based on the order
  result.sort((a, b) => {
    const indexA = orderMap.has(a.id) ? orderMap.get(a.id)! : 999;
    const indexB = orderMap.has(b.id) ? orderMap.get(b.id)! : 999;
    
    return indexA - indexB;
  });
  
  return result;
};

// Main component
const DraggableColumnsTable: React.FC<DraggableColumnsTableProps> = ({ 
  columns, 
  onReorder, 
  children,
  renderColumn 
}) => {
  // State for the ordered columns
  const [orderedColumns, setOrderedColumns] = useState<ColumnType[]>(() => {
    const savedOrder = getColumnOrder();
    return reorderColumns(columns, savedOrder);
  });

  // Update columns when they change from outside
  useEffect(() => {
    const savedOrder = getColumnOrder();
    setOrderedColumns(reorderColumns(columns, savedOrder));
  }, [columns]);

  // Handle drag end
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    // Reorder the columns
    const items = Array.from(orderedColumns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Save to local storage
    saveColumnOrder(items.map(col => col.id));
    
    // Update state and notify parent
    setOrderedColumns(items);
    onReorder(items);
  }, [orderedColumns, onReorder]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <tr>
        {/* Fixed headers (children) */}
        {children}
        
        {/* Draggable columns */}
        <Droppable droppableId="droppable-columns" direction="horizontal">
          {(provided) => (
            <td 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="draggable-columns-container p-0 m-0 border-0"
              style={{ padding: 0, margin: 0, border: 'none' }}
            >
              <div className="flex flex-row">
                {orderedColumns.map((column, index) => (
                  <Draggable key={String(column.id)} draggableId={String(column.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`draggable-column ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1
                        }}
                      >
                        {renderColumn(column, index)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </td>
          )}
        </Droppable>
      </tr>
    </DragDropContext>
  );
};

export default DraggableColumnsTable;
