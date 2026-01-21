import { useState, useEffect,} from "react";



 
export default function UserTestTF({test, updateUsrAnswer}) {
   
  const [testStyle, setTestStyle] = useState<string>('raw'); 

useEffect(()=>{
  if(test.usr_answer == undefined || test.usr_answer == null){
    setTestStyle('raw');
  } else if (test.usr_answer == test.answer){
    setTestStyle('correct');

  } else {
    setTestStyle('wrong');
  }
}, [test]);



  
    
    return ( 
      
        <div className={`flex w-full mt-2 items-center justify-center rounded-md
         ${testStyle == 'raw' ? "bg-blue-50" : (testStyle == 'correct' ? "bg-green-50" : "bg-red-50") }`}>
          <div className="flex px-1 py-1 w-[80%]">{test.body}</div>
          <div className="flex flex-col  px-4 py-2 w-[20%]">
            <label className="flex mr-2">
              <input className="flex mr-2" type="radio" name={`testTF-${test.id}`}
               checked={test.usr_answer == true}
               onChange={() => updateUsrAnswer(test, true)}/>
                True
            </label>
            <label className="flex mr-2">
              <input className="flex mr-2" type="radio" name={`testTF-${test.id}`} 
                checked={test.usr_answer == false}
               onChange={() => updateUsrAnswer(test, false)}/>
                False
            </label>
                </div>
          </div>
          
  );
  
}

