import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import RoomList from "../components/RoomList/RoomList";
import "../App.css";
import Room from "../components/Room/Room";
import SessionIdContext from "../contexts/SessionIdContext";

const User = () => {
  const [sessionId, setSessionId] = useState("");
  return (
    <div>
      <SessionIdContext.Provider value={{ sessionId, setSessionId }}>
        <Routes>
          {/* <Route path="" element={<Navigate to={}} /> */}
          <Route path="/list" element={<RoomList />} />
          <Route path="/detail/:title/:roomseq" element={<Room />} />t
        </Routes>
      </SessionIdContext.Provider>
    </div>
  );
};

export default User;
