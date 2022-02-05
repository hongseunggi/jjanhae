package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("EnterRoomRequest")
public class EnterRoomRequest {
    Long conferenceId;
    String userId;
    String password;
    String ismute;
    String isOn;
}
