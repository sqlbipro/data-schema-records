import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Schema, GenerationConfig, Column } from '@/types/schema';
import ColumnConfig from './ColumnConfig';

interface TableConfigProps {
  schema: Schema;
  onConfigChange: (config: GenerationConfig) => void;
  onColumnConfigChange: (tableName: string, columnName: string, updates: Partial<Column>) => void;
  onGenerate: () => void;
}

const TableConfig: React.FC<TableConfigProps> = ({ 
  schema, 
  onConfigChange, 
  onColumnConfigChange,
  onGenerate 
}) => {
  const [recordCounts, setRecordCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    schema.tables.forEach(table => {
      initial[table.name] = 10; // Default to 10 records per table
    });
    return initial;
  });

  const [expandedTable, setExpandedTable] = useState<string | null>(null);

  const handleCountChange = (tableName: string, value: string) => {
    const count = parseInt(value, 10) || 0;
    setRecordCounts(prev => {
      const updated = { ...prev, [tableName]: count };
      onConfigChange({ recordsPerTable: updated });
      return updated;
    });
  };

  const toggleTableExpand = (tableName: string) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configure Data Generation</CardTitle>
        <CardDescription>
          Specify how many records to generate for each table and configure column data types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Number of Records</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schema.tables.map(table => (
                <TableRow key={table.name}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      value={recordCounts[table.name]}
                      onChange={(e) => handleCountChange(table.name, e.target.value)}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {table.columns.length} columns
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleTableExpand(table.name)}
                    >
                      {expandedTable === table.name ? 'Hide Columns' : 'Configure Columns'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {expandedTable && (
            <ColumnConfig 
              tableName={expandedTable}
              columns={schema.tables.find(t => t.name === expandedTable)?.columns || []}
              onColumnConfigChange={onColumnConfigChange}
            />
          )}
          
          <div className="flex justify-end">
            <Button onClick={onGenerate}>
              Generate Test Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableConfig;
