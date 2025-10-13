import React, { useState, useRef, useEffect } from "react";
import { generateText } from "../api/gemini";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const ChatHeader = styled.div`
  height: 64px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-weight: 600;
  font-size: 18px;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Message = styled.div`
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isUser ? "#0078ff" : "#e9ecef")};
  color: ${(props) => (props.isUser ? "#fff" : "#000")};
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 70%;
  white-space: pre-wrap;
`;

const ChatInputContainer = styled.div`
  border-top: 1px solid #e0e0e0;
  padding: 12px 20px;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: none;
  font-size: 15px;
  height: 60px;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #0078ff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005fcc;
  }
`;

function Chat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "안녕하세요! 무엇을 도와드릴까요?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const aiResponse = await generateText(inputText);
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ 오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <Sidebar />
      <MainSection>
        <ChatHeader>MIMIC Chat</ChatHeader>

        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} isUser={msg.sender === "user"}>
              {msg.text}
            </Message>
          ))}
          {isTyping && <Message>💬 AI가 응답을 작성 중...</Message>}
          <div ref={messagesEndRef} />
        </ChatMessages>

        <ChatInputContainer>
          <ChatInput
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <SendButton onClick={handleSend}>전송</SendButton>
        </ChatInputContainer>
      </MainSection>
    </ChatContainer>
  );
}

export default Chat;
