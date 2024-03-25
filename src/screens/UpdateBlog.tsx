
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
import { Update } from "@mui/icons-material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateBlog } from "../actions/Blogs";
import { BlogContext } from "../contexts/BlogContext";

export const UpdateBlog = () => {
  const { state } = useLocation();
  const blog = state.post;
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const {dispatch} = useContext(BlogContext)
  const navigate = useNavigate()
  const handleUpdateClick = () => {
    updateBlog({ ...blog, title: title, content: content })(dispatch);
    navigate("/my-blogs");
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
            <Update />
          </Avatar>
          <Typography variant="h5">Update Blog</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoFocus
              value={title}
              onChange={(e: any) => setTitle(e.target.value)}
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
              value={content}
              onChange={(e: any) => setContent(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleUpdateClick}
            >
              Update
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default UpdateBlog;