
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { deleteBlog } from "../actions/Blogs";

export const DeleteBlog = () => {
  const { state } = useLocation();
  const blog = state.post;
  const navigate = useNavigate()

  const handleDeleteClick = () => {
    deleteBlog(blog);
    navigate("/my-blogs")
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
            <Delete />
          </Avatar>
          <Typography variant="h5">Delete Blog</Typography>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              disabled
              id="title"
              label="Title"
              name="title"
              autoFocus
              value={blog.title}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              disabled
              id="content"
              label="Content"
              name="content"
              autoFocus
              value={blog.content}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleDeleteClick}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default DeleteBlog;