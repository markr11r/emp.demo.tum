import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Websocket.css";
import { useAuth } from 'context/auth-provider'

const TestSocketIO = ({ cartAccount }) => {
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxContent, setLightboxContent] = useState("");
  const socketList = process.env.REACT_APP_WEBSOCKET_URLS;
  const socketUrls = socketList.split(',')
  const { userTenant: tenant } = useAuth()

  useEffect(() => {
    const sockets = []; // Array to store socket connections

    const handleWebhookEvent = (data) => {
      console.log("Webhook event received:", data);

      // Ensure data is an object and contains the payload
      if (
        data &&
        data.payload?.tenant === tenant &&
        data.payload?.action === "REFRESH-CART" &&
        data.payload?.cart_id === cartAccount.id
      ) {
        setLightboxContent(data.payload.response);
        setLightboxVisible(true);
      }
    };

    // Dynamically create sockets for each URL in the array
    socketUrls.forEach((url) => {
      const socket = io(url);

      socket.on("connect", () => {
        console.log(`Connected to webhook: ${url}`, socket.id);
      });

      socket.on("webhook_event", handleWebhookEvent);

      socket.on("connect_error", (error) => {
        console.error(`Connection error on webhook: ${url}`, error);
      });

      socket.on("disconnect", (reason) => {
        console.log(`Disconnected from webhook: ${url}`, reason);
      });

      // Store the socket in the array for cleanup
      sockets.push(socket);
    });

    // Clean up all sockets on component unmount
    return () => {
      sockets.forEach((socket) => socket.disconnect());
    };
  }, [cartAccount]);

  const handleClose = () => {
    // Refresh the page
    window.location.reload();
  };

  return (
    <div>
      {lightboxVisible && (
        <div className="lightbox">
          <div className="lightbox-content">
            <p>{lightboxContent}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSocketIO;
