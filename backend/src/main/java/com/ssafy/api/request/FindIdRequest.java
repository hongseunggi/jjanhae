package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("FindIdRequest")
public class FindIdRequest {
    String name;
    String email;
}
