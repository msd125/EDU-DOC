import React, { useState } from 'react';
import { Class, Subject, ColumnType } from '../types';
import { 
    ChevronDownIcon, ChevronUpIcon, XIcon, PlusIcon, 
    BookOpenIcon, CheckIcon, PlusCircleIcon, EditIcon, TrashIcon
} from './Icons';

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

const THEME_COLORS = ['#2E8540', '#0d6efd', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#198754', '#20c997', '#0dcaf0', '#6c757d', '#343a40'];

const ReportTheme: React.FC<{
  activeSubject: Subject;
  onUpdateThemeColor: (classId: string, subjectId: string, color: string) => void;
  classId: string;
}> = ({ activeSubject, onUpdateThemeColor, classId }) => {
    return (
        <div className="p-2 space-y-2 border-t border-slate-200 dark:border-slate-700 mt-2">
            <h3 className="text-sm font-bold px-2 text-slate-700 dark:text-slate-300">تصميم السجل</h3>
            <div className="px-2 pt-1">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">اختر لوناً لتمييز رأس الجدول في التقارير.</p>
                <div className="flex flex-wrap gap-2">
                    {THEME_COLORS.map(color => (
                        <button
                            key={color}
                            onClick={() => onUpdateThemeColor(classId, activeSubject.id, color)}
                            className={'w-7 h-7 rounded-full cursor-pointer transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex items-center justify-center ' + (activeSubject.themeColor === color ? 'ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-emerald-500' : 'ring-1 ring-slate-300 dark:ring-slate-600')}
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
        </div>
    );
};


const ReportBuilder: React.FC<{
  activeClass: Class;
  activeSubject: Subject;
  onAddColumn: (classId: string, subjectId: string, name: string, type: ColumnType) => void;
  onDeleteColumn: (classId: string, subjectId: string, columnId: string, columnName: string, skipConfirm: boolean) => void;
}> = ({ activeClass, activeSubject, onAddColumn, onDeleteColumn }) => {
  const [openCategory, setOpenCategory] = useState<string | null>(assessmentCategories[0].title);

  const handleToggle = (itemName: string, isChecked: boolean) => {
    if (isChecked) {
      const existingColumn = activeSubject.columns.find(c => c.name === itemName);
      if(existingColumn) {
         onDeleteColumn(activeClass.id, activeSubject.id, existingColumn.id, existingColumn.name, true);
      }
    } else {
      onAddColumn(activeClass.id, activeSubject.id, itemName, ColumnType.NUMBER);
    }
  };

  return (
    <div className="p-2 space-y-2 border-t border-slate-200 dark:border-slate-700 mt-2">
      <h3 className="text-sm font-bold px-2 text-slate-700 dark:text-slate-300">مكونات السجل</h3>
      {assessmentCategories.map(category => {
        const isOpen = openCategory === category.title;
        return (
          <div key={category.title}>
            <button 
              onClick={() => setOpenCategory(isOpen ? null : category.title)}
              className="w-full flex justify-between items-center p-2 text-sm text-right rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors focus:outline-none"
            >
              <span className="font-semibold">{category.title}</span>
              {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {isOpen && (
              <div className="p-2 space-y-2">
                {category.items.map(item => {
                  const existingColumn = activeSubject.columns.find(c => c.name === item.name);
                  const isChecked = !!existingColumn;
                  return (
                    <label key={item.name} className="flex items-center p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(item.name, isChecked)}
                        className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                      />
                      <span className="ms-3 text-sm">{item.name}</span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  activeClassId: string | null;
  activeSubjectId: string | null;
  onSelectClass: (id: string) => void;
  onSelectSubject: (id: string) => void;
  onAddClass: (name: string) => void;
  onEditClass: (id: string, newName: string) => void;
  onDeleteClass: (id: string, name: string) => void;
  onAddSubject: (classId: string, name: string) => void;
  onEditSubject: (classId: string, subjectId: string, newName: string) => void;
  onDeleteSubject: (classId: string, subjectId: string, name: string) => void;
  onUpdateSubjectThemeColor: (classId: string, subjectId: string, color: string) => void;
  onAddColumn: (classId: string, subjectId: string, name: string, type: ColumnType, options?: string[]) => void;
  onDeleteColumn: (classId: string, subjectId: string, columnId: string, columnName: string, skipConfirm?: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    isOpen, onClose,
    classes, activeClassId, activeSubjectId, onSelectClass, onSelectSubject, 
    onAddClass, onEditClass, onDeleteClass, 
    onAddSubject, onEditSubject, onDeleteSubject, onUpdateSubjectThemeColor,
    onAddColumn, onDeleteColumn
}) => {
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState<{id: string, name: string} | null>(null);
  const [editingSubject, setEditingSubject] = useState<{id: string, name: string} | null>(null);
  const [addingSubjectToClass, setAddingSubjectToClass] = useState<string | null>(null);
  const [newSubjectName, setNewSubjectName] = useState('');

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

  return (
    <React.Fragment>
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

  <aside className={'fixed inset-y-0 right-0 w-full max-w-xs sm:w-64 bg-white dark:bg-slate-800 shadow-lg flex flex-col h-full border-s-2 border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out z-40 ' + (isOpen ? 'translate-x-0' : 'translate-x-full')}>
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-bold">الفصول والمواد الدراسية</h2>
          <button onClick={onClose} className="p-2 sm:p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 text-lg">
            <XIcon className="w-6 h-6 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
            <nav className="p-2 space-y-1">
              {classes.map((c) => (
                <div key={c.id} className={'rounded-lg transition-all duration-200 ' + (activeClassId === c.id ? 'bg-slate-100 dark:bg-slate-900/50' : '')}>
                  {/* Class Item */}
                  <div
                    onClick={() => onSelectClass(c.id)}
                    className={'flex items-center p-3 cursor-pointer group rounded-t-lg text-xs sm:text-sm ' + (activeClassId === c.id ? 'font-bold' : '')}
                  >
                    <ChevronDownIcon className={'w-5 h-5 me-2 transition-transform ' + (activeClassId === c.id ? 'rotate-0' : '-rotate-90')} />
                    {editingClass?.id === c.id ? (
                        <div className="w-full flex items-center gap-1">
                            <input type="text" value={editingClass.name} onChange={e => setEditingClass({...editingClass, name: e.target.value})} className="w-full p-1 border rounded dark:bg-slate-600 dark:border-slate-500" autoFocus onBlur={handleSaveClassEdit} onKeyDown={e => e.key === 'Enter' && handleSaveClassEdit()}/>
                            <button onClick={e => {e.stopPropagation(); handleSaveClassEdit();}} className="p-1 rounded-full hover:bg-green-500/20"><CheckIcon className="w-5 h-5 text-green-600"/></button>
                            <button onClick={e => {e.stopPropagation(); setEditingClass(null)}} className="p-1 rounded-full hover:bg-red-500/20"><XIcon className="w-5 h-5 text-red-600"/></button>
                        </div>
                    ) : (
                        <React.Fragment>
                          <span className="flex-1">{c.name}</span>
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={(e) => { e.stopPropagation(); setAddingSubjectToClass(c.id); setNewSubjectName(''); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="إضافة مادة"><PlusCircleIcon className="w-4 h-4" /></button>
                               <button onClick={(e) => { e.stopPropagation(); setEditingClass({id: c.id, name: c.name}); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="تعديل الفصل"><EditIcon className="w-4 h-4" /></button>
                               <button onClick={(e) => { e.stopPropagation(); onDeleteClass(c.id, c.name); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="حذف الفصل"><TrashIcon className="w-4 h-4" /></button>
                          </div>
                        </React.Fragment>
                    )}
                  </div>
                  {/* Subjects List */}
                  {activeClassId === c.id && (
                    <div className="ps-6 pe-2 pb-2 space-y-1">
                        {c.subjects.map(s => {
                            const isActive = activeSubjectId === s.id;
                            return (
                                <div
                                    key={s.id}
                                    onClick={() => onSelectSubject(s.id)}
                                    className={'flex items-center p-2 rounded-md transition-all duration-200 group cursor-pointer border-r-4 text-xs sm:text-sm ' + (
                                      isActive
                                      ? 'bg-slate-200/50 dark:bg-slate-700 font-semibold'
                                      : 'border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                                    )}
                                    style={{ borderColor: isActive ? s.themeColor || '#2E8540' : 'transparent' }}
                                >
                                   {editingSubject?.id === s.id ? (
                                       <div className="w-full flex items-center gap-1">
                                          <input type="text" value={editingSubject.name} onChange={e => setEditingSubject({...editingSubject, name: e.target.value})} className="w-full p-1 border rounded text-slate-800 dark:bg-slate-600 dark:border-slate-500" autoFocus onBlur={()=>handleSaveSubjectEdit(c.id)} onKeyDown={e => e.key === 'Enter' && handleSaveSubjectEdit(c.id)}/>
                                          <button onClick={e => {e.stopPropagation(); handleSaveSubjectEdit(c.id);}} className="p-1 rounded-full hover:bg-green-500/20"><CheckIcon className="w-5 h-5 text-green-500"/></button>
                                          <button onClick={e => {e.stopPropagation(); setEditingSubject(null)}} className="p-1 rounded-full hover:bg-red-500/20"><XIcon className="w-5 h-5 text-red-500"/></button>
                                       </div>
                                   ) : (
                                      <React.Fragment>
                                          <BookOpenIcon className={'w-4 h-4 me-2 ' + (isActive ? '' : 'text-slate-500')}/>
                                          <span className="flex-1 text-xs sm:text-sm">{s.name}</span>
                                          <div className={'flex items-center opacity-0 group-hover:opacity-100 transition-opacity ' + (isActive ? 'text-slate-600 dark:text-slate-300' : '')}>
                                              <button onClick={(e) => { e.stopPropagation(); setEditingSubject({id: s.id, name: s.name}); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="تعديل المادة"><EditIcon className="w-4 h-4" /></button>
                                              <button onClick={(e) => { e.stopPropagation(); onDeleteSubject(c.id, s.id, s.name); }} className="p-1 rounded-full hover:bg-black/20" data-tooltip="حذف المادة"><TrashIcon className="w-4 h-4" /></button>
                                          </div>
                                      </React.Fragment>
                                   )}
                                </div>
                            )
                        })}
                        {addingSubjectToClass === c.id && (
                            <div className="flex items-center gap-1 p-2">
                                <input type="text" value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} placeholder="اسم المادة الجديدة" className="w-full p-2 sm:p-1 text-xs sm:text-sm border rounded dark:bg-slate-600 dark:border-slate-500" autoFocus onKeyDown={e => e.key === 'Enter' && handleAddSubject(c.id)} />
                                <button onClick={() => handleAddSubject(c.id)} className="p-1 rounded-full hover:bg-green-500/20"><CheckIcon className="w-5 h-5 text-green-600"/></button>
                                <button onClick={() => setAddingSubjectToClass(null)} className="p-1 rounded-full hover:bg-red-500/20"><XIcon className="w-5 h-5 text-red-600"/></button>
                            </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            {activeClass && activeSubject && (
                <React.Fragment>
                    <ReportBuilder 
                        activeClass={activeClass} 
                        activeSubject={activeSubject} 
                        onAddColumn={onAddColumn}
                        onDeleteColumn={onDeleteColumn}
                    />
                    <ReportTheme 
                        activeSubject={activeSubject}
                        onUpdateThemeColor={onUpdateSubjectThemeColor}
                        classId={activeClass.id}
                    />
                </React.Fragment>
            )}
        </div>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 mt-auto">
          <form onSubmit={handleAddClass} className="flex flex-col gap-2">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="اسم الفصل الجديد..."
              className="w-full p-2 border border-slate-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 bg-[#2E8540] text-white p-2 rounded-lg hover:bg-[#246b33] transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600"
              disabled={!newClassName.trim()}
            >
              <PlusIcon className="w-5 h-5" />
              <span>إضافة فصل</span>
            </button>
          </form>
        </div>
      </aside>
    </React.Fragment>
  );
};

export default Sidebar;