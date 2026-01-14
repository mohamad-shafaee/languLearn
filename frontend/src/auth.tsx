import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  type: string;
  is_premium: boolean;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean; 
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  requestPassReset: (email: string) => Promise<void>;
  setNewPassword: (email: string, token: string, password: string, confirmPassword: string) => Promise<void>;
  changePasswordLogedin: (email: string, oldPassword: string, password: string, confirmPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
  loading: true, 
  register: async () => {},
  login: async () => {},
  logout: () => {},
  requestPassReset: async () => {},
  setNewPassword: async () => {},
  changePasswordLogedin: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  //const [token, setToken] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(() => {
  return localStorage.getItem("auth_token");
}); 

  // Fetch user when app starts (if session cookie/token is valid)
  useEffect(() => {

    if (!token) {
    setUser(null);
    setLoading(false);
    return;
  }


    /*const savedToken = localStorage.getItem("auth_token");
    if(savedToken && !token){
      setToken(savedToken);
      return;
    }*/  /*double save with loginWithToken()*/

      const fetchUser = async () => {
        try { 
           const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
           method: "GET",
           //credentials: "include",
           headers: { //"Content-Type": "application/json",  //since GET method 
                      "Authorization": `Bearer ${token}`, //send token here
                      Accept: "application/json" 
                    },
            });
           if (userResponse.status === 401) {
               // Token invalid or expired
                localStorage.removeItem("auth_token");
                setToken(null);
                setUser(null);
                return;
           }

           if (!userResponse.ok)  return;//throw new Error("Not authenticated");

           const userData = await userResponse.json();
           setUser(userData.user);
            } catch {
                       setUser(null);
                       setToken(null);
            } finally {
                       setLoading(false);
      }
    }; 
     fetchUser();
     //if(token){fetchUser();} else {setLoading(false);}
  }, [token]); 

  // Register
  const register = async (email: string, password: string, confirmPassword: string) => {
        try{
         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register`, {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
               email: email,
               password: password,
               password_confirmation: confirmPassword
          })
      });

      if (response.status === 422) {
        const errorData = await response.json();
        const errorarray = Object.values(errorData.errors).flat();
        return { success: false, errors: errorarray };
      }

      if (!response.ok) { 
        return { success: false, errors: ["Something went wrong"]};
      }

      const data = await response.json();
      if(data.message == "registered"){
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        return { success: true, errors: []};
        //window.location.href = "/profile";
      } else {
        setUser(null);
        setToken(null);
        localStorage.setItem("auth_token", null);
      }
    } catch {
        setUser(null);
        setToken(null);
        localStorage.setItem("auth_token", null);
        return { success: false, errors: ["Something went wrong"]};
    } finally {
        setLoading(false);
      }
  }

  // Login via email & password
  const login = async (email: string, password: string) => {
    try{ 
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
          method:"POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
               email: email,
               password: password,
          })
          });
          if (response.status === 422) {
            const errorData = await response.json();
            const errorarray = Object.values(errorData.errors).flat();
            return { success: false, errors: errorarray };
          }
          if (!response.ok) {
            return { success: false, errors: ["Invalid username or password!"]};
          }
          const data = await response.json();
          if(data.token){
            const ctoken = data.token; 
            setToken(ctoken);
            localStorage.setItem("auth_token", ctoken);

            // Fetch user details after login success
             const userResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
             method: "GET",
             headers: { Accept: "application/json",
                 "Authorization": `Bearer ${ctoken}` // send token here 
               },
             });

           const userData = await userResponse.json();
           setUser(userData.user);
           return { success: true, errors: []};
          }
    } catch {
           setUser(null);
           setToken(null);
           localStorage.setItem("auth_token", null);
           return { success: false, errors: ["Something went wrong!"]};  
    } finally {
        setLoading(false);
      }
  };

  const logout = async () => {

    try{
      const savedToken = localStorage.getItem("auth_token");
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
               method: "POST",
               headers: { "Accept": "application/json",
                 "Authorization": `Bearer ${savedToken}` // send token here 
                 },
              });

      

    } catch (er) {

    }
    
    // Clear auth state ALWAYS, even if fetch fails
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    
  };

  const requestPassReset = async (email: string) => {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({email: email})
      });

      if (!response.ok) {
            return { success: false, errors: ["Something went wrong!"]};
          }
      const result = await response.json();
      if(result.status){
        return { success: true, errors: []};
      }
      if(!result.status && result.message == "invalid-user"){
        return { success: false, errors: ["This email is not related to a valid user!"]};
      }
      if(!result.status && result.message == "recently-sent"){
        return { success: false, errors: ["An Email is recently sent!",
         "You should wait "+ result.time + " minutes between two emails."]};
      }
      return { success: false, errors: ["There is a problem!"]};
      

    } catch {

    } finally {
    }

  };

  const setNewPassword = async (email: string, token:string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({email: email,
                              token: token,
                              password: password,
                              password_confirmation: confrimPassword})
      });
      if (!response.ok) {
            return { success: false, errors: ["Something went wrong!"]};
          }
      const result = await response.json();
      if(result.status){
        return { success: true, errors: []};
      }
      return { success: false, errors: ["Reset password failure!"]};
      

    } catch {

    } finally {
    }

  };

  const changePasswordLogedin = async (email, oldPassword, password, confirmPassword) => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/change-password-logedin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({email: email,
                              oldPassword: oldPassword,
                              password: password,
                              password_confirmation: confirmPassword})
      });
      if (!response.ok) {
            return { success: false, errors: ["Something went wrong!"]};
          }
      const result = await response.json();
      if(result.status){
        return { success: true, errors: []};
      }
      return { success: false, errors: ["Change password failure!"]};
    } catch {} finally {}
  };

  return (
    <AuthContext.Provider 
      value={{ user, setUser, token, setToken, loading, register, login, logout,
       requestPassReset, setNewPassword, changePasswordLogedin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
