import APIEndpoints from "../../config/APIEndpoints";
import apiSauceClient from "../apiSauceClient";

const logIn = (email, password) =>
  apiSauceClient.post(APIEndpoints.LOGIN, { email, password });

const register = (userInfo) => apiSauceClient.post(APIEndpoints.REGISTER, userInfo);

const usersAPIService = { logIn, register };
export default usersAPIService;
