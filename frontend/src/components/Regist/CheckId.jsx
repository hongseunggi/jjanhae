import React, { useCallback, useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./RegisterTemplate.module.css";
import { useNavigate } from "react-router-dom";
import UserApi from "../../api/UserApi.js";
import RegistContext from "../../contexts/RegistContext";

const CheckId = ({ progress }) => {
  const [id, setId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [error, setError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  const { getIdCheckResult } = UserApi;
  const { input, setInput } = useContext(RegistContext);

  const handleInput = useCallback((e) => {
    const idCurrent = e.target.value;
    setId(idCurrent);
    validation(idCurrent);
  }, []);

  useEffect(() => {
    confirm && navigate("/user/signup/checkPwd");
  }, [confirm, navigate]);

  const validation = (value) => {
    const idPattern = /^[a-zA-Z0-9]*$/;
    if (value.length < 5 || value.length > 16) {
      setErrorMsg("5 ~ 16자 사이의 아이디를 입력해주세요.");
      setError(true);
    } else if (!idPattern.test(value)) {
      setErrorMsg("아이디는 숫자와 영어만 입력이 가능합니다.");
      setError(true);
    } else {
      setErrorMsg("");
      setError(false);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    error || handleIdCheck();
  };

  // 아이디 중복 검사
  const handleIdCheck = async () => {
    // 아이디 중복 검사 api 호출
    try {
      setInput({ ...input, userId: id });
      await getIdCheckResult(id);
      setConfirm(true);
    } catch (error) {
      console.log(error);
      setErrorMsg("이미 사용중인 아이디 입니다.");
      setError(true);
    }
  };

  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      error || handleClick(e);
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
            짠해에서 사용할 아이디를 <br />
            입력해주세요.
          </h2>
          <form
            className={styles.form}
            onKeyPress={onCheckEnter}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className={styles.inputArea}>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label className={styles.label} htmlFor="id">
                    아이디
                  </label>
                  <input
                    className={
                      error
                        ? `${styles.inputData} ${styles.inputError}`
                        : styles.inputData
                    }
                    id="id"
                    value={id}
                    type="text"
                    autoComplete="off"
                    onChange={handleInput}
                  />
                  <span className={styles.errorMsg}>{errorMsg}</span>
                </div>
              </div>
            </div>
            <ul className={styles.alertMsg}>
              <li>입력한 아이디로 짠해에 로그인 할 수 있습니다.</li>
              <li>
                한번 만든 아이디는 변경할 수 없으니, 오타가 없도록 신중히 확인해
                주세요.
              </li>
            </ul>
            <div className={styles.nextBtns}>
              <button
                className={
                  error
                    ? `${styles.nextBtn} ${styles.disabled}`
                    : styles.nextBtn
                }
                type="button"
                disabled={error}
                onClick={handleClick}
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

export default CheckId;
