import React, {useState} from "react";
import styles from "./FindPwd.module.css";
import axios from 'axios';
import { Link } from "react-router-dom";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as NameIcon } from "../../assets/icons/name.svg";
import { ReactComponent as EmailIcon } from "../../assets/icons/email.svg";

import logo from "../../assets/icons/logo.png";


const FindPwd = () => {

    const [input, setInput] = useState( {
        id : "",
        name : "",
        email : "",
    })

    //input data
    const { id, name, email} = input;

    //error msg 
    const [idMsg, setIdMsg] = useState("");
    const [nameMsg, setNameMsg] = useState("");
    const [emailMsg, setEmailMsg] = useState("");

    const handleInput = (event) => {
        const { id, value} = event.target;
        setInput({
            ...input,
            [id] : value
        })
        
    }
    
    const checkValidation = () => {
        let emailRule = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        let nameRule = /^[가-힣]+$/;

        console.log(name.length);

        if(id.length<5&&id.length>16) {
            setIdMsg("아이디는 5자이상 16자 이하입니다");
        }else if(id.length===0) {
            setIdMsg("아이디를 입력해주세요");
        }else {
            setIdMsg("");
        }
        if(name.length===0) {
            setNameMsg("이름을 입력해주세요");
        }else if(!nameRule.test(name)) {
            setNameMsg("한글만 입력 가능합니다");
        }else {
            setNameMsg("");
        }
        if(email.length===0) {
            setEmailMsg("이메일을 입력해주세요");
        }else if(!emailRule.test(email)) {
            setEmailMsg("이메일 형식을 확인해주세요");
        }else {
            setEmailMsg("");
        }
    }
    
    const handleSubmit = (event) => {
        event.preventDefault();
        checkValidation();

        //validation check pass
        if(idMsg===""&&idMsg===""&&idMsg==="") {
            // findPwdApi();
        }
        console.log(input);
    }


    //axios
    const findPwdApi = () => {
        let url = 'https://localhost:3000/user/findpwd';
        axios.get(url, {
            input
        })
        .then(function(result) {
            console.log(result);
        })
        .catch(function(error) {
            console.log(error);
        })
    }

    
    return (
        <>
        <div className={styles.formBorder}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.title}>비밀번호 찾기</div>
                <div className={styles.inputArea}>
                    <div className={styles.inputRow}>
                        <div>
                            <IdIcon className={styles.icon}/>
                        </div>
                        <div className = {styles.input}>
                            <input className={styles.inputData}
                                id="id"
                                placeholder="아이디"
                                type="text"
                                onChange={handleInput}
                                autoComplete="off"
                            ></input>
                            <p className={styles.errMsg}>{idMsg}</p>
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div>
                            <NameIcon className={styles.icon}/>
                        </div>
                        <div className = {styles.input}>
                            <input className={styles.inputData}
                                id="name"
                                placeholder="이름"
                                type="text"
                                onChange={handleInput}
                                autoComplete="off"
                            ></input>
                            <p className={styles.errMsg}>{nameMsg}</p>
                        </div>
                    </div>

                    <div className={styles.inputRow}>
                        <div>
                            <EmailIcon className={styles.icon}/>
                        </div>
                        <div className = {styles.input}>
                            <input className={styles.inputData}
                                id="email"
                                placeholder="이메일"
                                type="text"
                                onChange={handleInput}
                                autoComplete="off"
                            ></input>
                            <p className={styles.errMsg}>{emailMsg}</p>
                        </div>
                    </div>
                </div>

                <button className={styles.findPwdBtn}>
                    <p className={styles.btnText} type="submit">이메일 전송</p>
                </button>
            </form>
        </div>
        </>
    );
}

export default FindPwd;