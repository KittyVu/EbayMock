import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Search.css"

export default function Search() {
  const [searchKey, setSearchKey] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    navigate(`/search?key=${searchKey}&cate=${category}`);
  };

  return (
    <form className="search-form" onSubmit={searchHandler}>
      <input
        type="text"
        placeholder="Product search"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <select name="category" id="category" onChange={(e) => setCategory(e.target.value)} value={category}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
