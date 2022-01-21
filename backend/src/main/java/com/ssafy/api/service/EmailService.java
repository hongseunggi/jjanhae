package com.ssafy.api.service;

import com.ssafy.api.request.FindIdRequest;
import com.ssafy.api.request.FindPwdRequest;

public interface EmailService {
    String sendSimpleMessage(FindIdRequest findIdRequest) throws Exception;
    String sendSimpleMessageButton(FindPwdRequest findPwdRequest) throws Exception;
    String sendAuthCode(String email) throws Exception;
}
