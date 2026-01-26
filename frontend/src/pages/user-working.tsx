import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import FieldSelector from "../components/fieldSelector";
import { useNavigate } from "react-router-dom";


type Field = {
  id: number | null;
  name: string | null;
  img_path: string | null;
  description: string | null;
  has_order: boolean | null;
  last_lesson_id: number | null; 
};

type Lesson = {
  id: number | null;
  order: number | null;
  title: string | null;
  img_path: string | null;
  abstract: string | null; 
  score: number | null;
  //open: boolean | null; // true: you could read it since you done its previous lessons
  //done: boolean | null; //All tests plus test assessment are done 
};

const UserWorking: React.FC = () => {
  const { user, token } = useAuth(); 
  const [usrFields, setUsrFields] = useState<Field[]>([]);
  const [currentUsrField, setCurrentUsrField] = useState<Field | null>(null);
  const [selectFieldNeed, setSelectFieldNeed] = useState<boolean>(false);
  const [addRemoveFieldOpen, setAddRemoveFieldOpen] = useState<boolean>(false);
  const [usrLessons, setUsrLessons] = useState<Lesson[]>([]);
  const [usrLastLessonOrder, setUsrLastLessonOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshPage, setRefreshPage] = useState<boolean>(false);
  const [usrSelectedFields, setUsrSelectedFields] = useState<Field[]>([]);
  const [usrRmFields, setUsrRmFields] = useState<Field[]>([]);
  const [allFields, setAllFields] = useState<Field[]>([]);
  const needsApplyFields = useRef(false);


  const navigate = useNavigate();
  
// a third panel for learning words that are saved in user_ttws tables like a lightner box.

  // a panel for teacher may be created. Teacher could select lessons from various fields as a 
  // package for his/her students or create new lessons for them. Then when students
  // select the teacher or confirm he/she a user working page shows a panel for learning 
  // via the package. Teacher then could make extra exams for evaluating students, eg., by 4 options tests.

  useEffect(()=>{

            const getAllFields = async ()=>{
            try{
             const response_fields = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/fields`, {
             method: "GET",
             //credentials: "include",
             headers: { 
                      "Authorization": `Bearer ${token}`, //send token here
                      Accept: "application/json" 
                    },
            });

             if (!response_fields.ok)  return;

           const fieldsData = await response_fields.json();
           setAllFields(fieldsData.fields);

        } catch {} finally {}
        };
 
    const getUsrFields = async () => {
            try {
       setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({userId: user.id,})
      });
      if (!response.ok) { return; }
      const result = await response.json();
      if(result.data.length > 0){
        setUsrFields(result.data);
        setCurrentUsrField(result.data[0]);
        setSelectFieldNeed(false);

      } else {
        //await getAllFields();
        setSelectFieldNeed(true); 
      }
    } catch {} finally {setIsSubmitting(false);}; 
    };

    getAllFields();
    getUsrFields();

  }, [refreshPage]);
 
  useEffect(()=>{
    const getUserLessons = async () => {
      try {
       setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-lessons-by-field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({userId: user.id, fieldId: currentUsrField.id, })
      });
      if (!response.ok) { return; }
      const result = await response.json();
      if(result.data.length > 0){
        setUsrLessons(result.data);

      } else {

      }
    } catch {} finally {setIsSubmitting(false);};

    };

    if(currentUsrField){
      getUserLessons();
    }

  }, [currentUsrField]);

  useEffect(()=>{
    const updateUsrLastLessonOrder = () => {
      setUsrLastLessonOrder(usrLessons.find(le => le.id == currentUsrField.last_lesson_id).order);
    }

    if(usrLessons.length > 0){
      updateUsrLastLessonOrder();
    }
  }, [usrLessons]);

  const removeFromUsrSelectedField = (field) => {
    const confirmed = window.confirm("Are you sure to remove the field?");
  if (confirmed) {
        const new_fs = usrSelectedFields.filter((f) => f.id !== field.id );
        setUsrSelectedFields(new_fs);

        //const exists_in_usr = usrFields.some((f) => f.id === field.id);
        if (usrFields.length > 0 && usrFields.some((f) => f.id === field.id)) { 
          setUsrRmFields([...usrRmFields, field]);
        }
        }
  };

  const addToUsrSelectedField = (field) => {
    if(field){
      const exists = usrSelectedFields.some((f) => f.id === field.id);
    if (!exists) {
    setUsrSelectedFields([...usrSelectedFields, field]);
    }
    const existsInRm = usrRmFields.some((f) => f.id === field.id);
    if(existsInRm){
      const new_rm_fields = usrRmFields.filter((f) => f.id !== field.id);
      setUsrRmField(new_rm_fields);
    }
  } else {
    alert("Please select a field.");
  }
    

  };

  const sameSelectedFields = () => {
    const ids1 = new Set(usrSelectedFields.map(f => f.id));
    return usrFields.every(f => ids1.has(f.id));
    
  };


  const updateNeedsApplyFields = () => {
    if(usrRmFields.length > 0 || usrSelectedFields.length != usrFields.length){
      needsApplyFields.current = true;
      return;
    }
    if(!sameSelectedFields()){
      needsApplyFields.current = true;
      return;
    }
    needsApplyFields.current = false;
  };
   
  const addRemoveFieldsToUser = async () => {

    updateNeedsApplyFields();
    if(!needsApplyFields.current){
      alert("There is not changes to apply!");
      return;
    }
      const payload = {
        userId: user.id,
        addFields: usrSelectedFields,
        removedFields: usrRmFields,
    
  };

  try {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-user-fields`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        //navigate(`/working`, { replace: true });
        setUsrRmFields([]);
        setRefreshPage(!refreshPage);
        
      } else {
        alert("Failed to save fields for you.");
      }
    } catch (err) {
      alert("Failed to save fields for you.");
    } finally{setIsSubmitting(false);}
  };

  const openLesson = (lesson) => {
   
    const is_open = !currentUsrField.has_order ? true : 
      (lesson.id <= currentUsrField.last_lesson_id);

    if(!is_open){
      alert("You should pass previous lessons first!");
      return;
    }
    navigate(`/lesson-page/${currentUsrField.id}/${lesson.id}`);

};
   
  return (<div className="flex flex-col w-full items-center justify-center">
    {(addRemoveFieldOpen || selectFieldNeed) && 
    (<div className="flex w-[60%] border-2 border-gray-400 rounded-md mt-12 bg-blue-50">
     <div className="flex w-[80%] mx-4 my-2 bg-gray-50">
        <FieldSelector className="flex  mt-4 px-2 py-1 w-full" 
        selectedFields={usrSelectedFields} fields={allFields} 
        onRemoveField={(f) => {removeFromUsrSelectedField(f)}} 
        onAddField={(f) => {addToUsrSelectedField(f)}}/></div>
    <div className="flex flex-col w-[20%] mx-2 items-center justify-center">
      <div className="flex w-fit h-fit hover:cursor-pointer border-2
       border-gray-400 rounded-md px-3 py-1 mb-2 text-md
       hover:text-blue-500" onClick={addRemoveFieldsToUser}>Apply</div>
       {addRemoveFieldOpen && <div className="flex w-fit h-fit hover:cursor-pointer border-2
       border-gray-400 rounded-md px-3 py-1 mb-2 text-md
       hover:text-blue-500" onClick={()=>setAddRemoveFieldOpen(false)}>Close</div>}
  </div></div>)}{!selectFieldNeed && (<div className="flex flex-col items-center w-full mt-16 py-2">
      <div className="flex relative border-2 border-gray-300 my-2 rounded-md py-4 px-4 w-[80%]">
        <div className="flex text-gray-500 items-center absolute w-fit px-2 py-1 h-8
         -top-5 bg-gray-50 left-1"><div className="flex py-1">Your Fields</div>
         <div className="flex ml-2 px-2 py-1 hover:cursor-pointer 
          hover:shadow-md transition text-blue-500 rounded-md" 
          onClick={()=> {setUsrSelectedFields(usrFields); setAddRemoveFieldOpen(true)}}>
          Add/Remove Fields</div></div>
        {usrFields.map((f, i) => (<div key={f.id} 
          className={`flex w-fit px-1 py-1 mt-4 mx-2 border-2 items-center justify-center
        rounded-md hover:cursor-pointer hover:text-blue-500
         overflow-hidden ${currentUsrField?.id == f.id ? 
          "border-blue-500 text-blue-500 shadow-md" 
          : "border-gray-300 text-black-500 hover:shadow-lg transition"}`}
        onClick={()=> setCurrentUsrField(f)}>
        <div className="flex w-12 h-12"><img src={f.img_path ?? ""} alt="Field Image"
          className="flex w-12 h-12 rounded-md"/></div>
    <div className="flex flex-col py-1 px-2 w-fit">
      <div className="flex w-fit">{f.name}</div>
    </div>
  </div>))}
      </div>
      <div className="flex flex-col border-2 border-gray-300 rounded-md h-screen py-8 px-4 w-[85%]">
        {usrLessons.map((item, index)=>(<div key={item.id} 
          className={`flex w-full px-1 py-1 mt-4 mx-2 border-2
        rounded-md overflow-hidden ${item.id == currentUsrField.last_lesson_id ? 
          "border-blue-500 text-blue-500 shadow-md hover:cursor-pointer hover:text-blue-500" 
          : (item.id < currentUsrField.last_lesson_id ? 
            "hover:cursor-pointer hover:text-blue-500 hover:shadow-lg border-gray-300 text-black-500" :
             "border-gray-300 text-gray-400 hover:none")}`}
        onClick={()=>openLesson(item)}>
        <div className="flex w-12 h-12"><img src={item.img_path ?? ""} alt="Lesson Image"
          className="flex w-12 h-12 rounded-md"/></div>
    <div className="flex flex-col py-1 px-2 w-fit">
      <div className="flex w-fit">{item.title}</div>
      <div className="flex text-xs w-fit">
        <div className="flex text-xs w-fit">{item.score ?? ''}</div>
        {item.id == currentUsrField.last_lesson_id 
        && (<div className="flex text-xs px-1 text-green-700 w-fit">current</div>)}
        {item.id > currentUsrField.last_lesson_id 
        && (<div className="flex text-xs px-1 text-red-500 w-fit">close</div>)}
        {user.is_premium 
        && (<div className="flex text-xs px-1 text-red-500 w-fit">access</div>)}
      </div>
    </div>
  </div>))}
      </div>
    </div>)} </div>
  );
};

export default UserWorking;
