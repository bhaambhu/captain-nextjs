import APIEndpoints from "../../config/APIEndpoints";
import apiSauceClient from "../apiSauceClient";

const getOrphanTopics = () => apiSauceClient.get(APIEndpoints.ORPHANTOPICS);
const createTopic = (title, subject) => apiSauceClient.post(APIEndpoints.TOPICS, { title, subject });

const getTopic = (id) => apiSauceClient.get(APIEndpoints.TOPICS + id);
const updateTopic = (topicData) => apiSauceClient.put(APIEndpoints.TOPICS + topicData.id + '/', topicData);
const deleteTopic = (id) => apiSauceClient.delete(APIEndpoints.TOPICS + id);
const updateTopicSubject = (topicId, subjectId, selectedSubjectId) => apiSauceClient.patch(APIEndpoints.TOPICS + topicId + '/', { subjectId, selectedSubjectId });

const isRequirementSafe = (cTopicId, rTopicId) => apiSauceClient.post(APIEndpoints.TOPICS + cTopicId + "/requires/" + rTopicId + '/')
const addRequirement = (cTopicId, rTopicId) => apiSauceClient.patch(APIEndpoints.TOPICS + cTopicId + "/requires/" + rTopicId + '/')
const removeRequirement = (cTopicId, rTopicId) => apiSauceClient.delete(APIEndpoints.TOPICS + cTopicId + "/requires/" + rTopicId + '/')

const topicsAPIService = {
  getOrphanTopics,
  createTopic,

  getTopic,
  updateTopic,
  updateTopicSubject,
  deleteTopic,

  isRequirementSafe,
  addRequirement,
  removeRequirement,
}
export default topicsAPIService;