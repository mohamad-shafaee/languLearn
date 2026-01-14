export type Mean = {
  language_id: number;
  //lang_id: number;
  language: string;
  //mean_str: string;
  mean: string;
};

export type WordObj = { 
  id: string;
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

export type UsrTestFill = {
  id: number; 
  body: string;
  fill1: string;
  fill2: string;
  usr_answer1: string;
  usr_answer2: string;
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

export type UsrTestWrite = {
  id: number;
  body: string;
  usr_answer: string;
} 

export type WordObjS = { 
  word_id: number;
  status: number;
  learned: boolean;
};

export type DefDetectTest = {
  id: number;
  word: string;
  part: number;
  text1: string;
  text2: string;
  text3: string;
  answer: number;
};

export type WdmTest = {
  id: number;
  part: number;
  body: string;
  answer: string;
  usr_answer: string;
  toggle_usr_answer: boolean;
};

/*export type UsrDefDetectTest = {
  id: number;
  word: string;
  text1: string;
  text2: string;
  text3: string;
  answer: number;
};*/





