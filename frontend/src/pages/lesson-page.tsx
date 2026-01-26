import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth"; 
import WordInfo from "../components/wordInfo";
import { Pencil, Edit, Save, ChevronRight } from "lucide-react";
import type { WordObj, Language, UsrDefDetectTest,
WdmTest, UsrTestWrite, UsrTestTF, UsrTestReply, UsrTestFill, UsrTestAss, WordObjS } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ParseText from "../components/parse-text";
import InteractiveWordsBox from "../components/interactive-wb";
import WordCloud from "../components/word-cloud";
import MatchWordMean from "../components/match-word-mean";
import UsrDDTestComp from "../components/usr-dd-test";
import TestFill from "../components/user-test-fill";
import TestTF from "../components/user-test-tf";
import TestReply from "../components/user-test-reply";
import TestAss from "../components/user-test-ass";
import ProgressBar from "../components/progress-bar";
import TestEvaluation from "../components/test-evaluation";

type Field = {
  id: number;
  name: string;
};

type Lesson = {
  id: number; 
  title: string | null;
  img_path: string | null;
  abstract: string | null;
  video1: string | null;
  video1_text: string | null;
  tech_term_body: string |null;
  text_p21: string | null;
  text_p22: string | null;
  text_p23: string | null;
  text_p24: string | null;
  text_p25: string | null;
} 

type WordUIObj = {
  word: string;
  word_id: number;
  count: number;
  user_selected: boolean; 
}

export type TechWordObj = { 
  id: string;
  word: string;
  part: number;
  phonetic: string | null;
  means: Mean[];
};

type MatchesDDT = {
  test_id: number;
  match: number;
}

