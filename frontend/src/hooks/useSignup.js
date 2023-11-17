import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("response->",response);
   
    //in order to get JSON data we have to use response.json()
    const json = await response.json();
    console.log("json->",json);

    if (!response.ok){
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // save the user to local storage
       //json variable is in object so we have to JSON.stringify it as we store strings in localstorage
      localStorage.setItem("user", JSON.stringify(json));

      // update the auth context
      dispatch({ type: "LOGIN", payload: json });

      // update loading state
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
