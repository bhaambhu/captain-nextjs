import jwtDecode from "jwt-decode";

const accessTokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

// save to storage on client side (after checking window object)
const saveToStorage = async (key, value) => {
  if(typeof window !== 'undefined') {
      return window.localStorage.setItem(key, value);
  }
}

// get from storage on client side (after checking window object)
const getFromStorage = async (key) => {
  if (typeof window !== 'undefined') {
      return window.localStorage.getItem(key);
  }
}

// remove from storage on client side (after checking window object)
const removeFromStorage = async (key) => {
  if (typeof window !== 'undefined') {
      return window.localStorage.removeItem(key);
  }
}

const getUser = async () => {
  const token = await getAccessToken();
  return token ? jwtDecode(token) : null;
};

const storeAccessToken = async (token) => {
  try {
    await saveToStorage(accessTokenKey, token);
  } catch (error) {
    console.log("Error storing access token", error);
  }
};

const storeRefreshToken = async (token) => {
  try {
    await saveToStorage(refreshTokenKey, token);
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
    await removeFromStorage(accessTokenKey);
  } catch (error) {
    console.log("Error removing access token", error);
  }
};

const removeRefreshToken = async () => {
  try {
    await removeFromStorage(refreshTokenKey);
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
    return await getFromStorage(accessTokenKey);
  } catch (error) {
    console.log("Error getting access token", error);
  }
};

const getRefreshToken = async () => {
  try {
    return await getFromStorage(refreshTokenKey);
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
