import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Class, Subject, ColumnType, Settings } from '../types';
import StudentTable from './StudentTable';
import AddColumnModal from './AddColumnModal';
import ImportStudentsModal from './ImportStudentsModal';
import AddStudentModal from './AddStudentModal';
import { ClipboardListIcon, UserPlusIcon, PlusCircleIcon, DownloadIcon, ChevronRightIcon, ChevronLeftIcon } from './Icons';

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
  onUpdateStudentData: (classId: string, studentId: string, columnId: string, value: any) => void;
  onDeleteStudent: (classId: string, studentId: string, studentName: string) => void;
  settings: Settings;
  apiKey: string | null;
  onRequestApiKey: () => void;
}

const StudentDataView: React.FC<StudentDataViewProps> = ({ 
    activeClass, activeSubject, onAddColumn, onDeleteColumn, onEditColumn, onFillColumn, onImportStudents, onAddStudent, onUpdateStudentData, onDeleteStudent, settings, apiKey, onRequestApiKey
}) => {
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  
  const themeColor = activeSubject?.themeColor || '#2E8540';

  // Pagination Logic
  const totalStudents = activeClass?.students.length || 0;
  const totalPages = Math.ceil(totalStudents / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedStudents = activeClass?.students.slice(startIndex, endIndex) || [];

  const generateReportData = () => {
    if (!activeClass || !activeSubject) return null;
    const tableHeader = ['م', 'اسم الطالب', ...activeSubject.columns.map(c => c.name)];
    const body = activeClass.students.map((student, index) => [
        (index + 1).toString(),
        student.name,
        ...activeSubject.columns.map(col => {
            const value = student.records[col.id];
            if (value === null || value === undefined) return '';
            if (col.type === ColumnType.CHECKBOX) return value ? '✔' : '✗';
            return value.toString();
        })
    ]);
    return { tableHeader, body };
  }

  const handleExportToExcel = () => {
    if (!activeClass || !activeSubject) return;

    const reportData = generateReportData();
    if (!reportData) return;

    const { tableHeader, body } = reportData;

    const wb = XLSX.utils.book_new();
    wb.Props = {
        Title: "كشف درجات " + activeSubject.name,
        Author: settings.teacherName,
        CreatedDate: new Date()
    };
    wb.Workbook = { Views: [{ RTL: true }] };
    
    const headerRows = [
        ["المملكة العربية السعودية"],
        ["وزارة التعليم"],
        ["الإدارة العامة للتعليم بـ: " + settings.educationDirectorate],
        ["مدرسة: " + settings.schoolName],
        [], // Empty row
        ["كشف متابعة وتقويم الطلاب"],
        ["المادة: " + activeSubject.name + " - الفصل: " + activeClass.name + " - " + settings.semester + " - العام الدراسي: " + settings.academicYear],
        [] // Empty row
    ];

    const footerRows = [
        [], // Empty row
        ["معلم المادة: " + settings.teacherName, null, "مدير المدرسة: " + settings.principalName],
        ["التوقيع:", null, "التوقيع:"],
    ]

    const ws_data = [
        ...headerRows,
        tableHeader,
        ...body,
        ...footerRows
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // --- STYLING ---
    const borderStyle = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
    };
    
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

    const headerRowIndex = headerRows.length;
    
    // Apply header style
    tableHeader.forEach((_h, i) => {
        const cellRef = XLSX.utils.encode_cell({c: i, r: headerRowIndex});
        if(ws[cellRef]) ws[cellRef].s = headerStyle;
    });

    // Apply body styles
    const bodyStartIndex = headerRowIndex + 1;
    body.forEach((row, r) => {
        row.forEach((_cell, c) => {
            const cellRef = XLSX.utils.encode_cell({c: c, r: bodyStartIndex + r});
            if(ws[cellRef]) {
                // Column 1 is student name (right-aligned)
                ws[cellRef].s = (c === 1) ? bodyStyleRight : bodyStyleCenter;
            }
        });
    });
    
    const totalColumns = tableHeader.length - 1;

    const merges = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: totalColumns } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: totalColumns } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: totalColumns } },
        { s: { r: 5, c: 0 }, e: { r: 5, c: totalColumns } },
        { s: { r: 6, c: 0 }, e: { r: 6, c: totalColumns } },
    ];
    ws['!merges'] = merges;
    
    const cols = tableHeader.map((h, i) => ({
      wch: i === 0 ? 5 : i === 1 ? 35 : Math.max(15, (h || '').length * 1.5)
    }));
    ws['!cols'] = cols;
    
    XLSX.utils.book_append_sheet(wb, ws, 'كشف الدرجات');
    XLSX.writeFile(wb, "كشف-" + activeClass.name + "-" + activeSubject.name + ".xlsx");
  };

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
            ${tableHeader.map(h => '<th style="border: 1px solid #333; padding: 8px; background-color: ' + themeColor + '; color: white; text-align: center; font-weight: bold;">' + h + '</th>').join('')}
          </tr>
        </thead>
        <tbody>
          ${body.map(row => `
            <tr>
              ${row.map((cell, cellIndex) => '<td style="border: 1px solid #333; padding: 8px; text-align: ' + (cellIndex === 1 ? 'right' : 'center') + ';">' + cell + '</td>').join('')}
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
        printWindow.document.write('<html><head><title>طباعة سجل - ' + activeSubject.name + '</title><style>@import url(\'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap\'); body { font-family: \'Cairo\', sans-serif; direction: rtl; margin: 20px; } table { font-size: 12px; } @media print { @page { size: A4 landscape; margin: 15mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } } </style></head><body>' + headerHtml + tableHtml + footerHtml + '<script>window.onload = function() { setTimeout(function() { window.print(); window.onafterprint = function() { window.close(); } }, 100); } </script></body></html>');
        printWindow.document.close();
    } else {
        toast.error('فشل فتح نافذة الطباعة. الرجاء التأكد من السماح بالنوافذ المنبثقة.');
    }
  };

  if (!activeClass || !activeSubject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm">
        <ClipboardListIcon className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
  <h2 className="text-base font-bold text-slate-700 dark:text-slate-300">
            {activeClass ? 'مرحباً بك في فصل ' + activeClass.name : 'مرحباً بك في سجل الدرجات'}
        </h2>
  <p className="mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400">
            {activeClass ? 'الرجاء تحديد مادة دراسية من القائمة الجانبية، أو إضافة مادة جديدة للبدء في رصد الدرجات.' : 'الرجاء تحديد فصل دراسي أو إنشاء فصل جديد من القائمة الجانبية للبدء.'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 self-start">
            {activeClass.name}
            {activeSubject && <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ms-3">- {activeSubject.name}</span>}
        </h2>
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
           <button data-tooltip="إضافة طالب جديد" onClick={() => setIsAddStudentModalOpen(true)} className="flex items-center gap-2 bg-[#2E8540] text-white px-4 py-2 rounded-lg hover:bg-[#246b33] transition-all duration-200 shadow-sm hover:shadow-md">
            <UserPlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">إضافة طالب</span>
           </button>
           <button data-tooltip="استيراد من Excel" onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 bg-[#2E8540] text-white px-4 py-2 rounded-lg hover:bg-[#246b33] transition-all duration-200 shadow-sm hover:shadow-md">
             <UserPlusIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">استيراد طلاب</span>
          </button>
          <button data-tooltip="إضافة عمود درجات" onClick={() => setIsAddColumnModalOpen(true)} className="flex items-center gap-2 bg-slate-500 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-all duration-200 shadow-sm hover:shadow-md">
            <PlusCircleIcon className="w-5 h-5"/>
            <span className="hidden sm:inline">إضافة عمود</span>
          </button>
          <div className="h-8 border-l mx-2 dark:border-slate-600 hidden sm:block"></div>
          <button data-tooltip="تنزيل كشف Excel" onClick={handleExportToExcel} className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={activeClass.students.length === 0}>
            <DownloadIcon className="w-5 h-5" />
            <span className="hidden sm:inline">تصدير Excel</span>
          </button>
          <button data-tooltip="تنزيل كشف PDF" onClick={handleExportToPdf} className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={activeClass.students.length === 0}>
            <DownloadIcon className="w-5 h-5" />
            <span className="hidden sm:inline">تصدير PDF</span>
          </button>
        </div>
      </div>

      <StudentTable
        students={paginatedStudents}
        startIndex={startIndex}
        activeSubject={activeSubject}
        onUpdateStudentData={(studentId, columnId, value) => onUpdateStudentData(activeClass.id, studentId, columnId, value)}
        onDeleteStudent={(studentId, studentName) => onDeleteStudent(activeClass.id, studentId, studentName)}
        onDeleteColumn={(columnId, columnName) => onDeleteColumn(activeClass.id, activeSubject.id, columnId, columnName)}
        onEditColumn={(columnId, updatedData) => onEditColumn(activeClass.id, activeSubject.id, columnId, updatedData)}
        onFillColumn={(columnId, value) => onFillColumn(activeClass.id, activeSubject.id, columnId, value)}
        apiKey={apiKey}
        onRequestApiKey={onRequestApiKey}
      />

      {totalStudents > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 p-2 bg-white dark:bg-slate-800/50 rounded-lg shadow-md">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-0">
                <span>عرض</span>
                <select 
                    value={rowsPerPage} 
                    onChange={e => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1); // Reset to first page
                    }}
                    className="p-1 border rounded bg-slate-50 dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-emerald-500"
                >
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
                <span>صفوف</span>
            </div>

            <span className="text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-0">
                عرض {Math.min(startIndex + 1, totalStudents)}-{Math.min(endIndex, totalStudents)} من {totalStudents}
            </span>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default StudentDataView;