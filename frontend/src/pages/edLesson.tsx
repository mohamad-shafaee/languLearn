import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import CustomObjSelect from "../components/customObjSelect";
import FieldSelector from "../components/fieldSelector";
import WordInfo from "../components/wordInfo";
import TechWordInfo from "../components/techwordInfo";
import { Pencil, Edit, Save } from "lucide-react";
import type { Language, TestWrite, TestTF, TestReply,
 TestFill, TestAss, DefDetectTest, WdmTest } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Field = {
  id: number;
  name: string;
};

type Lesson = {
  id: number | null;
  author_id: number | null;
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
 
 type WordObj = {
  id: string;
  word: string;
  phonetic: string | null;
  means: Mean[];
 }

 type TechWordObj = {
  id: string;
  part: number;
  word: string;
  phonetic: string | null;
  mean: string;
 }


const EdLesson: React.FC = () => {
  const { lessonId } = useParams();
	const { user, token } = useAuth();
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const fieldSelectorRef = useRef(null);
  const titleRef = useRef(null);
  const abstractRef = useRef(null);
  const video1Ref = useRef(null);
  const video1TextRef = useRef(null);
  const tTBRef = useRef(null);
  const tP21Ref = useRef(null);
  const tP22Ref = useRef(null);
  const tP23Ref = useRef(null);
  const tP24Ref = useRef(null);
  const tP25Ref = useRef(null);
  const testWriteRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); 
  const [isTakingTestId, setIsTakingTestId] = useState<boolean>(false);
    // first all fields are taken from backend
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [removedFields, setRemovedFields] = useState<Field[]>([]);
  const [lesson, setLesson] = useState<Lesson>({id: lessonId, author_id: user.id});
  const [step, setStep] = useState(1);
  const [languages, setLanguages] = useState<Language[]>([]);
 
  const next = () => setStep((s) => Math.min(s + 1, 11));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  //const [words, setWords] = useState<WordObj[]>([{ id: uuidv4(), word: "", phonetic: "", means: [] }]);
  const [words, setWords] = useState<WordObj[]>([]);
  const [removedWords, setRemovedWords] = useState<WordObj[]>([]);
  
  const [techWords, setTechWords] = useState<TechWordObj[]>([]);
  const [removedTechWords, setRemovedTechWords] = useState<TechWordObj[]>([]);

  const [testWrites, setTestWrites] = useState<TestWrite[]>([]);
  const [removedTestWrites, setRemovedTestWrites] = useState<TestWrite[]>([]);
  const [testFills, setTestFills] = useState<TestFill[]>([]);
  const [removedTestFills, setRemovedTestFills] = useState<TestFill[]>([]);
  const [testTFs, setTestTFs] = useState<TestTF[]>([]);
  const [removedTestTFs, setRemovedTestTFs] = useState<TestTF[]>([]);
  const [testReplies, setTestReplies] = useState<TestReply[]>([]);
  const [removedTestReplies, setRemovedTestReplies] = useState<TestReply[]>([]);

  const [defDetectTests, setDefDetectTests] = useState<DefDetectTest[]>([]);
  const [removedDefDetectTests, setRemovedDefDetectTests] = useState<DefDetectTest[]>([]);

  const [wdmTests, setWdmTests] = useState<WdmTest[]>([]);
  const [removedWdmTests, setRemovedWdmTests] = useState<WdmTest[]>([]);
  
  const [testAsses, setTestAsses] = useState<TestAss[]>([]);
  const [removedTestAsses, setRemovedTestAsses] = useState<TestAss[]>([]);

  const [testWritesStatus, setTestWritesStatus] = useState<boolean>(false);
  const [testFillsStatus, setTestFillsStatus] = useState<boolean>(false);
  const [testTFsStatus, setTestTFsStatus] = useState<boolean>(false);
  const [testRepliesStatus, setTestRepliesStatus] = useState<boolean>(false);
  const [testAssesStatus, setTestAssesStatus] = useState<boolean>(false);
  const [saveWordsStatus, setSaveWordsStatus] = useState<boolean>(false);
  const [saveTechWordsStatus, setSaveTechWordsStatus] = useState<boolean>(false);
  const [saveLessonStatus, setSaveLessonStatus] = useState<boolean>(false);
  const [dDTestStatus, setDDTestStatus] = useState<boolean>(false);
  const [wdmTestStatus, setWdmTestStatus] = useState<boolean>(false);

  useEffect(() => {

        const getFields = async ()=>{
            try{
             const response_fields = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/fields`, {
             method: "GET",
             //credentials: "include",
             headers: { 
                      "Authorization": `Bearer ${token}`, //send token here
                      Accept: "application/json" 
                    },
            });

             if (!response_fields.ok)  return;

           const fieldsData = await response_fields.json();
           setFields(fieldsData.fields);

        } catch {} finally {}
        };

    const getSelectedFields = async ()=>{
    try {
      //setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/selected-fields`, {
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
        setSelectedFields(data.fields);
        
      } else {
        //alert("The lesson is not set to any fields yet!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };
   
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
      
    } finally{//setIsSubmitting(false);
    }
  };

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
      
    } finally{//setIsSubmitting(false);
    }
  };

  const getTestWrites = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-test-writes`, {
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
        setTestWrites(data.tests);
        
      } else {
        alert("Tests writes of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  const getTestFills = async ()=>{
    try {
      //setIsSubmitting(true); // problematic 
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-test-fills`, {
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
        setTestFills(data.tests);
        
      } else {
        alert("Tests fills of the lesson are not taken!");
        
      }
    } catch (err) {
      
    } finally{//setIsSubmitting(false);
    }
  };

  const getTestTFs = async ()=>{
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
  };

  const getDefDetectTests = async ()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-defdetect-tests`, {
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
        setDefDetectTests(data.tests);
      } else {
        alert("Definition defective tests of the lesson are not taken!"); 
      }
    } catch (err) {} finally{}
  };

    const getWdmTests = async ()=>{
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lesson-wdm-tests`, {
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
        setWdmTests(data.tests);
      } else {
        alert("Why does it matters tests of the lesson are not taken!"); 
      }
    } catch (err) {} finally{}
  };


  if(lessonId == 'create'){
    requestAndSetLessonId(); 
  }
    else if (Number.isInteger(Number(lessonId))){
        getLesson();
        getFields();
        getSelectedFields();
        getWords();
        getTechWords();
        getTestWrites();
        getTestFills();
        getTestTFs();
        getTestReplies();
        getTestAsses();
        getDefDetectTests();
        getWdmTests();

    }

        

  }, [lessonId]);

  useEffect(() => {

        const getLanguages = async ()=>{
            try{
             const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/languages`, {
             method: "GET",
             //credentials: "include",
             headers: { 
                      "Authorization": `Bearer ${token}`, //send token here
                      Accept: "application/json" 
                    },
            });
             if (!response.ok)  return;
           const data = await response.json();
           setLanguages(data.languages);

        } catch {} finally {}
        }
        getLanguages();

  }, []);
  
  // Update a single word by id
  function updateWord(id: number, updatedWord: WordObj) {
    setWords(prev =>
      prev.map(word => (word.id == id ? updatedWord : word))
    );
    setSaveWordsStatus(true);
  }

  function updateTechWord(id: number, updatedWord: WordObj) {
    setTechWords(prev =>
      prev.map(word => (word.id == id ? updatedWord : word))
    );
    setSaveTechWordsStatus(true);
  }

function removeWord(id: number) {
  const confirmed = window.confirm("Are you sure to remove the word?");
  if (confirmed) {
     setRemovedWords(prev => prev.some(wo => wo.id == id) ? prev : 
      [...prev, words.find(w => w.id == id)]);
     setWords(words.filter(wo => wo.id == id));
     setSaveWordsStatus(true);
  } 
}

function removeTechWord(id: number) {
  const confirmed = window.confirm("Are you sure to remove the technical word?");
  if (confirmed) {
     setRemovedTechWords(prev => prev.some(wo => wo.id == id) ? prev : 
      [...prev, words.find(w => w.id == id)]);
     setTechWords(words.filter(wo => wo.id == id));
     setSaveTechWordsStatus(true);
  } 
} 

const submitWords = async () => {

  if(lesson.id == null || lesson.id == undefined){
  alert("Please save the lesson first. You should enter atleast lesson title");
  return;
 }

 /*if(words.filter(w => (w.word !== "" && w.means.length >= 1)).length == 0){
  alert("Please complete words list.");
  return;
 }*/

 const words_1 = words.filter(w => (w.word != "" && w.means.length > 0));
 const words_2 = words_1.map(w => {
  const means_new = w.means.filter(m => (m.mean != ""));
  return {id: w.id, word: w.word, phonetic: w.phonetic, means: means_new};
 });
 const words_3 = words_2.filter(w => (w.means.length > 0));
 
  const payload = {
     lessonId: lesson.id,
     words: words_2,
     removed: removedWords,
  };

  //console.log(JSON.stringify(payload));
  try {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-lesson-words`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRemovedWords([]);
        alert("Words saved successfully.");
        
      } else {
        alert("Failed to upload words.");
      }
    } catch (err) {
      alert("Failed to upload words.");
    } finally{setIsSubmitting(false); setSaveWordsStatus(false);}

};


const submitTechWords = async () => {

  if(lesson.id == null || lesson.id == undefined){
  alert("Please save the lesson first. You should enter atleast lesson title");
  return;
 }

 const words_1 = techWords.filter(w => (w.word != "" || w.mean != ""));
 
  const payload = {
     lessonId: lesson.id,
     words: words_1,
     removed: removedTechWords,
  };

  //console.log(JSON.stringify(payload));
  try {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-lesson-tech-words`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRemovedTechWords([]);
        alert("Technical words saved successfully.");
        
      } else {
        alert("Failed to upload technical words.");
      }
    } catch (err) {
      alert("Failed to upload technical words.");
    } finally{setIsSubmitting(false); setSaveTechWordsStatus(false);}

};
 
  const selectLessonImage = () => {
    imgRef.current.click(); // Open file picker
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate file type / size
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        alert("File size must be less than 3 MB.");
         return;
      }
    // Upload to server
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id);
    formData.append("lessonId", lesson?.id ?? "");

    try {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-lesson-image`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   // Do NOT set 'Content-Type' manually when sending FormData
        },
        body: formData,
      });
      const data = await res.json();

    if (res.ok && data.success) {
        // Update the img src to the new image URL

            setLesson(prev => ({
          ...(prev || {}), img_path: `${data.imageUrl}?t=${Date.now()}`,}));

      } else {
        alert("Failed to upload image.");
      }
    } catch (err) {
      alert("Failed to upload image.");
    } finally{setIsSubmitting(false);}
  }; 

  const submitLesson = async () => {
    if(selectedFields.length == 0){
      alert("Please select at least one field.");
      return;
    }

    if(!lesson.title){
      alert("Please write a title.");
      return;
    }
    try {

      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-lesson`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson?.id ?? "", 
                              title: lesson?.title,
                              abstract: lesson.abstract ?? "",
                              video1: lesson.video1 ?? "",
                              video1_text: lesson.video1_text ?? "",
                              tech_term_body: lesson.tech_term_body ?? "",
                              text_p21: lesson.text_p21 ?? "",
                              text_p22: lesson.text_p22 ?? "",
                              text_p23: lesson.text_p23 ?? "",
                              text_p24: lesson.text_p24 ?? "",
                              text_p25: lesson.text_p25 ?? "",
                              fields: selectedFields,
                              removed_fields: removedFields,
                              })
      });
      if (!response.ok) {
        return;
            //return { success: false, errors: ["Something went wrong!"]};
          }
      const result = await response.json();
      if(result.success){
        setRemovedFields([]);
        alert("Lesson saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setSaveLessonStatus(false);};
  }; 

  const addToSelectedField = (field) => {
    const exists = selectedFields.some((f) => f.id === field.id);
    if (!exists) {
    setSelectedFields([...selectedFields, field]);
  }
  const exists_in_rm = removedFields.some((f) => f.id === field.id);
  if(exists_in_rm){
    setRemovedFields(removedFields.filter((f) => f.id !== field.id));
  }

  setSaveLessonStatus(true);
  };

  const removeFromSelectedField = (field) => {
    const confirmed = window.confirm("Are you sure to remove the field?");
  if (confirmed) {
        const new_fs = selectedFields.filter((f) => f.id !== field.id );
        setSelectedFields(new_fs);
        setRemovedFields([...removedFields, field]);
  }
   setSaveLessonStatus(true);
  };

  ///////////////////

  const newRawWord = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }
    try {
      //setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-word-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id, 
                              })
      });
      if (!response.ok) {
        return; 
          }
      const result = await response.json();
      if(result.success && result.id){        
          setWords(prev =>
          prev.some(w => w.id == result.id) ? prev 
          : [...prev, { id: result.id,  word: "", phonetic: "", means: []}]
         );
        
      } 
    } catch {} finally {
      //setIsTakingTestId(false);
        setSaveWordsStatus(true);
    };
  };

  ////////////////////


  const newRawTechWord = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }
    try {
      //setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-tech-word-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id, 
                              })
      });
      if (!response.ok) {
        return; 
          }
      const result = await response.json();
      if(result.success && result.id){
          setTechWords(prev =>
          prev.some(w => w.id == result.id) ? prev 
          : [...prev, { id: result.id, part: 0,  word: "", phonetic: "", mean: "" }]
         );
      } 
    } catch {} finally {
      //setIsTakingTestId(false);
       setSaveTechWordsStatus(true); 
      
    };
  };

    ///////////////////////////

  const submitTestWrites = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((testWrites.length + removedTestWrites.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const testWrites_c = testWrites.filter(tw => (tw.body != ""));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: testWrites_c,
     removed: removedTestWrites,
  };

       try {

      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-test-writes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedTestWrites([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setTestWritesStatus(false);};
  };

  const updateTestWrite = (testObj, value) => {
       setTestWrites(prev => prev.map(tw => tw.id == testObj.id ? {...tw, body: value} : tw));
       setTestWritesStatus(true);
  };

  const newTestWrite = async () => {
    //first fetch to take the id of a raw created testwrite in database.
    // Then add a new TestWrite by this id.

    try {

      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-testwrite-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setTestWrites(prev =>
          prev.some(tw => tw.id == result.id) ? prev 
          : [...prev, { id: result.id, body: "" }]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setTestWritesStatus(true);}; 
  };

  const removeTestWrite = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
  if (confirmed) {
    setRemovedTestWrites(prev =>
          prev.some(tw => tw.id == testObj.id) ? prev 
          : [...prev, { id: testObj.id, body: testObj.body }]
         );

    const newTests = testWrites.filter(tw => tw.id != testObj.id);
    setTestWrites(newTests);
    setTestWritesStatus(true);
  }
  };

  ////////////////////////////

  const updateTestFillBody = (testObj, value) => {
    setTestFills(prev => prev.map(tf => tf.id == testObj.id ? {...tf, body: value} : tf));
    setTestFillsStatus(true);
  };

  const updateTestFill1 = (testObj, value) => {
    setTestFills(prev => prev.map(tf => tf.id == testObj.id ? {...tf, fill1: value} : tf));
    setTestFillsStatus(true);
  };

  const updateTestFill2 = (testObj, value) => {
    setTestFills(prev => prev.map(tf => tf.id == testObj.id ? {...tf, fill2: value} : tf));
    setTestFillsStatus(true);
  };

  const removeTestFill = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
  if (confirmed) {
    setRemovedTestFills(prev =>
          prev.some(tf => tf.id == testObj.id) ? prev : [...prev, testObj]);

    const newTests = testFills.filter(tf => tf.id != testObj.id);
    setTestFills(newTests);
    setTestFillsStatus(true);
   } 
  };

    const newTestFill = async () => {

      try {
      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-testfill-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setTestFills(prev =>
          prev.some(tf => tf.id == result.id) ? prev 
          : [...prev, { id: result.id, body: "", fill1: "", fill2: "" }]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setTestFillsStatus(true);}; 
  };

  const submitTestFills = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((testFills.length + removedTestFills.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const testFills_c = testFills.filter(tf => (tf.body != ""));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: testFills_c,
     removed: removedTestFills,
  };
       try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-test-fills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedTestFills([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setTestFillsStatus(false);};
  };
 
  ////////////////////////
    ////////////////////////////

  const updateTestTFBody = (testObj, value) => {
    setTestTFs(prev => prev.map(ttf => ttf.id == testObj.id ? {...ttf, body: value} : ttf));
    setTestTFsStatus(true);
  };

  const setTestTFAnswer = (testObj, value) => {
    setTestTFs(prev => prev.map(ttf => ttf.id == testObj.id ? {...ttf, 
      answer: value} : ttf));
    setTestTFsStatus(true);
  };

    const removeTestTF = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
     if (confirmed) {
        setRemovedTestTFs(prev =>
          prev.some(ttf => ttf.id == testObj.id) ? prev : [...prev, testObj]);

    const newTests = testTFs.filter(ttf => ttf.id != testObj.id);
    setTestTFs(newTests);
    setTestTFsStatus(true);
   }
  };

    const newTestTF = async () => {

      try {
      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-testTF-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setTestTFs(prev =>
          //prev.some(ttf => ttf.id == result.id) ? prev :
           [...prev, { id: result.id, body: "", answer: true}]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setTestTFsStatus(true);};
  };

  const submitTestTFs = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((testTFs.length + removedTestTFs.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const testTFs_c = testTFs.filter(ttf => (ttf.body != ""));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: testTFs_c,
     removed: removedTestTFs,
  };
       try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-test-TFs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedTestTFs([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setTestTFsStatus(false);};
  };
  /////////////////
    ////////////////////////////

  const updateTestReplyBody = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, body: value} : tre));
    setTestRepliesStatus(true);
  };

  const updateTestReplyRe1 = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, reply1: value} : tre));
    setTestRepliesStatus(true);
  };
  const updateTestReplyRe2 = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, reply2: value} : tre));
    setTestRepliesStatus(true);
  };
  const updateTestReplyRe3 = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, reply3: value} : tre));
    setTestRepliesStatus(true);
  };

  const updateTestReplyDesc1 = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, desc1: value} : tre));
    setTestRepliesStatus(true);
  };

  const updateTestReplyDesc2 = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, desc2: value} : tre));
    setTestRepliesStatus(true);
  };

  const updateTestReplyDesc3 = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, desc3: value} : tre));
    setTestRepliesStatus(true);
  };

  const setTestReplyAnswer = (testObj, value) => {
    setTestReplies(prev => prev.map(tre => tre.id == testObj.id ? {...tre, 
      answer: value} : tre));
    setTestRepliesStatus(true);
  };

    const removeTestReply = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
  if (confirmed) {
    setRemovedTestReplies(prev =>
          prev.some(tre => tre.id == testObj.id) ? prev : [...prev, testObj]);

    const newTests = testReplies.filter(tre => tre.id != testObj.id);
    setTestReplies(newTests);
    setTestRepliesStatus(true);
    }
  };

    const newTestReply = async () => {

      try {
      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-testreply-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setTestReplies(prev =>
           [...prev, { id: result.id, body: "",
            answer: 1, reply1: "", reply2: "", reply3: "", desc1: "", desc2: "", desc3: ""}]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setTestRepliesStatus(true);};
  };

  const submitTestReplies = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((testReplies.length + removedTestReplies.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const testReplies_c = testReplies.filter(tre => (tre.body != ""));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: testReplies_c,
     removed: removedTestReplies,
  };
       try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-test-replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedTestReplies([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setTestRepliesStatus(false);};
  };
  /////////////////

      ////////////////////////////

  const updateTestAssBody = (testObj, value) => {
    setTestAsses(prev => prev.map(tas => tas.id == testObj.id ? {...tas, body: value} : tas));
    setTestAssesStatus(true);
  };

  const updateTestAssOpt1 = (testObj, value) => {
    setTestAsses(prev => prev.map(tas => tas.id == testObj.id ? {...tas, opt1: value} : tas));
    setTestAssesStatus(true);
  };
  const updateTestAssOpt2 = (testObj, value) => {
    setTestAsses(prev => prev.map(tas => tas.id == testObj.id ? {...tas, opt2: value} : tas));
    setTestAssesStatus(true);
  };
  const updateTestAssOpt3 = (testObj, value) => {
    setTestAsses(prev => prev.map(tas => tas.id == testObj.id ? {...tas, opt3: value} : tas));
    setTestAssesStatus(true);
  };
  const updateTestAssOpt4 = (testObj, value) => {
    setTestAsses(prev => prev.map(tas => tas.id == testObj.id ? {...tas, opt4: value} : tas));
    setTestAssesStatus(true);
  };

  const setTestAssAnswer = (testObj, value) => {
    setTestAsses(prev => prev.map(tas => tas.id == testObj.id ? {...tas, 
      answer: value} : tas));
    setTestAssesStatus(true);
  };

  const removeTestAss = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
  if (confirmed) {
       setRemovedTestAsses(prev =>
          prev.some(tas => tas.id == testObj.id) ? prev : [...prev, testObj]);

    const newTests = testAsses.filter(tas => tas.id != testObj.id);
    setTestAsses(newTests);
    setTestAssesStatus(true);
   } 
  };

    const newTestAss = async () => {

      try {
      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-testass-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setTestAsses(prev =>
           [...prev, { id: result.id, body: "",
            opt1: "", opt2: "", opt3: "", opt4: "", answer: 0}]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setTestAssesStatus(true);};
  };

  const submitTestAsses = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((testAsses.length + removedTestAsses.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const testAsses_c = testAsses.filter(tas => (tas.body != ""));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: testAsses_c,
     removed: removedTestAsses,
  };
       try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-test-asses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedTestAsses([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setTestAssesStatus(false);};
  };
  /////////////////

  const updateDDTestWord = (testObj, value) => {
    setDefDetectTests(prev => prev.map(ddt => ddt.id == testObj.id ? {...ddt, word: value} : ddt));
    setDDTestStatus(true);
  };

  const updateDDTestPart = (testObj, value) => {
    setDefDetectTests(prev => prev.map(ddt => ddt.id == testObj.id ? {...ddt, part: value} : ddt));
    setDDTestStatus(true);
  };

  const updateDDTestText1 = (testObj, value) => {
    setDefDetectTests(prev => prev.map(ddt => ddt.id == testObj.id ? {...ddt, text1: value} : ddt));
    setDDTestStatus(true);
  };

  const updateDDTestText2 = (testObj, value) => {
    setDefDetectTests(prev => prev.map(ddt => ddt.id == testObj.id ? {...ddt, text2: value} : ddt));
    setDDTestStatus(true);
  };

  const updateDDTestText3 = (testObj, value) => {
    setDefDetectTests(prev => prev.map(ddt => ddt.id == testObj.id ? {...ddt, text3: value} : ddt));
    setDDTestStatus(true);
  };

  const setDDTestAnswer = (testObj, value) => {
    setDefDetectTests(prev => prev.map(ddt => ddt.id == testObj.id ? {...ddt, 
      answer: value} : ddt));
    setDDTestStatus(true);
  };

    const removeDDTest = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
  if (confirmed) {
    setRemovedDefDetectTests(prev =>
          prev.some(ddt => ddt.id == testObj.id) ? prev : [...prev, testObj]);

    const newTests = defDetectTests.filter(ddt => ddt.id != testObj.id);
    setDefDetectTests(newTests);
    setDDTestStatus(true);
    }
  };

      const newDDTest = async () => {

      try {
      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-dd-test-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setDefDetectTests(prev =>
           [...prev, { id: result.id, word: "", part: 0,
            text1: "", text2: "", text3: "", answer: 0}]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setDDTestStatus(true);};
  };

    const submitDDTest = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((defDetectTests.length + removedDefDetectTests.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const ddTests_c = defDetectTests.filter(ddt => ((ddt.text1 != "")
   || (ddt.text2 != "") || (ddt.text3 != "")));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: ddTests_c,
     removed: removedDefDetectTests,
  };
       try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-dd-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedDefDetectTests([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setDDTestStatus(false);};
  };

  ////////////////////////
  const updateWdmTestBody = (testObj, value) => {
    setWdmTests(prev => prev.map(wdmt => wdmt.id == testObj.id ? {...wdmt, body: value} : wdmt));
    setWdmTestStatus(true);
  };

  const updateWdmTestPart = (testObj, value) => {
    setWdmTests(prev => prev.map(wdmt => wdmt.id == testObj.id ? {...wdmt, part: value} : wdmt));
    setWdmTestStatus(true);
  };

  const updateWdmTestAnswer = (testObj, value) => {
    setWdmTests(prev => prev.map(wdmt => wdmt.id == testObj.id ? {...wdmt, answer: value} : wdmt));
    setWdmTestStatus(true);
  };

  const removeWdmTest = (testObj) => {
    const confirmed = window.confirm("Are you sure to remove the test?");
  if (confirmed) {
    setRemovedWdmTests(prev =>
          prev.some(wdmt => wdmt.id == testObj.id) ? prev : [...prev, testObj]);

    const newTests = wdmTests.filter(wdmt => wdmt.id != testObj.id);
    setWdmTests(newTests);
    setWdmTestStatus(true);
    }
  };

      const newWdmTest = async () => {

      try {
      setIsTakingTestId(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-raw-wdm-test-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({authorId: user.id,
                              lessonId: lesson.id ?? "", 
                              })
      });
      if (!response.ok) {
        return;
            
          }
      const result = await response.json();
      if(result.success && result.id){
        setWdmTests(prev =>
           [...prev, { id: result.id, part: 0, body: "", answer: ""}]
         );
       
      } 
    } catch {} finally {setIsTakingTestId(false); setWdmTestStatus(true);};
  };

    const submitWdmTest = async () => {
    if(lesson.id == null || lesson.id == undefined){
      alert("Please save the lesson first. You should enter atleast lesson title");
      return;
    }

    if((wdmTests.length + removedWdmTests.length) == 0){
      alert("Please complete test list.");
      return;
 }

  const wdmTests_c = wdmTests.filter(wdmt => (wdmt.body != "" || wdmt.answer != ""));
  const payload = {
     authorId: user.id,
     lessonId: lesson.id,
     tests: wdmTests_c,
     removed: removedWdmTests,
  };
       try {
      setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-wdm-tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        return;
          }
      const result = await response.json();
      if(result.success){
        setRemovedWdmTests([]);
        alert("Tests saved successfully.");
      } 
    } catch {} finally {setIsSubmitting(false); setWdmTestStatus(false);};
  };

  ////////////////////////////////

	if (!user || user.type !== "admin") {
    return <div>You do not have access to this page!</div>;
  }

   return <>{step == 1 && (<div className="flex items-center flex-col w-full"> 
    <div className="flex w-fit mt-4 px-4 py-1 ">Create or Edit Lesson</div>
    <div className="flex p-2 mt-8 w-36 h-36 relative border-2 border-blue-300 rounded-md">
        <img src={lesson?.img_path || null} alt="Lesson Image"
          className="w-fit h-fit rounded-md mr-2"/>
          <div className={`absolute bottom-1 right-1 ${
    isSubmitting ? "pointer-events-none opacity-50" : "hover:cursor-pointer"
  }`} onClick={!isSubmitting ? selectLessonImage : undefined}>
            <Edit className="hover:shadow hover:cursor-pointer" size={24} /></div>
            <input type="file" ref={imgRef} className="hidden" 
              accept="image/*" onChange={handleImageSelect}/>
      </div>
    <div className="flex flex-col w-1/3 mt-4 py-1 ">
    <FieldSelector className="flex bg-[#fff] mt-4 px-2 py-1 w-full" 
        ref={fieldSelectorRef}
        selectedFields={selectedFields} fields={fields} 
        onRemoveField={(f) => {removeFromSelectedField(f)}} 
        onAddField={(f) => {addToSelectedField(f)}}/>
    <div className="flex w-full mt-2 px-4 py-1 ">
      You can set this lesson to other fields too after saving, in another page.</div>
    </div> 
    <input type="text" ref={titleRef} value={lesson?.title ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-1/3 border-2 border-gray-300 rounded-md mt-4"
      placeholder="Enter A Title" onChange={(e) =>
       {setLesson({...lesson, title: e.target.value}); setSaveLessonStatus(true);}}/>
    <textarea ref={abstractRef} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.abstract ?? ""}
                onChange={(e) => {setLesson({...lesson, abstract: e.target.value}); setSaveLessonStatus(true);}}
                placeholder="Abstract" rows="6" cols="50"  disabled={isSubmitting}></textarea>
    <input type="text" ref={video1Ref} value={lesson?.video1 ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-1/3 border-2 border-gray-300 rounded-md mt-4"
      placeholder="Video Script" onChange={(e) => 
      {setLesson({...lesson, video1: e.target.value}); setSaveLessonStatus(true);}}/>
    <textarea ref={video1TextRef} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.video1_text ?? ""}
                onChange={(e) => {setLesson({...lesson, video1_text: e.target.value}); 
                setSaveLessonStatus(true);}}
                placeholder="Video Text" rows="6" cols="50"  disabled={isSubmitting}></textarea>
    <div className="flex items-center flex-col w-full">
      <div className="flex w-fit mt-4 px-4 py-1 ">Technical Trem</div>
    <textarea ref={tTBRef} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.tech_term_body ?? ""}
                onChange={(e) => {setLesson({...lesson, tech_term_body: e.target.value}); 
                setSaveLessonStatus(true); }}
                placeholder="Technical Trem" rows="10" cols="50"  disabled={isSubmitting}> 
    </textarea>
    </div>
    </div>)} 
    {step == 2 && (<div className="flex items-center flex-col w-full">
      <div className="flex items-center flex-col w-full">
      <div className="flex w-fit mt-4 px-4 py-1 ">Text 1, Page 2</div>
    <textarea ref={tP21Ref} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.text_p21 ?? ""}
                onChange={(e) => {setLesson({...lesson, text_p21: e.target.value}); 
                setSaveLessonStatus(true); }}
                placeholder="Text 1, Page 2" rows="10" cols="50"  disabled={isSubmitting}>
    </textarea>
    </div>
    <div className="flex items-center flex-col w-full">
      <div className="flex w-fit mt-4 px-4 py-1 ">Text 2, Page 2</div>
    <textarea ref={tP22Ref} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.text_p22 ?? ""}
                onChange={(e) => {setLesson({...lesson, text_p22: e.target.value}); 
                setSaveLessonStatus(true); }}
                placeholder="Text 2, Page 2" rows="10" cols="50"  disabled={isSubmitting}>
    </textarea>
    </div>
    <div className="flex items-center flex-col w-full">
      <div className="flex w-fit mt-4 px-4 py-1 ">Text 3, Page 2</div>
    <textarea ref={tP23Ref} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.text_p23 ?? ""}
                onChange={(e) => {setLesson({...lesson, text_p23: e.target.value}); 
                setSaveLessonStatus(true); }}
                placeholder="Text 3, Page 2" rows="10" cols="50"  disabled={isSubmitting}>
    </textarea>
    </div>
    <div className="flex items-center flex-col w-full">
      <div className="flex w-fit mt-4 px-4 py-1 ">Text 4, Page 2</div>
    <textarea ref={tP24Ref} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.text_p24 ?? ""}
                onChange={(e) => {setLesson({...lesson, text_p24: e.target.value}); 
                setSaveLessonStatus(true); }}
                placeholder="Text 4, Page 2" rows="10" cols="50"  disabled={isSubmitting}></textarea>
    </div>
    <div className="flex items-center flex-col w-full">
      <div className="flex w-fit mt-4 px-4 py-1 ">Text 5, Page 2</div>
    <textarea ref={tP25Ref} className="flex bg-[#fff] mt-4 px-2 py-1 w-1/3 border-2 border-gray-300"
               value={lesson?.text_p25 ?? ""}
                onChange={(e) => {setLesson({...lesson, text_p25: e.target.value}); 
                setSaveLessonStatus(true); }}
                placeholder="Text 5, Page 2" rows="10" cols="50"  disabled={isSubmitting}></textarea>  
    </div>


  </div>
    )}
    {step == 3 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit mt-4 px-4 py-1 ">Words Of The Lesson</div>
    {words.length>0 && words.map((wordObj, index)=>{return(
      <div key={wordObj.id} className="flex flex-col my-2 w-full">
        <div className="text-2xl text-blue-500">{index + 1}</div><WordInfo 
     className="flex flex-col w-full" value={wordObj}
      languages={languages} onAddWord={(u_word) => {
      updateWord(wordObj.id, u_word)
    }}  onRemoveWord={() => {
      removeWord(wordObj.id)
    }}/></div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={()=>{newRawWord();}}
          disabled={isSubmitting}>New Word</button>
    </div>)}
    {step == 4 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit mt-4 px-4 py-1 ">Technical Terms (Words)</div>
    {techWords.length>0 && techWords.map((wordObj, index)=>{return(
      <div key={wordObj.id} className="flex flex-col my-2 w-full">
        <div className="text-2xl text-blue-500">{index + 1}</div>
        <TechWordInfo 
           value={wordObj}
           onAddWord={(u_word) => {updateTechWord(wordObj.id, u_word)}}
           onRemoveWord={() => {removeTechWord(wordObj.id)}}/>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={()=>{newRawTechWord();}}
          disabled={isSubmitting}>New Word</button>
    </div>)}
           {step == 5 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Test Write</div>
    {testWrites.length>0 && testWrites.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <textarea ref={testWriteRef} className="flex bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
        value={testObj.body}
                onChange={(e) => updateTestWrite(testObj, e.target.value)}
                placeholder="Test Write Body" rows="5" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 flex bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeTestWrite(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newTestWrite}
          disabled={isTakingTestId}>New Test</button>
    </div>)}
    {step == 6 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Definition Detective Tests</div>
    {defDetectTests.length>0 && defDetectTests.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <div className="flex flex-col px-2 w-full">
          <input type="text" value={testObj.part ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-1/3 border-2 border-gray-300 rounded-md mt-4"
      placeholder="Part" onChange={(e) => updateDDTestPart(testObj, e.target.value)}
    disabled={isSubmitting}/>
          <input type="text" value={testObj.word ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-1/3 border-2 border-gray-300 rounded-md mt-4"
      placeholder="Word" onChange={(e) => updateDDTestWord(testObj, e.target.value)}
    disabled={isSubmitting}/></div>
   <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 
          border-gray-300 rounded-md"
        value={testObj.text1 ?? ""} onChange={(e) => updateDDTestText1(testObj, e.target.value)}
                placeholder="Text 1" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`ddtest-${testObj.id}`} checked={testObj.answer == 1}
               onChange={() => setDDTestAnswer(testObj, 1)}/></div></div>

        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 
          border-2 border-gray-300 rounded-md"
        value={testObj.text2 ?? ""} onChange={(e) => updateDDTestText2(testObj, e.target.value)}
                placeholder="Text 2" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`ddtest-${testObj.id}`} checked={testObj.answer == 2}
               onChange={() => setDDTestAnswer(testObj, 2)}/></div></div>

      <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 
          border-2 border-gray-300 rounded-md"
        value={testObj.text3 ?? ""} onChange={(e) => updateDDTestText3(testObj, e.target.value)}
                placeholder="Text 2" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`ddtest-${testObj.id}`} checked={testObj.answer == 3}
               onChange={() => setDDTestAnswer(testObj, 3)}/></div></div>
               <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 flex bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeDDTest(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newDDTest} disabled={isTakingTestId}>New Test</button>
    </div>)}

    {step == 7 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Why Does It Matters Tests</div>
    {wdmTests.length>0 && wdmTests.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <div className="flex flex-col px-2 w-full">
          <input type="text" value={testObj.part ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-1/3 border-2 border-gray-300 rounded-md mt-4"
      placeholder="Part" onChange={(e) => updateWdmTestPart(testObj, e.target.value)}
    disabled={isSubmitting}/>
          <textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 
          border-gray-300 rounded-md"
        value={testObj.body ?? ""} onChange={(e) => updateWdmTestBody(testObj, e.target.value)}
                placeholder="Body" rows="4" cols="50"  disabled={isSubmitting}></textarea>
          <textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 
          border-gray-300 rounded-md"
        value={testObj.answer ?? ""} onChange={(e) => updateWdmTestAnswer(testObj, e.target.value)}
                placeholder="Answer" rows="4" cols="50"  disabled={isSubmitting}></textarea>
          </div>
               <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 flex bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeWdmTest(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newWdmTest} disabled={isTakingTestId}>New Test</button>
    </div>)}
            
  {step == 8 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Test Fill</div>
    {testFills.length>0 && testFills.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <textarea className="flex bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
        value={testObj.body} onChange={(e) => updateTestFillBody(testObj, e.target.value)}
                placeholder="Test Fill Body" rows="5" cols="50"  disabled={isSubmitting}></textarea>
              <div className="flex flex-col bg-gray-50 px-4 py-2 w-full">
                <input type="text" value={testObj.fill1 ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-[80] border-2 border-gray-300 rounded-md mt-2"
      placeholder="fill 1" onChange={(e) => updateTestFill1(testObj, e.target.value)}/>
      <input type="text" value={testObj.fill2 ?? ""}
      className="flex bg-[#fff] px-2 py-1 w-[80] border-2 border-gray-300 rounded-md mt-2"
      placeholder="fill 2" onChange={(e) => updateTestFill2(testObj, e.target.value)}/>
                </div>  
                <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 flex bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeTestFill(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newTestFill}
          disabled={isTakingTestId}>New Test</button>
    </div>)}
   {step == 9 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Test True/False</div>
    {testTFs.length>0 && testTFs.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <textarea className="flex bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300"
        value={testObj.body} onChange={(e) => updateTestTFBody(testObj, e.target.value)}
                placeholder="Test True/False Body" rows="3" cols="50"  disabled={isSubmitting}></textarea>
          <div className="flex flex-col bg-gray-50 px-4 py-2 w-full">
            <label className="flex mr-2">
              <input className="flex mr-2" type="radio" name={`testTF-${testObj.id}`}
               checked={testObj.answer == true}
               onChange={() => setTestTFAnswer(testObj, true)}/>
                True
            </label>
            <label className="flex mr-2">
              <input className="flex mr-2" type="radio" name={`testTF-${testObj.id}`} 
                checked={testObj.answer == false}
               onChange={() => setTestTFAnswer(testObj, false)}/>
                False
            </label>
                </div>  
                <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 flex bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeTestTF(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newTestTF}
          disabled={isTakingTestId}>New Test</button>
    </div>)}
    {step == 10 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Test Reply</div>
    {testReplies.length>0 && testReplies.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-full bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.body} onChange={(e) => updateTestReplyBody(testObj, e.target.value)}
                placeholder="Test Reply Body" rows="4" cols="50"  disabled={isSubmitting}></textarea>
        </div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.reply1} onChange={(e) => updateTestReplyRe1(testObj, e.target.value)}
                placeholder="Reply 1" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testReply-${testObj.id}`} checked={testObj.answer == 1}
               onChange={() => setTestReplyAnswer(testObj, 1)}/></div></div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.reply2} onChange={(e) => updateTestReplyRe2(testObj, e.target.value)}
                placeholder="Reply 2" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testReply-${testObj.id}`} checked={testObj.answer == 2}
               onChange={() => setTestReplyAnswer(testObj, 2)}/></div></div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.reply3} onChange={(e) => updateTestReplyRe3(testObj, e.target.value)}
                placeholder="Reply 3" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testReply-${testObj.id}`} checked={testObj.answer == 3}
               onChange={() => setTestReplyAnswer(testObj, 3)}/></div></div>
        <div className="flex px-2 flex-col w-full">
        <textarea className="flex w-full bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.desc1} onChange={(e) => updateTestReplyDesc1(testObj, e.target.value)}
                placeholder="Description 1" rows="4" cols="50"  disabled={isSubmitting}></textarea>
        <textarea className="flex w-full bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.desc2} onChange={(e) => updateTestReplyDesc2(testObj, e.target.value)}
                placeholder="Description 2" rows="4" cols="50"  disabled={isSubmitting}></textarea>
        <textarea className="flex w-full bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.desc3} onChange={(e) => updateTestReplyDesc3(testObj, e.target.value)}
                placeholder="Description 3" rows="4" cols="50"  disabled={isSubmitting}></textarea>
                </div>
                <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 flex bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeTestReply(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newTestReply} disabled={isTakingTestId}>New Test</button>
    </div>)}
   {step == 11 && (<div className="flex justify-center mb-16 mt-4 items-end w-full">
      <div className="flex flex-col
       justify-center items-center mt-8 w-1/3">
        <div className="flex w-fit my-4 px-4 py-1 ">Test Assessment</div>
    {testAsses.length>0 && testAsses.map((testObj, index)=>{return(
      <div key={testObj.id} className="flex flex-col border-1 border-blue-300 rounded-md my-2 w-full">
        <div className="text-2xl text-blue-500 ml-4 mt-2">{index + 1}</div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-full bg-[#fff] mt-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.body ?? ""} onChange={(e) => updateTestAssBody(testObj, e.target.value)}
                placeholder="Test Body" rows="4" cols="50"  disabled={isSubmitting}></textarea>
        </div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.opt1} onChange={(e) => updateTestAssOpt1(testObj, e.target.value)}
                placeholder="Option 1" rows="2" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testAss-${testObj.id}`} checked={testObj.answer == 1}
               onChange={() => setTestAssAnswer(testObj, 1)}/></div></div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.opt2} onChange={(e) => updateTestAssOpt2(testObj, e.target.value)}
                placeholder="Option 2" rows="2" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testAss-${testObj.id}`} checked={testObj.answer == 2}
               onChange={() => setTestAssAnswer(testObj, 2)}/></div></div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.opt3} onChange={(e) => updateTestAssOpt3(testObj, e.target.value)}
                placeholder="Option 3" rows="2" cols="50"  disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testAss-${testObj.id}`} checked={testObj.answer == 3}
               onChange={() => setTestAssAnswer(testObj, 3)}/></div></div>
        <div className="flex px-2 w-full"><textarea 
          className="flex w-[calc(100%-2rem)] bg-[#fff] mt-2 mr-2 px-2 py-1 border-2 border-gray-300 rounded-md"
        value={testObj.opt4} onChange={(e) => updateTestAssOpt4(testObj, e.target.value)}
                placeholder="Option 4" rows="2" cols="50" disabled={isSubmitting}></textarea>
                <div className="flex w-8">
                  <input type="radio" name={`testAss-${testObj.id}`} checked={testObj.answer == 4}
               onChange={() => setTestAssAnswer(testObj, 4)}/></div></div>
                <div className="flex bg-gray-50 px-4 py-2 w-full">
                  <div className="flex w-fit px-2 py-1 border-2 
                    border-red-300 bg-gray-150 hover:bg-gray-100
                     rounded-md" onClick={()=>{removeTestAss(testObj)}}>Remove Test</div></div>
  </div>) })} </div>
    <button type="button" 
      className="flex h-fit w-fit px-4 py-1 border-2 border-gray-200
       hover:cursor-pointer hover:bg-gray-100 ml-4 my-2" 
              onClick={newTestAss}
          disabled={isTakingTestId}>New Test</button>
    </div>)}
    <div className="flex relative h-10 w-full justify-between px-20">
    { step >= 2 && <button onClick={prev} variant="outline"
     className="flex absolute left-8 w-fit border-1 border-gray-300 rounded-md bg-gray-100
      hover:cursor-pointer hover:bg-gray-50 px-4 py-1">Previous</button>}
    { step <= 10 && <button onClick={next}
     className="flex absolute right-8 w-fit border-1 border-gray-300 rounded-md bg-gray-100
      hover:cursor-pointer hover:bg-gray-50 px-4 py-1">Next</button>}
    </div>
    <div className="flex w-full justify-center items-center mt-4"> 
    { step <= 2 &&(<button type="submit" className="flex  w-fit px-4 py-1 border-1
      rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50 mb-36" 
              onClick={() => {submitLesson()}}
          disabled={isSubmitting}>
{saveLessonStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
          {isSubmitting ? "sending..." : "Save Lesson"}</button>)}
    {step == 3 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitWords()}}
          disabled={isSubmitting}>
          {saveWordsStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
            {isSubmitting ? "sending..." : "Save Words"}</button>)}
        {step == 4 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitTechWords()}}
          disabled={isSubmitting}>
          {saveTechWordsStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
            {isSubmitting ? "sending..." : "Save Technical Words"}</button>)}
  {step == 5 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitTestWrites()}}
          disabled={isSubmitting}>
          {testWritesStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
          {isSubmitting ? "sending..." : "Save Tests"}</button>)}
{step == 6 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitDDTest()}}
          disabled={isSubmitting}>
          {dDTestStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
          {isSubmitting ? "sending..." : "Save Tests"}</button>)}
{step == 7 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitWdmTest()}}
          disabled={isSubmitting}>
          {wdmTestStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
          {isSubmitting ? "sending..." : "Save Tests"}</button>)}

{step == 8 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitTestFills()}}
          disabled={isSubmitting}>
          {testFillsStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
            {isSubmitting ? "sending..." : "Save Tests"}</button>)}
{step == 9 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitTestTFs()}}
          disabled={isSubmitting}>
          {testTFsStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
            {isSubmitting ? "sending..." : "Save Tests"}</button>)}
{step == 10 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitTestReplies()}}
          disabled={isSubmitting}>
          {testRepliesStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
            {isSubmitting ? "sending..." : "Save Tests"}</button>)}
{step == 11 && (<button type="submit" 
      className="flex  w-fit px-4 py-1 border-1
       mb-36 mt-12 border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50" 
              onClick={() => {submitTestAsses()}}
          disabled={isSubmitting}>
          {testAssesStatus ? (<div className="flex text-pink-500 font-bold text-lg mr-1">*</div>): ""}
            {isSubmitting ? "sending..." : "Save Tests"}</button>)}
</div>
    </>; 
}

export default EdLesson;