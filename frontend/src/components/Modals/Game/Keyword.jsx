import React, { useState, useEffect } from "react";
import styles from "./Keyword.module.css";
import { ReactComponent as GameIcon } from "../../assets/icons/game.svg";


const Keyword = (props) => {
    const {open, close} = props;
    const [keyword, setKeyword] = useState();

    const handleInput = (event) => {
      setKeyword(event.target.value);
    }

    const confirm = () => {
      console.log(keyword);
      close();
    }

    return (
        <div
        className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
      >
        {open ? (
          <section className={styles.modalForm}>
            <header>

            </header>
                <main className={styles.main}>
                <div className={styles.icon}>
                    <GameIcon className={styles.icon}/>
                </div>
                <div className={styles.informBorder}>
                    <div className={styles.informText}>
                        <p className={styles.text}>당신의 키워드를 입력해주세요!</p>
                    </div>
                    <form>
                        <input className={styles.inputKeyword}
                                placeholder="입력하기"
                                value={keyword}
                                onChange={handleInput}></input>
                    </form>
                </div>
                <button className={styles.confirmBtn} onClick={close}>
                    {" "}
                    입력{" "}
                </button>
                </main>
          </section>
        ) : null}
      </div>
    );
}

export default Keyword;