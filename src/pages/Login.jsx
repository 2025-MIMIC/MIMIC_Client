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
    margin-bottom:36px
`
const Button2 = styled.button`
    margin-top:47px;
    background-color:white;
    color:#AAAAAA;
    width:348px;
    height:52px;
    border:0.5px solid #AAAAAA;
`

export default function Login(props){
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
    return(
        <Body>
            <Container>
                <Title>미믹미믹</Title>
                <Message>보고 싶었던 “그대"와 대화해 보세요!</Message>
                <Input type="text" placeholder="아이디 입력" value={username} onChange={handleUsername}></Input>
                <Input type="password" placeholder="비밀번호 입력" value={password} onChange={handlePassword}/>
                <Button>로그인</Button>
                <Button2 onClick={() => navigate('/signup')}>회원가입 하기</Button2>
            </Container>
        </Body>
    )
}