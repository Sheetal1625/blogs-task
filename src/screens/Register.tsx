
import React from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { LockOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Author } from "../models/Author";
import { addAuthor } from "../actions/Author";

export const Register = () => {
  const [author, setAuthor] = useState<Author>(
    {
      id: "", firstName: "", middleName: "", lastName: "", email: "", mobile: "", password: ""
    }
  );
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = { ...author, firstName: e.target.value };
    setAuthor(newAuthor)
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleMiddleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = { ...author, middleName: e.target.value };
    setAuthor(newAuthor)
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = { ...author, lastName: e.target.value };
    setAuthor(newAuthor)
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = { ...author, email: e.target.value };
    setAuthor(newAuthor)
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = { ...author, password: e.target.value };
    setAuthor(newAuthor)
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAuthor = { ...author, mobile: e.target.value };
    setAuthor(newAuthor)
  };

  const handleRegister = async () => {
    const response = await addAuthor(author);
    if (response) {
      navigate("/login")
    }
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
            <LockOutlined />
          </Avatar>
          <Typography variant="h5">Register</Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="FirstName"
                  label="FirstName"
                  type="FirstName"
                  id="FirstName"
                  value={author.firstName}
                  onChange={handleFirstNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="MiddleName"
                  label="MiddleName"
                  type="MiddleName"
                  id="MiddleName"
                  value={author.middleName}
                  onChange={handleMiddleNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="LastName"
                  label="LastName"
                  type="LastName"
                  id="LastName"
                  value={author.lastName}
                  onChange={handleLastNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  value={author.email}
                  onChange={handleEmailChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'} // Toggle between 'text' and 'password' type
                  id="password"
                  value={author.password}
                  onChange={handlePasswordChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="Mobile"
                  label="Mobile"
                  id="Mobile"
                  value={author.mobile}
                  onChange={handleMobileChange}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Typography variant="h6" onClick={() => navigate("/login")}>Already have an account? Login</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Register;