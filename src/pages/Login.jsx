import { useState } from "react";
export default function Login(){
    return(
        <div>
            <h3>미믹미믹</h3>
            <p>보고 싶었던 “그대"와 대화해 보세요!</p>
            <input type="text" placeholder="아이디 입력"></input>
            <input type="password" placeholder="비밀번호 입력" />
            <button>로그인</button>
            <button>회원가입 하기</button>
        </div>
    )
}