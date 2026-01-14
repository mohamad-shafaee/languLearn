import { useState, useEffect,} from "react";

type UsrAnses = {
  ans1: string;
  ans2: string;
}
 
export default function UserTestFill({test, updateUsrAnswer}) {
  const [parts, setParts] = useState<string[]>([]);
  const [fillInds, setFillInds] = useState<number[]>([]);
  const [answersChanged, setAnswersChanged] = useState<boolean>(false);
  const [prevAnswers, setPrevAnswers] = useState<UsrAnses>({ans1: "", ans2: ""});
  
  const ps = test.body.split('---');
  const f = test.body.matchAll('---').toArray(); 
  
  useEffect(()=>{
    setParts(ps); 
    setFillInds(f.map((item, ind)=>{
      return item.index;
    }));
    setPrevAnswers({ans1: test.usr_answer1, ans2: test.usr_answer2});
    
  }, []);

  useEffect(()=>{
    if(test.usr_answer1 != prevAnswers.ans1 || test.usr_answer2 != prevAnswers.ans2){
      setAnswersChanged(true);
    }

  }, [test]);

  //useEffect(()=>{ console.log("fillsss: ", fillInds);}, [fillInds]);
  //useEffect(()=>{ console.log("parts: ", parts);}, [parts]);


  
    
    return ( 
      <div className="flex w-full mt-4"> 
        {fillInds.length == 1 && (<div className="flex items-center justify-center">
          <div className="flex px-1 py-1 w-fit">{parts[0]}</div><input type="text" value={test.usr_answer1 ?? ""}
              className="flex bg-[#fff] px-1 py-1 w-fit border-b-1 border-gray-300"
              placeholder="-----" onChange={(e) =>
               {updateUsrAnswer(1, test, e.target.value)}}/><div className="flex px-1 py-1 w-fit">{parts[1]}</div></div>)}
         {fillInds.length == 2 && (<div className="flex items-center justify-center">
          <div className="flex px-1 py-1 w-fit">{parts[0]}</div><input type="text" value={test.usr_answer1 ?? ""}
              className="flex bg-[#fff] px-1 py-1 w-fit border-1 border-gray-300 rounded-md"
              placeholder="-----" onChange={(e) =>
               {updateUsrAnswer(1, test, e.target.value)}}/><div className="flex px-1 py-1 w-fit">{parts[1]}</div>
               <input type="text" value={test.usr_answer2 ?? ""}
              className="flex bg-[#fff] px-1 py-1 w-fit border-1 border-gray-300 rounded-md"
              placeholder="-----" onChange={(e) =>
               {updateUsrAnswer(2, test, e.target.value)}}/>
               <div className="flex px-1 py-1 w-fit">{parts[2]}</div>
               </div>)}
         </div> 
  );
  
}

