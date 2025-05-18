import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { GeneratedData } from '@/types/schema';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GeneratedDataViewProps {
  data: GeneratedData[];
}

const GeneratedDataView: React.FC<GeneratedDataViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<string>(data[0]?.tableName || '');

  const exportToJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'generated-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportTableToCSV = (tableName: string) => {
    const tableData = data.find(d => d.tableName === tableName);
    if (!tableData || tableData.records.length === 0) return;
    
    const headers = Object.keys(tableData.records[0]);
    const csvRows = [
      headers.join(','),
      ...tableData.records.map(record => {
        return headers.map(header => {
          const value = record[header];
          // Handle different data types for CSV formatting
          if (value === null || value === undefined) return '';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          if (value instanceof Date) return value.toISOString();
          return value;
        }).join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
    
    const exportFileDefaultName = `${tableName}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Generated Test Data</CardTitle>
            <CardDescription>
              Preview and export your generated test data
            </CardDescription>
          </div>
          <Button onClick={exportToJson}>
            Export All (JSON)
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {data.map(tableData => (
              <TabsTrigger key={tableData.tableName} value={tableData.tableName}>
                {tableData.tableName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {data.map(tableData => (
            <TabsContent key={tableData.tableName} value={tableData.tableName}>
              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportTableToCSV(tableData.tableName)}
                >
                  Export as CSV
                </Button>
              </div>
              
              <ScrollArea className="h-[400px]">
                {tableData.records.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(tableData.records[0]).map(key => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableData.records.map((record, index) => (
                        <TableRow key={index}>
                          {Object.entries(record).map(([key, value]) => (
                            <TableCell key={key}>
                              {value instanceof Date 
                                ? value.toISOString() 
                                : String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No records generated for this table
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GeneratedDataView;
