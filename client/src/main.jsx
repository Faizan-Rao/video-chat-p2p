import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Room from './Room.jsx';
import './index.css'
import SocketProvider from './context/Socket.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: (<App/>)
  },
  {
    path: "/:roomId",
    element: (<Room/>)
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketProvider>
    <RouterProvider router={router} />
    </SocketProvider>
  </React.StrictMode>,
)
