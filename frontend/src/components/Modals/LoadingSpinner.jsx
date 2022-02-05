import React, { useState } from "react";
import style from "./LoadingSpinner.module.css";
// import {Hearts} from "react-loader-spinner";
import SyncLoader from "react-spinners/SyncLoader";

function LoadingSpinner() {
    return (
        
            <div className={`${style.openModal} ${style.modal}`}>
                <SyncLoader color="#0080ff" loading = {true} size={20} margin={3} />
            </div>
            
        
        
    );
}

export default LoadingSpinner;
