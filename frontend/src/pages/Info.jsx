import { useNavigate } from "react-router-dom";
import "./Profile.css";
import { useEffect, useState, useContext } from "react";
import { AppReducer } from "../context/AppReducer";

export default function Info() {
  const { state, dispatch } = useContext(AppReducer);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [tel, setTel] = useState("");
  const navigate = useNavigate();

  // Load profile data on mount
  useEffect(() => {
    fetch("http://localhost:5001/api/users/profile", {
      method: "GET",
      credentials: "include", // important: sends cookie automatically
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => {
        console.log("Profile API response:", data);
        dispatch({ type: "SET_USER", payload: data });
      })

      .catch((err) => console.error("Profile fetch error", err));
  }, [dispatch]);

  // Sync local state with user data
  useEffect(() => {
    if (state.user) {
      setEmail(state.user.email || "");
      setFullname(state.user.fullname || "");
      setTel(state.user.phone || "");
    }
  }, [state.user]);

  const editHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important: sends cookie automatically
        body: JSON.stringify({
          id: state.user.id,
          password,
          fullname,
          email,
          tel,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Update process failed: " + (error.msg || "Unknown error"));
        return;
      }

      const data = await res.json();
      dispatch({ type: "UPDATE_USER", payload: data.user });
      alert("Updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("fetch error", err);
      alert("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="info">
      <h2 className="info-title">Your Information</h2>
      <form className="edit-form" onSubmit={editHandler}>
        <label className="label-username">
          Username: {state.user?.username}
        </label>
        <br />

        <label className="label-email" htmlFor="email">Email: </label>
        <input
          type="email"
          name="email"
          className="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Type your new Email"
        />

        <label className="label-password" htmlFor="password">Password: </label>
        <input
          type="password"
          name="password"
          className="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type your new Password"
        />

        <label className="label-fullname" htmlFor="fullname">Fullname: </label>
        <input
          type="text"
          name="fullname"
          className="fullname"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Type your new Fullname"
        />

        <label className="label-tel" htmlFor="tel">Telephone: </label>
        <input
          type="tel"
          name="tel"
          className="tel"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          placeholder="Type your new Telephone"
        />

        <button className="btn-edit">Change</button>
      </form>
    </div>
  );
}
