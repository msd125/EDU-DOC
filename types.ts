export type ColumnType = 'نص' | 'رقم' | 'مربع اختيار' | 'قائمة' | 'تاريخ' | 'TEXT' | 'NUMBER' | 'CHECKBOX' | 'LIST' | 'DATE';

export type ClassType = 'students' | 'staff' | 'admin';

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  options?: string[];
}

export interface Student {
  id: string | number;
  name: string;
  records: {
    [key: string]: any;
  };
  serial?: number;
}

export interface Subject {
  id: string;
  name: string;
  themeColor?: string;
  columns: Column[];
}

export interface Class {
  id: string;
  name: string;
  type?: ClassType;
  subjects: Subject[];
  students: Student[];
}

export interface Settings {
  schoolName: string;
  teacherName: string;
  principalName: string;
  educationDirectorate: string;
  academicYear: string;
  semester: string;
}

// أنواع بيانات جديدة لقوالب الجداول
export interface Template {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  columnCount: number;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  isOwner: boolean;
  createdAt: number; // Timestamp
  updatedAt?: number; // Timestamp
}