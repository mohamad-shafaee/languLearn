export type Mean = {
  language_id: number;
  //lang_id: number;
  language: string;
  //mean_str: string;
  mean: string;
};

export type WordObj = { 
  id: string;  // UUID or incremental number
  word: string;
  phonetic: string | null;
  means: Mean[];
};

export type Language = {
  id: number;
  code: string;
  name: string;
  direction: string;
};

export type FieldItem = {
  id: number;
  name: string;
  order: number;
};

export type LessonItem = {
  id: number;
  author_id: number;
  author_name: string;
  title: string;
  img_path: string;
  abstract: string;
  fieldIds: FieldItem[];
  status: string;
}

export type TestWrite = {
  id: number;
  //lesson_id: number;
  body: string;
} 

export type TestFill = {
  id: number; 
  body: string;
  fill1: string;
  fill2: string;
}

export type TestTF = {
  id: number; 
  body: string;
  answer: boolean;
}

export type TestReply = {
  id: number; 
  body: string;
  reply1: string;
  reply2: string;
  reply3: string;
  answer: number;
  desc1: string;
  desc2: string;
  desc3: string;
} 

export type TestAss = {
  id: number; 
  body: string;
  opt1: string;
  opt2: string;
  opt3: string;
  opt4: string;
  answer: number;
}



