package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("UserProfileImgPatchReq")
public class UserProfileImgPatchReq {
    @ApiModelProperty(name="프로필 이미지", example="default.png")
    String imageUrl;
}
