import React, { useCallback, useContext, useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import styles from "./RegisterTemplate.module.css";
import { useNavigate } from "react-router-dom";
import RegistContext from "../../contexts/RegistContext";
import UserApi from "../../api/UserApi.js";
import BirthDate from "./BirthDate";

const CheckProfile = ({ progress }) => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [drink, setDrink] = useState("소주");
  const [drinkLimit, setDrinkLimit] = useState("");

  const [nameErrorMsg, setNameErrorMsg] = useState("");

  const [nameCheck, setNameCheck] = useState(false);
  const [birthdayCheck, setBirthdayCheck] = useState(false);
  const [drinkCheck, setDrinkCheck] = useState(false);
  const [drinkLimitCheck, setDrinkLimitCheck] = useState(false);

  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  const { input, setInput } = useContext(RegistContext);
  const { getRegistResult } = UserApi;

  const handleInputName = useCallback((e) => {
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

  const handleInputBirthday = useCallback((date) => {
    setBirthday(date);
    setBirthdayCheck(true);
  }, []);

  const handleInputDrink = useCallback((e) => {
    const drinkCurrent = e.target.value;
    setDrink(drinkCurrent);
    setDrinkCheck(true);
  }, []);

  const handleInputDrinkLimit = useCallback((e) => {
    const drinkLimitCurrent = e.target.value;
    setDrinkLimit(drinkLimitCurrent);
    if (drinkLimitCurrent < 0) {
      setDrinkLimit(0);
    }
    setDrinkLimitCheck(true);
  }, []);

  useEffect(() => {
    if (nameCheck & birthdayCheck & drinkLimitCheck) {
      setConfirm(true);
    }
  }, [nameCheck, birthdayCheck, drinkLimitCheck]);

  useEffect(() => {
    setInput({ ...input, name, drink, drinkLimit });
  }, [name, drink, drinkLimit]);

  useEffect(() => {
    if (birthday !== "") {
      const newBirth = birthday.toLocaleDateString();
      setInput({ ...input, birthday: newBirth });
    } else setInput({ ...input, birthday });
  }, [birthday]);

  const handleClick = (e) => {
    e.preventDefault();
    registerApi();
    navigate("/user/signup/complete");
  };

  const registerApi = async () => {
    try {
      console.log(input);
      const response = await getRegistResult(input);
      console.log(response);
    } catch (error) {
      console.log(error);
      alert("회원가입에 실패했습니다. 새로고침 후 다시 시도해주세요");
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
            짠해 프로필을 <br />
            채워주세요.
          </h2>
          <form className={styles.form}>
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
                    onChange={handleInputName}
                  />
                  <span className={styles.errorMsg}>{nameErrorMsg}</span>
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label className={styles.label} htmlFor="email">
                    생년월일
                  </label>
                  <BirthDate date={birthday} onChange={handleInputBirthday} />
                </div>
              </div>
              <div className={styles.inputRow}>
                <div className={styles.input}>
                  <label className={styles.label} htmlFor="email">
                    선호주종 및 주량
                  </label>
                  <div className={styles.drinkInfo}>
                    <select
                      className={styles.drinkSelect}
                      onChange={handleInputDrink}
                    >
                      <option value="소주">소주</option>
                      <option value="맥주">맥주</option>
                    </select>
                    <input
                      autoComplete="off"
                      id="drinkLimit"
                      className={`${styles.inputData} ${styles.drinkLimit}`}
                      value={drinkLimit}
                      type="number"
                      placeholder="주량(병)"
                      onChange={handleInputDrinkLimit}
                    />
                  </div>
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
                완료
              </button>
            </div>
          </form>
        </div>
      </article>
    </main>
  );
};

export default CheckProfile;
