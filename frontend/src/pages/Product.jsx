import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  AppReducer } from '../context/AppReducer';

export default function Product() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { productId } = useParams();
  const {state, dispatch} = useContext(AppReducer);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      });
  }, [productId]);

 const changeQuantityHandler = (e) => {
    setQuantity(e.target.value)
 }

  const buyHandler = () => {
      const itemToBuy = {...product,quantity: Number(quantity) || 1 }
      dispatch({type: "ADD_TO_CART", payload: itemToBuy});
      
     
      alert(`This ${quantity} product(s) added !`)
  }

  const moveToCartHandler = () => {
      navigate("/cart")
  }

  if (!product) return <p>Loading...</p>;

  const numericId = Number(productId);
  const isLike = state.likedProducts.some((p) => p.id === product.id); 

  return (
    <div className='product-content'>
      <div className='left-album'>
        <img className='small-img' src={product.image} alt="image1" />
        <img className='small-img' src={product.image} alt="image2" />
        <img className='small-img' src={product.image} alt="image3" />
      </div>
      <div className='middle-img'>
        <img className='detail-product' src={product.image} alt="big-image" />
        <span className='like' onClick={() => isLike ? dispatch({type:"REMOVE_LIKE", payload: numericId}) : dispatch({type:"ADD_LIKE", payload: product})}>
          15 {isLike ? '❤️' : '🤍'}
        </span>
      </div>
      <div className='right-content'>
        <b>{product.title}</b>
        <p>⭐⭐⭐⭐⭐</p>
        <p>Seller ABC....</p>
        <p className='letter-bold'>EUR {product.price}</p>
        <label htmlFor="itemQuantity">Quantity:</label>
        <input type="number" name="itemQuantity" value={quantity} onChange={changeQuantityHandler} />
        <p>Promotion......</p>
        <div className='button'>
          <button className='buy btn' onClick={buyHandler}>Buy</button>
          <button onClick={moveToCartHandler}  className='inbasket btn'>In Basket</button>
         {!isLike && 
          <button className='infavour btn' onClick={() => dispatch({type:"ADD_LIKE", payload: product})}>In Favourite</button>
         }  
        </div>
      </div>
    </div>
  );
}
