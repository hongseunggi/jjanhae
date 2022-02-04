package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;

import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 *  이번달 파티 목록 조회 ([GET] /user/conferences) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("ConferencesGetRes")
public class ConferencesGetRes extends BaseResponseBody {
    @ApiModelProperty(name="파티 리스트", example="['2022-02-01', '2022-02-02', '2022-02-03']")
    List<LocalDate> conferencesDateList;

    public static ConferencesGetRes of(Integer statusCode, String message, List<LocalDate> conferencesDateList) {
        ConferencesGetRes res = new ConferencesGetRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setConferencesDateList(conferencesDateList);
        return res;
    }
}
