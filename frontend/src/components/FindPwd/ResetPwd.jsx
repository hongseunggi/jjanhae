import React, { createRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import styles from "./ResetPwd.module.css";

const ResetPwd = ({ getauthcode }) => {
  // props 변수 이름 변경
  const pwdRef = createRef();
  const confirmPwdRef = createRef();
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [confirmPwdMsg, setConfirmPwdMsg] = useState("");
  const [pwdCheck, setPwdCheck] = useState(false);
  const [confirmPwdCheck, setConfirmPwdCheck] = useState(false);

  const [searchParams] = useSearchParams();
  console.log(searchParams.get("userid"));
  console.log(searchParams.get("authcode"));

  // const { userid, authcode } = params;
  // console.log(userid, authcode);

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
      // navigate("/signup/complete");
      //정상적으로 동작할 시 로그인 화면으로 이동
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
              <div>
                <PwdIcon fill="#EEE" width="20" height="20" />
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
                <PwdIcon fill="#EEE" width="20" height="20" />
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
          <button className={styles.nextBtn} type="submit">
            확인
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPwd;
