import { useState, useEffect,} from "react";

  
export default function UserTestFill({test, updateUsrAnswer}) {
  const [parts, setParts] = useState<string[]>([]);
  const [fillInds, setFillInds] = useState<number[]>([]);
  const [testStyleP1, setTestStyleP1] = useState<string>('raw');
  const [testStyleP2, setTestStyleP2] = useState<string>('raw');
  
  const ps = test.body.split('---');
  const f = test.body.matchAll('---').toArray();

  const updateStyleP1 = () => {
  if(test.usr_answer1 == ''){
    setTestStyleP1('raw');
  } else if (test.fill1 == test.usr_answer1){
    setTestStyleP1('correct');

  } else {
    setTestStyleP1('wrong');
  }

  };

  const updateStyleP2 = () => {
  
    if(test.usr_answer2 == ''){
    setTestStyleP2('raw');
  } else if (test.fill2 == test.usr_answer2){
    setTestStyleP2('correct');

  } else {
    setTestStyleP2('wrong');
  }
  };

  useEffect(()=>{
    setParts(ps); 
    setFillInds(f.map((item, ind)=>{
      return item.index;
    })); 
    
    
  }, []); 

  useEffect(()=>{
    updateStyleP1();

  }, [test.usr_answer1]);

  useEffect(()=>{
    updateStyleP2();

  }, [test.usr_answer2]);

  /*useEffect(()=>{
    console.log("test style: ", testStyleP1, testStyleP2);

  }, [testStyleP1, testStyleP2]);*/

  return ( 
      <div className="flex w-full mt-4"> 
        {fillInds.length == 1 && (<div className="flex items-center justify-center">
          <div className="flex px-1 py-1 w-fit">{parts[0]}</div>
          <input type="text" value={test.usr_answer1 ?? ""}
              className={`flex bg-[#fff] px-1 py-1 ${testStyleP1 == 'raw' ? 
            "border-b-2 border-blue-500" : (testStyleP1 == 'correct') ? "border-b-2 border-green-500" : 
         "border-b-2 border-red-500" }`}
              placeholder="---" onChange={(e) =>
               {updateUsrAnswer(1, test, e.target.value); }}/>
               <div className="flex px-1 py-1 w-fit">{parts[1]}</div></div>)}
         {fillInds.length == 2 && (<div className="flex items-center justify-center">
          <div className="flex px-1 py-1 w-fit">{parts[0]}</div><input type="text" value={test.usr_answer1 ?? ""}
              className={`flex bg-[#fff] px-1 py-1 ${testStyleP1 == 'raw' ? 
            "border-b-2 border-blue-500" : (testStyleP1 == 'correct') ? "border-b-2 border-green-500" : 
         "border-b-2 border-red-500" }`}
              placeholder="---" onChange={(e) =>
               {updateUsrAnswer(1, test, e.target.value); }}/><div className="flex px-1 py-1 w-fit">{parts[1]}</div>
               <input type="text" value={test.usr_answer2 ?? ""}
              className={`flex bg-[#fff] px-1 py-1 ${testStyleP2 == 'raw' ? 
            "border-b-2 border-blue-500" : (testStyleP2 == 'correct') ? "border-b-2 border-green-500" : 
         "border-b-2 border-red-500" }`}
              placeholder="---" onChange={(e) =>
               {updateUsrAnswer(2, test, e.target.value); }}/>
               <div className="flex px-1 py-1 w-fit">{parts[2]}</div>
               </div>)}
         </div> 
  );
  
}

