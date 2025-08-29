/**
 * وظائف مساعدة لإدارة ترتيب الأعمدة
 */

// مفتاح التخزين المحلي لحفظ ترتيب الأعمدة
const COLUMN_ORDER_KEY = 'studentTableColumnOrder';

/**
 * حفظ ترتيب الأعمدة في التخزين المحلي
 * @param {Array} columnOrder - مصفوفة تحتوي على معرفات الأعمدة بالترتيب المطلوب
 */
export const saveColumnOrder = (columnOrder = []) => {
  if (!columnOrder || !Array.isArray(columnOrder)) return;
  try {
    localStorage.setItem(COLUMN_ORDER_KEY, JSON.stringify(columnOrder));
  } catch (e) {
    console.error('خطأ في حفظ ترتيب الأعمدة في التخزين المحلي:', e);
  }
};

/**
 * استرجاع ترتيب الأعمدة من التخزين المحلي
 * @returns {Array} - مصفوفة تحتوي على معرفات الأعمدة بالترتيب المحفوظ
 */
export const getColumnOrder = () => {
  try {
    const savedOrder = localStorage.getItem(COLUMN_ORDER_KEY);
    return savedOrder ? JSON.parse(savedOrder) : [];
  } catch (e) {
    console.error('خطأ في استرجاع ترتيب الأعمدة من التخزين المحلي:', e);
    return [];
  }
};

/**
 * إعادة ضبط ترتيب الأعمدة في التخزين المحلي
 */
export const resetColumnOrder = () => {
  try {
    localStorage.removeItem(COLUMN_ORDER_KEY);
  } catch (e) {
    console.error('خطأ في إعادة ضبط ترتيب الأعمدة في التخزين المحلي:', e);
  }
};

/**
 * ترتيب الأعمدة بناءً على الترتيب المحفوظ
 * @param {Array} columns - مصفوفة الأعمدة الأصلية
 * @param {Array} orderIds - مصفوفة تحتوي على معرفات الأعمدة بالترتيب المطلوب
 * @returns {Array} - الأعمدة المرتبة
 */
export const orderColumns = (columns, orderIds) => {
  if (!columns || !columns.length) return [];
  if (!orderIds || !orderIds.length) return [...columns];

  // إنشاء خريطة للبحث السريع
  const columnMap = new Map(columns.map(col => [col.id, col]));
  
  // أولاً، إضافة الأعمدة بالترتيب المحدد إذا كانت موجودة
  const orderedColumns = [];
  orderIds.forEach(id => {
    if (columnMap.has(id)) {
      orderedColumns.push(columnMap.get(id));
      columnMap.delete(id);
    }
  });
  
  // ثم إضافة أي أعمدة متبقية لم تكن في الترتيب
  columnMap.forEach(column => orderedColumns.push(column));
  
  return orderedColumns;
};
