import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const UserWorking: React.FC = () => {
  const [userType, setUserType] = useState<string | null>(null);
  const [userTier, setUserTier] = useState<string | null>(null);



  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  useEffect(()=>{
    initialize(id);
  },[id]);

  const initialize = (userId: number | null) => {
    if(!userId) return;
    



  };
  return (
    <div className="w-full ">{id && <div className="w-full ">The working page</div>}
    {!id && <div>Missing user id!</div>}</div>
  
  );
};

export default UserWorking;
