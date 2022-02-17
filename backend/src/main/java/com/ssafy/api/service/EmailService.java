package com.ssafy.api.service;

import com.ssafy.api.request.FindIdRequest;
import com.ssafy.api.request.FindPwdRequest;
import com.ssafy.db.entity.AuthEmail;

public interface EmailService {
    AuthEmail getAuthEmailByEmail(String email);
    AuthEmail createAuthEmail(String email, String authCode);
    AuthEmail updateAuthEmail(String email, String authCode);
    void deleteAuthEmail(AuthEmail authEmail);
    String sendSimpleMessage(FindIdRequest findIdRequest) throws Exception;
    String sendSimpleMessageButton(FindPwdRequest findPwdRequest) throws Exception;
    String sendAuthCode(String email) throws Exception;
}
