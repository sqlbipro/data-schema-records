import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { parseSqlSchema } from '@/utils/schemaParser';
import { Schema } from '@/types/schema';
import { toast } from '@/components/ui/use-toast';

interface SchemaInputProps {
  onSchemaLoaded: (schema: Schema) => void;
}

const SchemaInput: React.FC<SchemaInputProps> = ({ onSchemaLoaded }) => {
  const [sqlSchema, setSqlSchema] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!sqlSchema.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a SQL schema',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const schema = parseSqlSchema(sqlSchema);
      
      if (schema.tables.length === 0) {
        toast({
          title: 'Error',
          description: 'No tables found in the schema',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }
      
      onSchemaLoaded(schema);
      toast({
        title: 'Success',
        description: `Loaded ${schema.tables.length} tables with ${schema.tables.reduce((acc, table) => acc + table.columns.length, 0)} columns`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to parse SQL schema',
        variant: 'destructive'
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleData = () => {
    const sampleSchema = `CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  age INT,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME
);

CREATE TABLE posts (
  id INT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  user_id INT NOT NULL,
  published BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments (
  id INT PRIMARY KEY,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;
    
    setSqlSchema(sampleSchema);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Database Schema</CardTitle>
        <CardDescription>
          Enter your SQL schema to generate test data for ALL columns in ALL tables.
          <b> Note:</b> This tool is not perfect. It may not work for all schemas due to DDL syntax variability.  A sample schema is provided below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your SQL schema here..."
            className="min-h-[200px] font-mono text-sm"
            value={sqlSchema}
            onChange={(e) => setSqlSchema(e.target.value)}
          />
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleSampleData}>
              Load Sample Schema
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Parse Schema'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchemaInput;
