// Drawer for managing classes, subjects, and color themes
import React, { useState, useEffect } from 'react';
import { Class, Subject, ClassType } from '../types';

// Props for the CustomizeDrawer component
interface CustomizeDrawerProps {
  open: boolean;
  onClose: () => void;
  onAddColumn: (columns: { name: string; count: number }[]) => void;
  onColorChange: (color: string, subjectId: string) => void;
  classes: Class[];
  activeClassId: string;
  activeSubjectId: string;
  onEditClass: (cls: Class) => void;
  onDeleteClass: (cls: Class) => void;
  onEditSubject: (cls: Class, sub: Subject) => void;
  onDeleteSubject: (cls: Class, sub: Subject) => void;
  onAddClass: (name: string, type: ClassType) => void;
  onAddSubject: (cls: Class, name: string) => void;
}

// Predefined groups for quick column addition
const recordGroups = [
  {
    label: 'المهام الأدائية',
    options: [
      { name: 'واجبات', defaultCount: 4 },
      { name: 'مشروع', defaultCount: 1 },
      { name: 'مهام أدائية', defaultCount: 4 },
    ]
  },
  {
    label: 'المشاركة والتفاعل',
    options: [
      { name: 'أنشطة صفية', defaultCount: 4 },
      { name: 'مشاركة', defaultCount: 4 },
      { name: 'تطبيقات عملية', defaultCount: 4 },
    ]
  },
  {
    label: 'القرآن الكريم والتجويد',
    options: [
      { name: 'التلاوة', defaultCount: 5 },
      { name: 'الترتيل', defaultCount: 5 },
      { name: 'التحويد', defaultCount: 5 },
      { name: 'طلاقة القراءة', defaultCount: 4 },
      { name: 'الحفظ', defaultCount: 5 },
    ]
  },
  {
    label: 'تطبيقات عملية',
    options: [
      { name: 'لياقة بدنية', defaultCount: 3 },
      { name: 'مهارات حركة', defaultCount: 3 },
    ]
  },
  {
    label: 'اختبار قصير',
    options: [
      { name: 'اختبار قصير', defaultCount: 2 },
    ]
  },
];

// Large color palette for subjects/classes
const groupColors = Array.from(new Set([
  // ألوان زاهية
  '#10b981', '#2563eb', '#f59e42', '#e11d48', '#64748b', '#fbbf24', '#a21caf', '#f472b6',
  '#f87171', '#facc15', '#4ade80', '#22d3ee', '#818cf8', '#c026d3', '#0ea5e9', '#f43f5e',
  '#a3e635', '#fbbf24', '#6366f1', '#14b8a6', '#eab308', '#fca5a5', '#a7f3d0',
  '#fcd34d', '#f9fafb', '#d1fae5', '#f3e8ff', '#fef3c7', '#f1f5f9', '#fde68a', '#7dd3fc',
  '#c7d2fe', '#fbcfe8', '#fef9c3', '#bbf7d0', '#e0e7ff', '#f5d0fe', '#fef2f2',
  '#ffb300', '#ff7043', '#8d6e63', '#789262', '#00bcd4', '#d4e157', '#ff8a65', '#ba68c8',
  '#ffd600', '#ff5252', '#607d8b', '#00e676', '#ff1744', '#b2ff59', '#00bfae', '#ffea00',
  '#ff4081', '#b388ff', '#c51162', '#ffab00', '#cddc39', '#ff6d00', '#aeea00',
  '#00e5ff', '#ff80ab', '#ea80fc', '#b2dfdb', '#ffccbc', '#d7ccc8', '#c8e6c9', '#f0f4c3',
  '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9', '#dcedc8', '#f8bbd0', '#f48fb1', '#ce93d8',
  '#b39ddb', '#9fa8da', '#90caf9', '#81d4fa', '#80deea', '#80cbc4', '#a5d6a7', '#c5e1a5',
  '#e6ee9c', '#fff59d', '#ffe082', '#ffcc80', '#ffab91', '#bcaaa4',
  // درجات الرمادي
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', '#475569', '#334155', '#1e293b', '#0f172a',
  '#eeeeee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121',
  // أبيض صريح
  '#fff', '#fcfcfc', '#f5f5f5', '#fafafa', '#f4f4f5', '#e5e7eb', '#d1d5db', '#9ca3af', '#6b7280', '#374151', '#111827',
]));


