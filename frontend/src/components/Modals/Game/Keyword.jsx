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
import { ReactComponent as ForbiddenIcon } from "../../../assets/icons/forbidden.svg";
import { ReactComponent as FireworksIcon } from "../../../assets/icons/fireworks.svg"; 
import { ReactComponent as ConfetiIcon } from "../../../assets/icons/confeti.svg"; 
import { ReactComponent as ClapIcon } from "../../../assets/icons/clap.svg"; 
import { ReactComponent as ThumbupIcon } from "../../../assets/icons/thumbup.svg"; 




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
    if(answer!==""&&answer!==" ") {
        confirmMyAnswer(answer, gameId);
        setAnswer("");
        }
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
                                onChange={handleGameNameInput}
                                onKeyPress = {(event)=> {
                                if(event.key==="Enter") {
                                    confirm();
                                }
                                }}>
                                </input>
                    </form>
                </div>
                <div>
                    <button className={styles.yangconfirmBtn} onClick={confirm}>
                        {" "}
                        입력{" "}
                    </button>
                    <button className={styles.confirminputBtn} onClick={()=> {handleClose("1","answer")}}>
                        다음에
                    </button>
                </div>
                </main>
          </section>

        ) : mode === "correct" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <ClapIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.informCorrectText}>
                        <p className={styles.correctText}> <ConfetiIcon className={styles.smallicon}/>당신의 키워드를 맞추셨어요!!<ConfetiIcon className={styles.smallicon}/></p>
                        <p className={styles.correctText}> <ConfetiIcon className={styles.smallicon}/>축하드립니다~!!<ConfetiIcon className={styles.smallicon}/></p>
                    </div>
                </div>
                <button className={`${styles.confirmBtnOutline} ${styles.confirmBtn}`} onClick={()=>{handleClose("1","correct")}}>
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
                                onChange={handleTargetInput}
                                onKeyPress = {(event)=> {
                                if(event.key==="Enter") {
                                    confirmTarget();
                                }
                                }}>
                                </input>
                    </form>
                </div>
                <button className={styles.confirmBtn} onClick={confirmTarget} onKeyPress = {(event)=> {
                    if(event.key==="Enter") {
                        confirmTarget();
                    }
                }}>
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
                        <p className={styles.text}>모든 참가자들이  <span className={styles.warnText}>키워드</span> 입력을 마치면</p>
                        <p className={styles.text}>자동으로 <span className={styles.gameText}>게임</span>이 시작됩니다</p>
                        <p className={styles.text}><span className={styles.yellowText}>잠시만 기다려주세요</span></p>
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
                        <p className={styles.text}><span className={styles.purpleText}>양세찬 게임</span>을 시작합니다~!</p>
                        <p className={styles.text}>참가자들은 <span className={styles.greenText}>순서대로</span> 주어진 참가자에게 <span className={styles.warnText}>키워드</span>를 입력합니다</p>
                        <p className={styles.text}>질문을 통해서 자신의<span className={styles.warnText}>키워드</span>를 맞춰보세요</p>
                        <p className={styles.text}>그럼 <span className={styles.yellowText}>시작</span>하겠습니다~</p>
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
                        <p className={styles.text}><span className={styles.gameText}>질문</span>을 통해 자신의<span className={styles.warnText}>키워드</span>를 유추하고</p>
                        <p className={styles.text}>화면 안 <span className={styles.yellowText}>포스트잇</span>을 클릭해</p>
                        <p className={styles.text}><span className={styles.warnText}>키워드</span>를 맞춰보세요</p>
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
                    <div className={styles.infoForbiddenText}>
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
                                onChange={handleTargetInput}
                                onKeyPress = {(event)=> {
                                if(event.key==="Enter") {
                                    confirmTarget();
                                }
                                }}>
                        </input>
                            </form>
                </div>
                <button className={styles.confirmBtn} onClick={confirmTarget} >
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
                        <p className={styles.text}>모든 참가자들이  <span className={styles.warnText}>금지어</span> 입력을 마치면</p>
                        <p className={styles.text}>자동으로 <span className={styles.gameText}>게임</span>이 시작됩니다</p>
                        <p className={styles.text}><span className={styles.yellowText}>잠시만 기다려주세요</span></p>
                    </div>
                </div>
                </main>
          </section>
        ): mode === "letsplayForbidden" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.forbiddenicon}>
                    <QuestionIcon className={styles.icon}/>
                </div>
                <div className={styles.forbiddeninformBorder}>
                    <div className={styles.forbiddeninfoText}>
                        <p className={styles.text}>당신의 <span className={styles.warnText}>금지어</span>는 무엇일까요??? </p>
                        <p className={styles.text}>화면 안 <span className={styles.yellowText}>포스트잇</span>을 클릭해 맞춰보세요</p>
                        <p className={styles.text}>금지어 발설시 <span className={styles.noText}>경고</span>를 당할 수 있습니다</p>
                        <p className={styles.text}>다른 참가자가 <span className={styles.warnText}>금지어</span> 를 말한다면</p>
                        <p className={styles.text}>가차없이 <span className={styles.orangeText}>사이렌<SirenIcon className={styles.sirenicon}/></span>을 울려주세요!!
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
                                onChange={handleGameNameInput}
                                onKeyPress = {(event)=> {
                                if(event.key==="Enter") {
                                    confirm();
                                }
                                }}>
                                </input>
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
                        <p className={styles.alertText}>방금 <span className={styles.saywarnText}>금지어</span>를 말하셨어요!!!!</p>
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
                        <p className={styles.alertText}><span className={styles.targetText}>{sirenTargetNickName}</span>님이 <span className={styles.saywarnText}>금지어</span>를 말하셨습니다!!!!</p>
                        <p className={styles.alertText}>어서 <span className={styles.celebrateText}>벌칙</span>을 진행해주세요!!!!</p>

                    </div>
                </div>
                <button className={styles.confirmBtn} onClick={handleClose}>
                    {" "}
                    벌칙가자{" "}
                </button>
                </main>
          </section>
        ) : mode === "startForbidden" ? (
          <section className={styles.modalForm}>
            <header>
            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <ForbiddenIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.infoText}>
                        <p className={styles.text}><span className={styles.purpleText}>금지어 게임</span>을 시작합니다~!</p>
                        <p className={styles.text}>참가자들은 <span className={styles.greenText}>순서대로</span> 주어진 참가자에게 <span className={styles.warnText}>금지어</span>를 입력해주세요</p>
                        <p className={styles.text}>모든 참가자들이  <span className={styles.warnText}>금지어</span>를 입력을 마치면</p>
                        <p className={styles.text}>자동으로 <span className={styles.gameText}>게임</span>이 시작됩니다</p>
                    </div>
                </div>
                </main>
          </section>
        )  : mode === "correctForbidden" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <ClapIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.informCorrectText}>
                        <p className={styles.correctText}> <ConfetiIcon className={styles.smallicon}/>당신의 금지어를 맞추셨어요!!<ConfetiIcon className={styles.smallicon}/></p>
                        <p className={styles.correctText}> <ConfetiIcon className={styles.smallicon}/>축하드립니다~!!<ConfetiIcon className={styles.smallicon}/></p>
                    </div>
                </div>
                <button className={`${styles.confirmBtnOutline} ${styles.confirmBtn}`} onClick={()=>{handleClose("1","correct")}}>
                    {" "}
                    아싸~{" "}
                </button>
                </main>
          </section>
        )  : mode === "already" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <ThumbupIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.informCorrectText}>
                        <p className={styles.correctText}>이미 당신은  <span className={styles.saywarnText}>키워드</span>를 맞추셨어요!!</p>
                        <p className={styles.correctText}> 축하드립니다~!!</p>
                    </div>
                </div>
                <button className={`${styles.confirmBtnOutline} ${styles.confirmBtn}`} onClick={()=>{handleClose("1","correct")}}>
                    {" "}
                    확인{" "}
                </button>
                </main>
          </section>
        )  :  mode === "alreadyForbidden" ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.yangicon}>
                    <ThumbupIcon className={styles.icon}/>
                </div>
                <div className={styles.yanginformBorder}>
                    <div className={styles.informCorrectText}>
                        <p className={styles.correctText}> <ConfetiIcon className={styles.smallicon}/>당신은 이미 <span className={styles.saywarnText}>금지어</span>를 맞추셨어요!!<ConfetiIcon className={styles.smallicon}/></p>
                        <p className={styles.correctText}> <ConfetiIcon className={styles.smallicon}/>축하드립니다~!!<ConfetiIcon className={styles.smallicon}/></p>
                    </div>
                </div>
                <button className={`${styles.confirmBtnOutline} ${styles.confirmBtn}`} onClick={()=>{handleClose("1","correct")}}>
                    {" "}
                    확인{" "}
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
