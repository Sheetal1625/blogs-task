import axios from "axios";
import { decodeJwt } from "../utils/DecodeJwt";
import { IBlog } from "../models/Blog";

export const ADD_BLOG_SUCCESS = "ADD_BLOG_SUCCESS";
export const ADD_BLOG_ERROR = "ADD_BLOG_ERROR";

export const UPDATE_BLOG_SUCCESS = "UPDATE_BLOG_SUCCESS";
export const UPDATE_BLOG_ERROR = "UPDATE_BLOG_ERROR";

export const DELETE_BLOG_SUCCESS = "DELETE_BLOG_SUCCESS";
export const DELETE_BLOG_ERROR = "DELETE_BLOG_ERROR";

export const GET_BLOGS_SUCCESS = "GET_BLOGS_SUCCESS";
export const GET_BLOGS_ERROR = "GET_BLOGS_ERROR";

export type IBlogActions =
  | {
      type: typeof ADD_BLOG_SUCCESS;
    }
  | {
      type: typeof ADD_BLOG_ERROR;
      payload: any;
    }
  | {
      type: typeof UPDATE_BLOG_SUCCESS;
    }
  | {
      type: typeof UPDATE_BLOG_ERROR;
      payload: any;
    }
  | {
      type: typeof DELETE_BLOG_SUCCESS;
    }
  | {
      type: typeof DELETE_BLOG_ERROR;
      payload: any;
    }
  | {
      type: typeof GET_BLOGS_SUCCESS;
      payload: any;
    }
  | {
      type: typeof GET_BLOGS_ERROR;
      payload: any;
    }


export const addBlog =  (blog: IBlog) => async(dispatch :React.Dispatch<IBlogActions>) => {
  try {
    const url = process.env.REACT_APP_BLOG_URL || "";
    const token = localStorage.getItem("token");
    const payload = decodeJwt(token || "");
    await axios.post(
      url,
      {
        authorId: payload?.authorId,
        title: blog.title,
        content: blog.content,
        publishedAt: Date.now().toLocaleString(),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch({
      type: ADD_BLOG_SUCCESS,
    });
    fetchBlogs()(dispatch);
    fetchBlogsById()(dispatch)
  } catch (error) {
    console.error("Error fetching blogs:", error);
    dispatch({
      type: ADD_BLOG_ERROR,
      payload:`Unable to publish blog : ${error} `
    });
  }
};

// Fetch blogs from API
export const fetchBlogsById =  () => async(dispatch :React.Dispatch<IBlogActions>) => {
  try {
    const url = process.env.REACT_APP_BLOG_URL || "";
    const token = localStorage.getItem("token");
    const payload = decodeJwt(localStorage.getItem("token") || "");
    const response = await fetch(`${url}/author/${payload?.authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch({
      type: GET_BLOGS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    dispatch({
      type: GET_BLOGS_ERROR,
      payload:`Unable to fetch blog : ${error} `
    });
  }
};

export const fetchBlogs =  () => async(dispatch :React.Dispatch<IBlogActions>) => {
  try {
    const url = process.env.REACT_APP_BLOG_URL || "";
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    dispatch({
      type: GET_BLOGS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    dispatch({
      type: GET_BLOGS_ERROR,
      payload:`Unable to fetch blog : ${error} `
    });
  }
};

export const updateBlog =  (blog: IBlog) => async(dispatch :React.Dispatch<IBlogActions>) => {
  try {
    const url = process.env.REACT_APP_BLOG_URL || "";
    const token = localStorage.getItem("token");
    const authorId = decodeJwt(token || "")?.authorId.toString();
    if (authorId === blog.authorId.toString()) {
      const response = await fetch(`${url}/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: blog.title,
          content: blog.content,
          publishedAt: Date.now().toLocaleString(),
        }),
      });
      await response.json();
      dispatch({
        type: UPDATE_BLOG_SUCCESS,
      });
      fetchBlogs()(dispatch);
      fetchBlogsById()(dispatch)
    } else {
      alert("You're not author of this post!!");
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    dispatch({
      type: UPDATE_BLOG_ERROR,
      payload:`Unable to update blog : ${error} `
    });
  }
};

export const deleteBlog =  (blog: IBlog) => async(dispatch :React.Dispatch<IBlogActions>) => {
  try {
    const url = process.env.REACT_APP_BLOG_URL || "";
    const token = localStorage.getItem("token");
    const authorId = decodeJwt(token || "")?.authorId.toString();
    if (authorId === blog.authorId.toString()) {
      const response = await fetch(`${url}/${blog.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      await response.json();
      dispatch({
        type: DELETE_BLOG_SUCCESS,
      });
      fetchBlogs()(dispatch);
      fetchBlogsById()(dispatch)
    } else {
      alert("You're not author of this post!!");
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    dispatch({
      type: DELETE_BLOG_ERROR,
      payload:`Unable to delete blog : ${error} `
    });
  }
};
