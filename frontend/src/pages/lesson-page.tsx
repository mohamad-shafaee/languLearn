import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth"; 
import WordInfo from "../components/wordInfo";
import { Pencil, Edit, Save, ChevronRight } from "lucide-react";
import type { WordObj, Language, UsrDefDetectTest,
WdmTest, UsrTestWrite, TestTF, TestReply, UsrTestFill, TestAss, WordObjS } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ParseText from "../components/parse-text";
import InteractiveWordsBox from "../components/interactive-wb";
import WordCloud from "../components/word-cloud";
import MatchWordMean from "../components/match-word-mean";
import UsrDDTestComp from "../components/usr-dd-test";
import TestFill from "../components/user-test-fill";

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

 
const LessonPage: React.FC = () => {
  const { fieldId, lessonId } = useParams();
	const { user, token } = useAuth();
  const navigate = useNavigate();
   
  const [field, setField] = useState<Field>({id: fieldId, name: ""});
  
  const [lesson, setLesson] = useState<Lesson>({id: lessonId});
  const [step, setStep] = useState(1);
  //const [languages, setLanguages] = useState<Language[]>([]);
 
  const next = () => setStep((s) => Math.min(s + 1, 13));
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

  const [matchesOfDDTests, setMatchesOfDDTests] = useState<MatchesDDT[]>([]);
   
  const [usrTestFills, setUsrTestFills] = useState<UsrTestFill[]>([]); 

  const [testTFs, setTestTFs] = useState<TestTF[]>([]); 
  const [testReplies, setTestReplies] = useState<TestReply[]>([]); 
  const [testAsses, setTestAsses] = useState<TestAss[]>([]);

  //useEffect(()=>{console.log("words of this lesson: ", words);}, [words]);

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
    console.log("tech words: ", techWords);
  }, [techWords]);

  useEffect(()=>{
    console.log("Tests fills: ", usrTestFills);
  }, [usrTestFills]);

  
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
        //console.log("The words::: ", data.words);
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

  /*const getTestTFs = async ()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-test-TFs`, {
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
        setTestTFs(data.tests);
      } else {
        alert("Tests True/False of the lesson are not taken!"); 
      }
    } catch (err) {} finally{}
  };

   const getTestReplies = async ()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-test-replies`, {
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
        setTestReplies(data.tests);
      } else {
        alert("Tests Reply of the lesson are not taken!"); 
      }
    } catch (err) {} finally{}
  };

  const getTestAsses = async ()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-test-asses`, {
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
        setTestAsses(data.tests);
      } else {
        alert("Tests Assessment of the lesson are not taken!"); 
      }
    } catch (err) {} finally{}
  };

  const requestAndSetLessonId = async () => {
      try {
       //setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/take-lesson-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,})
      });
      if (!response.ok) { return; }
      const result = await response.json();
      if(result.success){
          //setLesson(prev => ({...(prev || {}), id: result.id, }));
          //return result.id;
          navigate(`/admin/lesson/${result.id}`, { replace: true });
      } 
    } catch {} finally {//setIsSubmitting(false);
    };
  };*/


  /*if(lessonId == 'create'){
    requestAndSetLessonId(); 
  }
    else if (Number.isInteger(Number(lessonId))){
        getLesson();
        getFields();
        getSelectedFields();
        getWords();
        getTestWrites();
        getTestFills();
        getTestTFs();
        getTestReplies();
        getTestAsses();
    }*/
  }, [lessonId]);

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
          console.log("interactive get words: ", data.words);
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
    //console.log("hhh words: ", usrStaredWords);
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
    setUsrTestFills(usrTestFills.map(te => te.id == test.id ? (num == 1 ? {...te, usr_answer1: val} :
     {...te, usr_answer2: val}) : te));
  };

  const submitTestFillsAnswer = async () => {

    const payload = {lessonId: lessonId, tests: usrTestFills}; 
    try {
      //setIsSubmitting(true); // problematic 
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
        alert("Test answer saved!");

      } else {
        alert("Test answer is not saved!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }

  };
 
	if (!user) {
    return <div>You do not have access to this page!</div>;
  }

   return <>{step == 1 && (<div className="flex items-center flex-col w-full"> 
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
      </div>
      {(interactiveWords.length > 0) && (<div className="flex flex-col p-2 mt-8 w-2/3 h-fit relative
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
    </div>)}
    { step == 2 && (<><div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-8 w-2/3">
        Please read the following text and do the next exercises.
      </div> 
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

       <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-8 w-2/3">
        Please read the following text and do the next exercises.
      </div><div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
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
        {tecWord.mean}</div></div>))}</div>)}</div></div>


       <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-8 w-2/3">
        Please read the following text and do the next exercises.
      </div><div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
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
        {tecWord.mean}</div></div>))}</div>)}</div></div>


      <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-8 w-2/3">
        Please read the following text and do the next exercises.
      </div><div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
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
        {tecWord.mean}</div></div>))}</div>)}</div></div>


     <div className="flex items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-8 w-2/3">
        Please read the following text and do the next exercises.
      </div><div className="flex flex-col p-2 mt-4 w-2/3 min-h-48 relative border-2 border-blue-300 rounded-md">
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
</div>
 {usrStaredWordsPage2.length > 0 &&(<div className="flex w-full justify-center items-center">
  <div className="flex w-2/3 items-center my-4 px-4 py-2
 border-1 border-blue-500 rounded-md">
          <MatchWordMean words={words} stared={usrStaredWordsPage2} />
        </div></div>)}</>)}

{ step == 3 && (<><div className="flex justify-center items-center flex-col w-full">
      <div className="flex flex-col p-2 mt-4 w-2/3">
        Please fill the blanks.
      </div>
      <div className="flex flex-col p-2 mt-2 w-2/3 border-2 border-blue-300 rounded-md">
      {usrTestFills.map((tf, ind)=>(<div key={tf.id} className="flex w-full">
        <div className="flex px-1 py-1 w-fit font-semibold text-blue-500 
        bg-blue-200 justify-center items-center mt-4">{ind+1}</div>
        <TestFill test={tf} 
           updateUsrAnswer={(num, te, val)=>updateUsrAnswerTestFill(num, te, val)} />

      </div>))}
      <div className="flex px-2 py-1 w-fit mt-4 border-1 border-gray-300 rounded-md hover:cursor-pointer
        hover:shadow-md"
                onClick={submitTestFillsAnswer}>Save</div>
      </div>





       </div></>)}







    <div className="flex w-full px-20 justify-center items-center py-4 bg-blue-200">
    { step >= 2 && <div onClick={prev} variant="outline"
     className="flex w-fit border-1 border-gray-300 rounded-md bg-gray-100
      hover:cursor-pointer hover:bg-gray-50 px-4 py-1">Previous</div>}
      {<div className="flex w-fit">{[1,2,3,4,5].map((stp, ind)=>(<div className="flex px-4 py-1 rounded-xl
        border-2 text-xl text-red-500 border-blue-300 ">
        {stp}
      </div>))}</div>}
    { step <= 4 && <div onClick={next}
     className="flex w-fit border-1 border-gray-300 rounded-md bg-gray-100
      hover:cursor-pointer hover:bg-gray-50 px-4 py-1">Next</div>} 
 
    </div>
    </>; 
}

export default LessonPage;

