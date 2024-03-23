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
    <RouterProvider router={router} />
  </React.StrictMode>
);


