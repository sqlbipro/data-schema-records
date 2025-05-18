// Types for database schema and test data generation

export type DataType = 
  | 'string' 
  | 'integer' 
  | 'float' 
  | 'boolean' 
  | 'date' 
  | 'email' 
  | 'uuid' 
  | 'name' 
  | 'address' 
  | 'phone'
  | 'lorem';

export interface Column {
  name: string;
  type: DataType;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  referencesTable?: string;
  referencesColumn?: string;
  isNullable?: boolean;
  min?: number;
  max?: number;
  options?: string[];
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Schema {
  tables: Table[];
}

export interface GenerationConfig {
  recordsPerTable: Record<string, number>;
}

export interface GeneratedData {
  tableName: string;
  records: Record<string, any>[];
}
