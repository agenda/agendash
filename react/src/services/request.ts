import axios from "axios";

const request = () => {
  return axios.create({
    baseURL: "/agenda-dashboard",
    responseType: "json",
  });
};

export default request;
