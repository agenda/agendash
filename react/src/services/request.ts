import axios from "axios";
import { SERVER_DOMAIN } from "../constants";

const request = () => {
  return axios.create({
    baseURL: SERVER_DOMAIN,
    responseType: "json",
  });
};

export default request;
