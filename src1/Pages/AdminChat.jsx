import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Input, Button, Avatar, Spin } from "antd";
import toast from "react-hot-toast";

const API_BASE = "/api/admin/chat";

export default function AdminChat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Fetch chat history
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/${matchId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages || []);
        } else {
          toast.error(data.message || "Failed to load chat");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching chat history");
        setLoading(false);
      });
  }, [matchId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Send message handler
  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, message: input }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            _id: Date.now(),
            sender: "admin",
            message: input,
            createdAt: new Date().toISOString(),
          },
        ]);
        setInput("");
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch {
      toast.error("Error sending message");
    }
    setSending(false);
  };

  // Enter key handler
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Chat bubble UI
  const renderMessage = (msg, idx) => {
    const isAdmin = msg.sender === "admin";
    return (
      <div
        key={msg._id || idx}
        className={`flex mb-3 ${isAdmin ? "justify-end" : "justify-start"}`}
      >
        {!isAdmin && (
          <Avatar
            className="mr-2"
            src={msg.userAvatar}
            icon={!msg.userAvatar && <Avatar />}
            size={36}
          />
        )}
        <div
          className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl shadow ${
            isAdmin
              ? "bg-[#5F6F5C]text-white rounded-br-none"
              : "bg-gray-200 text-gray-800 rounded-bl-none"
          }`}
        >
          <div className="text-sm">{msg.message}</div>
          <div className="text-xs mt-1 opacity-70 text-right">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        {isAdmin && (
          <Avatar
            className="ml-2"
            src={msg.adminAvatar}
            icon={!msg.adminAvatar && <Avatar />}
            size={36}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white">
        <h2 className="text-xl font-bold text-gray-800">Admin Chat</h2>
        <div className="text-sm text-gray-500">Match ID: {matchId}</div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Spin size="large" />
          </div>
        ) : (
          <div>
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                No messages yet.
              </div>
            ) : (
              messages.map(renderMessage)
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="px-4 py-3 bg-white border-t flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={sending}
          className="flex-1"
          size="large"
        />
        <Button
          type="primary"
          size="large"
          loading={sending}
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
