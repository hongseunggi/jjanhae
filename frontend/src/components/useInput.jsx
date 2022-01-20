import React, {useState} from "react";

export const useInput = (initialVlue, validator) => {
    const [value, setValue] = useState(initialVlue);
    const onChange = (event) => {
        const { id, value } = event.target;
        let update = false;

        if(id==="password") console.log("this is password");
        
        if(typeof validator === "function") {
            update = validator(value);
        }

        //유효성 검사 통과시 value저장
        if(update) {
            setValue(value);
        }

        console.log(value);
    }
    return {value, onChange};
};
