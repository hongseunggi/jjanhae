package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("FindPwdRequest")
public class FindPwdRequest {
    String userId;
    String name;
    String email;
}
