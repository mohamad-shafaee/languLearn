import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";


 
export default function LessonUserCard(props) {
  
  
  

const statusStyles = {
  published: "bg-green-50 border-2 border-green-200",
  raw: "bg-pink-50 border-2 border-pink-200",
};
 
  return (<div className={`flex px-2 w-full rounded-md ${statusStyles[props.item.status]}`}>
    </div>);
}
 