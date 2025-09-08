import { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Search from './Search';
import { AppReducer } from '../context/AppReducer';
import "./Header.css"

export default function Header() {
    const [loggedIn, setLoggedIn] = useState(false);
    const { state, dispatch } = useContext(AppReducer);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        dispatch({ type: "FETCH_CART", payload: cart });
    }, [dispatch]);

    const totalQuantity = state.cart.reduce((total, product) => total + product.quantity, 0);

    return (
        <header>
            <div className='top-header'>
                <ul className='hallo-top' >
                    <li>
                        Hello{' '}
                        {loggedIn
                            ? (
                                <NavLink to="/profile">
                                    <b>Username</b>
                                </NavLink>
                            ) : (
                                <>
                                    <NavLink className="blue-text" to="/login">Login</NavLink> or{' '}
                                    <NavLink className="blue-text" to="/register">Register</NavLink>
                                </>
                            )}
                    </li>
                    <li>
                        <NavLink className="no-underline" to="/deals">Deals</NavLink>
                    </li>
                    <li>
                        <NavLink className="no-underline" to="/help">Help</NavLink>
                    </li>
                </ul>
                <div className='cart-top'>
                    {loggedIn
                        ? (<NavLink className="no-underline" to="/profile">Profile</NavLink>)
                        : (
                            <>

                                <NavLink className="no-underline" to="/cart">
                                    <div className="cart-wrapper">
                                        <img className="cart-icon" src="../shopping-cart.png" alt="cart" />
                                        {totalQuantity > 0 && (
                                            <span className="cart-badge">{totalQuantity}</span>
                                        )}
                                    </div>
                                </NavLink>

                            </>
                        )
                    }
                </div>
            </div>

            <nav className='searchbar'>
                <NavLink to="/"><img className='logo' src="../ebay_logo.png" alt="logo-home" /></NavLink>
                <Search />
            </nav>
        </header >
    );
}
