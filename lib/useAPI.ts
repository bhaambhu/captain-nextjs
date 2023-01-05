import { useState } from "react";
// import useAuth from "../../auth/useAuth";

const useAPI = (apiFunc) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [statusCode, setStatusCode] = useState(0);
  const [problem, setProblem] = useState("");

  // const { logOut } = useAuth();

  const request = async (...args) => {
    console.log("Sending request");
    setLoading(true);
    const response = await apiFunc(...args);
    // console.log("useApi response is ", response);
    setStatusCode(response.status);
    setError(!response.ok);
    setData(response.data);

    if (!response.ok) {
      // If it's an auth error, logout
      // if (response.status === null) return logOut();
      // Add some loggin service to log this.
      setProblem(response.problem);
    }
    setLoading(false);
    setLoadedOnce(true);
    return response;
  };

  return {
    request,
    data,
    setData,
    error,
    loading,
    problem,
    statusCode,
    loadedOnce,
  };
};

export default useAPI;
