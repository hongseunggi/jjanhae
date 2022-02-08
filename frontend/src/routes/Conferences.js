import React from "react";
import { Route, Routes } from "react-router-dom";
import RoomList from "../components/RoomList/RoomList";
import "../App.css";
// import Room from "../components/Room/Room";
import Room from "../components/Room/Room";

const User = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="" element={<Navigate to={}} /> */}
        <Route path="/list" element={<RoomList />} />
        <Route path="/detail/:roomseq" element={<Room />} />
      </Routes>
    </div>
  );
};

export default User;
