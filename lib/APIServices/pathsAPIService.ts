import APIEndpoints from "../../config/APIEndpoints";
import apiSauceClient from "../apiSauceClient";

const getPaths = () => apiSauceClient.get(APIEndpoints.PATHS);

const createPath = (title="", about="", published=false) => apiSauceClient.post(APIEndpoints.PATHS, { title, about, published });

const getPathDetail = (id:number) => apiSauceClient.get(APIEndpoints.PATHS + id + '/');

const savePathDetail = (pathData) =>
apiSauceClient.put(APIEndpoints.PATHS + pathData.id + "/", pathData);

const deletePath = (id: number) => apiSauceClient.delete(APIEndpoints.PATHS + id + '/');

const pathsAPIService = {
  getPaths,
  getPathDetail,
  savePathDetail,
  createPath,
  deletePath,
};
export default pathsAPIService;