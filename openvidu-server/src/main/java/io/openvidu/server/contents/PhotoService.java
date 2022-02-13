package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.Set;

public class PhotoService {
    /** 사진 찍기 **/
    static final int READYPHOTO = 0;
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
        System.out.println("[Photo] server get data : " + data); //{"videoId":"5uk6cFPL19w","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        System.out.println("[Photo] server get params : " + params); // {"from":"con_AG3mOjqFdT","type":"signal:music"}

        // 원하는 상태에 따른 수행 방식 변경
        int photoStatus = data.get("photoStatus").getAsInt();

        switch (photoStatus) {
            case READYPHOTO: // 사진 찍을 준비
            case TAKEPHOTO: // 사진 찍자
                sendStatus(photoStatus, participants, params, data);
                return;
        }

    }

    /**
     * 사진 찍자
     * photoStatus: 0, 1
     * */
    private void sendStatus(int photoStatus, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("[Photo] TAKE PHOTO!!! : " + photoStatus);
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Photo] return params : " + params);
    }
}
