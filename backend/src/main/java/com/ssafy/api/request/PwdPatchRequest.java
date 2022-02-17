package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("PasswordPatchRequest")
public class PwdPatchRequest {
    String userId;
    String password;
    String authCode;
}