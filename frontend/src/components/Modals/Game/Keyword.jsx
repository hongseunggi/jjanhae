import React, { useState, useEffect } from "react";
import styles from "./Keyword.module.css";
import { ReactComponent as GameIcon } from "../../../assets/icons/game.svg";
import { ReactComponent as CelebrateIcon } from "../../../assets/icons/celebrate.svg";
import { ReactComponent as QuestionIcon } from "../../../assets/icons/question.svg";


const Keyword = (props) => {
    const {open, close, confirmMyAnswer, confirmTargetGameName, mode} = props;
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
      confirmTargetGameName(targetGameName);
      setTargetGameName("");
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
                    <div className={styles.informText}>
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
                <div className={styles.icon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.informText}>
                        <p className={styles.text}>{}님의 키워드를 정해주세요!</p>
                    </div>
                    <form>
                        <input className={styles.inputKeyword}
                                placeholder="입력하기"
                                value={targetGameName}
                                onChange={handleTargetInput}></input>
                    </form>
                </div>
                <button className={styles.confirmBtn} onClick={confirmTarget}>
                    {" "}
                    입력{" "}
                </button>
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