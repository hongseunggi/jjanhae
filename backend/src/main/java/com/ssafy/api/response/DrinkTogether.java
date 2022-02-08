package com.ssafy.api.response;

import com.ssafy.db.entity.User;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;


@ApiModel("DrinkTogether")
public interface DrinkTogether {
    Long getUserSeq();
    int getNumberOf();
}
