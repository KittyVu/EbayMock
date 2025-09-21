import { useContext } from "react";
import "./Profile.css";
import { AppReducer } from "../context/AppReducer";

export default function Orders() {
  // orders can be shown if we render it or we put fetch its data into global context
  const { state } = useContext(AppReducer);

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
            state.orders.map((order, i) => (
              <tr key={order.id}>
                <td>{i + 1}</td>
                <td>{order.order_date}</td>
                <td>{order.total_amount} €</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>No orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
