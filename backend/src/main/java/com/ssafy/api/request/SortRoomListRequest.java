package com.ssafy.api.request;

import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("SortRoomListRequest")
public class SortRoomListRequest {
    @Getter
    @Setter
    public static class Paging {
        String hasNext; // T or F
        int limit;
        int offset;
    }
    String sort; // 정렬기준 (all, createAt, drinkLimit)
    String order; // 오름차순 or 내림차순 (asc, desc)
    Paging paging;
}
