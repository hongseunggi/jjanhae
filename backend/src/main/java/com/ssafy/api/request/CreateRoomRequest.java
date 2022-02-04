package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("CreateRoomRequest")
public class CreateRoomRequest {
    Long owner; // 방장 userSeq
    String name; // 방제목
    String thumbnail; // 썸네일이미지 url
    int type; // 0:비공개, 1:공개
    String password; // 공개방일 시 ""
    String description; // 방 설명
    int drinkLimit; // 주량
    boolean ismute; // 음소거 여부
    boolean isOn; // 카메라 on off 여부
}
