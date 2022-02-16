import axios from "axios";
let BASE_URL = process.env.BASE_URL || "http://localhost:3000/";

export const getProducts = async (url, page, tags, sort, search) => {
  let params = {};
  if (tags) params.tags = tags;
  if (page) params.page = page;
  if (search) params.search = search;
  if (sort) params.sort = sort;
  let config = {
    params: params,
  };
  console.log("page", page);

  let res = await axios.get(`${BASE_URL}/api/${url}`, config);
  return res.data;
};
