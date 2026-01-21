import { useState, useEffect } from "react";



 
export default function UserTestAss({test, updateUsrAnswer}) {
    
  //const [usrAnswer, setUsrAnswer] = useState<number>(0);
  const [areOptsLarge, setAreOptsLarge] = useState<boolean>(false);
  

  /*useEffect(()=>{
    updateUsrAnswer(test, usrAnswer);
  }, [usrAnswer]);*/

  useEffect(()=>{

    if(false){
      setAreOptsLarge(true);
    }
    
  }, []);





  
    
    return ( 
      
        <div className={`flex flex-col w-full mt-2 items-center
         justify-center rounded-md bg-gray-50 py-4`}>
          <div className="flex px-1 py-1 w-full">{test.body}</div>
          <div className={`flex px-24 py-1 justify-between w-full ${areOptsLarge ? "flex-col" : ""}`}>

            <div className={`flex px-4 py-1 w-fit rounded-md 
             hover:cursor-pointer hover:shadow-md ${areOptsLarge ? "mt-2" : ""} ${test.usr_answer == 1 ?
              "border-2 border-blue-500 text-blue-700 shadow-lg" : "border-1 border-gray-300"}`}
             onClick={()=>{updateUsrAnswer(test, 1);}}>{test.opt1}</div>

             <div className={`flex px-4 py-1 w-fit rounded-md 
             hover:cursor-pointer hover:shadow-md ${areOptsLarge ? "mt-2" : ""} ${test.usr_answer == 2 ?
              "border-2 border-blue-500 text-blue-700 shadow-lg" : "border-1 border-gray-300"}`}
             onClick={()=>{updateUsrAnswer(test, 2);}}>{test.opt2}</div>

             <div className={`flex px-4 py-1 w-fit rounded-md 
             hover:cursor-pointer hover:shadow-md ${areOptsLarge ? "mt-2" : ""} ${test.usr_answer == 3 ?
              "border-2 border-blue-500 text-blue-700 shadow-lg" : "border-1 border-gray-300"}`}
             onClick={()=>{updateUsrAnswer(test, 3);}}>{test.opt3}</div>

             <div className={`flex px-4 py-1 w-fit rounded-md 
             hover:cursor-pointer hover:shadow-md ${areOptsLarge ? "mt-2" : ""} ${test.usr_answer == 4 ?
              "border-2 border-blue-500 text-blue-700 shadow-lg" : "border-1 border-gray-300"}`}
             onClick={()=>{updateUsrAnswer(test, 4);}}>{test.opt4}</div>
              
          </div>

          
          </div>
          
  );
  
}

