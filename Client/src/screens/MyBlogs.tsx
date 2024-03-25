import React, { useState, useEffect, useContext } from "react";
import { Grid, Card, CardContent, Typography, Box, Container, CssBaseline, Avatar } from "@mui/material";
import { AccountBox, Delete, Edit, SentimentDissatisfied } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchBlogsById } from "../actions/Blogs";
import { BlogContext } from "../contexts/BlogContext";
import { IBlog } from "../models/Blog";

interface Post {
  id: string;
  authorId: string;
  title: string;
  content: string;
  publishedAt: string;
}
export const MyBlogs = () => {
  const navigate = useNavigate()
  const { state, dispatch } = useContext(BlogContext);
  const [blogs, setBlogs] = useState<IBlog[]>(state.blogs);

  useEffect(() => {
    fetchBlogsById()(dispatch)
  }, []);
  
  useEffect(() => {
    setBlogs(state.blogs)
  },[state]);
  const handleEditClick = (blog: Post) => {
    navigate("/update-blog", { state: { post: blog } })
  };

  const handleDeleteClick = (blog: Post) => {
    navigate("/delete-blog", { state: { post: blog } })
  };
  return (
    <>
      <Container maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            mt: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
            <AccountBox />
          </Avatar>
          <Typography variant="h5">My Blogs</Typography>
          <Typography variant="body2" color="text.primary" onClick={() => { navigate("/home") }}>
            Home
          </Typography>
          <Box sx={{ mt: 5 }}>
            <Grid container spacing={3}>
              {blogs && blogs.length ? blogs.map((blog: Post) => (
                <Grid item key={blog.id} xs={12} sm={4} md={6}>
                  <Card sx={{ height: 200, display: "flex", flexDirection: "column" }}>
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <Typography variant="h5" component="div">
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {blog.content}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Avatar
                          sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { transform: "scale(1.1)" } }}
                          onClick={() => handleEditClick(blog)}
                        >
                          <Edit />
                        </Avatar>
                        <Avatar
                          sx={{ bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { transform: "scale(1.1)" } }}
                          onClick={() => handleDeleteClick(blog)}
                        >
                          <Delete />
                        </Avatar>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )) :
                <Box
                  sx={{
                    mt: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    You haven't created any blogs yet!!!
                  </Typography>
                  <Avatar
                    sx={{ mt: 10, bgcolor: "primary.main", color: "primary.contrastText", "&:hover": { transform: "scale(1.1)" } }}
                  >
                    < SentimentDissatisfied />
                  </Avatar>
                </Box>
              }

            </Grid>
          </Box>
        </Box >
      </Container >
    </>

  );
};

export default MyBlogs;
