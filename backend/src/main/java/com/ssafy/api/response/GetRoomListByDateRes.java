package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Room;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 *  현재 유저의 특정 날짜에 열린 파티 목록 조회 ([GET] /user/conferences?date={}) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("ConferencesGetRes")
public class GetRoomListByDateRes extends BaseResponseBody{
    @ApiModelProperty(name="파티 리스트", example="room : [title : 안녕, startTime : 2022-02-03 00:00:00, endTime : 2022-02-04-05:34:02, imageUrl : https://s3.ap-northeast-2.amazonaws.com/jjanhae-image/image/%EC%83%9D%ED%99%9C%EA%B4%80.jpg}]")
//    List<Integer> roomSeqList;
    List<Room> roomList;


    public static GetRoomListByDateRes of(Integer statusCode, String message, List<Room> roomList) {
        GetRoomListByDateRes res = new GetRoomListByDateRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setRoomList(roomList);
        return res;
    }
}
