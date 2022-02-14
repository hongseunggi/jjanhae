import React, { useState, useEffect, useRef } from "react";
import styles from "./Keyword.module.css";
import { ReactComponent as GameIcon } from "../../../assets/icons/game.svg";
import { ReactComponent as CelebrateIcon } from "../../../assets/icons/celebrate.svg";
import { ReactComponent as QuestionIcon } from "../../../assets/icons/question.svg";
import { ReactComponent as Sendclock } from "../../../assets/icons/sendclock.svg";
import { ReactComponent as RedClock } from "../../../assets/icons/redclock.svg";
import { ReactComponent as ProblemIcon } from "../../../assets/icons/problem.svg";
import UserApi from "../../../api/UserApi";
import { ReactComponent as SirenIcon } from "../../../assets/icons/siren.svg";
import { ReactComponent as PuzzleIcon } from "../../../assets/icons/puzzle.svg";
import { ReactComponent as CancleIcon } from "../../../assets/icons/cancleorange.svg";
import { ReactComponent as NoIcon } from "../../../assets/icons/no.svg";




const Keyword = (props) => {
    const {open, close, confirmMyAnswer, confirmTargetGameName, mode, targetNickName,gameId,sirenTargetNickName} = props;
    const [answer, setAnswer] = useState("");
    const [targetGameName, setTargetGameName] = useState("");
    console.log(targetNickName);
    console.log(mode);
    console.log("modal open");

    const handleGameNameInput = (event) => {
      setAnswer(event.target.value);
    }

    const handleTargetInput = (event) => {
      setTargetGameName(event.target.value);
    }

    const handleClose = (gameId, nextmode) => {
        close(nextmode);
    }

    const confirm = () => {
      confirmMyAnswer(answer, gameId);
      setAnswer("");
    }

    const confirmTarget = () => {
      console.log("here")
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
                <div className={styles.yangicon}>
                    <PuzzleIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.yanginfoText}>
                        <p className={styles.yangtext}>당신의  <span className={styles.warnText}>키워드</span>를 맞춰보세요!</p>
                    </div>
                    <form>
                        <input className={styles.inputKeyword}
                                placeholder="입력하기"
                                value={answer}
                                onChange={handleGameNameInput}></input>
                    </form>
                </div>
                <button className={styles.yangconfirmBtn} onClick={confirm}>
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
                <div className={styles.yangicon}>
                    <CelebrateIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.informCorrectText}>
                        <p className={styles.correctText}> <span className={styles.celText}>정답</span>입니다!!!</p>
                    </div>
                </div>
                <button className={styles.confirmBtn} onClick={()=>{handleClose("1","correct")}}>
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
                        <span className={styles.targetText}>{targetNickName}</span>
                        <span className={styles.text}>   님의</span>
                        <p className={styles.text}> <span className={styles.warnText}>키워드</span>를 정해주세요!</p>
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
                    <RedClock className={styles.sendClockIcon}/>
                    {/* <button className={styles.orangeCancleBtn} onClick={close}>
                      <CancleIcon className={styles.orangeCancleBtn}/>
                    </button> */}
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>참가자들이 순서대로   <span className={styles.warnText}>키워드</span>를 입력중입니다</p>
                        <p className={styles.text}>모든 참가자들이  <span className={styles.warnText}>키워드</span>를 입력을 마치면</p>
                        <p className={styles.text}>자동으로 <span className={styles.gameText}>게임</span>이 시작됩니다</p>
                        <p className={styles.text}>잠시만 기다려주세요</p>
                    </div>
                </div>
                </main>
          </section>
        ) : mode === "start" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>양세찬 게임을 시작합니다~!~~!~!~</p>
                        <p className={styles.text}>참가자들은 <span className={styles.greenText}>순서대로</span> 주어진 참가자에게 <span className={styles.warnText}>키워드</span>를 입략해주세요</p>
                        <p className={styles.text}>모든 참가자들이  <span className={styles.warnText}>키워드</span>를 입력을 마치면</p>
                        <p className={styles.text}>자동으로 <span className={styles.gameText}>게임</span>이 시작됩니다</p>
                    </div>
                </div>
                </main>
          </section>
        ) : mode === "letsplay" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.yanginfoText}>
                        <p className={styles.text}>당신의  <span className={styles.warnText}>키워드</span>는 뭘까요??? </p>
                        <p className={styles.text}>화면 안 <span className={styles.targetText}>포스트잇</span>을 클릭해 맞춰보세요~</p>
                    </div>
                </div>
                </main>
          </section>
        )
         :  mode === "wrong" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.failicon}>
                    <NoIcon className={styles.icon}/>
                </div>
                <div className={styles.failBorder}>
                    <div className={styles.failText}>
                        <p className={styles.text}> <span className={styles.warnText}>틀렸습니다.. </span></p>
                        <p className={styles.text}>다시 시도해보세요</p>
                    </div>
                </div>
                <button className={styles.retryBtn} onClick={()=>{handleClose("1","answer")}}>
                    {" "}
                    재도전{" "}
                </button>
                </main>
          </section>
        ) :  mode === "assignForbidden" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.informBorder}>
                    <ProblemIcon className={styles.icon}/>
                    <div className={styles.infoText}>
                        <span className={styles.targetText}>{targetNickName}</span>
                        <span className={styles.text}>   님의</span>
                        <p className={styles.text}> <span className={styles.warnText}>금지어</span>를 정해주세요!</p>
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
        )  :  mode === "waitForbidden" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <RedClock className={styles.sendClockIcon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>참가자들이 순서대로<span className={styles.warnText}>금지어</span>를 입력중입니다</p>
                        <p className={styles.text}>모든 참가자들이  <span className={styles.warnText}>금지어</span>를 입력을 마치면</p>
                        <p className={styles.text}>자동으로 <span className={styles.gameText}>게임</span>이 시작됩니다</p>
                        <p className={styles.text}>잠시만 기다려주세요</p>
                    </div>
                </div>
                </main>
          </section>
        ): mode === "letsplayForbidden" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.forbiddeninformBorder}>
                    <div className={styles.yanginfoText}>
                        <p className={styles.text}>당신의 <span className={styles.warnText}>금지어</span>는 무엇일까요??? </p>
                        <p className={styles.text}>화면 안 <span 포스트잇 styles={{color : "#ffff7f"}}>포스트잇</span>을 클릭해 맞춰보세요</p>
                        <p className={styles.text}>금지어 발설시 <span className={styles.warnText}>경고</span>를 당할 수 있습니다</p>
                        <p className={styles.text}>다른 참가자가 <span className={styles.warnText}>금지어</span> 를 말한다면</p>
                        <p className={styles.text}>가차없이 <span className={styles.warnText}>사이렌<SirenIcon className={styles.sirenicon}/></span>을 울려주세요!!
                        </p>
                    </div>
                </div>
               
                </main>
          </section>
        ) :mode === "answerForbidden" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                <PuzzleIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}>당신의  <span className={styles.warnText}>금지어</span>를 맞춰보세요!</p>
                    </div>
                    <form>
                        <input className={styles.inputKeyword}
                                placeholder="입력하기"
                                value={answer}
                                onChange={handleGameNameInput}></input>
                    </form>
                </div>
                <div>
                <button className={styles.confirminputBtn} onClick={confirm}>
                    {" "}
                    입력{" "}
                </button>
                <button className={styles.confirminputBtn} onClick={()=> {handleClose("2","answerForbidden")}}>
                    다음에
                </button>
                </div>
                </main>
          </section>
        ) :mode === "yousayForbidden" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.wingicon}>
                    <SirenIcon className={styles.wingwingicon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.alertText}>당신!!!</p>
                        <p className={styles.alertText}>방금 <span className={styles.warnText}>금지어</span>를 말하셨어요!!!!</p>
                    </div>
                </div>
                <button className={styles.confirmBtn} onClick={handleClose}>
                    {" "}
                    알겠어{" "}
                </button>
                </main>
          </section>
        ) :mode === "someonesayForbidden" ? (
          <section className={styles.modalForm}>
          <header>

            </header>
                <main className={styles.main}>
                <div className={styles.wingicon}>
                    <SirenIcon className={styles.wingwingicon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.alertText}><span className={styles.targetText}>{sirenTargetNickName}</span>님이 <span className={styles.warnText}>금지어</span>를 말하셨습니다!!!!</p>
                    </div>
                </div>
                <button className={styles.confirmBtn} onClick={handleClose}>
                    {" "}
                    벌칙가자{" "}
                </button>
                </main>
          </section>
        ) :
          null}
         </>
           : null }
      </div>
    );
}

export default Keyword;