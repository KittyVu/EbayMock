import React, { useState, useContext } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { AppReducer } from "../context/AppReducer";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch } = useContext(AppReducer);
  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Login failed: " + (error.msg || "Unknown error"));
        return;
      }

      const data = await res.json();
      dispatch({ type: "LOGIN", payload: data.user });
      alert("Login successful!");
      navigate("/profile");
    } catch (err) {
      console.error("fetch error", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='login-page'>
      <h2>Login</h2>
      <form onSubmit={loginHandler}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder='Your username'
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder='Your password'
        />
        <button>Login</button>
      </form>
    </div>
  );
}
