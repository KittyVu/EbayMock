import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Profile.css"
import { useContext } from 'react'; 
import { AppReducer } from '../context/AppReducer';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const {state} = useContext(AppReducer); 
  const totalLikes = state.likedProducts.length;
  const totalOrders = state.orders.length;

  useEffect(() => {
    fetch("http://localhost:5001/api/users/profile", {
      credentials: "include"
    })
      .then(res => {
        if (res.status === 200) {
          setIsAuth(true);
          console.log("authenticated")
        } else {
          setIsAuth(false);
          console.log("not authen")
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAuth) return <Navigate to="/login" replace />;

  return (
    <div className="profile-page">
      <div className='profile-sidebar'>
        <NavLink to="info">Change Info</NavLink>
        <NavLink to="orders">Orders({totalOrders})</NavLink>
        <NavLink to="favourites">Favourite({totalLikes})</NavLink>  
      </div>
      <Outlet />
    </div>)
}
