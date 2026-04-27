import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from '../Pages/Home.jsx'
import PagenotFounded from '../Pages/PagenotFounded.jsx'

export const router = createBrowserRouter([
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/',
    element: <Navigate to="/Home" replace />,
  },
  {
     path : "*",
     element : <PagenotFounded />
  }
])