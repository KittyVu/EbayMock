import  { useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AppReducer } from '../context/AppReducer';

export default function LikedProducts() {
  // ussing useContext
  //const { likedProducts, removeLike } = useMyContext();
  const {state, dispatch} = useContext(AppReducer)
  useEffect(() => {
    dispatch({ type: "FETCH_LIKED_PRODUCTS", payload: JSON.parse(localStorage.getItem("likedProducts")) || []  });
  }, [dispatch]);

  if (!state.likedProducts.length) return <h2>No favourite products yet.</h2>;

  const removeLike = (id) => {
    dispatch({ type: "REMOVE_LIKE", payload: id });
  };

  return (
    <div className="favourite-page">
      <h1>Your Favourite Products</h1>
      <div className="favourite-content">
        {state.likedProducts.map((product) => (
          <div className='favourite-element'>
            <span
              className="likeProducts"
              onClick={() => removeLike(product.id)}
            >
              ❤️
            </span>
            <NavLink to={`/products/${product.id}`}>
              <img src={product.image} alt="product" />
            </NavLink>
            <p className="letter">{product.title}</p>
            <b>{product.price} €</b>
          </div>
        ))}
      </div>
    </div>
  );
}
