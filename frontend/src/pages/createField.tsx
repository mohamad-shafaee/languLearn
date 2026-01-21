import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import CustomObjSelect from "../components/customObjSelect";
import { Pencil, Edit, Save } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Field = {
  id: number | null;
  name: string | null;
  author_id: number | null;
  img_path: string | null;
  description: string | null;
};
 
const CreateField: React.FC = () => {
  const { fieldId } = useParams();
	const { user, token } = useAuth();
  const imgFieldRef = useRef(null);
  const nameFieldRef = useRef(null);
  const descFieldRef = useRef(null);
  const [field, setField] = useState<Field>({author_id: user.id, img_path: ""});
  const [fields, setFields] = useState<Field[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  const [refreshField, setRefreshField] = useState<boolean>(false);
  const navigate = useNavigate();
  

      const requestAndSetFieldId = async () => {
      try {
       setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/take-field-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({authorId: user.id,})
      });
      if (!response.ok) { return; }
      const result = await response.json();
      if(result.success){
          navigate(`/admin/field/${result.id}`, { replace: true });
      } 
    } catch {} finally {setIsSubmitting(false);};
  };

  const newField = () => {
    navigate(`/admin/field/create`, { replace: true }); 
  }; 


  useEffect(() => {

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
           setFields(fieldsData.fields.map(item => ({id: item.id, name: item.name,
       author_id: item.author_id, img_path: `${item.img_path}?t=${Date.now()}`,
        description: item.description})));

        } catch {} finally {}
        }

        getFields();
  }, [refreshList]);

  useEffect(() => { 

    const getField = async () => {
         try {
       //setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({fieldId: fieldId,})
      });
      if (!response.ok) { return; }
      const result = await response.json();
      //setField(result.field);
      setField({id: result.field.id, name: result.field.name,
       author_id: result.field.author_id, img_path: `${result.field.img_path}?t=${Date.now()}`,
        description: result.field.description});

    } catch {} finally {};
    };

    if(fieldId == 'create'){
    requestAndSetFieldId();
    }
    else if (Number.isInteger(Number(fieldId))){
        getField(); 
    } 
  }, [fieldId, refreshField]);

    const submitField = async () => {
      if(field.name == ' ' || field.name == ''){
        alert("Please fill name of the field");
        return;
      }

      try {
        setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({fieldId: field.id, 
                              authorId: user.id,
                              name: field.name,
                              description: field.description ?? "", 
                              })
      });
      if (!response.ok) {
        return; 
          }
      const result = await response.json();
      setRefreshList(!refreshList);
      
    } catch {} finally {
      setIsSubmitting(false);
    };
    };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("authorId", user.id);
    formData.append("fieldId", field.id);
    try {
      setIsSubmitting(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-field-image`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   // Do NOT set 'Content-Type' manually when sending FormData
        },
        body: formData,
      });
      
      if (!res.ok) {
      alert("Failed to upload image.");
      } 

      const data = await res.json();
      setField(prev => ({...prev, img_path: `${data.imageUrl}?t=${Date.now()}`}));
      setRefreshList(!refreshList);

    } catch (err) {
      alert("In catch, failed to upload image.");
    } finally{setIsSubmitting(false);}
    };
 
  const selectFieldImage = () => {
    imgFieldRef.current.click(); // Open file picker
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: validate file type / size
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const maxSize = 3 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
        alert("File size must be less than 3 MB.");
         return;
      }

    if(field.id){
      uploadImage(file);
    } else {
      alert("Field is not saved. Please Try again.");
    }

  }; 

  const editField = (item) => {navigate(`/admin/field/${item.id}`, { replace: true });};
  const removeField = async (item) => {
    const confirmed = window.confirm("Are you sure to remove the field " + item.name);
  if (confirmed) {
    try {
        setIsSubmitting(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/remove-field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({fieldId: item.id, 
                              authorId: user.id, 
                              })
      });
      if (!response.ok) {
        return; 
          }
      const result = await response.json();
      // if it is not possible to remove ...
      if(!result.success){
        alert(result.message);
        return;
      }
      setRefreshList(!refreshList);
      if(item.id == field.id){
        newField();
      }
      
    } catch {} finally {
      setIsSubmitting(false);
    };

  }
  };
 
	if (!user || user.type !== "admin") {
    return <div>You do not have access to this page!</div>;
  }

   return <div className="flex w-full"><div className="flex justify-center
    items-center px-2 py-4 flex-col w-1/3">
    <div className="flex mt-8 w-36 h-36 relative border-1 border-blue-500">
        <img src={field.img_path ?? ""} alt="Field image"
          className="w-36 h-36 rounded-full mr-2"/>
          {!isSubmitting && (<div className={`absolute bottom-1 right-1 ${
    isSubmitting ? "pointer-events-none opacity-50" : "hover:cursor-pointer"
  }`} onClick={selectFieldImage}>
            <Edit className="hover:shadow hover:cursor-pointer" size={24} /></div>)}
            <input type="file" ref={imgFieldRef} className="hidden" 
              accept="image/*" onChange={handleImageSelect}/>
      </div>
    <div className="flex flex-col p-4 mt-4 w-full items-center border-1 rounded-md border-gray-500">
      <input type="text" ref={nameFieldRef}
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={field.name} onChange={(e) => setField(prev => ({...prev,
                name: e.target.value,}))} placeholder="Enter a field name" disabled={isSubmitting}/>
      <textarea ref={descFieldRef} 
        className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={field?.description}
                onChange={(e) => setField(prev => ({...prev,
                description: e.target.value,}))}
                 placeholder="Describe this field" rows="4" cols="50"  disabled={isSubmitting}></textarea>   
    </div>
<div className="flex w-full items-center justify-center">
  <button type="submit" className="flex mr-4 mt-2 px-4 py-1 border-1 border-blue-500" 
              onClick={() => {submitField()}}
          disabled={isSubmitting}>{isSubmitting ? "sending..." : "Save"}</button>
          <button type="submit" className="flex mt-2 px-4 py-1 border-1 border-blue-500" 
              onClick={() => {newField()}}
          disabled={isSubmitting}>{isSubmitting ? "sending..." : "New Field"}</button>
</div>  
          <div className="flex w-full mt-6 px-4 py-1 ">Hint: you should enter a name.
           Also, you could set image and description, they could be 
            completed later in page my fields. You should not refresh the page, before saving the field.
            After save, the field will be shown in the fields list in my field page (for edit, remove,...)
            and all other pages in fields lists.</div>      
   </div>
   <div className="flex flex-col w-2/3 px-2 py-4">
     {fields.length > 0 && fields.map((item, index)=>{ return(
      <div key={item.id} className="flex border-1 border-gray-500 rounded-md">
        <div className="flex items-center justify-center w-8 bg-gray-100 text-blue-500">{index + 1}</div>
        <div className="flex w-12 h-12"><img src={item.img_path ?? ""} alt="Field Image"
          className="flex w-12 h-12 rounded-md ml-2 mt-4"/></div>
    <div className="flex flex-col py-2 px-4 w-[50%] ">
      <div className="flex w-full pb-2 border-b-1">{item.name}</div>
      <div className="flex w-full text-xs bg-gray-50">{item.description}</div>
    </div>
    <div className="flex flex-col w-[30%] ">
      <div className="flex w-fit text-xs px-2 py-1 my-1 border-2 border-gray-300
       rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => editField(item)}>Edit</div>
      <div className="flex w-fit px-2 py-1 text-xs my-1 border-2 border-gray-300
       rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => removeField(item)}>Remove</div>
     </div></div>);})}
   </div>
 </div>;

}

export default CreateField;