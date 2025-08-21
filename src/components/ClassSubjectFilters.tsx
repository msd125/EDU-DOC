import React from 'react';

interface ClassSubjectFiltersProps {
  classes: { id: string; name: string; subjects: { id: string; name: string }[] }[];
  activeClassId: string;
  activeSubjectId: string;
  onClassChange: (classId: string) => void;
  onSubjectChange: (subjectId: string) => void;
}

const ClassSubjectFilters: React.FC<ClassSubjectFiltersProps> = ({
  classes,
  activeClassId,
  activeSubjectId,
  onClassChange,
  onSubjectChange,
}) => {
  const activeClass = classes.find((c) => c.id === activeClassId);
  return (
    <div className="flex gap-2 items-center mb-2">
      <label className="text-sm font-semibold">الفصل:</label>
      <select
        className="p-1 border rounded bg-slate-50 dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-emerald-500"
        value={activeClassId}
        onChange={(e) => onClassChange(e.target.value)}
      >
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <label className="text-sm font-semibold">المادة:</label>
      <select
        className="p-1 border rounded bg-slate-50 dark:bg-slate-700 dark:border-slate-600 focus:ring-1 focus:ring-emerald-500"
        value={activeSubjectId}
        onChange={(e) => onSubjectChange(e.target.value)}
        disabled={!activeClass}
      >
        {activeClass?.subjects.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClassSubjectFilters;
