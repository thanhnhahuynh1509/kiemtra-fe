import axios from "axios";

const HOST = "http://localhost:8080";

export const logging = async (username, password) => {
  const response = await axios.post(`${HOST}/api/nguoidung/sign-in`, {
    username,
    password,
  });

  return response.data;
};
