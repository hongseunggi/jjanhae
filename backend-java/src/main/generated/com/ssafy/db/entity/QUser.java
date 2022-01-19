package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;


/**
 * QUser is a Querydsl query type for User
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QUser extends EntityPathBase<User> {

    private static final long serialVersionUID = 846542477L;

    public static final QUser user = new QUser("user");

<<<<<<< Updated upstream:backend-java/src/main/generated/com/ssafy/db/entity/QUser.java
    public final QBaseEntity _super = new QBaseEntity(this);

    public final StringPath department = createString("department");
=======
    public final StringPath authCode = createString("authCode");

    public final StringPath authYn = createString("authYn");

    public final DateTimePath<java.time.LocalDate> birthday = createDateTime("birthday", java.time.LocalDate.class);

    public final StringPath delYn = createString("delYn");

    public final StringPath drink = createString("drink");

    public final NumberPath<Integer> drinkLimit = createNumber("drinkLimit", Integer.class);

    public final StringPath email = createString("email");

    public final StringPath imageUrl = createString("imageUrl");
>>>>>>> Stashed changes:backend/src/main/generated/com/ssafy/db/entity/QUser.java

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final StringPath name = createString("name");

    public final StringPath password = createString("password");

    public final StringPath userId = createString("userId");

    public final NumberPath<Long> userSeq = createNumber("userSeq", Long.class);

    public QUser(String variable) {
        super(User.class, forVariable(variable));
    }

    public QUser(Path<? extends User> path) {
        super(path.getType(), path.getMetadata());
    }

    public QUser(PathMetadata metadata) {
        super(User.class, metadata);
    }

}

