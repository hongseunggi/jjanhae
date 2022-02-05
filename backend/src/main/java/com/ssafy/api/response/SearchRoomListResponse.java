package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@ApiModel("SearchRoomListResponse")
public class SearchRoomListResponse extends BaseResponseBody {
    List<SearchRoomResponse> content;

    public static SearchRoomListResponse of(List<SearchRoomResponse> content) {
        SearchRoomListResponse res = new SearchRoomListResponse();
        res.setContent(content);
        return res;
    }
}
