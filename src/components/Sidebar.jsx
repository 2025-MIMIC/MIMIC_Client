// Sidebar.jsx
import React from 'react';
import { Search, Edit3, Trash2, Settings, User } from 'lucide-react';
import styled from 'styled-components';

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

const Sidebar = ({ userName, chatSessions = [], activeSessionId }) => {
  return (
    <SidebarContainer>
      {/* 헤더 */}
      <SidebarHeader>
        <SidebarTitle>{userName}</SidebarTitle>
      </SidebarHeader>

      {/* 메뉴 항목 */}
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
            <span>AI 프롬포트 수정</span>
          </MenuButton>
          
          <MenuButton danger>
            <Trash2 className="w-5 h-5" />
            <span>대화 삭제</span>
          </MenuButton>
        </MenuSection>

        {/* 세션 목록 */}
        <SessionList>
          {chatSessions.map((session) => (
            <SessionItem
              key={session.id}
              active={session.id === activeSessionId}
            >
              <Avatar>
                <User className="w-4 h-4 text-gray-600" />
              </Avatar>
              <SessionInfo>
                <SessionTitle>{session.title}</SessionTitle>
                {session.lastMessage && (
                  <SessionLastMessage>{session.lastMessage}</SessionLastMessage>
                )}
              </SessionInfo>
            </SessionItem>
          ))}
        </SessionList>
      </MenuContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
