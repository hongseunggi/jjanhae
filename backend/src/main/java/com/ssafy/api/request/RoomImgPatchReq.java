package com.ssafy.api.request;


import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserProfileImgPatchReq")

public class RoomImgPatchReq {
    Long roomSeq;
    String imgUrl;
}
