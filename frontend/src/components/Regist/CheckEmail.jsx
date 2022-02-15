import React, { useCallback, useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./RegisterTemplate.module.css";
import { useNavigate } from "react-router-dom";
import RegistContext from "../../contexts/RegistContext";
import UserApi from "../../api/UserApi.js";

const CheckEmail = ({ progress }) => {
  const [email, setEmail] = useState("");
  const [emailConfirmCode, setEmailConfirmCode] = useState("");

  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [emailConfirmErrorMsg, setEmailConfirmErrorMsg] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailConfirmError, setEmailConfirmError] = useState(false);

  const [isEmailConfirm, setIsEmailConfirm] = useState(false);

  // 이메일 인증 버튼 클릭 유무
  const [isSend, setIsSend] = useState(false);

  const navigate = useNavigate();

  const { input, setInput } = useContext(RegistContext);
  const { getEmailCheckResult, getEmailCodeCheckResult } = UserApi;

  // 이메일
  const onChangeEmail = useCallback((e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    const emailCurrent = e.target.value;
    setEmail(emailCurrent);

    if (!emailRegex.test(emailCurrent)) {
      setEmailErrorMsg("이메일 형식이 올바르지 않습니다.");
      setEmailError(true);
      // setIsEmail(false);
    } else {
      setEmailErrorMsg("");
      setEmailError(false);
      // setIsEmail(true);
    }
  }, []);

  // 이메일 확인
  const onChangeEmailConfirm = useCallback((e) => {
    const emailConfirmCurrent = e.target.value;
    setEmailConfirmCode(emailConfirmCurrent);
  }, []);

  // 이메일 인증번호 검사
  const handleEmailCheck = async () => {
    setEmailErrorMsg("");

    // 이메일 인증번호 검사 api 호출
    try {
      const { data } = await getEmailCheckResult("regist", { email });
      setIsSend(true);
      setEmailErrorMsg("");
      setEmailConfirmErrorMsg(data.message);
    } catch ({ response }) {
      setEmailErrorMsg(response.data.message);
    }
  };

  const handleEmailCodeCheck = async () => {
    try {
      const response = await getEmailCodeCheckResult("regist", {
        email,
        authCode: emailConfirmCode,
      });
      console.log(response);
      setIsEmailConfirm(true);
      setEmailConfirmErrorMsg("인증이 완료되었습니다.");
    } catch (error) {
      setEmailConfirmErrorMsg("인증번호를 확인해주세요.");
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    setInput({ ...input, email: email });
    navigate("/user/signup/checkProfile");
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
            짠해 가입을 위해 <br />
            이메일 인증을 완료해주세요.
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
                    className={`${styles.inputData} ${styles.complete}`}
                    id="id"
                    value={input.userId}
                    type="text"
                    disabled
                  />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label className={styles.label} htmlFor="email">
                    이메일
                  </label>
                  <div className={styles.inputWithBtn}>
                    <input
                      className={
                        emailError
                          ? `${styles.inputData} ${styles.inputError}`
                          : styles.inputData
                      }
                      id="email"
                      value={email}
                      type="text"
                      autoComplete="off"
                      onChange={onChangeEmail}
                    />
                    <button
                      type="button"
                      className={styles.checkBtn}
                      onClick={handleEmailCheck}
                      disabled={emailError}
                    >
                      인증 요청
                    </button>
                  </div>
                  <span className={styles.errorMsg}>{emailErrorMsg}</span>
                </div>
              </div>
              {isSend && (
                <div className={styles.inputRow}>
                  <div className={styles.input}>
                    <label className={styles.label} htmlFor="confirmPwd">
                      이메일 인증 번호
                    </label>
                    <div className={styles.inputWithBtn}>
                      <input
                        className={
                          emailConfirmError
                            ? `${styles.inputData} ${styles.inputError}`
                            : styles.inputData
                        }
                        id="confirmPwd"
                        value={emailConfirmCode}
                        type="text"
                        autoComplete="off"
                        onChange={onChangeEmailConfirm}
                      />
                      <button
                        type="button"
                        className={styles.confirmBtn}
                        onClick={handleEmailCodeCheck}
                        disabled={emailError}
                      >
                        확인
                      </button>
                    </div>
                    <span className={styles.errorMsg}>
                      {emailConfirmErrorMsg}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.nextBtns}>
              <button
                className={
                  !isEmailConfirm
                    ? `${styles.nextBtn} ${styles.disabled}`
                    : styles.nextBtn
                }
                type="button"
                onClick={handleClick}
                disabled={!isEmailConfirm}
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

export default CheckEmail;
