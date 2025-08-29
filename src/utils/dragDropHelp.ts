// Archivo simple para mostrar instrucciones de uso del drag-and-drop
/**
 * Instrucciones para implementar Drag and Drop de columnas
 * ---------------------------------------------------------
 * 
 * 1. Cómo instalar las dependencias necesarias:
 *    npm install react-beautiful-dnd @types/react-beautiful-dnd
 * 
 * 2. Cómo usar los componentes:
 *    
 *    import DraggableColumnsTable from './components/DraggableColumnsTable';
 * 
 *    // En su componente de tabla:
 *    const handleColumnReorder = (newColumns) => {
 *      // Actualizar el estado con el nuevo orden de columnas
 *      setColumns(newColumns);
 *    };
 * 
 *    // En el renderizado:
 *    <table>
 *      <thead>
 *        <DraggableColumnsTable 
 *          columns={columns}
 *          onReorder={handleColumnReorder}
 *          renderColumn={(column) => (
 *            // Renderizar cada columna con sus propios controles
 *            <th>
 *              {column.name}
 *              // ...botones y otros elementos
 *            </th>
 *          )}
 *        >
 *          {/* Columnas fijas (número y nombre de estudiante) */}
 *          <th>م</th>
 *          <th>الاسم</th>
 *        </DraggableColumnsTable>
 *      </thead>
 *      <tbody>
 *        {/* ... filas de la tabla ... */}
 *      </tbody>
 *    </table>
 */

export const helpText = `
# كيفية استخدام خاصية سحب وإفلات الأعمدة

1. تم تطبيق خاصية السحب والإفلات للأعمدة باستخدام مكتبة react-beautiful-dnd
2. يمكن سحب الأعمدة وإعادة ترتيبها عن طريق النقر والسحب
3. يتم حفظ الترتيب تلقائيًا في localStorage
4. لإعادة تعيين الترتيب، يمكن إضافة زر "إعادة ضبط ترتيب الأعمدة"

## الميزات المضافة
- مؤشر السحب (كرسور) يظهر عند تمرير المؤشر فوق الأعمدة
- مؤشرات بصرية أثناء السحب
- حفظ الترتيب تلقائيًا
- تحسين الأداء للتعامل مع عدد كبير من الأعمدة
`;

export default helpText;
