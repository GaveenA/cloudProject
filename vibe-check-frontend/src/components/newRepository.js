import { API_URL } from "../utilities/utils";
import axios from "axios";

const USER_KEY = "user";

/* These functions manipulate the Logged user object stored lin local storage - cache */
export const setLoggedUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem(USER_KEY);
};

export const getLoggedUser = () => {
  // Extract single user data from local storage. - using 'USER_KEY'
  const data = localStorage.getItem(USER_KEY);
  // Convert data to objects.
  return JSON.parse(data);
};

/**
 * Function to make POST request and send signup user data to backend and create a new User.
 * Returned Response codes are used to determine if username or email constaints
 * failed on User create, and show appropriate errors on frontend
 * On Success: New created user object returned
 * @param {*} userData
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const submitSignup = async (userData) => {
  const LAMBDA_SIGNUP_URL = 'https://bmp2r46nm3.execute-api.us-east-1.amazonaws.com/default/create-user-lambda';
  var config = {
    method: "post",
    // url: API_URL + "/api/users/",
    url: LAMBDA_SIGNUP_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: userData,

    // method: 'post',
    // url: 'https://bmp2r46nm3.execute-api.us-east-1.amazonaws.com/default/create-user-lambda',
    // // headers: { 
    // //   'Content-Type': 'application/json'
    // // },
    // headers: {
    //   // "Accept": "*/*",
    //     // "Accept-Encoding": "gzip, deflate, br",
    //     "Content-Type": "application/json",
    //     // "Host": "tpaduyvori.execute-api.us-east-1.amazonaws.com"
    // },
    // data: userData,
  };

  try {
    console.log("Loggin in New Repository");
    console.log(config);
    let res = await axios(config);
    if (res.status == 200) {
      // code 200 if user succesfully created
      return { responseType: "success", serverResponse: res.data?.data };
    }
    if (res.status == 201) {
      // code 201 if user email constraint failed on backend - not unique
      return { responseType: "errorCode", serverResponse: "Invalid Email" };
    } else if (res.status == 202) {
      // code 201 if user - username constraint failed on backend - not unique
      return { responseType: "errorCode", serverResponse: "Invalid Username" };
    }
  } catch (err) {
    return { responseType: "failed", error: err };
  }
};

/**
 * Function to make GET request to send user Login Data to backend (as query params)
 * and confirm that username and password (hashed in backend) match a database entry,
 * and if so a success response sent back to frontend and user logged in,
 * if not login fails appropriately in frontend
 * @param {String} email
 * @param {String} password
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const submitLogin = async (email, password) => {
  const LAMBDA_URL = 'https://q94hkhwwac.execute-api.us-east-1.amazonaws.com/default/user-login-lambda-function'
  var config = {
    method: "get",
    // url: API_URL + `/api/users/login?email=${email}&password=${password}`,
    url: LAMBDA_URL  + `?email=${email}&password=${password}`,
    timeout: 10000,
    headers: {},
  };

  try {
    let res = await axios(config);
    console.log("Submit login Response");
    console.log(res);
    if (res.status == 200) {
      console.log(res.status);
      return { responseType: "success", serverResponse: res.data?.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "failed", error: err };
  }
};

/**
 * Function to send a POST request to create a post in backend with provided post attributes
 * @param {*} post
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const addPostToDb = async (post) => {
  const postReqBody = {
    parent_id: post?.parent_id,
    username: post?.username,
    date: post?.date,
    image_url: post?.image_url,
    content_body: post?.content_body,
    deleted_by_admin: post?.deleted_by_admin,
  };

  var config = {
    method: "post",
    url: API_URL + "/api/content/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: postReqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(res.status);
      return { responseType: "success", serverResponse: res?.data?.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make a DELETE request to delete a content in backend
 * @param {Int} content_id
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const deletePost = async (content_id) => {
  const reqBody = {
    content_id: content_id,
  };

  var config = {
    method: "delete",
    url: API_URL + "/api/content/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      // test for status you want, etc
      console.log(res.status);
      return { responseType: "success", serverResponse: res.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make a PATCH request to server and Update post
 * @param {*} post - Req Body contents (must contain essential Content fields - refer model)
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const updatePostInDb = async (post) => {
  const patchReqBody = {
    id: post?.id,
    username: post?.username,
    date: post?.date,
    image_url: post?.image_url,
    content_body: post?.content_body,
    deleted_by_admin: post?.deleted_by_admin,
  };

  var config = {
    method: "patch",
    url: API_URL + "/api/content/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: patchReqBody,
  };

  try {
    let res = await axios(config);
    if (res.status == 200) {
      // test for status you want, etc
      return { responseType: "success", serverResponse: res?.data?.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make GET request and retrieve user by username from server
 * @param {String} username
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const getUserFromDb = async (username) => {
  var config = {
    method: "get",
    url: API_URL + `/api/users/select/${username}`,
    timeout: 10000,
    headers: {},
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(res.status);
      return { responseType: "success", serverResponse: res.data?.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make a PATCH request and edit a user profile
 * Must send essential user fields (username etc ) to update user profile
 * - Refer model for user fields
 * @param {*} user
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const editUserProfile = async (user) => {
  var config = {
    method: "patch",
    url: API_URL + `/api/users/`,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: user,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make DELETE request to delete user account with username in req body
 * @param {String} username
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const deleteUserAccount = async (username) => {
  const reqBody = {
    username: username,
  };

  var config = {
    method: "delete",
    url: API_URL + "/api/users/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(res.status);
      return { responseType: "success", serverResponse: res.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to get all content (with nested structure - posts and comments) along
 * with the logged user interactions for username - provided in as param
 * @param {username: String} currUser
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const getAllPostsInDb = async (currUser) => {
  var config = {
    method: "get",
    url:
      API_URL +
      `/api/content/getAllPostsWithLoggedUserInteractions?username=${currUser?.username}`,
    timeout: 10000,
    headers: {},
  };

  try {
    console.log("loggin in Get posts from DB");
    console.log(currUser);
    let res = await axios(config);
    if (res.status === 200) {
      return { responseType: "success", serverResponse: res?.data?.data };
    } else {
      return { responseType: "failed", serverResponse: res?.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", serverResponse: err };
  }
};

/**
 * Function to make GET request to get content by ID with logged user interaction
 * @param {username: String} currUser
 * @param {Int} contentId
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const getContentById = async (currUser, contentId) => {
  var config = {
    method: "get",
    url:
      API_URL +
      `/api/content/getByID?id=${contentId}&username=${currUser?.username}`,
    timeout: 10000,
    headers: {},
  };

  try {
    let res = await axios(config);
    console.log(res);
    if (res.status === 200) {
      return { responseType: "success", serverResponse: res?.data?.data[0] };
    } else {
      return { responseType: "failed", serverResponse: res?.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", serverResponse: err };
  }
};

/**
 * Function to make POST request to add user interaction to a content (post or comment)
 * @param {Int} content_id
 * @param {String} username
 * @param {Boolean} interactionState
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const addInteractionToContent = async (
  content_id,
  username,
  interactionState
) => {
  console.log(content_id, username, interactionState);
  const reqBody = {
    content_id: content_id,
    username: username,
    interaction: interactionState,
  };

  var config = {
    method: "post",
    url: API_URL + "/api/content-interactions",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      return { responseType: "success", serverResponse: res.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function make a DELETE request to delete a User interaciton to content.
 * @param {Int} content_id
 * @param {String} username
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const deleteInteractionToContent = async (content_id, username) => {
  console.log(content_id, username);
  const reqBody = {
    content_id: content_id,
    username: username,
  };

  var config = {
    method: "delete",
    url: API_URL + "/api/content-interactions",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(res.status);
      return { responseType: "success", serverResponse: res.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make PATCH request to Update a user interaction to content
 * @param {Int} content_id
 * @param {String} username
 * @param {Boolean} interactionState
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const updateInteractionToContent = async (
  content_id,
  username,
  interactionState
) => {
  console.log(content_id, username);
  const reqBody = {
    content_id: content_id,
    username: username,
    interaction: interactionState,
  };

  var config = {
    method: "patch",
    url: API_URL + "/api/content-interactions",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(res.status);
      return { responseType: "success", serverResponse: res.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make POST request to get User Following
 * @param {String} username
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const getUserFollowing = async (username) => {
  const reqBody = {
    username: username,
  };

  var config = {
    method: "post",
    url: API_URL + "/api/users/following",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make POST request to get User Followers
 * @param {String} username
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const getUserFollowers = async (username) => {
  const reqBody = {
    username: username,
  };

  var config = {
    method: "post",
    url: API_URL + "/api/users/followers",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make POST request to get User the logged user can follow (using username)
 * @param {String} username
 * @returns {responseType: String, serverResponse: Res Object }
 */
