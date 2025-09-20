import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Class, Subject, ColumnType, Settings } from '../types';
import { getContrastColor } from '../utils/colorUtils';
import StudentTable from './StudentTable';
import MainToolbar from './MainToolbar';
import ClassSubjectFilters from './ClassSubjectFilters';
import AddColumnModal from './AddColumnModal';
import ImportStudentsModal from './ImportStudentsModal';
import AddStudentModal from './AddStudentModal';
import SimpleModal from './SimpleModal';
import { ClipboardListIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';
import { getColumnOrder, orderColumns } from '../utils/drag-drop/columnUtils.js';

// تم الاستغناء عن الزر العائم لصالح شريط الأدوات العلوي

// @ts-ignore
declare const XLSX: any;

interface StudentDataViewProps {
  activeClass: Class | undefined;
  activeSubject: Subject | undefined;
  onAddColumn: (classId: string, subjectId: string, name: string, type: ColumnType, options?: string[], extra?: { multiSlots?: number; multiShowCounter?: boolean; multiLabels?: string[] }) => void;
  onDeleteColumn: (classId: string, subjectId: string, columnId: string, columnName: string) => void;
  onEditColumn: (classId: string, subjectId: string, columnId: string, updatedData: Partial<any>) => void;
  onFillColumn: (classId: string, subjectId: string, columnId: string, value: any) => void;
  onImportStudents: (classId: string, subjectId: string, importedData: any[], studentNameColumn: string, columnsToImport: { header: string, type: ColumnType }[]) => void;
  onAddStudent: (classId: string, name: string) => void;
  setClasses?: (updater: (prev: Class[]) => Class[]) => void; // إضافة دالة تحديث الصفوف
  onUpdateStudentData: (classId: string, studentId: string, columnId: string, value: any) => void;
  onDeleteStudent: (classId: string, studentId: string, studentName: string) => void;
  settings: Settings;
  apiKey: string | null;
  onRequestApiKey: () => void;
  color?: string;
  onSaveTemplate?: () => void;
  onUseTemplate?: () => void;
  onAddClass?: () => void;
  onAddSubject?: () => void;
  onExportExcel?: () => void;
  onExportPdf?: () => void;
  onOpenSettings?: () => void;
  onOpenCustomize?: () => void;
  onAdminExport?: () => void;
}

function StudentDataViewImpl(props: StudentDataViewProps & {
  classes?: any;
  activeClassId?: any;
  activeSubjectId?: any;
  onClassChange?: any;
  onSubjectChange?: any;
}, ref: React.Ref<any>) {
  // ...existing code...
  // تصدير كشف الإدارة المدرسية إلى PDF (بسيط عبر نافذة طباعة)
  const handleExportAdminPdf = () => {
    if (!activeClass || !activeSubject) return;
    const reportData = generateReportData('pdf');
    if (!reportData) return;
    const { tableHeader, body, rowStudentIds, themeColor: _themeColor } = reportData as any;
    // ترتيب الأعمدة كما في الجدول الحالي
    const savedOrderForAdmin = getColumnOrder();
    const columnsInOrder = orderColumns(activeSubject?.columns || [], savedOrderForAdmin);
    // استرجاع تنسيقات الخلايا من localStorage (نفس منطق تقرير الطلاب)
    function getCellStyle(studentId: string, colId: string) {
      try {
        const key = `colorfulcell-${studentId}-${colId}`;
        const data = localStorage.getItem(key);
        if (!data) return '';
        const { bgColor, textColor, fontSize, textAlign } = JSON.parse(data);
        let style = '';
        if (bgColor) style += `background:${bgColor};`;
        if (textColor) style += `color:${textColor};`;
        if (fontSize) style += `font-size:${fontSize};`;
        if (textAlign) style += `text-align:${textAlign};`;
        return style;
      } catch { return ''; }
    }
    // رأس التقرير: 3 أعمدة (الشعار يسار، العنوان وسط، الترويسة يمين)
    let html = `<div style="direction:rtl;font-family:'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif;">`;
    html += `<div style="display:flex; direction:ltr; align-items:center; margin-bottom:16px; text-align:center;">`;
    // يسار: الشعار
    html += `<div style='flex:1; text-align:left; display:flex; align-items:center;'>`;
    if (settings.logoBase64) {
      html += `<img src='${settings.logoBase64}' alt='شعار الوزارة' style='height:100px;width:auto;display:inline-block;object-fit:contain;' />`;
    }
    html += `</div>`;
    // وسط: العنوان
    html += `<div style='flex:1; text-align:center;'><h1 style='font-size:22px;margin:0;'>${adminReportName || ''}</h1></div>`;
    // يمين: الترويسة
    html += `<div style='flex:1; text-align:right;'>`;
    html += `<div style='font-size:16px;font-weight:bold;'>المملكة العربية السعودية</div>`;
    html += `<div style='font-size:14px;'>وزارة التعليم</div>`;
    html += `<div style='font-size:14px;'>${settings.educationDirectorate || ''}</div>`;
    html += `<div style='font-size:14px;'>مدرسة: ${settings.schoolName || ''}</div>`;
    html += `</div>`;
    html += `</div>`;
    // جدول البيانات
  const themeColor = _themeColor || '#2E8540';
  let pdfColor = themeColor || '#2E8540';
    if (!pdfColor || pdfColor.toLowerCase() === '#fff' || pdfColor.toLowerCase() === '#ffffff' || pdfColor === 'white' || pdfColor === 'transparent') pdfColor = '#2E8540';
    if (!/^#[0-9A-Fa-f]{6}$/.test(pdfColor)) {
      if (/^#[0-9A-Fa-f]{3}$/.test(pdfColor)) pdfColor = '#' + pdfColor.substring(1).split('').map((x:any)=>x+x).join(''); else pdfColor = '#2E8540';
    }
    html += `<table border='1' cellspacing='0' cellpadding='4' style='width:100%;border-collapse:collapse;margin-bottom:24px;'>`;
  html += '<thead><tr>' + tableHeader.map((h: any) => `<th style="background:${pdfColor} !important;color:${getContrastColor(pdfColor)};text-align:center;font-weight:bold;">${h}</th>`).join('') + '</tr></thead>';
    html += '<tbody>';
  body.forEach((row: any[], rowIdx: number) => {
      const studentId = (rowStudentIds as string[])[rowIdx];
      const student = activeClass.students.find((s: any) => s.id === studentId) || activeClass.students[rowIdx];
      html += '<tr>' + row.map((cell:any, cellIndex:number) => {
        if (cellIndex < 2) {
          // عمود التسلسل أو الاسم: لا تخصيص
          return `<td style="border: 1px solid #333; padding: 8px; text-align: ${cellIndex === 1 ? 'right' : 'center'};">${cell}</td>`;
        } else {
          const col = columnsInOrder[cellIndex - 2];
          const style = getCellStyle(student.id, col.id);
          // محاذاة وسط افتراضياً مع تطبيق التنسيقات المخزنة
          return `<td style="border: 1px solid #333; padding: 8px; text-align:center; ${style}">${cell}</td>`;
        }
      }).join('') + '</tr>';
    });
    html += '</tbody></table>';
    // جدول الموقعين
    html += `<table border='1' cellspacing='0' cellpadding='4' style='width:70%;border-collapse:collapse;margin:auto;'>`;
    html += `<tr>` + ['م','المنصب','اسم الموقع','التوقيع'].map(h => `<th style=\"background:${pdfColor} !important;color:${getContrastColor(pdfColor)};text-align:center;font-weight:bold;\">${h}</th>`).join('') + `</tr>`;
    adminSigners.filter((s: any) => s.role || s.name).forEach((s: any, idx: number) => {
      html += `<tr><td style='text-align:center;'>${idx + 1}</td><td>${s.role}</td><td>${s.name}</td><td style='width:120px;'></td></tr>`;
    });
    html += '</table>';
    html += '</div>';
    const win = window.open('', '_blank');
    if (win) {
      const style = `@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');\nbody{font-family:'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif;}\n@media print { th, td { -webkit-print-color-adjust: exact; print-color-adjust: exact; } thead { display: table-header-group; } tfoot { display: table-footer-group; } }`;
      win.document.write(`<html><head><title>${adminReportName || ''}</title><style>${style}</style></head><body>${html}<script>window.onload = function() { var waitFonts = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve(); var imgs = Array.from(document.images || []); var waitImages = Promise.all(imgs.map(function(img){ if (img.complete) return Promise.resolve(); return new Promise(function(res){ img.addEventListener('load', res); img.addEventListener('error', res); }); })); Promise.all([waitFonts, waitImages]).then(function(){ setTimeout(function(){ window.print(); window.onafterprint = function(){ window.close(); }; }, 100); }); }<\/script></body></html>`);
      win.document.close();
    } else {
      toast.error('تعذر فتح نافذة الطباعة.');
    }
  };



  // تصدير كشف الإدارة المدرسية بترويسة وتذييل مخصصين
  const handleExportAdminExcel = () => {
    if (!activeClass || !activeSubject) return;
    const reportData = generateReportData('excel');
    if (!reportData) return;
    const { tableHeader, body, themeColor } = reportData as any;
    const wb = XLSX.utils.book_new();
    wb.Props = { Title: adminReportName, Author: '', CreatedDate: new Date() };
    wb.Workbook = { Views: [{ RTL: true }] };
    // Header rows
    const headerRows: any[] = [
      ['المملكة العربية السعودية'],
      ['وزارة التعليم'],
      [settings.educationDirectorate || ''],
      [`مدرسة: ${settings.schoolName || ''}`],
      [adminReportName || ''],
      [],
    ];
    // Table rows
    const tableRows: any[] = [tableHeader, ...body];
    // Signers rows
    const signersRows: any[] = [
      ['المنصب', 'اسم الموقع', 'التوقيع'],
      ...adminSigners.filter((s: any) => s.role || s.name).map((s: any) => [s.role, s.name, ''])
    ];
    // Merge all
    const ws_data: any[] = [...headerRows, ...tableRows, [], ...signersRows];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // Styling
    const borderStyle = { top: { style: 'thin', color: { rgb: '000000' } }, bottom: { style: 'thin', color: { rgb: '000000' } }, left: { style: 'thin', color: { rgb: '000000' } }, right: { style: 'thin', color: { rgb: '000000' } } } as any;
    let excelColor = (themeColor || '#2E8540').replace('#', '');
    if (excelColor.length === 3) excelColor = excelColor.split('').map((x: string) => x + x).join('');
    if (excelColor.length < 6) excelColor = excelColor.padEnd(6, '0');
    function darken(hex: string, percent: number) {
      let num = parseInt(hex, 16);
      let r = (num >> 16) & 0xff;
      let g = (num >> 8) & 0xff;
      let b = num & 0xff;
      r = Math.floor(r * (1 - percent));
      g = Math.floor(g * (1 - percent));
      b = Math.floor(b * (1 - percent));
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
    let num = parseInt(excelColor, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    if (r > 220 && g > 220 && b > 220) excelColor = darken(excelColor, 0.3);
    const headerStyle = { font: { bold: true, color: { rgb: 'FFFFFFFF' }, name: 'Noto Sans Arabic' }, fill: { fgColor: { rgb: excelColor.toUpperCase() } }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderStyle } as any;
    const bodyStyleRight = { alignment: { horizontal: 'right', vertical: 'center' }, border: borderStyle, font: { name: 'Noto Sans Arabic' } } as any;
    const bodyStyleCenter = { alignment: { horizontal: 'center', vertical: 'center' }, border: borderStyle, font: { name: 'Noto Sans Arabic' } } as any;
    const tableHeaderRowIdx = headerRows.length;
    (tableHeader as any[]).forEach((_h: any, i: number) => {
      const cellRef = XLSX.utils.encode_cell({ c: i, r: tableHeaderRowIdx });
      if (ws[cellRef]) (ws[cellRef] as any).s = headerStyle;
    });
    (body as any[]).forEach((row: any[], r: number) => {
      row.forEach((_cell: any, c: number) => {
        const cellRef = XLSX.utils.encode_cell({ c: c, r: tableHeaderRowIdx + 1 + r });
        if (ws[cellRef]) (ws[cellRef] as any).s = (c === 1) ? bodyStyleRight : bodyStyleCenter;
      });
    });
    const cols = (tableHeader as any[]).map((h: any, i: number) => ({ wch: i === 0 ? 5 : i === 1 ? 35 : Math.max(15, (h || '').length * 1.5) }));
    (ws as any)['!cols'] = cols;
    (ws as any)['!pageSetup'] = { orientation: 'landscape', fitToPage: true, horizontalCentered: true, verticalCentered: false, scale: 100 };
    XLSX.utils.book_append_sheet(wb, ws, 'كشف الإدارة');
    XLSX.writeFile(wb, `كشف_${adminReportName || 'الإدارة'}.xlsx`);
  };
  const {
    activeClass,
    activeSubject,
    onAddColumn,
    onDeleteColumn,
    onEditColumn,
    onFillColumn,
    onImportStudents,
    onAddStudent,
    onUpdateStudentData,
    onDeleteStudent,
    settings,
  apiKey: _apiKey,
  onRequestApiKey: _onRequestApiKey,
    color,
    onAddClass,
    onAddSubject,
    onExportExcel,
    onExportPdf,
    onOpenSettings,
    onOpenCustomize,
    classes,
    activeClassId,
    activeSubjectId,
    onClassChange,
    onSubjectChange
  } = props;

  // نافذة الإدارة المدرسية
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  // تخصيص اسم الكشف والموقعين للإدارة المدرسية
  // قائمة أسماء الكشوف الافتراضية مع إمكانية الإضافة
  // قراءة أسماء الكشوف من localStorage إذا وجدت
  const [reportNames, setReportNames] = useState(() => {
    try {
      const stored = localStorage.getItem('adminReportNames');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      'كشف الحضور',
      'كشف التطوير المهني',
      'كشف الغياب',
      'كشف درجات',
    ];
  });
  const [adminReportName, setAdminReportName] = useState(reportNames[0] || '');
  const [newReportName, setNewReportName] = useState('');

  // Dropdown state for report name (custom, contained within modal)
  const [isReportDropdownOpen, setIsReportDropdownOpen] = useState(false);
  const [reportHighlightIndex, setReportHighlightIndex] = useState<number>(-1);
  const reportDropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click or Escape
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (reportDropdownRef.current && !reportDropdownRef.current.contains(target)) {
        setIsReportDropdownOpen(false);
        setReportHighlightIndex(-1);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsReportDropdownOpen(false);
        setReportHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleReportKeyDown = (e: React.KeyboardEvent) => {
    if (!isReportDropdownOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsReportDropdownOpen(true);
  setReportHighlightIndex(Math.max(0, reportNames.findIndex((n: string) => n === adminReportName)));
      return;
    }
    if (isReportDropdownOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setReportHighlightIndex(i => (reportNames.length ? (i + 1) % reportNames.length : -1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setReportHighlightIndex(i => (reportNames.length ? (i <= 0 ? reportNames.length - 1 : i - 1) : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
  const idx = reportHighlightIndex >= 0 ? reportHighlightIndex : reportNames.findIndex((n: string) => n === adminReportName);
        if (idx >= 0 && idx < reportNames.length) {
          setAdminReportName(reportNames[idx]);
          setIsReportDropdownOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsReportDropdownOpen(false);
      }
    }
  };
  // Custom dropdown for signer role (per-row, single open at a time)
  const [isRoleDropdownOpenIndex, setIsRoleDropdownOpenIndex] = useState<number | null>(null);
  const [roleHighlightIndex, setRoleHighlightIndex] = useState<number>(-1);
  const roleDropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Close role dropdown on outside click or Escape
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(target)) {
        setIsRoleDropdownOpenIndex(null);
        setRoleHighlightIndex(-1);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsRoleDropdownOpenIndex(null);
        setRoleHighlightIndex(-1);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleRoleKeyDown = (rowIdx: number, currentRole: string) => (e: React.KeyboardEvent) => {
    if (isRoleDropdownOpenIndex === null && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsRoleDropdownOpenIndex(rowIdx);
      setRoleHighlightIndex(Math.max(0, roles.findIndex((r: string) => r === currentRole)));
      return;
    }
    if (isRoleDropdownOpenIndex === rowIdx) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setRoleHighlightIndex(i => (roles.length ? (i + 1) % roles.length : -1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setRoleHighlightIndex(i => (roles.length ? (i <= 0 ? roles.length - 1 : i - 1) : -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = roleHighlightIndex >= 0 ? roleHighlightIndex : roles.findIndex((r: string) => r === currentRole);
        if (idx >= 0 && idx < roles.length) {
          const role = roles[idx];
          // Update selected row's role
          updateAdminSigner(rowIdx, { ...adminSigners[rowIdx], role });
          setIsRoleDropdownOpenIndex(null);
        }
      } else if (e.key === 'Escape') {
        setIsRoleDropdownOpenIndex(null);
      }
    }
  };

  // قائمة المناصب الافتراضية مع إمكانية الإضافة
  // حفظ واسترجاع قائمة المناصب من localStorage
  const [roles, setRoles] = useState(() => {
    try {
      const stored = localStorage.getItem('adminRoles');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [
      'عضو لجنة',
      'مدير المدرسة',
      'الموجة الطلابي',
      'وكيل شئون الطلاب',
      'وكيل شئون المعلمين',
      'رئيس لجنة',
      'أخرى...'
    ];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('adminRoles', JSON.stringify(roles));
    } catch {}
  }, [roles]);

  // تهيئة الموقعين بشكل صحيح باستخدام أول عنصر من roles
  // تهيئة الموقعين بنفس معيار اسم الكشف: قراءة من localStorage أو قيمة افتراضية ثابتة
  const [adminSigners, setAdminSigners] = useState<{role: string, name: string}[]>(() => {
    try {
      const stored = localStorage.getItem('adminSigners');
      if (stored) return JSON.parse(stored);
    } catch {}
    return [{ role: 'عضو لجنة', name: '' }];
  });
  React.useEffect(() => {
    try {
      localStorage.setItem('adminReportNames', JSON.stringify(reportNames));
    } catch {}
  }, [reportNames]);

  // تحديث localStorage عند أي تغيير في adminSigners (بسيط وواضح)
  React.useEffect(() => {
    try {
      localStorage.setItem('adminSigners', JSON.stringify(adminSigners));
    } catch {}
  }, [adminSigners]);

  // مراقبة قيمة الموقعين في كل رندر (للتشخيص)
  console.log('adminSigners', adminSigners);
  const addAdminSigner = () => setAdminSigners(prev => [...prev, {role: roles[0] || '', name: ''}]);
  const removeAdminSigner = (idx: number) => setAdminSigners(prev => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));
  const updateAdminSigner = (idx: number, value: {role: string, name: string}) => setAdminSigners(prev => prev.map((s, i) => i === idx ? value : s));
  const [newRole, setNewRole] = useState('');

  React.useEffect(() => {
    const handler = () => handleExportToPdf();
    window.addEventListener('export-pdf', handler);
    return () => window.removeEventListener('export-pdf', handler);
  }, [activeClass, activeSubject]);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  // مفتاح فريد لكل فصل/مادة
  const getPageKey = () => {
    return `currentPage-${activeClass?.id || 'none'}-${activeSubject?.id || 'none'}`;
  };

  // تهيئة رقم الصفحة من sessionStorage حسب الفصل/المادة
  const [currentPage, setCurrentPage] = useState(() => {
    const key = getPageKey();
    const saved = sessionStorage.getItem(key);
    return saved ? Number(saved) : 1;
  });

  // دالة لتغيير الصفحة مع الحفظ في sessionStorage حسب الفصل/المادة
  const handleSetPage = (page: number) => {
    setCurrentPage(page);
    sessionStorage.setItem(getPageKey(), String(page));
  };
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // حالة للفرز الأبجدي للأسماء
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');

  // إعادة تعيين الصفحة عند تغيير الفصل أو المادة (فقط عند تغير المعرفات)
  React.useEffect(() => {
    setCurrentPage(1);
    sessionStorage.setItem(getPageKey(), '1');
  }, [activeClass?.id, activeSubject?.id]);
  
  // دالة لفتح مودال التأكيد على حذف جميع الأسماء
  const handleDeleteAllStudents = () => {
    setIsDeleteAllModalOpen(true);
  };

  // دالة الحذف الفعلي بعد التأكيد
  const confirmDeleteAllStudents = () => {
    if (activeClass && activeClass.students && activeClass.students.length > 0 && props.setClasses) {
      const studentsCount = activeClass.students.length;
      
      try {
        // استخدام دالة setClasses المستلمة من App.tsx
        props.setClasses((prevClasses: Class[]) => 
          prevClasses.map((cls: Class) => 
            cls.id === activeClass.id 
              ? { ...cls, students: [] } // حذف جميع الأسماء من الصف الحالي
              : cls
          )
        );
        
        // إظهار رسالة نجاح
        toast.success(`تم حذف ${studentsCount} اسم بنجاح`);
        
      } catch (error) {
        console.error('خطأ أثناء حذف جميع الأسماء:', error);
        toast.error('فشل في حذف الأسماء');
      }
    }
  };
  
  const themeColor = color || activeSubject?.themeColor || '#2E8540';

  // فرز الطلاب حسب الاسم أبجديًا
  const sortedAllStudents = useMemo(() => {
    if (!activeClass?.students) return [];
    
    return [...activeClass.students].sort((a, b) => {
      if (nameSortOrder === 'asc') {
        return (a.name || '').localeCompare(b.name || '', 'ar');
      } else {
        return (b.name || '').localeCompare(a.name || '', 'ar');
      }
    });
  }, [activeClass?.students, nameSortOrder]);

  // Pagination Logic
  const totalStudents = sortedAllStudents.length || 0;
  const totalPages = Math.ceil(totalStudents / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  // أضف رقم تسلسل حقيقي لكل طالب بناءً على ترتيبه في الجدول الكامل
  const paginatedStudents = (sortedAllStudents.slice(startIndex, endIndex).map((student: any, i: number) => ({
    ...student,
    serial: nameSortOrder === 'asc' ? (startIndex + i + 1) : (totalStudents - startIndex - i)
  })) || []);


  // ترتيب الأعمدة حسب الحفظ في localStorage
  const savedOrder = getColumnOrder();
  const columnsInOrder = orderColumns(activeSubject?.columns || [], savedOrder);

  const generateReportData = (exportType: 'pdf' | 'excel' = 'pdf') => {
    if (!activeClass || !activeSubject) return null;
    // استخدم الأعمدة المرتبة كما هي (بدون توسعة)، وامثل مجموعة المربعات في خلية واحدة مثل (×-✓×)
    const tableHeader = ['م', 'الاسم', ...columnsInOrder.map((c: any) => c.name)];
    // رتب الطلاب أبجديًا (عربي) من الألف إلى الياء بشكل دائم في التقارير
    const collator = new Intl.Collator('ar', { sensitivity: 'base', ignorePunctuation: true, numeric: false });
    const studentsForReport = [...activeClass.students].sort((a: any, b: any) => collator.compare(a?.name || '', b?.name || ''));
    const rowStudentIds: string[] = studentsForReport.map((s: any) => s.id);
    const body = studentsForReport.map((student: any, index: number) => [
      (index + 1).toString(),
      student.name,
      ...columnsInOrder.map((col: any) => {
        const value = student.records[col.id];
        if (value === null || value === undefined) return '';
        if (exportType === 'excel') {
          if (col.type === ColumnType.CHECKBOX) {
            let ch = typeof value === 'string' ? value : (value === true ? '1' : (value === false ? '2' : '0'));
            if (ch === '1') return '✔';
            if (ch === '2') return '✗';
            return '-';
          }
          if (col.type === ColumnType.MULTI_CHECKBOX) {
            const slots = Math.max(1, Number((col as any).multiSlots) || 8);
            const raw: string = typeof value === 'string' ? value : ''.padEnd(slots, '0');
            const normalized = raw.split('').map(ch => (ch === '1' || ch === '2') ? ch : '0').join('');
            const arr = normalized.padEnd(slots, '0').slice(0, slots).split('');
            const symbols = arr.map(ch => ch === '1'
              ? '✔'
              : ch === '2'
                ? '✗'
                : '-'
            ).join('');
            return symbols;
          }
        } else {
          // PDF
          if (col.type === ColumnType.CHECKBOX) {
            let ch = typeof value === 'string' ? value : (value === true ? '1' : (value === false ? '2' : '0'));
            if (ch === '1') return `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid #16a34a;background:#d1fae5;border-radius:6px;text-align:center;vertical-align:middle;line-height:24px;font-size:18px;font-weight:bold;color:#16a34a;">✔</span>`;
            if (ch === '2') return `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid #dc2626;background:#fee2e2;border-radius:6px;text-align:center;vertical-align:middle;line-height:24px;font-size:18px;font-weight:bold;color:#dc2626;">✗</span>`;
            return `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid #cbd5e1;background:#f1f5f9;border-radius:6px;text-align:center;vertical-align:middle;line-height:24px;font-size:18px;font-weight:bold;color:#64748b;">–</span>`;
          }
          if (col.type === ColumnType.MULTI_CHECKBOX) {
            const slots = Math.max(1, Number((col as any).multiSlots) || 8);
            const raw: string = typeof value === 'string' ? value : ''.padEnd(slots, '0');
            const normalized = raw.split('').map(ch => (ch === '1' || ch === '2') ? ch : '0').join('');
            const arr = normalized.padEnd(slots, '0').slice(0, slots).split('');
            const symbols = arr.map(ch => {
              if (ch === '1') return `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid #16a34a;background:#d1fae5;border-radius:6px;text-align:center;vertical-align:middle;line-height:24px;font-size:18px;font-weight:bold;color:#16a34a;margin:1px;">✔</span>`;
              if (ch === '2') return `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid #dc2626;background:#fee2e2;border-radius:6px;text-align:center;vertical-align:middle;line-height:24px;font-size:18px;font-weight:bold;color:#dc2626;margin:1px;">✗</span>`;
              return `<span style="display:inline-block;width:24px;height:24px;border:1.5px solid #cbd5e1;background:#f1f5f9;border-radius:6px;text-align:center;vertical-align:middle;line-height:24px;font-size:18px;font-weight:bold;color:#64748b;margin:1px;">–</span>`;
            }).join('');
            return `<div style="display:flex;gap:2px;justify-content:center;align-items:center;">${symbols}</div>`;
          }
        }
        return value.toString();
      })
    ]);
    return { tableHeader, body, themeColor, rowStudentIds } as any;
  }

  const handleExportToExcel = () => {
    if (!activeClass || !activeSubject) return;

  const reportData = generateReportData('excel');
    if (!reportData) return;

  const { tableHeader, body, themeColor } = reportData;

    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "كشف درجات " + activeSubject.name,
      Author: settings.teacherName,
      CreatedDate: new Date()
    };
    wb.Workbook = { Views: [{ RTL: true }] };

    // Excel header/footer (not inside table)
    // Note: SheetJS supports headers/footers via ws['!headerFooter']
    // https://docs.sheetjs.com/docs/csf/features/headersfooters
    const ws_data = [
      tableHeader,
      ...body
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // --- STYLING ---
    const borderStyle = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    // لون الهيدر من themeColor، الأعمدة الأخرى أبيض
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFFFF" } },
      fill: { fgColor: { rgb: themeColor.substring(1) } },
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };
    const bodyStyleRight = {
      alignment: { horizontal: "right", vertical: "center" },
      border: borderStyle
    };
    const bodyStyleCenter = {
      alignment: { horizontal: "center", vertical: "center" },
      border: borderStyle
    };

    // Apply header style
    tableHeader.forEach((_h: any, i: number) => {
      const cellRef = XLSX.utils.encode_cell({c: i, r: 0});
      if(ws[cellRef]) ws[cellRef].s = headerStyle;
    });
    // Apply body styles
    body.forEach((row: any[], r: number) => {
      row.forEach((_cell: any, c: number) => {
        const cellRef = XLSX.utils.encode_cell({c: c, r: 1 + r});
        if(ws[cellRef]) {
          ws[cellRef].s = (c === 1) ? bodyStyleRight : bodyStyleCenter;
        }
      });
    });

    // أعمدة العرض
    const cols = tableHeader.map((h: any, i: number) => ({
      wch: i === 0 ? 5 : i === 1 ? 35 : Math.max(15, (h || '').length * 1.5)
    }));
    ws['!cols'] = cols;

    // إضافة الهيدر والفوتر للطباعة (SheetJS يدعم ذلك عبر !pageSetup)
    ws['!pageSetup'] = {
      orientation: 'landscape',
      fitToPage: true,
      horizontalCentered: true,
      verticalCentered: false,
      scale: 100,
      header: `&Cالمملكة العربية السعودية\nوزارة التعليم\n${settings.educationDirectorate}\nمدرسة: ${settings.schoolName}\nكشف متابعة وتقويم الطلاب\nالمادة: ${activeSubject.name} - الفصل: ${activeClass.name} - ${settings.semester} - العام الدراسي: ${settings.academicYear}`,
      footer: `&Lمعلم المادة: ${settings.teacherName}\nالتوقيع: ..........................&Rمدير المدرسة: ${settings.principalName}\nالتوقيع: ..........................`
    };

    XLSX.utils.book_append_sheet(wb, ws, 'كشف الدرجات');
    XLSX.writeFile(wb, `كشف-${activeClass.name}-${activeSubject.name}.xlsx`);
  };

  React.useImperativeHandle(ref, () => ({
    exportPdf: handleExportToPdf,
    exportExcel: handleExportToExcel
  }), [activeClass, activeSubject, settings, color]);

  const handleExportToPdf = () => {
    if (!activeClass || !activeSubject) return;

    const reportData = generateReportData();
    if (!reportData) return;
    const { tableHeader, body, rowStudentIds } = reportData as any;

    const headerHtml = `
      <div style="display:flex; direction:ltr; align-items:center; margin-bottom:16px; text-align:center;">
        <!-- يسار: الشعار -->
        <div style="flex:1; text-align:left; display:flex; align-items:center;">
          ${settings.logoBase64 ? `<img src='${settings.logoBase64}' alt='شعار الوزارة' style='height:100px; width:auto; display:inline-block; object-fit:contain;' />` : ''}
        </div>
        <!-- وسط: العنوان -->
        <div style="flex:1; text-align:center;">
          <h1 style="font-size:22px; margin:0;">سجل متابعة وتقويم الطلاب</h1>
        </div>
        <!-- يمين: الترويسة -->
        <div style="flex:1; text-align:right;">
          <div style='font-size:16px;font-weight:bold;'>المملكة العربية السعودية</div>
          <div style='font-size:14px;'>وزارة التعليم</div>
          <div style='font-size:14px;'>${settings.educationDirectorate}</div>
          <div style='font-size:14px;'>مدرسة: ${settings.schoolName}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; font-weight: bold;">
        <span>المادة: ${activeSubject.name}</span>
        <span>الفصل: ${activeClass.name}</span>
        <span>${settings.semester}</span>
        <span>العام الدراسي: ${settings.academicYear}</span>
      </div>
    `;

    // دالة لجلب تخصيص الخلية من localStorage
    function getCellStyle(studentId: string, colId: string) {
      try {
        const key = `colorfulcell-${studentId}-${colId}`;
        const data = localStorage.getItem(key);
        if (!data) return '';
        const { bgColor, textColor, fontSize, textAlign } = JSON.parse(data);
        let style = '';
        if (bgColor) style += `background:${bgColor};`;
        if (textColor) style += `color:${textColor};`;
        if (fontSize) style += `font-size:${fontSize};`;
        if (textAlign) style += `text-align:${textAlign};`;
        return style;
      } catch { return ''; }
    }

    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            ${tableHeader.map((h: any) => `<th style="border: 1px solid #333; padding: 8px; background-color: ${themeColor}; color: ${getContrastColor(themeColor)}; text-align: center; font-weight: bold; font-family: 'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif !important;">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${body.map((row: any[], rowIdx: number) => {
            const studentId = (rowStudentIds as string[])[rowIdx];
            const student = activeClass.students.find((s: any) => s.id === studentId) || activeClass.students[rowIdx];
            return `
              <tr>
                ${row.map((cell: any, cellIndex: number) => {
                  // cellIndex: 0 => serial, 1 => name, 2+ => columnsInOrder
                  if (cellIndex < 2) {
                    // عمود التسلسل أو الاسم: لا تخصيص
                    return `<td style="border: 1px solid #333; padding: 8px; text-align: ${cellIndex === 1 ? 'right' : 'center'};">${cell}</td>`;
                  } else {
                    const col = columnsInOrder[cellIndex - 2];
                    const style = getCellStyle(student.id, col.id);
                    // Enforce center alignment for all non-name cells in PDF
                    return `<td style=\"border: 1px solid #333; padding: 8px; text-align:center; ${style}\">${cell}</td>`;
                  }
                }).join('')}
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    `;

    const footerHtml = `
      <div style="display: flex; justify-content: space-around; margin-top: 40px; font-size: 14px; font-weight: bold;">
        <div>
          <p>معلم المادة: ${settings.teacherName}</p>
          <p style="margin-top: 25px;">التوقيع: ..........................</p>
        </div>
        <div>
          <p>مدير المدرسة: ${settings.principalName}</p>
          <p style="margin-top: 25px;">التوقيع: ..........................</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
  printWindow.document.write('<html><head><title>طباعة سجل - ' + activeSubject.name + '</title><style>@import url(\'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap\'); body { font-family: \'Almarai\',\'Cairo\',\'Noto Sans Arabic\',\'Amiri\',sans-serif; direction: rtl; margin: 20px; } table { font-size: 12px; } @media print { @page { size: A4 landscape; margin: 15mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } } </style></head><body>' + headerHtml + tableHtml + footerHtml + '<script>window.onload = function() { if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function() { setTimeout(function() { window.print(); window.onafterprint = function() { window.close(); } }, 100); }); } else { setTimeout(function() { window.print(); window.onafterprint = function() { window.close(); } }, 500); } } </script></body></html>');
        printWindow.document.close();
    } else {
        toast.error('فشل فتح نافذة الطباعة. الرجاء التأكد من السماح بالنوافذ المنبثقة.');
    }
  };

  if (!activeClass || !activeSubject) {
    return (
  <div className="flex flex-col items-center justify-center w-full h-[70vh] min-h-[350px] text-center p-2 bg-white rounded-xl shadow-sm m-0">
  <ClipboardListIcon className="w-16 h-16 text-slate-400 mb-4" />
  <h2 className="text-base font-bold text-slate-700">
          {activeClass ? 'مرحباً بك في فصل ' + activeClass.name : 'مرحباً بك في سجل الدرجات'}
        </h2>
  <p className="mt-2 max-w-md text-xs text-slate-500">
          {activeClass ? 'الرجاء تحديد مادة دراسية من القائمة الجانبية، أو إضافة مادة جديدة للبدء في رصد الدرجات.' : 'الرجاء تحديد فصل دراسي أو إنشاء فصل جديد من القائمة الجانبية للبدء.'}
        </p>
        {/* إظهار التول بار دائمًا */}
        <div className="mt-6 w-full flex justify-center">
          <MainToolbar
            onAddClass={onAddClass}
            onAddSubject={onAddSubject}
            onAddStudent={() => {}}
            onAddColumn={() => {}}
            onImportStudents={() => {}}
            onExportExcel={() => {}}
            onExportPdf={() => {}}
            onOpenSettings={onOpenSettings}
            onOpenCustomize={onOpenCustomize}
            onSaveTemplate={props.onSaveTemplate}
            onUseTemplate={props.onUseTemplate}
            classType={activeClass?.type}
          />
        </div>
      </div>
    );
  }




  return (
    <div className="w-full min-h-screen flex flex-col p-0 m-0" style={{marginTop:0,paddingTop:0,border:'none'}}>
      {/* فلاتر الفصول والمواد */}
      {classes && classes.length > 0 && (
        <div className="w-full flex justify-center mt-2">
          <ClassSubjectFilters
            classes={classes}
            activeClassId={activeClassId}
            activeSubjectId={activeSubjectId}
            onClassChange={onClassChange}
            onSubjectChange={onSubjectChange}
          />
        </div>
      )}
      <MainToolbar
        onAddClass={onAddClass}
        onAddSubject={onAddSubject}
        onAddStudent={() => setIsAddStudentModalOpen(true)}
        onAddColumn={() => setIsAddColumnModalOpen(true)}
        onImportStudents={() => setIsImportModalOpen(true)}
        onDeleteAllStudents={handleDeleteAllStudents}
        onExportExcel={onExportExcel}
        onExportPdf={onExportPdf}
        onOpenSettings={onOpenSettings}
        onOpenCustomize={onOpenCustomize}
        onSaveTemplate={props.onSaveTemplate}
        onUseTemplate={props.onUseTemplate}
        classType={activeClass?.type}
        onAdminExport={() => setIsAdminModalOpen(true)}
      />



      {isAdminModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-2 sm:p-4" onClick={() => setIsAdminModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-[95vw] sm:w-[90vw] md:max-w-2xl lg:max-w-3xl relative max-h-[85vh] overflow-y-auto p-4 sm:p-6 md:p-8" onClick={e => e.stopPropagation()}>
            <button className="absolute left-3 top-3 text-slate-500 hover:text-red-500 text-xl font-bold" onClick={() => setIsAdminModalOpen(false)} aria-label="إغلاق">&times;</button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-800">شاشة تصدير الكشوف الإدارية</h2>
            <div className="mb-4 text-slate-700 text-sm">
              <label className="block mb-2 font-semibold">اسم الكشف:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                <div className="sm:col-span-2 flex items-center gap-2">
                  <div className="relative w-full" ref={reportDropdownRef}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-sm flex items-center justify-between"
                      aria-haspopup="listbox"
                      aria-expanded={isReportDropdownOpen}
                      onClick={() => setIsReportDropdownOpen(o => !o)}
                      onKeyDown={handleReportKeyDown}
                    >
                      <span className="truncate">{adminReportName || 'اختر اسم الكشف'}</span>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-slate-500">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isReportDropdownOpen && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
                        <ul role="listbox" aria-label="اختيار اسم الكشف">
                          {reportNames.map((name: string, idx: number) => {
                            const isActive = idx === reportHighlightIndex || name === adminReportName;
                            return (
                              <li
                                key={idx}
                                id={`report-opt-${idx}`}
                                role="option"
                                aria-selected={name === adminReportName}
                                className={`px-3 py-2 cursor-pointer text-sm ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                onMouseEnter={() => setReportHighlightIndex(idx)}
                                onMouseDown={(e) => e.preventDefault()} // prevent button blur
                                onClick={() => { setAdminReportName(name); setIsReportDropdownOpen(false); }}
                              >
                                {name}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                  {reportNames.length > 1 && (
                    <button className="shrink-0 text-red-500 hover:text-red-700 text-lg font-extrabold" style={{fontSize:'1.5rem'}} title="حذف اسم الكشف المحدد" onClick={() => {
                      const idx = reportNames.findIndex((n: string) => n === adminReportName);
                      if (idx !== -1 && reportNames.length > 1) {
                        const newList = reportNames.filter((_n: string, i: number) => i !== idx);
                        setReportNames(newList);
                        setAdminReportName(newList[0] || '');
                      }
                    }}>×</button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" className="flex-1 px-3 py-2 rounded border border-slate-300 bg-slate-50 text-sm" value={newReportName} onChange={e => setNewReportName(e.target.value)} placeholder="إضافة اسم جديد..." />
                  <button className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded text-xs sm:text-sm font-semibold" onClick={() => {
                    if (newReportName && !reportNames.includes(newReportName)) {
                      setReportNames([...reportNames, newReportName]);
                      setAdminReportName(newReportName);
                      setNewReportName('');
                    }
                  }}>إضافة</button>
                </div>
              </div>
              <label className="block mb-2 font-semibold">الموقعون:</label>
              <div className="space-y-3">
                {adminSigners.map((signer, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 items-center">
                    <div className="relative md:col-span-2" ref={idx === isRoleDropdownOpenIndex ? roleDropdownRef : undefined}>
                      <button
                        type="button"
                        className="w-full px-2 py-2 rounded border border-slate-300 text-sm bg-white text-slate-700 flex items-center justify-between"
                        aria-haspopup="listbox"
                        aria-expanded={isRoleDropdownOpenIndex === idx}
                        onClick={() => {
                          setIsRoleDropdownOpenIndex(v => v === idx ? null : idx);
                          setRoleHighlightIndex(Math.max(0, roles.findIndex((r: string) => r === signer.role)));
                        }}
                        onKeyDown={handleRoleKeyDown(idx, signer.role)}
                      >
                        <span className="truncate">{signer.role || 'اختر المنصب'}</span>
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-slate-500">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {isRoleDropdownOpenIndex === idx && (
                        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md border border-slate-200 bg-white shadow-lg ring-1 ring-black/5">
                          <ul role="listbox" aria-label="اختيار المنصب">
                            {roles.map((role: string, rIdx: number) => {
                              const isActive = rIdx === roleHighlightIndex || role === signer.role;
                              return (
                                <li
                                  key={rIdx}
                                  role="option"
                                  aria-selected={role === signer.role}
                                  className={`px-3 py-2 cursor-pointer text-sm ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'}`}
                                  onMouseEnter={() => setRoleHighlightIndex(rIdx)}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    updateAdminSigner(idx, { ...signer, role });
                                    setIsRoleDropdownOpenIndex(null);
                                  }}
                                >
                                  {role}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <input type="text" className="px-2 py-2 rounded border border-slate-300 text-sm md:col-span-2" value={signer.name} onChange={e => updateAdminSigner(idx, { ...signer, name: e.target.value })} placeholder="اسم الموقع" />
                    <div className="flex items-center gap-2 md:justify-end">
                      <input type="text" className="w-28 px-2 py-2 rounded border border-slate-300 text-sm" value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="إضافة منصب..." />
                      <button className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold" onClick={() => {
                        if (newRole && !roles.includes(newRole)) {
                          setRoles([...roles, newRole]);
                          updateAdminSigner(idx, { ...signer, role: newRole });
                          setNewRole('');
                        }
                      }}>+</button>
                      <button className="px-3 py-2 text-red-600 hover:text-red-700 rounded text-lg font-bold" title="حذف الموقع" onClick={() => removeAdminSigner(idx)}>&times;</button>
                    </div>
                  </div>
                ))}
                <button className="mt-1 px-3 py-2 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs sm:text-sm font-semibold" onClick={addAdminSigner}>+ إضافة موقع</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              <button
                className="w-full py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 font-semibold text-sm"
                onClick={handleExportAdminExcel}
              >
                تصدير Excel
              </button>
              <button
                className="w-full py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold text-sm"
                onClick={handleExportAdminPdf}
              >
                تصدير PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="full-page-table w-full h-full flex-1 flex flex-col pe-3 md:pe-4 relative">
        {/* Left gutter overlay to align table edge with padding (mask any bleed) */}
        <div className="absolute inset-y-0 left-0 w-3 md:w-4 bg-white pointer-events-none" aria-hidden="true"></div>
        <div className="full-page-table-container w-full h-full flex-1 overflow-x-auto overflow-y-hidden" style={{ direction: 'rtl' }}>
          <StudentTable
            columns={columnsInOrder}
            students={paginatedStudents}
            onEditColumn={(columnId, updatedData) => onEditColumn(activeClass.id, activeSubject.id, String(columnId), updatedData)}
            onDeleteColumn={(columnId, columnName) => onDeleteColumn(activeClass.id, activeSubject.id, String(columnId), columnName)}
            onDeleteStudent={(studentId, studentName) => onDeleteStudent(activeClass.id, String(studentId), studentName)}
            onFillColumn={(columnId, value) => onFillColumn(activeClass.id, activeSubject.id, String(columnId), value)}
            onUpdateStudentData={(studentId, columnId, value) => onUpdateStudentData(activeClass.id, String(studentId), String(columnId), value)}
            themeColor={themeColor}
            nameSortOrder={nameSortOrder}
            onNameSortChange={setNameSortOrder}
            // لا تمرر دالة onColumnOrderChange
          />
        </div>
      </div>

      {totalStudents > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-2 bg-white rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2 sm:mb-0">
                <span>عرض</span>
                <select 
                    value={rowsPerPage} 
                    onChange={e => {
                        setRowsPerPage(Number(e.target.value));
                        handleSetPage(1); // Reset to first page
                    }}
                    className="p-1 border rounded bg-slate-50 focus:ring-1 focus:ring-emerald-500"
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
                <span>صفوف</span>
            </div>

            <span className="text-sm text-slate-600 mb-2 sm:mb-0">
                عرض {Math.min(startIndex + 1, totalStudents)}-{Math.min(endIndex, totalStudents)} من {totalStudents}
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleSetPage(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="الصفحة السابقة"
                >
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
                <span className="text-sm font-semibold">
                    صفحة {currentPage} من {totalPages || 1}
                </span>
                <button
                    onClick={() => handleSetPage(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage >= totalPages || totalStudents === 0}
                    className="p-2 rounded-md hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="الصفحة التالية"
                >
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
            </div>
          </div>
      )}

      {isAddColumnModalOpen && (
        <AddColumnModal
          onClose={() => setIsAddColumnModalOpen(false)}
          onAddColumn={(name, type, options, extra) => {
            onAddColumn(activeClass.id, activeSubject.id, name, type, options, extra as any);
            setIsAddColumnModalOpen(false);
          }}
        />
      )}
      {isImportModalOpen && (
        <ImportStudentsModal
          onClose={() => setIsImportModalOpen(false)}
          onImport={(importedData, studentNameColumn, columnsToImport) => {
            onImportStudents(activeClass.id, activeSubject.id, importedData, studentNameColumn, columnsToImport as any);
            setIsImportModalOpen(false);
          }}
        />
      )}
      {isAddStudentModalOpen && (
        <AddStudentModal
          onClose={() => setIsAddStudentModalOpen(false)}
          onAddStudent={(name) => {
            onAddStudent(activeClass.id, name);
            setIsAddStudentModalOpen(false);
          }}
        />
      )}

      {/* Delete All Names Confirmation Modal */}
      {isDeleteAllModalOpen && (
        <SimpleModal
          isOpen={isDeleteAllModalOpen}
          onClose={() => setIsDeleteAllModalOpen(false)}
          onConfirm={confirmDeleteAllStudents}
          title="تأكيد حذف جميع الأسماء"
          message={`هل أنت متأكد من حذف جميع الأسماء؟

سيتم حذف ${activeClass?.students?.length || 0} اسم نهائياً
هذا الإجراء لا يمكن التراجع عنه`}
        />
      )}
    </div>
  );
}

const StudentDataView = React.forwardRef<any, StudentDataViewProps>(StudentDataViewImpl);
export default StudentDataView;