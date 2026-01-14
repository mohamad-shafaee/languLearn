import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import type { Mean, Language } from "../types";
import CustomObjSelect from "../components/customObjSelect";

type TechWordObj = {
  id: string;
  part: number;
  word: string;
  phonetic: string | null;
  mean: string;
 }
 
export default function TechWordInfo({ value, onAddWord, onRemoveWord }) {
  
  const [status, setStatus] = useState<string>("raw");
  const [word, setWord] = useState<TechWordObj>(value); 

const updateMean = (val) => { 
  setWord({...word, mean: val});
  setStatus("notapplied");
};

const statusStyles = {
  applied: "bg-green-100 border-green-200",
  notapplied: "bg-pink-100 border-pink-200",
  raw: "text-blue-700 bg-blue-100 border-blue-200",
};
 
  return (
    <div className={`flex flex-col items-center py-4 
    flex-col w-full border-3 rounded-md ${statusStyles[status]}`}>
          <input type="text" value={word.part}
      className="flex bg-[#fff] py-1 px-2 w-1/2 border-1 border-gray-500 rounded-l-md"
      placeholder="Part" onChange={(e) => {
        setWord({...word, part: e.target.value});
        setStatus("notapplied");}}/>
    <div className="flex px-1 w-full rounded-md">      
      <input type="text" value={word.word}
      className="flex bg-[#fff] py-1 px-2 w-1/2 border-1 border-gray-500 rounded-l-md"
      placeholder="Word" onChange={(e) => {
        setWord({...word, word: e.target.value});
        setStatus("notapplied");}}/>
      <input type="text" value={word.phonetic}
      className="flex bg-[#fff] px-2 py-1 w-1/2 border-1 border-gray-500 rounded-r-md"
      placeholder="Phonetic" onChange={(e) => {
        setWord({...word, phonetic: e.target.value});
        setStatus("notapplied");}}/>
      </div>
      <textarea  className="flex bg-[#fff] mt-4 px-2 py-1 w-3/4"
               value={word.mean}
                onChange={(e) => updateMean(e.target.value)}
                placeholder="Description"
                  rows="4" cols="50">
        </textarea>
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
 