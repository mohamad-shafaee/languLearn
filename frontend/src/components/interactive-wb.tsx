 import { useState } from "react";

 
export default function InteractiveWB(props) {
  const [selectedWords, setSelectedWords] = useState([]);
  

  const applySelectedWords = (word) => {
    setSelectedWords(prev=>{
      const exists = prev.find(w => w.id === word.id);

      if (exists) {
        // remove if already selected
        return prev.filter(w => w.id !== word.id);
      }
      // add if not selected (max 3 example)
      return [...prev.slice(-2), word];
    });
    props.onSelect(selectedWords);
  };

  return (<div className={`flex flex-col border-1 border-red-400 items-center justify-center px-2 my-4 w-full rounded-md`}>
   <div className={`flex px-2 w-full my-4 rounded-md border-1 border-blue-400`}>
    {props.words.map((word, ind)=>{
      const isSelected = selectedWords.some(w => w.id === word.id);

      return (<div key={word.id} className={`flex w-fit h-fit px-2 py-1 mx-3 my-2 rounded-md
      hover:cursor-pointer 
        ${ isSelected ? "border-3 border-green-400 bg-green-50 hover:bg-green-100 shadow-lg" :
         "border-1 border-gray-400 bg-gray-50 hover:bg-gray-100"}`} onClick={()=>applySelectedWords(word)}>
           {word.word}
         </div>);}
      )}
    </div>
    <div className="flex px-2 py-1 w-fit mb-4 rounded-md border-1 border-gray-400 hover:cursor-pointer
      hover:bg-gray-50 hover:shadow-md" onClick={()=>props.saveInteractiveWords()}>Save</div>
    
    </div>);
}
 