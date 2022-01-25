import React, { useState } from "react";
import Calendar from 'react-calendar';
import styles from "./Calender.module.css";
import axios from "axios";

const CalendarPage = () => {

    const [date , setDate] = useState(new Date());

    return (
        <>
          <Calendar>
            
          </Calendar>   
        </>
    );
    
}