const CustomizeDrawer: React.FC<CustomizeDrawerProps> = ({
  open,
  onClose,
  onAddColumn,
  onColorChange,
  classes,
  activeClassId,
  activeSubjectId,
  onEditClass,
  onDeleteClass,
  onEditSubject,
  onDeleteSubject,
  onAddClass,
  onAddSubject
}) => {
  // UI state
  const [expanded, setExpanded] = useState(false); // Toggle for record group section
  const [selected, setSelected] = useState<any>({}); // Selected columns for quick add
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [editingClassName, setEditingClassName] = useState<string>('');
  const [editingClassType, setEditingClassType] = useState<ClassType | null>(null);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editingSubjectName, setEditingSubjectName] = useState<string>('');
  const [newClassName, setNewClassName] = useState('');
  const [newClassType, setNewClassType] = useState<ClassType>('تعليمي');
  const [addingSubjectToClass, setAddingSubjectToClass] = useState<string | null>(null);
  const [collapsedClasses, setCollapsedClasses] = useState<Record<string, boolean>>(() => {
    // Collapse all classes except the active one
    const collapsed: Record<string, boolean> = {};
    classes.forEach((cls) => {
      collapsed[cls.id] = cls.id !== activeClassId;
    });
    return collapsed;
  });
  useEffect(() => {
    // Update collapsed state when active class changes
    setCollapsedClasses(() => {
      const updated: Record<string, boolean> = {};
      classes.forEach(cls => {
        updated[cls.id] = cls.id !== activeClassId;
      });
      return updated;
    });
  }, [activeClassId, classes]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showColorGroup, setShowColorGroup] = useState(false); // Toggle for color palette
  const [selectedColor, setSelectedColor] = useState<string | null>(null); // Currently selected color

  return (
  <div 
      className={`fixed top-0 left-0 w-full h-full bg-black/30 z-[100] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      style={{ direction: 'rtl' }}
    >
  <div 
        className={`fixed top-0 right-0 w-full max-w-md h-full bg-white dark:bg-slate-800 shadow-2xl z-[110] pt-6 px-6 pb-6 overflow-y-auto flex flex-col rounded-s-2xl border-l border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* هيدر مع عنوان وزر الإغلاق */}
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-slate-800 pt-1 pb-3 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">إعدادات التخصيص</h2>
          <button 
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
            aria-label="إغلاق"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
  {/* تم حذف فلاتر الفصل والمادة من السايد بار بناءً على طلب المستخدم */}
        {/* قسم إدارة الفصول والمواد */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 tracking-tight flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5 text-slate-600 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            إدارة الفصول والمواد
          </h3>
          {/* إضافة فصل جديد */}
          <form className="flex flex-col gap-2 mb-4" onSubmit={e => { e.preventDefault(); if (newClassName.trim()) { onAddClass(newClassName.trim(), newClassType); setNewClassName(''); setNewClassType('تعليمي'); } }}>
            <div className="flex gap-2">
              <input type="text" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-400 transition-all" placeholder="اسم الفصل الجديد..." value={newClassName} onChange={e => setNewClassName(e.target.value)} />
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-slate-400 text-sm font-semibold shadow-sm transition-all" disabled={!newClassName.trim()}>إضافة فصل</button>
            </div>
            <div className="flex gap-4 items-center mt-1">
              <label className="flex items-center gap-1 text-sm font-medium">
                <input type="radio" name="classType" value="تعليمي" checked={newClassType === 'تعليمي'} onChange={() => setNewClassType('تعليمي')} />
                تعليمي
              </label>
              <label className="flex items-center gap-1 text-sm font-medium">
                <input type="radio" name="classType" value="إداري" checked={newClassType === 'إداري'} onChange={() => setNewClassType('إداري')} />
                إداري
              </label>
            </div>
          </form>
            <div className="space-y-2">
            {Array.isArray(classes) && classes.length === 0 && (
              <div className="text-center text-slate-400 text-sm">لا توجد فصول بعد.</div>
            )
            }
            {Array.isArray(classes) && classes.map((cls: Class, idx: number) => {
              const classColor = groupColors[idx % groupColors.length];
              const isCollapsed = collapsedClasses[cls.id];
              return (
                <div key={cls.id} className="rounded-xl p-3 shadow-sm border border-slate-200 bg-white/80 transition-all" style={{ boxShadow: '0 2px 8px -2px #0001', backgroundColor: classColor + '11' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCollapsedClasses(prev => ({ ...prev, [cls.id]: !prev[cls.id] }))}>
                      {editingClassId === cls.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            className="font-bold px-3 py-1.5 rounded-lg text-base shadow-sm bg-white border border-emerald-400 text-slate-900"
                            style={{ minWidth: 80, backgroundColor: classColor + '22' }}
                            value={editingClassName}
                            autoFocus
                            onChange={e => setEditingClassName(e.target.value)}
                          />
                          <select
                            className="px-2 py-1 rounded-lg border border-slate-300 text-sm bg-white text-slate-700"
                            value={editingClassType ?? cls.type}
                            onChange={e => setEditingClassType(e.target.value as ClassType)}
                          >
                            <option value="تعليمي">تعليمي</option>
                            <option value="إداري">إداري</option>
                          </select>
                          <button className="text-emerald-600 hover:bg-emerald-100 rounded-full p-1" title="حفظ" onClick={e => { e.stopPropagation(); if ((editingClassName.trim() && editingClassName !== cls.name) || (editingClassType && editingClassType !== cls.type)) { onEditClass({ ...cls, name: editingClassName.trim(), type: editingClassType ?? cls.type }); } setEditingClassId(null); setEditingClassType(null); }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                          </button>
                          <button className="text-red-500 hover:bg-red-100 rounded-full p-1" title="إلغاء" onClick={e => { e.stopPropagation(); setEditingClassId(null); }}>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 text-base shadow-sm" style={{ backgroundColor: classColor, color: '#fff' }}>
                          {cls.name}
                          <span className="px-2 py-0.5 rounded bg-white/70 text-emerald-700 text-xs font-normal border border-emerald-200" style={{direction:'rtl'}}>{cls.type}</span>
                          <span style={{fontSize: '1.1em'}}>{isCollapsed ? '▼' : '▲'}</span>
                        </span>
                      )}
                    </div>
                    {/* أزرار إدارة الفصل: إضافة مادة، تعديل، حذف */}
                    <div className="flex gap-1 items-center">
                      <button className="p-1 rounded-full hover:bg-emerald-100 transition-all" title="إضافة مادة" onClick={e => { e.stopPropagation(); setAddingSubjectToClass(cls.id); }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                      </button>
                      <button className="p-1 rounded-full hover:bg-slate-200 transition-all" title="تعديل الفصل" onClick={e => { e.stopPropagation(); setEditingClassId(cls.id); setEditingClassName(cls.name); setEditingClassType(cls.type); }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z"></path></svg>
                      </button>
                      <button className="p-1 rounded-full hover:bg-red-100/80 hover:ring-2 hover:ring-red-400 transition-all" title="حذف الفصل" onClick={e => { e.stopPropagation(); onDeleteClass(cls); }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                  {/* إضافة مادة جديدة لهذا الفصل */}
                  {!isCollapsed && addingSubjectToClass === cls.id && (
                    <form className="flex gap-2 mb-2" onSubmit={e => { e.preventDefault(); if (newSubjectName.trim()) { onAddSubject(cls, newSubjectName.trim()); setNewSubjectName(''); setAddingSubjectToClass(null); } }}>
                      <input type="text" className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-400 transition-all" placeholder="اسم المادة الجديدة..." value={newSubjectName} onChange={e => setNewSubjectName(e.target.value)} autoFocus />
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-slate-400 text-sm font-semibold shadow-sm transition-all" disabled={!newSubjectName.trim()}>إضافة مادة</button>
                      <button type="button" className="bg-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-300 text-sm font-semibold transition-all" onClick={() => { setAddingSubjectToClass(null); setNewSubjectName(''); }}>إلغاء</button>
                    </form>
                  )}
                  {/* قائمة المواد بدون أزرار الألوان */}
                  {!isCollapsed && (
                    <div className="ps-4 space-y-1">
                      {Array.isArray(cls.subjects) && cls.subjects.length > 0 ? (
                        cls.subjects.map((sub: Subject, sidx: number) => {
                          const subjectColor = sub.themeColor || groupColors[(idx * 7 + sidx * 3) % groupColors.length];
                          return (
                            <div key={sub.id} className="flex items-center justify-between text-sm rounded-lg shadow-sm border border-slate-200 bg-white/80 my-1 px-2 py-1 transition-all" style={{ backgroundColor: subjectColor + '11' }}>
                              {editingSubjectId === sub.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    className="font-semibold px-3 py-1 rounded-lg text-sm shadow-sm bg-white border border-emerald-400 text-slate-900"
                                    style={{ minWidth: 60, backgroundColor: subjectColor + '22' }}
                                    value={editingSubjectName}
                                    autoFocus
                                    onChange={e => setEditingSubjectName(e.target.value)}
                                  />
                                  <button className="text-emerald-600 hover:bg-emerald-100 rounded-full p-1" title="حفظ" onClick={e => { e.stopPropagation(); if (editingSubjectName.trim() && editingSubjectName !== sub.name) { onEditSubject(cls, { ...sub, name: editingSubjectName.trim() }); } setEditingSubjectId(null); }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                                  </button>
                                  <button className="text-red-500 hover:bg-red-100 rounded-full p-1" title="إلغاء" onClick={e => { e.stopPropagation(); setEditingSubjectId(null); }}>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              ) : (
                                <span className="font-semibold px-3 py-1 rounded-lg text-sm shadow-sm" style={{ backgroundColor: subjectColor, color: '#fff' }}>{sub.name}</span>
                              )}
                              <span className="flex gap-1 items-center">
                                <button className="p-1 rounded-full hover:bg-slate-200 transition-all" title="تعديل المادة" onClick={() => { setEditingSubjectId(sub.id); setEditingSubjectName(sub.name); }}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 01.828-1.414z"></path></svg></button>
                                <button className="p-1 rounded-full hover:bg-red-100/80 hover:ring-2 hover:ring-red-400 transition-all" title="حذف المادة" onClick={() => onDeleteSubject(cls, sub)}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"></path></svg></button>
                              </span>
                            </div>
                          );
                        })
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* مكونات السجل بعد الفصول والمواد */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 tracking-tight flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5 text-slate-600 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            مكونات السجل
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setExpanded(v => !v)}
              className="w-full py-3 px-4 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-600 text-right transition-all flex items-center justify-between font-semibold shadow-sm"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                إضافة أعمدة سريعة
              </span>
              <span className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>▶</span>
            </button>
            {expanded && (
              <div className="mt-2 flex flex-col gap-3 border border-slate-200 rounded-lg p-3 bg-slate-50 max-h-[400px] overflow-y-auto shadow-sm">
                {recordGroups.map((group, idx) => (
                  <div key={group.label} className="mb-2 p-2 rounded-lg shadow-sm" style={{backgroundColor: groupColors[idx % groupColors.length], color: '#fff'}}>
                    <div className="font-semibold mb-2 text-base">{group.label}</div>
                    <div className="flex flex-col gap-1">
                      {group.options.map(opt => (
                        <label key={opt.name} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            checked={!!selected[opt.name]?.checked}
                            onChange={e => {
                              setSelected((prev: any) => {
                                const prevCount = prev[opt.name]?.count;
                                return {
                                  ...prev,
                                  [opt.name]: {
                                    checked: e.target.checked,
                                    count: prevCount !== undefined ? prevCount : opt.defaultCount
                                  }
                                };
                              });
                            }}
                          />
                          {opt.name}
                          {selected[opt.name]?.checked && (
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={selected[opt.name]?.count || opt.defaultCount}
                              onChange={e => {
                                const val = Math.max(1, Math.min(20, Number(e.target.value)));
                                setSelected((prev: any) => ({
                                  ...prev,
                                  [opt.name]: {
                                    ...prev[opt.name],
                                    count: val
                                  }
                                }));
                              }}
                              className="w-12 px-1 py-0.5 border border-slate-300 rounded-lg text-xs text-center ml-2 text-slate-800"
                              style={{direction:'ltr'}}
                            />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  className="mt-2 w-full py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-semibold shadow-sm transition-all"
                  onClick={() => {
                    const cols = Object.entries(selected as Record<string, {checked: boolean, count: number}>)
                      .filter(([_, v]) => v.checked)
                      .map(([name, v]) => ({ name, count: v.count }));
                    onAddColumn(cols);
                    setExpanded(false);
                    setSelected({});
                  }}
                  disabled={Object.values(selected).filter((v: any) => v.checked).length === 0}
                >
                  إضافة
                </button>
              </div>
            )}
          </div>
        </div>


        {/* مجموعة تنسيق الألوان المستقلة (تفاعلية) */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-slate-800 dark:text-slate-100 tracking-tight flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5 text-slate-600 dark:text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
            </svg>
            ألوان المادة
          </h3>
          <button
            className="w-full py-3 px-4 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-600 text-right transition-all flex items-center justify-between font-semibold shadow-sm"
            onClick={() => setShowColorGroup(v => !v)}
            type="button"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
              </svg>
              اختيار لون المادة
            </span>
            <span className={`transition-transform ${showColorGroup ? 'rotate-90' : ''}`}>▶</span>
          </button>
          {showColorGroup && (
            <div className="mt-2 flex flex-wrap gap-2 border border-slate-200 rounded-lg p-3 bg-slate-50 shadow-sm">
              {groupColors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 mb-1 focus:outline-none transition-all ${selectedColor === color ? 'ring-2 ring-emerald-500 border-emerald-600' : 'border-slate-300'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color);
                    if (activeSubjectId) onColorChange(color, activeSubjectId);
                  }}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CustomizeDrawer;

