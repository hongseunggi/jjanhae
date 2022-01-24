package com.ssafy.api.service;

import com.ssafy.api.request.UserProfilePatchReq;
import com.ssafy.api.request.UserSignupPostReq;
import com.ssafy.db.entity.User;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 인터페이스 정의.
 */
public interface UserService {
	User createUser(UserSignupPostReq userSignupInfo);
	User getUserByUserId(String userId);
	User getUserByEmail(String email);
	User getUserByNameAndEmail(String name, String email);
	User getUserByUserIdAndNameAndEmail(String userId, String name, String email);
	void updateUserAuthCode(User user, String authCode);
	void updateUserProfile(String userId, UserProfilePatchReq userProfilePatchReq);
	void updateUserProfileImg(String userId, String imageUrl);
	void updateUserPassword(String userId, String password);
	void disableUser(String userId);
}
