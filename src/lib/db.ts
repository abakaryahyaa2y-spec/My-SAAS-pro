import Dexie, { Table } from 'dexie';

// Types pour notre base de données locale
export interface LocalStudent {
  id?: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  grade: string;
  status: string;
  enrollmentDate: string;
  syncStatus: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
  updatedAt: number;
}

export interface LocalFinance {
  id?: string;
  student: string;
  grade: string;
  amount: string;
  dueDate: string;
  status: string;
  type: string;
  syncStatus: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
  updatedAt: number;
}

export interface LocalHR {
  id?: string;
  name: string;
  role: string;
  salary: string;
  status: string;
  hireDate: string;
  syncStatus: 'synced' | 'pending_insert' | 'pending_update' | 'pending_delete';
  updatedAt: number;
}

export class EduSaaSDatabase extends Dexie {
  students!: Table<LocalStudent, string>;
  finances!: Table<LocalFinance, string>;
  hr!: Table<LocalHR, string>;

  constructor() {
    super('EduSaaSLocalDB');
    this.version(2).stores({
      students: '++id, firstName, lastName, grade, syncStatus, updatedAt',
      finances: '++id, student, status, syncStatus, updatedAt',
      hr: '++id, name, status, syncStatus, updatedAt'
    });
  }
}

export const db = new EduSaaSDatabase();
