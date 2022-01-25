import React, { createRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import styles from "./ResetPwd.module.css";
import axios from "axios";

const ResetPwd = ({ getauthcode }) => {
  // props 변수 이름 변경
  const pwdRef = createRef();
  const confirmPwdRef = createRef();
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdCheck, setPwdCheck] = useState(false);
  const [confirmPwdCheck, setConfirmPwdCheck] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");
  const [confirmPwdMsg, setConfirmPwdMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  //URL에서 params 뽑아내기
  const [searchParams] = useSearchParams();
  const id = searchParams.get("userId");
  const authCode = searchParams.get("authCode");

  const navigate = useNavigate();

  // 입력 데이터 관리
  const handleInput = (event) => {
    const pwdPattern =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    const { id: target, value } = event.target;
    switch (target) {
      case "pwd":
        setPwd(value);
        if (!pwdPattern.test(value)) {
          setPwdMsg("8 ~ 20자 영어, 숫자, 특수문자의 조합");
        } else {
          setPwdMsg("");
          setPwdCheck(true);
        }
        break;
      case "confirmPwd":
        setConfirmPwd(value);
        if (pwd !== value) {
          setConfirmPwdMsg("비밀번호가 일치하지 않습니다.");
        } else {
          setConfirmPwdMsg("");
          setConfirmPwdCheck(true);
        }
        break;

      default:
        console.log("error");
    }
  };

  const pwdRestApi = () => {
    let url = "http://localhost:8081/user/newpwd";
    axios
      .patch(url, {
        userId: id,
        password: pwd,
        authCode: authCode,
      })
      .then(function (result) {
        // console.log(result.data.message);
        setPwdMsg("");
        navigate("/user/login");
      })
      .catch(function (error) {
        // console.log(error);
        setErrorMsg("잘못된 접근입니다.");
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!pwdCheck) {
      setPwdMsg("비밀번호를 확인해주세요.");
      pwdRef.current.focus();
    } else if (!confirmPwdCheck) {
      setConfirmPwdMsg("비밀번호를 한번 더 입력해주세요");
      confirmPwdRef.current.focus();
    } else {
      const data = {
        pwd,
      };
      //회원가입 api 호출
      console.log(data);
      //정상적으로 동작할 시 로그인 화면으로 이동

      pwdRestApi();
    }
  };

  return (
    <div className={styles.formBorder}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.title}>비밀번호 재설정</div>
        <div className={styles.findIdForm}>
          <div className={styles.inputArea}>
            {/* 비밀번호 */}
            <div className={styles.inputRow}>
              <div className="">
                <PwdIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  ref={pwdRef}
                  autoComplete="off"
                  id="pwd"
                  className={styles.inputData}
                  value={pwd}
                  type="password"
                  placeholder="비밀번호"
                  onChange={handleInput}
                />
                <p className={styles.invalidMsg}>{pwdMsg}</p>
              </div>
            </div>
            {/* 비밀번호 확인 */}
            <div className={styles.inputRow}>
              <div>
                <PwdIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  autoComplete="off"
                  id="confirmPwd"
                  className={styles.inputData}
                  value={confirmPwd}
                  type="password"
                  placeholder="비밀번호 확인"
                  ref={confirmPwdRef}
                  onChange={handleInput}
                />
                <p className={styles.invalidMsg}>{confirmPwdMsg}</p>
              </div>
            </div>
          </div>
          <p className={styles.invalidMsg}>{errorMsg}</p>
          <button className={styles.nextBtn} type="submit">
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPwd;
