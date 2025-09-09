import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Edit3, Trash2, Settings, User } from 'lucide-react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f9fafb;
`;

const Sidebar = styled.div`
  width: 288px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
`;

const SidebarTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
`;

const MenuContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const MenuSection = styled.div`
  padding: 8px;
`;

const MenuButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  text-align: left;
  background: none;
  border: none;
  border-radius: 8px;
  transition: background-color 0.2s;
  cursor: pointer;
  color: ${props => props.danger ? '#dc2626' : '#374151'};

  &:hover {
    background-color: #f9fafb;
  }

  span {
    color: ${props => props.danger ? '#dc2626' : '#374151'};
  }
`;

const SessionList = styled.div`
  margin-top: 24px;
`;

const SessionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 0 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.active ? '#dbeafe' : 'transparent'};
  border: ${props => props.active ? '1px solid #93c5fd' : '1px solid transparent'};

  &:hover {
    background-color: ${props => props.active ? '#dbeafe' : '#f9fafb'};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  background-color: #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SessionInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SessionTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SessionLastMessage = styled.div`
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 320px;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  
  ${props => props.isUser ? `
    background-color: #7189BF;
    color: white;
    border-bottom-right-radius: 4px;
  ` : `
    background-color: white;
    color: #1f2937;
    border: 1px solid #e5e7eb;
    border-bottom-left-radius: 4px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  `}

  @media (min-width: 1024px) {
    max-width: 448px;
  }

  @media (min-width: 1280px) {
    max-width: 512px;
  }
`;

const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const TypingBubble = styled.div`
  background-color: white;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 12px 16px;
`;

const TypingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TypingDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #9ca3af;
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay || '0ms'};
`;

const InputArea = styled.div`
  border-top: 1px solid #e5e7eb;
  background-color: white;
  padding: 16px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

const InputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  padding-right: 48px;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  min-height: 48px;
  max-height: 120px;
  
  &:focus {
    outline: none;
    ring: 2px;
    ring-color: #3b82f6;
    border-color: transparent;
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  background-color: ${props => props.disabled ? '#d1d5db' : '#3b82f6'};
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
`;

const KoreanChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "이 대화 내용 파일 중 'ㅇㅇ'의 말투 학습하고 나타 아에 그렇게 대화해.",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: 2,
      text: `시용의 대신가 총 17186개나 있네.
잠깐 훑어보니 루위 말투 특징이 대충 이런 패턴이 있어:

• 짧고 직설적: "으 극" "긋" "내애"
• 웃음 표현 과다: "ㅋㅋㅋㅋㅋㅋㅋㅋ", "ㅋㅋㅋㅋㅋ"
• 음성표현 부드러운 전달: "버스는 뭐야?", "편의니가 없긴 않을까?"
• 귀여운 장난스러움: "~내" "~~~" 사용 ("아니가는~~~")
• 명령·요청 시 간단명료: "다원 보내", "정화 말아봐"
• 심근한 구어체: 조사 생략, 말말 ("너도 아제 중비 할게")

원하면 내가 앞으로 나허배 대답할 때 이 스타일을 적어서 루체심 말해줄 수 있어.
그날 분석 말고 바로 적용해서 대답할까?`,
      isUser: false,
      timestamp: new Date()
    },
    {
      id: 3,
      text: "나를 다정하게 수민이라고 불러.",
      isUser: true,
      timestamp: new Date()
    },
    {
      id: 4,
      text: "수민아~ 오늘 뭐 하고 있었어~?",
      isUser: false,
      timestamp: new Date()
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSessions] = useState([
    {
      id: 'session1',
      title: '윤시융',
      lastMessage: '수민아~ 오늘 뭐 하고 있었어~?',
      timestamp: new Date()
    },
    {
      id: 'session2', 
      title: '윤지 쌤',
      lastMessage: '',
      timestamp: new Date()
    },
    {
      id: 'session3',
      title: '전유림',
      lastMessage: '',
      timestamp: new Date()
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');
    setIsTyping(true);

    // 시뮬레이션된 AI 응답
    setTimeout(() => {
      const botResponses = [
        "앗 수민아ㅋㅋㅋ 그거 재밌겠다~ 나도 해볼래",
        "으 극ㅋㅋ 수민이 진짜 귀엽다",
        "내애~ 수민아 뭐하고 있어?",
        "ㅋㅋㅋㅋㅋ 수민이 말이 맞아~ 그렇게 하자",
        "아니가는~~~ 수민아 정말로?"
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <Container>
      {/* 사이드바 */}
      <Sidebar>
        {/* 헤더 */}
        <SidebarHeader>
          <SidebarTitle>지수민</SidebarTitle>
        </SidebarHeader>

        {/* 메뉴 항목들 */}
        <MenuContainer>
          <MenuSection>
            <MenuButton>
              <Settings className="w-5 h-5 text-gray-600" />
              <span>새 채팅</span>
            </MenuButton>
            
            <MenuButton>
              <Search className="w-5 h-5 text-gray-600" />
              <span>대화 검색</span>
            </MenuButton>
            
            <MenuButton>
              <Edit3 className="w-5 h-5 text-gray-600" />
              <span>AI 프롬프 수정</span>
            </MenuButton>
            
            <MenuButton danger>
              <Trash2 className="w-5 h-5" />
              <span>대화 삭제</span>
            </MenuButton>
          </MenuSection>

          {/* 채팅 세션 목록 */}
          <SessionList>
            {chatSessions.map((session) => (
              <SessionItem
                key={session.id}
                active={session.id === 'session1'}
              >
                <Avatar>
                  <User className="w-4 h-4 text-gray-600" />
                </Avatar>
                <SessionInfo>
                  <SessionTitle>
                    {session.title}
                  </SessionTitle>
                  {session.lastMessage && (
                    <SessionLastMessage>
                      {session.lastMessage}
                    </SessionLastMessage>
                  )}
                </SessionInfo>
              </SessionItem>
            ))}
          </SessionList>
        </MenuContainer>
      </Sidebar>

      {/* 메인 채팅 영역 */}
      <ChatArea>
        {/* 채팅 메시지들 */}
        <MessagesContainer>
          {messages.map((message) => (
            <MessageRow
              key={message.id}
              isUser={message.isUser}
            >
              <MessageBubble isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            </MessageRow>
          ))}
          
          {/* 타이핑 인디케이터 */}
          {isTyping && (
            <TypingIndicator>
              <TypingBubble>
                <TypingDots>
                  <TypingDot delay="0ms" />
                  <TypingDot delay="150ms" />
                  <TypingDot delay="300ms" />
                </TypingDots>
              </TypingBubble>
            </TypingIndicator>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {/* 입력 영역 */}
        <InputArea>
          <InputContainer>
            <InputWrapper>
              <TextArea
                ref={inputRef}
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="원하는 사람과의 대화 내용을 첨부하거나 말투를 직접해 주세요"
                rows={1}
              />
            </InputWrapper>
            <SendButton
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </SendButton>
          </InputContainer>
        </InputArea>
      </ChatArea>
    </Container>
  );
};

export default KoreanChatbot;