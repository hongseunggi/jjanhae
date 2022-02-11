package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class MusicService {

    static RpcNotificationService rpcNotificationService;

     // < sessionId, 노래목록(비디오아이디 여러개) >
    protected ConcurrentHashMap<String, ArrayList<String>> requestSongsMap = new ConcurrentHashMap<>();

    public void controlMusic(Participant participant, JsonObject message, Set<Participant> participants,
                             RpcNotificationService rnfs) {
        // 초기화 과정
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

        // 세션 아이디 저장
        String sessionId = data.get("sessionId").getAsString();

        // 입력받은 값들 출력
        System.out.println("음악 data : " + data); //{"videoId":"5uk6cFPL19w","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        System.out.println("음악 params : " + params); // {"from":"con_AG3mOjqFdT","type":"signal:music"}

        // 노래 상태 변경 : 재생 , 일시정지 , 멈춤, 다음곡
        if (data.has("isPlaying")){
            String isPlaying = data.get("isPlaying").getAsString();
            System.out.println("바꿔줬으면 하는 노래 진행 상태 : " + isPlaying);
            if (Objects.equals(isPlaying, "next")) {
                requestSongsMap.get(sessionId).remove(0); // 리스트의 제일 앞의 노래를 제거
//                data.addProperty("songList", requestSongsMap.get(sessionId));
            }

            params.addProperty("data", data.toString());
            // 브로드 캐스팅
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
                System.out.println("노래상태 반환 " + params);
            }

        }

        // 음악 추가
        if (data.has("videoId")){
            String videoId = data.get("videoId").getAsString();
            System.out.println("이 비디오 아이디를 뿌려주세요 : " + videoId);
            requestSongsMap.get(sessionId).add(videoId);
            data.addProperty("songList", requestSongsMap.get(sessionId).toString());
            System.out.println(data);

            params.addProperty("data", data.toString());
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
                System.out.println("음악 추가 반환 내용 : " + params);
            }

        }

    }


}