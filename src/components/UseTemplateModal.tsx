import React, { useState, useEffect } from 'react';
import { Template } from '../types';
import DeleteTemplateConfirmModal from './DeleteTemplateConfirmModal';

interface UseTemplateModalProps {
  onClose: () => void;
  onUseTemplate: (templateId: string) => void;
  templates: Template[];
  onExportTemplate?: (template: Template) => void;
  onShowImport?: () => void;
  onRenameTemplate?: (templateId: string, newName: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({ 
  onClose, 
  onUseTemplate, 
  templates, 
  onExportTemplate,
  onShowImport,
  onRenameTemplate,
  onDeleteTemplate
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'my' | 'imported'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    if (templates.length > 0) {
      setSelectedTemplate(templates[0].id);
    }
  }, [templates]);
  
  const filteredTemplates = templates.filter(template => {
    // تصفية حسب النوع
    if (filter === 'my' && !template.isOwner) return false;
    if (filter === 'imported' && !template.isImported) return false;
    
    // تصفية حسب البحث
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        template.name.toLowerCase().includes(term) || 
        (template.description && template.description.toLowerCase().includes(term))
      );
    }
    
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">استخدام قالب</h2>
        
        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center rounded-lg overflow-hidden border border-slate-300 dark:border-slate-600">
            <button 
              className={`px-3 py-1 text-xs font-medium ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              onClick={() => setFilter('all')}
            >
              جميع القوالب
            </button>
            <button 
              className={`px-3 py-1 text-xs font-medium ${filter === 'my' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              onClick={() => setFilter('my')}
            >
              قوالبي
            </button>
            <button 
              className={`px-3 py-1 text-xs font-medium ${filter === 'imported' ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
              onClick={() => setFilter('imported')}
            >
              قوالب مضافة
            </button>
          </div>
          
          <input
            type="text"
            className="flex-grow px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg"
            placeholder="بحث..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex-grow overflow-auto mb-4 border border-slate-200 dark:border-slate-700 rounded-lg">
          {filteredTemplates.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">
              لا توجد قوالب متطابقة مع معايير البحث
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedTemplate === template.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex justify-between items-start">
                    {isEditingName && selectedTemplate === template.id ? (
                      <div className="flex-grow mb-2">
                        <input 
                          type="text" 
                          className="w-full p-1 text-sm border border-blue-300 rounded"
                          value={newTemplateName}
                          onChange={(e) => setNewTemplateName(e.target.value)}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && onRenameTemplate && newTemplateName.trim()) {
                              onRenameTemplate(template.id, newTemplateName);
                              setIsEditingName(false);
                            } else if (e.key === 'Escape') {
                              setIsEditingName(false);
                            }
                            e.stopPropagation();
                          }}
                        />
                      </div>
                    ) : (
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">{template.name}</h3>
                    )}
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      {template.isOwner && !isEditingName && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNewTemplateName(template.name);
                              setIsEditingName(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                            title="تعديل اسم القالب"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onDeleteTemplate) {
                                setTemplateToDelete(template.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            title="حذف القالب"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    بواسطة: {template.ownerName}
                  </p>
                  {template.description && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {template.description}
                    </p>
                  )}
                  <div className="mt-3 text-xs text-slate-500">
                    عدد الأعمدة: {template.columnCount}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-3 border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="py-2 px-4 mx-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              onClick={onShowImport}
              aria-label="استيراد قالب"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                استيراد قالب
              </span>
            </button>
            {selectedTemplate && onExportTemplate && (
              <button
                type="button"
                className="py-2 px-4 mx-2 text-sm font-medium text-green-600 dark:text-green-400 bg-transparent rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                onClick={() => {
                  const template = templates.find(t => t.id === selectedTemplate);
                  if (template) {
                    onExportTemplate(template);
                  }
                }}
                aria-label="تصدير القالب"
                disabled={!selectedTemplate || filteredTemplates.length === 0}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 8.586V16a1 1 0 11-2 0V8.586l-1.293 1.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  تصدير القالب
                </span>
              </button>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              className="py-2 px-4 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onUseTemplate(selectedTemplate)}
              disabled={!selectedTemplate || filteredTemplates.length === 0}
            >
              استخدام القالب
            </button>
          </div>
        </div>
      </div>
      
      {/* مربع حوار تأكيد الحذف */}
      {templateToDelete && (
        <DeleteTemplateConfirmModal
          template={templates.find(t => t.id === templateToDelete)!}
          onConfirm={() => {
            if (onDeleteTemplate && templateToDelete) {
              onDeleteTemplate(templateToDelete);
              setTemplateToDelete(null);
            }
          }}
          onCancel={() => setTemplateToDelete(null)}
        />
      )}
    </div>
  );
};

export default UseTemplateModal;
