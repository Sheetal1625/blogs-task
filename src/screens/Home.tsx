import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, Container, CssBaseline, Avatar, Button } from "@mui/material";
import { AccountBox, Add, Delete, Edit, Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Post } from "../models/Post";
import { fetchBlogs } from "../actions/Blogs";


export const Home = () => {
  const navigate = useNavigate()
  const [isFocused, setIsFocused] = useState(true)
  const [blogs, setBlogs] = useState<Post[]>([]
  );

  async function fetchAllBlogs() {
    const data = await fetchBlogs();
    setBlogs(data)
  }

  useEffect(() => {
    // Fetch blogs from API or database
    fetchAllBlogs()
  }, [isFocused]);
  const handleEditClick = (blog: Post) => {
    setIsFocused(false)
    navigate("/update-blog", { state: { post: blog } })
    setIsFocused(true)
  };

  const handleDeleteClick = (blog: Post) => {
    setIsFocused(false)
    navigate("/delete-blog", { state: { post: blog } })
    setIsFocused(true)
  };
  const handleCreateClick = () => {
    setIsFocused(false)
    navigate("/add-blog")
    setIsFocused(true)
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("token")
    navigate("/login");
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
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" onClick={() => navigate("/my-blogs")}>MyBlogs</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleCreateClick}
              >
                Create New
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Logout />}
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </Box>
            <Box></Box>
          </Box>
          <Box sx={{ mt: 5 }}>
            <Grid container spacing={3}>
              {blogs.map((blog: Post) => (
                <Grid item key={blog.id} xs={12} sm={6} md={4}>
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
              ))}
            </Grid>
          </Box>
        </Box >
      </Container >
    </>

  );
};

export default Home;
