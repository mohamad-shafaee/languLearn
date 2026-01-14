import React, { useState, useEffect,} from "react";
import WordMeanBox from "../components/word-mean-box";

export default function ParseText({text, words, staredWords, addRemoveStaredWords}) {
  const [activeWord, setActiveWord] = React.useState(null);
   const handleClick = (e, cleanWord) => {
    const wordData = words.find(
      w => w.word.toLowerCase() === cleanWord.toLowerCase()
    ); 
    if (!wordData) return;  
    setActiveWord({
      id: wordData.id,
      word: cleanWord,
      phonetic: wordData.phonetic,
      means: wordData.means
    });
  };

  React.useEffect(() => {
  const handler = () => setActiveWord(null);
  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}, []);

  if(text){
    const parts = text.split(/(\[[^\]]+\])/g); 
    return (
    <div className="flex w-full z-10">
      {parts.map((part, index) => {
        // Check if it's a [word]
        if (part.startsWith("[") && part.endsWith("]")) {
          const cleanWord = part.slice(1, -1); 

          return (
            <span key={index} className="flex relative w-fit
             hover:cursor-pointer hover:text-blue-700"
            onClick={(e) => {
                     e.stopPropagation();
                     handleClick(e, cleanWord);}}>
              
              <span>&nbsp;</span>
              <span className="flex w-fit hover:font-bold">{cleanWord}</span><span>&nbsp;</span>
              { activeWord && ( activeWord?.word == cleanWord) && (<WordMeanBox isOpen={activeWord !== null} 
                activeWord={activeWord} isStared={ staredWords.find(w => w.word_id == activeWord.id)}
                 onClose={(e) => {
                          e.stopPropagation();
                          setActiveWord(null); 
                            }} onClickWordStar={(w)=>{addRemoveStaredWords(w)}} />) }
            </span>
          );
        } 
        return <span key={index}>{part}</span>;
      })}
      </div>);}
}

