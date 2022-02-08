import React from "react";
import { Route, Routes } from "react-router-dom";
import RoomList from "../components/RoomList/RoomList";
import "../App.css";
// import Room from "../components/Room/Room";
import Room2 from "../components/Room/Room2";

const User = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="" element={<Navigate to={}} /> */}
        <Route path="/list" element={<RoomList />} />
        <Route path="/detail" element={<Room2 />} />
      </Routes>
    </div>
  );
};

export default User;