type Eval = {
  all: number;
  wrong: number;
  correct: number;
} 

 
const LessonPage: React.FC = () => {
  const { fieldId, lessonId } = useParams();
	const { user, token } = useAuth();
  const navigate = useNavigate();
   
  const [field, setField] = useState<Field>({id: fieldId, name: ""});
  
  const [lesson, setLesson] = useState<Lesson>({id: lessonId});
  const [step, setStep] = useState<number>(1);
  const [step1Sec, setStep1Sec] = useState<number>(1);
  const [step2Sec, setStep2Sec] = useState<number>(1);
  const [step3Sec, setStep3Sec] = useState<number>(1);
  //const [languages, setLanguages] = useState<Language[]>([]);
 
  const next = () => setStep((s) => Math.min(s + 1, 5));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const [words, setWords] = useState<WordObj[]>([]);
  
  const [usrInteractiveWords, setUsrInteractiveWords] = useState<WordObj[]>([]);
  
  const [interactiveWords, setInteractiveWords] = useState<WordUIObj[]>([]);
  const [usrCouldSelectUIW, setUsrCouldSelectUIW] = useState<boolean>(false);
  const [interactiveWordsToggle, setInteractiveWordsToggle] = useState<boolean>(false);
  const [usrTestWrites, setUsrTestWrites] = useState<UsrTestWrite[]>([]);
  const [usrDDTests, setUsrDDTests] = useState<DefDetectTest[]>([]);
  const [usrDDTestsP1, setUsrDDTestsP1] = useState<DefDetectTest[]>([]);
  const [usrDDTestsP2, setUsrDDTestsP2] = useState<DefDetectTest[]>([]);
  const [usrDDTestsP3, setUsrDDTestsP3] = useState<DefDetectTest[]>([]);
  const [usrDDTestsP4, setUsrDDTestsP4] = useState<DefDetectTest[]>([]);
  const [usrDDTestsP5, setUsrDDTestsP5] = useState<DefDetectTest[]>([]);
  const [usrWdmTests, setUsrWdmTests] = useState<WdmTest[]>([]);
  const [usrWdmTestsP1, setUsrWdmTestsP1] = useState<WdmTest[]>([]);
  const [usrWdmTestsP2, setUsrWdmTestsP2] = useState<WdmTest[]>([]);
  const [usrWdmTestsP3, setUsrWdmTestsP3] = useState<WdmTest[]>([]);
  const [usrWdmTestsP4, setUsrWdmTestsP4] = useState<WdmTest[]>([]);
  const [usrWdmTestsP5, setUsrWdmTestsP5] = useState<WdmTest[]>([]);
  const [techWords, setTechWords] = useState<TechWordObj[]>([]);
  const [techWordsP1, setTechWordsP1] = useState<TechWordObj[]>([]);
  const [techWordsP2, setTechWordsP2] = useState<TechWordObj[]>([]);
  const [techWordsP3, setTechWordsP3] = useState<TechWordObj[]>([]);
  const [techWordsP4, setTechWordsP4] = useState<TechWordObj[]>([]);
  const [techWordsP5, setTechWordsP5] = useState<TechWordObj[]>([]);
  const [areStaredWordsChanged, setAreStaredWordsChanged] = useState<boolean>(false); 
  const [areStaredWordsPage2Changed, setAreStaredWordsPage2Changed] = useState<boolean>(false);

  const [usrPrevStaredWords, setUsrPrevStaredWords] = useState<WordObjS[]>([]);
  const [usrStaredWords, setUsrStaredWords] = useState<WordObjS[]>([]);

  const [usrPrevStaredWordsPage2, setUsrPrevStaredWordsPage2] = useState<WordObjS[]>([]);
  const [usrStaredWordsPage2, setUsrStaredWordsPage2] = useState<WordObjS[]>([]);
  const [randomWordsPage3, setRandomWordsPage3] = useState<WordObjS[]>([]);

  const [matchesOfDDTests, setMatchesOfDDTests] = useState<MatchesDDT[]>([]);
   
  const [usrTestFills, setUsrTestFills] = useState<UsrTestFill[]>([]); 
  const [usrTestTFs, setUsrTestTFs] = useState<UsrTestTF[]>([]); 
  const [usrTestReplies, setUsrTestReplies] = useState<UsrTestReply[]>([]); 
  const [usrTestAsses, setUsrTestAsses] = useState<UsrTestAss[]>([]);
  
  const [usrTestAssesScore, setUsrTestAssesScore] = useState<Eval>({all: 0, wrong: 0, correct: 0});
  const [usrTestRepliesScore, setUsrTestRepliesScore] = useState<Eval>({all: 0, wrong: 0, correct: 0});
  const [usrTestTFsScore, setUsrTestTFsScore] = useState<Eval>({all: 0, wrong: 0, correct: 0});
  const [usrTestFillsScore, setUsrTestFillsScore] = useState<Eval>({all: 0, wrong: 0, correct: 0});

  const [testFillAnswerToggle, setTestFillAnswerToggle] = useState<boolean>(false);
  const [testTFAnswerToggle, setTestTFAnswerToggle] = useState<boolean>(false);
  const [testReplyAnswerToggle, setTestReplyAnswerToggle] = useState<boolean>(false);
  const [testAssAnswerToggle, setTestAssAnswerToggle] = useState<boolean>(false);
  const [submittingTestFill, setSubmittingTestFill] = useState<boolean>(false);
  const [submittingTestTF, setSubmittingTestTF] = useState<boolean>(false);
  const [submittingTestReply, setSubmittingTestReply] = useState<boolean>(false);
  const [submittingTestAss, setSubmittingTestAss] = useState<boolean>(false);
  const [showLessonPassedMessage, setShowLessonPassedMessage] = useState(false);

  useEffect(()=>{
    setUsrDDTestsP1(usrDDTests.filter(te => (te.part == 1 && te.word != '' && te.text1 != '')));
    setUsrDDTestsP2(usrDDTests.filter(te => (te.part == 2 && te.word != '' && te.text1 != '')));
    setUsrDDTestsP3(usrDDTests.filter(te => (te.part == 3 && te.word != '' && te.text1 != '')));
    setUsrDDTestsP4(usrDDTests.filter(te => (te.part == 4 && te.word != '' && te.text1 != '')));
    setUsrDDTestsP5(usrDDTests.filter(te => (te.part == 5 && te.word != '' && te.text1 != '')));

  }, [usrDDTests]);

  useEffect(()=>{
    setUsrWdmTestsP1(usrWdmTests.filter(te => (te.part == 1 && te.body != '' && te.answer != '')));
    setUsrWdmTestsP2(usrWdmTests.filter(te => (te.part == 2 && te.body != '' && te.answer != '')));
    setUsrWdmTestsP3(usrWdmTests.filter(te => (te.part == 3 && te.body != '' && te.answer != '')));
    setUsrWdmTestsP4(usrWdmTests.filter(te => (te.part == 4 && te.body != '' && te.answer != '')));
    setUsrWdmTestsP5(usrWdmTests.filter(te => (te.part == 5 && te.body != '' && te.answer != '')));
  }, [usrWdmTests]);

  useEffect(()=>{
    setTechWordsP1(techWords.filter(tw => (tw.part == 1 && tw.word != '' && tw.mean != '')));
    setTechWordsP2(techWords.filter(tw => (tw.part == 2 && tw.word != '' && tw.mean != '')));
    setTechWordsP3(techWords.filter(tw => (tw.part == 3 && tw.word != '' && tw.mean != '')));
    setTechWordsP4(techWords.filter(tw => (tw.part == 4 && tw.word != '' && tw.mean != '')));
    setTechWordsP5(techWords.filter(tw => (tw.part == 5 && tw.word != '' && tw.mean != ''))); 
  }, [techWords]);


  
  useEffect(() => {

   const getLesson = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setLesson(data.lesson);
        
      } else {
        alert("The lesson is not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  

  const getWords = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-words`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setWords(data.words); 
      } else {
        alert("The words of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{ }
  };

  getLesson();
  getWords();

    const getTechWords = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-tech-words`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setTechWords(data.words); 
      } else {
        alert("The technical words of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{ }
  };

  getTechWords();
  

  const getUsrTestWrites = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-writes`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) { 
        setUsrTestWrites(data.tests);
        
      } else {
        alert("Tests writes of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrTestWrites();

    const getUsrDDTests = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-dd-tests`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) { 
        setUsrDDTests(data.tests);
        
      } else {
        alert("Definition detective tests of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrDDTests();

      const getUsrWdmTests = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-wdm-tests`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) { 
        setUsrWdmTests(data.tests.map(te => ({id: te.id, part: te.part, 
          body: te.body, answer: te.answer, usr_answer: "", toggle_usr_answer: false})));
        
      } else {
        alert("Why does it matters tests of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrWdmTests();

  const getUsrPrevStaredWordsI = async (i)=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-stared-words`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, part: i })
      });
      const data = await res.json();
      if (res.ok) {
        if(i == 1){
          setUsrPrevStaredWords(data.words ?? []);
          setUsrStaredWords(data.words ?? []);
        }
        if(i == 2){
          setUsrPrevStaredWordsPage2(data.words ?? []);
          setUsrStaredWordsPage2(data.words ?? []);
        }
        
        
      } else {
        alert("Stared words of page " + i + " are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrPrevStaredWordsI(1);
  getUsrPrevStaredWordsI(2);
 
  const getUsrTestFills = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-fills`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setUsrTestFills(data.tests);
        
      } else {
        alert("Tests fills of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrTestFills();

  const getUsrTestTFs = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-tfs`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setUsrTestTFs(data.tests);
        
      } else {
        alert("Tests True/False of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrTestTFs();

  const getUsrTestReplies = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-replies`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setUsrTestReplies(data.tests);
        
      } else {
        alert("Tests Replies of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrTestReplies();

   const getUsrTestAsses = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-asses`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        setUsrTestAsses(data.tests);
        
      } else {
        alert("Tests Assessment of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  getUsrTestAsses();
    

  }, [lessonId]);


useEffect(()=>{

  const getUsrTestFillsScore = async () => {
        try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-fills-score`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        
        setUsrTestFillsScore({all: data.all, wrong: data.wrong, correct: data.correct});
        
      } else {
        //alert("Tests Assessment of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }

  };
 
      const getUsrTestTFsScore = async () => {
        try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-tfs-score`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        
        setUsrTestTFsScore({all: data.all, wrong: data.wrong, correct: data.correct});
        
      } else {
        //alert("Tests Assessment of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }

  };
    const getUsrTestRepliesScore = async () => {
        try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-replies-score`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        
        setUsrTestRepliesScore({all: data.all, wrong: data.wrong, correct: data.correct});
        
      } else {
        //alert("Tests Assessment of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }

  };
  const getUsrTestAssesScore = async () => {
        try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-test-asses-score`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, })
      });
      const data = await res.json();
      if (res.ok) {
        
        setUsrTestAssesScore({all: data.all, wrong: data.wrong, correct: data.correct});
        
      } else {
        //alert("Tests Assessment of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }

  };
  
  if(step == 3){
    getUsrTestFillsScore();
    getUsrTestTFsScore();
  }
  
  if(step == 4){
    getUsrTestRepliesScore();
  }
  if(step == 5){
    getUsrTestAssesScore();
  }
}, [step, testFillAnswerToggle, testTFAnswerToggle, testReplyAnswerToggle,testAssAnswerToggle]);

