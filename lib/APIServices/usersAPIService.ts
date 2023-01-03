import APIEndpoints from "../../config/APIEndpoints";
import apiSauceClient from "../apiSauceClient";

const logIn = (email, password) => apiSauceClient.post(APIEndpoints.LOGIN, { email, password });

const register = (userInfo) => apiSauceClient.post(APIEndpoints.REGISTER, userInfo);

const getAllUsers = () => apiSauceClient.get(APIEndpoints.ALL_USERS);

const updateUserInfo = (userId, userInfo) => apiSauceClient.put(APIEndpoints.USER_INFO+userId+"/", userInfo);

const updateUserStaffRole = (userId, isStaff) => apiSauceClient.patch(APIEndpoints.USER_INFO+userId+"/", {isStaff})


const deleteUser = (userId) => apiSauceClient.delete(APIEndpoints.USER_INFO+userId+"/");

const usersAPIService = { logIn, register, getAllUsers, updateUserInfo, deleteUser, updateUserStaffRole };
export default usersAPIService;
