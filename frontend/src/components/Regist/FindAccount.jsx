import React, { useCallback, useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./RegisterTemplate.module.css";
import { useNavigate } from "react-router-dom";
import UserApi from "../../api/UserApi.js";
import FindAccountResult from "./FindAccountResult";

const FindAccount = ({ progress = 50 }) => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmCode, setEmailConfirmCode] = useState("");

  const [nameErrorMsg, setNameErrorMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [emailConfirmErrorMsg, setEmailConfirmErrorMsg] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [emailConfirmError, setEmailConfirmError] = useState(false);

  const [isEmailConfirm, setIsEmailConfirm] = useState(false);

  const [nameCheck, setNameCheck] = useState(false);

  // 이메일 인증 버튼 클릭 유무
  const [isSend, setIsSend] = useState(false);

  const [confirm, setConfirm] = useState(false);

  const navigate = useNavigate();

  const { getEmailCheckResult, getEmailCodeCheckResult } = UserApi;

  // useEffect(() => {
  //   if (nameCheck & isEmailConfirm) {
  //     setConfirm(true);
  //   }
  // }, [nameCheck, isEmailConfirm]);

  const onChangeName = useCallback((e) => {
    const namePattern = /^[가-힣]+$/;
    const nameCurrent = e.target.value;
    setName(nameCurrent);
    if (!namePattern.test(nameCurrent)) {
      setNameErrorMsg("한글만 입력이 가능합니다.");
      setNameCheck(false);
    } else {
      setNameErrorMsg("");
      setNameCheck(true);
    }
  }, []);

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
    // 이메일 인증번호 검사 api 호출
    try {
      const { data } = await getEmailCheckResult("findId", {
        name: name,
        email: email,
      });
      setIsSend(true);
      setEmailErrorMsg("이메일을 발송했습니다. 인증번호를 확인해주세요.");
    } catch ({ response }) {
      console.log(response);
      setEmailErrorMsg("가입시 작성한 이메일을 입력해주세요.");
    }
  };

  const handleEmailCodeCheck = async () => {
    try {
      const { data } = await getEmailCodeCheckResult("findId", {
        name: name,
        email: email,
        authCode: emailConfirmCode,
      });
      setIsEmailConfirm(true);
      setEmailConfirmError(false);
      setId(data.userId);
      setEmailConfirmErrorMsg("인증이 완료되었습니다.");
    } catch ({ response }) {
      setEmailConfirmError(true);
      setEmailConfirmErrorMsg("인증번호를 확인해주세요.");
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (nameCheck & isEmailConfirm) {
      setConfirm(true);
    }
    // navigate("/user/signup/checkProfile");
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        {confirm ? (
          <FindAccountResult id={id} />
        ) : (
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
                  짠해 가입시 작성한 <br />
                  이름과 이메일을 작성해주세요.
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
                        <label htmlFor="name" className={styles.label}>
                          이름
                        </label>
                        <input
                          className={styles.inputData}
                          id="name"
                          value={name}
                          type="text"
                          autoComplete="off"
                          onChange={onChangeName}
                        />
                        <span className={styles.errorMsg}>{nameErrorMsg}</span>
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
        )}
      </div>
    </div>
  );
};

export default FindAccount;
