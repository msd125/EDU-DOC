import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// تعريف أنواع البيانات
interface ColumnType {
  id: string | number;
  name: string;
  type?: string;
  options?: string[];
}

interface DraggableTableProps {
  columns: ColumnType[];
  onColumnOrderChange: (columns: ColumnType[]) => void;
  children: (columns: ColumnType[]) => React.ReactNode;
  themeColor?: string;
}

// وظائف خاصة بـ localStorage
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

// إعادة ترتيب الأعمدة بناءً على الترتيب المخزن
const reorderColumns = <T extends { id: string | number }>(
  columns: T[],
  order: (string | number)[]
): T[] => {
  if (!order || order.length === 0) return columns;
  
  // نسخ المصفوفة لتجنب تعديل الأصلية مباشرة
  const result = [...columns];
  
  result.sort((a, b) => {
    const indexA = order.indexOf(a.id);
    const indexB = order.indexOf(b.id);
    
    // إذا كان كلا العمودين موجودين في الترتيب، قارن بين مواقعهما
    if (indexA >= 0 && indexB >= 0) {
      return indexA - indexB;
    }
    
    // إذا كان أحدهما فقط في الترتيب، ضعه أولاً
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;
    
    // إذا لم يكن أي منهما في الترتيب، احتفظ بالترتيب الأصلي
    return 0;
  });
  
  return result;
};

const DraggableTable: React.FC<DraggableTableProps> = ({ columns, onColumnOrderChange, children, themeColor }) => {
  // حالة ترتيب الأعمدة
  const [columnOrder, setColumnOrder] = useState<(string | number)[]>(() => {
    return getColumnOrder();
  });

  // الأعمدة المرتبة حسب الترتيب المحفوظ
  const orderedColumns = reorderColumns(columns, columnOrder);

  // تحديث الترتيب عند تغييره
  useEffect(() => {
    // تحديث الترتيب فقط إذا كانت قائمة الأعمدة تحتوي على عناصر
    if (columns.length > 0) {
      const currentIds = columns.map(col => col.id);
      const validOrder = columnOrder.filter(id => currentIds.includes(id));
      
      // إضافة أي أعمدة جديدة ليست موجودة في الترتيب
      currentIds.forEach(id => {
        if (!validOrder.includes(id)) {
          validOrder.push(id);
        }
      });
      
      // تحديث الحالة إذا كان هناك اختلاف
      if (JSON.stringify(validOrder) !== JSON.stringify(columnOrder)) {
        setColumnOrder(validOrder);
        saveColumnOrder(validOrder);
      }
    }
  }, [columns, columnOrder]);

  // معالجة إنتهاء السحب
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newOrder = [...columnOrder];
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    
    setColumnOrder(newOrder);
    saveColumnOrder(newOrder);
    
    // تحديث الترتيب في المكون الأب
    const newColumns = reorderColumns(columns, newOrder);
    onColumnOrderChange(newColumns);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {children(orderedColumns)}
    </DragDropContext>
  );
};

export default DraggableTable;
