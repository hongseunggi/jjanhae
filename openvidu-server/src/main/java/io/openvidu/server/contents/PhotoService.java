package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.Set;

public class PhotoService {
    /** 사진 찍기 **/
    static final int TAKEPHOTO = 1;

    static RpcNotificationService rpcNotificationService;

    public void controlPhoto (Participant participant, JsonObject message, Set<Participant> participants,
                             RpcNotificationService rnfs) {

        // 초기화 과정
        rpcNotificationService = rnfs;
        JsonObject params = new JsonObject();

        // data 파싱
        String dataString = message.get("data").getAsString();
        JsonObject data = (JsonObject) JsonParser.parseString(dataString);

        // 입력받은 값들 출력
        System.out.println("[Photo] 받은 사진 data : " + data); //{"videoId":"5uk6cFPL19w","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        System.out.println("[Photo] 받은 사진 params : " + params); // {"from":"con_AG3mOjqFdT","type":"signal:music"}

        // 원하는 상태에 따른 수행 방식 변경
        int photoStatus = data.get("photoStatus").getAsInt();

        switch (photoStatus) {
            case TAKEPHOTO: // 음악 재생
                sendStatus(photoStatus, participant, message, participants, params, data);
                return;
        }

    }

    /**
     * 음악 상태 그대로 돌려줌
     * musicStatus: 1, 2, 3
     * */
    private void sendStatus(int photoStatus, Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("[Photo] 바꿔줬으면 하는 노래 진행 상태 : " + photoStatus);
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Photo] 노래상태 반환 " + params);
    }
}
