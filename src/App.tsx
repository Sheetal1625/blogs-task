import React, { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Register from './screens/Register';
import { AddBlog } from './screens/AddBlog';
import { UpdateBlog } from './screens/UpdateBlog';
import { DeleteBlog } from './screens/DeleteBlog';
import { MyBlogs } from './screens/MyBlogs';
import Login from './screens/Login';
import { Home } from './screens/Home';
import ProtectedRoute from './screens/ProtectedRoute';
import { Avatar, createTheme, Switch, ThemeProvider } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import { DarkMode } from '@mui/icons-material';
import { BlogContextProvider } from './contexts/BlogContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
    palette: {
      mode: 'light', // Default theme mode is light
      primary: {
        main: blue[500],
      },
      secondary: {
        main: grey[500],
      },
    },
  });
  
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: blue[200],
      },
      secondary: {
        main: grey[200],
      },
    },
  });
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/add-blog",
      element: <ProtectedRoute >
        <AddBlog />
      </ProtectedRoute>
    },
    {
      path: "/update-blog",
      element: <ProtectedRoute >
        <UpdateBlog />
      </ProtectedRoute>
    },
    {
      path: "/delete-blog",
      element: <ProtectedRoute >
        <DeleteBlog />
      </ProtectedRoute>
    },
    {
      path: "/home",
      element: <ProtectedRoute >
        <Home />
      </ProtectedRoute>
    },
    {
      path: "/my-blogs",
      element: <ProtectedRoute >
        <MyBlogs />
      </ProtectedRoute>
    },
  ]);
  
const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <React.StrictMode>
      <BlogContextProvider>
      <ThemeProvider theme={darkMode ? darkTheme : theme}>
        <ToastContainer/>
    <div style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-start", zIndex: 0, position: 'relative' }}>
          <RouterProvider router={router} />
          <div style={{ position: 'absolute', top: 20, right: 0, zIndex: 1, display:"flex", flexDirection:"row" }}>
          <Avatar>
              <DarkMode />
            </Avatar>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </div>
        </div>
    </ThemeProvider>
      </BlogContextProvider>
  </React.StrictMode>
  );
};

export default App;