export const getUsersToFollow = async (username) => {
  const reqBody = {
    username: username,
  };

  var config = {
    method: "post",
    url: API_URL + "/api/users/getToFollow",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make DELETE request to remove user following
 * @param {username: String} loggedInUsername
 * @param {username: String} unfollowUsername
 * @returns {responseType: String, serverResponse: Res Object}
 */
export const unfollowUser = async (loggedInUsername, unfollowUsername) => {
  const reqBody = {
    requester: loggedInUsername,
    recipient: unfollowUsername,
  };

  var config = {
    method: "delete",
    url: API_URL + "/api/user-friendships/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make POST request to create a user following
 * @param {username: String} loggedInUsername
 * @param {username: String} unfollowUsername
 * @returns {responseType: String, serverResponse: Res Object}
 */
export const followUser = async (loggedInUsername, followUsername) => {
  const reqBody = {
    requester: loggedInUsername,
    recipient: followUsername,
  };

  var config = {
    method: "post",
    url: API_URL + "/api/user-friendships/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make DELETE request to remove a user follower
 * @param {username: String} loggedInUsername
 * @param {username: String} unfollowUsername
 * @returns {responseType: String, serverResponse: Res Object}
 */
export const removeFollower = async (loggedInUsername, followerUsername) => {
  const reqBody = {
    requester: followerUsername,
    recipient: loggedInUsername,
  };

  var config = {
    method: "delete",
    url: API_URL + "/api/user-friendships/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: reqBody,
  };

  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make GET request get User Login details from server
 * @returns {responseType: String, serverResponse: Res Object}
 */
export const getUserLoginDetails = async () => {
  var config = {
    method: "get",
    url: API_URL + `/api/userLoginTable/`,
    timeout: 10000,
    headers: {},
  };
  try {
    let res = await axios(config);
    if (res.status === 200) {
      console.log(config);
      console.log(res);
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};

/**
 * Function to make POST request to add to User Login Table
 * @returns {responseType: String, serverResponse: Res Object}
 */
export const addUserLoginDetail = async (userLogin) => {
  var config = {
    method: "post",
    url: API_URL + "/api/userLoginTable/",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
    data: userLogin,
  };
  try {
    let res = await axios(config);
    if (res.status === 200) {
      return { responseType: "success", serverResponse: res.data.data };
    } else {
      return { responseType: "failed", serverResponse: res.data };
    }
  } catch (err) {
    console.error(err);
    return { responseType: "error", error: err };
  }
};
