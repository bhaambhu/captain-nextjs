import { create } from "apisauce";
import jwtDecode from "jwt-decode";
import authStorage from "./auth/authStorage";
import routes from "../config/routes";
import APIEndpoints from "../config/APIEndpoints";
// import endpoints from "./endpoints";

const simulateDelays = false;
const maxDelay = 1000;

// const baseURL = 'http://127.0.0.1:8000/api/'
const baseURL = "https://captain-django-production.up.railway.app/api/";

const apiSauceClient = create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    // Authorization: localStorage.getItem('access_token') ? 'JWT ' + localStorage.getItem('access_token') : null,
    "Content-Type": "application/json",
  },
});

apiSauceClient.addAsyncRequestTransform(async (request) => {
  console.log(request);
  if (simulateDelays)
    await new Promise((r) =>
      setTimeout(r, Math.floor(Math.random() * maxDelay) + 1)
    );
  const accessToken = await authStorage.getAccessToken();
  if (!accessToken) return;
  request.headers["Authorization"] = "JWT " + accessToken;
});

apiSauceClient.axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // If error response is undefined, some other problem is there
    if (typeof error.response === "undefined") {
      alert(
        "Client.js: A server/network error occurred. " +
        "Looks like CORS might be the problem. " +
        "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    // If we got 401 Unauthorized
    if (error.response.status === 401) {

      // If we got 401 Unauthorized while trying to get refresh token, we need to login again
      if (originalRequest.url === baseURL + APIEndpoints.TOKEN_REFRESH) {
        alert(
          "Client.js : Got 401:Unauthorized even while trying to refresh token. You need to login again!"
        );
        window.location.href = routes.LOGIN;
        return Promise.reject(error);
      }

      // If we got 401 because token wasn't valid, we need to refresh the token
      if (error.response.data.code === "token_not_valid") {
        // Get refreshToken from local storage
        const refreshToken = await authStorage.getRefreshToken();

        // If local storage has refreshToken
        if (refreshToken) {

          // Extract expiry data from refresh token
          const exp = jwtDecode(refreshToken).exp;
          // exp date in token is expressed in seconds, while now() returns milliseconds:
          const now = Math.ceil(Date.now() / 1000);

          // If refresh token hasn't expired yet, use it
          if (exp > now) {
            console.log("Trying to get Refresh Token from Server");
            return apiSauceClient.axiosInstance
              .post(APIEndpoints.TOKEN_REFRESH, { refresh: refreshToken })
              .then((response) => {
                console.log("Succesfully got Refresh Token");
                // Store new access and refresh tokens in local storage
                authStorage.storeTokens(
                  response.data.access,
                  response.data.refresh
                );

                apiSauceClient.axiosInstance.defaults.headers["Authorization"] =
                  "JWT " + response.data.access;
                originalRequest.headers["Authorization"] =
                  "JWT " + response.data.access;

                return apiSauceClient.axiosInstance(originalRequest);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            // else we need to login again
            console.log("Refresh token expired too, need to login again.");
            window.location.href = routes.LOGIN;
            return Promise.reject(error);
          }
        } else {
          // If local storage doesn't have refresh token we need to login again
          console.log(
            "Refresh token wasnt even available in local storage. Need to login again."
          );
          window.location.href = routes.LOGIN;
          return Promise.reject(error);
        }
      }

      // If we got 401 due to other reasons, we simply aren't allowed to access this URL
      return Promise.reject(error);
    }

    if (error.response.status === 403) {
      // alert("You don't have enough permissions to access this URL");
      window.location.href = routes.HOME;
      return Promise.reject(error);
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default apiSauceClient;
