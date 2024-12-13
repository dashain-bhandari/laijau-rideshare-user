import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const SocketContext = createContext<Socket | null>(null);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const initializeSocket = async () => {
            try {
                const token = await AsyncStorage.getItem('user-token'); 
               
                if (token) {
                    const socketInstance = io(process.env.BACKEND_URL!, {
                        transports: ['websocket', 'polling', 'flashsocket'],
                        withCredentials: true,
                        auth: {
                            token, 
                        },
                    });
                    
                    setSocket(socketInstance);
                }
            } catch (error) {
                console.error("Error initializing socket:", error);
            }
        };

        initializeSocket();

        
        return () => {
            socket?.disconnect();
        };
    }, []);

  
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
