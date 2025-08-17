import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Settings, Class, ColumnType, Column, Student, Subject } from './types';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import StudentDataView from './components/StudentDataView';
import SettingsModal from './components/SettingsModal';
import ConfirmModal from './components/ConfirmModal';
import ApiKeyModal from './components/ApiKeyModal';

// Custom hook for persisting state to localStorage, using a robust useEffect-based approach.
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key "' + key + '":', error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error('Error re-reading localStorage key "' + key + '":', error);
      setStoredValue(initialValue as T);
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error writing to localStorage key "' + key + '":', error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(() => sessionStorage.getItem('gradebook-user'));
  
  const userSettingsKey = 'student-gradebook-settings-' + currentUser;
  const userClassesKey = 'student-gradebook-classes-' + currentUser;

  const defaultSettings: Settings = {
    schoolName: 'مدرستي',
    teacherName: 'اسمي',
    principalName: 'اسم المدير',
    educationDirectorate: 'إدارة التعليم بمنطقة...',
    academicYear: '1445هـ',
    semester: 'الفصل الدراسي الأول',
  };

  const [settings, setSettings] = useLocalStorage<Settings>(userSettingsKey, defaultSettings);
  const [classes, setClasses] = useLocalStorage<Class[]>(userClassesKey, []);
  const [activeClassId, setActiveClassId] = useState<string | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(() => sessionStorage.getItem('gemini-api-key'));
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    // Set sidebar to be open by default on larger screens, but only on initial mount.
    if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
    }
  }, []); // Empty dependency array ensures this runs only once.

  useEffect(() => {
    if (!currentUser) {
        setClasses([]);
        setSettings(defaultSettings);
    }
  }, [currentUser, setClasses, setSettings]);
  
  useEffect(() => {
    const currentClass = classes.find(c => c.id === activeClassId);
    if (!activeClassId && classes.length > 0) {
      setActiveClassId(classes[0].id);
    } else if (activeClassId && !currentClass) {
        setActiveClassId(classes.length > 0 ? classes[0].id : null);
    } else if (classes.length === 0) {
      setActiveClassId(null);
    }
  }, [classes, activeClassId]);

  useEffect(() => {
      const currentClass = classes.find(c => c.id === activeClassId);
      if (currentClass) {
          const currentSubject = currentClass.subjects.find(s => s.id === activeSubjectId);
          if (activeSubjectId && !currentSubject) {
              setActiveSubjectId(currentClass.subjects.length > 0 ? currentClass.subjects[0].id : null);
          } else if (!activeSubjectId && currentClass.subjects.length > 0) {
              setActiveSubjectId(currentClass.subjects.length > 0 ? currentClass.subjects[0].id : null);
          } else if (currentClass.subjects.length === 0) {
              setActiveSubjectId(null);
          }
      } else {
          setActiveSubjectId(null);
      }
  }, [activeClassId, classes, activeSubjectId]);

  const activeClass = classes.find(c => c.id === activeClassId);
  const activeSubject = activeClass?.subjects.find(s => s.id === activeSubjectId);

  const handleLogin = (username: string) => {
    sessionStorage.setItem('gradebook-user', username);
    setCurrentUser(username);
    toast.success('مرحباً بك مجدداً، ' + username + '!');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('gradebook-user');
    sessionStorage.removeItem('gemini-api-key');
    setCurrentUser(null);
    setApiKey(null);
    toast.success('تم تسجيل الخروج بنجاح.');
  };

  const addClass = (name: string) => {
    const newClass: Class = {
      id: Date.now().toString(),
      name,
      students: [],
      subjects: [],
    };
    setClasses(prev => [...prev, newClass]);
    setActiveClassId(newClass.id);
    toast.success('تمت إضافة فصل "' + name + '" بنجاح.');
  };

  const editClass = (classId: string, newName: string) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, name: newName } : c));
    toast.success('تم تعديل اسم الفصل بنجاح.');
  };

  const deleteClass = (classId: string, className: string) => {
    setConfirmation({
      message: 'هل أنت متأكد من حذف الفصل \'' + className + '\'؟ سيتم حذف جميع مواده وبياناته.',
      onConfirm: () => {
        setClasses(prev => prev.filter(c => c.id !== classId));
        toast.success('تم حذف الفصل \'' + className + '\' بنجاح.');
        setConfirmation(null);
      }
    });
  };

  const addSubject = (classId: string, name: string) => {
    const newSubject: Subject = { 
      id: Date.now().toString(), 
      name, 
      columns: [],
      themeColor: '#2E8540', // Default theme color (Ministry of Education Green)
    };
    setClasses(prev => prev.map(c => 
      c.id === classId ? { ...c, subjects: [...c.subjects, newSubject] } : c
    ));
    setActiveSubjectId(newSubject.id);
    toast.success('تمت إضافة مادة "' + name + '" بنجاح.');
  };

  const editSubject = (classId: string, subjectId: string, newName: string) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return { ...c, subjects: c.subjects.map(s => s.id === subjectId ? { ...s, name: newName } : s) };
    }));
    toast.success('تم تعديل اسم المادة بنجاح.');
  };

  const deleteSubject = (classId: string, subjectId: string, subjectName: string) => {
     setConfirmation({
      message: 'هل أنت متأكد من حذف المادة \'' + subjectName + '\'؟',
      onConfirm: () => {
        setClasses(prev => prev.map(c => {
          if (c.id !== classId) return c;
          const updatedSubjects = c.subjects.filter(s => s.id !== subjectId);
          return { ...c, subjects: updatedSubjects };
        }));
        toast.success('تم حذف المادة \'' + subjectName + '\' بنجاح.');
        setConfirmation(null);
      }
    });
  };
  
  const handleUpdateSubjectThemeColor = (classId: string, subjectId: string, color: string) => {
      setClasses(prev => prev.map(c => {
          if (c.id !== classId) return c;
          return { ...c, subjects: c.subjects.map(s => s.id === subjectId ? { ...s, themeColor: color } : s) };
      }));
  };

  const addColumn = (classId: string, subjectId: string, name: string, type: ColumnType, options?: string[]) => {
    const newColumn: Column = { id: Date.now().toString(), name, type, options };
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return {
        ...c,
        subjects: c.subjects.map(s => s.id === subjectId ? { ...s, columns: [...s.columns, newColumn] } : s)
      };
    }));
    toast.success('تمت إضافة عمود "' + name + '" بنجاح.');
  };
  
  const editColumn = (classId: string, subjectId: string, columnId: string, updatedData: Partial<Column>) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return {
        ...c,
        subjects: c.subjects.map(s => {
          if (s.id !== subjectId) return s;
          const updatedColumns = s.columns.map(col => 
            col.id === columnId ? { ...col, ...updatedData } : col
          );
          return { ...s, columns: updatedColumns };
        })
      };
    }));
    toast.success('تم تحديث العمود بنجاح.');
  };

  const deleteColumn = (classId: string, subjectId: string, columnId: string, columnName: string, skipConfirm = false) => {
      const performDeletion = () => {
          setClasses(prevClasses => prevClasses.map(c => {
              if (c.id === classId) {
                  const updatedSubjects = c.subjects.map(s => {
                      if (s.id === subjectId) {
                          return { ...s, columns: s.columns.filter(col => col.id !== columnId) };
                      }
                      return s;
                  });
                  const updatedStudents = c.students.map(student => {
                      const newRecords = { ...student.records };
                      delete newRecords[columnId];
                      return { ...student, records: newRecords };
                  });
                  return { ...c, subjects: updatedSubjects, students: updatedStudents };
              }
              return c;
          }));
          toast.success('تم حذف العمود \'' + columnName + '\' بنجاح.');
          if (!skipConfirm) {
              setConfirmation(null);
          }
      };

      if (skipConfirm) {
          performDeletion();
          return;
      }
      
      setConfirmation({
          message: 'هل أنت متأكد من حذف العمود \'' + columnName + '\'؟',
          onConfirm: performDeletion
      });
  };

  const fillColumn = (classId: string, subjectId: string, columnId: string, value: any) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;

      const subject = c.subjects.find(s => s.id === subjectId);
      const column = subject?.columns.find(col => col.id === columnId);
      if (!column) return c;

      let finalValue = value;
      if (column.type === ColumnType.NUMBER) {
        const parsed = parseFloat(value);
        finalValue = isNaN(parsed) ? null : parsed;
      } else if (column.type === ColumnType.CHECKBOX) {
        finalValue = !!value;
      }

      const updatedStudents = c.students.map(student => {
        const newRecords = { ...student.records, [columnId]: finalValue };
        return { ...student, records: newRecords };
      });
      
      toast.success('تم تعميم القيمة للعمود "' + column.name + '"');
      return { ...c, students: updatedStudents };
    }));
  };

  const importStudents = (classId: string, subjectId: string, importedData: any[], studentNameColumn: string, columnsToImport: { header: string, type: ColumnType, options?: string[] }[]) => {
    setClasses(prev => prev.map(c => {
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

        const updatedSubjects = c.subjects.map(s => {
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
                    if(colInfo.type === ColumnType.NUMBER) {
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
  
  const addStudent = (classId: string, name: string) => {
    const newStudent: Student = {
        id: Date.now().toString() + '-' + Math.random(),
        name,
        records: {},
    };
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, students: [...c.students, newStudent]} : c));
    toast.success('تمت إضافة الطالب "' + name + '" بنجاح.');
  };

  const deleteStudent = (classId: string, studentId: string, studentName: string) => {
    setConfirmation({
      message: 'هل أنت متأكد من حذف الطالب \'' + studentName + '\'؟',
      onConfirm: () => {
        setClasses(prev => prev.map(c => 
            c.id === classId ? { ...c, students: c.students.filter(s => s.id !== studentId) } : c
        ));
        toast.success('تم حذف الطالب \'' + studentName + '\' بنجاح.');
        setConfirmation(null);
      }
    });
  };

  const updateStudentData = (classId: string, studentId: string, columnId: string, value: any) => {
    setClasses(prev => prev.map(c => {
      if (c.id !== classId) return c;
      return {
        ...c,
        students: c.students.map(s => {
          if (s.id !== studentId) return s;
          const newRecords = { ...s.records, [columnId]: value };
          return { ...s, records: newRecords };
        })
      };
    }));
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
  
  const handleSaveSettingsAndKey = (newSettings: Settings, newKey: string) => {
    setSettings(newSettings);
    handleSaveApiKey(newKey);
    setIsSettingsModalOpen(false);
    toast.success('تم حفظ الإعدادات بنجاح.');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      {/* زر ثابت لإظهار/إخفاء السايدبار */}
      <button
        className="fixed top-4 right-4 z-50 bg-slate-700 text-white rounded-full p-2 shadow-lg"
        onClick={() => setIsSidebarOpen(prev => !prev)}
        aria-label={isSidebarOpen ? 'إخفاء القائمة الجانبية' : 'إظهار القائمة الجانبية'}
      >
        {isSidebarOpen ? <span style={{fontSize: 20}}>&#10005;</span> : <span style={{fontSize: 20}}>☰</span>}
      </button>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Header 
          settings={settings}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          classes={classes}
          activeClassId={activeClassId}
          activeSubjectId={activeSubjectId}
          onSelectClass={(id) => {
            setActiveClassId(id);
            // Do not close sidebar on desktop
            if (window.innerWidth < 768) {
               setIsSidebarOpen(false);
            }
          }}
          onSelectSubject={(id) => {
            setActiveSubjectId(id);
             if (window.innerWidth < 768) {
               setIsSidebarOpen(false);
            }
          }}
          onAddClass={addClass}
          onEditClass={editClass}
          onDeleteClass={deleteClass}
          onAddSubject={addSubject}
          onEditSubject={editSubject}
          onDeleteSubject={deleteSubject}
          onUpdateSubjectThemeColor={handleUpdateSubjectThemeColor}
          onAddColumn={addColumn}
          onDeleteColumn={deleteColumn}
        />
        <main className={'flex-1 flex flex-col overflow-hidden transition-all duration-300 ' + (isSidebarOpen ? 'md:mr-80' : '')}>
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <StudentDataView
              activeClass={activeClass}
              activeSubject={activeSubject}
              onAddColumn={addColumn}
              onDeleteColumn={deleteColumn}
              onEditColumn={editColumn}
              onFillColumn={fillColumn}
              onImportStudents={importStudents}
              onAddStudent={addStudent}
              onUpdateStudentData={updateStudentData}
              onDeleteStudent={deleteStudent}
              settings={settings}
              apiKey={apiKey}
              onRequestApiKey={() => setIsApiKeyModalOpen(true)}
            />
          </div>
        </main>
      </div>
      <footer 
        className="bg-white dark:bg-slate-800/50 text-center p-4 text-sm font-semibold border-t dark:border-slate-700/50"
        style={{ color: '#2E8540' }}
        >
        هذه الأداة هدية الى كل معلم ومعلمة ..  تطوير وبرمجة المهندس : محمد بن سالم الدوسري
      </footer>

      {isSettingsModalOpen && (
        <SettingsModal
          settings={settings}
          apiKey={apiKey}
          onSave={handleSaveSettingsAndKey}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}
      {confirmation && (
          <ConfirmModal 
              message={confirmation.message}
              onConfirm={confirmation.onConfirm}
              onCancel={() => setConfirmation(null)}
          />
      )}
      {isApiKeyModalOpen && (
        <ApiKeyModal
          onSave={handleSaveApiKey}
          onClose={() => setIsApiKeyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;