import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import Product from './pages/Product.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Profile from './pages/Profile.jsx'
import Cart from './pages/Cart.jsx'
import LikedProducts from './pages/LikedProducts.jsx'
import Orders from './pages/Orders.jsx'
import Payment from './pages/Payment.jsx'
import Transportation from './pages/Transportation.jsx'
import ErrorPage from './pages/ErrorPage.jsx'
import Help from './pages/Help.jsx'
import Deals from './pages/Deals.jsx'
import { AppReducerProvider } from './context/AppReducer.jsx'
import SearchResult from './pages/SearchResult.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "/products",
                element: <Products />,

            },
            {
                path: "/products/:productId",
                element: <Product />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/profile",
                element: <Profile />,
                children: [
                    {
                        path: "favourites",
                        element: <LikedProducts />
                    },
                    {
                        path: "orders",
                        element: <Orders />
                    }
                ]
            },
            {
                path: "/cart",
                element: <Cart />,
                children: [
                    {
                        path: "payment",
                        element: <Payment />
                    },
                    {
                        path: "transportation",
                        element: <Transportation />
                    }
                ]
            },
            {
                path: "/help",
                element: <Help />
            },
            {
                path: "/deals",
                element: <Deals />
            },
            {
                path:"/search",
                element: <SearchResult />
            },
            {
                path: "*",
                element: <ErrorPage />
            }
        ]
    }
])
createRoot(document.getElementById('root')).render(
    <AppReducerProvider>
        <RouterProvider router={router} />
    </AppReducerProvider>
)
