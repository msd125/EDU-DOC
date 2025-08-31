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
import ConfirmModal from './ConfirmModal';
import { ClipboardListIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';
import { getColumnOrder, orderColumns } from '../utils/drag-drop/columnUtils';

// تم الاستغناء عن الزر العائم لصالح شريط الأدوات العلوي

// @ts-ignore
declare const XLSX: any;

interface StudentDataViewProps {
  activeClass: Class | undefined;
  activeSubject: Subject | undefined;
  onAddColumn: (classId: string, subjectId: string, name: string, type: ColumnType, options?: string[]) => void;
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
    const reportData = generateReportData();
    if (!reportData) return;
    const { tableHeader, body } = reportData;
    // School header
  let html = `<div style=\"direction:rtl;font-family:'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif;\">`;
    html += `<div style='text-align:center;margin-bottom:2px;font-size:18px;font-weight:bold;'>المملكة العربية السعودية</div>`;
    html += `<div style='text-align:center;margin-bottom:8px;font-size:16px;'>وزارة التعليم</div>`;
    html += `<div style='text-align:center;margin-bottom:8px;font-size:16px;'>${settings.educationDirectorate || ''}</div>`;
    html += `<div style='text-align:center;margin-bottom:8px;font-size:16px;'>مدرسة: ${settings.schoolName || ''}</div>`;
    html += `<h2 style='text-align:center;margin-bottom:16px;'>${adminReportName || ''}</h2>`;
    // Ensure themeColor is valid hex
    let pdfColor = themeColor || '#2E8540';
    // إذا كان اللون أبيض أو شفاف أو غير محدد، استخدم لون غامق افتراضي
    if (!pdfColor || pdfColor === '#fff' || pdfColor === '#ffffff' || pdfColor === '#FFF' || pdfColor === '#FFFFFF' || pdfColor === 'white' || pdfColor === 'transparent') {
      pdfColor = '#2E8540';
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(pdfColor)) {
      if (/^#[0-9A-Fa-f]{3}$/.test(pdfColor)) {
        pdfColor = '#' + pdfColor.substring(1).split('').map((x:any) => x + x).join('');
      } else {
        pdfColor = '#2E8540';
      }
    }
    html += `<table border='1' cellspacing='0' cellpadding='4' style='width:100%;border-collapse:collapse;margin-bottom:24px;'>`;
    // دالة التباين
    function getContrastColor(hex) {
      if (!hex) return '#fff';
      let c = hex.replace('#', '');
      if (c.length === 3) c = c.split('').map(x => x + x).join('');
      const num = parseInt(c, 16);
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance > 170 ? '#222' : '#fff';
    }
    html += '<thead><tr>' + tableHeader.map(h => `<th style="background:${pdfColor} !important;color:${getContrastColor(pdfColor)};text-align:center;font-weight:bold;">${h}</th>`).join('') + '</tr></thead>';
    html += '<tbody>';
    body.forEach(row => {
      html += '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    // Signers table with signature column
    html += `<table border='1' cellspacing='0' cellpadding='4' style='width:70%;border-collapse:collapse;margin:auto;'>`;
    html += `<tr>` +
      [`م`, `المنصب`, `اسم الموقع`, `التوقيع`].map(h => `<th style=\"background:${pdfColor} !important;color:${getContrastColor(pdfColor)};text-align:center;font-weight:bold;\">${h}</th>`).join('') +
      `</tr>`;
    adminSigners.filter((s: any) => s.role || s.name).forEach((s: any, idx: number) => {
      html += `<tr><td>${idx + 1}</td><td>${s.role}</td><td>${s.name}</td><td style='width:120px;'></td></tr>`;
    });
    html += '</table>';
    html += '</div>';
    const win = window.open('', '_blank');
    if (win) {
  const style = `@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap');\nbody{font-family:'Almarai','Cairo','Noto Sans Arabic','Amiri',sans-serif;}\ntable thead th { position: sticky; top: 0; z-index: 2; background: ${pdfColor} !important; }\n@media print { th, td { -webkit-print-color-adjust: exact; print-color-adjust: exact; } thead { display: table-header-group; } tfoot { display: table-footer-group; } }`;
      win.document.write(`<html><head><title>${adminReportName || ''}</title><style>${style}</style></head><body>${html}</body></html>`);
      win.document.close();
      win.print();
    } else {
      toast.error('تعذر فتح نافذة الطباعة.');
    }
  };



  // تصدير كشف الإدارة المدرسية بترويسة وتذييل مخصصين
  const handleExportAdminExcel = () => {
    if (!activeClass || !activeSubject) return;
    const reportData = generateReportData();
    if (!reportData) return;
    const { tableHeader, body, themeColor } = reportData;
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: adminReportName,
      Author: '',
      CreatedDate: new Date()
    };
    wb.Workbook = { Views: [{ RTL: true }] };
    // School header rows
    const headerRows = [
      ['المملكة العربية السعودية'],
      ['وزارة التعليم'],
      [settings.educationDirectorate || ''],
      [`مدرسة: ${settings.schoolName || ''}`],
      [adminReportName || ''],
      [],
    ];
    // Table data
    const tableRows = [tableHeader, ...body];
    // Signers with signature column
    const signersRows = [
      ['المنصب', 'اسم الموقع', 'التوقيع'],
      ...adminSigners.filter(s => s.role || s.name).map(s => [s.role, s.name, ''])
    ];
    // Merge all
    const ws_data = [
      ...headerRows,
      ...tableRows,
      [],
      ...signersRows
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // Styling
    const borderStyle = {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } }
    };
    // Ensure themeColor is 6 hex digits (remove #, pad if needed)
    let excelColor = (themeColor || '#2E8540').replace('#', '');
    if (excelColor.length === 3) excelColor = excelColor.split('').map(x => x + x).join('');
    if (excelColor.length < 6) excelColor = excelColor.padEnd(6, '0');
    // If color is too light, darken it for Excel header
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
    // Check if color is too light (all channels > 220)
    let num = parseInt(excelColor, 16);
    let r = (num >> 16) & 0xff;
    let g = (num >> 8) & 0xff;
    let b = num & 0xff;
    if (r > 220 && g > 220 && b > 220) excelColor = darken(excelColor, 0.3);
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFFFF' }, name: 'Noto Sans Arabic' },
      fill: { fgColor: { rgb: excelColor.toUpperCase() } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderStyle
    };
    const bodyStyleRight = {
      alignment: { horizontal: 'right', vertical: 'center' },
      border: borderStyle,
      font: { name: 'Noto Sans Arabic' }
    };
    const bodyStyleCenter = {
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderStyle,
      font: { name: 'Noto Sans Arabic' }
    };
    // Apply header style to table header row
    const tableHeaderRowIdx = headerRows.length;
    tableHeader.forEach((_h: any, i: number) => {
      const cellRef = XLSX.utils.encode_cell({c: i, r: tableHeaderRowIdx});
      if(ws[cellRef]) ws[cellRef].s = headerStyle;
    });
    // Apply body styles
    body.forEach((row: any[], r: number) => {
      row.forEach((_cell: any, c: number) => {
        const cellRef = XLSX.utils.encode_cell({c: c, r: tableHeaderRowIdx + 1 + r});
        if(ws[cellRef]) {
          ws[cellRef].s = (c === 1) ? bodyStyleRight : bodyStyleCenter;
        }
      });
    });
    // Column widths
    const cols = tableHeader.map((h, i) => ({
      wch: i === 0 ? 5 : i === 1 ? 35 : Math.max(15, (h || '').length * 1.5)
    }));
    ws['!cols'] = cols;
    ws['!pageSetup'] = {
      orientation: 'landscape',
      fitToPage: true,
      horizontalCentered: true,
      verticalCentered: false,
      scale: 100
    };
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
    apiKey,
    onRequestApiKey,
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
  const [reportNames, setReportNames] = useState([
    'كشف الحضور',
    'كشف التطوير المهني',
    'كشف الغياب',
    'كشف درجات',
  ]);
  const [adminReportName, setAdminReportName] = useState(reportNames[0] || '');
  const [newReportName, setNewReportName] = useState('');

  // قائمة المناصب الافتراضية مع إمكانية الإضافة
  const [roles, setRoles] = useState([
    'عضو لجنة',
    'مدير المدرسة',
    'الموجة الطلابي',
    'وكيل شئون الطلاب',
    'وكيل شئون المعلمين',
    'رئيس لجنة',
    'أخرى...'
  ]);
  const [adminSigners, setAdminSigners] = useState([{role: roles[0] || '', name: ''}]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // حالة للفرز الأبجدي للأسماء
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // حالة لنافذة تأكيد حذف جميع الطلاب
  const [isConfirmDeleteAllOpen, setIsConfirmDeleteAllOpen] = useState(false);
  
  // دالة لحذف جميع الطلاب - تفتح نافذة تأكيد فقط
  const handleDeleteAllStudents = () => {
    if (activeClass && activeClass.students && activeClass.students.length > 0) {
      // فتح نافذة التأكيد بدلاً من حذف الطلاب مباشرة
      setIsConfirmDeleteAllOpen(true);
    }
  };
  
  // عند تأكيد حذف جميع الطلاب - هذا ينفذ بعد النقر على "حذف الجميع" في نافذة التأكيد
  const confirmDeleteAllStudents = () => {
    if (activeClass && activeClass.students && activeClass.students.length > 0 && props.setClasses) {
      const studentsCount = activeClass.students.length;
      
      try {
        // إخفاء نافذة التأكيد
        setIsConfirmDeleteAllOpen(false);
        
        // استخدام دالة setClasses المستلمة من App.tsx
        props.setClasses((prevClasses: Class[]) => 
          prevClasses.map((cls: Class) => 
            cls.id === activeClass.id 
              ? { ...cls, students: [] } // حذف جميع الطلاب من الصف الحالي
              : cls
          )
        );
        
        // إظهار رسالة نجاح
        toast.success(`تم حذف ${studentsCount} اسم بنجاح`);
        
      } catch (error) {
        console.error('خطأ أثناء حذف جميع الأسماء:', error);
        toast.error('حدث خطأ أثناء محاولة حذف جميع الأسماء');
      }
    } else if (!props.setClasses) {
      // إذا لم يتم تمرير دالة setClasses
      toast.error('حدث خطأ: لا يمكن تحديث البيانات');
      setIsConfirmDeleteAllOpen(false);
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

  const generateReportData = () => {
    if (!activeClass || !activeSubject) return null;
    // استخدم الأعمدة المرتبة (columnsInOrder) بدلاً من activeSubject.columns
    const tableHeader = ['م', 'الاسم', ...columnsInOrder.map((c: any) => c.name)];
    const body = activeClass.students.map((student: any, index: number) => [
      (index + 1).toString(),
      student.name,
      ...columnsInOrder.map((col: any) => {
        const value = student.records[col.id];
        if (value === null || value === undefined) return '';
        if (col.type === ColumnType.CHECKBOX) return value ? '✔' : '✗';
        return value.toString();
      })
    ]);
    return { tableHeader, body, themeColor };
  }

  const handleExportToExcel = () => {
    if (!activeClass || !activeSubject) return;

    const reportData = generateReportData();
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
    const cols = tableHeader.map((h, i) => ({
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
    const { tableHeader, body } = reportData;

    const headerHtml = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; text-align: center;">
        <div style="text-align: right;">
          <div>المملكة العربية السعودية</div>
          <div>وزارة التعليم</div>
          <div>${settings.educationDirectorate}</div>
          <div>مدرسة: ${settings.schoolName}</div>
        </div>
        <div style="text-align: center;">
          <h1 style="font-size: 20px; margin-top: 20px; margin-bottom: 10px;">سجل متابعة وتقويم الطلاب</h1>
        </div>
        <div style="text-align: left; visibility: hidden; min-width: 200px;">
          <!-- Placeholder for alignment -->
          <div>المملكة العربية السعودية</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; font-weight: bold;">
        <span>المادة: ${activeSubject.name}</span>
        <span>الفصل: ${activeClass.name}</span>
        <span>${settings.semester}</span>
        <span>العام الدراسي: ${settings.academicYear}</span>
      </div>
    `;

    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            ${tableHeader.map(h => `<th style="border: 1px solid #333; padding: 8px; background-color: ${themeColor}; color: ${getContrastColor(themeColor)}; text-align: center; font-weight: bold;">${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${body.map((row: any[]) => `
            <tr>
              ${row.map((cell: any, cellIndex: number) => '<td style="border: 1px solid #333; padding: 8px; text-align: ' + (cellIndex === 1 ? 'right' : 'center') + ';">' + cell + '</td>').join('')}
            </tr>
          `).join('')}
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
  printWindow.document.write('<html><head><title>طباعة سجل - ' + activeSubject.name + '</title><style>@import url(\'https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap\'); body { font-family: \'Almarai\',\'Cairo\',\'Noto Sans Arabic\',\'Amiri\',sans-serif; direction: rtl; margin: 20px; } table { font-size: 12px; } @media print { @page { size: A4 landscape; margin: 15mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } } </style></head><body>' + headerHtml + tableHtml + footerHtml + '<script>window.onload = function() { setTimeout(function() { window.print(); window.onafterprint = function() { window.close(); } }, 100); } </script></body></html>');
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-2xl w-full relative" style={{minWidth:'520px', maxWidth:'700px'}}>
            <button className="absolute left-3 top-3 text-slate-500 hover:text-red-500 text-xl font-bold" onClick={() => setIsAdminModalOpen(false)}>&times;</button>
            <h2 className="text-lg font-bold mb-4 text-slate-800">تصدير كشف منسوبـي المدرسة</h2>
            <div className="mb-4 text-slate-700 text-sm">
              <label className="block mb-2 font-semibold">اسم الكشف:</label>
              <div className="flex gap-2 mb-4">
                <div className="flex-[2] flex items-center gap-2">
                  <select className="w-full px-3 py-2 rounded border border-slate-300 bg-slate-50 text-sm" value={adminReportName} onChange={e => setAdminReportName(e.target.value)}>
                    {reportNames.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                  {reportNames.length > 1 && (
                    <button className="text-red-500 hover:text-red-700 text-lg font-extrabold ml-2" style={{fontSize:'1.5rem'}} title="حذف اسم الكشف المحدد" onClick={() => {
                      const idx = reportNames.findIndex(n => n === adminReportName);
                      if (idx !== -1 && reportNames.length > 1) {
                        const newList = reportNames.filter((n, i) => i !== idx);
                        setReportNames(newList);
                        setAdminReportName(newList[0] || '');
                      }
                    }}>×</button>
                  )}
                </div>
                <input type="text" className="flex-[2] px-3 py-2 rounded border border-slate-300 bg-slate-50 text-sm" value={newReportName} onChange={e => setNewReportName(e.target.value)} placeholder="إضافة اسم جديد..." />
                <button className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold" onClick={() => {
                  if (newReportName && !reportNames.includes(newReportName)) {
                    setReportNames([...reportNames, newReportName]);
                    setAdminReportName(newReportName);
                    setNewReportName('');
                  }
                }}>إضافة</button>
              </div>
              <label className="block mb-2 font-semibold">الموقعون:</label>
              <div className="space-y-2">
                {adminSigners.map((signer, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <select className="px-2 py-1 rounded border border-slate-300 text-sm bg-white text-slate-700" value={signer.role} onChange={e => updateAdminSigner(idx, { ...signer, role: e.target.value })}>
                      {roles.map((role, i) => (
                        <option key={i} value={role}>{role}</option>
                      ))}
                    </select>
                    {roles.length > 1 && (
                      <button className="text-red-500 hover:text-red-700 text-xs font-bold ml-1" title="حذف المنصب المحدد" onClick={() => {
                        const idxRole = roles.findIndex(r => r === signer.role);
                        if (idxRole !== -1 && roles.length > 1) {
                          const newRoles = roles.filter((r, i) => i !== idxRole);
                          setRoles(newRoles);
                          setAdminSigners(signers => signers.map(s => s.role === signer.role ? { ...s, role: newRoles[0] || '' } : s));
                        }
                      }}>×</button>
                    )}
                    <input type="text" className="flex-[2] px-2 py-1 rounded border border-slate-300 text-sm" value={signer.name} onChange={e => updateAdminSigner(idx, { ...signer, name: e.target.value })} placeholder="اسم الموقع" />
                    <input type="text" className="w-24 px-2 py-1 rounded border border-slate-300 text-sm" value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="إضافة منصب..." />
                    <button className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold" onClick={() => {
                      if (newRole && !roles.includes(newRole)) {
                        setRoles([...roles, newRole]);
                        updateAdminSigner(idx, { ...signer, role: newRole });
                        setNewRole('');
                      }
                    }}>+</button>
                    <button className="text-red-500 hover:text-red-700 text-lg font-bold px-2" title="حذف" onClick={() => removeAdminSigner(idx)}>&times;</button>
                  {adminSigners.length > 1 && (
                    <button className="text-red-500 hover:text-red-700 text-lg font-bold px-2" title="حذف الموقع" onClick={() => removeAdminSigner(idx)}>&times;</button>
                  )}
                  </div>
                ))}
                <button className="mt-2 px-3 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs font-semibold" onClick={addAdminSigner}>+ إضافة موقع</button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                className="flex-1 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 font-semibold text-sm"
                onClick={handleExportAdminExcel}
              >
                تصدير Excel
              </button>
              <button
                className="flex-1 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold text-sm"
                onClick={handleExportAdminPdf}
              >
                تصدير PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex-1 flex flex-col items-center justify-start" style={{marginTop:0,paddingTop:0,border:'none'}}>
        <div className="w-full max-w-6xl 2xl:max-w-4xl overflow-x-auto custom-scroll relative" style={{ direction: 'rtl', margin: '0 auto', marginTop: 0, paddingTop: 0, top: 0, border:'none' }}>
          <StudentTable
            columns={columnsInOrder}
            students={paginatedStudents}
            onEditColumn={(columnId, updatedData) => onEditColumn(activeClass.id, activeSubject.id, String(columnId), updatedData)}
            onDeleteColumn={(columnId, columnName) => onDeleteColumn(activeClass.id, activeSubject.id, String(columnId), columnName)}
            onDeleteStudent={(studentId, studentName) => onDeleteStudent(activeClass.id, String(studentId), studentName)}
            onDeleteAllStudents={handleDeleteAllStudents}
            onFillColumn={(columnId, value) => onFillColumn(activeClass.id, activeSubject.id, String(columnId), value)}
            onUpdateStudentData={(studentId, columnId, value) => onUpdateStudentData(activeClass.id, String(studentId), String(columnId), value)}
            themeColor={themeColor}
            nameSortOrder={nameSortOrder}
            onNameSortChange={setNameSortOrder}
            // لا تمرر دالة onColumnOrderChange
          />
          {/* شريط تمرير سفلي ظاهر دائماً عند الحاجة */}
          <div className="w-full overflow-x-auto mt-1" style={{ height: 12 }}>
            <div style={{ width: '1200px', height: 1 }} />
          </div>
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
                        setCurrentPage(1); // Reset to first page
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
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
          onAddColumn={(name, type, options) => {
            onAddColumn(activeClass.id, activeSubject.id, name, type, options);
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
      
      {/* نافذة تأكيد حذف جميع الأسماء */}
      {isConfirmDeleteAllOpen && (
        <ConfirmModal
          message={`هل أنت متأكد من أنك تريد حذف جميع الأسماء (${activeClass?.students?.length || 0})؟ لا يمكن التراجع عن هذا الإجراء.`}
          confirmLabel="حذف الجميع"
          onConfirm={confirmDeleteAllStudents}
          onCancel={() => setIsConfirmDeleteAllOpen(false)}
        />
      )}
    </div>
  );
}

const StudentDataView = React.forwardRef<any, StudentDataViewProps>(StudentDataViewImpl);
export default StudentDataView;