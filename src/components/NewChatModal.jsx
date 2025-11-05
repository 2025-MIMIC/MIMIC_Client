import React, { useState } from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalBox = styled.div`
  width: 480px;
  max-width: calc(100% - 40px);
  background: white;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 14px 44px rgba(0,0,0,0.16);
`;

const ModalHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Field = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  resize: vertical;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${props => props.primary ? '#96B6FF' : '#f3f4f6'};
  color: ${props => props.primary ? 'white' : '#111827'};
`;

export default function NewChatModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [profile, setProfile] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      alert("AI 이름을 입력해주세요.");
      return;
    }
    onSave(name.trim(), profile.trim());
  };

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>새 채팅 생성</ModalHeader>

        <Field>
          <Label>AI 이름</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="예: 코딩 도우미" />
        </Field>

        <Field>
          <Label>AI 특징 / 말투 (선택)</Label>
          <Textarea value={profile} onChange={(e) => setProfile(e.target.value)} placeholder="친절하고 자세한 설명을 선호합니다." />
        </Field>

        <Actions>
          <Button onClick={onClose}>취소</Button>
          <Button primary onClick={handleSave}>저장</Button>
        </Actions>
      </ModalBox>
    </ModalOverlay>
  );
}
