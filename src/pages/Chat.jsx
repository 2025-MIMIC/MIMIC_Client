import React, { useState, useRef, useEffect } from "react";
import { generateText } from "../api/gemini"; // Gemini API 요청 함수
import styled from "styled-components";
import Sidebar from "../components/Sidebar"; // 세션 목록/설정 관리 Sidebar
import NewChatModal from "../components/NewChatModal";
import enterIcon from "../assets/enter_icon.svg";
import { useLocation } from "react-router-dom";

// ------------------------------
// 📌 전체 레이아웃 스타일 정의
// ------------------------------
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

// 상단 헤더
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

// 메시지 표시 영역
const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// 메시지 말풍선
const Message = styled.div`
  align-self: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
  background-color: ${(props) => (props.isUser ? "#e9ecef" : "#7189BF")};
  color: ${(props) => (props.isUser ? "#000" : "#fff")};
  padding: 10px 14px;
  border-radius: 12px;
  max-width: 70%;
  white-space: pre-wrap;
`;

// 입력창 영역
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
  background-color: #96b6ff;
  color: white;
  border: none;
  padding: 12px 12px;
  border-radius: 10000px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background-color: #7189bf;
  }
`;

// ------------------------------
// 📌 채팅 메인 컴포넌트
// ------------------------------
function Chat() {
  const location = useLocation();
  const userName = location.state?.userName || "사용자"; // 로그인한 사용자 이름

  // AI 이름 및 말투 설정
  const [aiName, setAiName] = useState("미믹");
  const [aiProfile, setAiProfile] = useState("일반적인, 자연스러운 말투로 대화합니다.");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 로컬스토리지 키들
  const SESSIONS_KEY = "mimic_sessions";
  const AI_NAME_KEY = "mimic_aiName";
  const getProfileKey = (id) => `mimic_aiProfile_${id}`;

  // 메시지/입력/세션 관련 상태 값들
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [chatSessions, setChatSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  // ------------------------------
  // 메시지가 추가될 때 스크롤 자동 이동
  // ------------------------------
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------------------
  // 📌 초기 로딩: 세션 불러오기 + 초기 세션 생성
  // ------------------------------
  useEffect(() => {
    /**
     * 1. 저장된 세션 불러오기
     * 2. 아무 세션도 없으면 기본 대화방 자동 생성
     */
    const sessionsRaw = localStorage.getItem(SESSIONS_KEY);
    let sessions = [];

    if (sessionsRaw) {
      try {
        sessions = JSON.parse(sessionsRaw);
      } catch {
        sessions = [];
      }
    }

    // 첫 접속 → 기본 세션 1개 생성
    if (!sessions || sessions.length === 0) {
      const id = String(Date.now());
      const initialMessage = {
        sender: "ai",
        text: "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요.",
      };
      const sessionMeta = { id, title: "새 대화", lastMessage: initialMessage.text };

      sessions = [sessionMeta];

      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(`mimic_messages_${id}`, JSON.stringify([initialMessage]));
      localStorage.setItem(getProfileKey(id), "일반적인, 자연스러운 말투로 대화합니다.");
    }

    setChatSessions(sessions);

    // AI 이름 불러오기
    const storedAiName = localStorage.getItem(AI_NAME_KEY) || "미믹";
    setAiName(storedAiName);

    // 첫 세션 활성화
    const activeId = sessions[0].id;
    setActiveSessionId(activeId);

    // 해당 세션의 메시지/말투 불러오기
    const msgsRaw = localStorage.getItem(`mimic_messages_${activeId}`);
    const storedProfile =
      localStorage.getItem(getProfileKey(activeId)) || "일반적인, 자연스러운 말투로 대화합니다.";

    setAiProfile(storedProfile);

    if (msgsRaw) {
      try {
        setMessages(JSON.parse(msgsRaw));
      } catch {
        setMessages([]);
      }
    }
  }, []);

  // ------------------------------
  // AI 이름이 변경될 때마다 저장
  // ------------------------------
  useEffect(() => {
    localStorage.setItem(AI_NAME_KEY, aiName);
  }, [aiName]);

  // ------------------------------
  // 세션별 말투 저장
  // ------------------------------
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem(getProfileKey(activeSessionId), aiProfile);
    }
  }, [aiProfile, activeSessionId]);

  // ------------------------------
  // 📌 메시지 전송 처리
  // ------------------------------
  const handleSend = async () => {
    if (!inputText.trim()) return;

    /**
     * 첫 메시지라면 → 입력된 내용은 "말투 프롬프트"로 저장
     */
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

    // 1. 사용자가 입력한 메시지를 화면에 반영
    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // 최근 메시지 10개만 정리 → 프롬프트에 포함
      const recentMessages = messages.slice(-10);
      const conversationHistory = recentMessages
        .map((msg) => `${msg.sender === "user" ? userName : aiName}: ${msg.text}`)
        .join("\n");

      // AI 말투/성격을 지정하는 System Prompt
      const systemPrompt = `
        당신은 ${aiName}이라는 이름의 AI 챗봇입니다.  
        이 세션의 말투/성격: "${aiProfile}"
        - 이 말투를 기반으로 자연스럽고 감정이 느껴지는 대화를 이어갑니다.
        - 항상 다음 질문으로 마무리해 대화를 이어갑니다.
      `;

      const prompt = `
        ${systemPrompt}
        이전 대화:
        ${conversationHistory}
        새 메시지:
        ${userName}: ${inputText}
        ${aiName}:
      `;

      // Gemini API 호출
      const aiResponse = await generateText(prompt);

      // 메시지 저장 + 화면 반영
      const newMessages = [
        ...messages,
        { sender: "user", text: inputText },
        { sender: "ai", text: aiResponse.trim() },
      ];
      setMessages(newMessages);

      // 세션 데이터 업데이트
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

  // ------------------------------
  // 새 대화 시작 → 모달 열기
  // ------------------------------
  const handleNewChat = () => {
    setIsModalOpen(true);
  };

  // 새 대화 저장
  const handleSaveChat = (name, profile) => {
    const id = String(Date.now());
    const initialMessage = {
      sender: "ai",
      text: "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요.",
    };

    // 새 세션 생성
    const newSession = { id, title: name || "새 대화", lastMessage: initialMessage.text };
    const updated = [newSession, ...chatSessions];
    setChatSessions(updated);

    // 로컬스토리지에 저장
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    localStorage.setItem(`mimic_messages_${id}`, JSON.stringify([initialMessage]));
    localStorage.setItem(getProfileKey(id), profile || "일반적인, 자연스러운 말투로 대화합니다.");

    // 활성 세션 변경
    setActiveSessionId(id);
    setAiName(name || "미믹");
    setAiProfile(profile || "일반적인, 자연스러운 말투로 대화합니다.");
    setMessages([initialMessage]);
    setIsModalOpen(false);
  };

  // ------------------------------
  // 세션 선택
  // ------------------------------
  const handleSelectSession = (id) => {
    setActiveSessionId(id);

    const msgsRaw = localStorage.getItem(`mimic_messages_${id}`);
    const storedProfile =
      localStorage.getItem(getProfileKey(id)) || "일반적인, 자연스러운 말투로 대화합니다.";
    setAiProfile(storedProfile);

    if (msgsRaw) {
      try {
        setMessages(JSON.parse(msgsRaw));
      } catch {
        setMessages([]);
      }
    }
  };

  // ------------------------------
  // 세션 하나 삭제
  // ------------------------------
  const handleDeleteSession = (id) => {
    const filtered = chatSessions.filter((s) => s.id !== id);
    setChatSessions(filtered);

    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`mimic_messages_${id}`);
    localStorage.removeItem(getProfileKey(id));

    // 현재 세션을 삭제했다면 → 다른 세션으로 이동 또는 새 대화 생성
    if (activeSessionId === id) {
      if (filtered.length > 0) {
        handleSelectSession(filtered[0].id);
      } else {
        handleNewChat();
      }
    }
  };

  // ------------------------------
  // 모든 세션 삭제
  // ------------------------------
  const handleDeleteAll = () => {
    chatSessions.forEach((s) => {
      localStorage.removeItem(`mimic_messages_${s.id}`);
      localStorage.removeItem(getProfileKey(s.id));
    });
    localStorage.removeItem(SESSIONS_KEY);

    setChatSessions([]);
    setActiveSessionId(null);
    setMessages([]);
    setIsModalOpen(true); // 완전 초기화 → 새 모달 띄움
  };

  // ------------------------------
  // Enter 키로 메시지 전송
  // ------------------------------
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ------------------------------
  // 📌 렌더링
  // ------------------------------
  return (
    <ChatContainer>
      {/* 왼쪽 사이드바: 세션 관리 + AI 정보 설정 */}
      <Sidebar
        userName={userName}
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

      {/* 오른쪽: 실제 채팅 인터페이스 */}
      <MainSection>
        <ChatHeader>MIMIC Chat</ChatHeader>

        {/* 메시지 표시 영역 */}
        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} isUser={msg.sender === "user"}>
              {msg.text}
            </Message>
          ))}
          {isTyping && <Message>💬 {aiName}이 생각 중...</Message>}
          <div ref={messagesEndRef} />
        </ChatMessages>

        {/* 입력창 */}
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

      {/* 새 세션 생성 모달 */}
      {isModalOpen && (
        <NewChatModal onClose={() => setIsModalOpen(false)} onSave={handleSaveChat} />
      )}
    </ChatContainer>
  );
}

export default Chat;