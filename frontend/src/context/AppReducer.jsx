import { createContext } from "react";
import { useReducer } from "react";

const storedCart = localStorage.getItem("cart");
const storedLiked = localStorage.getItem("likedProducts");

export const initialState = {
  products: [],
  cart: storedCart ? JSON.parse(storedCart) : [],
  likedProducts: storedLiked ? JSON.parse(storedLiked) : [],
};


export const reducer = (state, action) => {

  switch (action.type) {
    case "FETCH_PRODUCTS":
      return { ...state, products: action.payload };

    case "FETCH_LIKED_PRODUCTS":
      return { ...state, likedProducts: action.payload };

    case "ADD_LIKE": {
      const existing = state.likedProducts.some(
        (p) => p.id === action.payload.id
      );
      if (existing) return state;

      const addLike = [...state.likedProducts, action.payload];
      localStorage.setItem("likedProducts", JSON.stringify(addLike));
      return { ...state, likedProducts: addLike };
    }

    case "REMOVE_LIKE": {
      const updateLike = state.likedProducts.filter(
        (p) => p.id !== action.payload
      );
      localStorage.setItem("likedProducts", JSON.stringify(updateLike));
      return { ...state, likedProducts: updateLike };
    }

    case "FETCH_CART":
      return { ...state, cart: action.payload };

    case "ADD_TO_CART": {
      const existingCartItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingCartItem) {
        const updatedCart = state.cart.map((item) => item.id === action.payload.id
          ? { ...item, quantity: item.quantity + action.payload.quantity }
          : item
        );
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return { ...state, cart: updatedCart };
      } else {
        const newCart = [...state.cart, action.payload];
        localStorage.setItem("cart", JSON.stringify(newCart));
        return { ...state, cart: newCart };
      }
    }

    case "REMOVE_FROM_CART": {
      const updateCart = state.cart.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("cart", JSON.stringify(updateCart));
      return { ...state, cart: updateCart };
    }

    case "UPDATE_CART_ITEM": {
      const updatedCart = state.cart.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };
    }

    case "CLEAR_CART": {
      localStorage.setItem("cart", JSON.stringify([]));
      return { ...state, cart: [] };
    }

    case "SET_PRODUCTS": {
      return {
        ...state,
        products: action.payload,          
        originalProducts: action.payload,  
      };
    }

    case "SEARCH_PRODUCTS": {
      const [searchKey = "", category = ""] = action.payload.map(v => v.toLowerCase());

      const filteredProducts = state.originalProducts.filter(product => {
        const matchCategory = category ? product.category.toLowerCase() === category : true;
        const matchSearch = searchKey ? product.title.toLowerCase().includes(searchKey) : true;
        return matchCategory && matchSearch;
      });

      return { ...state, products: filteredProducts };
    }

    default:
      return state;
  }
};

export const AppReducer = createContext(null);

export function AppReducerProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppReducer.Provider value={{ state, dispatch }}>
      {children}
    </AppReducer.Provider>
  );
}

