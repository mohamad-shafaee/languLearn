import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
//import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Pencil, Edit, Save } from "lucide-react";
import defaultUser from "../assets/images/default-user.png";
import LoadingDots from "../components/loadingDots";
import CustomSelect from "../components/customSelect";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";
import { useNavigate } from "react-router-dom";


interface UserInfo {
  img: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  education: string | null;
  education_level: string | null;
  profession: string | null;
  native_language: string | null;
  gender: string | null;
  birth_date: string | null;
  country: string | null;
  city: string | null;
  public_profile: boolean | null;
  type: string | null;
  user_tier: string | null;
}

const UserProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [userInformation, setUserInformation] = useState<UserInfo | null>(null);
  //const [searchParams] = useSearchParams();
  //const id = searchParams.get("id");
  const { id } = useParams();
  const [owner, setOwner] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const educationInputRef = useRef(null);
  const educationLevelInputRef = useRef(null);
  const professionInputRef = useRef(null);
  const nativeLangInputRef = useRef(null);
  const countryInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const genderInputRef = useRef(null);
  const birthDateInputRef = useRef(null);
  const publicProfileInputRef = useRef(null);
  const [nameLoading, setNameLoading] = useState<boolean | null>(null);
  const [emailLoading, setEmailLoading] = useState<boolean | null>(null);
  const [phoneLoading, setPhoneLoading] = useState<boolean | null>(null);
  const [educationLoading, setEducationLoading] = useState<boolean | null>(null);
  const [educationLevelLoading, setEducationLevelLoading] = useState<boolean | null>(null);
  const [professionLoading, setProfessionLoading] = useState<boolean | null>(null);
  const [nativeLangLoading, setNativeLangLoading] = useState<boolean | null>(null);
  const [countryLoading, setCountryLoading] = useState<boolean | null>(null);
  const [cityLoading, setCityLoading] = useState<boolean | null>(null);
  const [genderLoading, setGenderLoading] = useState<boolean | null>(null);
  const [birthDateLoading, setBirthDateLoading] = useState<boolean | null>(null);
  const [publicProfileLoading, setPublicProfileLoading] = useState<boolean | null>(null);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const navigate = useNavigate();
  const educationLevels = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
   ];

  const genders = [
  "Male",
  "Female",
  "other",
   ];

   const profiles = [
  "Public",
  "Private",
   ];

  const { setUser } = useAuth();

  useEffect(() => {
    if (userInformation?.birth_date) {
      const dateObj = parse(userInformation?.birth_date, "yyyy-MM-dd", new Date());
      setBirthDate(dateObj);
      //setBirthDate(new Date(userInformation.birth_date));
    }
  }, [userInformation?.birth_date]);

  useEffect(()=>{

    const fetchUserData = async (uid) => {
        await takeUserInfo(uid);
    };
    fetchUserData(id);
    if(id == user.id){
      setOwner(true);
    }

  },[id, token]);

  useEffect(()=>{
    switch(editMode){
    case "name":
      nameInputRef.current?.focus(); // focus

      break;
    case "email":
      emailInputRef.current?.focus(); // focus

      break;

    case "phone":
      phoneInputRef.current?.focus();

    case "education":
      educationInputRef.current?.focus();

    case "educationlevel":
      educationLevelInputRef.current?.focus();

    case "profession":
      professionInputRef.current?.focus();

    case "nativeLang":
      nativeLangInputRef.current?.focus();

    case "country":
      countryInputRef.current?.focus();

    case "city":
      cityInputRef.current?.focus();

    case "gender":
      genderInputRef.current?.focus();

    case "birthdate":
      //birthDateInputRef.current?.focus();

    case "publicprofile":
      publicProfileInputRef.current?.focus();

      break;
    }


    
  }, [editMode]);


  const turnLoading = (key, show)=>{
    switch(key){
       case "name":
      setNameLoading(show);

      break;
    case "email":
      setEmailLoading(show);

      break;

    case "phone":
      setPhoneLoading(show);

    case "education":
      setEducationLoading(show);

    case "education_level":
      setEducationLevelLoading(show);

    case "profession":
      setProfessionLoading(show);

    case "native_language":
      setNativeLangLoading(show);

    case "country":
      setCountryLoading(show);

    case "city":
      setCityLoading(show);

    case "gender":
      setGenderLoading(show);

    case "birth_date":
      setBirthDateLoading(show);

    case "public_profile":
      setPublicProfileLoading(show);

      break;
    }
  };

  const saveUserData = async (key: string, value: any) => {

      if(value == userInformation?.[key]){
      setEditMode(null);
      return;
      }

      turnLoading(key, true);
      try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/edituser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({editorId: user.id,
                              key: key,
                              value: value,
                              })
      });
      if (!response.ok) {
            return { success: false, errors: ["Something went wrong!"]};
          }
      const result = await response.json();
      if(result.success){
        setUserInformation(prev => {
          if (!prev) return prev; // do nothing
          return {...prev, [key]: value,};
        });
        setEditMode(null);
      }
    } catch {
    } finally {
      turnLoading(key, false);
      if(key == "name"){
        setUser({...user, name: value});
      }
      if(key == "email"){
        setUser({...user, email: value});
      }
    } 
  };

  const editUserImage = () => {
    fileInputRef.current.click(); // Open file picker
  };

  const handleFileChange = async (e) => {
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
    // Upload to server
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/upload-user-image`, {
        method: "POST",
        headers: {
                   Authorization: `Bearer ${token}`,
                   // Do NOT set 'Content-Type' manually when sending FormData
        },
        body: formData,
      });
      const data = await res.json();

    if (res.ok && data.success) {
        // Update the img src to the new image URL
        setUserInformation(prev => {
          if (!prev) return prev; // do nothing
          return {...prev, img: `${data.imageUrl}?t=${Date.now()}`,};
        });

      } else {
        console.error("Upload failed:", data.message);
        alert("Failed to upload image.");
      }
    } catch (err) {
      //console.error("Error uploading image:", err);
      alert("Failed to upload image.");
    }
  };

  const takeUserInfo = async (userId) => {
    if(!user || !token) return;

        try { 
           const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/userdata/${userId}`, {
           method: "GET",
           //credentials: "include",
           headers: { 
                      "Authorization": `Bearer ${token}`, //send token here
                      Accept: "application/json" 
                    },
            });

           if (!userResponse.ok)  return;

           const userData = await userResponse.json();
           setUserInformation(prev => ({
                     ...prev,
                     ...userData   // merge API result
                }));
            } catch { } finally { }



  };

  const saveAndShowBirthDate = async (date) => {
    const formatted = format(date, "yyyy-MM-dd");
    if(formatted == userInformation?.birth_date){
      setEditMode(null);
      return;
      }
    turnLoading('birth_date', true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/edituser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({editorId: user.id,
                              key: 'birth_date',
                              value: formatted,
                              })
      });
      if (!response.ok) {
            return { success: false, errors: ["Something went wrong!"]};
          }
      const result = await response.json();
      if(result.success){
        setBirthDate(date);
        setUserInformation(prev => {
          if (!prev) return prev; // do nothing
          return {...prev, birth_date: formatted,};
        });
        setEditMode(null);
      }
    } catch {} finally {turnLoading('birth_date', false);}
  };

  const goToPage = (e, page) => {
    navigate("/"+ page);
  };


  return (
    <div className="w-full ">
    { id && (owner || userInformation?.public_profile) && <> 
    <div className="flex gap-4 w-full border-2 border-red-500 mt-4">
      <div className="flex w-36 h-36 relative border-1 border-blue-500">
        <img src={userInformation?.img || defaultUser} alt="user image"
          className="w-36 h-36 rounded-full mr-2"/>
          {owner && <div className="absolute bottom-1 right-1" onClick={editUserImage}>
            <Edit className="hover:shadow hover:cursor-pointer" size={24} /></div>}
            {owner && <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>}
      </div>

      <div className="flex flex-col w-100 border-r-3 border-gray-500 mt-4 pr-4">
        
        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">NAME</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "name") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.name}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("name")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "name") && <div className="flex w-full relative">
             {owner && (<> <input type="text" ref={nameInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.name}/>
                <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("name", nameInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {nameLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row py-2 px-2 w-full">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">EMAIL</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "email") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.email}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("email")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "email") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={emailInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.email}/>
               <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("email", emailInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {emailLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">PHONE</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "phone") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.phone}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("phone")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "phone") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={phoneInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.phone}/>
               <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("phone", phoneInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {phoneLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">EDUCATION</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "education") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.education}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("education")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "education") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={educationInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.education}/>
              <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("education", educationInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {educationLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">EDUCATION LEVEL</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "educationlevel") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.education_level}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("educationlevel")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "educationlevel") && <div className="flex w-full relative">
              {owner && ( <><CustomSelect className="flex bg-[#fff] border-2 border-red-500 px-2 py-1 w-full" ref={educationLevelInputRef}
                  options={educationLevels}
                  value={userInformation?.education_level}
                  onChange={(opt)=>{
                    saveUserData("education_level", opt);
                    setUserInformation(prev => {
                   if (!prev) return prev; // do nothing
                   return {...prev, education_level: opt,};
                    });}}
                  placeholder="Select education level"
                  arrowSize="0"/></>)}
              {educationLevelLoading && <div className="absolute right-1/2 top-1/4 z-12"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">PROFESSION</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "profession") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.profession}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("profession")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "profession") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={professionInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.profession}/>
              <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("profession", professionInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {professionLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">NAITIVE LANGUAGE</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "nativeLang") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.native_language}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("nativeLang")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "nativeLang") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={nativeLangInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.native_language}/>
              <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("native_language", nativeLangInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {nativeLangLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>
      
        
      </div>

      <div className="flex flex-col w-100 border-r-3 border-gray-500 mt-4 pr-4">

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">COUNTRY</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "country") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.country}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("country")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "country") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={countryInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.country}/>
              <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("country", countryInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {countryLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">CITY</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "city") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.city}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("city")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "city") && <div className="flex w-full relative">
              {owner && (<><input type="text" ref={cityInputRef} className="flex bg-[#fff] px-2 py-1 w-full"
               defaultValue={userInformation?.city}/>
              <div className="absolute right-0 top-1/4"
               onClick={() => saveUserData("city", cityInputRef.current.value)}>
            <Save className="hover:shadow hover:cursor-pointer" size={16} /></div></>)}
              {cityLoading && <div className="absolute right-1/2 top-1/4"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">GENDER</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "gender") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.gender}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("gender")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "gender") && <div className="flex w-full relative">
              {owner && ( <><CustomSelect className="flex bg-[#fff] border-2 border-red-500 px-2 py-1 w-full" ref={genderInputRef}
                  options={genders}
                  value={userInformation?.gender}
                  onChange={(opt)=>{
                    saveUserData("gender", opt);
                    setUserInformation(prev => {
                   if (!prev) return prev; // do nothing
                   return {...prev, gender: opt,};
                    });}}
                  placeholder="Select gender"
                  arrowSize="0"/></>)}
              {genderLoading && <div className="absolute right-1/2 top-1/4 z-12"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">BIRTH DATE</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "birthdate") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.birth_date}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("birthdate")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "birthdate") && <div className="flex w-full relative">
              {owner && ( <><DatePicker className="flex bg-[#fff] border-2 border-red-500 px-2 py-1 w-full"
        selected={birthDate}
        onChange={(date) => saveAndShowBirthDate(date)}
        placeholderText="Select birth date"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        maxDate={new Date()}              // no future dates
      /></>)}
              {birthDateLoading && <div className="absolute right-1/2 top-1/4 z-12"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">PROFILE MODE</div>
          <div className="flex w-3/4 text-sm">
            {(editMode != "publicprofile") && <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.public_profile ? "Public" : "Private"}</div>
              {owner && <div className="absolute right-0 top-1/4" onClick={()=>{setEditMode("publicprofile")}}>
            <Edit className="hover:shadow hover:cursor-pointer" size={16} /></div>}
            </div>}
            {(editMode == "publicprofile") && <div className="flex w-full relative">
              {owner && ( <><CustomSelect className="flex bg-[#fff] border-2 border-red-500 px-2 py-1 w-full" ref={publicProfileInputRef}
                  options={profiles}
                  value={userInformation?.public_profile ? "Public" : "Private"}
                  onChange={(opt)=>{
                    const val = (opt == "Public" ? 1 : 0);
                    saveUserData("public_profile", val + "");
                    setUserInformation(prev => {
                   if (!prev) return prev; // do nothing
                   return {...prev, public_profile: val,};
                    });}}
                  placeholder="Select profile mode"
                  arrowSize="0"/></>)}
              {publicProfileLoading && <div className="absolute right-1/2 top-1/4 z-12"><LoadingDots /></div>}
            </div>}
          </div>
        </div>

       </div>

       <div className="flex flex-col w-100 mt-4 pr-4">

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-full mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500"><a href="#" 
              className="w-full m-0 p-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500 hover:underline"
             onClick={(e)=>goToPage(e, 'change-password-logedin-form')}>CHANGE PASSWORD</a></div>
        </div>

        <div className="flex flex-row w-full py-2 px-2">
          <div className="inline-block w-1/4 mr-0 text-[0.6rem] tracking-[2px] first-letter:text-[1rem] 
            first-letter:text-blue-500">Tier</div>
          <div className="flex w-3/4 text-sm">
            <div className="flex w-full relative">
              <div className="flex px-2 py-1 w-full">
                {userInformation?.user_tier ? userInformation?.user_tier : "---"}</div>
            </div>
          </div>
        </div>

       </div>
    </div>
<div className="flex flex-col gap-4 w-full border-2 border-red-500 mt-4 p-4 justify-center items-center">
  <div className="border-2 w-fit text-[0.8rem] border-green-500 tracking-[3px] first-letter:text-[1.4rem] 
            first-letter:text-blue-500">REPORT CARD</div>
<div className="border-2 border-green-500 w-full h-100"></div>
          </div>
</>
  }
    {!id && <div>Missing user!</div>}</div>
  
  );
};

export default UserProfile;
