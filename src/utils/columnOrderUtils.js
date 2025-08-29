// وظائف مساعدة لإدارة ترتيب الأعمدة في جدول الطلاب

// المفتاح المستخدم في التخزين المحلي
const COLUMN_ORDER_KEY = 'edu-doc-column-order';

/**
 * حفظ ترتيب الأعمدة في التخزين المحلي
 * @param {Array} columnIds - مصفوفة تحتوي على معرفات الأعمدة بالترتيب المطلوب
 */
export const saveColumnOrder = (columnIds) => {
  try {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnIds));
  } catch (error) {
    console.error('خطأ في حفظ ترتيب الأعمدة:', error);
  }
};

/**
 * استرجاع ترتيب الأعمدة من التخزين المحلي
 * @returns {Array} مصفوفة تحتوي على معرفات الأعمدة المخزنة
 */
export const getColumnOrder = () => {
  try {
    const savedOrder = localStorage.getItem(COLUMN_ORDER_KEY);
    return savedOrder ? JSON.parse(savedOrder) : null;
  } catch (error) {
    console.error('خطأ في استرجاع ترتيب الأعمدة:', error);
    return null;
  }
};

/**
 * إعادة ترتيب الأعمدة بناءً على الترتيب المخزن
 * @param {Array} columns - الأعمدة الأصلية
 * @returns {Array} الأعمدة بعد الترتيب
 */
export const getOrderedColumns = (columns) => {
  // إذا لم تكن هناك أعمدة، أرجع مصفوفة فارغة
  if (!columns || columns.length === 0) return [];
  
  // استرجاع الترتيب المخزن
  const savedOrder = getColumnOrder();
  
  // إذا لم يكن هناك ترتيب مخزن، أرجع الأعمدة الأصلية
  if (!savedOrder) return columns;
  
  // إنشاء خريطة بالأعمدة للوصول السريع
  const columnsMap = new Map();
  columns.forEach(column => {
    columnsMap.set(column.id, column);
  });
  
  // المصفوفة التي ستحتوي على الأعمدة المرتبة
  const orderedColumns = [];
  
  // إضافة الأعمدة حسب الترتيب المخزن
  savedOrder.forEach(columnId => {
    if (columnsMap.has(columnId)) {
      orderedColumns.push(columnsMap.get(columnId));
      columnsMap.delete(columnId);
    }
  });
  
  // إضافة أي أعمدة متبقية (جديدة مثلاً) في النهاية
  columnsMap.forEach(column => {
    orderedColumns.push(column);
  });
  
  return orderedColumns;
};

/**
 * إعادة ضبط ترتيب الأعمدة (حذف الترتيب المخزن)
 */
export const resetColumnOrder = () => {
  try {
    localStorage.removeItem(COLUMN_ORDER_KEY);
  } catch (error) {
    console.error('خطأ في إعادة ضبط ترتيب الأعمدة:', error);
  }
};
