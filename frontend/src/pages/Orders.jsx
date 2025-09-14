import { useContext, useEffect } from "react"
import "./Profile.css"
import { AppReducer } from "../context/AppReducer"

export default function Orders() {
  const { state, dispatch } = useContext(AppReducer)

  useEffect(() => {
    fetch("http://localhost:5001/api/cart/orders", {
      method: "GET",
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        console.log("order API response:", data);
        // ensure it's an array
        const ordersArray = Array.isArray(data) ? data : [];
        dispatch({ type: "FETCH_ORDERS", payload: ordersArray });
      })

      .catch((err) => console.error("Profile fetch error", err));
  }, [dispatch]);

  return (
    <div>
      <h2>Your Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(state.orders) && state.orders.length > 0 ? (
            state.orders.map((order,i) => (
              <tr key={order.id}>
                <td>{i+1}</td>
                <td>{order.order_date}</td>
                <td>{order.total_amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No orders found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}
