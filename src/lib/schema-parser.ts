interface Column {
  name: string;
  type: string;
  constraints: string[];
}

interface Table {
  name: string;
  columns: Column[];
}

export function parseSchema(schema: string): Table[] {
  const tables: Table[] = [];
  const lines = schema.split('\n').map(line => line.trim());

  let currentTable: Table | null = null;
  let inCreateTable = false;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line || line.startsWith('--')) continue;

    // Check for CREATE TABLE statement
    const createMatch = line.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i);
    if (createMatch) {
      inCreateTable = true;
      currentTable = {
        name: createMatch[1],
        columns: []
      };
      continue;
    }

    // If we're in a CREATE TABLE block
    if (inCreateTable && currentTable) {
      // Check for column definition
      const columnMatch = line.match(/`?(\w+)`?\s+([A-Za-z0-9()]+)(?:\s+([^,]+))?/);
      if (columnMatch) {
        const [_, name, type, constraintsStr] = columnMatch;
        let constraints = constraintsStr ? constraintsStr.split(/\s+/).filter(Boolean) : [];
        
        // Check if this is a primary key or foreign key column
        const isPrimaryKey = constraints.some(c => 
          c.toUpperCase() === 'PRIMARY' || 
          c.toUpperCase() === 'KEY' || 
          c.toUpperCase() === 'PRIMARY KEY'
        );
        const isForeignKey = constraints.some(c => 
          c.toUpperCase().includes('FOREIGN') || 
          c.toUpperCase().includes('REFERENCES')
        );
        
        // Remove any existing NULL or NOT NULL constraints
        constraints = constraints.filter(c => 
          !['NULL', 'NOT', 'NOT NULL'].includes(c.toUpperCase())
        );
        
        // Add NOT NULL constraint if it's a primary or foreign key
        if (isPrimaryKey || isForeignKey) {
          constraints.push('NOT NULL');
        }
        
        currentTable.columns.push({
          name,
          type: type.toUpperCase(),
          constraints
        });
      }

      // Check for end of CREATE TABLE
      if (line.includes(');')) {
        tables.push(currentTable);
        currentTable = null;
        inCreateTable = false;
      }
    }
  }

  return tables;
} 