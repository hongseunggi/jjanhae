import React from "react";

const RoomConfig = ({ open }) => {
  // const { open, close, header } = props;
  return (
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section>
          <header>
            <h1>파티룸 생성하기</h1>
          </header>
          <main>방 설정들</main>
          <footer>
            <button className="close"> 취소 </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default RoomConfig;
