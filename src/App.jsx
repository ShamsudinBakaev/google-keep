import './sass/app.scss';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
// components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
// pages
import Home from './pages/Home';
import Archive from './pages/Archive';
import Trash from './pages/Trash';
import ErrorPage from './pages/ErrorPage';
import ScrollToTop from './components/ScrollToTop';

const AppLayout = () => (
  <>
    <Header />
    <Sidebar />
    <ScrollToTop />
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'archive',
        element: <Archive />,
      },
      {
        path: 'trash',
        element: <Trash />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
