package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;

import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 *  현재 room seq에 참여한 모든 유저 리스트 조회 ([GET] /user/history?roomSeq={}) 요청에 대한 응답값 정의.
 */
@Getter
@Setter
@ApiModel("GetUserListByRoomSeqRes")
public class GetUserListByRoomSeqRes  extends BaseResponseBody {
    @ApiModelProperty(name = "유저 리스트", example = "[]")
//    List<User> userList;
//    List<Integer> userList;
    List<String> userList;
    Room room;


    public static GetUserListByRoomSeqRes of(Integer statusCode, String message, List<String> userList, Room room) {
        GetUserListByRoomSeqRes res = new GetUserListByRoomSeqRes();
        res.setStatusCode(statusCode);
        res.setMessage(message);
        res.setUserList(userList);
        res.setRoom(room);
        return res;
    }

}