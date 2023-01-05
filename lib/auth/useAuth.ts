import jwtDecode from "jwt-decode";
import { useContext } from "react";
import authStorage from "./authStorage";
import AuthContext from "./context";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const logIn = (tokensData) => {
    const accessToken = tokensData.access;
    const refreshToken = tokensData.refresh;
    const user = jwtDecode(accessToken);
    setUser(user);
    authStorage.storeTokens(accessToken, refreshToken);
  };

  const logOut = () => {
    console.log("logging out");
    setUser(null);
    authStorage.removeTokens();
  };

  // Helper methods to control page access
  const isAuthenticated = () => {
    return user ? true : false;
  }

  // Helper methods to control page access
  const isStaff = () => {
    return user?.is_staff;
  }

  // Helper methods to control page access
  const isSuperUser = () => {
    return user?.is_superuser;
  }

  // If current user is this author, or the superuser, return true
  const canAuthor = (authorID) => {
    return user?.is_superuser || (user && user?.user_id == authorID);
  }

  // Helper methods to control page access
  const isActivated = () => {
    return user?.is_active;
  }
  
  return { logIn, logOut, user, setUser, isAuthenticated, isStaff, isSuperUser, isActivated, canAuthor };
};

export default useAuth;
