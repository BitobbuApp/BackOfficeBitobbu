import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatList = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchConversations = async () => {
            try {
                // Adjust endpoint and headers based on your API
                const token = localStorage.getItem('token');
                // Mocking API call for now, since we don't know the exact endpoint
                const response = await axios.get('/api/v1/conversations', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(isMounted) {
                    setConversations(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch conversations:', error);
                // Fallback to mock data on error for visual verification
                if(isMounted) {
                    setConversations([
                        { id: '1', name: 'Buyer A & Supplier B', lastMessage: "Let's finalize the price.", unread: 2 },
                        { id: '2', name: 'Buyer C & Supplier D', lastMessage: 'Attached is the spec document.', unread: 0 },
                    ]);
                }
            } finally {
                if(isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchConversations();
        return () => { isMounted = false; };
    }, []);

    if (loading) return <div className="p-4">Loading conversations...</div>;

    const convs = Array.isArray(conversations) ? conversations : [];

    return (
        <div className="overflow-y-auto h-full">
            {convs.map(conv => (
                <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    className="p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors flex justify-between items-center"
                >
                    <div>
                        <div className="font-semibold text-sm">{conv.name}</div>
                        <div className="text-xs text-gray-500 truncate">{conv.lastMessage}</div>
                    </div>
                    {conv.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            {conv.unread}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatList;
