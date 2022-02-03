package com.ssafy.api.controller;

import com.ssafy.api.request.AddHistoryRequest;
import com.ssafy.api.request.CreateRoomRequest;
import com.ssafy.api.service.RoomHistoryService;
import com.ssafy.api.service.RoomService;
import com.ssafy.common.auth.SsafyUserDetails;
import com.ssafy.common.model.response.BaseResponseBody;
import com.ssafy.db.entity.Room;
import com.ssafy.db.entity.RoomHistory;
import com.ssafy.db.entity.User;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import java.time.LocalDate;

/**
 * 방 관련 API 요청 처리를 위한 컨트롤러 정의.
 */
@Api(value = "방 API")
@RestController
@RequestMapping("/api/v1/conferences")
public class RoomController {

    @Autowired
    RoomService roomService;

    @Autowired
    RoomHistoryService roomHistoryService;

    @PostMapping(value = "")
    @ApiOperation(value = "방 생성", notes = "방을 생성한다.")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "사용자 없음"),
            @ApiResponse(code = 403, message = "권한 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<BaseResponseBody> createRoom(@ApiIgnore Authentication authentication, @RequestBody CreateRoomRequest createRoomRequest) {
        /**
         * 유저 권한으로 방을 생성한다.
         * 권한 : 해당 유저
         * */
        if(authentication == null){
            System.out.println("얘 토큰 없다!!");
            return ResponseEntity.status(403).body(BaseResponseBody.of(403, "로그인이 필요합니다."));
        }
        // 토큰이 있는 유저일 때만 userId 얻어내기
        SsafyUserDetails userDetails = (SsafyUserDetails)authentication.getDetails();
        System.out.println("로그인한 유저 : "+ userDetails.getUser());
        User user = userDetails.getUser();
        // 얻어낸 user객체로 userSeq 얻어내기
        System.out.println("user seq : " + user.getUserSeq());
        System.out.println("userId : "+user.getUserId());

        // Room 테이블에 userSeq 포함하여 저장.
        createRoomRequest.setOwner(user.getUserSeq());
        Room room = roomService.createRoom(createRoomRequest);

        // 얻어낸 roomSeq로 Room_history 테이블에도 추가
        Long roomSeq = room.getRoomSeq();
        AddHistoryRequest addHistoryRequest = new AddHistoryRequest();
        addHistoryRequest.setRoomSeq(roomSeq);
        addHistoryRequest.setUserSeq(user.getUserSeq());
        addHistoryRequest.setAction(0);
        addHistoryRequest.setLastYn("Y");
        addHistoryRequest.setInsertedTime(LocalDate.now());
        RoomHistory roomHistory = roomHistoryService.addHistory(room, addHistoryRequest);

        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }


}
