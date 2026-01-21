import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";



 
export default function ProgressBar({ step, prev, next, setStep }) {
  
  
 
  return (
    <div className="flex flex-col w-full">
      <div className={`flex flex-col bg-green-700 h-2 text-white justify-center items-center text-xs
       ${step == 1 ? "w-1/5" : (step == 2 ? "w-2/5" : (step == 3 ? "w-3/5" : (step == 4 ? "w-4/5" : "w-full")))}`}>
       {step/5*100 + '%'}</div>
      <div className="flex w-full px-20 justify-between items-center bg-white">
    { step >= 1 && <div onClick={prev} variant="outline"
     className={`flex w-fit rounded-md bg-transparent
       ${step == 1 ? "hover:none text-blue-100" : "hover:cursor-pointer hover:text-blue-700"}`}>
       <ChevronLeft size={72} /></div>}
      {<div className="flex w-1/3 justify-between ">{[1,2,3,4,5].map((stp, ind)=>(<div key={stp} 
        className={`flex px-4 py-1 font-semibold hover:cursor-pointer 
        ${step == stp ? "text-xl text-gray-500 border-1 border-gray-500 rounded-md" :
         "text-lg text-blue-500 hover:border-b-2 hover:border-blue-500"}`} onClick={()=>setStep(stp)}>
        {stp}
      </div>))}</div>}
    { step <= 5 && <div onClick={next}
     className={`flex w-fit rounded-md bg-transparent
       ${step == 5 ? "hover:none text-blue-100" : "hover:cursor-pointer hover:text-blue-700"}`}>
       <ChevronRight size={72} /></div>}
    </div>
    </div>
    
  );
}
 