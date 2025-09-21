import { useEffect, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Search from './Search';
import { AppReducer } from '../context/AppReducer';
import "./Header.css";
// header is always render in every route, so username always exists
export default function Header() {
  const { state, dispatch } = useContext(AppReducer);
  const navigate = useNavigate();

  useEffect(() => {
    // load cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    
    dispatch({ type: "FETCH_CART", payload: cart });

    // fetch profile to check login
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/users/profile", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not logged in");

        const data = await res.json();
        dispatch({ type: "LOGIN", payload: data });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkLogin();
  }, [dispatch]);

  const totalQuantity = state.cart.reduce((total, p) => total + p.quantity, 0);

  const handleLogout = async () => {
    await fetch("http://localhost:5001/api/users/logout", {
      method: "POST",
      credentials: "include",
    });
    dispatch({ type: "LOGOUT" });
    navigate("/")
  };

  return (
    <header>
      <div className='top-header'>
        <ul className='hallo-top'>
          <li>
            Hello,{' '}
            {state.loggedIn ? (
              <>
                <NavLink className="no-underline" to="/profile">
                  <b>{state.user?.username}</b>
                </NavLink>{' '}
                (<a onClick={handleLogout} className="logout-btn">Logout</a>)
              </>
            ) : (
              <>
                <NavLink className="blue-text" to="/login">Login</NavLink> or{' '}
                <NavLink className="blue-text" to="/register">Register</NavLink>
              </>
            )}
          </li>
          <li><NavLink to="/deals">Deals</NavLink></li>
          <li><NavLink to="/help">Help</NavLink></li>
        </ul>
        <div className='cart-top'>
          <NavLink to="/cart">
            <div className="cart-wrapper">
              <img className="cart-icon" src="../shopping-cart.png" alt="cart" />
              {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
            </div>
          </NavLink>
        </div>
      </div>

      <nav className='searchbar'>
        <NavLink to="/"><img className='logo' src="../ebay_logo.png" alt="logo-home" /></NavLink>
        <Search />
      </nav>
    </header>
  );
}
