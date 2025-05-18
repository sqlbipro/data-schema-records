import React, { useState } from 'react';
import { Schema, GenerationConfig, GeneratedData, Column } from '@/types/schema';
import SchemaInput from './SchemaInput';
import TableConfig from './TableConfig';
import GeneratedDataView from './GeneratedDataView';
import { generateTestData } from '@/utils/dataGenerator';
import { toast } from '@/components/ui/use-toast';

const TestDataGenerator: React.FC = () => {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [config, setConfig] = useState<GenerationConfig>({ recordsPerTable: {} });
  const [generatedData, setGeneratedData] = useState<GeneratedData[]>([]);

  const handleSchemaLoaded = (loadedSchema: Schema) => {
    setSchema(loadedSchema);
    
    // Initialize config with default values
    const initialConfig: GenerationConfig = { recordsPerTable: {} };
    loadedSchema.tables.forEach(table => {
      initialConfig.recordsPerTable[table.name] = 10; // Default to 10 records
    });
    setConfig(initialConfig);
    
    // Clear any previously generated data
    setGeneratedData([]);
  };

  const handleConfigChange = (newConfig: GenerationConfig) => {
    setConfig(newConfig);
  };

  const handleColumnConfigChange = (tableName: string, columnName: string, updates: Partial<Column>) => {
    if (!schema) return;
    
    const updatedSchema = {
      ...schema,
      tables: schema.tables.map(table => {
        if (table.name !== tableName) return table;
        
        return {
          ...table,
          columns: table.columns.map(column => {
            if (column.name !== columnName) return column;
            return { ...column, ...updates };
          })
        };
      })
    };
    
    setSchema(updatedSchema);
  };

  const handleGenerateData = () => {
    if (!schema) return;
    
    try {
      const data = generateTestData(schema, config);
      setGeneratedData(data);
      toast({
        title: 'Success',
        description: `Generated test data for ${data.length} tables`,
      });
    } catch (error) {
      console.error('Error generating data:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate test data',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Test Data Generator</h1>
        <p className="text-muted-foreground mt-2">
          Generate realistic test data from your database schema
        </p>
      </div>
      
      <SchemaInput onSchemaLoaded={handleSchemaLoaded} />
      
      {schema && (
        <TableConfig 
          schema={schema} 
          onConfigChange={handleConfigChange}
          onColumnConfigChange={handleColumnConfigChange}
          onGenerate={handleGenerateData} 
        />
      )}
      
      {generatedData.length > 0 && (
        <GeneratedDataView data={generatedData} />
      )}
    </div>
  );
};

export default TestDataGenerator;
