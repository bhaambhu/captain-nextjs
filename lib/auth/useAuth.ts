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

  return { logIn, logOut, user, setUser };
};

export default useAuth;
