import { Author } from "../models/Author";

export const START_LOADING = "START_LOADING";

export const ADD_AUTHOR_SUCCESS = "ADD_BOOK_SUCCESS";
export const ADD_AUTHOR_ERROR = "ADD_BOOK_ERROR";

export const LOGIN_SUCCESS = "UPDATE_BOOK_SUCCESS";
export const LOGIN_ERROR = "UPDATE_BOOK_ERROR";

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const url = process.env.REACT_APP_LOGIN_URL || "";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    if (!response.ok) {
      alert("Pleas provide correct credentials!!!");
      return false;
    } else {
      let token = await response.json();
      localStorage.setItem("token", token);
      return true;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return false;
  }
};

export const addAuthor = async (author: Author): Promise<boolean> => {
  try {
    const url = process.env.REACT_APP_REGISTER_URL || "";
    const response = await fetch(`${url}`, {
      body: JSON.stringify({
        firstName: author.firstName,
        middleName: author.middleName,
        lastName: author.lastName,
        mobile: author.mobile,
        email: author.email,
        password: author.password,
      }),
      method: "POST",
    });
    if (!response.ok) {
      alert("Pleas provide correct credentials!!!");
      return false;
    } else {
      let token = await response.json();
      localStorage.setItem("token", token);
      return true;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return false;
  }
};
