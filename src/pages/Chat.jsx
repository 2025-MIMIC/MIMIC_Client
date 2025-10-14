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
  const [aiProfile, setAiProfile] = useState("윤지 쌤 안녕하세여~");
  
  // localStorage 키 상수임. 데이터 저장/불러오기에 사용하는 거
  const SESSIONS_KEY = "mimic_sessions";
  const AI_NAME_KEY = "mimic_aiName";
  const AI_PROFILE_KEY = "mimic_aiProfile";

  // 현재 채팅 세션의 메시지 목록
  const [messages, setMessages] = useState([]);
  // 사용자 입력 텍스트
  const [inputText, setInputText] = useState("");
  // AI 응답 대기 중 표시 여부
  const [isTyping, setIsTyping] = useState(false);
  // 메시지 목록의 끝을 참조하여 자동 스크롤에 사용
  const messagesEndRef = useRef(null);
  // 전체 채팅 세션 목록
  const [chatSessions, setChatSessions] = useState([]);
  // 현재 활성화된 세션 ID
  const [activeSessionId, setActiveSessionId] = useState(null);

  // 새 메시지가 추가될 때마다 채팅창을 맨 아래로 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 컴포넌트 마운트 시 localStorage에서 세션과 프로필 불러오기
  useEffect(() => {
    // 저장된 세션 목록 불러오기
    const sessionsRaw = localStorage.getItem(SESSIONS_KEY);
    let sessions = [];
    if (sessionsRaw) {
      try {
        sessions = JSON.parse(sessionsRaw);
      } catch (e) {
        sessions = [];
      }
    }

    // 세션이 없으면 기본 세션 생성
    if (!sessions || sessions.length === 0) {
      const id = String(Date.now());
      const initialMessage = { sender: "ai", text: "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요." };
      const sessionMeta = { id, title: "새 대화", lastMessage: initialMessage.text };
      sessions = [sessionMeta];
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      localStorage.setItem(`mimic_messages_${id}`, JSON.stringify([initialMessage]));
    }

    setChatSessions(sessions);
    
    // 저장된 이름과 프로필 불러오기
    const storedAiName = localStorage.getItem(AI_NAME_KEY) || "TEST AI";
    const storedAiProfile = localStorage.getItem(AI_PROFILE_KEY) || "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요." ;
    setAiName(storedAiName);
    setAiProfile(storedAiProfile);

    // 첫 번째 세션을 활성화
    const activeId = sessions[0].id;
    setActiveSessionId(activeId);

    // 해당 세션의 메시지 불러오기
    const msgsRaw = localStorage.getItem(`mimic_messages_${activeId}`);
    if (msgsRaw) {
      try {
        setMessages(JSON.parse(msgsRaw));
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  }, []);

  // 이름/프로필이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem(AI_NAME_KEY, aiName);
    localStorage.setItem(AI_PROFILE_KEY, aiProfile);
    
    if (activeSessionId && aiName) {
      const updated = chatSessions.map(s => 
        s.id === activeSessionId ? { ...s, title: `${aiName}` } : s
      );
      setChatSessions(updated);
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    }
  }, [aiName, aiProfile]);

  // 메시지 전송 처리 함수
  const handleSend = async () => {
    // 빈 메시지는 예외처리
    if (!inputText.trim()) return;

    // 사용자 메시지를 즉시 화면에 표시
    const userMessage = { sender: "user", text: inputText };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      // AI 프로필을 프롬프트 앞에 포함하여 AI의 말투를 제어
      const promptWithProfile = `${aiProfile}\n\n${inputText}`;
      const aiResponse = await generateText(promptWithProfile);
      
      // AI 응답을 메시지 목록에 추가
      const newMessages = [...messages, { sender: "user", text: inputText }, { sender: "ai", text: aiResponse }];
      setMessages(newMessages);

      // 현재 활성 세션의 메시지를 localStorage에 저장
      if (activeSessionId) {
        localStorage.setItem(`mimic_messages_${activeSessionId}`, JSON.stringify(newMessages));
        
        // 세션의 마지막 메시지 업데이트 (사이드바 미리보기용)
        const updated = chatSessions.map(s => s.id === activeSessionId ? { ...s, lastMessage: aiResponse } : s);
        setChatSessions(updated);
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
      }
    } catch (error) {
      // 에러 발생 시 에러 메시지 표시
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ 오류가 발생했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 새 채팅 세션 생성
  const handleNewChat = () => {
    const id = String(Date.now()); // 현재 시간을 고유 ID로 사용
    const initialMessage = { sender: "ai", text: "원하는 말투 예시를 입력하거나, 특징을 말씀해 주세요."};
    const newSession = { 
      id, 
      title: aiName ? `${aiName}` : "새 대화",
      lastMessage: initialMessage.text 
    };

    // 새 세션을 목록 맨 앞에 추가 (최신순 정렬)
    const updated = [newSession, ...chatSessions];
    setChatSessions(updated);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    localStorage.setItem(`mimic_messages_${id}`, JSON.stringify([initialMessage]));
    
    // 새 세션을 활성화
    setActiveSessionId(id);
    setMessages([initialMessage]);
  };

  // 특정 세션 선택 시 해당 세션의 메시지 불러오기
  const handleSelectSession = (id) => {
    setActiveSessionId(id);
    const msgsRaw = localStorage.getItem(`mimic_messages_${id}`);
    if (msgsRaw) {
      try {
        setMessages(JSON.parse(msgsRaw));
      } catch (e) {
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };

  // 특정 세션 삭제
  const handleDeleteSession = (id) => {
    // 세션 목록에서 해당 세션 제거
    const filtered = chatSessions.filter(s => s.id !== id);
    setChatSessions(filtered);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(filtered));
    localStorage.removeItem(`mimic_messages_${id}`);
    
    // 삭제된 세션이 현재 활성 세션이면 다른 세션으로 전환
    if (activeSessionId === id) {
      if (filtered.length > 0) {
        handleSelectSession(filtered[0].id);
      } else {
        handleNewChat(); // 남은 세션이 없으면 새 세션 생성
      }
    }
  };

  // 모든 세션 삭제
  const handleDeleteAll = () => {
    // 모든 세션의 메시지 데이터 삭제
    const ids = chatSessions.map(s => s.id);
    ids.forEach(id => localStorage.removeItem(`mimic_messages_${id}`));
    localStorage.removeItem(SESSIONS_KEY);
    setChatSessions([]);
    
    // 새로운 세션 생성
    handleNewChat();
  };

  // Enter 키 입력 처리 (Shift+Enter는 줄바꿈, Enter만은 전송)
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      {/* 왼쪽 사이드바 - 세션 목록, AI 설정 등 */}
      <Sidebar
        userName={"유저이름입력받아야됨"}
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
      
      {/* 메인 채팅 영역 */}
      <MainSection>
        <ChatHeader>MIMIC Chat</ChatHeader>

        {/* 메시지 목록 */}
        <ChatMessages>
          {messages.map((msg, idx) => (
            <Message key={idx} isUser={msg.sender === "user"}>
              {msg.text}
            </Message>
          ))}
          {/* AI 응답 대기 중 표시 */}
          {isTyping && <Message>💬 AI가 응답을 작성 중...</Message>}
          {/* 자동 스크롤을 위한 참조 요소 */}
          <div ref={messagesEndRef} />
        </ChatMessages>

        {/* 메시지 입력 영역 */}
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