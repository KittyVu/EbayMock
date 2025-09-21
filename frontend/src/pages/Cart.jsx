import { NavLink, useNavigate } from 'react-router-dom';
import './Products.css';
import { useContext, useEffect } from 'react';
import { AppReducer } from '../context/AppReducer';

export default function Cart() {
  const { state, dispatch } = useContext(AppReducer)

  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    dispatch({ type: "FETCH_CART", payload: cart });
  }, [dispatch]);


  const updateQuantityHandler = (e, product) => {
    const newQuantity = Number(e.target.value);
    const itemToBuy = { ...product, quantity: newQuantity };
    dispatch({ type: "UPDATE_CART_ITEM", payload: itemToBuy });
  };

  const total = state.cart.reduce((acc, p) => {
    const price = Number(p.price) || 0;
    const quantity = Number(p.quantity) || 1;
    return acc + (price * quantity);
  }, 0).toFixed(2);

  const totalQuantity = state.cart.reduce((total, product) => total + product.quantity, 0);

  if (!state.cart.length) return <h2>Nothing in your cart</h2>;

  const paymentHandler = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/cart/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // so cookie JWT is sent
      body: JSON.stringify({
        customer_id: state.user?.id,
        total_amount: Number(total),
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      alert("Order failed: " + (error.msg || "Unknown error"));
      return;
    }

    const data = await res.json();
    alert("Order successfully!");
    dispatch({ type: "CLEAR_CART"});
    navigate("/");
  } catch (err) {
    console.error("orders api error!", err);
    alert("Something in order went wrong. Please try again");
  }
};


  return (
    <div>
      <h1 className='cart-title'>Shopping Cart</h1>
      <div className='cart-page'>
        <div className="cart-left">
          {state.cart.map((product) => (
            <div className='left-container' key={product.id}>
              <div className='left-upper'>
                <div className='left-upper-img'>
                  <NavLink to={`/products/${product.id}`}>
                    <img className='cart-img' src={product.image} alt="product" />
                  </NavLink>
                  <p>{product.title}</p>
                  <p>(€ {product.price})</p>
                </div>
                <div className='left-upper-quantity'>
                  <label htmlFor="itemQuantity">Quantity</label>
                  <select
                    name="itemQuantity"
                    value={product.quantity}
                    onChange={(e) => updateQuantityHandler(e, product)}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='left-upper-price'>
                  <b>{Number(product.price || 0) * Number(product.quantity || 1)} €</b>
                  <p>Free delivery</p>
                </div>
              </div>
              <div className='left-bottom'>
                <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: product.id })}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className='cart-right'>
          <div>
            <span>Item ({totalQuantity})</span>
            <span> EUR {total}</span>
          </div>
          <div>
            <span>Delivery </span>
            <span>Free</span>
          </div>
          <div>
            <span>Total </span>
            <span>
              {total} €
            </span>
          </div>
          <button onClick={paymentHandler} className='pay-btn'>Payment</button>
        </div>
      </div>
    </div>

  );
}
