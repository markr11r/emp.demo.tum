import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Websocket.css";

const TestSocketIO = ({ cartAccount }) => {
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxContent, setLightboxContent] = useState("");

  useEffect(() => {
    // Function to handle webhook events
    const handleWebhookEvent = (data) => {
      console.log("Webhook event received:", data);

      // Ensure data is an object and contains the payload
      if (
        data &&
        data.payload?.action === "REFESH-CART" &&
        data.payload?.cart_id === cartAccount.id
      ) {
        setLightboxContent(data.payload.response);
        setLightboxVisible(true);
      }
    };

    // Connect to the first webhook
    const socket1 = io("https://emporix-webhook-relay-nicolas6300.replit.app/ws/8786eaa5-021a-44ab-a9a4-b09c1664edb5");

    socket1.on("connect", () => {
      console.log("Connected to first webhook:", socket1.id);
    });

    socket1.on("webhook_event", handleWebhookEvent);

    socket1.on("connect_error", (error) => {
      console.error("Connection error on first webhook:", error);
    });

    socket1.on("disconnect", (reason) => {
      console.log("Disconnected from first webhook:", reason);
    });

    // Connect to the second webhook
    //const socket2 = io("https://emporix-webhook-relay-nicolas6300.replit.app/ws/f3a993ec-02e6-42c3-b95b-9d1138ea600b");
    const socket2 = io("https://emporix-webhook-relay-nicolas6300.replit.app/ws/1ac18350-1eeb-4fdf-8992-945885468a8c");

    socket2.on("connect", () => {
      console.log("Connected to second webhook:", socket2.id);
    });

    socket2.on("webhook_event", handleWebhookEvent);

    socket2.on("connect_error", (error) => {
      console.error("Connection error on second webhook:", error);
    });

    socket2.on("disconnect", (reason) => {
      console.log("Disconnected from second webhook:", reason);
    });

    // Clean up the sockets on component unmount
    return () => {
      socket1.disconnect();
      socket2.disconnect();
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
