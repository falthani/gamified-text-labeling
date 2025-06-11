// import documents from 'src/assets/documents.json';

export interface Document {  
  id: number;  
  title: string;
  summary: string;  
  text: string;
  author: string;
  category: string;
  source: string;
  progress: number;
  state?: 'compeleted' | 'active' | null; 
  purchased: boolean;
}
