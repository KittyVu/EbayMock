import { useContext, useEffect } from 'react';
import { AppReducer } from '../context/AppReducer';
import {  useSearchParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export default function SearchResult() {
    const { state, dispatch } = useContext(AppReducer);
    const [search] = useSearchParams();
    const searchKey = search.get("key") || "";
    const category = search.get("cate") || "";

    useEffect(() => {
    fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
      dispatch({ type: "SET_PRODUCTS", payload: data });  // fills products + backup
      dispatch({ type: "SEARCH_PRODUCTS", payload: [searchKey, category] });
    });
}, [dispatch,searchKey, category]);


    return (
        <div>
            <h1>Search result</h1>
            <p><b>{state.products.length} </b>founded</p>
            <div className="products-container">
            
            {
                // using useReducer
                state.products.map((product) => {
                    const isLike = state.likedProducts.some((p) => p.id === product.id);
                    return (
                        <div className="product-element" key={product.id}>
                            <span
                                className="likeProducts"
                                onClick={() => isLike ? dispatch({ type: "REMOVE_LIKE", payload: product.id }) : dispatch({ type: "ADD_LIKE", payload: product })}
                            >
                                {isLike ? '❤️' : '🤍'}
                            </span>
                            <NavLink to={`/products/${product.id}`}>
                                <img src={product.image} alt="product" />
                            </NavLink>
                            <p className="letter">{product.title}</p>
                            <b>{product.price} €</b>
                        </div>
                    );
                })
            }
        </div>
        </div>
        
    )
}
