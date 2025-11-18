import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
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
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

 

  // Fetch user when app starts (if session cookie/token is valid)
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    if(savedToken != null && savedToken != ""){setToken(savedToken);}  /*double save with loginWithToken()*/

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
                setUser(null);
                return;
           }

           if (!userResponse.ok) throw new Error("Not authenticated");

           const userData = await userResponse.json();
           setUser(userData.user); } catch {
        setUser(null); } finally {
        setLoading(false);
      }
    };
    

     if(token != null){fetchUser();} else {setLoading(false);}
  }, []); 

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

      if (response.status === 401) {
        return { success: false, errors: ["Invalid Token!"] };
      }

      if (!response.ok) {
        return { success: false, errors: ["Something went wrong"]};
      }

      const data = await response.json();
      if(data.message == "registered"){
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("auth_token", data.token);
        window.location.href = "/profile";
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
          if (!response.ok) {
            throw new Error("Invalid credentials");
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
    
          }
    } catch {
           setUser(null);
           setToken(null);
           localStorage.setItem("auth_token", null);    
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

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
