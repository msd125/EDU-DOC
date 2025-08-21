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
}

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  options?: string[]; // For LIST type
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
