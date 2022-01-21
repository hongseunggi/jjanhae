package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("CheckEmailResponse")
public class CheckEmailResponse {
    String accessCode;

    public static CheckEmailResponse of(String authCode) {
        CheckEmailResponse res = new CheckEmailResponse();
        res.setAccessCode(authCode);
        return res;
    }
}
