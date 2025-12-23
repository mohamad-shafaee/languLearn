import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { WordObj, Mean, Language } from "../types";
import CustomObjSelect from "../components/customObjSelect";
import { v4 as uuidv4 } from 'uuid';
 
export default function WordInfo({ value, languages, onAddWord, onRemoveWord }) {
  const wordRef = useRef(null);
  const phonRef = useRef(null);
  const [status, setStatus] = useState<string>("raw");
  const [word, setWord] = useState<WordObj>(value); 
  const [selectedLanguages, setSelectedLanguages] =
                  useState<Language[]>([{id: languages[0].id,
                                         code: languages[0].code,
                                         name:languages[0].name,
                                         direction:languages[0].direction}]);
  // set selectedLanguages by value.
  useEffect(()=>{
    if(value.means.length > 0){
     
      const sl = languages.filter(lang => value.means.some(m => m.language_id === lang.id));
      setSelectedLanguages(sl);
    }
  }, []);
 
  // Update a single word by index
  function updateSelectedLanguage(id: number, updatedLanguage: WordObj) {
    setSelectedLanguages(prev =>
      prev.map(lang => (lang.id === id ? updatedLanguage : lang))
    );
    setStatus("notapplied");
  }

  const createEmptyLang = (): Language => ({
     id: uuidv4(),
     code: "",
     name: "",
     direction: "",
    });

const addLang = () => {
  setSelectedLanguages(prev => [...prev, createEmptyLang()]);
};

const findMean = (lang) => word.means.find(item => item.language_id == lang.id)?.mean ?? "";

const updateMean = (lang, val) => {
  const word_new = {...word, means: word.means.some(m => m.language_id == lang.id)? 
                      word.means.map(m => (m.language_id == lang.id) ? {...m, mean: val} : m)
                      : [...word.means, {language_id: lang.id, language: lang.code, mean: val}]};
  setWord(word_new);
  setStatus("notapplied");
};

const removeTranslate = (lang_id) => {
  const confirmed = window.confirm("Are you sure to remove the translation?");
  if (confirmed) {
       setSelectedLanguages(prev => {
       const newLangs = prev.filter(lang => lang.id !== lang_id);
       if (newLangs.length < 1) {
          return [createEmptyLang()];
       }
       return newLangs;
  });
   //update word
   const new_means = word.means.filter(m => (m.language_id !== lang_id));
   setWord({...word, means: new_means});
   setStatus("notapplied");
  }
};

const statusStyles = {
  applied: "bg-green-100 border-green-200",
  notapplied: "bg-pink-100 border-pink-200",
  raw: "text-blue-700 bg-blue-100 border-blue-200",
};
 
  return (
    <div className={`flex flex-col items-center py-4 flex-col w-full border-3 rounded-md ${statusStyles[status]}`}>
    <div className="flex px-1 w-full rounded-md">      
      <input type="text" ref={wordRef} value={word.word}
      className="flex bg-[#fff] py-1 px-2 w-1/2 border-1 border-gray-500 rounded-l-md"
      placeholder="Word" onChange={(e) => {
        setWord({...word, word: e.target.value});
        setStatus("notapplied");}}/>
      <input type="text" ref={phonRef} value={word.phonetic}
      className="flex bg-[#fff] px-2 py-1 w-1/2 border-1 border-gray-500 rounded-r-md"
      placeholder="Phonetic" onChange={(e) => {
        setWord({...word, phonetic: e.target.value});
        setStatus("notapplied");}}/>
      </div>


      <div className="flex flex-col items-center w-full">
        {selectedLanguages.map((langObj, index)=>{
          return(<div key={langObj.id} className="flex items-center w-full py-2 px-1">
            <div className="flex flex-col items-center mr-1 w-1/4">
              <CustomObjSelect  
                  className="flex bg-[#fff] border-2 border-red-500 mt-4 px-2 py-1 w-1/2" 
                  options={languages}
                  value={langObj.code}
                  onChange={(lang)=>{
                  updateSelectedLanguage(langObj.id, lang);
              }}
            placeholder="Select language"
            arrowSize="20"/>
            <div className="flex flex-col ml-1 mt-2 px-2 py-1 w-fit border-1 border-gray-300
             rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50"
             onClick={()=>removeTranslate(langObj.id)}>Remove</div>

          </div>

        <textarea  className="flex bg-[#fff] mt-4 px-2 py-1 w-3/4"
               value={findMean(langObj)}
                onChange={(e) => updateMean(langObj, e.target.value)}
                placeholder={langObj.code == 'en' ? "English Meaning" :
                 (langObj.code == 'fa' ? "معنی فارسی" : "Select language first")}
                  rows="4" cols="50" disabled={langObj.code == "" ? true : false}>
        </textarea></div>);})} 
      </div>
      <button type="button" className="flex  w-fit px-4 py-1 border-1 
        border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50 mt-4" 
              onClick={addLang}>Add Translation</button>
      <div className="flex w-full px-4 py-1 border-1 border-gray-300 rounded-md bg-white mt-4">
        <button type="button" className="flex  w-fit px-4 py-1 border-1 
        border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50 mx-1 mt-4 mb-4" 
              onClick={()=>{onAddWord(word); setStatus("applied");}}>Apply Word</button>
        <button type="button" className="flex hover:cursor-pointer w-fit px-4 py-1 border-1
        border-gray-300 rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-50 mx-1 mt-4 mb-4" 
              onClick={()=>onRemoveWord()}>Remove Word</button>
      </div>
  </div>
  );
}
 