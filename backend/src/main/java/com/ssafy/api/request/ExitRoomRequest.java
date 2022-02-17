package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("ExitRoomRequest")
public class ExitRoomRequest {
    // String userId; 퇴장하는 유저아이디는 Header에서 뽑기로~
    Long roomSeq; // 퇴장하는 roomSeq
}
