import { Volume1, X, Star, StarOff } from "lucide-react";
import { useState } from "react";

const playSound = async (word, lang) => {

const u = new SpeechSynthesisUtterance(word);
  u.lang = (lang == "us") ? "en-US" : "en-GB";
  speechSynthesis.speak(u);

};


export default function MeanBox({ isOpen, activeWord, onClose, isStared, onClickWordStar }) {
  const { word, means } = activeWord;
  const [isGBAvailable, setIsGBAvailable] = useState<boolean>(false);

  return (
    <div className={`flex flex-col min-w-48 min-h-24 px-2 py-2 absolute top-8 left-1 z-50
     border-1 border-blue-700 rounded-b-md rounded-tr-md bg-white transform transition-all duration-100 ease-out
      ${isOpen
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"}`}>
      <div className="flex mb-4">
       <strong>{word}</strong>
       <div className="flex mx-4 px-2">
        {isGBAvailable && (<div className="flex justify-center mr-4
      items-center hover:shadow-md hover:text-blue-500 hover:cursor-pointer" onClick={()=>playSound(word, "gb")}>
      <div className="flex"><Volume1 size={20}/>
      </div><div className="flex h-6 leading-none">gb</div></div>)}

     <div className="flex justify-center mr-4 
      items-center hover:shadow-md hover:text-blue-500 hover:cursor-pointer" onClick={()=>playSound(word, "us")}>
      <div className="flex"><Volume1 size={20}/>
      </div><div className="flex h-6 leading-none">us</div></div>


    </div>
      </div>

      <ul className="flex flex-col ml-4">
        {means.map(m => (
          <li key={m.id}>{m.mean}</li>
        ))}
      </ul>

      <button className="absolute top-1 right-1 px-1 rounded-xl
       text-red-500 text-xl hover:font-bold bg-white hover:cursor-pointer" onClick={onClose}><X size={20}/></button>
       <button className="absolute bottom-1 right-1 px-1 rounded-xl
       text-red-500 text-xl hover:font-bold bg-white" onClick={()=>onClickWordStar(activeWord)}>
       {!isStared && (<StarOff className="text-[#d90754] hover:cursor-pointer"  size={20}/>)}
        {isStared && (<Star className="text-[#14b806] hover:cursor-pointer" fill="#14b806" size={20}/>)}</button>
    </div>
  );
}
