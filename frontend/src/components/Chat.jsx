import { useState } from 'react';
import "../pages/Home.css"
import { useMyContext } from '../context/AppContext';

export default function ChatBot() {
    const { messages, sendMessage } = useMyContext()
    const [input, setInput] = useState("");

    const sendHandler = async () => {
        if (!input.trim()) return; 
        const newMessage = { role: "user", content: input };
        //const newMessage = {...messages, user: input}
        sendMessage(newMessage);
        setInput("");
    };


    return (
        <div className='chat'>
            <div>
                {messages.map((msg, idx) => (
                    <p key={idx}><b>{msg.role}:</b> {msg.content}</p>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendHandler()}
                placeholder='Type your message here'
            />

            <button onClick={sendHandler}>Send</button>
        </div>
    );
}
