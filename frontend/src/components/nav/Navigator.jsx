import React,{ useEffect, useState } from 'react';
import {Link} from 'react-router-dom'
function Navigator(props) {
    return(
      <nav><Link to = "/" >Logo</Link>
      <Link to = "/login" >로그인</Link></nav>
    )
    return
}

export default Navigator;