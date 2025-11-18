import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalBox = styled.div`
  width: 680px;
  max-width: calc(100% - 40px);
  background: white;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 14px 44px rgba(0, 0, 0, 0.16);
`;

const ModalHeader = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const ModalField = styled.div`
  margin-bottom: 12px;
`;

const ModalLabel = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
  color: #374151;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  resize: vertical;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalButton = styled.button`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
  background: ${(props) => (props.primary ? "#96B6FF" : "#f3f4f6")};
  color: ${(props) => (props.primary ? "white" : "#111827")};

  &:hover {
    background: ${(props) => (props.primary ? "#7189BF" : "#e5e7eb")};
  }
`;

export default function AIModal({
  isOpen,
  name,
  profile,
  onClose,
  onSave,
  setName,
  setProfile,
}) {
  if (!isOpen) return null;

//조건부렌더링
//   모달이 열리지 않은 상태에서는 DOM에 렌더링하지 않음 → 불필요한 메모리 사용 최소화
// React에서 일반적으로 모달, 드롭다운 등 표시 여부를 제어할 때 사용

// props
// 부모 컴포넌트에서 상태(state)와 함수(callback)를 전달받음
// 상태 끌어올리기(Lifting State Up) 패턴 적용:
// AIModal 내부가 아닌 Sidebar가 실제 데이터 관리
// AIModal은 단순 UI + 이벤트 전달 역할만 수행

  return (
    <ModalOverlay>
      <ModalBox>
        <ModalHeader>AI 프로필 수정</ModalHeader>

        <ModalField>
          <ModalLabel>AI 이름</ModalLabel>
          <ModalInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 코딩도우미 AI"
          />
        </ModalField>

        <ModalField>
          <ModalLabel>AI 특징 / 프롬프트</ModalLabel>
          <ModalTextarea
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="예: 코드 리뷰를 친절하게 해주는 AI입니다."
          />
        </ModalField>

        <ModalActions>
          <ModalButton onClick={onClose}>취소</ModalButton>
          <ModalButton
            primary
            onClick={() => onSave(name, profile)}
          >
            저장
          </ModalButton>
        </ModalActions>
      </ModalBox>
    </ModalOverlay>
  );
}
