import React, { useCallback, useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "../Regist/RegisterTemplate.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserApi from "../../api/UserApi.js";
import { toast } from "react-toastify";

const ResetPassword = ({ progress }) => {
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

  const [searchParams] = useSearchParams();
  const id = searchParams.get("userId");
  const authCode = searchParams.get("authCode");
  const { getPwdResetResult } = UserApi;

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

  const handleClick = (e) => {
    e.preventDefault();
    pwdRestApi();
  };

  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      handleClick(e);
    }
  };

  const pwdRestApi = async () => {
    try {
      const { data } = await getPwdResetResult({
        userId: id,
        password: password,
        authCode: authCode,
      });
      toast.success(
        <div style={{ width: "400px" }}>비밀번호 재설정이 완료되었습니다.</div>,
        {
          position: toast.POSITION.TOP_CENTER,
          role: "alert",
        }
      );
      setPwdErrorMsg("");
      navigate("/user/login");
    } catch (error) {
      toast.info(
        <div style={{ width: "400px" }}>
          <div>잘못된 접근입니다.</div>
          <span>처음부터 다시 시도해주세요.</span>
        </div>,
        {
          position: toast.POSITION.TOP_CENTER,
          role: "alert",
        }
      );
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
                짠해 로그인에 사용할 <br />
                비밀번호를 재설정해주세요.
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
                      <span className={styles.errorMsg}>
                        {pwdConfirmErrorMsg}
                      </span>
                    </div>
                  </div>
                </div>
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
                    완료
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

export default ResetPassword;
