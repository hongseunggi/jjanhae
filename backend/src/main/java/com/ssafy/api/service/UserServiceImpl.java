package com.ssafy.api.service;


import com.ssafy.api.request.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserSignupPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 *	유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 */
@Service("userService")
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UserRepositorySupport userRepositorySupport;

    @Autowired
    PasswordEncoder passwordEncoder;

    // 회원가입
    @Override
    public User createUser(UserSignupPostReq userSignupInfo) {
        User user = new User();
        user.setUserId(userSignupInfo.getUserId());
        // 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
        user.setPassword(passwordEncoder.encode(userSignupInfo.getPassword()));
        user.setName(userSignupInfo.getName());
        user.setEmail(userSignupInfo.getEmail());
        user.setBirthday(userSignupInfo.getBirthday());
        user.setDrink(userSignupInfo.getDrink());
        user.setDrinkLimit(userSignupInfo.getDrinkLimit());
        user.setImageUrl("default");
        user.setAuthYn("Y");
        user.setAuthCode(userSignupInfo.getAuthCode());
        user.setDelYn("N");
        user.setProvider("local");
        return userRepository.save(user);
    }

    // 아이디 중복 확인
    @Override
    public User getUserByUserId(String userId) {
        // 디비에 유저 정보 조회 (userId를 통한 조회).
        System.out.println("====== getUserByUserId =====");
        System.out.println("userId : "+userId);
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        User user = null;
        if(res.isPresent()){
            user = res.get();
        }
        System.out.println("user : " + user);
        return user;
    }

    // 이메일 중복 확인
    @Override
    public User getUserByEmail(String email) {
        // 디비에 유저 정보 조회 (email을 통한 조회).
        System.out.println("====== getUserByEmail =====");
        System.out.println("email : "+email);
        Optional<User> res = userRepositorySupport.findUserByEmail(email);
        User user = null;
        if(res.isPresent()){
            user = res.get();
        }
        System.out.println("user : " + user);
        return user;
    }

    // 아이디 찾기 - userID와 email로 조회
    @Override
    public User getUserByNameAndEmail(String name, String email) {
        System.out.println("====== getUserByNameAndEmail =====");
        System.out.printf("name : %s, eamil : %s\n", name, email);
        Optional<User> res = userRepositorySupport.findUserByNameAndEmail(name, email);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
        }
        return user;
    }


    // 비밀번호 찾기 - userId와 email로 조회
    @Override
    public User getUserByUserIdAndEmail(String userId, String email) {
        System.out.println("====== getUserByUserIdAndEmail =====");
        System.out.printf("userId : %s, eamil : %s\n", userId, email);
        Optional<User> res = userRepositorySupport.findUserByUserIdAndEmail(userId, email);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
        }
        return user;
    }

    // authCode 갱신
    public void updateUserAuthCode(User user, String authCode){
        System.out.println("=====updateUserAuthCode========");
        user.setAuthCode(authCode);
        userRepository.save(user);
    }

    // 비번 수정
    @Override
    public void updateUserPassword(String userId, String password) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }
    }

    // 회원 프로필 정보 수정
    @Override
    @Transactional
    public void updateUserProfile(String userId, UserProfilePatchReq userProfilePatchReq) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        if(res.isPresent()) {
            User user = res.get();
		    user.setName(userProfilePatchReq.getName());
            user.setBirthday(userProfilePatchReq.getBirthday());
            user.setDrink(userProfilePatchReq.getDrink());
            user.setDrinkLimit(userProfilePatchReq.getDrinkLimit());
            userRepository.save(user);
            System.out.println("====" + user.getUserId() + " 프로필 변경 완료====");
        }
    }

    // 회원 프로필 이미지 수정
    @Override
    @Transactional
    public void updateUserProfileImg(String userId, String imageUrl) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        if(res.isPresent()) {
            User user = res.get();
            user.setImageUrl(imageUrl);
            userRepository.save(user);
            System.out.println("====" + user.getUserId() + " 프로필 이미지 변경 완료====");
        }
    }


    // 회원 탈퇴
    @Override
    @Transactional
    public void disableUser(String userId) {
        Optional<User> res = userRepositorySupport.findUserByUserId(userId);
        User user = null;
        if(res.isPresent()) {
            user = res.get();
            user.setDelYn("Y");
            userRepository.save(user);
            System.out.println("====" + user.getUserId() + " 탈퇴 처리 완료====");
        }
    }

    @Override
    public List<String> findUserNameByUserSeq(List userSeqList) {
       List<String> userNameList = userRepository.findUserNameByUserSeq(userSeqList);
       return userNameList;
    }


}
