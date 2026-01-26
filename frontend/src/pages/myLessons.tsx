
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
//import type { LessonItem } from "../types";
import { useNavigate } from "react-router-dom";
import LessonCard from "../components/lessonCard";

type Filter = {
  fieldId: number;
  recent: boolean;
  authorId: number;
  search: string;   // when search, all other filters set to none
};

type Field = {
  id: number | null;
  name: string | null;
  author_id: number | null;
  img_path: string | null;
  description: string | null;
};

export type LessonItem = {
  id: number;
  author_id: number;
  author_name: string;
  title: string;
  img_path: string;
  abstract: string;
  fieldIds: FieldItem[];
  status: string; 
  is_open: boolean;
}

const MyLessons: React.FC = () => {
  const { user, token } = useAuth();
  
  //const imgRef = useRef(null);
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(100);
  const [filter, setFilter] = useState<Filter>({fieldId: 0, recent: false, authorId: 0, search: ""});
  const [isGetting, setIsGetting] = useState<boolean>(false);
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  //const [sortMode, setSortMode] = useState<boolean>(false);
  const navigate = useNavigate();

  const edit = (item) => {
    //open a page to edit item
    navigate(`/admin/lesson/${item.id}`); 
  };
 
  const changePublishStat = async (item, stat) => {
             try {

           setIsGetting(true);
           const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/change-lesson-status`, {
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                lessonId: item.id,
                status: stat,
                              })
          });
         if (!response.ok) {
          alert("Error! The publish status of the lesson is not changed. You can try again.");
          return;
          }
        const result = await response.json();
        if(result.success){
          setLessons(prev => prev.map(le => (le.id == item.id)? {...le, status: stat} : le));  //{...prev, status: stat}
        }  
       } catch {} finally {setIsGetting(false);}; 
  };
 
  const remove = async (item) => {
    //
    const confirmed = window.confirm("Are you sure to archive the lesson?");
       if (confirmed) {
         try {

           setIsGetting(true);
           const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/archive-lesson`, {
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                lessonId: item.id,
                              })
          });
         if (!response.ok) {
          alert("The lesson is not archived. You can try again.");
          return;
          }
        const result = await response.json();
        if(result.success){
          //setLessons(lessons.filter(le => le.id != item.id));
          setLessons(prev => prev.map(le => le.id == item.id ? {...le, status: "archived"} : le));
        }
          
       } catch {} finally {setIsGetting(false);}; 
         } 
    };

    const unRemove = async (item) => {
    const confirmed = window.confirm("Are you sure to return the lesson?");
       if (confirmed) {
         try {

           setIsGetting(true);
           const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/unarchive-lesson`, {
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                lessonId: item.id,
                              })
          });
         if (!response.ok) {
          alert("The lesson is not un archived. You can try again.");
          return;
          }
        const result = await response.json();
        if(result.success){
          setLessons(prev => prev.map(le => le.id == item.id ? {...le, status: "raw"} : le));
        }
          
       } catch {} finally {setIsGetting(false);}; 
         } 
    };

    useEffect(()=>{
     const getFields = async ()=>{
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
           setFields(fieldsData.fields);
           setSelectedField(fieldsData.fields[1]);

        } catch {} finally {}
        }
    getFields();

  }, []);

  useEffect(()=>{
      const getLessonsByField = async (f) => {
          try {

           setIsGetting(true);
           const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-lessons-cards-by-field`, {
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                fieldId: f.id,
                recent: filter.recent, 
                authorId: filter.authorId,
                search: filter.search,
                              })
      });
      if (!response.ok) {
        return;
          
          }
      const result: LessonItem[] = await response.json();
      setLessons(result);
          
    } catch {} finally {setIsGetting(false);};
    };

    if(selectedField){
      getLessonsByField(selectedField);
    }
    

  }, [selectedField]);

      const changeLessonAccess = async (item, access) => {
    const confirmed = window.confirm("Are you sure to change the lesson access?");
       if (confirmed) {
         try {

           setIsGetting(true);
           const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/change-access-lesson`, {
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                fieldId: selectedField.id,
                lessonId: item.id,
                access: access,
                              })
          });
         if (!response.ok) {
          alert("The lesson access is not changed. You can try again.");
          return;
          }
        const result = await response.json();
        if(result.success){
          setLessons(prev => prev.map(le => le.id == item.id ? {...le, is_open: access} : le));
        }
          
       } catch {} finally {setIsGetting(false);}; 
         } 
    };

  


    /*const sortItem = (item, order_val) => {
      //first check that all orders are integer and are not same. 
      setLessons(prev => 
        prev.map(le => (le.id == item.id)? {...le, order: order_val} : le));

    };*/

  /*const sortLessons = async () => {
    //send a fetch to update lessons orders
             try {
           const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-lessons-orders`, {
             method: "POST",
             headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({
                fieldId: selectedField.id,
                lessons: lessons, })
      });
      if (!response.ok) {
        return;
          
          }
      const result = await response.json();
      if(result.sucess){

        //sort the list in front end by order

      }
          
    } catch {} finally {};
  };*/

  /*const setLessonOrders = () => {
    setSortMode(!sortMode);
  };*/



if (!user || user.type !== "admin") {
    return (<div>You do not have access to this page!</div>);
  }

return <>
<div className="flex border-1 border-black-100 px-4 py-8 w-full">
  <div className="flex flex-col border-1 border-green-300 h-screen w-[20%]">
    <div className="flex flex-col w-full px-2 py-2 mt-2">
      {fields.slice().sort((a, b) => a.id - b.id)
      .map((item, index)=>(<div key={item.id} className={`flex w-full px-2 
      py-2 mt-2 text-xs hover:text-blue-500
      ${selectedField?.id === item.id ? "font-bold hover:text-black-500" :
       "hover:text-blue-500"} hover:cursor-pointer`}
        onClick={()=>{setSelectedField(item);}}>{item.name}</div>))}
    </div>
  </div>
  <div className="flex flex-col w-[80%]"> 
    {lessons.length > 0 && lessons.slice().sort((a, b) => a.id - b.id)
    .map((item, index) => {return(<div key={item.id} 
      className="flex">
      <LessonCard item={item} onEditi={(i) => edit(i)} 
        onPublishi={(i) => changePublishStat(i, 'published')}
        onUnPublishi={(i) => changePublishStat(i, 'raw')}
        onRemovei={(i) => remove(i)}
        onUnRemovei={(i) => unRemove(i)}
         onChangeOpen={(i, access)=>changeLessonAccess(i, access)}/>
    </div>);})}
  </div>
</div>
</>;



};

export default MyLessons;
