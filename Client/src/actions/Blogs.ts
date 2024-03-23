import axios from "axios";
import { decodeJwt } from "../utils/DecodeJwt";
import { Post } from "../models/Post";

export const addBlog = async (blog: Post) => {
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
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};

// Fetch blogs from API
export const fetchBlogsById = async () => {
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
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};

export const fetchBlogs = async () => {
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
    return data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};

export const updateBlog = async (blog: Post) => {
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
      const data = await response.json();
    } else {
      alert("You're not author of this post!!");
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};

export const deleteBlog = async (blog: Post) => {
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
      const data = await response.json();
    } else {
      alert("You're not author of this post!!");
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
};
