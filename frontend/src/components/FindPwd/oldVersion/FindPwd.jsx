import React, { useState } from "react";
import styles from "./FindPwd.module.css";
import axios from "axios";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as NameIcon } from "../../assets/icons/name.svg";
import { ReactComponent as EmailIcon } from "../../assets/icons/email.svg";
import UserApi from "../../../api/UserApi.js";

const FindPwd = () => {
  const { getPwdCheckResult } = UserApi;
  const [input, setInput] = useState({
    id: "",
    name: "",
    email: "",
  });

  //input data
  const { id, name, email } = input;

  //error msg
  const [idMsg, setIdMsg] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  const [findPwdMsg, setFindPwdMsg] = useState("");

  const handleInput = (event) => {
    const { id, value } = event.target;
    setInput({
      ...input,
      [id]: value,
    });
    console.log(input);
    checkValidation();
  };

  const checkValidation = () => {
    let emailRule =
      /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    let nameRule = /^[가-힣]+$/;
    console.log(input);
    if (id.length < 5 && id.length > 16) {
      setIdMsg("아이디는 5자이상 16자 이하입니다");
    } else if (id.length === 0) {
      // setIdMsg("아이디를 입력해주세요");
    } else {
      setIdMsg("");
    }
    if (name.length === 0) {
      // setNameMsg("이름을 입력해주세요");
    } else if (!nameRule.test(name)) {
      setNameMsg("한글만 입력 가능합니다");
    } else {
      setNameMsg("");
    }
    if (email.length === 0) {
      // setEmailMsg("이메일을 입력해주세요");
    } else if (!emailRule.test(email)) {
      setEmailMsg("이메일 형식을 확인해주세요");
    } else {
      setEmailMsg("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkValidation();
    setFindPwdMsg("");

    if (name.length === 0) setNameMsg("이름을 입력해주세요");
    if (email.length === 0) setEmailMsg("이메일을 입력해주세요");
    if (id.length === 0) setIdMsg("아이디를 입력해주세요");

    //validation check pass
    if (idMsg === "" && nameMsg === "" && emailMsg === "") {
      findPwdApi();
    }
    // navigate("/user/resetPwd");
  };

  //axios
  const findPwdApi = async (...input) => {
    let errMsg = "입력하신 정보가 잘못되었습니다. 다시 입력해주세요.";
    try {
      const { data } = await getPwdCheckResult({
        userId: id,
        name,
        email,
      });
      setFindPwdMsg(data.message);
    } catch ({ response }) {
      setFindPwdMsg(errMsg);
    }
  };

  return (
    <>
      <div className={styles.formBorder}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.title}>비밀번호 찾기</div>
          <div className={styles.inputArea}>
            <div className={styles.inputRow}>
              <div>
                <IdIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  className={styles.inputData}
                  id="id"
                  placeholder="아이디"
                  type="text"
                  onChange={handleInput}
                  autoComplete="off"
                ></input>
                <p className={styles.errMsg}>{idMsg}</p>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div>
                <NameIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  className={styles.inputData}
                  id="name"
                  placeholder="이름"
                  type="text"
                  onChange={handleInput}
                  autoComplete="off"
                ></input>
                <p className={styles.errMsg}>{nameMsg}</p>
              </div>
            </div>

            <div className={styles.inputRow}>
              <div>
                <EmailIcon className={styles.icon} />
              </div>
              <div className={styles.input}>
                <input
                  className={styles.inputData}
                  id="email"
                  placeholder="이메일"
                  type="text"
                  onChange={handleInput}
                  autoComplete="off"
                ></input>
                <p className={styles.errMsg}>{emailMsg}</p>
              </div>
            </div>
          </div>

          <div className={styles.errMsg}>{findPwdMsg}</div>
          <button className={styles.findPwdBtn}>
            <p className={styles.btnText} type="submit">
              이메일 전송
            </p>
          </button>
        </form>
      </div>
    </>
  );
};

export default FindPwd;
