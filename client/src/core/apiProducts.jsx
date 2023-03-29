import { API } from "../config";
import queryString from 'query-string'

export const getProducts = async (sortBy) => {
  try {
    const response = await fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=15`, {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};



export const getCategories = async () => {
  try {
    const response = await fetch(`${API}/categories`, {
      method: "GET",
    });
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

export const list = async (params) => {
  try {
    const query = queryString.stringify(params)
    const response = await fetch(
      `${API}/products/?${query}`,
      {
        method: "GET",
      }
    );
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};
