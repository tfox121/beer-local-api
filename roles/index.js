require('dotenv').config();
const axios = require('axios');
const querystring = require('querystring');

const getAccessToken = async () => {
  const queryString = querystring.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.AUTH0_AUTH_EXT_CLIENT_ID,
    client_secret: process.env.AUTH0_AUTH_EXT_CLIENT_SECRET,
    audience: process.env.AUTH0_AUTH_EXT_AUDIENCE,
  });

  const options = {
    method: 'POST',
    url: 'https://tfox121.eu.auth0.com/oauth/token',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: queryString,
  };
  try {
    const response = await axios(options);
    return response.data.access_token;
  } catch (err) {
    return err;
  }
};

const authExtEndpoint =
  'https://tfox121.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api';

// const getAllUsers = async () => {
//   const accessToken = await getAccessToken();
//   const options = {
//     method: 'GET',
//     url: `${authExtEndpoint}/users`,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   };

//   const response = await axios(options);
//   console.log(response.data);
// };

// const getAllRoles = async () => {
//   const accessToken = await getAccessToken();
//   const options = {
//     method: 'GET',
//     url: `${authExtEndpoint}/roles`,
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//     },
//   };

//   const response = await axios(options);
//   console.log(response.data);
// };

const getUserRoles = async userId => {
  const accessToken = await getAccessToken();
  const options = {
    method: 'GET',
    url: `${authExtEndpoint}/users/${userId}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const response = await axios(options);
    return console.log(response.data);
  } catch (err) {
    return err;
  }
};

const addRole = async (userId, roleId) => {
  const accessToken = await getAccessToken();
  const options = {
    method: 'PATCH',
    url: `${authExtEndpoint}/users/${userId}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: [roleId],
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    return response.data;
  } catch (err) {
    return err;
  }
};

const deleteVisitorRole = async userId => {
  const accessToken = await getAccessToken();
  const options = {
    method: 'DELETE',
    url: `${authExtEndpoint}/users/${userId}/roles`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: process.env.AUTH0_VISITOR_ROLE_ID,
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    return response.data;
  } catch (err) {
    return err;
  }
};

// addRole('auth0|5ef3fd6aa84b0d0014a3b6a4', '1713f9ea-09e2-4627-aa0a-0516a2319991');
// getRoles('auth0|5ef3fd6aa84b0d0014a3b6a4');
// getAllRoles();

module.exports = { getUserRoles, addRole, deleteVisitorRole };
