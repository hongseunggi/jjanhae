import React, { createRef, useState } from "react";
import styles from "./FindId.module.css";
import { ReactComponent as EmailIcon } from "../../assets/icons/email.svg";
import { ReactComponent as NameIcon } from "../../assets/icons/name.svg";
import { ReactComponent as EmailConfirmIcon } from "../../assets/icons/confirm.svg";
import ShowId from "./ShowId";
import axios from "axios";

const FindId = () => {
  const emailRef = createRef();
  const confirmEmailRef = createRef();
  const nameRef = createRef();

  const [confirm, setConfirm] = useState(false);

  // 입력 폼 데이터
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirmCode, setEmailConfirmCode] = useState("");
  const [name, setName] = useState("");

  // 유효성 검사 메시지
  const [emailMsg, setEmailMsg] = useState("");
  const [emailConfirmCodeMsg, setEmailConfirmCodeMsg] = useState("");
  const [nameMsg, setNameMsg] = useState("");

  // 유효성 검사 통과 flag
  const [emailCheck, setEmailCheck] = useState(false);
  // const [emailConfirmCheck, setEmailConfirmCheck] = useState(false);
  const [nameCheck, setNameCheck] = useState(false);
  // 이메일 인증 버튼 클릭 유무
  const [isSend, setIsSend] = useState(false);

  // 아이디, 이메일 검사 결과
  const [emailConfirm, setEmailConfirm] = useState(false);

  // 입력 데이터 관리
  const handleInput = (event) => {
    const emailPattern =
      /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    const namePattern = /^[가-힣]+$/;

    const { id: target, value } = event.target;
    switch (target) {
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
      default:
        console.log("error");
    }
  };

  // 이메일 인증번호 검사
  const handleEmailCheck = () => {
    setEmailMsg("");
    // 이메일 인증번호 검사 api 호출
    let url = `http://localhost:8081/user/id`;
    axios
      .patch(url, {
        name,
        email,
      })
      .then((result) => {
        console.log(result);
        setIsSend(true);
        // setAuthCode(result.authCode);
      })
      .catch((error) => {
        setEmailMsg("중복된 이메일 입니다.");
      });
  };

  const handleEmailCodeCheck = () => {
    let url = `http://localhost:8081/user?name=${name}&email=${email}&authCode=${emailConfirmCode}`;
    axios
      .get(url)
      .then((result) => {
        console.log(result);
        setEmailConfirm(true);
        setId(result.userId);
        setEmailConfirmCodeMsg("인증이 완료되었습니다.");
      })
      .catch((error) => {
        setEmailConfirmCodeMsg("인증번호를 확인해주세요.");
      });
  };

  // 다음 버튼 클릭 시 이벤트
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!nameCheck) {
      setNameMsg("이름을 확인해주세요.");
      nameRef.current.focus();
    } else if (!emailCheck) {
      setEmailMsg("이메일을 확인해주세요.");
      emailRef.current.focus();
    } else if (!isSend) {
      setEmailMsg("이메일 인증이 필요합니다.");
    } else if (!emailConfirm) {
      setEmailConfirmCodeMsg("인증을 완료해주세요.");
      confirmEmailRef.current.focus();
    } else {
      // 아이디찾기 api 호출
      // let url = `http://localhost:8081/user?name=${name}&email=${email}&authCode=${emailConfirmCode}`;
      // axios.get(url)
      // const data = {
      //   email,
      //   name,
      // };
      // const result = "ssafy";
      // setId(result); // 결과
      setConfirm(true);
    }
  };

  return (
    <div className={styles.formBorder}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.title}>아이디 찾기</div>
        {confirm ? (
          <ShowId id={id} name={name} />
        ) : (
          <div className={styles.findIdForm}>
            <div className={styles.inputArea}>
              <div className={styles.inputRow}>
                <div>
                  <NameIcon fill="#EEE" width="30" height="30" />
                </div>
                <div className={styles.input}>
                  <input
                    autoComplete="off"
                    id="name"
                    className={styles.inputData}
                    value={name}
                    type="text"
                    placeholder="이름"
                    ref={nameRef}
                    onChange={handleInput}
                  />
                  <p className={styles.invalidMsg}>{nameMsg}</p>
                </div>
              </div>

              {/* 이메일 */}
              <div className={styles.inputRow}>
                <div>
                  <EmailIcon fill="#EEE" width="30" height="30" />
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
                    <EmailConfirmIcon fill="#EEE" width="30" height="30" />
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
            </div>

            <button className={styles.nextBtn} type="submit">
              다음
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FindId;
