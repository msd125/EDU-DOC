import React, { useState, useCallback, useMemo } from 'react';
// استيراد دالة التباين من كشف الطلاب
import { getContrastColor } from '../utils/colorUtils';
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

  // حالة طريقة الاستيراد
  const [importMethod, setImportMethod] = useState<'file' | 'paste' | null>(null);
  
  // حالات الاستيراد من الملف (الطريقة الحالية)
  const [step, setStep] = useState(0); // بدء من 0 لاختيار الطريقة
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>('');
  const [rowCount, setRowCount] = useState<number>(0);

  // حالات الاستيراد بالنسخ واللصق
  const [pastedText, setPastedText] = useState<string>('');
  const [parsedNames, setParsedNames] = useState<string[]>([]);
  const [detectedFormat, setDetectedFormat] = useState<string>('');

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

  // دوال تحليل النص المنسوخ
  const detectPasteFormat = (text: string): string => {
    const newlineCount = (text.match(/\n/g) || []).length;
    const tabCount = (text.match(/\t/g) || []).length;
    const commaCount = (text.match(/,/g) || []).length;
    
    // اكتشاف نمط البيانات المنسوخة
    if (tabCount > 0 && tabCount >= newlineCount) return 'tab'; // من Excel
    if (newlineCount > 0) return 'newline'; // قائمة أسماء
    if (commaCount > 0) return 'comma'; // مفصولة بفاصلة
    return 'space'; // مفصولة بمسافات
  };

  const parseNames = (text: string, format: string): string[] => {
    let names: string[] = [];
    
    switch(format) {
      case 'newline':
        names = text.split('\n');
        break;
      case 'comma':
        names = text.split(',');
        break;
      case 'tab':
        // إذا كان من Excel، نأخذ العمود الأول فقط
        names = text.split('\n').map(line => line.split('\t')[0]);
        break;
      case 'space':
        // تحليل أذكى للأسماء المفصولة بمسافات
        names = text.split(/\s+/);
        break;
    }
    
    // تنظيف الأسماء
    return names
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .filter(name => !/^[0-9]+\.?$/.test(name)) // إزالة الأرقام
      .filter(name => name.length >= 2); // إزالة الأحرف المفردة
  };

  const analyzePastedText = (text: string) => {
    if (!text.trim()) {
      setParsedNames([]);
      setDetectedFormat('');
      return;
    }
    
    const format = detectPasteFormat(text);
    const names = parseNames(text, format);
    
    setParsedNames(names);
    setDetectedFormat(format);
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setPastedText(text);
    analyzePastedText(text);
  };

  const handlePasteImport = () => {
    if (parsedNames.length === 0) {
      alert('لا توجد أسماء صالحة للاستيراد');
      return;
    }
    
    // تحويل الأسماء لتنسيق متوافق مع النظام الحالي
    const importData = parsedNames.map((name, index) => ({
      'الاسم': name,
      'الرقم': (index + 1).toString()
    }));
    
    onImport(importData, 'الاسم', []);
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
        case 0: // اختيار طريقة الاستيراد
            return (
              <div>
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">اختر طريقة استيراد الأسماء</h3>
                  <p className="text-slate-600">حدد الطريقة الأنسب لك لاستيراد أسماء الطلاب</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* خيار الملف */}
                  <div 
                    onClick={() => {setImportMethod('file'); setStep(1);}}
                    className="group cursor-pointer p-6 border-2 border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">📄 من ملف Excel/CSV</h4>
                      <p className="text-sm text-slate-600 mb-4">الطريقة التقليدية لاستيراد البيانات من ملفات</p>
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>✅ دعم ملفات Excel و CSV</div>
                        <div>✅ استيراد أعمدة متعددة</div>
                        <div>✅ فلترة البيانات</div>
                      </div>
                    </div>
                  </div>

                  {/* خيار النسخ واللصق */}
                  <div 
                    onClick={() => {setImportMethod('paste'); setStep(4);}}
                    className="group cursor-pointer p-6 border-2 border-slate-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all duration-200"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 mb-2">📋 نسخ ولصق</h4>
                      <p className="text-sm text-slate-600 mb-4">الطريقة الأسهل والأسرع للمستخدمين</p>
                      <div className="text-xs text-slate-500 space-y-1">
                        <div>✅ بساطة قصوى</div>
                        <div>✅ من أي مصدر (Excel، Word)</div>
                        <div>✅ تحليل تلقائي للنص</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );

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
                    <button onClick={goToMappingStep} className="btn-3d py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] transition-colors">التالي</button>
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
                  fontFamily: 'Noto Sans Arabic, sans-serif',
                  boxShadow: '0 2px 8px -2px #0002',
                }}>
                <tr>
                  {fileHeaders.map(h => (
                    <th
                      key={h}
                      className="p-2 font-semibold text-xs text-center"
                      style={{
                        fontFamily: 'Noto Sans Arabic, sans-serif',
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
        
        case 4: // النسخ واللصق
            return (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2">📋 لصق الأسماء هنا</h3>
                  <p className="text-slate-600 text-sm">انسخ قائمة الأسماء من أي مصدر والصقها في الصندوق أدناه</p>
                </div>

                <div className="mb-6">
                  <textarea
                    value={pastedText}
                    onChange={handlePasteChange}
                    placeholder="الصق الأسماء هنا...&#10;&#10;أمثلة:&#10;أحمد محمد&#10;فاطمة سالم&#10;محمد علي&#10;&#10;أو منسوخة من Excel:&#10;أحمد محمد	85	ممتاز&#10;فاطمة سالم	92	ممتاز"
                    className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    style={{direction: 'rtl', fontFamily: 'Arial, sans-serif'}}
                  />
                </div>

                {/* معاينة النتائج */}
                {parsedNames.length > 0 && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-green-600">✅</span>
                      <h4 className="font-semibold text-green-800">تم اكتشاف {parsedNames.length} اسم</h4>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        {detectedFormat === 'tab' && 'من Excel'}
                        {detectedFormat === 'newline' && 'قائمة أسماء'}
                        {detectedFormat === 'comma' && 'مفصولة بفاصلة'}
                        {detectedFormat === 'space' && 'مفصولة بمسافات'}
                      </span>
                    </div>
                    
                    <div className="max-h-32 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        {parsedNames.slice(0, 12).map((name, index) => (
                          <div key={index} className="flex items-center gap-1 text-slate-700">
                            <span className="text-green-500 text-xs">{index + 1}.</span>
                            <span className="truncate">{name}</span>
                          </div>
                        ))}
                      </div>
                      {parsedNames.length > 12 && (
                        <div className="text-center mt-2 text-sm text-slate-500">
                          ... و {parsedNames.length - 12} اسم آخر
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* أمثلة التنسيقات المدعومة */}
                {pastedText.length === 0 && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">💡 أمثلة على التنسيقات المدعومة:</h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <div>
                        <strong>من Excel:</strong> انسخ العمود واللصق (يدعم أعمدة متعددة)
                      </div>
                      <div>
                        <strong>قائمة بسيطة:</strong> اسم في كل سطر
                      </div>
                      <div>
                        <strong>مفصولة بفاصلة:</strong> أحمد, فاطمة, محمد
                      </div>
                      <div>
                        <strong>مرقمة:</strong> 1. أحمد 2. فاطمة 3. محمد
                      </div>
                    </div>
                  </div>
                )}

                {/* أزرار التحكم */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {setPastedText(''); setParsedNames([]);}}
                    className="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    disabled={pastedText.length === 0}
                  >
                    مسح النص
                  </button>
                  
                  <button
                    onClick={handlePasteImport}
                    disabled={parsedNames.length === 0}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                  >
                    استيراد {parsedNames.length > 0 && `(${parsedNames.length})`} الأسماء
                  </button>
                </div>
              </div>
            );

        default: return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 p-2 sm:p-4">
  <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8 w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-slate-800 text-center">
    {step === 0 ? 'استيراد الأسماء' : 
     importMethod === 'paste' ? 'نسخ ولصق الأسماء' : 
     'استيراد الأسماء من ملف الاكسل'}
  </h2>
        
  <div className="flex-1 overflow-y-auto pr-1 sm:pr-2">
            {renderStepContent()}
        </div>

  <div className="flex justify-between items-center gap-4 mt-8 pt-4 border-t">
          <div>
            {/* زر السابق */}
            {step > 0 && step !== 4 && (
              <button 
                onClick={() => {
                  if (step === 1 && importMethod) {
                    setStep(0); // العودة لاختيار الطريقة
                    setImportMethod(null);
                  } else {
                    setStep(s => s - 1);
                  }
                }} 
                className="btn-3d py-2 px-4 text-sm font-medium bg-white rounded-lg border hover:bg-slate-100 transition-colors"
              >
                السابق
              </button>
            )}
            {step === 4 && (
              <button 
                onClick={() => {setStep(0); setImportMethod(null); setPastedText(''); setParsedNames([]);}} 
                className="btn-3d py-2 px-4 text-sm font-medium bg-white rounded-lg border hover:bg-slate-100 transition-colors"
              >
                تغيير الطريقة
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
             <button onClick={onClose} className="btn-3d py-2 px-4 text-sm font-medium bg-white rounded-lg border hover:bg-slate-100 transition-colors order-2 sm:order-1">إلغاء</button>
            {step === 2 && <button onClick={goToMappingStep} className="btn-3d py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] transition-colors order-1 sm:order-2">التالي</button>}
            {step === 3 && <button onClick={handleImport} disabled={isImportDisabled} className="btn-3d py-2 px-4 text-sm font-medium text-white bg-[#2E8540] rounded-lg hover:bg-[#246b33] disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors order-1 sm:order-2">استيراد الأسماء</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsModal;