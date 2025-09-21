import { createContext, useReducer, useEffect } from "react";

function safeJSONParse(key) {
  try {
    const value = localStorage.getItem(key);
    if (!value || value === "undefined") return null;
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export const initialState = {
  products: [],
  originalProducts: [],
  cart: safeJSONParse("cart") || [],
  likedProducts: safeJSONParse("likedProducts") || [],
  user: null,
  loggedIn: false,
  orders: []
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS":
      return { ...state, products: action.payload };

    case "FETCH_LIKED_PRODUCTS":
      return { ...state, likedProducts: action.payload };

    case "ADD_LIKE": {
      const existing = state.likedProducts.some((p) => p.id === action.payload.id);
      if (existing) return state;
      const updated = [...state.likedProducts, action.payload];
      localStorage.setItem("likedProducts", JSON.stringify(updated));
      return { ...state, likedProducts: updated };
    }

    case "REMOVE_LIKE": {
      const updated = state.likedProducts.filter((p) => p.id !== action.payload);
      localStorage.setItem("likedProducts", JSON.stringify(updated));
      return { ...state, likedProducts: updated };
    }

    case "FETCH_CART": 
      return { ...state, cart: action.payload };

    case "ADD_TO_CART": {
      const existingItem = state.cart.find((item) => item.id === action.payload.id);
      if (existingItem) {
        const updatedCart = state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { ...state, cart: updatedCart };
      } else {
        const updatedCart = [...state.cart, action.payload];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { ...state, cart: updatedCart };
      }
    }

    case "REMOVE_FROM_CART": {
      const updatedCart = state.cart.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };
    }

    case "CLEAR_CART": {
      localStorage.setItem("cart", JSON.stringify([]));
      return { ...state, cart: [] };
    }

    case "SET_PRODUCTS":
      return { ...state, products: action.payload, originalProducts: action.payload };

    case "SEARCH_PRODUCTS": {
      const [searchKey = "", category = ""] = action.payload.map((v) => v.toLowerCase());
      const filteredProducts = state.originalProducts.filter((product) => {
        const matchCategory = category ? product.category.toLowerCase() === category : true;
        const matchSearch = searchKey ? product.title.toLowerCase().includes(searchKey) : true;
        return matchCategory && matchSearch;
      });
      return { ...state, products: filteredProducts };
    }

    case "FETCH_ORDERS": {
      return { ...state, orders: action.payload };
    }  

    case "LOGIN":
      return { ...state, loggedIn: true, user: action.payload };

    case "LOGOUT":
      return { ...state, loggedIn: false, user: null };

    case "SET_USER":
    case "UPDATE_USER":
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

export const AppReducer = createContext(null);

export function AppReducerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
   useEffect(() => {
    // ✅ load orders globally
    async function fetchOrders() {
      try {
        const res = await fetch("http://localhost:5001/api/cart/orders", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        dispatch({
          type: "FETCH_ORDERS",
          payload: Array.isArray(data) ? data : [],
        });
      } catch (err) {
        console.error("Fetch orders error:", err);
      }
    }

    fetchOrders();
  }, []);
  return (
    <AppReducer.Provider value={{ state, dispatch }}>
      {children}
    </AppReducer.Provider>
  );
}
