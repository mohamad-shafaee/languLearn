
import { useState, useEffect } from "react";


export default function MatchWordMean(props) {
  const [matched, setMatched] = useState({});
  const [wrongDrop, setWrongDrop] = useState<number>(-1);
  const [shuffled, setShuffled] = useState([]);

  
  
  const shuffleArray = array => [...array].sort(() => Math.random() - 0.5);
  useEffect(() => {
  if (props.stared?.length) {
    setShuffled(shuffleArray(props.stared));
  }
}, [props.stared]);

  const onDrop = (e, targetWord) => {
    e.preventDefault();
    const dragged = JSON.parse(e.dataTransfer.getData("text/plain"));

    if (dragged.word_id == targetWord.word_id) {
      setMatched(prev => ({ ...prev, [targetWord.word_id]: true }));
    } else {
      setWrongDrop(targetWord.word_id);
      setTimeout(() => setWrongDrop(-1), 300);
    }
  };

  const onDragStart = (e, word) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(word));
  };

  return (<div className="flex w-full">
          {props.stared.length > 0 && (<><div className="flex justify-center items-center flex-col w-1/2">
          {props.stared.map((w, i)=>(
         <div key={w.word_id} onDrop={(e)=> onDrop(e, w)} onDragOver={e => e.preventDefault()}
          className={`flex px-2 py-1 w-fit  mx-4 py-2 px-16 transition-colors duration-300`}>
           <div className={`flex text-xs w-fit border-2 border-gray-300 rounded-md px-2 py-1
           ${ wrongDrop == w.word_id ? "bg-[#fc0356] border-[#6b0326]-1000" :
            matched[w.word_id] ? "bg-[#9ae6b4] border-[#0EB247]-1000" : "bg-white" }`}>
            {props.words.find(wo => wo.id == w.word_id)?.word}</div></div>
        ))} 
        </div>
        <div className="flex flex-col w-1/2 justify-center items-center">
          {shuffled.map((w, i)=>(
         <div key={w.word_id} draggable={!matched[w.word_id]} 
         	onDragStart={e => onDragStart(e, w)} className="flex px-2 py-1 w-fit
        border-2 border-gray-300 mx-4 my-2 rounded-md text-xs">{props.words.find(wo => wo.id == w.word_id)?.means.find(m => 
          m.mean != '')?.mean}</div>
        ))} 
        </div></>)}
        </div>);
}




