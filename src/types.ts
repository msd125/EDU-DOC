export interface Settings {
  schoolName: string;
  teacherName: string;
  principalName: string;
  educationDirectorate: string;
  academicYear: string;
  semester: string;
  currentUserName?: string; // اسم المستخدم الحالي للعرض في الهيدر فقط
}

export interface Student {
  id: string;
  name: string;
  records: Record<string, any>; // { columnId: value }
}

export enum ColumnType {
  TEXT = 'نص',
  NUMBER = 'رقم',
  DATE = 'تاريخ',
  CHECKBOX = 'مربع اختيار',
  LIST = 'قائمة',
  MULTI_CHECKBOX = 'مجموعة مربعات',
}

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  options?: string[]; // For LIST type
  // إعدادات اختيارية لنوع مجموعة المربعات
  multiSlots?: number;         // عدد الخانات داخل الخلية
  multiShowCounter?: boolean;  // عرض العداد داخل الخلية
  multiLabels?: string[];      // عناوين اختيارية لكل خانة
}

export interface Subject {
  id: string;
  name: string;
  columns: Column[];
  themeColor?: string;
}

export type ClassType = 'تعليمي' | 'إداري';
export interface Class {
  id: string;
  name: string;
  type: ClassType;
  students: Student[];
  subjects: Subject[];
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  isPublic: boolean;
  isOwner?: boolean;
  ownerName?: string;
  columnCount?: number;
  createdAt: number;
  isImported?: boolean;         // هل هذا قالب مستورد
  importedFrom?: string;        // معلومات المصدر (اسم المعلم أو المؤسسة)
  importedDate?: number;        // تاريخ الاستيراد
  exportCode?: string;          // رمز التصدير الفريد
}
