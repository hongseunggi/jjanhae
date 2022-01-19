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
import { ReactComponent as Logo } from "./logo.svg";

const Regist = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [date, setDate] = useState("");
  const [isBeer, setIsBeer] = useState(true);

  const [certificationCode, setCertificationCode] = useState("");

  const onSubmit = (data) => {
    // const formatedDate = date.toLocaleDateString();
    console.log({ ...data, date });
  };
  const onChange = (date) => {
    setDate(date);
  };
  const iconChange = () => {
    setIsBeer((prev) => !prev);
  };
  return (
    <>
      <div className={styles.formBorder}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <Logo width="100" height="100" />
          <div className={styles.icon}>
            <div>
              <IdIcon fill="#EEE" width="20" height="20" />
            </div>
            <div>
              <input
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
              {errors.id?.type === "required" && (
                <p className={styles.errorMsg}>아이디를 입력해주세요.</p>
              )}
              {errors.id?.type === "pattern" && (
                <p className={styles.errorMsg}>
                  아이디는 영어와 숫자만 가능합니다.
                </p>
              )}
              {errors.id?.type === "minLength" && (
                <p className={styles.errorMsg}>
                  5자 이상의 아이디를 입력해주세요.
                </p>
              )}
              {errors.id?.type === "maxLength" && (
                <p className={styles.errorMsg}>
                  16자 이하의 아이디를 입력해주세요.
                </p>
              )}
            </div>
          </div>
          <div className={styles.icon}>
            <div>
              <PwdIcon fill="#EEE" width="20" height="20" />
            </div>
            <div>
              <input
                type="password"
                name="pwd"
                placeholder="비밀번호"
                {...register("pwd", {
                  required: true,
                  pattern:
                    /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$/,
                })}
              />
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
            <div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                {...register("confirmPwd", {
                  required: true,
                  validate: (value) => value === getValues("pwd"),
                })}
              />
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
              <input
                type="email"
                name="email"
                placeholder="이메일"
                {...register("pwd", {
                  required: true,
                  pattern: /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                })}
              />
              {errors.email?.type === "required" && (
                <p className={styles.errorMsg}>이메일을 입력해주세요.</p>
              )}
              {errors.email?.type === "pattern" && (
                <p className={styles.errorMsg}>
                  이메일 형식이 유효하지 않습니다.
                </p>
              )}
            </div>
          </div>
          <div className={styles.icon}>
            <div>
              <Confirm fill="#eee" width="20" height="20" />
            </div>
            <div>
              <input
                type="number"
                name="confirmCode"
                placeholder="인증 코드 입력"
                {...register("confirmCode", {
                  required: true,
                  validate: (value) => value === certificationCode,
                })}
              />
              {errors.confirmCode?.type === "validate" && (
                <p className={styles.errorMsg}>인증코드가 일치하지 않습니다.</p>
              )}
            </div>
          </div>
          <div className={styles.icon}>
            <div>
              <NameIcon fill="#EEE" width="20" height="20" />
            </div>
            <div>
              <input
                type="text"
                placeholder="이름"
                {...register("name", {
                  required: true,
                  pattern: /^[가-힣]+$/,
                })}
              />
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
