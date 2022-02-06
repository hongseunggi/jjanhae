package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@ApiModel("SearchRoomResponse")
public class SearchRoomResponse {
    Long roomSeq; // roomSeq
    int type; // 0:비공개, 1:공개
    String password; // 공개방일 시 ""
    int joinUserNum; // 참여인원수
    String ownerId; // 방장 ID
    LocalDateTime startTime; // 시작시간
    String thumbnail; // 썸네일이미지url
    String title; // 방제
    String description; // 방설명
    int drinkLimit; // 주량
}
