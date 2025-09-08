import { useContext, useEffect } from 'react';
import './Products.css';
import { NavLink } from 'react-router-dom';
import { AppReducer } from '../context/AppReducer';

export default function Products() {
  // using useReducer
  const { state, dispatch } = useContext(AppReducer)

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "FETCH_PRODUCTS",
          payload: data,
        })
      );
  }, [dispatch])

  return (
    <div className="products-container">
      {
        // using useReducer
        state.products.map((product) => {
          const isLike = state.likedProducts.some((p) => p.id === product.id);
          return (
            <div className="product-element" key={product.id}>
              <div className='bg-item'>
                <span
                  className="likeProducts"
                  onClick={() => isLike ? dispatch({ type: "REMOVE_LIKE", payload: product.id }) : dispatch({ type: "ADD_LIKE", payload: product })}
                >
                  {isLike ? '❤️' : '🤍'}
                </span>
                <NavLink to={`/products/${product.id}`}>
                  <img className='img-products' src={product.image} alt="product" />
                </NavLink>
              </div>

              <p className="letter">{product.title}</p>
              <b className='products-price'>{product.price} €</b>
            </div>
          );
        })
      }
    </div>
  );
}
