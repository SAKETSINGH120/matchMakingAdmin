import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spin, Tag } from "antd";
import toast from "react-hot-toast";
import { getChatHistory } from "../../Services/MatchApi";
import { format } from "date-fns";

const ChatHistory = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const result = await getChatHistory(matchId);
        if (result?.success) {
          setChatData(result.data);
        }
      } catch {
        toast.error("Error fetching chat history");
      } finally {
        setLoading(false);
      }
    };
    fetchChat();
  }, [matchId]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!chatData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No chat data found.</p>
      </div>
    );
  }

  const {
    participants,
    messages,
    chatEnabled,
    status,
    compatibilityScore,
    matchedAt,
  } = chatData;
  const participant1 = participants?.[0];
  const participant2 = participants?.[1];

  const isFirstParticipant = (senderId) => senderId === participant1?._id;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50">
      <div className="px-6 py-4 border-b bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors bg-gray-400 rounded-md px-2 py-1"
            >
              Back
            </button>
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                {participant1?.name} & {participant2?.name}
              </h2>
              <div className="flex items-center gap-3 mt-1">
                {/* <Tag
                  color={
                    status === "approved"
                      ? "green"
                      : status === "pending"
                        ? "orange"
                        : "red"
                  }
                >
                  {status?.toUpperCase()}
                </Tag> */}
                {matchedAt && (
                  <span className="text-xs text-gray-400">
                    Matched: {format(new Date(matchedAt), "dd MMM yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>
          <Tag color={chatEnabled ? "green" : "red"}>
            Chat {chatEnabled ? "Enabled" : "Disabled"}
          </Tag>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages?.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet.
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-1.5">
            {messages?.map((msg) => {
              const isFirst = isFirstParticipant(msg.sender?._id);
              return (
                <div
                  key={msg._id}
                  className={`flex ${isFirst ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[260px] px-3 py-1.5 rounded-xl text-xs ${
                      isFirst
                        ? "bg-indigo-500 text-white rounded-bl-none"
                        : "bg-gray-200 text-gray-800 rounded-br-none"
                    }`}
                  >
                    <p className="font-bold opacity-80 text-[10px]">
                      {msg.sender?.name}
                    </p>
                    <p>{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-[9px] opacity-60">
                        {format(new Date(msg.createdAt), "hh:mm a")}
                      </span>
                      {msg.seen && (
                        <span className="text-[9px] opacity-60">Seen</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
