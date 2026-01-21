import { useState, useEffect,} from "react";
import { X } from "lucide-react";
 
export default function UserTestReply({test, updateUsrAnswer}) {
  
const [testStyle, setTestStyle] = useState<string>('raw'); 
const [descShownNumber, setDescShownNumber] = useState<number>(0); 

useEffect(()=>{
  if(test.usr_answer == undefined || test.usr_answer == null){
    setTestStyle('raw');
  } else if (test.usr_answer == test.answer){
    setTestStyle('correct');

  } else {
    setTestStyle('wrong');
  }
}, [test]);

const closeDesc = () => {
  setDescShownNumber(0);
};

    return ( 
      
        <div className={`flex flex-col relative w-full mt-16 items-center justify-center rounded-md
         ${testStyle == 'raw' ? "bg-blue-50" : (testStyle == 'correct' ? "bg-green-50" : "bg-red-50") }`}>
         <div className="flex absolute -top-6 left-2 px-2 py-1 w-fit
           rounded-md bg-blue-50 z-15">Received Email</div>
          <div className="flex px-2 pt-6 pb-2 w-full bg-white
           border-2 border-blue-500 rounded-md z-10">{test.body}</div>

           <div className="flex w-full rounded-md">
          
<div className="flex px-2 text-xs justify-center items-center pt-6 pb-2 w-[15%] bg-blue-50
            rounded-md">Select best reply</div>

          <div className="flex flex-col bg-white px-2 py-2 w-[85%] my-2 rounded-md">
            <div className="flex w-full px-1 py-1 mt-2 bg-blue-100 shadow-md
            hover:shadow-lg rounded-md hover:bg-white hover:cursor-pointer">
            <div className="flex w-[8%] font-semibold text-blue-700">Reply 1:</div>
            <div className="flex w-[92%]" onClick={()=>{updateUsrAnswer(test, 1); setDescShownNumber(1);}}>
              {test.reply1}</div> </div>

              {descShownNumber == 1 && (<div className=
                {`flex relative w-[80%] px-2 py-2 mt-2 ${test.answer == 1 ? "bg-green-100" : "bg-red-100"}`}>
                <div className="flex w-full">{test.desc1}</div>
                <div className="flex absolute top-2 right-2
                 hover:text-red-500 hover:cursor-pointer" onClick={closeDesc}><X size={24} /></div>
              </div>)} 
            <div className="flex w-full px-1 py-1 mt-2 bg-blue-100 shadow-md
            hover:shadow-lg rounded-md hover:bg-white hover:cursor-pointer">
            <div className="flex w-[8%] font-semibold text-blue-700">Reply 2:</div>
            <div className="flex w-[92%]" onClick={()=>{updateUsrAnswer(test, 2); setDescShownNumber(2);}}>
              {test.reply2}</div> </div>
              {descShownNumber == 2 && (<div className=
                {`flex relative w-[80%] px-2 py-2 mt-2 ${test.answer == 2 ? "bg-green-100" : "bg-red-100"}`}>
                <div className="flex w-full">{test.desc2}</div>
                <div className="flex absolute top-2 right-2
                 hover:text-red-500 hover:cursor-pointer" onClick={closeDesc}><X size={24} /></div>
              </div>)} 
            <div className="flex w-full px-1 py-1 mt-2 bg-blue-100 shadow-md
            hover:shadow-lg rounded-md hover:bg-white hover:cursor-pointer">
            <div className="flex w-[8%] font-semibold text-blue-700">Reply 3:</div>
            <div className="flex w-[92%]" onClick={()=>{updateUsrAnswer(test, 3); setDescShownNumber(3);}}>
              {test.reply3}</div> </div>
              {descShownNumber == 3 && (<div className=
                {`flex relative w-[80%] px-2 py-2 mt-2 ${test.answer == 3 ? "bg-green-100" : "bg-red-100"}`}>
                <div className="flex w-full">{test.desc3}</div>
                <div className="flex absolute top-2 right-2
                 hover:text-red-500 hover:cursor-pointer" onClick={closeDesc}><X size={24} /></div>
              </div>)}</div>
            </div>
          </div>
          
  );
  
}

