import React, {useState} from "react";
import styles from "./Login.module.css";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import logo from "../../assets/icons/logo.png";




const Login = () => {
    const [input, setInput] = useState( {
        id : "",
        password : ""
    });

    const {id, password}= input;
    const [disabled, setDisabled] = useState(true);

    //input 유효성 검사 에러 메시지
    const [idMsg, setIdMsg] = useState("");
    const [pwdMsg, setPwdMsg] = useState("");

    // const [idCheck, setIdCheck] = useState(false);
    // const [pwdCheck, setPwdCheck] = useState(false);

    //로그인 상태 확인
    const [isLogin, setIslogin] = useState(false);

    //input 유효성 검사
    const handleInput = (event) => {
        let pwdRule = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const { id, value } = event.target;
        setInput({ 
            ...input,
            [id]:value
        });
        if(id==="id") {
            if(value.length<=8 && value.length>0) {
                setIdMsg("8자 이상의 아이디를 입력해주세요.");
            }else if(value.length>16) {
                setIdMsg("16자 이하의 아이디를 입력해주세요.");
            }else if(value==="") {
                setIdMsg("아이디를 입력해주세요");
            }else {
                setIdMsg("");
            }
        }else if(id==="password") {
            if(!pwdRule.test(value)&& value.length>0) {
                setPwdMsg("비밀번호는  8~20자 영어, 숫자, 특수문자의 조합으로 입력해주세요");
            }else if(value.length===0) {
                setPwdMsg("비밀번호를 입력해주세요");
            }else {
                setPwdMsg("");
            }
        }

        // console.log(idMsg);
        // console.log(pwdMsg);

        if(idMsg===""&&pwdMsg==="") {
            setDisabled(false);
        }else {
            setDisabled(true);
        }
        
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(input);
        console.log("clicked");
    };

    //로그인 상태 확인
    const checkToken = () => {

    }

    const loginApi = () => {
        let url = "";
        axios.post(url)
        .then(function(result) {

        })
        .catch(function(error) {

        })
    }


    //로그인 버튼 클릭시 처리되는 메소드
    return(
        <>
        <div className={styles.formBorder}>
            <form className={styles.form} onSubmit={handleSubmit}>
            <img src={logo} alt="logo" className={styles.logo} />
            <div className={styles.inputArea}>
                <div className={styles.inputRow}>
                        <div>
                            <IdIcon className={styles.icon}/>
                        </div>
                    <div className={styles.input}>
                        <input className={styles.inputData}
                            id="id" 
                            placeholder="아이디"
                            type="text"
                            onChange={handleInput}
                        />
                        {/* {idCheck === false ? <p className={styles.errorMsg}>{idMsg}</p> : null} */}
                        <p className={styles.errorMsg}>{idMsg}</p>

                    </div>
                </div>

                <div className={styles.inputRow}>
                    <div>
                        <PwdIcon className={styles.icon}/>
                    </div>
                    <div className={styles.input}>
                    <input className={styles.inputData}
                        id="password" 
                        placeholder="비밀번호"
                        type="password"
                        onChange={handleInput}
                    />
                    {/* {pwdCheck === false ? <p className={styles.errorMsg}>{pwdMsg}</p> : null} */}
                    <p className={styles.errorMsg}>{pwdMsg}</p> 
                    </div>
                </div>
            </div>
                
            <div className={styles.confirmButtons}>
                <button className={styles.loginBtn} disabled={disabled} type="submit">
                    로그인
                </button>

                {/* 토큰 확인 */}
                {isLogin ? <p>{window.localStorage.getItem("id")}</p> : <> </>}

                <Link to="/signup">
                    <button className={styles.registBtn}> 
                        회원가입
                    </button>
                </Link>
            </div>

            <div className={styles.findButtons}>
            
                <button className={styles.findIdBtn}>
                    아이디 찾기
                </button>
                |
                <button className={styles.findPwdBtn}>
                    비밀번호 찾기
                </button>
            </div>
            {/* <KakaoBtn/>
            <GoogleBtn/> */}
            </form>
            </div>
        </>
    )
}


// function KakaoBtn() {
//     return(
//         <button>카카오 로그인</button>
//     )
// }

// function GoogleBtn() {
//     return(
//         <button>구글 로그인</button>
//     )
// }
export default Login;