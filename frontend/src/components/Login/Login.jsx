import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import logo from "../../assets/icons/logo.png";
import UserApi from "../../api/UserApi.js";
import LoginStatusContext from "../../contexts/LoginStatusContext";

const Login = () => {
  const { setLoginStatus } = useContext(LoginStatusContext);

  const [input, setInput] = useState({
    id: "",
    password: "",
  });

  // import login api
  const { getLoginResult } = UserApi;

  const { id, password } = input;

  //input 유효성 검사 에러 메시지
  const [idMsg, setIdMsg] = useState(" ");
  const [pwdMsg, setPwdMsg] = useState(" ");

  //login error msg
  const [loginMsg, setLoginMsg] = useState(" ");

  const [idCheck, setIdCheck] = useState(false);
  const [pwdCheck, setPwdCheck] = useState(false);

  //로그인 상태 확인
  // const [isLogin, setIslogin] = useState(false);

  //navigator
  const navigate = useNavigate();

  //input 유효성 검사
  const handleInput = (event) => {
    let pwdRule = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const { id, value } = event.target;
    setInput({
      ...input,
      [id]: value,
    });

    setLoginMsg("");

    if (id === "id") {
      if (value.length < 5 && value.length > 0) {
        setIdMsg("5자 이상의 아이디를 입력해주세요.");
        setIdCheck(false);
      } else if (value.length > 16) {
        setIdCheck(false);
        setIdMsg("16자 이하의 아이디를 입력해주세요.");
      } else if (value === "") {
        setIdCheck(false);
        setIdMsg("아이디를 입력해주세요");
      } else {
        setIdCheck(true);
        setIdMsg("");
      }
    }
    if (id === "password") {
      if (!pwdRule.test(value) && value.length > 0) {
        console.log(1);
        setPwdCheck(false);
        setPwdMsg(
          "비밀번호는  8~20자 영어, 숫자, 특수문자의 조합으로 입력해주세요"
        );
      } else if (value.length === 0) {
        setPwdCheck(false);
        console.log(2);
        setPwdMsg("비밀번호를 입력해주세요");
      } else {
        console.log(3);
        setPwdCheck(true);
        setPwdMsg("");
      }
    }
  };

  const checkValidation = (...input) => {
    if (id.length === 0) setIdMsg("아이디를 입력해주세요");
    if (password.length === 0) setPwdMsg("비밀번호를 입력해주세요");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkValidation();

    if (idCheck === true && pwdCheck === true) {
      loginApi();
    }
  };

  //로그인 상태 확인
  // const checkToken = () => {};

  const loginApi = async () => {
    let userError = 404;
    let pwdError = 401;
    let errorMsg =
      "아이디 또는 비밀번호가 잘못 입력 되었습니다.\n 아이디와 비밀번호를 정확히 입력해 주세요.";
    const body = {
      userId: input.id,
      password: input.password,
    };
    try {
      const { data } = await getLoginResult(body);
      setLoginMsg("");
      sessionStorage.setItem("accessToken", data.accessToken);
      setLoginStatus("2");
      // onLoginChange("2");
      navigate("/");
    } catch ({ response }) {
      if (
        response.data.statusCode === userError ||
        response.data.statusCode === pwdError
      ) {
        setLoginMsg(errorMsg);
      }
    }
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

          <p className={styles.errorMsg}>{loginMsg}</p>

          <div className={styles.confirmButtons}>
            <button
              className={styles.loginBtn}
              // disabled={disabled}
              type="submit"
            >
              로그인
            </button>

            {/* 토큰 확인
            {isLogin ? <p>{window.localStorage.getItem("id")}</p> : <> </>} */}

            <Link to="/user/signup">
              <button className={styles.registBtn}>회원가입</button>
            </Link>
          </div>

          <div className={styles.findButtons}>
            <Link to="/user/findId">
              <button className={styles.findIdBtn}>아이디 찾기</button>
            </Link>
            <div className={styles.updown}></div>
            <Link to="/user/findPwd">
              <button className={styles.findPwdBtn}>비밀번호 찾기</button>
            </Link>
          </div>

          {/* <KakaoBtn/>
            <GoogleBtn/> */}
        </form>
      </div>
    </>
  );
};

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
