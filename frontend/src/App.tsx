import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './App.css'
import LandingPageTemplate from 'templetes/LandingPage.templete';
import Login from 'pages/login';
import Home from 'pages/home';
import { SocketProvider } from '@context/SocketContext';
const router = createBrowserRouter([
  {
    path:'/',
    element:(
      <LandingPageTemplate />
    ),children:[{index:true,element:<Login />},{
      path:'home', element:<Home />
    }]

  }
])
function App() {

  return (
    <>
    <SocketProvider>
     <RouterProvider router={router} />
     </SocketProvider>
    </>
  )
}
export default App
