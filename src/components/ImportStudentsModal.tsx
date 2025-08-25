import React, { useState, useCallback, useMemo } from 'react';
// استيراد دالة التباين من كشف الطلاب
import { getContrastColor } from './StudentTable';
import { ColumnType } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

import * as XLSX from 'xlsx';

interface ImportStudentsModalProps {
  onClose: () => void;
  onImport: (importedData: { [key: string]: any }[], studentNameColumn: string, columnsToImport: { header: string, type: ColumnType, options?: string[] }[]) => void;
}

type Filter = {
    id: number;
    column: string;
    value: string;
};

const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({ onClose, onImport }) => {

  const [step, setStep] = useState(1);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [rowCount, setRowCount] = useState<number>(0);

  const [studentNameColumn, setStudentNameColumn] = useState<string>('');
  const [columnsToImport, setColumnsToImport] = useState<{[key: string]: {selected: boolean, type: ColumnType, options: string}}>({});

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary', cellDates: true });
        setSheetNames(workbook.SheetNames);
        const sheetName = workbook.SheetNames[0];
        setSelectedSheet(sheetName);
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length > 1) {
          const headers = (jsonData[0] as string[]).map(h => h ? h.toString().trim() : '');
          const data = XLSX.utils.sheet_to_json(worksheet);
          setFileHeaders(headers);
          setFileData(data);
          setRowCount(data.length);
          setStep(2); // Move to filter step
        } else {
          alert("الملف فارغ أو لا يحتوي على بيانات كافية.");
        }
      } catch (error) {
        console.error("Error reading Excel file:", error);
        alert("حدث خطأ أثناء قراءة الملف. يرجى التأكد من أنه ملف Excel صالح.");
      }
    };
    reader.readAsBinaryString(file);
  }, []);
  
  const uniqueColumnValues = useMemo(() => {
    const uniqueValues: { [key: string]: Set<any> } = {};
    if (fileData.length > 0) {
        fileHeaders.forEach(header => {
            uniqueValues[header] = new Set();
        });
        fileData.forEach(row => {
            fileHeaders.forEach(header => {
                if (row[header] !== undefined && row[header] !== null) {
                    uniqueValues[header].add(row[header]);
                }
            });
        });
    }
    return uniqueValues;
  }, [fileData, fileHeaders]);


  const filteredData = useMemo(() => {
    if (filters.length === 0) {
      return fileData;
    }
    return fileData.filter(row => {
      return filters.every(filter => {
        if (!filter.column || !filter.value) return true;
        return row[filter.column]?.toString() === filter.value.toString();
      });
    });
  }, [fileData, filters]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const addFilter = () => {
    setFilters([...filters, {id: Date.now(), column: '', value: ''}]);
  };
  
  const removeFilter = (id: number) => {
    setFilters(filters.filter(f => f.id !== id));
  };
  
  const updateFilter = (id: number, updatedFilter: Partial<Filter>) => {
      setFilters(filters.map(f => f.id === id ? {...f, ...updatedFilter} : f));
  };

  const goToMappingStep = () => {
      const nameGuess = fileHeaders.find(h => h.toLowerCase().includes('name') || h.toLowerCase().includes('اسم')) || '';
      setStudentNameColumn(nameGuess);

      const initialSelections: typeof columnsToImport = {};
      fileHeaders.forEach(h => {
          initialSelections[h] = { selected: false, type: ColumnType.NUMBER, options: '' };
      });
      setColumnsToImport(initialSelections);

      setStep(3);
  };

  const handleColumnSelectionChange = (header: string, selected: boolean) => {
    setColumnsToImport(prev => ({...prev, [header]: {...prev[header], selected}}));
  };
  
  const handleColumnTypeChange = (header: string, type: ColumnType) => {
    setColumnsToImport(prev => ({...prev, [header]: {...prev[header], type}}));
  };
  
  const handleColumnOptionsChange = (header: string, options: string) => {
    setColumnsToImport(prev => ({...prev, [header]: {...prev[header], options}}));
  };

  const handleImport = () => {
    if (!studentNameColumn) {
        alert("الرجاء تحديد عمود اسم الطالب.");
        return;
    }
    const finalColumnsToImport = Object.entries(columnsToImport)
        .filter(([header, config]) => config.selected && header !== studentNameColumn)
        .map(([header, config]) => ({
            header, 
            type: config.type,
            options: config.type === ColumnType.LIST ? config.options.split(',').map(o => o.trim()).filter(Boolean) : undefined,
        }));

    onImport(filteredData, studentNameColumn, finalColumnsToImport);
  };
  
  const isImportDisabled = !studentNameColumn;

  const renderStepContent = () => {
    switch(step) {
        case 1: // Upload
            return (
              <div>
                <div className="flex flex-col items-center mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-700"><svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" stroke="#2E8540" strokeWidth="2" strokeLinecap="round"/></svg></span>
                    <h3 className="text-lg font-bold text-slate-800">استيراد الأسماء من ملف Excel</h3>
                  </div>
                  <p className="text-slate-600 text-sm">اختر ملف Excel يحتوي على أسماء الطلاب. الصف الأول يجب أن يكون عناوين الأعمدة.</p>
                </div>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
                  <input type="file" onChange={handleFileChange} accept=".xlsx, .xls, .csv" className="block w-full text-sm text-slate-900 border border-slate-300 rounded-lg cursor-pointer bg-slate-50 focus:outline-none" />
                  {sheetNames.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
                      <span className="text-xs text-slate-500">عدد الأوراق: <b>{sheetNames.length}</b></span>
                      <span className="text-xs text-slate-500">عدد الصفوف: <b>{rowCount}</b></span>
                      <span className="text-xs text-slate-500">اسم الورقة: <b>{selectedSheet}</b></span>
                    </div>
                  )}
                </div>
                {fileHeaders.length > 0 && fileData.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <button onClick={goToMappingStep} className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] transition-colors">التالي</button>
                  </div>
                )}
                {fileHeaders.length === 0 && fileData.length === 0 && (
                  <p className="mt-4 text-center text-red-500 text-sm">لم يتم تحميل أي بيانات بعد. تأكد من أن الملف يحتوي على صف عناوين وألا يكون فارغًا.</p>
                )}
              </div>
            );
    case 2: // Filter
      return (
        <div>
          <p className="mb-4 text-slate-600">الخطوة 2: (اختياري) قم بفلترة البيانات لاستيراد صفوف محددة فقط.</p>
          <div className="space-y-2 mb-4 p-3 bg-slate-50 rounded-lg">
            {filters.map(filter => (
              <div key={filter.id} className="flex flex-col md:flex-row items-center gap-2">
                 <select value={filter.column} onChange={e => updateFilter(filter.id, { column: e.target.value, value: '' })} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg block w-full md:w-1/3 p-2.5">
                   <option value="">اختر عمود...</option>
                   {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                 </select>
                 <span className="text-slate-500">=</span>
                 <select value={filter.value} onChange={e => updateFilter(filter.id, { value: e.target.value })} disabled={!filter.column} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg block w-full md:w-1/3 p-2.5">
                   <option value="">اختر قيمة...</option>
                   {filter.column && Array.from(uniqueColumnValues[filter.column]).map((val: any) => <option key={val} value={val}>{val}</option>)}
                 </select>
                 <button onClick={() => removeFilter(filter.id)} className="text-red-500 hover:text-red-700 p-2"><TrashIcon className="w-4 h-4"/></button>
              </div>
            ))}
            <button onClick={addFilter} className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-800">
              <PlusIcon className="w-4 h-4"/> إضافة فلتر
            </button>
          </div>
          <div className="flex items-center gap-4 mb-2">
            <p className="text-sm text-slate-600">معاينة البيانات المفلترة <span className="font-bold">({filteredData.length} سجل)</span></p>
            <span className="text-xs text-slate-500">عدد الأعمدة: <b>{fileHeaders.length}</b></span>
          </div>
          <div className="overflow-auto max-h-60 border-2 border-emerald-200 rounded-lg bg-white shadow-sm">
            <table className="w-full text-xs text-left">
              <thead
                className="text-[10px] sm:text-xs md:text-sm uppercase sticky top-0 z-30"
                style={{
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                  boxShadow: '0 2px 8px -2px #0002',
                }}>
                <tr>
                  {fileHeaders.map(h => (
                    <th
                      key={h}
                      className="p-2 font-semibold text-xs text-center"
                      style={{
                        fontFamily: 'Noto Sans Arabic, Cairo, sans-serif',
                        color: getContrastColor('#fff'),
                        letterSpacing: '1px',
                        background: 'transparent',
                        boxShadow: 'none',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredData.slice(0, 10).map((row, i) => (
                  <tr key={i} className="hover:bg-emerald-50/60 transition">
                    {fileHeaders.map(h => <td key={h} className="p-2 truncate max-w-xs">{row[h]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
        case 3: // Map
            return (
              <div>
                <p className="mb-4 text-slate-600">الخطوة 3: حدد عمود اسم الطالب، ثم (اختياري) اختر أعمدة إضافية لاستيرادها مع الأسماء.</p>
                
                <div className="mb-6 p-4 bg-yellow-50 border-r-4 border-yellow-400">
                  <label htmlFor="studentNameColumn" className="block mb-2 text-sm font-medium text-slate-900">1. حدد عمود اسم الطالب (إلزامي)</label>
                  <select
                    id="studentNameColumn"
                    value={studentNameColumn}
                    onChange={(e) => setStudentNameColumn(e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full md:w-1/2 p-2.5"
                  >
                    <option value="">-- اختر عمود اسم الطالب --</option>
                    {fileHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-slate-900">2. (اختياري) اختر أعمدة إضافية لاستيرادها مع الأسماء</label>
                  <div className="space-y-2 p-3 bg-slate-50 rounded-lg max-h-80 overflow-y-auto">
                    {fileHeaders.map(header => {
                      const isDisabled = header === studentNameColumn;
                      const config = columnsToImport[header];
                      return (
                        <div key={header} className={'grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-2 rounded ' + (isDisabled ? 'opacity-50' : '')}>
                          <div className="flex items-center col-span-1">
                            <input
                              id={'checkbox-' + header}
                              type="checkbox"
                              checked={!isDisabled && config?.selected}
                              onChange={(e) => handleColumnSelectionChange(header, e.target.checked)}
                              disabled={isDisabled}
                              className="w-5 h-5 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 focus:ring-2"
                            />
                            <label htmlFor={'checkbox-' + header} className="ms-3 font-semibold">{header}</label>
                          </div>
                          <div className="col-span-2">
                            {config?.selected && !isDisabled && (
                                <div className="flex flex-col md:flex-row gap-2">
                                    <select
                                        value={config.type}
                                        onChange={(e) => handleColumnTypeChange(header, e.target.value as ColumnType)}
                                        className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                                    >
                                        {Object.values(ColumnType).map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                    {config.type === ColumnType.LIST && (
                                        <input
                                          type="text"
                                          placeholder="خيارات مفصولة بفاصلة"
                                          value={config.options}
                                          onChange={(e) => handleColumnOptionsChange(header, e.target.value)}
                                          className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5"
                                        />
                                    )}
                                </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
        default: return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
  <div className="bg-white rounded-lg shadow-xl p-8 m-4 w-full max-w-4xl max-h-[90vh] flex flex-col">
  <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">استيراد الأسماء من ملف الاكسل</h2>
        
  <div className="flex-1 overflow-y-auto pr-2">
            {renderStepContent()}
        </div>

  <div className="flex justify-between items-center gap-4 mt-8 pt-4 border-t">
          <div>
            {step > 1 && <button onClick={() => setStep(s => s - 1)} className="py-2 px-4 text-sm font-medium bg-white rounded-lg border hover:bg-slate-100 transition-colors">السابق</button>}
          </div>
          <div className="flex gap-4">
             <button onClick={onClose} className="py-2 px-4 text-sm font-medium bg-white rounded-lg border hover:bg-slate-100 transition-colors">إلغاء</button>
            {step === 2 && <button onClick={goToMappingStep} className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] transition-colors">التالي</button>}
            {step === 3 && <button onClick={handleImport} disabled={isImportDisabled} className="py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">استيراد الأسماء</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsModal;