package com.ssafy.api.response;

import com.ssafy.db.entity.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("CheckIdResponse")
public class CheckIdRes {
    @ApiModelProperty(name="status")
    String status;

    public static CheckIdRes of(String st) {
        CheckIdRes res = new CheckIdRes();
        res.setStatus(st);
        return res;
    }
}
