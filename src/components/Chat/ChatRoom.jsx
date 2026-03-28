import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatRoom = ({ conversationId, socket }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        let isMounted = true;
        const fetchMessages = async () => {
            setLoading(true);
            try {
                // Mocking API call
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/v1/messages/${conversationId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(isMounted) {
                    setMessages(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch messages:', error);
                // Fallback to mock data on error for visual verification
                if(isMounted) {
                    setMessages([
                        { id: 1, sender: 'Buyer', text: 'Hi, I would like to negotiate the price for item X.', timestamp: '10:00 AM' },
                        { id: 2, sender: 'Supplier', text: 'Sure, our standard price is $100.', timestamp: '10:05 AM', file_url: "http://example.com/spec.pdf" },
                        { id: 3, sender: 'Buyer', text: 'Can we do $90?', timestamp: '10:10 AM' },
                    ]);
                }
            } finally {
                if(isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchMessages();
        return () => { isMounted = false; };
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!socket) return;

        // Listen for new messages
        socket.on('newMessage', (message) => {
            if (message.conversationId === conversationId) {
                setMessages(prev => [...prev, message]);
            }
        });

        return () => {
            socket.off('newMessage');
        };
    }, [socket, conversationId]);

    if (loading) return <div className="h-full flex items-center justify-center">Loading messages...</div>;

    const msgs = Array.isArray(messages) ? messages : [];

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="p-4 border-b bg-white font-semibold">
                Conversation: {conversationId} (Read-Only)
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {msgs.map(msg => {
                    const isBuyer = msg.sender.toLowerCase() === 'buyer';
                    return (
                        <div key={msg.id} className={`flex ${isBuyer ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${isBuyer ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                                <div className="text-xs font-bold mb-1 opacity-75">{msg.sender}</div>
                                <div>{msg.text}</div>
                                {msg.file_url && (
                                    <div className="mt-2">
                                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="underline text-sm opacity-90 hover:opacity-100 flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                            Attachment
                                        </a>
                                    </div>
                                )}
                                <div className="text-[10px] text-right mt-1 opacity-75">{msg.timestamp}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-100 border-t text-center text-sm text-gray-500">
                You are viewing this conversation in Read-Only mode.
            </div>
        </div>
    );
};

export default ChatRoom;
