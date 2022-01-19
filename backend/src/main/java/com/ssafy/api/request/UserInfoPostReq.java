package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserInfoPostReq")
public class UserInfoPostReq {
   String position;
   String department;
   String name;
   String userId;
}
