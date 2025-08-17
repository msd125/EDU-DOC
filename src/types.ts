export interface Settings {
  schoolName: string;
  teacherName: string;
  principalName: string;
  educationDirectorate: string;
  academicYear: string;
  semester: string;
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

export interface Class {
  id: string;
  name:string;
  students: Student[];
  subjects: Subject[];
}
