package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("CreateRoomResponse")
public class CreateRoomResponse extends BaseResponseBody {
    private Long conferenceId;

    public static CreateRoomResponse of (String message, Long conferenceId) {
        CreateRoomResponse res = new CreateRoomResponse();
        res.setMessage(message);
        res.setConferenceId(conferenceId);
        return res;
    }
}
