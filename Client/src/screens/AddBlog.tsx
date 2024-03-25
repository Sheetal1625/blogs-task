
import React, { useContext } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { Publish } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IBlog } from "../models/Blog";
import { addBlog } from "../actions/Blogs";
import { BlogContext } from "../contexts/BlogContext";

export const AddBlog = () => {
  const [blog, setBlog] = useState<IBlog>({ id: "", content: "", publishedAt: "", authorId: "", title: "" })
  const navigate = useNavigate()
  const {dispatch} = useContext(BlogContext)
  const handlePublishClick = () => {
    addBlog(blog)(dispatch);
    navigate("/my-blogs");
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBlog = { ...blog, title: e.target.value };
    setBlog(newBlog)
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBlog = { ...blog, content: e.target.value, };
    setBlog(newBlog)
  };
  return (
    <>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            mt: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <Publish />
          </Avatar>
          <Typography variant="h5">Publish a Blog</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              value={blog?.title}
              onChange={handleTitleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              id="content"
              label="Content"
              name="content"
              autoFocus
              value={blog?.content}
              onChange={handleContentChange}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                handlePublishClick()
              }}
            >
              Publish
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AddBlog;