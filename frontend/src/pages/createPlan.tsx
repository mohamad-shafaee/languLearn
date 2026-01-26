import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import { Edit } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Plan = {
  id: number | null;
  name: string;
  color: string;
  fields: number;
  price: number;
  currency: string;
  interval: number;
  description: string;
  provider: string; 
  provider_plan_id: number | null;
  inactivated_at: string | null;
}; 
 
const CreatePlan: React.FC = () => {
  const { planId } = useParams();
	const { user, token } = useAuth(); 
  const [plan, setPlan] = useState<Plan>({name: "", color: "", fields: 0, price: 0, currency: "",
   interval: 0, description: "", provider: ""});
  const [plans, setPlans] = useState<Plan[]>([]); 
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshList, setRefreshList] = useState<boolean>(false);
  //const [refreshPlan, setRefreshPlan] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(()=>{
    console.log("Plannnnnn: ", plan);
  }, [plan]);

    const requestAndSetPlanId = async () => {
      try {
       setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/take-plan-id`, {
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
          navigate(`/admin/plan/${result.id}`, { replace: true });
      } 
    } catch {} finally {setIsSubmitting(false);};
  };

  const isPlanStillValid = (plan) => {
    if (!plan.inactivated_at) return true;

    const inactivatedAt = new Date(plan.inactivated_at);
    const expiryDate = new Date(inactivatedAt); //to avoid mutating the original date
    expiryDate.setMonth(expiryDate.getMonth() + plan.interval);

    return (new Date() < expiryDate);
  };

  const newPlan = () => {
    navigate(`/admin/plan/create`, { replace: true }); 
  };

    const submitPlan = async () => {

      if(plan.name == ' ' || plan.name == ''){
        alert("Please fill name of the plan");
        return;
      }

      try {
        setIsSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/update-plan-by-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({ plan: plan, authorId: user.id, })
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

  useEffect(() => { 

    const getPlan = async () => {
         try {
       //setIsSubmitting(true);
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-plan-by-id-for-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({planId: planId,})
      });
      if (!response.ok) { return; }
      const result = await response.json();
      setPlan(result.plan);

    } catch {} finally {};
    };

    if(planId == 'create' && !isSubmitting){
    requestAndSetPlanId();
    }
    else if (Number.isInteger(Number(planId))){
        getPlan(); 
    } 
  }, [planId]);


  useEffect(()=>{

    const getPlans = async ()=>{
      console.log("first log");
    try { 
      setLoadingPlans(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-plans-for-admins`, {
        method: "POST",
         headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Authorization": `Bearer ${token}`, //send token here
            },
              body: JSON.stringify({ userId: user.id, })
      });
      const data = await res.json();
      if (res.ok) { 
        console.log("second log");
        setPlans(data.plans);
        
      } else {
        alert("The plans are not taken!");
        
      }
    } catch (err) {
      
    } finally{ setLoadingPlans(false); }
  };

  getPlans(); 
  }, [refreshList]);

    const editPlan = (item) => {navigate(`/admin/plan/${item.id}`, { replace: true });};
  const removePlan = async (item) => {
    const confirmed = window.confirm("Are you sure to remove the plan " + item.name);
  if (confirmed) {
    try {
        setIsSubmitting(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/remove-plan-by-admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`, //send token here
        },
        body: JSON.stringify({planId: item.id, 
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
      if(item.id == plan.id){
        newPlan();
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

    <div className="flex flex-col p-4 mt-4 w-full items-center border-1 rounded-md border-gray-500">
      <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.name ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                name: e.target.value,}))} placeholder="Enter a plan name" disabled={isSubmitting}/>
      <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.color ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                color: e.target.value,}))} placeholder="Enter a plan color" disabled={isSubmitting}/>
      <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.fields ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                fields: e.target.value,}))} placeholder="Enter fields count" disabled={isSubmitting}/>
    <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.price ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                price: e.target.value,}))} placeholder="Enter a plan price" disabled={isSubmitting}/>
    <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.interval ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                interval: e.target.value,}))} placeholder="Enter a plan interval" disabled={isSubmitting}/>
    <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.currency ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                currency: e.target.value,}))} placeholder="Enter a plan currency" disabled={isSubmitting}/>
    <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.provider ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                provider: e.target.value,}))} placeholder="Enter a plan provider" disabled={isSubmitting}/>
    <input type="text"
       className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.provider_plan_id ?? ""} onChange={(e) => setPlan(prev => ({...prev,
                provider_plan_id: e.target.value,}))}
                 placeholder="Enter a plan provider id" disabled={isSubmitting}/>
    <div className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500" >
      <div className="flex px-2 py-1">Inactivated At</div>
      <div className="flex px-2 py-1">{plan.inactivated_at ?? ""}</div>
    </div>
    <textarea  
        className="flex bg-[#fff] mt-4 px-2 py-1 w-full border-1 rounded-md border-gray-500"
               value={plan.description}
                onChange={(e) => setPlan(prev => ({...prev,
                description: e.target.value,}))}
                 placeholder="Describe this plan" rows="4" cols="50"  disabled={isSubmitting}></textarea>   
    </div> 
<div className="flex w-full items-center justify-center">
  <button type="submit" className="flex mr-4 mt-2 px-4 py-1 border-1 border-blue-500" 
              onClick={() => {submitPlan()}}
          disabled={isSubmitting}>{isSubmitting ? "sending..." : "Save"}</button>
          <button type="submit" className="flex mt-2 px-4 py-1 border-1 border-blue-500" 
              onClick={() => {newPlan()}}
          disabled={isSubmitting}>{isSubmitting ? "sending..." : "New Plan"}</button>
</div></div>
   <div className="flex flex-col w-2/3 px-2 py-4">
     {plans.length > 0 && plans.map((item, index)=>{ return(
      <div key={item.id} className="flex border-1 border-gray-500 rounded-md">
        <div className="flex items-center justify-center w-8 bg-gray-100 text-blue-500">{index + 1}</div> 
    <div className="flex flex-col py-2 px-4 w-[50%] ">
      <div className="flex w-full pb-2 border-b-1">{item.name ?? ""}</div>
      <div className="flex w-full pb-2 border-b-1">{item.price ?? ""}</div>
      <div className="flex w-full pb-2 border-b-1">{item.currency ?? ""}</div>
      <div className="flex w-full text-xs bg-gray-50">{item.description ?? ""}</div>
    </div>
    <div className="flex flex-col w-[30%] ">
      <div className="flex w-fit text-xs px-2 py-1 my-1 border-2 border-gray-300
       rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => editPlan(item)}>Edit</div>
      
{!isPlanStillValid(item) && (<div className="flex w-fit px-2 py-1 text-xs my-1 border-2 border-gray-300
       rounded-md bg-gray-100 hover:cursor-pointer
       hover:bg-gray-50" onClick={() => removePlan(item)}>Remove</div>)} 
     </div></div>);})}
   </div>
 </div>;

 }

export default CreatePlan;