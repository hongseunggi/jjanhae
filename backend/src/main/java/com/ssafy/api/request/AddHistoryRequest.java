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
    String action; // CREATE/JOIN/EXIT
    LocalDateTime insertedTime; // 로그가 쌓인 시각
    LocalDateTime updatedTime; // 업데이트시각
}
