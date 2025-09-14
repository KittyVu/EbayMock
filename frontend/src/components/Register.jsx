import React, { useState } from 'react'
import "./Login.css"
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [tel, setTel] = useState("");
  const navigate = useNavigate();

  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, fullname, email, tel }),
        
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Register failed: " + (error.msg || "Unknown error"));
        return;
      }

      const data = await res.json();
      alert("Register successfully!");
      navigate("/profile");

    } catch (err) {
      console.error("fetch error", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className='login-page'>
      <h2>Register</h2>
      <form onSubmit={registerHandler}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder='Type your username' />
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder='Type your Email' />
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder='Type your Password' />
        <label htmlFor="fullname">Fullname</label>
        <input type="text" name="fullname" id="fullname" value={fullname} onChange={(e) => setFullname(e.target.value)} required placeholder='Type your Fullname' />
        <label htmlFor="tel">Telephone</label>
        <input type="tel" name="tel" id="tel" value={tel} onChange={(e) => setTel(e.target.value)} required placeholder='Type your Telephone' />
        <button>Register</button>
      </form>
    </div>
  )
}
