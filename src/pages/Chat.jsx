import React, { useState, useRef, useEffect } from "react";
import { generateText } from "../api/gemini";
import styled from "styled-components";
import Sidebar from "../components/Sidebar";
import enterIcon from "../assets/enter_icon.svg";

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  max-width: 1920px;
  max-height: 1080px;
  margin: 0 auto;
  background-color: #fff;
  overflow: hidden;
  position: relative;
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
`;

const ChatHeader = styled.div`
  height: 64px;
  background-color: #fff;
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
  background-color: ${(props) => (props.isUser ? "#e9ecef" : "#7189BF")};
  color: ${(props) => (props.isUser ? "#000" : "#fff")};
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 70%;
  white-space: pre-wrap;
`;

const ChatInputContainer = styled.div`
  border-top: 1px solid #ffffff;
  padding: 12px 20px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #ffffff;
  resize: none;
  font-size: 15px;
  height: 60px;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #96B6FF;
  color: white;
  border: none;
  padding: 12px 12px;
  border-radius: 10000px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #7189BF;
  }
`;

function Chat() {
  const [aiName, setAiName] = useState("미믹");
  const [aiProfile, setAiProfile] = useState("일반적인, 자연스러운 말투로 대화합니다."); // 기본 말투
  
  const SESSIONS_KEY = "mimic_sessions";
  const AI_NAME_KEY = "mimic_aiName";

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // 세션별 aiProfile 저장
  const getProfileKey = (id) => `mimic_aiProfile_${id}`;

  // 스크롤 자동 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // localStorage 불러오기
  useEffect(() => {
    const sessionsRaw = localStorage.getItem(SESSIONS_KEY);
    let sessions = [];
    if (sessionsRaw) {
      try {
        sessions = JSON.parse(sessionsRaw);
      } catch {
        sessions = [];
      }
    }

    if (!sessions || sessions.length === 0) {
      const id = String(Date.now());
      const initialMessage = { sender: "ai", text: "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요." };
      const sessionMeta = { id, title: "새 대화", lastMessage: initialMessage.text };
      sessions = [sessionMeta];
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(`mimic_messages_${id}`, JSON.stringify([initialMessage]));
      localStorage.setItem(getProfileKey(id), "일반적인, 자연스러운 말투로 대화합니다.");
    }

    setChatSessions(sessions);

    const storedAiName = localStorage.getItem(AI_NAME_KEY) || "미믹";
    setAiName(storedAiName);

    const activeId = sessions[0].id;
    setActiveSessionId(activeId);

    const msgsRaw = localStorage.getItem(`mimic_messages_${activeId}`);
    const storedProfile = localStorage.getItem(getProfileKey(activeId)) || "일반적인, 자연스러운 말투로 대화합니다.";
    setAiProfile(storedProfile);

    if (msgsRaw) {
      try {
        setMessages(JSON.parse(msgsRaw));
      } catch {
        setMessages([]);
      }
    }
  }, []);

  // 이름 변경 시 저장
  useEffect(() => {
    localStorage.setItem(AI_NAME_KEY, aiName);
  }, [aiName]);

  // aiProfile 변경 시 세션별로 저장
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(getProfileKey(activeSessionId), aiProfile);
    }
  }, [aiProfile, activeSessionId]);

  //  메시지 전송
  const handleSend = async () => {
  if (!inputText.trim()) return;

  // 첫 사용자 메시지라면 → aiProfile로 저장
  if (messages.length === 1 && messages[0].sender === "ai") {
    setAiProfile(inputText.trim());
    localStorage.setItem(getProfileKey(activeSessionId), inputText.trim());
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputText },
      { sender: "ai", text: "말투를 적용했습니다. 이제 대화를 시작해볼까요?" },
    ]);
    setInputText("");
    return;
  }

  // 이후는 기존 로직 그대로
  const userMessage = { sender: "user", text: inputText };
  setMessages((prev) => [...prev, userMessage]);
  setInputText("");
  setIsTyping(true);

  await fetch("http://localhost:3001/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: activeSessionId,
      sender: "user",
      text: inputText,
    }),
  });

  try {
    const recentMessages = messages.slice(-10);
    const conversationHistory = recentMessages
      .map(msg => `${msg.sender === "user" ? "수민" : aiName}: ${msg.text}`)
      .join("\n");

    const systemPrompt = `
