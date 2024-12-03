import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Websocket.css";

const TestSocketIO = () => {
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxContent, setLightboxContent] = useState("");

  useEffect(() => {
    const socket = io("https://emporix-webhook-relay-nicolas6300.replit.app/ws/8786eaa5-021a-44ab-a9a4-b09c1664edb5");

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Listen for the `webhook_event`
    socket.on("webhook_event", (data) => {
      console.log("Webhook event received:", data);

      // Ensure data is an object and contains the payload
      if (data && data.payload?.action === "REFESH-CART") {
        setLightboxContent(data.payload.response);
        setLightboxVisible(true);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
