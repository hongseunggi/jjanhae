package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@ApiModel("AddHistoryRequest")
public class AddHistoryRequest {
    Long userSeq; // 행위자 userSeq
    Long roomSeq; // target room
    int action; // 0:CREATE, 1:JOIN, 2:EXIT
    LocalDateTime insertedTime; // 로그가 쌓인 시각
    String lastYn; // 현재 방에 접속중인지 Y or N
}
