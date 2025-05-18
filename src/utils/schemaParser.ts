import { Schema, Table, Column, DataType } from '@/types/schema';

// Parse a SQL schema string into our Schema type
export const parseSqlSchema = (sqlSchema: string): Schema => {
  console.log('Input SQL Schema:', sqlSchema); // Debug log
  const tables: Table[] = [];
  // Updated regex to better handle whitespace and newlines
  const tableRegex = /CREATE\s+TABLE\s+[`"']?([\w_]+)[`"']?\s*\(([\s\S]*?)\)(?:\s*;|\s*$)/gi;
  
  let tableMatch;
  while ((tableMatch = tableRegex.exec(sqlSchema)) !== null) {
    const tableName = tableMatch[1];
    const tableContent = tableMatch[2];
    
    console.log(`Parsing table: ${tableName}`); // Debug log
    console.log('Table content:', tableContent); // Debug log
    
    const columns: Column[] = [];
    const foreignKeys: {columnName: string, referencesTable: string, referencesColumn: string}[] = [];
    
    // First, extract all foreign key constraints
    const fkRegex = /FOREIGN\s+KEY\s*\(\s*[`"']?([\w_]+)[`"']?\s*\)\s+REFERENCES\s+[`"']?([\w_]+)[`"']?\s*\(\s*[`"']?([\w_]+)[`"']?\s*\)/gi;
    let fkMatch;
    
    while ((fkMatch = fkRegex.exec(tableContent)) !== null) {
      console.log(`Found foreign key: ${fkMatch[1]} -> ${fkMatch[2]}.${fkMatch[3]}`); // Debug log
      foreignKeys.push({
        columnName: fkMatch[1],
        referencesTable: fkMatch[2],
        referencesColumn: fkMatch[3]
      });
    }
    
    // Split the table content into lines and process each line that looks like a column definition
    const lines = tableContent.split(',').map(line => line.trim());
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines, foreign key constraints, and other constraints
      if (!trimmedLine || 
          /^FOREIGN\s+KEY/i.test(trimmedLine) || 
          /^PRIMARY\s+KEY/i.test(trimmedLine) || 
          /^CONSTRAINT/i.test(trimmedLine) ||
          /^INDEX/i.test(trimmedLine) ||
          /^UNIQUE/i.test(trimmedLine)) {
        continue;
      }
      
      // Updated regex to better handle column definitions with DEFAULT values
      const columnMatch = trimmedLine.match(/^[`"']?([\w_]+)[`"']?\s+([\w\s()]+?)(?:\s+DEFAULT\s+[^,]+)?(?:\s+(?:NOT\s+)?NULL)?(?:\s+PRIMARY\s+KEY)?(?:\s*,\s*)?$/i);
      
      if (columnMatch) {
        const columnName = columnMatch[1];
        const dataTypeStr = columnMatch[2].toLowerCase().trim();
        
        console.log(`Parsing column: ${columnName}, Type: ${dataTypeStr}`); // Debug log
        
        let dataType: DataType = 'string';
        let min: number | undefined;
        let max: number | undefined;
        
        // Map SQL data types to our types
        if (/int|number|bigint|smallint|tinyint/i.test(dataTypeStr)) {
          dataType = 'integer';
          
          // Add specific constraints for known columns
          if (tableName.toLowerCase() === 'users' && columnName.toLowerCase() === 'age') {
            min = 10;
            max = 100;
          }
        } else if (/float|double|decimal|numeric|real/i.test(dataTypeStr)) {
          dataType = 'float';
        } else if (/bool|boolean/i.test(dataTypeStr)) {
          dataType = 'boolean';
        } else if (/date|time|timestamp/i.test(dataTypeStr)) {
          dataType = 'date';
        } else if (/char|text|varchar|clob|longtext|mediumtext|shorttext|nvarchar/i.test(dataTypeStr)) {
          // Try to guess more specific string types based on column name
          const lowerColumnName = columnName.toLowerCase();
          if (lowerColumnName.includes('email')) {
            dataType = 'email';
          } else if (lowerColumnName.includes('name')) {
            dataType = 'name';
          } else if (lowerColumnName.includes('address')) {
            dataType = 'address';
          } else if (lowerColumnName.includes('phone')) {
            dataType = 'phone';
          } else if (lowerColumnName.includes('uuid') || lowerColumnName.includes('guid')) {
            dataType = 'uuid';
          } else if (lowerColumnName.includes('content') || lowerColumnName === 'text') {
            dataType = 'lorem';
          } else {
            dataType = 'string';
          }
        }
        
        const isPrimaryKey = /PRIMARY\s+KEY/i.test(trimmedLine);
        const isNullable = !/NOT\s+NULL/i.test(trimmedLine);
        
        console.log(`Column details - Type: ${dataType}, PK: ${isPrimaryKey}, Nullable: ${isNullable}, Min: ${min}, Max: ${max}`); // Debug log
        
        columns.push({
          name: columnName,
          type: dataType,
          isPrimaryKey,
          isNullable,
          min,
          max
        });
      } else {
        console.log(`Failed to parse line: ${trimmedLine}`); // Debug log for failed matches
      }
    }
    
    // Apply foreign key information to columns
    for (const fk of foreignKeys) {
      const column = columns.find(col => col.name === fk.columnName);
      if (column) {
        column.isForeignKey = true;
        column.referencesTable = fk.referencesTable;
        column.referencesColumn = fk.referencesColumn;
      }
    }
    
    console.log(`Finished parsing table ${tableName}. Found ${columns.length} columns.`); // Debug log
    
    tables.push({
      name: tableName,
      columns
    });
  }
  
  console.log(`Total tables parsed: ${tables.length}`); // Debug log
  return { tables };
};
