import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function CustomSelect({ options, value, onChange, placeholder, arrowSize }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (<div className="relative w-full" ref={ref}>
      {/* Selected Box */}
      <div onClick={() => setOpen((o) => !o)} className="bg-white w-full border border-gray-300 rounded px-2 py-2 text-sm cursor-pointer
          flex justify-between items-center">
        <span>{value || placeholder || "Select an option"}</span>
        <span className="text-gray-500"><ChevronDown size={arrowSize} color="green"/></span>
      </div>

      {/* Dropdown */}
      {open && (<div className="absolute w-full left-0 right-0 mt-1 bg-white border rounded shadow z-10 max-h-60 overflow-y-auto">
          {options.map((opt) => (<div key={opt} onClick={() => { onChange(opt);
                setOpen(false);}} className="px-2 py-2 text-sm cursor-pointer hover:bg-gray-100">{opt}</div>
          ))}</div>
      )}
    </div>
  );
}
