package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class FindIdResponse extends BaseResponseBody {
//    private String accessToken;
    private String userId;

    public static FindIdResponse of (Integer statusCode, String message, String userId) {
        FindIdResponse res = new FindIdResponse();
        res.setStatusCode(statusCode);
        res.setMessage(message);
//        res.setAccessToken(accessToken);
        res.setUserId(userId);
        return res;
    }
}
