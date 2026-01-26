import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../auth";
import { useSearchParams } from "react-router-dom";

type Plan = {
  id: number;
  name: string;
  color: string;
  fields: number;
  price: number;
  currency: string;
  interval: number;
  description: string;
  provider: string;
  provider_plan_id: number | null;

};

type Subscription = {
  id: number;
  plan_name: string;
  ends_at: string;

};


const PremiumPanel: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status"); // "failed" or "success"
  const [style, setStyle] = useState<string>("");
  const { user, token } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [arePlansLoading, setArePlansLoading] = useState<boolean>(true);
  const [areSubscriptionsLoading, setAreSubscriptionsLoading] = useState<boolean>(true);
  //const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const getSubscriptions = async ()=>{
      try {
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-subscriptions-details`, {
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
      setSubscriptions(result.subscriptions);
    } catch {} finally {setAreSubscriptionsLoading(false);};
    };

  useEffect(() => {
    if (status === "failed") {
      setMessage("Your payment failed or was cancelled!");
      setStyle("failed");
    }

    if (status === "success") {
      setMessage("Thank you! Your payment was successful. Now you can enjoy as a premium user.");
      setStyle("success");

      getSubscriptions();

    }
  }, [status]);

  useEffect(() => {
  if (message == "") return;

  const timer = setTimeout(() => {
    setMessage("");
  }, 20000);

  return () => clearTimeout(timer);
}, [message]);

  useEffect(()=>{
    const getPlans = async ()=>{
      try {
       const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/get-user-plans-details`, {
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
      setPlans(result.plans);
    } catch {} finally {setArePlansLoading(false);};

    };
    

    getPlans();
    getSubscriptions();
  }, []);

  const openGate = async (p) => {

  try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/create-payment`, {
         method: "POST",
         headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({plan: p,})
      });

    const data = await response.json();

    if (data.link) {
      window.location.href = data.link; //redirect to provider
       } else { 
        setMessage("Your payment link is not created!");
        setStyle("failed");

      }
     } catch (err) {
    //console.error(err);
   }
 };







  return (
    <div className="flex flex-col w-full">
      {message !== "" && (<div className={`flex w-full
       px-4 py-2 items-center justify-center font-bold
       rounded-md border-2 ${style == "success" ? "text-green-700 bg-green-200 border-green-500" : 
       "text-red-700 bg-red-200 border-red-500" }`}>{message}</div>)}
      <div className="flex w-full">{user.name}</div>
      <div className="flex w-full">{subscriptions.length > 0 
      && (subscriptions.map((item, index)=>(<div key={item.id}
       className="flex flex-col w-full">
        <div className="flex w-full">
          
          <div className="flex w-full">{item.plan_name}</div>
        </div>
        <div className="flex w-full">
          <div className="flex w-full px-2 py-1">Expiration</div>
          <div className="flex w-full px-2 py-1">{item.ends_at}</div>
        </div>
      </div>)))}</div>
      


      <div className="flex justify-center mt-8 w-full">
        {plans.length > 0 && plans.map((plan, ind)=> (<div key={plan.id} 
          className="flex flex-col relative min-h-100 w-72 mx-4 border-4
         rounded-lg hover:cursor-pointer hover:shadow-lg 
         hover:bg-[var(--plan-gradient)] transition-all" 
          style={{ borderColor: plan.color, '--plan-color': plan.color,
          background: `linear-gradient(180deg, ${plan.color}, #fff)`,
         '--plan-gradient': `linear-gradient(1800deg, ${plan.color}, #fff)`}}>
         <div className="flex w-full justify-center mt-2 px-2 my-2 text-lg font-bold shadow-md">{""}</div>
          <div className="flex w-full justify-center mt-2 px-2 my-2 text-lg font-bold shadow-md">{plan.name}</div>
          <div className="flex w-full px-2 justify-center items-center py-2 px-2 my-2 ">
            <div className="flex py-1 text-lg font-bold">{plan.interval}</div>
            <div className="flex py-1 ml-2 text-xs">Months</div>
          </div>
          <div className="flex w-full justify-center items-center">
            <div className="flex w-fit text-lg font-bold">{plan.price}</div>
            <div className="flex w-fit ml-2 text-xs">{plan.currency}</div>
          </div>
          <div className="flex w-full px-2 py-1">{plan.description}</div>

          <div className="flex absolute bottom-4 left-25 justify-center hover:shadow-md border-2
          rounded-md text-[#fff] hover:cursor-pointer hover:text-green-700 px-4 py-2"
          style={{ borderColor: plan.color, '--plan-color': plan.color,
          background: plan.color,}} onClick={()=>openGate(plan)}>Start</div>


        </div>))}
      </div>


    </div>
  );
};

export default PremiumPanel;
