import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};


//children prop represents App component, got by wrapping App into AuthContextProvider  
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  //setting the initial auth context 
     //problem -> page refreshes, user state gone null when still loggedin
     //solution -> user info still stored in local storage even page got refreshed so refill the user state from lclst
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {/* outputting App component */}
      {children}
    </AuthContext.Provider>
  );
};
