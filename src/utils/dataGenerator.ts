import { Schema, Table, Column, GeneratedData, GenerationConfig } from '@/types/schema';
import { generateRandomValue, generateUniqueValue } from './dataGenerators';

// Generate test data for a given schema
export const generateTestData = (schema: Schema, config: GenerationConfig): GeneratedData[] => {
  const generatedData: GeneratedData[] = [];
  const foreignKeyData: Record<string, Record<string, any[]>> = {};
  
  // First pass: Generate data for tables without foreign key dependencies
  schema.tables.forEach(table => {
    const recordCount = config.recordsPerTable[table.name] || 10;
    const records: Record<string, any>[] = [];
    
    // Store primary key values for reference
    const primaryKeyColumns = table.columns.filter(col => col.isPrimaryKey);
    const primaryKeyValues: Record<string, any[]> = {};
    
    primaryKeyColumns.forEach(col => {
      primaryKeyValues[col.name] = [];
    });
    
    // Generate records
    for (let i = 0; i < recordCount; i++) {
      const record: Record<string, any> = {};
      
      // Generate values for all columns
      table.columns.forEach(column => {
        if (column.isPrimaryKey) {
          // Handle primary keys with unique values
          const value = generateUniqueValue(column, primaryKeyValues[column.name] || []);
          record[column.name] = value;
          if (!primaryKeyValues[column.name]) {
            primaryKeyValues[column.name] = [];
          }
          primaryKeyValues[column.name].push(value);
        } else if (!column.isForeignKey) {
          // Handle regular columns
          record[column.name] = generateRandomValue(column);
        }
        // Foreign keys will be handled in the second pass
      });
      
      records.push(record);
    }
    
    // Store generated data for foreign key references
    primaryKeyColumns.forEach(col => {
      if (!foreignKeyData[table.name]) {
        foreignKeyData[table.name] = {};
      }
      foreignKeyData[table.name][col.name] = records.map(r => r[col.name]);
    });
    
    generatedData.push({
      tableName: table.name,
      records
    });
  });
  
  // Second pass: Resolve foreign key references
  generatedData.forEach(tableData => {
    const table = schema.tables.find(t => t.name === tableData.tableName);
    if (!table) return;
    
    const foreignKeyColumns = table.columns.filter(col => col.isForeignKey);
    
    tableData.records.forEach(record => {
      foreignKeyColumns.forEach(column => {
        if (column.referencesTable && column.referencesColumn) {
          const referencedValues = foreignKeyData[column.referencesTable]?.[column.referencesColumn];
          
          if (referencedValues && referencedValues.length > 0) {
            // Pick a random value from the referenced column
            record[column.name] = referencedValues[Math.floor(Math.random() * referencedValues.length)];
          } else {
            // If no referenced values are available, generate a placeholder
            record[column.name] = generateRandomValue(column);
          }
        }
      });
    });
  });
  
  return generatedData;
};
