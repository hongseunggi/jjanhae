import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import RoomList from "../components/RoomList/RoomList";
import "../App.css";
import Room from "../components/Room/Room";
import SessionIdContext from "../contexts/SessionIdContext";
import BangZzangContext from "../contexts/BangZzangContext";

const User = () => {
  const [sessionId, setSessionId] = useState("");
  const [bangZzang, setbangZzang] = useState("");
  return (
    <div>
      <SessionIdContext.Provider value={{ sessionId, setSessionId }}>
      <BangZzangContext.Provider value={{ bangZzang, setbangZzang}}>
        <Routes>
          {/* <Route path="" element={<Navigate to={}} /> */}
          <Route path="/list" element={<RoomList />} />
          <Route path="/detail/:title/:roomseq" element={<Room />} />t
        </Routes>
        </BangZzangContext.Provider>
      </SessionIdContext.Provider>
    </div>
);
};

export default User;
