import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

export default function AppContextProvider({ children }) {
    // favourite products
    const [likedProducts, setLikedProducts] = useState(() => {
        try {
            const stored = localStorage.getItem("likedProducts");
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error parsing likedProducts from localStorage:", error);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
    }, [likedProducts]);

    const addLike = (product) => {
        setLikedProducts((prev) => [...prev, product]);
    };

    const removeLike = (productId) => {
        setLikedProducts((prev) => prev.filter((p) => p.id !== productId));
    };
    // product in the cart
    const [buyProducts, setBuyProducts] = useState(() => {
        try {
            const itemsStored = localStorage.getItem("buyProducts");
            return itemsStored ? JSON.parse(itemsStored) : [];
        } catch (error) {
            console.error("Error parsing buy products from localStorage: ", error);
            return [];
        }
    })

    useEffect(() => {
        localStorage.setItem("buyProducts", JSON.stringify(buyProducts))
    }, [buyProducts])

    const addToBuy = (product) => {
        setBuyProducts((prev) => {
            // check product is already in cart
            const existing = prev.find((p) => p.id === product.id);
            // if right, update quantity of this product
            if (existing) {
                return prev.map((p) => p.id === product.id
                    ? { ...p, quantity: p.quantity + product.quantity }
                    : p
                )
                // if false, add a new    
            } else {
                return [...prev, product]
            }
        })
    }

    const removeFromBuy = (productId) => {
        setBuyProducts((prev) => prev.filter((p) => p.id !== productId))
    }

    const updateProduct = (updatedProduct) => {
        setBuyProducts((prev) =>
            prev.map((p) =>
                p.id === updatedProduct.id
                    ? { ...p, ...updatedProduct }
                    : p
            )
        );
    };

    // chat
    const [messages, setMessages] = useState(() => {
        try {
            const stored = localStorage.getItem("messages");
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
            console.error("Error loading messages:", err);
            return [];
        }
    });


    useEffect(() => {
        localStorage.setItem("messages", JSON.stringify(messages))
    }, [messages])

    const sendMessage = async (newMessage) => {
        // Add user message first
        setMessages((prev) => [...prev, newMessage]);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                body: JSON.stringify({ message: newMessage.content }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            const botReply = { role: "bot", content: data.reply };

            // Append bot reply safely
            setMessages((prev) => [...prev, botReply]);

        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <AppContext.Provider value={{ likedProducts, buyProducts, addLike, removeLike, addToBuy, removeFromBuy, updateProduct, sendMessage, messages }}>
            {children}
        </AppContext.Provider>
    );
}

export function useMyContext() {
    return useContext(AppContext);
}
