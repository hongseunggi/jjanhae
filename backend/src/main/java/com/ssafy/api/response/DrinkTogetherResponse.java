package com.ssafy.api.response;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("CreateRoomResponse")
public class DrinkTogetherResponse {
    String name;
    String imgurl;
    int numberOf;
}
