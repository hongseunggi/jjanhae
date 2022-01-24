package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QAuthEmail is a Querydsl query type for AuthEmail
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QAuthEmail extends EntityPathBase<AuthEmail> {

    private static final long serialVersionUID = 1808655698L;

    public static final QAuthEmail authEmail = new QAuthEmail("authEmail");

    public final StringPath authCode = createString("authCode");

    public final NumberPath<Long> authSeq = createNumber("authSeq", Long.class);

    public final StringPath email = createString("email");

    public final StringPath timeLimit = createString("timeLimit");

    public QAuthEmail(String variable) {
        super(AuthEmail.class, forVariable(variable));
    }

    public QAuthEmail(Path<? extends AuthEmail> path) {
        super(path.getType(), path.getMetadata());
    }

    public QAuthEmail(PathMetadata metadata) {
        super(AuthEmail.class, metadata);
    }

}

