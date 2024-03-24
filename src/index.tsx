import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Register from './screens/Register';
import { AddBlog } from './screens/AddBlog';
import { UpdateBlog } from './screens/UpdateBlog';
import { DeleteBlog } from './screens/DeleteBlog';
import { MyBlogs } from './screens/MyBlogs';
import Login from './screens/Login';
import { Home } from './screens/Home';
import ProtectedRoute from './screens/ProtectedRoute';
import { createTheme, ThemeProvider } from '@mui/material';
import { blue, grey } from '@mui/material/colors';
import App from './App';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);


