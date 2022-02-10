package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class MusicService {

    static RpcNotificationService rpcNotificationService;

    // < sessionId, sentence >
//    protected ConcurrentHashMap<String, String> requestSongsMap = new ConcurrentHashMap<>();

    public void requestMusic(Participant participant, JsonObject message, Set<Participant> participants,
                             RpcNotificationService rnfs) {
        rpcNotificationService = rnfs;
        JsonObject params = new JsonObject();

        // 요청 보낸 사람 ID 저장
        if (participant != null) {
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_FROM_PARAM,
                    participant.getParticipantPublicId());
        }
        // 타입 저장
        if (message.has("type")) {
            params.addProperty(ProtocolElements.PARTICIPANTSENDMESSAGE_TYPE_PARAM, message.get("type").getAsString());
        }
        // data 파싱
        String dataString = message.get("data").getAsString();
        JsonObject data = (JsonObject) JsonParser.parseString(dataString);
        System.out.println(data); //{"singer":"ㅎㅎㅎ","song":"ㅎㅎㅎ","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        String singer = data.get("singer").getAsString();
        String song = data.get("song").getAsString();

        System.out.println(data.get("singer"));
    }
}
