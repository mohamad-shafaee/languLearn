import { useState, useEffect,} from "react";

  
export default function TestEvaluation({data}) {

  
  

  
  
  return ( 
      <div className="flex w-fit p-2 mt-4">
        <div className="flex items-center justify-center rounded-full
         w-24 h-24 border-8 border-green-700 hover:cursor-pointer">
          {data.correct/data.all*100 + '%'}
         </div>
         <div className="flex flex-col ml-4 justify-center w-fit ">
          <div className="flex w-fit justify-center items-center rounded-md px-4 bg-transparent
           hover:shadow-md hover:cursor-pointer">
         <div className="flex w-fit text-blue-700 text-xl ">
          {data.all}
         </div> 
         <div className="flex w-fit text-blue-700 ml-4 text-xs">
          {'Total'}
         </div> 
         </div> 
        <div className="flex w-fit justify-center items-center rounded-md px-4 bg-transparent
           hover:shadow-md hover:cursor-pointer">
         <div className="flex w-fit text-green-700 text-xl">
          {data.correct}
         </div> 
         <div className="flex w-fit text-green-700 ml-4 text-xs">
          {'Correct'}
         </div> 
         </div>
          <div className="flex w-fit justify-center items-center rounded-md px-4 bg-transparent
           hover:shadow-md hover:cursor-pointer
          ">
         <div className="flex w-fit text-red-700 text-xl">
          {data.wrong}
         </div> 
         <div className="flex w-fit text-red-700 ml-4 text-xs">
          {'Wrong'}
         </div> 
         </div> 
         </div> 
        
         </div> 
  );
  
}

