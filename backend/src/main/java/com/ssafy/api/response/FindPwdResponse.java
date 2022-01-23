package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("FindPwdResponse")
public class FindPwdResponse {
    String message;
    String authCode;
    String userId;

    public static FindPwdResponse of(String msg, String authCode, String userId) {
        FindPwdResponse res = new FindPwdResponse();
        res.setMessage(msg);
        res.setAuthCode(authCode);
        res.setUserId(userId);
        return res;
    }
}
