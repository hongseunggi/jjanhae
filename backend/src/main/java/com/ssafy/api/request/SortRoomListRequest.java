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
    String sort; // 정렬기준 (all, createAt, drinkLimit)
    String order; // 오름차순 or 내림차순 (asc, desc)
    int limit; // 한번에 가져올 room의 개수
    int offset; // offset+1부터 limit만큼 가져온다
}
