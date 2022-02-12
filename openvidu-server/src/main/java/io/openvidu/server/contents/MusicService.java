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

    /** 음악 재생 */
    static final int PLAYMUSIC = 1;
    /** 음악 일시정지 */
    static final int PAUSEMUSIC = 2;
    /** 음악 중지 */
    static final int STOPMUSIC = 3;
    /** 음악 추가 */
    static final int ADDMUSIC = 4;
    /** 음악 삭제 */
    static final int DELETEMUSIC = 5;

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

        // 입력받은 값들 출력
        System.out.println("[Music] 받은 음악 data : " + data); //{"videoId":"5uk6cFPL19w","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        System.out.println("[Music] 받은 음악 params : " + params); // {"from":"con_AG3mOjqFdT","type":"signal:music"}

        // 원하는 상태에 따른 수행 방식 변경
        int musicStatus = data.get("musicStatus").getAsInt();

        switch (musicStatus) {
            case PLAYMUSIC: // 음악 재생
            case PAUSEMUSIC: // 음악 일시정지
            case STOPMUSIC: // 음악 멈춤
                sendStatus(musicStatus, participant, message, participants, params, data);
                return;
            case ADDMUSIC: // 음악 추가
                addMusic(participant, message, participants, params, data);
                return;
            case DELETEMUSIC: // 음악 삭제
                delMusic(participant, message, participants, params, data);
                return;
        }

    }


    /**
     * 음악 상태 그대로 돌려줌
     * musicStatus: 1, 2, 3
     * */
    private void sendStatus(int musicStatus, Participant participant, JsonObject message, Set<Participant> participants,
                        JsonObject params, JsonObject data) {
        System.out.println("[Music] 바꿔줬으면 하는 노래 진행 상태 : " + musicStatus);
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] 노래상태 반환 " + params);
    }

    /**
     * 음악 추가
     * musicStatus: 4
     * */
    private void addMusic(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        String sessionId = data.get("sessionId").getAsString();
        String videoId = data.get("videoId").getAsString();
        System.out.println("[Music] 추가하고 싶은 노래(비디오아이디) : " + videoId);
        // 해당 세션에 아이디 추가
        // 만약 첫 신청곡이라면 list가 없으므로 list 추가

        ArrayList<String> songList = new ArrayList<>();
        // 비어있지 않다면 기존 노래 리스트로 변경
        if (requestSongsMap.get(sessionId) != null){
            songList = requestSongsMap.get(sessionId);
        }
        songList.add(videoId);
        requestSongsMap.put(sessionId, songList);
        data.addProperty("songList", requestSongsMap.get(sessionId).toString());
        // {"sessionId":"SessionA","videoId":"ㅁㄴㅇㄴㅇㄻㄴㅇㄹ","nickname":"OpenVidu_User20","streamId":"str_CAM_ZuID_con_EbPKJ0cczg","songList":"[ㄱㅁㄷㄹ, ㄴㅇㄻㄴㅇㄹ, ㅁㄴㅇㄴㅇㄻㄴㅇㄹ]"}

        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
            System.out.println("[Music] 음악 추가 반환 내용 : " + params);
        }
    }

    /**
     * 음악 삭제
     * musicStatus: 5
     * */
    private void delMusic(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        String sessionId = data.get("sessionId").getAsString();
        String videoId = data.get("videoId").getAsString();
        System.out.println("[Music] 삭제하고 싶은 노래(비디오아이디) : " + videoId);

        ArrayList<String> songList = requestSongsMap.get(sessionId);
        Integer removeIdx = songList.indexOf(videoId);
        System.out.println("지금 노래 리스트" + songList);
        if (removeIdx == -1) {
            System.out.println("[Music] 삭제하려는 노래가 없습니다.");
            return;
        }
        songList.remove(removeIdx);
        System.out.println("바뀐 노래 리스트" + songList);
        System.out.println("현재 requestSongMap" + requestSongsMap);
        requestSongsMap.remove(sessionId);
        System.out.println("노래 삭제한 requestSongMap" + requestSongsMap);
        requestSongsMap.put(sessionId, songList);
        System.out.println("바뀐 requestSongMap" + requestSongsMap);
        data.addProperty("songList", requestSongsMap.get(sessionId).toString());

        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] 음악 삭제 반환 내용 " + params);
    }

}
