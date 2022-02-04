package com.ssafy.db.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRoomHistory is a Querydsl query type for RoomHistory
 */
@Generated("com.querydsl.codegen.EntitySerializer")
public class QRoomHistory extends EntityPathBase<RoomHistory> {

    private static final long serialVersionUID = -1806510537L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRoomHistory roomHistory = new QRoomHistory("roomHistory");

    public final NumberPath<Integer> action = createNumber("action", Integer.class);

    public final NumberPath<Long> historySeq = createNumber("historySeq", Long.class);

    public final DatePath<java.time.LocalDate> insertedTime = createDate("insertedTime", java.time.LocalDate.class);

    public final StringPath lastYn = createString("lastYn");

    public final QRoom roomSeq;

    public final QUser userSeq;

    public QRoomHistory(String variable) {
        this(RoomHistory.class, forVariable(variable), INITS);
    }

    public QRoomHistory(Path<? extends RoomHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRoomHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRoomHistory(PathMetadata metadata, PathInits inits) {
        this(RoomHistory.class, metadata, inits);
    }

    public QRoomHistory(Class<? extends RoomHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.roomSeq = inits.isInitialized("roomSeq") ? new QRoom(forProperty("roomSeq"), inits.get("roomSeq")) : null;
        this.userSeq = inits.isInitialized("userSeq") ? new QUser(forProperty("userSeq")) : null;
    }

}

