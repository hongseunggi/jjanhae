package com.ssafy.api.response;

import com.ssafy.common.model.response.BaseResponseBody;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ImgFileResponse extends BaseResponseBody {
    //    private String accessToken;
    private String url;

    public static ImgFileResponse of (Integer statusCode, String message, String img) {
        ImgFileResponse res = new ImgFileResponse();
        res.setStatusCode(statusCode);
        res.setMessage(message);
//        res.setAccessToken(accessToken);
        res.setUrl(img);
        return res;
    }
}
