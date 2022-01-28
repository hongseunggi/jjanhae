import React, { createRef, useState } from "react";
import BirthDate from "./BirthDate";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Register.module.css";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as BeerIcon } from "../../assets/icons/beer.svg";
import { ReactComponent as BirthIcon } from "../../assets/icons/birth.svg";
import { ReactComponent as EmailIcon } from "../../assets/icons/email.svg";
import { ReactComponent as NameIcon } from "../../assets/icons/name.svg";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import { ReactComponent as SojuIcon } from "../../assets/icons/soju.svg";
import { ReactComponent as EmailConfirmIcon } from "../../assets/icons/confirm.svg";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

import UserApi from "../../api/UserApi.js";

const Register = () => {
  const {
    getRegistResult,
    getEmailCheckResult,
    getIdCheckResult,
    getEmailCodeCheckResult,
  } = UserApi;
  const idRef = createRef();
  const pwdRef = createRef();
  const confirmPwdRef = createRef();
  const emailRef = createRef();
  const confirmEmailRef = createRef();
  const nameRef = createRef();

  // 입력 폼 데이터
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmCode, setEmailConfirmCode] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [drink, setDrink] = useState("소주");
  const [drinkLimit, setDrinkLimit] = useState("");

  // 유효성 검사 메시지
  const [idMsg, setIdMsg] = useState("");
  const [pwdMsg, setPwdMsg] = useState("");
  const [confirmPwdMsg, setConfirmPwdMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [emailConfirmCodeMsg, setEmailConfirmCodeMsg] = useState("");
  const [birthdayMsg, setBirthdayMsg] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [drinkLimitMsg, setDrinkLimitMsg] = useState("");

  // 유효성 검사 통과 flag
  const [idCheck, setIdCheck] = useState(false);
  const [pwdCheck, setPwdCheck] = useState(false);
  const [confirmPwdCheck, setConfirmPwdCheck] = useState(false);
  const [emailCheck, setEmailCheck] = useState(false);
  // const [emailConfirmCheck, setEmailConfirmCheck] = useState(false);
  const [nameCheck, setNameCheck] = useState(false);
  const [birthdayCheck, setBirthdayCheck] = useState(false);

  // 이메일 인증 버튼 클릭 유무
  const [isSend, setIsSend] = useState(false);

  // 아이디, 이메일 검사 결과
  const [idConfirm, setIdConfirm] = useState(false);
  const [emailConfirm, setEmailConfirm] = useState(false);

  const navigate = useNavigate();

  // 입력 데이터 관리
  const handleInput = (event) => {
    const idPattern = /^[a-zA-Z0-9]*$/;
    const pwdPattern =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/;
    const emailPattern =
      /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    const namePattern = /^[가-힣]+$/;

    const { id: target, value } = event.target;
    switch (target) {
      case "id":
        setId(value);
        if (value.length < 5 && value.length > 0) {
          setIdMsg("5자 이상의 아이디를 입력해주세요.");
        } else if (value.length > 16) {
          setIdMsg("16자 이하의 아이디를 입력해주세요.");
        } else if (value === "") {
          setIdMsg("아이디를 입력해주세요");
        } else if (!idPattern.test(value)) {
          setIdMsg("아이디는 숫자와 영어만 입력이 가능합니다.");
        } else {
          setIdMsg("");
          setIdCheck(true);
        }
        break;
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
      case "email":
        setEmail(value);
        if (!emailPattern.test(value)) {
          setEmailMsg("올바른 이메일 형식으로 입력해주세요.");
        } else {
          setEmailMsg("");
          setEmailCheck(true);
        }
        break;
      case "emailConfirmCode":
        setEmailConfirmCode(value);
        break;
      case "name":
        setName(value);
        if (!namePattern.test(value)) {
          setNameMsg("한글만 입력이 가능합니다.");
        } else {
          setNameMsg("");
          setNameCheck(true);
        }
        break;
      case "drinkLimit":
        setDrinkLimit(value);
        if (value < 0) {
          setDrinkLimit(0);
        } else {
          setDrinkLimitMsg("");
        }
        break;
      default:
        console.log("error");
    }
  };

  // 아이디 중복 검사
  const handleIdCheck = async () => {
    // 아이디 중복 검사 api 호출
    try {
      const { data } = await getIdCheckResult(id);
      setIdConfirm(true);
      setIdMsg(data.message);
    } catch ({ response }) {
      setIdMsg(response.data.message);
    }
    // let url = `http://localhost:8081/user?userId=${id}`;
    // axios
    //   .get(url)
    //   .then((result) => {
    //     console.log(result);
    //     setIdConfirm(true);
    //     setIdMsg("사용가능한 아이디입니다.");
    //   })
    //   .catch((error) => {
    //     setIdMsg("이미 사용중인 아이디입니다.");
    //     console.log(error);
    //   });
  };

  // 이메일 인증번호 검사
  const handleEmailCheck = async () => {
    setEmailMsg("");

    // 이메일 인증번호 검사 api 호출
    try {
      const { data } = await getEmailCheckResult("regist", { email });
      setIsSend(true);
      setEmailMsg("");
      setEmailConfirmCodeMsg(data.message);
    } catch ({ response }) {
      setEmailMsg(response.data.message);
    }
  };

  const handleEmailCodeCheck = async () => {
    try {
      const response = await getEmailCodeCheckResult("regist", {
        email,
        authCode: emailConfirmCode,
      });
      console.log(response);
      setEmailConfirm(true);
      setEmailConfirmCodeMsg("인증이 완료되었습니다.");
    } catch (error) {
      setEmailConfirmCodeMsg("인증번호를 확인해주세요.");
    }
  };
  // 회원가입 버튼 클릭 시 이벤트
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!idConfirm) {
      setIdMsg("아이디를 확인해주세요.");
      idRef.current.focus();
    } else if (!pwdCheck) {
      setPwdMsg("비밀번호를 확인해주세요.");
      pwdRef.current.focus();
    } else if (!confirmPwdCheck) {
      setConfirmPwdMsg("비밀번호를 한번 더 입력해주세요");
      confirmPwdRef.current.focus();
    } else if (!isSend) {
      setEmailMsg("이메일 인증이 필요합니다.");
    } else if (!emailCheck) {
      setEmailMsg("이메일을 확인해주세요.");
      emailRef.current.focus();
    } else if (!emailConfirm) {
      setEmailConfirmCodeMsg("인증을 완료해주세요.");
      confirmEmailRef.current.focus();
    } else if (!nameCheck) {
      setNameMsg("이름을 확인해주세요.");
      nameRef.current.focus();
    } else if (!birthdayCheck) {
      setBirthdayMsg("생년월일을 설정해주세요.");
    } else if (!drinkLimit) {
      setDrinkLimitMsg("주량을 입력해주세요.");
    } else {
      const newBirth = birthday.toLocaleDateString();
      console.log(newBirth.length);
      const body = {
        userId: id,
        password: pwd,
        email,
        name,
        birthday: newBirth,
        drink,
        drinkLimit,
      };

      // //회원가입 api 호출
      try {
        const response = await getRegistResult(body);
        console.log(response);
        navigate("complete");
      } catch (error) {
        alert("회원가입에 실패했습니다. 새로고침 후 다시 시도해주세요");
      }
    }
  };

  const iconChange = (e) => {
    setDrink(e.target.value);
  };
  return (
    <div className={styles.formBorder}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img src={logo} alt="logo" className={styles.logo} />
        <div className={styles.inputArea}>
          {/* 유저아이디 */}
          <div className={styles.inputRow}>
            <div>
              <IdIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.input}>
              <div className={styles.inputWithBtn}>
                <input
                  ref={idRef}
                  autoComplete="off"
                  className={styles.inputData}
                  id="id"
                  value={id}
                  type="text"
                  placeholder="아이디"
                  disabled={idConfirm ? true : false}
                  onChange={handleInput}
                />
                <button
                  type="button"
                  className={styles.checkBtn}
                  onClick={handleIdCheck}
                  disabled={idCheck ? false : true}
                >
                  검사
                </button>
              </div>
              {idConfirm ? (
                <p className={styles.validMsg}>{idMsg}</p>
              ) : (
                <p className={styles.invalidMsg}>{idMsg}</p>
              )}
            </div>
          </div>
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
          {/* 이메일 */}
          <div className={styles.inputRow}>
            <div>
              <EmailIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.input}>
              <div className={styles.inputWithBtn}>
                <input
                  autoComplete="off"
                  id="email"
                  className={styles.inputData}
                  value={email}
                  type="email"
                  placeholder="이메일"
                  disabled={emailConfirm ? true : false}
                  ref={emailRef}
                  onChange={handleInput}
                />
                <button
                  type="button"
                  className={styles.checkBtn}
                  onClick={handleEmailCheck}
                  disabled={emailCheck ? false : true}
                >
                  전송
                </button>
              </div>
              <p className={styles.invalidMsg}>{emailMsg}</p>
            </div>
          </div>
          {/* 이메일 인증번호 */}
          {isSend && (
            <div className={styles.inputRow}>
              <div>
                <EmailConfirmIcon fill="#EEE" width="20" height="20" />
              </div>
              <div className={styles.input}>
                <div className={styles.inputWithBtn}>
                  <input
                    autoComplete="off"
                    id="emailConfirmCode"
                    className={styles.inputData}
                    value={emailConfirmCode}
                    type="text"
                    placeholder="인증번호 입력"
                    ref={confirmEmailRef}
                    onChange={handleInput}
                  />
                  <button
                    type="button"
                    className={styles.confirmBtn}
                    onClick={handleEmailCodeCheck}
                    disabled={emailCheck ? false : true}
                  >
                    확인
                  </button>
                </div>
                {emailConfirm ? (
                  <p className={styles.validMsg}>{emailConfirmCodeMsg}</p>
                ) : (
                  <p className={styles.invalidMsg}>{emailConfirmCodeMsg}</p>
                )}
              </div>
            </div>
          )}
          {/* 이름 */}
          <div className={styles.inputRow}>
            <div>
              <NameIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.input}>
              <input
                id="name"
                className={styles.inputData}
                value={name}
                type="text"
                placeholder="이름"
                ref={nameRef}
                onChange={handleInput}
                autoComplete="off"
              />
              <p className={styles.invalidMsg}>{nameMsg}</p>
            </div>
          </div>
          <div className={styles.inputRow}>
            <div>
              <BirthIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.birthInput}>
              <BirthDate
                date={birthday}
                onChange={(date) => {
                  setBirthday(date);
                  setBirthdayCheck(true);
                  setBirthdayMsg("");
                }}
              />
              <p className={styles.invalidMsg}>{birthdayMsg}</p>
            </div>
          </div>
          <div className={styles.inputRow}>
            {drink === "맥주" ? (
              <div>
                <BeerIcon fill="#eee" width="20" height="20" />
              </div>
            ) : (
              <div>
                <SojuIcon fill="#eee" width="20" height="20" />
              </div>
            )}
            <div className={`${styles.input} ${styles.drinkInfo}`}>
              <select className={styles.drinkSelect} onChange={iconChange}>
                <option disabled>선호주종</option>
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
                onChange={handleInput}
              />
              <p className={`${styles.invalidMsg} ${styles.drinkLimitMsg}`}>
                {drinkLimitMsg}
              </p>
            </div>
          </div>
        </div>
        <button className={styles.registBtn} type="submit">
          회원가입
        </button>
      </form>
    </div>
    // <Routes>
    //   <Route path="complete" element={<RegisterComplete />} />
    // </Routes>
  );
};

export default Register;
