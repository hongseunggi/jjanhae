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
<<<<<<< HEAD
        <Route path="/detail" element={<Room2 />} />
=======
        <Route path="/detail" element={<Room />} />
>>>>>>> f8fb8f5788fb5691a7b304cd00d2a6d7b7259612
      </Routes>
    </div>
  );
};

export default User;
