import { Toaster, toast } from 'react-hot-toast';
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Class, ColumnType, Column, Student, Template } from './types';
import StudentTableSimple from './components/StudentTableSimple';
import StudentDataView from './components/StudentDataView';
import CustomizeDrawer from './components/CustomizeDrawer';
import Header from './components/Header';
import AddStudentModal from './components/AddStudentModal';
import AddClassModal from './components/AddClassModal';
import AddColumnModal from './components/AddColumnModal';
import AddSubjectModal from './components/AddSubjectModal';
import ImportStudentsModal from './components/ImportStudentsModal';
import SettingsModal from './components/SettingsModal';
import ConfirmModal from './components/ConfirmModal';
import ApiKeyModal from './components/ApiKeyModal';
import SaveTemplateModal from './components/SaveTemplateModal';
import UseTemplateModal from './components/UseTemplateModal';
import ExportTemplateModal from './components/ExportTemplateModal';
import ImportTemplateModal from './components/ImportTemplateModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import WhatsNewModal from './components/WhatsNewModal';
import Login from './components/Login';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => sessionStorage.getItem('gradebook-user'));
  // مراقبة sessionStorage لتحديث المستخدم تلقائياً بعد الاستيراد
  useEffect(() => {
    const interval = setInterval(() => {
      const user = sessionStorage.getItem('gradebook-user');
      setCurrentUser(prev => (prev !== user ? user : prev));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const userSettingsKey = 'student-gradebook-settings-' + currentUser;
  const userClassesKey = 'student-gradebook-classes-' + currentUser;
  
  // القيمة الافتراضية للمستخدمين الجدد فقط
  const getDefaultSettings = (): Settings => ({
    schoolName: 'مدرستي',
    teacherName: 'اسمي',
    principalName: 'اسم المدير',
    educationDirectorate: 'إدارة التعليم بمنطقة...',
    academicYear: `${new Date().getFullYear()}`,
    semester: 'الفصل الدراسي الأول',
  });
  
  const [settings, setSettings] = useLocalStorage<Settings>(userSettingsKey, getDefaultSettings());
  
  // تحديث لمرة واحدة فقط للمستخدمين الذين لديهم القيمة القديمة
  useEffect(() => {
    if (settings.academicYear === '1445هـ') {
      setSettings(prev => ({ ...prev, academicYear: new Date().getFullYear().toString() }));
    }
  }, []); // يعمل مرة واحدة فقط عند التحميل
  
  const [classes, setClasses] = useLocalStorage<Class[]>(userClassesKey, []);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{ message: string; onConfirm: () => void; confirmLabel?: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('gemini-api-key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showUseTemplateModal, setShowUseTemplateModal] = useState(false);
  const [showExportTemplateModal, setShowExportTemplateModal] = useState(false);
  const [showImportTemplateModal, setShowImportTemplateModal] = useState(false);
  const [templateToExport, setTemplateToExport] = useState<Template | null>(null);
  const [templates, setTemplates] = useLocalStorage<Template[]>('column-templates-' + currentUser, []);
  const availableColors = [
    '#10b981', '#2563eb', '#f59e42', '#e11d48', '#64748b', '#fbbf24', '#a21caf', '#f472b6',
    '#f87171', '#facc15', '#4ade80', '#22d3ee', '#818cf8', '#c026d3', '#0ea5e9', '#f43f5e',
    '#a3e635', '#f472b6', '#fbbf24', '#6366f1', '#14b8a6', '#eab308', '#fca5a5', '#a7f3d0',
    '#fcd34d', '#f9fafb', '#d1fae5', '#f3e8ff', '#fef3c7', '#f1f5f9', '#fde68a', '#7dd3fc',
    '#c7d2fe', '#fbcfe8', '#fef9c3', '#bbf7d0', '#e0e7ff', '#f5d0fe', '#fef2f2', '#e0e7ff',
    '#f3e8ff', '#fef3c7', '#f1f5f9', '#fbbf24', '#f59e42', '#a21caf', '#e11d48', '#2563eb',
    '#10b981', '#64748b', '#f472b6', '#f87171', '#facc15', '#4ade80', '#22d3ee', '#818cf8',
    '#c026d3', '#0ea5e9', '#f43f5e', '#a3e635', '#fbbf24', '#6366f1', '#14b8a6', '#eab308',
    '#fca5a5', '#a7f3d0', '#fcd34d', '#f9fafb', '#d1fae5', '#f3e8ff', '#fef3c7', '#f1f5f9',
    '#fde68a', '#7dd3fc', '#c7d2fe', '#fbcfe8', '#fef9c3', '#bbf7d0', '#e0e7ff', '#f5d0fe',
    '#fef2f2', '#e0e7ff', '#f3e8ff', '#fef3c7', '#f1f5f9',
    '#ffb300', '#ff7043', '#8d6e63', '#789262', '#00bcd4', '#d4e157', '#ff8a65', '#ba68c8',
    '#ffd600', '#ff5252', '#607d8b', '#00e676', '#ff1744', '#b2ff59', '#00bfae', '#ffea00',
    '#ff4081', '#b388ff', '#c51162', '#00bcd4', '#ffab00', '#cddc39', '#ff6d00', '#aeea00',
    '#00e5ff', '#ff80ab', '#ea80fc', '#b2dfdb', '#ffccbc', '#d7ccc8', '#c8e6c9', '#f0f4c3',
    '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9', '#dcedc8', '#f8bbd0', '#f48fb1', '#ce93d8',
    '#b39ddb', '#9fa8da', '#90caf9', '#81d4fa', '#80deea', '#80cbc4', '#a5d6a7', '#c5e1a5',
    '#e6ee9c', '#fff59d', '#ffe082', '#ffcc80', '#ffab91', '#bcaaa4', '#eeeeee', '#bdbdbd',
    '#9e9e9e', '#757575', '#616161', '#424242', '#212121',
    '#fff', '#000'
  ];
  const colorStorageKey = 'student-gradebook-color-' + (currentUser || 'default');
  const [pendingColor, setPendingColor] = useState<string | null>(null);
  const [activeClassId, setActiveClassId] = useState(() => {
    const saved = localStorage.getItem('activeClassId');
    if (saved && classes.find(c => c.id === saved)) return saved;
    return classes.length > 0 ? classes[0].id : '';
  });
  const [activeSubjectId, setActiveSubjectId] = useState<string>('');
  
  // تم دمج وظائف التصدير في قسم --- Handlers --- لاحقًا
  // عند تغيير الفصول أو حذف فصل، تأكد أن activeClassId صالح
  useEffect(() => {
    if (classes.length > 0 && !classes.find(c => c.id === activeClassId)) {
      setActiveClassId(classes[0].id);
    }
  }, [classes]);

  // حفظ activeClassId في localStorage عند تغييره
  useEffect(() => {
    if (activeClassId) {
      localStorage.setItem('activeClassId', activeClassId);
    }
  }, [activeClassId]);
  const activeClass = classes.find(c => c.id === activeClassId) || null;
  useEffect(() => {
    if (activeClass && activeClass.subjects.length > 0) {
      if (!activeClass.subjects.find(s => s.id === activeSubjectId)) {
        setActiveSubjectId(activeClass.subjects[0].id);
      }
    } else {
      setActiveSubjectId('');
    }
  
  // Funciones para manejar las plantillas

  }, [activeClass]);
  const activeSubject = activeClass && activeClass.subjects.length > 0 ? activeClass.subjects.find(s => s.id === activeSubjectId) || activeClass.subjects[0] : null;
  const studentDataViewRef = useRef<any>(null);

  // --- Handlers ---
  const handleExportExcel = () => {
    if (studentDataViewRef.current && typeof studentDataViewRef.current.exportExcel === 'function') {
      studentDataViewRef.current.exportExcel();
    } else {
      toast.error('تعذر تصدير Excel.');
    }
  };
  const handleExportPdf = () => {
    if (studentDataViewRef.current && typeof studentDataViewRef.current.exportPdf === 'function') {
      studentDataViewRef.current.exportPdf();
    } else {
      toast.error('تعذر تصدير PDF.');
    }
  };
  const addStudent = (classId: string, name: string) => {
    setClasses((prev: Class[]) => prev.map((c: Class) => c.id === classId ? {
      ...c,
      students: [...c.students, { id: Date.now().toString() + '-' + Math.random(), name, records: {} }]
    } : c));
    toast.success('تمت إضافة الطالب بنجاح.');
  };
  const deleteStudent = (classId: string, studentId: string, studentName: string = '') => {
    setConfirmation({
      message: `هل أنت متأكد من حذف ${studentName || 'هذا الشخص'}؟`,
      onConfirm: () => {
        setClasses((prev: Class[]) => prev.map((c: Class) => c.id === classId ? {
          ...c,
          students: c.students.filter((s: Student) => s.id !== studentId)
        } : c));
        toast.success(`تم حذف ${studentName || 'الشخص'} بنجاح.`);
        setConfirmation(null);
      }
    });
  };
  const fillColumn = (classId: string, _subjectId: string, columnId: string, value: any) => {
    setClasses((prev: Class[]) => prev.map((c: Class) => {
      if (c.id !== classId) return c;
      return {
        ...c,
        students: c.students.map((s: Student) => ({
          ...s,
          records: { ...s.records, [columnId]: value }
        }))
      };
    }));
    toast.success('تم تعبئة العمود بنجاح.');
  };
  const addColumn = (classId: string, subjectId: string, name: string, type: ColumnType, options?: string[]) => {
    setClasses((prev: Class[]) => prev.map((c: Class) => c.id === classId ? {
      ...c,
      subjects: c.subjects.map((s: any) => s.id === subjectId ? {
        ...s,
        columns: [...s.columns, { id: Date.now().toString() + '-' + Math.random(), name, type, options }]
      } : s)
    } : c));
    toast.success('تمت إضافة العمود بنجاح.');
  };
  const deleteColumn = (classId: string, subjectId: string, columnId: string, columnName?: string) => {
    setConfirmation({
      message: `هل أنت متأكد من حذف العمود "${columnName || ''}"؟ سيتم حذف جميع بيانات هذا العمود للطلاب.`,
      confirmLabel: 'تأكيد الحذف',
      onConfirm: () => {
        setClasses((prev: Class[]) => prev.map((c: Class) => {
          if (c.id !== classId) return c;
          const updatedSubjects = c.subjects.map((s: any) => {
            if (s.id !== subjectId) return s;
            return { ...s, columns: s.columns.filter((col: any) => col.id !== columnId) };
          });
          const updatedStudents = c.students.map((student: Student) => {
            const newRecords = { ...student.records };
            delete newRecords[columnId];
            return { ...student, records: newRecords };
          });
          return { ...c, subjects: updatedSubjects, students: updatedStudents };
        }));
        toast.success('تم حذف العمود بنجاح.');
        setConfirmation(null);
      }
    });
  };
  const editColumn = (classId: string, subjectId: string, columnId: string, updatedData: { name?: string }) => {
    setClasses((prev: Class[]) => prev.map((c: Class) => c.id === classId ? {
      ...c,
      subjects: c.subjects.map((s: any) => s.id === subjectId ? {
        ...s,
        columns: s.columns.map((col: any) => col.id === columnId ? { ...col, ...updatedData } : col)
      } : s)
    } : c));
    if (updatedData.name) toast.success('تم تعديل اسم العمود.');
  };
  const importStudents = (classId: string, subjectId: string, importedData: any[], studentNameColumn: string, columnsToImport: { header: string, type: ColumnType, options?: string[] }[]) => {
    setClasses((prev: Class[]) => prev.map((c: Class) => {
      if (c.id !== classId) return c;
      const newColumns: Column[] = columnsToImport.map(colInfo => ({
        id: Date.now().toString() + '-' + Math.random(),
        name: colInfo.header,
        type: colInfo.type,
        options: colInfo.options,
      }));
      const newColumnMap: { [header: string]: string } = {};
      newColumns.forEach(col => {
        newColumnMap[col.name] = col.id;
      });
      const updatedSubjects = c.subjects.map((s: any) => {
        if (s.id !== subjectId) return s;
        return { ...s, columns: [...s.columns, ...newColumns] };
      });
      let studentsToUpdate = [...c.students];
      const newStudents: Student[] = [];
      importedData.forEach(row => {
        const studentName = row[studentNameColumn]?.toString().trim();
        if (!studentName) return;
        const newRecords: Record<string, any> = {};
        columnsToImport.forEach(colInfo => {
          const columnId = newColumnMap[colInfo.header];
          if (columnId) {
            const value = row[colInfo.header];
            if (colInfo.type === ColumnType.NUMBER) {
              const parsed = parseFloat(value);
              newRecords[columnId] = isNaN(parsed) ? null : parsed;
            } else {
              newRecords[columnId] = value ?? null;
            }
          }
        });
        const existingStudentIndex = studentsToUpdate.findIndex(s => s.name === studentName);
        if (existingStudentIndex > -1) {
          const existingStudent = studentsToUpdate[existingStudentIndex];
          studentsToUpdate[existingStudentIndex] = {
            ...existingStudent,
            records: { ...existingStudent.records, ...newRecords }
          };
        } else {
          newStudents.push({
            id: Date.now().toString() + '-' + Math.random(),
            name: studentName,
            records: newRecords,
          });
        }
      });
      return { ...c, subjects: updatedSubjects, students: [...studentsToUpdate, ...newStudents] };
    }));
    toast.success('تم استيراد ' + importedData.length + ' سجل بنجاح.');
  };
  const handleSaveApiKey = (key: string) => {
    if (key) {
      sessionStorage.setItem('gemini-api-key', key);
      setApiKey(key);
      toast.success('تم حفظ مفتاح API بنجاح.');
    } else {
      sessionStorage.removeItem('gemini-api-key');
      setApiKey(null);
    }
    setIsApiKeyModalOpen(false);
  };
  
  // Funciones para manejar plantillas
  const handleSaveTemplate = (templateName: string, description: string, isPublic: boolean) => {
    if (!activeClass || !activeSubjectId) {
      toast.error('يرجى تحديد فصل ومادة أولاً');
      return;
    }
    
    const subject = activeClass.subjects.find(s => s.id === activeSubjectId);
    if (!subject || !subject.columns.length) {
      toast.error('لا توجد أعمدة لحفظها كقالب');
      return;
    }
    
    const newTemplate: Template = {
      id: `template-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: templateName,
      description: description,
      columns: [...subject.columns],
      isPublic: isPublic,
      isOwner: true,
      ownerName: settings.teacherName || 'معلم',
      columnCount: subject.columns.length,
      createdAt: Date.now(),
    };
    
    setTemplates(prev => [newTemplate, ...prev]);
    toast.success('تم حفظ القالب بنجاح');
    setShowSaveTemplateModal(false);
  };
  
  const handleUseTemplate = (templateId: string) => {
    if (!activeClass || !activeSubjectId) {
      toast.error('يرجى تحديد فصل ومادة أولاً');
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      toast.error('لم يتم العثور على القالب');
      return;
    }
    
    const subject = activeClass.subjects.find(s => s.id === activeSubjectId);
    if (subject && subject.columns.length > 0) {
      setConfirmation({
        message: 'سيتم استبدال الأعمدة الحالية بأعمدة القالب. هل تريد المتابعة؟',
        onConfirm: () => {
          applyTemplateToSubject(template);
          setConfirmation(null);
        },
        confirmLabel: 'متابعة'
      });
    } else {
      applyTemplateToSubject(template);
    }
    
    setShowUseTemplateModal(false);
  };
  
  // وظائف استيراد وتصدير القوالب وإدارة القوالب
  const handleExportTemplate = (template: Template) => {
    setTemplateToExport(template);
    setShowExportTemplateModal(true);
  };
  
  // وظيفة تعديل اسم القالب
  const handleRenameTemplate = (templateId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('لا يمكن أن يكون اسم القالب فارغًا');
      return;
    }
    
    setTemplates(prevTemplates => 
      prevTemplates.map(template => 
        template.id === templateId 
          ? { ...template, name: newName.trim() } 
          : template
      )
    );
    toast.success('تم تعديل اسم القالب بنجاح');
  };
  
  // وظيفة حذف القالب
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prevTemplates => 
      prevTemplates.filter(template => template.id !== templateId)
    );
    toast.success('تم حذف القالب بنجاح');
  };
  
  const handleImportTemplate = (template: Template) => {
    try {
      // حساب عدد القوالب المستوردة حالياً
      const importedCount = templates.filter(t => t.isImported).length;
      const MAX_IMPORTED_TEMPLATES = 10;
      
      if (importedCount >= MAX_IMPORTED_TEMPLATES) {
        toast.error(`لا يمكن استيراد أكثر من ${MAX_IMPORTED_TEMPLATES} قوالب. يرجى حذف بعض القوالب المستوردة أولاً.`);
        return;
      }
      
      // التحقق من وجود قالب بنفس الاسم
      const duplicateName = templates.some(t => t.name === template.name);
      if (duplicateName) {
        // إضافة لاحقة للتمييز
        template.name = `${template.name} (مستورد)`;
      }
      
      // التأكد من وجود الحقول الإلزامية
      if (!template.columns || !Array.isArray(template.columns) || template.columns.length === 0) {
        throw new Error('القالب المستورد لا يحتوي على أعمدة صالحة');
      }
      
      setTemplates(prev => [template, ...prev]);
      toast.success('تم استيراد القالب بنجاح!');
      setShowImportTemplateModal(false);
    } catch (error) {
      console.error('خطأ في استيراد القالب:', error);
      toast.error('حدث خطأ أثناء استيراد القالب. تأكد من صحة البيانات المستوردة.');
    }
  };
  
  const applyTemplateToSubject = (template: Template) => {
    setClasses(prev =>
      prev.map(c => {
        if (c.id === activeClassId) {
          return {
            ...c,
            subjects: c.subjects.map(s =>
              s.id === activeSubjectId
                ? {
                    ...s,
                    columns: template.columns.map(col => ({
                      ...col,
                      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
                    })),
                  }
                : s
            ),
          };
        }
        return c;
      })
    );
    toast.success('تم تطبيق القالب بنجاح');
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
  <div className="min-h-screen flex flex-col bg-slate-50">
      {/* الهيدر أعلى الصفحة */}
      <Header
        settings={settings}
        currentUser={currentUser || ''}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onLogout={() => {
          setCurrentUser(null);
          sessionStorage.removeItem('gradebook-user');
        }}
      />
      <main className="flex-1 flex flex-col overflow-hidden transition-all duration-300" style={{direction: 'rtl'}}>
        {/* فلاتر الفصل والمادة في الأعلى */}
  <div className="w-full flex gap-2 items-center justify-center bg-white border-b border-slate-200 py-2 px-2 sticky top-0 z-50">
          <select
            className="border rounded-lg px-2 py-1 text-sm bg-slate-50 text-slate-800"
            value={activeClassId}
            onChange={e => setActiveClassId(e.target.value)}
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </select>
          <select
            className="border rounded-lg px-2 py-1 text-sm bg-slate-50 text-slate-800"
            value={activeSubjectId}
            onChange={e => setActiveSubjectId(e.target.value)}
            disabled={!activeClassId || !classes.find(c => c.id === activeClassId)?.subjects.length}
          >
            {(classes.find(c => c.id === activeClassId)?.subjects || []).map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
        {/* أزرار التول بار */}
  {/* تم حذف جميع أزرار التول بار العلوية بناءً على طلب المستخدم */}
        <div className="w-full overflow-x-auto overflow-y-visible p-2 sm:p-4 md:p-6" style={{marginRight: '0.2cm', minWidth: 0, boxSizing: 'border-box'}}>
          <StudentDataView
            key={activeClassId + '-' + activeSubjectId}
            ref={studentDataViewRef}
            activeClass={activeClass || undefined}
            activeSubject={activeSubject || undefined}
            onAddColumn={addColumn}
            onDeleteColumn={deleteColumn}
            onEditColumn={editColumn}
            onFillColumn={fillColumn}
            onImportStudents={importStudents}
            onAddStudent={addStudent}
            onUpdateStudentData={(classId, studentId, columnId, value) => {
              setClasses((prev: Class[]) => prev.map((c: Class) => c.id === classId ? {
                ...c,
                students: c.students.map((s: Student) => s.id === studentId ? {
                  ...s,
                  records: { ...s.records, [columnId]: value }
                } : s)
              } : c));
              toast.success('تم الحفظ تلقائيًا', { duration: 1200 });
            }}
            onDeleteStudent={deleteStudent}
            settings={settings}
            apiKey={apiKey}
            onRequestApiKey={() => setIsApiKeyModalOpen(true)}
            onAddClass={() => setShowAddClassModal(true)}
            onAddSubject={() => setShowAddSubjectModal(true)}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenCustomize={() => setIsCustomizeOpen(true)}
            onSaveTemplate={() => setShowSaveTemplateModal(true)}
            onUseTemplate={() => setShowUseTemplateModal(true)}
            onAdminExport={() => studentDataViewRef.current && studentDataViewRef.current.openAdminModal && studentDataViewRef.current.openAdminModal()}
            setClasses={setClasses} // إضافة دالة تحديث الصفوف
          />
        </div>
        {/* إدارة الفصول والمواد (سايد بار جانبي) */}
        <CustomizeDrawer
          open={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          onAddColumn={(cols) => {
            if (!activeClass || !activeSubject) return;
            cols.forEach(col => {
              const count = Math.max(1, Number(col.count) || 1);
              for (let i = 0; i < count; i++) {
                addColumn(activeClass.id, activeSubject.id, col.name, ColumnType.NUMBER, undefined);
              }
            });
            toast.success('تمت إضافة الأعمدة بنجاح.');
          }}
          onColorChange={(color, subjectId) => {
            const sid = subjectId || activeSubjectId;
            if (!activeClassId || !sid) return;
            setClasses(prev => prev.map(c => c.id === activeClassId ? {
              ...c,
              subjects: c.subjects.map(s => {
                if (s.id === sid) {
                  if (s.themeColor === color) return s;
                  return { ...s, themeColor: color };
                }
                return s;
              })
            } : c));
          }}
          classes={classes}
          activeClassId={activeClassId}
          activeSubjectId={activeSubjectId}
          onEditClass={(cls) => {
            if (cls.name && cls.name.trim()) {
              setClasses(prev => prev.map(c => c.id === cls.id ? { ...c, name: cls.name.trim(), type: cls.type } : c));
              toast.success('تم تعديل بيانات الفصل.');
            }
          }}
          onDeleteClass={(cls) => {
            setConfirmation({
              message: 'هل أنت متأكد من حذف الفصل؟ سيتم حذف جميع بياناته.',
              confirmLabel: 'تأكيد الحذف',
              onConfirm: () => {
                setClasses(prev => prev.filter(c => c.id !== cls.id));
                toast.success('تم حذف الفصل.');
                setConfirmation(null);
              }
            });
          }}
          onEditSubject={(cls, sub) => {
            if (sub.name && sub.name.trim()) {
              setClasses(prev => prev.map(c => c.id === cls.id ? {
                ...c,
                subjects: c.subjects.map(s => s.id === sub.id ? { ...s, name: sub.name.trim() } : s)
              } : c));
              toast.success('تم تعديل اسم المادة.');
            }
          }}
          onDeleteSubject={(cls, sub) => {
            setConfirmation({
              message: 'هل أنت متأكد من حذف المادة؟ سيتم حذف جميع بياناتها.',
              confirmLabel: 'تأكيد الحذف',
              onConfirm: () => {
                setClasses(prev => prev.map(c => c.id === cls.id ? {
                  ...c,
                  subjects: c.subjects.filter(s => s.id !== sub.id)
                } : c));
                toast.success('تم حذف المادة.');
                setConfirmation(null);
              }
            });
          }}
          onAddClass={(name, type) => {
            setClasses(prev => ([
              ...prev,
              { id: Date.now().toString() + '-' + Math.random(), name, type, subjects: [], students: [] }
            ]));
            toast.success('تمت إضافة الفصل بنجاح.');
          }}
          onAddSubject={(cls, name) => {
            setClasses(prev => prev.map(c => c.id === cls.id ? {
              ...c,
              subjects: [
                ...(c.subjects || []),
                { id: Date.now().toString() + '-' + Math.random(), name, columns: [] }
              ]
            } : c));
            toast.success('تمت إضافة المادة بنجاح.');
          }}
        />
      </main>

      {/* Modals for add actions */}
      {showAddStudentModal && (
        <AddStudentModal
          onClose={() => setShowAddStudentModal(false)}
          onAddStudent={(name) => {
            if (activeClass) addStudent(activeClass.id, name);
            setShowAddStudentModal(false);
          }}
        />
      )}
      {showAddClassModal && (
        <AddClassModal
          onClose={() => setShowAddClassModal(false)}
          onAddClass={(name) => {
            setClasses(prev => ([
              ...prev,
              { id: Date.now().toString() + '-' + Math.random(), name, type: 'تعليمي', subjects: [], students: [] }
            ]));
            toast.success('تمت إضافة الفصل بنجاح.');
          }}
        />
      )}
      {showAddColumnModal && activeClass && activeSubject && (
        <AddColumnModal
          onClose={() => setShowAddColumnModal(false)}
          onAddColumn={(name, type, options) => {
            addColumn(activeClass.id, activeSubject.id, name, type, options);
            setShowAddColumnModal(false);
          }}
        />
      )}
      {showAddSubjectModal && activeClass && (
        <AddSubjectModal
          onClose={() => setShowAddSubjectModal(false)}
          className={activeClass.name}
          onAddSubject={(name) => {
            setClasses(prev => prev.map(c => c.id === activeClass.id ? {
              ...c,
              subjects: [
                ...(c.subjects || []),
                { id: Date.now().toString() + '-' + Math.random(), name, columns: [] }
              ]
            } : c));
            toast.success('تمت إضافة المادة بنجاح.');
          }}
        />
      )}
      {showImportModal && activeClass && activeSubject && (
        <ImportStudentsModal
          onClose={() => setShowImportModal(false)}
          onImport={(importedData, studentNameColumn, columnsToImport) => {
            importStudents(activeClass.id, activeSubject.id, importedData, studentNameColumn, columnsToImport);
            setShowImportModal(false);
          }}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
      {confirmation && (
        <ConfirmModal
          message={confirmation.message}
          onConfirm={confirmation.onConfirm}
          onCancel={() => {
            if (pendingColor !== null) setPendingColor(null);
            setConfirmation(null);
          }}
          confirmLabel={confirmation.confirmLabel}
        />
      )}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}

      {showSaveTemplateModal && activeClass && activeSubject && (
        <SaveTemplateModal
          onClose={() => setShowSaveTemplateModal(false)}
          onSave={(templateName, description, isPublic) => handleSaveTemplate(templateName, description, isPublic)}
          columns={activeSubject.columns}
        />
      )}

      {showUseTemplateModal && activeClass && activeSubject && (
        <UseTemplateModal
          onClose={() => setShowUseTemplateModal(false)}
          onUseTemplate={(templateId) => handleUseTemplate(templateId)}
          templates={templates}
          onExportTemplate={handleExportTemplate}
          onShowImport={() => setShowImportTemplateModal(true)}
          onRenameTemplate={handleRenameTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )}
      
      {showExportTemplateModal && templateToExport && (
        <ExportTemplateModal
          onClose={() => setShowExportTemplateModal(false)}
          template={templateToExport}
        />
      )}
      
      {showImportTemplateModal && (
        <ImportTemplateModal
          onClose={() => setShowImportTemplateModal(false)}
          onImport={handleImportTemplate}
          currentImportCount={templates.filter(t => t.isImported).length}
          maxImportCount={10}
        />
      )}

      {/* نافذة ما الجديد */}
      <WhatsNewModal />
    </div>
  );
}

export default App;
