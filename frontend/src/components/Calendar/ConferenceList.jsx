import React, { useState } from "react";
import styles from "./ConferenceList.module.css";

const ConferenceList = (props) => {
    const { open, close, partyList, getDetailModalOpen, getSelectedParty, date} = props;
    const [partyDetail, setPartyDetail] = useState([
        {time : "17:00", title:"놀자!"},
        {time : "19:00", title:"술먹을사람~!"},
        {time : "22:00", title:"안녕~!"},
    ]);

    const showList = () => {
        const result = [];
        for(let i = 0; i<partyDetail.length; i++) {
            result.push(<div className={styles.listItem}>{partyDetail[i].time} {partyDetail[i].title}</div>);
        }
        return (result);
    }

    const openDetailModal = (event) => {
      props.getDetailModalOpen(true);
    };

    return (
        <div className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}>
         {open ? (
        <section>
          <header>
          <div className={styles.title}>파티이력</div>
            <button className="close" onClick={close}>
              {' '}
              &times;{' '}
            </button>
          </header>
          {/* <main>{props.children}</main> */}
          <main>
            <div className={styles.listborder} onClick = {openDetailModal}>
                {showList()}
            </div>
        </main>
        <div className={styles.btn}>
            <button className={styles.btnClose} onClick={close}>
            {' '}
            close{' '}
        </button>
        </div>
        </section>
      ) : null}
        </div>
    )
}

export default ConferenceList;