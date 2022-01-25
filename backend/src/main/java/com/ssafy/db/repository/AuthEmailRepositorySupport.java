package com.ssafy.db.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.Optional;
import com.ssafy.db.entity.QAuthEmail;
import com.ssafy.db.entity.AuthEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

/**
 * 인증 이메일 관련 디비 쿼리 생성을 위한 구현 정의.
 */
@Repository
public class AuthEmailRepositorySupport {
    @Autowired
    private JPAQueryFactory jpaQueryFactory;
    QAuthEmail qEmail = QAuthEmail.authEmail;

    public Optional<AuthEmail> findAuthEmailByEmail(String email) {
        AuthEmail auth_email = jpaQueryFactory.select(qEmail).from(qEmail)
                .where(qEmail.email.eq(email)).fetchOne();
        if(auth_email == null) return Optional.empty();
        return Optional.ofNullable(auth_email);
    }
}
