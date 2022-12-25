import jwtDecode from "jwt-decode";

const accessTokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

const getUser = async () => {
  const token = await getAccessToken();
  return token ? jwtDecode(token) : null;
};

const storeAccessToken = async (token) => {
  try {
    await localStorage.setItem(accessTokenKey, token);
  } catch (error) {
    console.log("Error storing access token", error);
  }
};

const storeRefreshToken = async (token) => {
  try {
    await localStorage.setItem(refreshTokenKey, token);
  } catch (error) {
    console.log("Error storing refresh token", error);
  }
};

const storeTokens = async (accessToken, refreshToken) => {
  await storeAccessToken(accessToken);
  await storeRefreshToken(refreshToken);
};

const removeAccessToken = async () => {
  try {
    await localStorage.removeItem(accessTokenKey);
  } catch (error) {
    console.log("Error removing access token", error);
  }
};

const removeRefreshToken = async () => {
  try {
    await localStorage.removeItem(refreshTokenKey);
  } catch (error) {
    console.log("Error removing refresh token", error);
  }
};

const removeTokens = async () => {
  await removeAccessToken();
  await removeRefreshToken();
};

const getAccessToken = async () => {
  try {
    return await localStorage.getItem(accessTokenKey);
  } catch (error) {
    console.log("Error getting access token", error);
  }
};

const getRefreshToken = async () => {
  try {
    return await localStorage.getItem(refreshTokenKey);
  } catch (error) {
    console.log("Error getting refresh token", error);
  }
};

const authStorage = {
  getUser,
  getAccessToken,
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  removeTokens,
  storeAccessToken,
  storeRefreshToken,
  storeTokens,
};

export default authStorage;
