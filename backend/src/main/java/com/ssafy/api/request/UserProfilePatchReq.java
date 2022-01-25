package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@ApiModel("UserProfilePatchReq")
public class UserProfilePatchReq {
    @ApiModelProperty(name="유저 이름", example="김싸피")
    String name;
    @ApiModelProperty(name="유저 email", example="ssafy@ssafy.com")
    String email;
    @ApiModelProperty(name="유저 생년월일", example="2022. 1 .20")
    LocalDate birthday;
    @ApiModelProperty(name="유저 선호 주종", example="맥주")
    String drink;
    @ApiModelProperty(name="유저 주량", example="1")
    Integer drinkLimit;
}
