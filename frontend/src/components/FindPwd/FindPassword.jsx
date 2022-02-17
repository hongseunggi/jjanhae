import React, { useCallback, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "../Regist/RegisterTemplate.module.css";
import UserApi from "../../api/UserApi.js";
import { toast } from "react-toastify";

const FindPassword = ({ progress = 50 }) => {
  const [id, setId] = useState("");
  const [idErrorMsg, setIdErrorMsg] = useState("");
  const [idError, setIdError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [emailError, setEmailError] = useState(false);

  // 이메일 인증 버튼 클릭 유무
  const [isEmail, setIsEmail] = useState(false);

  const { getPwdCheckResult } = UserApi;

  const onChangeId = useCallback((e) => {
    const idPattern = /^[a-zA-Z0-9]*$/;
    const idCurrent = e.target.value;
    if (!idPattern.test(idCurrent)) {
      setIdErrorMsg("아이디는 영어와 숫자만 입력이 가능합니다.");
      setIdError(true);
      // setComplete(false);
    } else {
      setIdErrorMsg("");
      setIdError(false);
    }
    setId(idCurrent);
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
      setIsEmail(false);
    } else {
      setEmailErrorMsg("");
      setEmailError(false);
      setIsEmail(true);
    }
  }, []);

  // 이메일 인증
  const handleEmailCheck = async () => {
    // 이메일 인증번호 검사 api 호출
    toast.info(
      <div style={{ width: "400px" }}>
        <div>이메일을 발송하였습니다.</div>
        <span>이메일이 오지 않을 경우 입력한 정보를 다시 확인해주세요.</span>
      </div>,
      {
        position: toast.POSITION.TOP_CENTER,
        role: "alert",
      }
    );
    try {
      const { data } = await getPwdCheckResult({
        userId: id,
        email: email,
      });
      // setEmailErrorMsg(
      //   "이메일을 발송했습니다. \n이메일이 도착하지 않을 경우 입력하신 정보를 다시 한번 확인해 주세요."
      // );
    } catch ({ response }) {
      console.log(response);
      // setEmailErrorMsg("가입시 작성한 이메일을 올바르게 입력해주세요.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
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
                비밀번호 재설정을 위해 <br />
                사용자 인증을 진행합니다.
              </h2>
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className={styles.inputArea}>
                  <div className={`${styles.inputRow} ${styles.findpwdInput}`}>
                    <div className={styles.input}>
                      <label className={styles.label} htmlFor="id">
                        아이디
                      </label>
                      <input
                        className={styles.inputData}
                        id="id"
                        value={id}
                        type="text"
                        autoComplete="off"
                        onChange={onChangeId}
                      />
                      <span className={styles.errorMsg}>{idErrorMsg}</span>
                    </div>
                  </div>
                  <div className={`${styles.inputRow} ${styles.findpwdInput}`}>
                    <div className={styles.input}>
                      <label className={styles.label} htmlFor="email">
                        이메일
                      </label>
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
                      <span className={styles.errorMsg}>{emailErrorMsg}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.nextBtns}>
                  <button
                    className={
                      !isEmail
                        ? `${styles.nextBtn} ${styles.disabled}`
                        : styles.nextBtn
                    }
                    type="button"
                    onClick={handleEmailCheck}
                    disabled={!isEmail}
                  >
                    이메일 요청
                  </button>
                </div>
              </form>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default FindPassword;
