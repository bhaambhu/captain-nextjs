import APIEndpoints from "../../config/APIEndpoints";
import apiSauceClient from "../apiSauceClient";

const getDataInfo = () => apiSauceClient.get(APIEndpoints.DATAINFO);

const dataInfoAPIService = {
  getDataInfo,
};
export default dataInfoAPIService;
