import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Container,
  CssBaseline,
  Avatar,
  Button,
} from "@mui/material";
import {
  Add,
  Delete,
  Edit,
  Logout,
  SentimentDissatisfied,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IBlog } from "../models/Blog";
import { fetchBlogs } from "../actions/Blogs";
import { BlogContext } from "../contexts/BlogContext";

export const Home = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(BlogContext);
  const [blogs, setBlogs] = useState<IBlog[]>(state.blogs);

  useEffect(() => {
    // Fetch blogs from API or database
    fetchBlogs()(dispatch);
  }, []);
  useEffect(() => {
    setBlogs(state.blogs)
  },[state]);
  const handleEditClick = (blog: IBlog) => {
    navigate("/update-blog", { state: { post: blog } });
  };

  const handleDeleteClick = (blog: IBlog) => {
    navigate("/delete-blog", { state: { post: blog } });
  };
  const handleCreateClick = () => {
    navigate("/add-blog");
  };
  const handleLogoutClick = () => {
    localStorage.removeItem("token");
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
            <Typography variant="h3" onClick={() => navigate("/my-blogs")}>
              MyBlogs
            </Typography>

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
              {blogs ? (
                blogs.map((blog: IBlog) => (
                  <Grid item key={blog.id} xs={12} sm={6} md={6}>
                    <Card
                      sx={{
                        height: 200,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {blog.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {blog.content}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                            onClick={() => handleEditClick(blog)}
                          >
                            <Edit />
                          </Avatar>
                          <Avatar
                            sx={{
                              bgcolor: "primary.main",
                              color: "primary.contrastText",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                            onClick={() => handleDeleteClick(blog)}
                          >
                            <Delete />
                          </Avatar>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
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
                    sx={{
                      mt: 10,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  >
                    <SentimentDissatisfied />
                  </Avatar>
                </Box>
              )}
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
