type ColorThemeGroupProps = {
  activeSubject: Subject;
  onUpdateThemeColor: (classId: string, subjectId: string, color: string) => void;
  classId: string;
};
function ColorThemeGroup({ activeSubject, onUpdateThemeColor, classId }: ColorThemeGroupProps) {
  const [showColors, setShowColors] = useState(false); // مطوي دائمًا افتراضيًا
  const oliveColor = '#2E8540';
  return (
  <div className="space-y-2 border-t border-slate-200 mt-2 rounded-lg">
      <button
        onClick={() => setShowColors(!showColors)}
        className="w-full flex justify-between items-center p-2 text-sm text-right rounded-t-lg"
        style={{ backgroundColor: oliveColor, color: '#fff' }}
      >
        <span className="font-bold flex items-center gap-2">
          <PaletteIcon className="w-5 h-5" />
          تنسيق الألوان
        </span>
        {showColors ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>
      {showColors && (
  <div className="px-2 pt-1 pb-2 bg-white rounded-b-lg">
          <p className="text-xs mb-2 text-slate-700">اختر لوناً لتمييز رأس الجدول في التقارير.</p>
          <div className="flex flex-wrap gap-2">
            {THEME_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onUpdateThemeColor(classId, activeSubject.id, color)}
                className={'w-7 h-7 rounded-full cursor-pointer transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center ' + (activeSubject.themeColor === color ? 'ring-2 ring-offset-2 ring-emerald-700' : 'ring-1 ring-slate-300')}
                style={{ backgroundColor: color }}
                aria-label={'Select color ' + color}
              >
                {activeSubject.themeColor === color && (
                  <CheckIcon className="w-4 h-4 text-white" style={{ mixBlendMode: 'difference' }}/>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Class, Subject, ColumnType } from '../types';
import { 
  ChevronDownIcon, ChevronUpIcon, XIcon, PlusIcon, 
  BookOpenIcon, CheckIcon, PlusCircleIcon, EditIcon, TrashIcon, 
  PaletteIcon, ListIcon
} from './Icons';
import ConfirmModal from './ConfirmModal';

const assessmentCategories = [
  {
    title: 'المهام الأدائية',
    items: [ { name: 'واجبات' }, { name: 'مهام أدائية' }, { name: 'تطبيقات عملية' }, { name: 'مشروع' } ]
  },
  {
    title: 'المشاركة والتفاعل',
    items: [ { name: 'مشاركة' }, { name: 'أنشطة صفية' }, { name: 'تطبيقات عملية' } ]
  },
  {
    title: 'القرآن الكريم والتجويد',
    items: [ { name: 'التلاوة' }, { name: 'الترتيل' }, { name: 'طلاقة القراءة' }, { name: 'الحفظ' } ]
  },
  {
    title: 'تطبيقات عملية',
    items: [ { name: 'لياقة بدنية' }, { name: 'مهارات حركية' } ]
  },
  {
    title: 'اختبار قصير',
    items: [ { name: 'شفهي' }, { name: 'عملي' }, { name: 'تحريري' }, { name: 'اختبارات قصيرة' }, { name: 'اختبار نهاية فترة' } ]
  },
  {
    title: 'اختبار نهائي',
    items: [ { name: 'عملي' }, { name: 'شفهي' }, { name: 'تحريري' } ]
  },
  {
    title: 'بنود أخرى',
    items: [ { name: 'الغياب' }, { name: 'السلوك' }, { name: 'الاستئذان' }, { name: 'التوقيع' }, { name: 'المجموع' } ]
  },
];

// OneNote-inspired color palette
const THEME_COLORS = [
  '#7719AA', // Purple
  '#FFB900', // Yellow
  '#D83B01', // Orange
  '#B146C2', // Violet
  '#107C10', // Green
  '#0078D4', // Blue
  '#E3008C', // Pink
  '#5C2D91', // Deep Purple
  '#00B7C3', // Cyan
  '#F7630C', // Deep Orange
  '#498205', // Olive
  '#C239B3', // Magenta
  '#8764B8', // Lavender
  '#B4009E', // Fuchsia
  '#008272', // Teal
  '#E74856', // Red
  '#0099BC', // Light Blue
  '#7A7574', // Gray
  '#FF4343', // Bright Red
  '#00CC6A', // Emerald
  '#FFD700', // Gold
  '#A52A2A', // Brown
  '#00CED1', // Dark Turquoise
  '#DC143C', // Crimson
  '#228B22', // Forest Green
  '#8A2BE2', // Blue Violet
  '#FF69B4', // Hot Pink
  '#40E0D0', // Turquoise
  '#FF8C00', // Dark Orange
  '#4682B4', // Steel Blue
  '#2E8B57', // Sea Green
  '#6A5ACD', // Slate Blue
  '#C71585', // Medium Violet Red
  '#B22222', // Fire Brick
  '#20B2AA', // Light Sea Green
  '#F08080', // Light Coral
  '#556B2F', // Dark Olive Green
  '#483D8B', // Dark Slate Blue
  '#8B0000', // Dark Red
  '#00FA9A', // Medium Spring Green
  '#191970', // Midnight Blue
  '#FFDAB9', // Peach Puff
  '#7FFF00', // Chartreuse
  '#D2691E', // Chocolate
];





const ReportTheme: React.FC<{
  activeSubject: Subject;
  onUpdateThemeColor: (classId: string, subjectId: string, color: string) => void;
  classId: string;
}> = ({ activeSubject, onUpdateThemeColor, classId }) => {
  const [showColors, setShowColors] = useState(false); // مطوي دائماً افتراضياً
  const oliveColor = '#2E8540';
  return (
  <div className="space-y-2 border-t border-slate-200 mt-2 rounded-lg">
      <button
        onClick={() => setShowColors(!showColors)}
        className="w-full flex justify-between items-center p-2 text-sm text-right rounded-t-lg"
        style={{ backgroundColor: oliveColor, color: '#fff' }}
      >
        <span className="font-bold flex items-center gap-2">
          <PaletteIcon className="w-5 h-5" />
          الألوان
        </span>
        {showColors ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
      </button>
      {showColors && (
  <div className="px-2 pt-1 pb-2 bg-white rounded-b-lg">
          <p className="text-xs mb-2 text-slate-700">اختر لوناً لتمييز رأس الجدول في التقارير.</p>
          <div className="flex flex-wrap gap-2">
            {THEME_COLORS.map(color => (
              <button
                key={color}
                onClick={() => onUpdateThemeColor(classId, activeSubject.id, color)}
                className={'w-7 h-7 rounded-full cursor-pointer transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center ' + (activeSubject.themeColor === color ? 'ring-2 ring-offset-2 ring-emerald-700' : 'ring-1 ring-slate-300')}
                style={{ backgroundColor: color }}
                aria-label={'Select color ' + color}
              >
                {activeSubject.themeColor === color && (
                  <CheckIcon className="w-4 h-4 text-white" style={{ mixBlendMode: 'difference' }}/>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};




const ReportBuilder: React.FC<{
  activeClass: Class;
  activeSubject: Subject;
  onAddColumn: (classId: string, subjectId: string, name: string, type: ColumnType) => void;
  onDeleteColumn: (classId: string, subjectId: string, columnId: string, columnName: string, skipConfirm: boolean) => void;
  hideTitle?: boolean;
}> = ({ activeClass, activeSubject, onAddColumn, onDeleteColumn, hideTitle }) => {
  // تصميم احترافي لمكونات السجل مع تشك بوكس
  return (
  <div className="space-y-4 border-t border-slate-200 mt-2 rounded-lg">
      {!hideTitle && (
  <div className="flex items-center gap-2 font-bold text-slate-700 mb-2 mt-2">
          <ListIcon className="w-5 h-5" />
          <span>مكونات السجل</span>
        </div>
      )}
      <div className="space-y-4">
        {assessmentCategories.map((group, idx) => (
          <div key={group.title} className="bg-slate-50 rounded-lg shadow p-2">
            <div className="flex items-center gap-2 font-bold text-slate-700 mb-2">
              <BookOpenIcon className="w-5 h-5 text-indigo-500" />
              <span>{group.title} <span className="text-xs text-slate-400">({group.items.length})</span></span>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {group.items.map((item, i) => {
                const checked = !!activeSubject.columns.find(c => c.name === item.name);
                return (
                  <li key={item.name} className="flex items-center gap-2 bg-white rounded px-2 py-1 hover:bg-indigo-50 transition">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={e => {
                        if (e.target.checked) {
                          onAddColumn(activeClass.id, activeSubject.id, item.name, ColumnType.NUMBER);
                        } else {
                          const col = activeSubject.columns.find(c => c.name === item.name);
                          if (col) onDeleteColumn(activeClass.id, activeSubject.id, col.id, col.name, true);
                        }
                      }}
                      className="accent-emerald-600 w-4 h-4"
                      id={`col-${group.title}-${item.name}`}
                    />
                    <label htmlFor={`col-${group.title}-${item.name}`} className="flex items-center gap-1 cursor-pointer w-full">
                      <span className="whitespace-normal break-words text-xs">{item.name}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

interface SidebarProps {
  classes: Class[];
  activeClassId: string;
  activeSubjectId: string;
  onSelectClass: (classId: string) => void;
  onSelectSubject: (subjectId: string) => void;
  onAddClass: (name: string) => void;
  onEditClass: (id: string, name: string) => void;
  onDeleteClass: (id: string, name: string) => void;
  onAddSubject: (classId: string, name: string) => void;
  onEditSubject: (classId: string, subjectId: string, name: string) => void;
  onDeleteSubject: (classId: string, subjectId: string, name: string) => void;
  onUpdateSubjectThemeColor: (classId: string, subjectId: string, color: string) => void;
  onAddColumn: (classId: string, subjectId: string, name: string, type: ColumnType) => void;
  onDeleteColumn: (classId: string, subjectId: string, columnId: string, columnName: string, skipConfirm: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  classes,
  activeClassId,
  activeSubjectId,
  onSelectClass,
  onSelectSubject,
  onAddClass,
  onEditClass,
  onDeleteClass,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onUpdateSubjectThemeColor,
  onAddColumn,
  onDeleteColumn,
  isOpen,
  onClose
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState<{id: string, name: string} | null>(null);
  const [editingSubject, setEditingSubject] = useState<{id: string, name: string} | null>(null);
  const [addingSubjectToClass, setAddingSubjectToClass] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'class' | 'subject'; classId: string; subjectId?: string; name: string } | null>(null);
  // Track expanded classes (by id)
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);
  // منع التوسيع التلقائي عند أول تحميل
  const firstMount = React.useRef(true);
  React.useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    if (activeClassId) {
      setExpandedClasses([activeClassId]);
    }
  }, [activeClassId]);

  const activeClass = classes.find(c => c.id === activeClassId);
  const activeSubject = activeClass?.subjects.find(s => s.id === activeSubjectId);

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim()) {
      onAddClass(newClassName.trim());
      setNewClassName('');
    }
  };

  const handleSaveClassEdit = () => {
      if(editingClass && editingClass.name.trim()) {
          onEditClass(editingClass.id, editingClass.name.trim());
          setEditingClass(null);
      }
  }

  const handleAddSubject = (classId: string) => {
      if(newSubjectName.trim()) {
          onAddSubject(classId, newSubjectName.trim());
          setNewSubjectName('');
          setAddingSubjectToClass(null);
      }
  }

  const handleSaveSubjectEdit = (classId: string) => {
      if(editingSubject && editingSubject.name.trim()){
          onEditSubject(classId, editingSubject.id, editingSubject.name.trim());
          setEditingSubject(null);
      }
  }

  // استبدال onDeleteClass و onDeleteSubject بمنطق التأكيد
  const handleDeleteClass = (id: string, name: string) => {
    setConfirmDelete({ type: 'class', classId: id, name });
  };
  const handleDeleteSubject = (classId: string, subjectId: string, name: string) => {
    setConfirmDelete({ type: 'subject', classId, subjectId, name });
  };

  return (
    <React.Fragment>
      {/* نافذة تأكيد الحذف */}
      {confirmDelete && (
        <ConfirmModal
          message={
            confirmDelete.type === 'class'
              ? `⚠️ هل أنت متأكد أنك تريد حذف الفصل "${confirmDelete.name}"؟\nسيتم حذف جميع بيانات الفصل بشكل نهائي ولن تتمكن من استعادتها لاحقًا.\nإذا كنت متأكدًا، اضغط "تأكيد الحذف". إذا لم تكن متأكدًا، اضغط "إلغاء".`
              : `⚠️ هل أنت متأكد أنك تريد حذف المادة "${confirmDelete.name}"؟\nسيتم حذف جميع بيانات المادة بشكل نهائي ولن تتمكن من استعادتها لاحقًا.\nإذا كنت متأكدًا، اضغط "تأكيد الحذف". إذا لم تكن متأكدًا، اضغط "إلغاء".`
          }
          onConfirm={() => {
            if (confirmDelete.type === 'class') {
              onDeleteClass(confirmDelete.classId, confirmDelete.name);
            } else if (confirmDelete.type === 'subject' && confirmDelete.subjectId) {
              onDeleteSubject(confirmDelete.classId, confirmDelete.subjectId, confirmDelete.name);
            }
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
          confirmLabel="تأكيد الحذف"
        />
      )}
      {/* Overlay for mobile */}
      <div 
        className={'fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ' + (isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none')}
        onClick={onClose}
      ></div>
      {/* زر عائم لإظهار/إخفاء السايدبار على الجوال */}
      <button
        className="fixed top-4 right-4 z-50 bg-slate-700 text-white rounded-full p-2 shadow-lg md:hidden"
        onClick={isOpen ? onClose : () => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('openSidebar')); }}
        aria-label={isOpen ? 'إخفاء القائمة الجانبية' : 'إظهار القائمة الجانبية'}
      >
        {isOpen ? <XIcon className="w-5 h-5" /> : <span className="text-lg">☰</span>}
      </button>

  <aside className={'fixed inset-y-0 right-0 w-full max-w-xs sm:w-64 bg-white shadow-lg flex flex-col h-full border-s-2 border-slate-200 transform transition-transform duration-300 ease-in-out z-40 ' + (isOpen ? 'translate-x-0' : 'translate-x-full')}>
  <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-bold">الفصول والمواد الدراسية</h2>
          <button onClick={onClose} className="p-2 sm:p-1 rounded-full hover:bg-slate-200 text-lg">
            <XIcon className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            <nav className="p-2 space-y-1">
              {classes.map((c) => (
                <div key={c.id} className={'rounded-lg transition-all duration-200 ' + (activeClassId === c.id ? 'bg-slate-100' : '')}>
                  {/* Class Item */}
                  <div
                    onClick={() => {
                      // Toggle expand/collapse
                      setExpandedClasses(expanded => expanded.includes(c.id)
                        ? expanded.filter(id => id !== c.id)
                        : [...expanded, c.id]);
                    }}
                    className={'flex items-center p-3 cursor-pointer group rounded-t-lg text-xs sm:text-sm ' + (activeClassId === c.id ? 'font-bold' : '')}
                  >
                    <ChevronDownIcon className={'w-5 h-5 me-2 transition-transform ' + (expandedClasses.includes(c.id) ? 'rotate-0' : '-rotate-90')} />
                    {editingClass?.id === c.id ? (
                        <div className="w-full flex items-center gap-1">
                            <input type="text" value={editingClass.name} onChange={e => setEditingClass({...editingClass, name: e.target.value})} className="w-full p-1 border rounded" autoFocus onBlur={handleSaveClassEdit} onKeyDown={e => e.key === 'Enter' && handleSaveClassEdit()}/>
                            <button onClick={e => {e.stopPropagation(); handleSaveClassEdit();}} className="p-1 rounded-full hover:bg-green-500/20"><CheckIcon className="w-5 h-5 text-green-600"/></button>
                            <button onClick={e => {e.stopPropagation(); setEditingClass(null)}} className="p-1 rounded-full hover:bg-red-500/20"><XIcon className="w-5 h-5 text-red-600"/></button>
                        </div>
                    ) : (
                        <React.Fragment>
                          <span className="flex items-center flex-1 gap-2 min-w-0">
                            <span className="flex-1 min-w-0 break-words text-right" style={{wordBreak: 'break-word'}} title={c.name}>{c.name}</span>
                          </span>
                          <div className="flex items-center">
                               <button onClick={(e) => { e.stopPropagation(); setAddingSubjectToClass(c.id); setNewSubjectName(''); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="إضافة مادة"><PlusCircleIcon className="w-6 h-6" /></button>
                               <button onClick={(e) => { e.stopPropagation(); setEditingClass({id: c.id, name: c.name}); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="تعديل الفصل"><EditIcon className="w-6 h-6" /></button>
                               <button onClick={(e) => { e.stopPropagation(); handleDeleteClass(c.id, c.name); }} className="p-1 rounded-full hover:bg-red-100/80 hover:ring-2 hover:ring-red-400" data-tooltip="حذف الفصل"><TrashIcon className="w-6 h-6 text-red-600" /></button>
                          </div>
                        </React.Fragment>
                    )}
                  </div>
                  {/* Subjects List */}
                  {/* قائمة المواد مطوية افتراضياً */}
                  {expandedClasses.includes(c.id) && (
                    <div className="ps-6 pe-2 pb-2 space-y-1">
                        {c.subjects.map(s => {
                            const isActive = activeSubjectId === s.id;
                            return (
                                <div
                                    key={s.id}
                                    onClick={() => onSelectSubject(s.id)}
                                    className={'flex items-center p-2 rounded-md transition-all duration-200 group cursor-pointer border-r-4 text-xs sm:text-sm ' + (
                                      isActive
                                      ? 'bg-slate-200/50 font-semibold'
                                      : 'border-transparent hover:bg-slate-200/50'
                                    )}
                                    style={{ borderColor: isActive ? s.themeColor || '#2E8540' : 'transparent' }}
                                >
                                   {editingSubject?.id === s.id ? (
                                       <div className="w-full flex items-center gap-1">
                                          <input type="text" value={editingSubject.name} onChange={e => setEditingSubject({...editingSubject, name: e.target.value})} className="w-full p-1 border rounded text-slate-800" autoFocus onBlur={()=>handleSaveSubjectEdit(c.id)} onKeyDown={e => e.key === 'Enter' && handleSaveSubjectEdit(c.id)}/>
                                          <button onClick={e => {e.stopPropagation(); handleSaveSubjectEdit(c.id);}} className="p-1 rounded-full hover:bg-green-500/20"><CheckIcon className="w-5 h-5 text-green-500"/></button>
                                          <button onClick={e => {e.stopPropagation(); setEditingSubject(null)}} className="p-1 rounded-full hover:bg-red-500/20"><XIcon className="w-5 h-5 text-red-500"/></button>
                                       </div>
                                   ) : (
                                      <React.Fragment>
                                          <BookOpenIcon className={'w-4 h-4 me-2 ' + (isActive ? '' : 'text-slate-500')}/>
                                          <span className="flex-1 min-w-0 w-full break-words whitespace-normal overflow-visible text-right text-xs sm:text-sm" style={{wordBreak: 'break-word'}} title={s.name}>{s.name}</span>
                                          <div className={'flex items-center ' + (isActive ? 'text-slate-600' : '')}>
                                              <button onClick={(e) => { e.stopPropagation(); setEditingSubject({id: s.id, name: s.name}); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="تعديل المادة"><EditIcon className="w-6 h-6" /></button>
                                              <button onClick={(e) => { e.stopPropagation(); handleDeleteSubject(c.id, s.id, s.name); }} className="p-1 rounded-full hover:bg-red-100/80 hover:ring-2 hover:ring-red-400" data-tooltip="حذف المادة"><TrashIcon className="w-6 h-6 text-red-600" /></button>
                                          </div>
                                      </React.Fragment>
                                   )}
                                </div>
                            )
                        })}
                        {addingSubjectToClass === c.id && (
                            <div className="flex items-center gap-1 p-2">
                                <input type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} placeholder="اسم المادة الجديدة" className="w-full p-2 sm:p-1 text-xs sm:text-sm border rounded" autoFocus onKeyDown={e => e.key === 'Enter' && handleAddSubject(c.id)} />
                                <button onClick={() => handleAddSubject(c.id)} className="p-1 rounded-full hover:bg-green-500/20"><CheckIcon className="w-5 h-5 text-green-600"/></button>
                                <button onClick={() => setAddingSubjectToClass(null)} className="p-1 rounded-full hover:bg-red-500/20"><XIcon className="w-5 h-5 text-red-600"/></button>
                            </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            {/* باقي السايدبار: الفصول والمواد بالأعلى */}
        </div>
  <div className="p-4 border-t border-slate-200">
          <form onSubmit={handleAddClass} className="flex flex-col gap-2">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="اسم الفصل الجديد..."
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-[#2E8540] text-white p-2 rounded-lg hover:bg-[#246b33] transition-colors disabled:bg-slate-400"
              disabled={!newClassName.trim()}
            >
              <PlusIcon className="w-5 h-5" />
              <span>إضافة فصل</span>
            </button>
          </form>
        </div>
        {/* مكونات السجل وتصميم السجل في الأسفل */}
        {activeClass && activeSubject && (
          <div className="p-2 border-t border-slate-200">
            {/* Accordion لمكونات السجل */}
            <AccordionComponent activeClass={activeClass} activeSubject={activeSubject} onAddColumn={onAddColumn} onDeleteColumn={onDeleteColumn} />
          </div>
        )}
        {/* مجموعة تنسيق الألوان المستقلة */}
        {activeClass && activeSubject && (
          <div className="p-2 border-t border-slate-200">
            <ColorThemeGroup 
              activeSubject={activeSubject}
              onUpdateThemeColor={onUpdateSubjectThemeColor}
              classId={activeClass.id}
            />
          </div>
        )}
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;