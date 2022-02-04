package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("SortRoomListResponse")
public class SortRoomListResponse  extends BaseResponseBody {
    List<SortRoomResponse> content;

    public static SortRoomListResponse of(List<SortRoomResponse> content) {
        SortRoomListResponse res = new SortRoomListResponse();
        res.setContent(content);
        return res;
    }
}
