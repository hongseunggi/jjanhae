import React from "react";
import { Route, Routes } from "react-router-dom";
import RoomList from "../components/RoomList/RoomList";


const User = () => {
  return (
    <div>
      <Routes>
        {/* <Route path="" element={<Navigate to={}} /> */}
        <Route path="/list" element={<RoomList />} />
    </Routes>
    </div>
  );
};

export default User;