당신은 ${aiName}이라는 이름의 AI 챗봇입니다.  
아래는 이 세션의 말투와 성격에 대한 설명입니다:
"${aiProfile}"

- 이 말투를 기반으로 자연스럽고 감정이 느껴지는 대화를 이어갑니다.  
- 새로운 대화를 만들어가는 느낌으로 한 가지 질문을 던지세요. 
`;

    const prompt = `
${systemPrompt}

이전 대화:
${conversationHistory}

새 메시지:
수민: ${inputText}
${aiName}:
`;

    const aiResponse = await generateText(prompt);

    const newMessages = [
      ...messages,
      { sender: "user", text: inputText },
      { sender: "ai", text: aiResponse.trim() },
    ];
    setMessages(newMessages);

    if (activeSessionId) {
      localStorage.setItem(`mimic_messages_${activeSessionId}`, JSON.stringify(newMessages));

      const updated = chatSessions.map((s) =>
        s.id === activeSessionId ? { ...s, lastMessage: aiResponse } : s
      );
      setChatSessions(updated);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    }
  } catch {
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "⚠️ 오류가 발생했습니다. 다시 시도해 주세요." },
    ]);
  } finally {
    setIsTyping(false);
  }
};


  // 새 세션 만들 때마다 독립적인 aiProfile 생성
  const handleNewChat = () => {
    const id = String(Date.now());
    const initialMessage = { sender: "ai", text: "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요." };
    const newSession = { id, title: aiName, lastMessage: initialMessage.text };

    const updated = [newSession, ...chatSessions];
    setChatSessions(updated);

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    localStorage.setItem(`mimic_messages_${id}`, JSON.stringify([initialMessage]));
    localStorage.setItem(getProfileKey(id), "일반적인, 자연스러운 말투로 대화합니다."); // 말투 저장

    setActiveSessionId(id);
    setAiProfile("일반적인, 자연스러운 말투로 대화합니다."); //현재 세션용 초기화
    setMessages([initialMessage]);
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);

    const msgsRaw = localStorage.getItem(`mimic_messages_${id}`);
    const storedProfile = localStorage.getItem(getProfileKey(id)) || "일반적인, 자연스러운 말투로 대화합니다.";
    setAiProfile(storedProfile);

    if (msgsRaw) {
      try {
        setMessages(JSON.parse(msgsRaw));
      } catch {
        setMessages([]);
      }
    }
  };

  const handleDeleteSession = (id) => {
    const filtered = chatSessions.filter(s => s.id !== id);
    setChatSessions(filtered);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`mimic_messages_${id}`);
    localStorage.removeItem(getProfileKey(id)); //프로필도 삭제

    if (activeSessionId === id) {
      if (filtered.length > 0) {
        handleSelectSession(filtered[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  const handleDeleteAll = () => {
    chatSessions.forEach(s => {
      localStorage.removeItem(`mimic_messages_${s.id}`);
      localStorage.removeItem(getProfileKey(s.id));
    });
    localStorage.removeItem(SESSIONS_KEY);
    setChatSessions([]);
    handleNewChat();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <Sidebar
        userName={"수민"} //여기 나중에 로그인할 때 받은 값으로 바꿔야 함
        aiName={aiName}
        aiProfile={aiProfile}
        chatSessions={chatSessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onDeleteAll={handleDeleteAll}
        onUpdateAI={({ name, profile }) => {
          if (name) setAiName(name);
          if (profile) setAiProfile(profile);
        }}
      />

      <MainSection>
        <ChatHeader>MIMIC Chat</ChatHeader>

        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} isUser={msg.sender === "user"}>
              {msg.text}
            </Message>
          ))}
          {isTyping && <Message>💬 {aiName}가 생각 중...</Message>}
          <div ref={messagesEndRef} />
        </ChatMessages>

        <ChatInputContainer>
          <ChatInput
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="메시지를 입력하세요..."
          />
          <SendButton onClick={handleSend}>
            <img src={enterIcon} alt="전송" style={{ width: 21, height: 21 }} />
          </SendButton>
        </ChatInputContainer>
      </MainSection>
    </ChatContainer>
  );
}

export default Chat;
