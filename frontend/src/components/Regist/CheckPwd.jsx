import React, { useCallback, useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./RegisterTemplate.module.css";
import { useNavigate } from "react-router-dom";
import RegistContext from "../../contexts/RegistContext";

const CheckPwd = ({ progress }) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [pwdErrorMsg, setPwdErrorMsg] = useState("");
  const [pwdConfirmErrorMsg, setPwdConfirmErrorMsg] = useState("");

  const [pwdError, setPwdError] = useState(false);
  const [pwdConfirmError, setPwdConfirmError] = useState(false);

  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  const [confirm, setConfirm] = useState(false);

  const navigate = useNavigate();

  const { input, setInput } = useContext(RegistContext);

  // 비밀번호
  const onChangePassword = useCallback((e) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
    const passwordCurrent = e.target.value;
    setPassword(passwordCurrent);

    if (!passwordRegex.test(passwordCurrent)) {
      setPwdErrorMsg("숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!");
      setPwdError(true);
      setIsPassword(false);
    } else {
      setPwdErrorMsg("");
      setPwdError(false);
      setIsPassword(true);
    }
  }, []);

  // 비밀번호 확인
  const onChangePasswordConfirm = useCallback(
    (e) => {
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPwdConfirmErrorMsg("");
        setPwdConfirmError(false);
        setIsPasswordConfirm(true);
      } else {
        setPwdConfirmErrorMsg("비밀번호가 일치하지 않습니다.");
        setPwdConfirmError(true);
        setIsPasswordConfirm(false);
      }
    },
    [password]
  );

  useEffect(() => {
    if (password === passwordConfirm) {
      setIsPasswordConfirm(true);
    } else {
      setIsPasswordConfirm(false);
    }

    if (isPassword & isPasswordConfirm) {
      setConfirm(true);
    } else {
      setConfirm(false);
    }
    // console.log(`password : ${isPassword}`);
    // console.log(`passwordConfirm : ${isPasswordConfirm}`);
    // console.log(`confirm : ${confirm}`);
  }, [isPassword, isPasswordConfirm, confirm, password, passwordConfirm]);

  const handleClick = (e) => {
    e.preventDefault();

    setInput({ ...input, password: password });
    navigate("/user/signup/checkEmail");
  };

  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      handleClick(e);
    }
  };

  return (
    <main className={styles.main}>
      <article className={styles.article}>
        <div className={styles.contents}>
          <div className={styles.progressBar}>
            <ProgressBar
              completed={progress}
              customLabel=" "
              width={"20%"}
              height={"5px"}
              bgColor="#ff2e63"
              baseBgColor="#51f0ed1a"
            />
          </div>
          <h2 className={styles.info}>
            짠해 로그인에 사용할 <br />
            비밀번호를 입력해주세요.
          </h2>
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={styles.inputArea}>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label htmlFor="id">아이디</label>
                  <input
                    className={`${styles.inputData} ${styles.completed}`}
                    id="id"
                    value={input.userId}
                    type="text"
                    disabled
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label className={styles.label} htmlFor="pwd">
                    비밀번호
                  </label>
                  <input
                    className={
                      pwdError
                        ? `${styles.inputData} ${styles.inputError}`
                        : styles.inputData
                    }
                    id="pwd"
                    value={password}
                    type="password"
                    autoComplete="off"
                    onChange={onChangePassword}
                  />
                  <span className={styles.errorMsg}>{pwdErrorMsg}</span>
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label className={styles.label} htmlFor="confirmPwd">
                    비밀번호 확인
                  </label>
                  <input
                    className={
                      pwdConfirmError
                        ? `${styles.inputData} ${styles.inputError}`
                        : styles.inputData
                    }
                    id="confirmPwd"
                    value={passwordConfirm}
                    type="password"
                    autoComplete="off"
                    onKeyPress={onCheckEnter}
                    onChange={onChangePasswordConfirm}
                  />
                  <span className={styles.errorMsg}>{pwdConfirmErrorMsg}</span>
                </div>
              </div>
            </div>
            {/* <ul className={styles.alertMsg}>
              <li>입력한 아이디로 짠해에 로그인 할 수 있습니다.</li>
              <li>
                한번 만든 아이디는 변경할 수 없으니, 오타가 없도록 신중히 확인해
                주세요.
              </li>
            </ul> */}
            <div className={styles.nextBtns}>
              <button
                className={
                  !confirm
                    ? `${styles.nextBtn} ${styles.disabled}`
                    : styles.nextBtn
                }
                type="button"
                onClick={handleClick}
                disabled={!confirm}
              >
                다음
              </button>
            </div>
          </form>
        </div>
      </article>
    </main>
  );
};

export default CheckPwd;
