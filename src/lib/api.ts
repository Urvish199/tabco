import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BE_URL || "https://etmsapi.tabcotechsoftware.com/api/",

});
