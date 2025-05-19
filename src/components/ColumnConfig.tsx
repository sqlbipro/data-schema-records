import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Column } from '@/types/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ColumnConfigProps {
  tableName: string;
  columns: Column[];
  onColumnConfigChange: (tableName: string, columnName: string, updates: Partial<Column>) => void;
}

const ColumnConfig: React.FC<ColumnConfigProps> = ({ tableName, columns, onColumnConfigChange }) => {
  const dataTypeOptions = [
    'string', 'integer', 'float', 'boolean', 'date', 'email', 'uuid', 'name', 'address', 'phone', 'lorem'
  ];

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle>Column Configuration for {tableName}</CardTitle>
        <CardDescription>
          Customize data generation for each column
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Column Name</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Constraints</TableHead>
              <TableHead>Min/Max (Numbers)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column) => (
              <TableRow key={column.name}>
                <TableCell>{column.name}</TableCell>
                <TableCell>
                  <Select
                    value={column.type}
                    onValueChange={(value) => onColumnConfigChange(tableName, column.name, { type: value as any })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Data Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="text-xs space-y-1">
                    {column.isPrimaryKey && <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 px-2 py-1 rounded">Primary Key</div>}
                    {column.isForeignKey && <div className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100 px-2 py-1 rounded">Foreign Key</div>}
                    {column.isNullable && <div className="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 px-2 py-1 rounded">Nullable</div>}
                  </div>
                </TableCell>
                <TableCell>
                  {(column.type === 'integer' || column.type === 'float') && (
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={column.min || ''}
                        onChange={(e) => onColumnConfigChange(tableName, column.name, { min: parseInt(e.target.value) || undefined })}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={column.max || ''}
                        onChange={(e) => onColumnConfigChange(tableName, column.name, { max: parseInt(e.target.value) || undefined })}
                        className="w-20"
                      />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ColumnConfig;
