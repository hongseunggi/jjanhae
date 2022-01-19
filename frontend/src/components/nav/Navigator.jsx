import React,{ useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
function Navigator(props) {
  const {status, isLogin} = props;

  const handleLogOut = () =>{
      isLogin("1");
  }
  switch(status){
    case "1" :
      return(
        <nav><Link to = "/" >Logo</Link>
        <Link to = "/login" >로그인</Link></nav>
      )
    case "2" :
      return(
        <nav><Link to = "/" >Logo</Link>
        <Link to = "/profile">프로필</Link>
        <p onClick={handleLogOut}>로그아웃</p></nav>
      )
    case "3" :
      return(
        <nav><Link to = "/" >Logo</Link>
        <Link to = "/conferences" >exit</Link></nav>
      )
  }
}

export default Navigator;