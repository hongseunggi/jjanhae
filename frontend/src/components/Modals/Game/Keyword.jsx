import React, { useState, useEffect, useRef } from "react";
import styles from "./Keyword.module.css";
import { ReactComponent as GameIcon } from "../../../assets/icons/game.svg";
import { ReactComponent as CelebrateIcon } from "../../../assets/icons/celebrate.svg";
import { ReactComponent as QuestionIcon } from "../../../assets/icons/question.svg";
import { ReactComponent as Sendclock } from "../../../assets/icons/sendclock.svg";
import UserApi from "../../../api/UserApi";



const Keyword = (props) => {
    const {open, close, confirmMyAnswer, confirmTargetGameName, mode, name} = props;
    const [answer, setAnswer] = useState("");
    const [targetGameName, setTargetGameName] = useState("");

    const handleGameNameInput = (event) => {
      setAnswer(event.target.value);
    }

    const handleTargetInput = (event) => {
      setTargetGameName(event.target.value);
    }

    const confirm = () => {
      confirmMyAnswer(answer);
      setAnswer("");
    }

    const confirmTarget = () => {
      if(targetGameName!==""&&targetGameName!==" ") {
        confirmTargetGameName(targetGameName);
        setTargetGameName("");
      }
    }

    return (
        <div
        className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      >
        {open ? 
        <>
        {mode === "answer" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <GameIcon className={styles.icon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>당신의 키워드를 맞춰보세요!</p>
                    </div>
                    <form>
                        <input className={styles.inputKeyword}
                                placeholder="입력하기"
                                value={answer}
                                onChange={handleGameNameInput}></input>
                    </form>
                </div>
                <button className={styles.confirmBtn} onClick={confirm}>
                    {" "}
                    입력{" "}
                </button>
                </main>
          </section>

        ) : mode === "correct" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <CelebrateIcon className={styles.icon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.informCorrectText}>
                        <p className={styles.correctText}>정답입니다!!!</p>
                    </div>
                </div>
                <button className={styles.confirmBtn} onClick={close}>
                    {" "}
                    아싸~{" "}
                </button>
                </main>
          </section>
        ) : mode === "assign" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.informBorder}>
                    <QuestionIcon className={styles.icon}/>
                    <div className={styles.infoText}>
                        <p className={styles.text}>{name}님의</p>
                        <p className={styles.text}>키워드를 정해주세요!</p>
                    </div>
                </div>
                <div className={styles.informBorder}>
                    <form>
                        <input className={styles.inputKeyword}
                                placeholder="입력하기"
                                value={targetGameName}
                                onChange={handleTargetInput}></input>
                    </form>
                </div>
                <button className={styles.confirmBtn} onClick={confirmTarget}>
                    {" "}
                    키워드 등록{" "}
                </button>
                </main>
          </section>
        ) : mode === "wait" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>모든 참가자들이 키워드를 입력할때까지 잠시 기다려주세요...
                        </p>
                    </div>
                </div>
                <button className={styles.confirmBtn} onClick={close}>
                    {" "}
                    입력{" "}
                </button>
                </main>
          </section>
        ) : mode === "start" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>양세찬 게임을 시작합니다~!~~!~!~
                        </p>
                    </div>
                </div>
                </main>
          </section>
        )
         : null}
         </>
           : null }
      </div>
    );
}

export default Keyword;