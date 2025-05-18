import { Column, DataType } from '@/types/schema';

// Generate random data based on column type
export const generateRandomValue = (column: Column, existingValues: any[] = []): any => {
  const { type, min, max, options, isPrimaryKey, isNullable } = column;
  
  // Handle nullable fields
  if (isNullable && Math.random() > 0.8 && !isPrimaryKey) {
    return null;
  }

  switch (type) {
    case 'string':
      return `str_${Math.random().toString(36).substring(2, 10)}`;
    case 'integer':
      return Math.floor(Math.random() * ((max || 1000) - (min || 0)) + (min || 0));
    case 'float':
      return parseFloat((Math.random() * ((max || 100) - (min || 0)) + (min || 0)).toFixed(2));
    case 'boolean':
      return Math.random() > 0.5;
    case 'date':
      const start = new Date(2020, 0, 1);
      const end = new Date();
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    case 'email':
      return `user${Math.floor(Math.random() * 10000)}@example.com`;
    case 'uuid':
      return crypto.randomUUID();
    case 'name':
      const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'];
      const surnames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson'];
      return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
    case 'address':
      const streets = ['Main St', 'Oak Ave', 'Maple Rd', 'Washington Blvd', 'Park Lane'];
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
      const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
      return `${Math.floor(Math.random() * 1000) + 1} ${streets[Math.floor(Math.random() * streets.length)]}, ${cities[Math.floor(Math.random() * cities.length)]}, ${states[Math.floor(Math.random() * states.length)]}`;
    case 'phone':
      return `(${Math.floor(Math.random() * 900) + 100})-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    case 'lorem':
      const loremText = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."
      ];
      // Return 1-3 sentences for text content
      const sentenceCount = Math.floor(Math.random() * 3) + 1;
      let text = '';
      for (let i = 0; i < sentenceCount; i++) {
        text += loremText[Math.floor(Math.random() * loremText.length)] + ' ';
      }
      return text.trim();
    default:
      if (options && options.length > 0) {
        return options[Math.floor(Math.random() * options.length)];
      }
      return `value_${Math.random().toString(36).substring(2, 10)}`;
  }
};

// Generate a unique value for primary keys
export const generateUniqueValue = (column: Column, existingValues: any[]): any => {
  let value;
  do {
    value = generateRandomValue(column);
  } while (existingValues.includes(value));
  return value;
};
