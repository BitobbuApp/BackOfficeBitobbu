import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ChatList from '../../components/Chat/ChatList';
import ChatRoom from '../../components/Chat/ChatRoom';

const ChatPage = () => {
    const [socket, setSocket] = useState(null);
    const [activeConversation, setActiveConversation] = useState(null);

    useEffect(() => {
        // Assume auth token is stored in localStorage
        const token = localStorage.getItem('token');

        const newSocket = io('http://localhost:3001', { // Adjust URL based on actual backend
            auth: { token }
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return (
        <div className="h-full flex flex-col bg-white">
            <h1 className="text-2xl font-bold p-4 border-b">Real-Time Chat Viewer</h1>
            <div className="flex-1 overflow-hidden">
                 <PanelGroup direction="horizontal">
                    <Panel defaultSize={30} minSize={20} className="border-r">
                        <ChatList onSelectConversation={setActiveConversation} />
                    </Panel>
                    <PanelResizeHandle className="w-2 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors" />
                    <Panel defaultSize={70} minSize={30}>
                        {activeConversation ? (
                            <ChatRoom conversationId={activeConversation.id} socket={socket} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500">
                                Select a conversation to view
                            </div>
                        )}
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
};

export default ChatPage;
