import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
//import type { LessonItem } from "../types";
import CustomObjSelect from "../components/customObjSelect";

type Field = {
  id: number;
  name: string;
};
 
export default function FieldSelectot(props) {
  const selectFieldRef = useRef(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  
  

const statusStyles = {
  applied: "bg-green-100 border-green-200",
  notapplied: "bg-pink-100 border-pink-200",
  raw: "text-blue-700 bg-blue-100 border-blue-200",
};
 
  return (
    <div className="flex flex-col px-1 py-4 px-4 w-full rounded-md border-1 border-gray-300">
      <div className="flex flex-wrap my-4">
   {props.selectedFields.length > 0 && props.selectedFields.map((item, index)=>{return(<div key={item.id}
    className="flex px-4 py-2 mr-2 mb-2 border-2 border-gray-300 rounded-md bg-gray-100">
     <div className="flex w-fit">{item.name}</div>
     <div className="flex ml-4 w-fit" onClick={()=>props.onRemoveField(item)}>
      <X size={24} className="text-black hover:font-bold hover:text-red-500 transition-colors cursor-pointer"
       /></div></div>)}) }
   </div>
    <div className="flex w-full">
      <div className="flex w-[80%]">
      <CustomObjSelect className="flex bg-[#fff] mt-4 px-2 py-1 w-full" 
            ref={selectFieldRef}
            options={props.fields} name="field"
            value={selectedField?.name ?? ""}
            onChange={(opt)=>{
              setSelectedField(opt);
              }}
            placeholder="Select A Field"
            arrowSize="24"/></div>
            <div className="flex ml-2 px-4 py-2 w-[20%] hover:cursor-pointer hover:bg-gray-50 rounded-md border-1 border-gray-300" onClick={()=>{
              props.onAddField(selectedField);
              }}>Add</div>
          </div>
      </div>


        );
}
 