useEffect(()=>{

  const shuffleArray = array => [...array].sort(() => Math.random() - 0.5);

  const makeRandomWordsPage3 = () => {
    if(randomWordsPage3.length >= 2){
      return;
    }
    const rand_words = shuffleArray(words).map((w, i)=> ({word_id: w.id, status: 1, learned: false}));
    setRandomWordsPage3(rand_words);
  };

  if(step == 3){
    makeRandomWordsPage3();
  }


}, [step, words]);

useEffect(()=>{

  const updateFieldUsrStatus = async () => {
        try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-field-user-status`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ lessonId: lessonId, fieldId: fieldId })
      });
      const data = await res.json();
      if (res.ok) {
        if(data.passed){
          setShowLessonPassedMessage(true);        
        }
      } else { }
    } catch (err) { } finally{ }
  };

  updateFieldUsrStatus();

}, [testFillAnswerToggle, testTFAnswerToggle, testReplyAnswerToggle,testAssAnswerToggle]);

useEffect(() => {
  if (!showLessonPassedMessage) return;

  const timer = setTimeout(() => {
    setShowLessonPassedMessage(false);
  }, 5000);

  return () => clearTimeout(timer);
}, [showLessonPassedMessage]);

  useEffect(() => {

      const getInteractiveWords = async () => {
        try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-iwords`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ 
                userId: user.id,
                lessonId: lessonId,
                fieldId: fieldId, })
      });
      const data = await res.json();
      if (res.ok) { 
        if(data.words.length > 0){
          setInteractiveWords(data.words); 
          const selected = Math.max(...data.words.map(w => (w.user_selected ? 1 : 0)  ));
          if(selected == 0){
            setUsrCouldSelectUIW(true);
          }

        } else {
          setUsrCouldSelectUIW(true);
        }
         
       } else {
        alert("Please refresh the page. Interactive words failed to load!");
      } } catch (err) {} finally{ }
  };

  getInteractiveWords();

  }, [interactiveWordsToggle]);


 
  // Update a single word by id
  /*function updateWord(id: number, updatedWord: WordObj) {
    setWords(prev =>
      prev.map(word => (word.id === id ? updatedWord : word))
    );
    setSaveWordsStatus(true);
  }*/

  const submitInteractiveWords = async () => {
        try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-uiwords`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ 
                userId: user.id,
                lessonId: lessonId,
                fieldId: fieldId,
                words: usrInteractiveWords, })
      });
      const data = await res.json();
      if (res.ok) { 
        if(data.success){
          setUsrCouldSelectUIW(false);
          setInteractiveWordsToggle(!interactiveWordsToggle);
        } 
        } else {
        alert("Try again! Your selected words did not save!");
      } } catch (err) {} finally{ }
  };

  const updateTWrAnswer = (test, answer) => {
    setUsrTestWrites(prev => prev.map(t => t.id == test.id ? {...t, usr_answer: answer} : t));

  };

  const updateWdmUsrAnswer = (test, answer) => {
    setUsrWdmTests(prev => prev.map(te => te.id == test.id ? {...te, usr_answer: answer} : te));
  };

  const saveTWrAnswer = async (test) => {
            try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-usr-testwrite-answer`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                testId: test.id,
                lessonId: lessonId,
                answer: test.usr_answer, })
      });
      //const data = await res.json();
      if (res.ok) { 
        alert("Your answer saved successfully.");
        } else {
        alert("Try again! Your answer did not save!");
      } } catch (err) {} finally{ } 
  };

  const submitStaredWordsI = async (i) => { 

    const words_s = (i == 1) ? usrStaredWords : usrStaredWordsPage2;
    const payload = {lessonId: lessonId, part: i, words: words_s}; 
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-user-stared-words`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        if(i == 1){
          setUsrPrevStaredWords(usrStaredWords);
        }
        if(i == 2){
          setUsrPrevStaredWordsPage2(usrStaredWordsPage2);
        }


      } else {
        alert("Selected words are not saved!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  useEffect(()=>{ 
    setAreStaredWordsChanged(checkForStaredWordChange(usrPrevStaredWords, usrStaredWords));
  }, [usrStaredWords, usrPrevStaredWords]);

  useEffect(()=>{
    setAreStaredWordsPage2Changed(checkForStaredWordChange(usrPrevStaredWordsPage2, usrStaredWordsPage2));
  }, [usrStaredWordsPage2, usrPrevStaredWordsPage2]);

  const checkForStaredWordChange = (prev, curr) => {
    if(curr.length != prev.length) return true;
    const prevIds = new Set(prev.map(w => w.id));
    return curr.some(w => !prevIds.has(w.id));
  };

  const updateMatchedDDTest = (test_id, match) => {
    setMatchesOfDDTests(prev =>
  prev.some(t => t.test_id == test_id)
    ? prev.map(t =>
        t.test_id == test_id ? { ...t, match } : t
      )
    : [...prev, { test_id: test_id, match: match }]); 

  };

  const updateUsrAnswerTestFill = (num, test, val) => {
    if(num == 1){
      setUsrTestFills(usrTestFills.map(te => te.id == test.id ? {...te, usr_answer1: val} :
      te));
    }

    if(num == 2){
      setUsrTestFills(usrTestFills.map(te => te.id == test.id ? {...te, usr_answer2: val} :
      te));
    }
    
  };

  const submitTestFillsAnswer = async () => {

    const payload = {lessonId: lessonId, tests: usrTestFills}; 
    try {
      setSubmittingTestFill(true); 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-user-testfills-answer`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setTestFillAnswerToggle(!testFillAnswerToggle);

        //alert("Test answer saved!");

      } else {
        alert("Test answer is not saved!");
        
      }
    } catch (err) {
      
    } finally{setSubmittingTestFill(false);}

  };

    const updateUsrAnswerTestTF = (test, val) => {
      setUsrTestTFs(usrTestTFs.map(te => te.id == test.id ? {...te, usr_answer: val} :
      te));
   };

  const submitTestTFsAnswer = async () => {

    const payload = {lessonId: lessonId, tests: usrTestTFs}; 
    try {
      setSubmittingTestTF(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-user-testtfs-answer`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setTestTFAnswerToggle(!testTFAnswerToggle);

      } else {
        alert("Test answer is not saved!");
        
      }
    } catch (err) {
      
    } finally{ setSubmittingTestTF(false); }

  };

  const updateUsrAnswerTestReply = (test, val) => {
      setUsrTestReplies(prev => prev.map(tr => tr.id == test.id ? {...tr, usr_answer: val} : tr));
   };

  const submitTestRepliesAnswer = async () => {

    const payload = {lessonId: lessonId, tests: usrTestReplies}; 
    try {
      setSubmittingTestReply(true); 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-user-testreplies-answer`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setTestReplyAnswerToggle(!testReplyAnswerToggle);

      } else {
        alert("Test answer is not saved!");
        
      }
    } catch (err) {
      
    } finally{ setSubmittingTestReply(false); }

  };

  const updateUsrAnswerTestAss = (test, val) => {
      setUsrTestAsses(prev => prev.map(ta => ta.id == test.id ? {...ta, usr_answer: val} : ta));
   };

   const submitTestAssesAnswer = async () => {

    const payload = {lessonId: lessonId, tests: usrTestAsses}; 
    try {
      setSubmittingTestAss(true); 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save-user-testasses-answer`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setTestAssAnswerToggle(!testAssAnswerToggle);

      } else {
        alert("Test answer is not saved!");
        
      }
    } catch (err) {
      
    } finally{setSubmittingTestAss(false); }

  };

  const navStep1 = (num)=>{
    if(step1Sec == num){
      return;
    }
    setStep1Sec(num);
  };

  const navStep2 = (num)=>{
    if(step2Sec == num){
      return;
    }
    setStep2Sec(num);
  };

  const navStep3 = (num)=>{
    if(step3Sec == num){
      return;
    }
    setStep3Sec(num);
  };

   


 
	if (!user) {
    return <div>You do not have access to this page!</div>;
  }

   return <>
   {step == 1 && (<div className="flex w-full">
   <div className="flex flex-col fixed top-17 left-1 h-fit w-48 border-2 border-blue-500 rounded-md">
    <div className="flex sticky top-5 flex-col h-fit w-full py-4 px-1">
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
        ${step1Sec == 1 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep1(1)}>Video</div>
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md 
      ${step1Sec == 2 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep1(2)}>Words Cloud</div>
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
       ${step1Sec == 3 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep1(3)}>Technical Terms</div>
    </div>
  </div>
   <div className="flex flex-col
    items-center w-full border-2 border-green-500 rounded-md">
    {step1Sec == 1 && (<div className="flex flex-col w-full items-center overflow-y-scroll scrollbar-hide">
      <div className="flex border-1 border-red-300 w-fit mt-4 px-4 py-1 ">
      <div className="flex p-2 font-semibold text-xl">{lesson?.title}</div>
      <div className="flex p-2 w-36 h-36 relative border-2 border-blue-300 rounded-md">
        <img src={lesson?.img_path || null} alt="Lesson Image"
          className="w-fit h-fit rounded-md mr-2"/>
      </div></div>
     
      <div className="flex p-2 mt-8 w-1/3 h-fit relative border-2 border-blue-300 rounded-md">
        {lesson?.abstract}
      </div>

      <div className="flex w-1/2 p-2 mt-8 relative border-2 border-blue-300 rounded-md">
        <iframe width="100%" height="420"
         allowFullScreen src={lesson.video1}
        allowFullScreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe> 
      </div> 
     <div className="flex p-2 mt-8 w-2/3 h-fit relative border-2 border-blue-300 rounded-md">
        {lesson?.video1_text}
      </div></div>)}
{step1Sec == 2 && (<>{(interactiveWords.length > 0) && (<div className="flex 
  flex-col p-2 mt-2 w-2/3 relative
       border-2 border-blue-300 rounded-md"> 
        <WordCloud words={interactiveWords}/>
      </div> )} 
      {usrCouldSelectUIW && (<div className="flex flex-col p-2 mt-8 w-2/3 
        h-fit relative border-2 border-blue-300 rounded-md">
        <div className="flex">Which words are new or interesting to you? plese select three words.</div>
        <div className="flex"><InteractiveWordsBox words={words}
         onSelect={(wordsArray)=>{setUsrInteractiveWords(wordsArray)}}
         saveInteractiveWords={()=>submitInteractiveWords()}/></div>
      </div> )} 
</>)}
{step1Sec == 3 && (<>
    <div className="flex flex-col p-2 mt-8 w-2/3 min-h-48 relative
       border-2 border-blue-300 rounded-md">
        <ParseText text={lesson?.tech_term_body} words={words} staredWords={usrStaredWords} 
          addRemoveStaredWords={(w)=> {
          usrStaredWords.find(word => word.word_id == w.id) ?
           setUsrStaredWords(usrStaredWords.filter(word => (word.word_id != w.id))) :
           setUsrStaredWords(prev=> [...prev, {word_id: w.id, status:1, learned:false}]);
             }}/>
        {usrStaredWords.length > 0 && (<div className="flex flex-col justify-center items-center
         w-full absolute bottom-1 left-0
         mt-6 px-4 py-2 border-1 border-gray-300 rounded-md">
          <div className="flex w-full bg-gray-50 rounded-md">
          {usrStaredWords.map((w, i)=>(
         <div key={w.id} className="flex px-2 py-1
        border-2 border-gray-300 mx-4 my-2 rounded-md">{words.find(wo => wo.id == w.word_id)?.word}</div>
        ))} 
        </div>
        {areStaredWordsChanged && (<div className="flex w-fit px-2
         py-1 my-2 border-1 border-blue-500 rounded-md hover:bg-gray-50 
         hover:cursor-pointer hover:shadow-md" onClick={() => submitStaredWordsI(1)}>
         Save Selected Words</div>)}
        </div>)}
      </div>      
      <div className="flex flex-col p-2 mt-8 w-2/3 min-h-48 relative items-center justify-center
       border-2 border-blue-300 rounded-md">
        {usrTestWrites.map((test, ind)=> (<div key={test.id} className="flex flex-col w-full">
          <div className="flex w-full">{test.body}</div>
          <textarea className="flex bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
        value={test.usr_answer ?? ''}
                onChange={(e) => updateTWrAnswer(test, e.target.value)}
                placeholder="Your answer..." rows="5" cols="50"  /*disabled={isSubmitting}*/></textarea>
        <div className="flex w-fit border-1 border-blue-500 hover:cursor-pointer
          hover:bg-gray-50 hover:shadow-md px-4 py-1 rounded-md my-4"
           onClick={()=>saveTWrAnswer(test)}>Save</div>

        </div>))}
      </div>
            <div className="flex w-2/3 my-4 px-4 py-2 border-1 border-blue-500 rounded-md">
          <MatchWordMean words={words} stared={usrStaredWords} />
        </div>
</>)}</div></div>)}
    { step == 2 && (<><div className="flex w-full"><div className="flex flex-col w-48
     border-2 border-blue-500 rounded-md">
    <div className="flex flex-col h-fit py-4 px-1">
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
        ${step2Sec == 1 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep2(1)}>Paragraph 1</div>
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md 
      ${step2Sec == 2 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep2(2)}>Paragraph 2</div>
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
       ${step2Sec == 3 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep2(3)}>Paragraph 3</div>
           <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
       ${step2Sec == 4 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep2(4)}>Paragraph 4</div>
           <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
       ${step2Sec == 5 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep2(5)}>Paragraph 5</div>
     <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
       ${step2Sec == 6 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep2(6)}>Match Words</div>
    </div>
  </div>
<div className="flex flex-col items-center p-2 mt-8 w-full">
  {step2Sec < 6 && (<div className="flex flex-col p-2 mt-8 w-2/3">
        Please read the following text and do the next exercises.
      </div>)}
  {step2Sec == 6 && (<div className="flex flex-col p-2 mt-8 w-2/3">
        Please drag & drop the meaning (at right) to suitable word (at left).
      </div>)}

      {step2Sec == 1 && (<div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
        <ParseText text={lesson?.text_p21} words={words} staredWords={usrStaredWordsPage2} 
          addRemoveStaredWords={(w)=> {
          usrStaredWordsPage2.find(word => word.word_id == w.id) ?
           setUsrStaredWordsPage2(usrStaredWordsPage2.filter(word => (word.word_id != w.id))) :
           setUsrStaredWordsPage2(prev=> [...prev, {word_id: w.id, status: 1, learned: false}]);
             }}/> 
      </div>
      <div className="flex flex-col p-2 mt-4 w-2/3">
        {usrDDTestsP1.length > 0 && (<div className="flex w-full py-1 my-2">
          Drag and drop the word at left to the correct phrase at right.</div>)}
       {usrDDTestsP1.length > 0 && (<div className="flex flex-col w-full my-2 px-2">
        {usrDDTestsP1.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <UsrDDTestComp test={test}
           match={matchesOfDDTests.find(mt => mt.test_id == test.id)?.match ?? 0}
            saveMatch={(match)=>updateMatchedDDTest(test.id, match)}/>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col mt-2 w-2/3">
        {usrWdmTestsP1.length > 0 && (<div className="flex w-full py-1 my-2">
          Write your answer, then you can see the true answer.</div>)}
       {usrWdmTestsP1.length > 0 && (<div className="flex flex-col w-full px-2">
        {usrWdmTestsP1.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <div className="flex flex-col w-full rounded-md">
            <div className="flex w-full py-2 px-2">{test.body}</div>
            <div className="flex w-full">
                        <textarea className="flex w-5/6 bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
               value={test.usr_answer ?? ''}
                onChange={(e) => updateWdmUsrAnswer(test, e.target.value)}
                placeholder="Your answer..." rows="5" cols="50"  /*disabled={isSubmitting}*/></textarea>
              <div className="flex justify-center items-center w-1/6">
                <div className="flex w-fit text-xs py-1 px-2
                hover:cursor-pointer hover:shadow-lg border-2 border-blue-300 rounded-md"
                onClick={()=>{
                  setUsrWdmTests(prev => prev.map(te=> te.id == test.id ?
                   {...te, toggle_usr_answer: !test.toggle_usr_answer} : prev));}}>
                  Show correct answer
                </div>
              </div>
            </div>
            { (test.usr_answer != '' && test.toggle_usr_answer) && 
            (<div className="flex w-full py-2 px-2 my-2 bg-green-200 rounded-md">
              {test.answer}</div>)}
          </div>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col p-2 mt-4 w-2/3">
        {techWordsP1.length > 0 && (<div className="flex w-full py-1">
          Note at the following technical words.</div>)}
       {techWordsP1.length > 0 && (<div className="flex flex-col 
        w-full my-1 px-2">
        {techWordsP1.map((tecWord, i)=>(<div key={tecWord.id} 
          className="flex w-full px-2 py-1 my-1 border-b-1 border-blue-500">
         <div className="flex w-1/5 px-2 py-1 my-1">{tecWord.word}</div>
       <div className="flex flex-col w-4/5 px-2 py-1 my-1">
        {tecWord.mean}</div></div>))}</div>)}</div></div>
)}
      {step2Sec == 2 && (
       <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
        <ParseText text={lesson?.text_p22} words={words} staredWords={usrStaredWordsPage2} 
          addRemoveStaredWords={(w)=> {
          usrStaredWordsPage2.find(word => word.word_id == w.id) ?
           setUsrStaredWordsPage2(usrStaredWordsPage2.filter(word => (word.word_id != w.id))) :
           setUsrStaredWordsPage2(prev=> [...prev, {word_id: w.id, status: 1, learned: false}]);
             }}/></div><div className="flex flex-col p-2 mt-4 w-2/3">
        {usrDDTestsP2.length > 0 && (<div className="flex w-full py-1 my-2">
          Drag and drop the word at left to the correct phrase at right.</div>)}
       {usrDDTestsP2.length > 0 && (<div className="flex flex-col w-full my-2 px-2">
        {usrDDTestsP2.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <UsrDDTestComp test={test}
           match={matchesOfDDTests.find(mt => mt.test_id == test.id)?.match ?? 0}
            saveMatch={(match)=>updateMatchedDDTest(test.id, match)}/>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col mt-2 w-2/3">
        {usrWdmTestsP2.length > 0 && (<div className="flex w-full py-1 my-2">
          Write your answer, then you can see the true answer.</div>)}
       {usrWdmTestsP2.length > 0 && (<div className="flex flex-col w-full px-2">
        {usrWdmTestsP2.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <div className="flex flex-col w-full rounded-md">
            <div className="flex w-full py-2 px-2">{test.body}</div>
            <div className="flex w-full">
                        <textarea className="flex w-5/6 bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
               value={test.usr_answer ?? ''}
                onChange={(e) => updateWdmUsrAnswer(test, e.target.value)}
                placeholder="Your answer..." rows="5" cols="50"  /*disabled={isSubmitting}*/></textarea>
              <div className="flex justify-center items-center w-1/6">
                <div className="flex w-fit text-xs py-1 px-2
                hover:cursor-pointer hover:shadow-lg border-2 border-blue-300 rounded-md"
                onClick={()=>{
                  setUsrWdmTests(prev => prev.map(te=> te.id == test.id ?
                   {...te, toggle_usr_answer: !test.toggle_usr_answer} : prev));}}>
                  Show correct answer
                </div>
              </div>
            </div>
            { (test.usr_answer != '' && test.toggle_usr_answer) && 
            (<div className="flex w-full py-2 px-2 my-2 bg-green-200 rounded-md">
              {test.answer}</div>)}
          </div>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col p-2 mt-4 w-2/3">
        {techWordsP2.length > 0 && (<div className="flex w-full py-1">
          Note at the following technical words.</div>)}
       {techWordsP2.length > 0 && (<div className="flex flex-col 
        w-full my-1 px-2">
        {techWordsP2.map((tecWord, i)=>(<div key={tecWord.id} 
          className="flex w-full px-2 py-1 my-1 border-b-1 border-blue-500">
         <div className="flex w-1/5 px-2 py-1 my-1">{tecWord.word}</div>
       <div className="flex flex-col w-4/5 px-2 py-1 my-1">
        {tecWord.mean}</div></div>))}</div>)}</div></div>)}

      {step2Sec == 3 && (
       <div className="flex items-center flex-col w-full">
<div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
        <ParseText text={lesson?.text_p23} words={words} staredWords={usrStaredWordsPage2} 
          addRemoveStaredWords={(w)=> {
          usrStaredWordsPage2.find(word => word.word_id == w.id) ?
           setUsrStaredWordsPage2(usrStaredWordsPage2.filter(word => (word.word_id != w.id))) :
           setUsrStaredWordsPage2(prev=> [...prev, {word_id: w.id, status: 1, learned: false}]);
             }}/></div><div className="flex flex-col p-2 mt-4 w-2/3">
        {usrDDTestsP3.length > 0 && (<div className="flex w-full py-1 my-2">
          Drag and drop the word at left to the correct phrase at right.</div>)}
       {usrDDTestsP3.length > 0 && (<div className="flex flex-col w-full my-2 px-2">
        {usrDDTestsP3.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <UsrDDTestComp test={test}
           match={matchesOfDDTests.find(mt => mt.test_id == test.id)?.match ?? 0}
            saveMatch={(match)=>updateMatchedDDTest(test.id, match)}/>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col mt-2 w-2/3">
        {usrWdmTestsP3.length > 0 && (<div className="flex w-full py-1 my-2">
          Write your answer, then you can see the true answer.</div>)}
       {usrWdmTestsP3.length > 0 && (<div className="flex flex-col w-full px-2">
        {usrWdmTestsP3.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <div className="flex flex-col w-full rounded-md">
            <div className="flex w-full py-2 px-2">{test.body}</div>
            <div className="flex w-full">
                        <textarea className="flex w-5/6 bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
               value={test.usr_answer ?? ''}
                onChange={(e) => updateWdmUsrAnswer(test, e.target.value)}
                placeholder="Your answer..." rows="5" cols="50"  /*disabled={isSubmitting}*/></textarea>
              <div className="flex justify-center items-center w-1/6">
                <div className="flex w-fit text-xs py-1 px-2
                hover:cursor-pointer hover:shadow-lg border-2 border-blue-300 rounded-md"
                onClick={()=>{
                  setUsrWdmTests(prev => prev.map(te=> te.id == test.id ?
                   {...te, toggle_usr_answer: !test.toggle_usr_answer} : prev));}}>
                  Show correct answer
                </div>
              </div>
            </div>
            { (test.usr_answer != '' && test.toggle_usr_answer) && 
            (<div className="flex w-full py-2 px-2 my-2 bg-green-200 rounded-md">
              {test.answer}</div>)}
          </div>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col p-2 mt-4 w-2/3">
        {techWordsP3.length > 0 && (<div className="flex w-full py-1">
          Note at the following technical words.</div>)}
       {techWordsP3.length > 0 && (<div className="flex flex-col 
        w-full my-1 px-2">
        {techWordsP3.map((tecWord, i)=>(<div key={tecWord.id} 
          className="flex w-full px-2 py-1 my-1 border-b-1 border-blue-500">
         <div className="flex w-1/5 px-2 py-1 my-1">{tecWord.word}</div>
       <div className="flex flex-col w-4/5 px-2 py-1 my-1">
        {tecWord.mean}</div></div>))}</div>)}</div></div>)}

      {step2Sec == 4 && (
      <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
        <ParseText text={lesson?.text_p24} words={words} staredWords={usrStaredWordsPage2} 
          addRemoveStaredWords={(w)=> {
          usrStaredWordsPage2.find(word => word.word_id == w.id) ?
           setUsrStaredWordsPage2(usrStaredWordsPage2.filter(word => (word.word_id != w.id))) :
           setUsrStaredWordsPage2(prev=> [...prev, {word_id: w.id, status: 1, learned: false}]);
             }}/></div><div className="flex flex-col p-2 mt-4 w-2/3">
        {usrDDTestsP4.length > 0 && (<div className="flex w-full py-1 my-2">
          Drag and drop the word at left to the correct phrase at right.</div>)}
       {usrDDTestsP4.length > 0 && (<div className="flex flex-col w-full my-2 px-2">
        {usrDDTestsP4.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <UsrDDTestComp test={test}
           match={matchesOfDDTests.find(mt => mt.test_id == test.id)?.match ?? 0}
            saveMatch={(match)=>updateMatchedDDTest(test.id, match)}/>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col mt-2 w-2/3">
        {usrWdmTestsP4.length > 0 && (<div className="flex w-full py-1 my-2">
          Write your answer, then you can see the true answer.</div>)}
       {usrWdmTestsP4.length > 0 && (<div className="flex flex-col w-full px-2">
        {usrWdmTestsP4.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <div className="flex flex-col w-full rounded-md">
            <div className="flex w-full py-2 px-2">{test.body}</div>
            <div className="flex w-full">
                        <textarea className="flex w-5/6 bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
               value={test.usr_answer ?? ''}
                onChange={(e) => updateWdmUsrAnswer(test, e.target.value)}
                placeholder="Your answer..." rows="5" cols="50"  /*disabled={isSubmitting}*/></textarea>
              <div className="flex justify-center items-center w-1/6">
                <div className="flex w-fit text-xs py-1 px-2
                hover:cursor-pointer hover:shadow-lg border-2 border-blue-300 rounded-md"
                onClick={()=>{
                  setUsrWdmTests(prev => prev.map(te=> te.id == test.id ?
                   {...te, toggle_usr_answer: !test.toggle_usr_answer} : prev));}}>
                  Show correct answer
                </div>
              </div>
            </div>
            { (test.usr_answer != '' && test.toggle_usr_answer) && 
            (<div className="flex w-full py-2 px-2 my-2 bg-green-200 rounded-md">
              {test.answer}</div>)}
          </div>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col p-2 mt-4 w-2/3">
        {techWordsP4.length > 0 && (<div className="flex w-full py-1">
          Note at the following technical words.</div>)}
       {techWordsP4.length > 0 && (<div className="flex flex-col 
        w-full my-1 px-2">
        {techWordsP4.map((tecWord, i)=>(<div key={tecWord.id} 
          className="flex w-full px-2 py-1 my-1 border-b-1 border-blue-500">
         <div className="flex w-1/5 px-2 py-1 my-1">{tecWord.word}</div>
       <div className="flex flex-col w-4/5 px-2 py-1 my-1">
        {tecWord.mean}</div></div>))}</div>)}</div></div>)}
      {step2Sec == 5 && (
     <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
        <ParseText text={lesson?.text_p25} words={words} staredWords={usrStaredWordsPage2} 
          addRemoveStaredWords={(w)=> {
          usrStaredWordsPage2.find(word => word.word_id == w.id) ?
           setUsrStaredWordsPage2(usrStaredWordsPage2.filter(word => (word.word_id != w.id))) :
           setUsrStaredWordsPage2(prev=> [...prev, {word_id: w.id, status: 1, learned: false}]);
             }}/></div><div className="flex flex-col p-2 mt-4 w-2/3">
        {usrDDTestsP5.length > 0 && (<div className="flex w-full py-1 my-2">
          Drag and drop the word at left to the correct phrase at right.</div>)}
       {usrDDTestsP5.length > 0 && (<div className="flex flex-col w-full my-2 px-2">
        {usrDDTestsP5.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <UsrDDTestComp test={test}
           match={matchesOfDDTests.find(mt => mt.test_id == test.id)?.match ?? 0}
            saveMatch={(match)=>updateMatchedDDTest(test.id, match)}/>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col mt-2 w-2/3">
        {usrWdmTestsP5.length > 0 && (<div className="flex w-full py-1 my-2">
          Write your answer, then you can see the true answer.</div>)}
       {usrWdmTestsP5.length > 0 && (<div className="flex flex-col w-full px-2">
        {usrWdmTestsP5.map((test, i)=>(<div key={test.id} className="flex w-full px-2 py-2 my-2
         border-2 border-gray-500 rounded-md">
          <div className="flex flex-col w-full rounded-md">
            <div className="flex w-full py-2 px-2">{test.body}</div>
            <div className="flex w-full">
            <textarea className="flex w-5/6 bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
               value={test.usr_answer ?? ''}
                onChange={(e) => updateWdmUsrAnswer(test, e.target.value)}
                placeholder="Your answer..." rows="5" cols="50"  /*disabled={isSubmitting}*/></textarea>
              <div className="flex justify-center items-center w-1/6">
                <div className="flex w-fit text-xs py-1 px-2
                hover:cursor-pointer hover:shadow-lg border-2 border-blue-300 rounded-md"
                onClick={()=>{
                  setUsrWdmTests(prev => prev.map(te=> te.id == test.id ?
                   {...te, toggle_usr_answer: !test.toggle_usr_answer} : prev));}}>
                  Show correct answer
                </div>
              </div>
            </div>
            { (test.usr_answer != '' && test.toggle_usr_answer) && 
            (<div className="flex w-full py-2 px-2 my-2 bg-green-200 rounded-md">
              {test.answer}</div>)}
          </div>
       </div>))}</div>)}
      </div>
      <div className="flex flex-col p-2 mt-4 w-2/3">
        {techWordsP5.length > 0 && (<div className="flex w-full py-1">
          Note at the following technical words.</div>)}
       {techWordsP5.length > 0 && (<div className="flex flex-col 
        w-full my-1 px-2">
        {techWordsP5.map((tecWord, i)=>(<div key={tecWord.id} 
          className="flex w-full px-2 py-1 my-1 border-b-1 border-blue-500">
         <div className="flex w-1/5 px-2 py-1 my-1">{tecWord.word}</div>
       <div className="flex flex-col w-4/5 px-2 py-1 my-1">
        {tecWord.mean}</div></div>))}</div>)}</div>
</div>)}
      {step2Sec == 6 && usrStaredWordsPage2.length > 0 &&(
        <div className="flex w-full justify-center items-center">
  <div className="flex w-2/3 items-center my-4 px-4 py-2
 border-1 border-blue-500 rounded-md">
          <MatchWordMean words={words} stared={usrStaredWordsPage2} />
        </div></div>)}
      </div>
</div>
 </>)}

{ step == 3 && (<><div className="flex w-full">
  <div className="flex flex-col w-48
     border-2 border-blue-500 rounded-md">
       <div className="flex flex-col h-fit py-4 px-1">
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
        ${step3Sec == 1 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep3(1)}>Match The Peers</div>
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md 
      ${step3Sec == 2 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep3(2)}>Fill In The Blanks</div>
      <div className={`flex px-4 py-1 mt-2 bg-blue-50 rounded-md
       ${step3Sec == 3 ? "text-gray-400 hover:none" :
         "hover:text-blue-700 hover:cursor-pointer hover:shadow-md"
     }`} onClick={()=>navStep3(3)}>True/False</div>
    </div>
     </div>
     {step3Sec == 1 && (<div className="flex flex-col w-full justify-center items-center">
      <div className="flex p-2 mt-8 w-2/3">
        Drag & drop the meaning (at right) to suitable word (at left).
      </div>
  <div className="flex w-2/3 items-center my-4 px-4 py-2
 border-1 border-blue-500 rounded-md">
          <MatchWordMean words={words} stared={randomWordsPage3} />
        </div></div>)}
     {step3Sec == 2 && (<div className="flex justify-center items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3">
        Please fill the blanks.
      </div><div className="flex flex-col p-2 mt-2 w-2/3 border-2 border-blue-300 rounded-md">
      {usrTestFills.map((tf, ind)=>(<div key={tf.id} className="flex w-full">
        <div className="flex px-1 py-1 w-fit font-semibold text-blue-500 
        bg-blue-200 justify-center items-center mt-4">{ind+1}</div>
        <TestFill test={tf} 
           updateUsrAnswer={(num, te, val)=>updateUsrAnswerTestFill(num, te, val)} /></div>))}
      <div className="flex w-fit"><div className="flex px-2 py-1 w-fit mt-4 border-1
       border-gray-300 rounded-md hover:cursor-pointer hover:shadow-md"
                onClick={submitTestFillsAnswer}>Save Answers</div>
                {submittingTestFill && (<div className="flex px-2 py-1 w-fit mt-4">Sending...</div>)}</div>
      {showLessonPassedMessage &&(<div className="flex w-fit px-4 py-2 text-green-700
       bg-green-300 rounded-md font-semibold">Congratulations! You passed this lesson and
        can take the next lesson!</div>)}
      </div>
      <div className="flex w-fit"><TestEvaluation data={usrTestFillsScore}/></div>
</div>)}
     {step3Sec == 3 && (<div className="flex justify-center items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3">
        Please state that the sentence is true or false.
      </div>
      <div className="flex flex-col p-2 mt-2 w-2/3 border-2 border-blue-300 rounded-md">
      {usrTestTFs.map((ttf, ind)=>(<div key={ttf.id} className="flex w-full">
        <div className="flex px-1 py-1 w-fit font-semibold text-blue-500 
        bg-blue-200 justify-center items-center mt-4">{ind+1}</div>
        <TestTF test={ttf} 
           updateUsrAnswer={(te, val)=>updateUsrAnswerTestTF(te, val)} /></div>))}
      <div className="flex w-fit"><div className="flex px-2 py-1 w-fit mt-4 border-1
       border-gray-300 rounded-md hover:cursor-pointer hover:shadow-md"
                onClick={submitTestTFsAnswer}>Save Answers</div>
                {submittingTestTF && (<div className="flex px-2 py-1 w-fit mt-4">Sending...</div>)}</div>
                {showLessonPassedMessage &&(<div className="flex w-fit px-4 py-2 text-green-700
       bg-green-300 rounded-md font-semibold">Congratulations! You passed this lesson and
        can take the next lesson!</div>)}  
      </div>
<div className="flex w-fit"><TestEvaluation data={usrTestTFsScore}/></div>
    </div>)}
</div></>)}

{ step == 4 && (<><div className="flex justify-center items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3">
        Please select the most correct reply.
      </div>
      <div className="flex flex-col p-2 mt-2 w-2/3 border-2 border-blue-300 rounded-md">
      {usrTestReplies.map((tr, ind)=>(<div key={tr.id} className="flex w-full">
        <div className="flex px-1 py-1 w-fit font-semibold text-blue-500 
        bg-blue-200 justify-center items-center mt-4">{ind+1}</div>
        <TestReply test={tr} 
           updateUsrAnswer={(te, val)=>updateUsrAnswerTestReply(te, val)} /></div>))}
      <div className="flex w-fit"><div className="flex px-2 py-1 w-fit mt-4 border-1
       border-gray-300 rounded-md hover:cursor-pointer hover:shadow-md"
                onClick={submitTestRepliesAnswer}>Save Answers</div>
                {submittingTestReply && (<div className="flex px-2 py-1 w-fit mt-4">Sending...</div>)}</div>
                {showLessonPassedMessage &&(<div className="flex w-fit px-4 py-2 text-green-700
       bg-green-300 rounded-md font-semibold">Congratulations! You passed this lesson and
        can take the next lesson!</div>)}
      </div>
    <div className="flex w-fit"><TestEvaluation data={usrTestRepliesScore}/></div>
  </div></>)}
{ step == 5 && (<><div className="flex justify-center items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3">
        Please select the correct answer.
         Note that when you saved the answers, you will not be able to answer again.
      </div>
      <div className="flex flex-col p-2 mt-2 w-2/3 border-2 border-blue-300 rounded-md">
      {usrTestAsses.map((ta, ind)=>(<div key={ta.id} className="flex w-full">
        <div className="flex px-1 py-1 w-fit font-semibold text-blue-500 
        bg-blue-200 justify-center items-center mt-4">{ind+1}</div>
        <TestAss test={ta} 
           updateUsrAnswer={(ta, val)=>updateUsrAnswerTestAss(ta, val)} /></div>))}
      <div className="flex w-fit"><div className="flex px-2 py-1 w-fit mt-4 border-1
       border-gray-300 rounded-md hover:cursor-pointer hover:shadow-md"
                onClick={submitTestAssesAnswer}>Save Answers</div>
                {submittingTestAss && (<div className="flex px-2 py-1 w-fit mt-4">Sending...</div>)}</div>
                {showLessonPassedMessage &&(<div className="flex w-fit px-4 py-2 text-green-700
       bg-green-300 rounded-md font-semibold">Congratulations! You passed this lesson and
        can take the next lesson!</div>)}
      </div>
    <div className="flex w-fit"><TestEvaluation data={usrTestAssesScore}/></div>
  </div></>)}
 


<div className="fixed bottom-0 w-full"><ProgressBar step={step}
 next={next} prev={prev} setStep={setStep}/></div>
  </>; 
}

export default LessonPage;

