import APIEndpoints from "../../config/APIEndpoints";
import apiSauceClient from "../apiSauceClient";

// const getAllSubjects = () => apiSauceClient.get(APIEndpoints.SUBJECTS);
const getRootLevelSubjects = () => apiSauceClient.get(APIEndpoints.SUBJECTS);

const getSubjectDetail = (id) => apiSauceClient.get(APIEndpoints.SUBJECTS + id);

const saveSubjectDetail = (subjectData) => apiSauceClient.put(APIEndpoints.SUBJECTS + subjectData.id + '/', subjectData);

const getSubjectChildren = (id) => apiSauceClient.get(APIEndpoints.SUBJECTS + id + '/children');

const createSubject = (name, parent) => apiSauceClient.post(APIEndpoints.SUBJECTS, { name, parent });

const deleteSubject = (id) => apiSauceClient.delete(APIEndpoints.SUBJECTS + id);

const moveSubject = (subjectId, targetId, position) => {
  return apiSauceClient.patch(APIEndpoints.SUBJECTS + subjectId + '/', { targetId, position });
}

const subjectsAPIService = {
  // getAllSubjects,
  getRootLevelSubjects,
  createSubject,
  getSubjectChildren,
  moveSubject,
  deleteSubject,
  getSubjectDetail,
  saveSubjectDetail,
};
export default subjectsAPIService;