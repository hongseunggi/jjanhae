import React, { useState } from "react";
import { useForm } from "react-hook-form";
import BirthDate from "./BirthDate";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./RegistForm.module.css";
import { ReactComponent as IdIcon } from "../../assets/icons/userid.svg";
import { ReactComponent as BeerIcon } from "../../assets/icons/beer.svg";
import { ReactComponent as BirthIcon } from "../../assets/icons/birth.svg";
import { ReactComponent as EmailIcon } from "../../assets/icons/email.svg";
import { ReactComponent as NameIcon } from "../../assets/icons/name.svg";
import { ReactComponent as PwdIcon } from "../../assets/icons/password.svg";
import { ReactComponent as SojuIcon } from "../../assets/icons/soju.svg";
import { ReactComponent as Confirm } from "../../assets/icons/confirm.svg";
import logo from "../../assets/icons/logo.png";

const Regist = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [idErrType, setIdErrType] = useState("");
  const [date, setDate] = useState(""); // 생년월일
  const [isSend, setIsSend] = useState(false); // 이메일 전송 눌렀는지
  const [isRight, setIsRight] = useState(true);
  const [isConfirm, setIsConfirm] = useState(false); // 인증코드와 동일한지
  const [confirmErr, setConfirmErr] = useState(false);
  const [isBeer, setIsBeer] = useState(true); // 맥주인지

  const [certificationCode, setCertificationCode] = useState("");

  const onSubmit = (data) => {
    const formatedDate = date.toLocaleDateString();
    console.log({ ...data, formatedDate });
  };
  const onChange = (date) => {
    setDate(date);
  };
  const iconChange = () => {
    setIsBeer((prev) => !prev);
  };

  const handleIdCheck = () => {
    const inputId = getValues("id");
    const isValid = /^[a-zA-Z0-9]*$/;

    //api 호출
    // const check = async () => {
    //   await checkid()
    // }
    if (inputId.length < 5) {
      setIdErrType("minLength");
    } else if (inputId.length > 16) {
      setIdErrType("maxLength");
    } else if (!isValid.test(inputId)) {
      setIdErrType("pattern");
    } else {
      setIdErrType("confirm");
    }
  };
  const handleEmailConfirm = () => {
    const isValid =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    const sendEmail = getValues("email");
    if (isValid.test(sendEmail)) {
      setIsSend(true);
      setIsRight(true);
      setCertificationCode("ssafy");
    } else {
      setIsRight(false);
    }
  };

  const handleEmailConfirmCheck = () => {
    const value = getValues("confirmCode");
    if (value === certificationCode) {
      setIsConfirm(true);
      confirmErr && setConfirmErr(false);
    } else {
      setConfirmErr((prev) => !prev);
    }
  };
  return (
    <>
      <div className={styles.formBorder}>
        <img src={logo} alt="logo" className={styles.logo} />
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={`${styles.icon} ${styles.top}`}>
            <div>
              <IdIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.inputAndMsg}>
              <div className={styles.inputForm}>
                <input
                  autoComplete="off"
                  name="id"
                  type="text"
                  placeholder="아이디"
                  {...register("id", {
                    required: true,
                    minLength: 5,
                    maxLength: 16,
                    pattern: /^[a-zA-Z0-9]*$/,
                  })}
                />
                <button
                  type="button"
                  onClick={handleIdCheck}
                  className={styles.checkBtn}
                >
                  검사
                </button>
              </div>
              {idErrType === "required" && (
                <p className={styles.errorMsg}>아이디를 입력해주세요.</p>
              )}
              {idErrType === "pattern" && (
                <p className={styles.errorMsg}>
                  아이디는 영어와 숫자만 가능합니다.
                </p>
              )}
              {idErrType === "minLength" && (
                <p className={styles.errorMsg}>
                  5자 이상의 아이디를 입력해주세요.
                </p>
              )}
              {idErrType === "maxLength" && (
                <p className={styles.errorMsg}>
                  16자 이하의 아이디를 입력해주세요.
                </p>
              )}
              {idErrType === "confirm" && (
                <p className={styles.confirmMsg}>사용가능한 아이디입니다.</p>
              )}
            </div>
          </div>
          <div className={styles.icon}>
            <div>
              <PwdIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.inputAndMsg}>
              <div className={styles.inputForm}>
                <input
                  autoComplete="off"
                  type="password"
                  name="pwd"
                  placeholder="비밀번호"
                  {...register("pwd", {
                    required: true,
                    pattern:
                      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                  })}
                />
              </div>
              {errors.pwd?.type === "required" && (
                <p className={styles.errorMsg}>비밀번호를 입력해주세요.</p>
              )}
              {errors.pwd?.type === "pattern" && (
                <p className={styles.errorMsg}>
                  8 ~ 20자 영어, 숫자, 특수문자의 조합
                </p>
              )}
            </div>
          </div>
          <div className={styles.icon}>
            <div>
              <PwdIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.inputAndMsg}>
              <div className={styles.inputForm}>
                <input
                  autoComplete="off"
                  type="password"
                  placeholder="비밀번호 확인"
                  {...register("confirmPwd", {
                    required: true,
                    validate: (value) => value === getValues("pwd"),
                  })}
                />
              </div>
              {errors.confirmPwd?.type === "validate" && (
                <p className={styles.errorMsg}>
                  동일한 비밀번호를 입력해주세요.
                </p>
              )}
            </div>
          </div>

          <div className={styles.icon}>
            <div>
              <EmailIcon fill="#EEE" width="20" height="20" />
            </div>
            <div>
              <div className={styles.inputForm}>
                <input
                  autoComplete="off"
                  type="email"
                  name="email"
                  placeholder="이메일"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  })}
                />
                <button
                  type="button"
                  onClick={handleEmailConfirm}
                  className={styles.sendBtn}
                >
                  전송
                </button>
              </div>
              {errors.email?.type === "required" && (
                <p className={styles.errorMsg}>이메일을 입력해주세요.</p>
              )}
              {isRight || (
                <p className={styles.errorMsg}>
                  이메일 형식이 유효하지 않습니다.
                </p>
              )}
            </div>
          </div>
          {isSend && (
            <div className={styles.icon}>
              <div>
                <Confirm fill="#eee" width="20" height="20" />
              </div>
              <div>
                <div className={styles.inputForm}>
                  <input
                    autoComplete="off"
                    disabled={isConfirm ? true : false}
                    name="confirmCode"
                    placeholder="인증 코드 입력"
                    {...register("confirmCode", {
                      required: true,
                    })}
                  />
                  <button
                    type="button"
                    onClick={handleEmailConfirmCheck}
                    className={styles.confirmBtn}
                  >
                    확인
                  </button>
                </div>
                {confirmErr && (
                  <p className={styles.errorMsg}>
                    인증코드가 일치하지 않습니다.
                  </p>
                )}
                {isConfirm && (
                  <p className={styles.confirmMsg}>인증이 완료되었습니다.</p>
                )}
              </div>
            </div>
          )}
          <div className={styles.icon}>
            <div>
              <NameIcon fill="#EEE" width="20" height="20" />
            </div>
            <div className={styles.inputAndMsg}>
              <div className={styles.inputForm}>
                <input
                  autoComplete="off"
                  type="text"
                  placeholder="이름"
                  {...register("name", {
                    required: true,
                    pattern: /^[가-힣]+$/,
                  })}
                />
              </div>
              {errors.name?.type === "required" && (
                <p className={styles.errorMsg}>이름을 입력해주세요.</p>
              )}
              {errors.name?.type === "pattern" && (
                <p className={styles.errorMsg}>한글만 입력이 가능합니다.</p>
              )}
            </div>
          </div>
          <div className={styles.birth}>
            <BirthIcon fill="#EEE" width="20" height="20" />
            <BirthDate date={date} onChange={onChange} />
          </div>
          <div className={styles.icon}>
            {isBeer ? (
              <div>
                <BeerIcon fill="#eee" width="20" height="20" />
              </div>
            ) : (
              <div>
                <SojuIcon fill="#eee" width="20" height="20" />
              </div>
            )}
            <select {...register("alcohol")} onChange={iconChange}>
              <option value="beer">맥주</option>
              <option value="soju">소주</option>
            </select>
            <input className={styles.amount} type="number" placeholder="주량" />
          </div>
          <button className={styles.registBtn} type="submit">
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default Regist;
