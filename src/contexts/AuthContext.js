import React, {createContext, useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={{currentUser, loading}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
