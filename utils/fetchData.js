// import { BASE_URL } from "./envData";
let BASE_URL = process.env.BASE_URL || "http://localhost:3000/";
import axios from "axios";

export const getData = async (url, token, signal) => {
  const res = await axios.get(
    `${BASE_URL}/api/${url}`
    // {
    //   method: "GET",
    //   signal: signal,
    //   headers: {
    //     Authorization: token,
    //   },
    // }
  );

  const data = await res.data;
  return data;
};

export const postData = async (url, post, token) => {
  const res = await axios.post(`${BASE_URL}/api/${url}`, post, {
    headers: {
      Authorization: token,
    },
  });
  const data = await res.data;
  return data;
};

export const putData = async (url, post, token) => {
  const res = await axios.put(`${BASE_URL}/api/${url}`, post, {
    headers: {
      Authorization: token,
    },
    // body: JSON.stringify(post)
  });

  const data = await res.data;
  return data;
};

export const patchData = async (url, post, token) => {
  const res = await axios.patch(`${BASE_URL}/api/${url}`, post, {
    headers: {
      "Content-Type": "application.json",
      Authorization: token,
    },
    // body: JSON.stringify(post),
  });
  const data = await res.data;
  return data;
};

export const deleteData = async (url, token) => {
  const res = await axios.delete(`${BASE_URL}/api/${url}`, {
    headers: {
      // "Content-Type": "application/json",
      Authorization: token,
    },
  });
  const data = await res.data;
  return data;
};
