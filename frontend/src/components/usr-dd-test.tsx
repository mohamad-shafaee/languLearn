import { useState, useEffect,} from "react";
 
export default function UsrDDTest({test, match, saveMatch}) {

  const [wrongDrop, setWrongDrop] = useState<number>(-1);
  const [matched, setMatched] = useState<number>(0);

    useEffect(()=>{
      setMatched(match);
    }, [])
   
  const onDrop = (e, target) => {
    e.preventDefault();
    const dragged = JSON.parse(e.dataTransfer.getData("text/plain"));

    if(test.answer == target){
      setMatched(target);
      saveMatch(target);
    } else {
      setWrongDrop(target);
      setTimeout(() => setWrongDrop(-1), 300);
    }
  };

  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(test));
  };
    
    return ( 
      <div className="flex w-full">
           <div className="flex flex-col w-1/2">
            <div onDrop={(e)=> onDrop(e, 1)} onDragOver={e => e.preventDefault()}
              className={`flex w-full my-2 py-2 px-1 rounded-md
              ${ wrongDrop == 1 ? "bg-[#fc0356] border-2 border-[#6b0326]-500" :
            matched == 1 ? "bg-[#9ae6b4] border-2 border-[#0EB247]-1000" :
             "border-2 border-gray-300 bg-white"}`}>
              {test.text1}</div>
            <div onDrop={(e)=> onDrop(e, 2)} onDragOver={e => e.preventDefault()}
              className={`flex w-full my-2 py-2 px-1 rounded-md
              ${ wrongDrop == 2 ? "bg-[#fc0356] border-2 border-[#6b0326]-500" :
            matched == 2 ? "bg-[#9ae6b4] border-2 border-[#0EB247]-1000" :
             "border-2 border-gray-300 bg-white"}`}>
              {test.text2}</div>
            <div onDrop={(e)=> onDrop(e, 3)} onDragOver={e => e.preventDefault()}
              className={`flex w-full my-2 py-2 px-1 rounded-md
              ${ wrongDrop == 3 ? "bg-[#fc0356] border-2 border-[#6b0326]-500" :
            matched == 3 ? "bg-[#9ae6b4] border-2 border-[#0EB247]-1000" :
             "border-2 border-gray-300 bg-white"}`}>
              {test.text3}</div>
           </div>
           <div className="flex w-1/2 h-full justify-center
            items-center">
            <div className="flex w-fit px-2 py-1 border-2 border-gray-300
              hover:shadow-md hover:bg-gray-50 hover:border-gray-500
               hover:cursor-pointer rounded-md">
              <div draggable={(matched == 0)} 
          onDragStart={e => onDragStart(e)}
           className={`flex w-fit ${matched > 0 ? "text-[#01e6b]" : "text-gray-500"}`}>{test.word}</div>
            </div>
             </div>
         </div> 
  );
  
}

