import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import { ReactComponent as KakaoIcon } from "../../assets/icons/kakao.svg";
import { ReactComponent as GoogleIcon } from "../../assets/icons/google.svg";
import infoLogo from "../../assets/images/infoLogo.png";
import UserApi from "../../api/UserApi.js";
import LoginStatusContext from "../../contexts/LoginStatusContext";
import GoogleLoginBtn from "./GoogleLogin";
import GoogleLogin from "react-google-login";

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

  const [idError, setIdError] = useState(false);
  const [pwdError, setPwdError] = useState(false);

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
        setIdError(true);
        setIdCheck(false);
      } else if (value.length > 16) {
        setIdError(true);
        setIdCheck(false);
        setIdMsg("16자 이하의 아이디를 입력해주세요.");
      } else if (value === "") {
        setIdError(true);
        setIdCheck(false);
        setIdMsg("아이디를 입력해주세요");
      } else {
        setIdError(false);
        setIdCheck(true);
        setIdMsg("");
      }
    }
    if (id === "password") {
      if (!pwdRule.test(value) && value.length > 0) {
        setPwdError(true);
        setPwdCheck(false);
        setPwdMsg(
          "비밀번호는  8~20자 영어, 숫자, 특수문자의 조합으로 입력해주세요"
        );
      } else if (value.length === 0) {
        setPwdError(true);
        setPwdCheck(false);
        setPwdMsg("비밀번호를 입력해주세요");
      } else {
        setPwdError(false);
        setPwdCheck(true);
        setPwdMsg("");
      }
    }
  };

  const checkValidation = (...input) => {
    if (id.length === 0) {
      setIdError(true);
      setIdMsg("아이디를 입력해주세요");
    }
    if (password.length === 0) {
      setPwdError(true);
      setPwdMsg("비밀번호를 입력해주세요");
    }
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
    let errorMsg = "아이디와 비밀번호를 정확히 입력해 주세요.";
    const body = {
      userId: input.id,
      password: input.password,
    };
    try {
      const { data } = await getLoginResult(body);
      setLoginMsg("");
      sessionStorage.setItem("accessToken", data.accessToken);
      setLoginStatus("2");
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
    <div className={styles.contents}>
      <div className={styles.welcomeInfo}>
        <h1>짠해에 오신 것을 환영합니다.</h1>
        <span>
          '짠해'에서는 다양한 컨텐츠를 활용하여 사람들과 친해지고, <br />{" "}
          소통하는데 도움을 줍니다.
        </span>
        <img src={infoLogo} alt="로고" className={styles.InfoLogo} />
      </div>
      <div className={styles.formBorder}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* <img src={logo} alt="logo" className={styles.logo} /> */}
          <div className={styles.inputTitle}>
            <h1>짠해</h1>
            <span>Login</span>
          </div>
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              {/* <div>
                <IdIcon className={styles.icon} />
              </div> */}
              <div className={styles.input}>
                <label htmlFor="id">아이디</label>
                {/* <div className={styles.necessary}></div> */}
                <input
                  className={
                    idError
                      ? `${styles.inputData} ${styles.inputError}`
                      : styles.inputData
                  }
                  id="id"
                  type="text"
                  onChange={handleInput}
                  autoComplete="off"
                />
                {/* {idCheck === false ? <p className={styles.errorMsg}>{idMsg}</p> : null} */}
                <span className={styles.errorMsg}>{idMsg}</span>
              </div>
            </div>

            <div className={styles.inputRow}>
              {/* <div>
                <PwdIcon className={styles.icon} />
              </div> */}
              <div className={styles.input}>
                <label htmlFor="id">비밀번호</label>
                <input
                  className={
                    pwdError
                      ? `${styles.inputData} ${styles.inputError}`
                      : styles.inputData
                  }
                  id="password"
                  type="password"
                  onChange={handleInput}
                  autoComplete="off"
                />
                {/* {pwdCheck === false ? <p className={styles.errorMsg}>{pwdMsg}</p> : null} */}
                <span className={styles.errorMsg}>{pwdMsg}</span>
              </div>
            </div>
          </div>

          <span className={styles.errorMsg}>{loginMsg}</span>

          <div className={styles.confirmButtons}>
            <button className={styles.loginBtn} type="submit">
              로그인
            </button>
            <span className={styles.crossline}>
              <span className={styles.textOr}>또는</span>
            </span>
            <GoogleLoginBtn className={styles.GoogleLogin} />
            {/* 토큰 확인
            {isLogin ? <p>{window.localStorage.getItem("id")}</p> : <> </>} */}
          </div>
          <div className={styles.btnRow}>
            <Link to="/user/signup">
              <button className={styles.registBtn}>회원가입</button>
            </Link>
            <div className={styles.findButtons}>
              <Link to="/user/findId">
                <button className={styles.findIdBtn}>아이디 찾기</button>
              </Link>
              <div className={styles.updown}></div>
              <Link to="/user/findPwd">
                <button className={styles.findPwdBtn}>비밀번호 찾기</button>
              </Link>
            </div>
          </div>

          {/* <div className={styles.findButtons}>
            <Link to="/user/findId">
              <button className={styles.findIdBtn}>아이디 찾기</button>
            </Link>
            <div className={styles.updown}></div>
            <Link to="/user/findPwd">
              <button className={styles.findPwdBtn}>비밀번호 찾기</button>
            </Link>
          </div>
          <hr className={styles.horizontalLine} />
          <div className={styles.socialButton}>
            <KakaoBtn />
            <GoogleBtn />
            <GoogleLoginBtn className={styles.GoogleLogin} />
          </div> */}
        </form>
      </div>
    </div>
  );
};

function KakaoBtn() {
  return (
    <div>
      <button className={styles.kakaoBtn}>
        <KakaoIcon className={styles.icon} />
        카카오 로그인
      </button>
    </div>
  );
}

function GoogleBtn() {
  return (
    <div>
      <button className={styles.googleBtn} onClick={GoogleLoginBtn}>
        <GoogleIcon className={styles.icon} />
        구글 로그인
      </button>
    </div>
  );
}
export default Login;
