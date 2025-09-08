import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import "./Profile.css"
import { useContext } from 'react';
import { AppReducer } from '../context/AppReducer';

export default function Profile() {
  const {state} = useContext(AppReducer); 
  const totalLikes = state.likedProducts.length;

  return (
    <div>
      <div className='profile-sidebar'>
        <NavLink></NavLink>
        <NavLink to="orders">Orders</NavLink>
        <NavLink to="favourites">Favourite({totalLikes})</NavLink>
      </div>
      <Outlet />
    </div>
  )
}
