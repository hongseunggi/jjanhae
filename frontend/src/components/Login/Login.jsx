import React, {useState} from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import logo from "../../assets/icons/logo.png";

const Login = () => {
  const [input, setInput] = useState({
    id: "",
    password: "",
  });

  const { id, password } = input;
  const [disabled, setDisabled] = useState(true);

  //input 유효성 검사 에러 메시지
  const [idMsg, setIdMsg] = useState(" ");
  const [pwdMsg, setPwdMsg] = useState(" ");

  // const [idCheck, setIdCheck] = useState(false);
  // const [pwdCheck, setPwdCheck] = useState(false);

  //로그인 상태 확인
  const [isLogin, setIslogin] = useState(false);

  //input 유효성 검사
  const handleInput = (event) => {
    let pwdRule = /^.*(?=^.{5,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const { id, value } = event.target;
    setInput({
      ...input,
      [id]: value,
    });

    if (idMsg === "" && pwdMsg === "") {
      setDisabled(false);
    } else if (idMsg === "" && disabled === true) {
      setPwdMsg("비밀번호를 입력해주세요");
    } else if (pwdMsg === "" && disabled === true) {
      setIdMsg("아이디를 입력해주세요");
    } else {
      setDisabled(true);
    }

    if (id === "id") {
      if (value.length <= 5 && value.length > 0) {
        setIdMsg("5자 이상의 아이디를 입력해주세요.");
      } else if (value.length > 16) {
        setIdMsg("16자 이하의 아이디를 입력해주세요.");
      } else if (value === "") {
        setIdMsg("아이디를 입력해주세요");
      } else {
        setIdMsg("");
      }
    } else if (id === "password") {
      if (!pwdRule.test(value) && value.length > 0) {
        setPwdMsg(
          "비밀번호는  5~20자 영어, 숫자, 특수문자의 조합으로 입력해주세요"
        );
      } else if (value.length === 0) {
        setPwdMsg("비밀번호를 입력해주세요");
      } else {
        setPwdMsg("");
      }
    }

    // checkDisabled({...input});
    // console.log(idMsg);
    // console.log(pwdMsg);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(input);
    console.log("clicked");

    // loginApi();
  };

  const checkDisabled = () => {
    console.log(id);
  };

  //로그인 상태 확인
  const checkToken = () => {};

  const loginApi = () => {
    let url = "https://localhost:3000/user/login";
    axios
      .post(url, {
        ...input,
      })
      .then(function (result) {
        console.log(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  //로그인 버튼 클릭시 처리되는 메소드
  return (
    <>
      <div className={styles.formBorder}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <img src={logo} alt="logo" className={styles.logo} />
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <div>
                <IdIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  className={styles.inputData}
                  id="id"
                  placeholder="아이디"
                  type="text"
                  onChange={handleInput}
                  autoComplete="off"
                />
                {/* {idCheck === false ? <p className={styles.errorMsg}>{idMsg}</p> : null} */}
                <p className={styles.errorMsg}>{idMsg}</p>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div>
                <PwdIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  className={styles.inputData}
                  id="password"
                  placeholder="비밀번호"
                  type="password"
                  onChange={handleInput}
                  autoComplete="off"
                />
                {/* {pwdCheck === false ? <p className={styles.errorMsg}>{pwdMsg}</p> : null} */}
                <p className={styles.errorMsg}>{pwdMsg}</p>
              </div>
            </div>
          </div>

          <div className={styles.confirmButtons}>
            <button
              className={styles.loginBtn}
              disabled={disabled}
              type="submit"
            >
              {/* <button className={styles.loginBtn} type="submit"> */}
              {/* <p className={styles.btnText}> */}
              로그인
              {/* </p> */}
              {/* <div className={styles.btnTwo}> */}
              {/* <p className={styles.btnText2}>Go!</p> */}
              {/* </div> */}
            </button>

            {/* 토큰 확인 */}
            {isLogin ? <p>{window.localStorage.getItem("id")}</p> : <> </>}

            <Link to="/signup">
              <button className={styles.registBtn}>회원가입</button>
            </Link>
          </div>

          <div className={styles.findButtons}>
            <Link Link to="/findId">
              <button className={styles.findIdBtn}>아이디 찾기</button>
            </Link>
            <div className={styles.updown}></div>
            <Link to="/findPwd">
              <button className={styles.findPwdBtn}>비밀번호 찾기</button>
            </Link>
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
