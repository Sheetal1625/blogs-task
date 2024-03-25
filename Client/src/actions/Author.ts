
import "react-toastify/dist/ReactToastify.css";
import { IAuthor } from "../models/Author";
import { showFailureToast, showSuccessToast } from "../utils/toaster";

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
      showFailureToast("Pleas provide correct credentials!!!")
      return false;
    } else {
      let token = await response.json();
      localStorage.setItem("token", token);
      showSuccessToast("Successfully logged in")
      return true;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return false;
  }
};

export const addAuthor = async (author: IAuthor): Promise<boolean> => {
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
      showFailureToast(`Unable to register user !!`)
      return false;
    } else {
      showSuccessToast(`Successfully registered !!`)
      return true;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return false;
  }
};
