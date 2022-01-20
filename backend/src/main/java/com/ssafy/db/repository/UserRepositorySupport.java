package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.db.entity.QUser;
import com.ssafy.db.entity.User;

import java.util.Optional;

import org.checkerframework.checker.nullness.Opt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 유저 모델 관련 디비 쿼리 생성을 위한 구현 정의.
 */
@Repository
public class UserRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QUser qUser = QUser.user;

    public Optional<User> findUserByUserId(String userId) {
        User user = jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.userId.eq(userId)).fetchOne();
        if(user == null) return Optional.empty();
        return Optional.ofNullable(user);
    }

    public Optional<User> findUserByNameAndEmail(String name, String email) {
        User user = jpaQueryFactory.select(qUser).from(qUser)
                .where(qUser.name.eq(name).and(qUser.email.eq(email))).fetchOne();
        System.out.println("======= findUserByNameAndEmail =======");
        System.out.println("user : " + user);
        if(user == null) return Optional.empty();
        return Optional.ofNullable(user);
    }

    public Long deleteByUserId(String userId) {
        Long affectedRow = jpaQueryFactory.delete(qUser)
                .where(qUser.userId.eq(userId))
                .execute();
        return affectedRow;
    }

}
