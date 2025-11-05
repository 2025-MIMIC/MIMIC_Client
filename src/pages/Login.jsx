import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Body = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    background-color: #fff;
    position: fixed;
    top: 0;
    left: 0;
`
const Container = styled.div`
    width: 350px;
    text-align: center;
`
const Title = styled.p`
    font-size:40px;
    font-weight: bold;
    margin-bottom:0
`
const Message = styled.p`
    margin-top:0;
    font-size:16px;
    font-weight:semi-bold;
    color:gray;
    margin-bottom:36px;
`
const Input = styled.input`
    width: 348px;
    height: 52px;
    padding-left: 22px;
    border: 1px solid #BDBDBD;
    border-radius: 8px;
    font-size: 16px;
    margin-bottom: 16px;
    box-sizing: border-box;
`
const Button = styled.button`
    margin-top:36px;
    background-color:#96B6FF;
    color:white;
    width:348px;
    height:52px;
    margin-bottom:36px;
    border:none;
    border-radius:8px;
    font-size:16px;
    cursor:pointer;
    transition:0.2s;
    &:hover{
        background-color:#7EA1FF;
    }
`
const Button2 = styled.button`
    margin-top:47px;
    background-color:white;
    color:#AAAAAA;
    width:348px;
    height:52px;
    border:0.5px solid #AAAAAA;
    border-radius:8px;
    cursor:pointer;
`

export default function Login(){
    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleUsername = (e) => {
        const value = e.target.value;
        const english = value.replace(/[^a-zA-Z0-9]/g,'');
        setUsername(english);
    }
    const handlePassword = (e) => {
        const value = e.target.value;
        const english = value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        setPassword(english);
    }

    const handleLogin = async () => {
        if (!username || !password) {
            alert("아이디와 비밀번호를 모두 입력하세요!");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: username,
                    password: password
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`${data.user.name}님 환영합니다!`);
                navigate("/chat", { state: { userName: data.user.name } }); // 로그인 후 이동할 페이지 (원하는 경로로 변경)
            } else {
                alert(data.error || "로그인 실패");
            }
        } catch (error) {
            console.error("로그인 요청 실패:", error);
            alert("서버와 연결할 수 없습니다.");
        }
    }

    return(
        <Body>
            <Container>
                <Title>미믹미믹</Title>
                <Message>보고 싶었던 “그대"와 대화해 보세요!</Message>
                <Input 
                    type="text" 
                    placeholder="아이디 입력" 
                    value={username} 
                    onChange={handleUsername}
                />
                <Input 
                    type="password" 
                    placeholder="비밀번호 입력" 
                    value={password} 
                    onChange={handlePassword}
                />
                <Button onClick={handleLogin}>로그인</Button>
                <Button2 onClick={() => navigate('/signup')}>회원가입 하기</Button2>
            </Container>
        </Body>
    )
}
