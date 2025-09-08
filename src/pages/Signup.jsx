import { useState } from "react";
import styled from "styled-components";

const Body = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fff;
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
    width:100%;
    margin-bottom:16px;
    border: 1px solid #BDBDBD;
    border-radius: 8px;
    font-size:16px;
    width:348px;
    height:52px;
    padding-left:22px
`
const Button = styled.button`
    margin-top:36px;
    background-color:#96B6FF;
    color:white;
    width:348px;
    height:52px;
    margin-bottom:36px
`
const Line1 = styled.span`
    border:1px solid #ECECEC;
    display:flex;
    align-items:center;
    text-align:center;
    width:164px;
    margin-right:184px;
    height:0px;

`
const Line2 = styled.span`
    border:1px solid #ECECEC;
    border:1px solid #ECECEC;
    display:flex;
    align-items:center;
    text-align:center;
    width:164px;
    height:0px;
    margin-left:184px;
`
const Button2 = styled.button`
    margin-top:47px;
    background-color:white;
    color:#AAAAAA;
    width:348px;
    height:52px;
    border:0.5px solid #AAAAAA;
`

export default function Signup(props){
    return(
        <Body>
            <Container>
                <Title>미믹미믹</Title>
                <Message>보고 싶었던 “그대"와 대화해 보세요!</Message>
                <Input type="text" placeholder="이름 입력"></Input>
                <Input type="text" placeholder="아이디 입력"></Input>
                <Input type="password" placeholder="비밀번호 입력" />
                <Input type="password" placeholder="비밀번호 확인" />
                <Button>로그인</Button>
                <Line1></Line1>
                <Line2></Line2>
                <Button2>회원가입 하기</Button2>
            </Container>
        </Body>
    )
}