// Sidebar.jsx
import React from 'react';
import newChatIcon from '../assets/newchat_icon.svg';
import searchIcon from '../assets/search_icon.svg';
import editIcon from '../assets/edit_icon.svg';
import deleteIcon from '../assets/delete_icon.svg';
import avatarIcon from '../assets/react.svg';
import styled from 'styled-components';
import AIModal from './AIModal';

const SidebarContainer = styled.div`
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
  color: ${props => props.danger ? '#FF0000' : '#374151'};

  &:hover {
    background-color: #f9fafb;
  }

  span {
    color: ${props => props.danger ? '#FF0000' : '#374151'};
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

/**
 * 수정된 부분: 필요한 콜백들 모두 props로 받도록 추가했습니다.
 * onNewChat, onSelectSession, onDeleteSession, onDeleteAll 등이 Chat.jsx에서 전달되어야 합니다.
 */
const Sidebar = ({
  userName,
  chatSessions = [],
  activeSessionId,
  aiName = 'MIMIC AI',
  aiProfile = '친절하고 도움이 되는 AI입니다.',
  onNewChat,
  onSelectSession,
  onDeleteSession,
  onDeleteAll,
  onUpdateAI
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [localName, setLocalName] = React.useState(aiName);
  const [localProfile, setLocalProfile] = React.useState(aiProfile);

  React.useEffect(() => {
    setLocalName(aiName);
    setLocalProfile(aiProfile);
  }, [aiName, aiProfile]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const saveModal = () => {
    if (onUpdateAI) onUpdateAI({ name: localName, profile: localProfile });
    closeModal();
  };

  return (
    <SidebarContainer>
      {/* 헤더 */}
      <SidebarHeader>
        <SidebarTitle>{userName}</SidebarTitle>
      </SidebarHeader>

      {/* 메뉴 항목 */}
      <MenuContainer>
        <MenuSection>
          <MenuButton onClick={() => (typeof onNewChat === 'function' ? onNewChat() : null)}>
            <img src={newChatIcon} alt="새 채팅" style={{ width: 20, height: 20 }} />
            <span>새 채팅</span>
          </MenuButton>

          <MenuButton>
            <img src={searchIcon} alt="검색" style={{ width: 20, height: 20 }} />
            <span>대화 검색</span>
          </MenuButton>

          <MenuButton onClick={openModal}>
            <img src={editIcon} alt="수정" style={{ width: 20, height: 20 }} />
            <span>AI 프롬포트 수정</span>
          </MenuButton>

          {/* 전체 삭제: onDeleteAll만 호출하게 수정 */}
          <MenuButton danger onClick={() => {
            if (typeof onDeleteAll === 'function') {
              // 사용자 확인창 권장
              if (window.confirm('모든 대화를 삭제하고 초기화하시겠습니까?')) {
                onDeleteAll();
              }
            }
          }}>
            <img src={deleteIcon} alt="삭제" style={{ width: 20, height: 20 }} />
            <span>대화 전체 삭제</span>
          </MenuButton>
        </MenuSection>

        {/* 세션 목록 */}
        <SessionList>
          {chatSessions.map((session) => (
            <SessionItem
              key={session.id}
              active={session.id === activeSessionId}
              onClick={() => (typeof onSelectSession === 'function' ? onSelectSession(session.id) : null)}
            >
              <Avatar>
                <img src={avatarIcon} alt="아바타" style={{ width: 16, height: 16 }} />
              </Avatar>
              <SessionInfo>
                <SessionTitle>{session.title}</SessionTitle>
                {session.lastMessage && (
                  <SessionLastMessage>{session.lastMessage}</SessionLastMessage>
                )}
              </SessionInfo>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof onDeleteSession === 'function') onDeleteSession(session.id);
                }}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                aria-label="삭제"
              >
                <img src={deleteIcon} alt="삭제" style={{ width: 16, height: 16 }} />
              </button>
            </SessionItem>
          ))}
        </SessionList>
      </MenuContainer>
      {isModalOpen && (
        <AIModal
          isOpen={isModalOpen}
          name={localName}
          profile={localProfile}
          setName={setLocalName}
          setProfile={setLocalProfile}
          onClose={closeModal}
          onSave={saveModal}
        />
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
