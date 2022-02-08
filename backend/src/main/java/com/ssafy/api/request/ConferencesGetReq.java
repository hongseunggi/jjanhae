package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * 파티 리스트 조회 ([GET] /api/v1/users/conferences) 요청에 필요한 리퀘스트 바디 정의.
 */

@Getter
@Setter
@ApiModel("ConferencesGetReq")
public class ConferencesGetReq {
    @ApiModelProperty(name="이번 달", example="2")
    String month;
}
