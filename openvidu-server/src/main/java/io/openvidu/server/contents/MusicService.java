package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class MusicService {

    /** 음악 재생 **/
    static final int PLAYMUSIC = 1;
    /** 음악 일시정지 **/
    static final int PAUSEMUSIC = 2;
    /** 다음곡 재생 **/
    static final int NEXTMUSIC = 3;
    /** 음악 처음 추가 **/
    // static final int ADDFRISTMUSIC = 4;
    /** 음악 추가 **/
    static final int ADDMUSIC = 4;
    /** 음악 삭제 **/
    static final int DELETEMUSIC = 5;

    static RpcNotificationService rpcNotificationService;

     // < sessionId, 노래목록 = [[비디오아이디, 가수, 노래], [비디오아이디, 가수, 노래], [비디오아이디, 가수, 노래]] >
    protected ConcurrentHashMap<String, ArrayList<ArrayList<String>>> requestSongsMap = new ConcurrentHashMap<>();

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

        String sessionId = message.get("sessionId").getAsString();

        // 입력받은 값들 출력
        System.out.println("[Music] 받은 음악 data : " + data); //{"videoId":"5uk6cFPL19w","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        System.out.println("[Music] 받은 음악 params : " + params); // {"from":"con_AG3mOjqFdT","type":"signal:music"}

        // 원하는 상태에 따른 수행 방식 변경
        int musicStatus = data.get("musicStatus").getAsInt();

        switch (musicStatus) {
            case PLAYMUSIC: // 음악 재생
            case PAUSEMUSIC: // 음악 일시정지
                sendStatus(participants, params, data);
                return;
            case NEXTMUSIC: // 음악 멈춤
                nextMusic(sessionId, musicStatus, participants, params, data);
                return;
            case ADDMUSIC: // 음악 추가
                addMusic(sessionId, musicStatus, participants, params, data);
                return;
            case DELETEMUSIC: // 음악 삭제
                delMusic(sessionId, musicStatus, participants, params, data);
                return;
        }

    }


    /**
     * 음악 상태 그대로 돌려줌
     * musicStatus: 1, 2
     * */
    private void sendStatus(Set<Participant> participants, JsonObject params, JsonObject data) {
        System.out.println("[Music] 바꿔줬으면 하는 노래 진행 상태 : " + data.get("musicStatus").getAsInt());
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] 노래상태 반환 " + params);
    }


    /**
     * 다음 곡 재생
     * musicStatus: 3
     * */
    private void nextMusic(String sessionId, Integer musicStatus, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("[Music] 다음 곡 주세요");

        ArrayList<ArrayList<String>> musicList = requestSongsMap.get(sessionId);

        if (requestSongsMap.get(sessionId) == null || requestSongsMap.get(sessionId).isEmpty()) {
            data.addProperty("musicList", "");
            params.add("data", data);
            for (Participant p : participants) {
                data.addProperty("musicList", musicList.toString());
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Music] 재생할 다음 곡이 없어요! : " + params);
            return;
        } else {
            musicList = requestSongsMap.get(sessionId);
        }
        System.out.println("[Music] 현재 노래 목록 : " + musicList);
        System.out.println("[Music] 지금 제일 앞의 노래 : " + musicList.get(0));
        // 제일 처음에 있는 노래 삭제
        musicList.remove(0);
        System.out.println("[Music] 삭제 후 노래 목록 : " + musicList);
        if (musicList.isEmpty()) {
            data.addProperty("musicList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Music] 재생할 다음 곡이 없어요! : " + params);
            return;
        }
        ArrayList<String> music = requestSongsMap.get(sessionId).get(0);
        System.out.println("[Music] 삭제 후 제일 처음 노래 : " + music);

        String strMusicList = "";
        String firstMusic = music.get(0) + "," + music.get(1) + "," + music.get(2);
        for(int i=0; i < musicList.size()-1; i++) {
            String strMusic = musicList.get(i).get(0) + ',' + musicList.get(i).get(1) + ',' + musicList.get(i).get(2);
            strMusicList = strMusicList.concat(strMusic).concat("/");
        }
        // 마지막 노래 다음에는 / 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + ',' + finalMusic.get(1) + ',' + finalMusic.get(2));

        JsonObject result = new JsonObject();
        result.addProperty("musicStatus", musicStatus);
        result.addProperty("music", firstMusic);
        result.addProperty("musicList", strMusicList);

        params.add("data", result);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] 다음곡 재생 응답 완료 : " + params);
    }


    /**
     * 음악 처음 추가
     * musicStatus: X
     * */
//    private void addFistMusic(String sessionId, JsonObject message, Set<Participant> participants,
//                            JsonObject params, JsonObject data) {
//
//        String singer = data.get("singer").getAsString();
//        String song = data.get("song").getAsString();
//        String videoId = data.get("videoId").getAsString();
//        System.out.println("[Music] 처음 추가하고 싶은 노래(비디오아이디) : " + singer + ", " + song);
//
//        ArrayList<String> music = new ArrayList<>();
//        music.add(singer);
//        music.add(song);
//        music.add(videoId);
//        ArrayList<ArrayList<String>> musicList = new ArrayList<>();
//        musicList.add(music);
//        requestSongsMap.put(sessionId, musicList);
//        String strMusic = videoId + ',' + singer + ',' + song;
//        data.addProperty("music", strMusic);
//
//
//        params.add("data", data);
//        for (Participant p : participants) {
//            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
//                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
//            System.out.println("[Music] 처음 음악 추가 반환 내용 : " + params);
//        }
//    }

    /**
     * 음악 추가
     * musicStatus: 4
     * */
    private void addMusic(String sessionId, Integer musicStatus, Set<Participant> participants,
                          JsonObject params, JsonObject data) {
        String singer = data.get("singer").getAsString();
        String song = data.get("song").getAsString();
        String videoId = data.get("videoId").getAsString();
        System.out.println("[Music] 추가하고 싶은 노래 : " + singer + ", " + song);
        // 해당 세션에 아이디 추가

        // 음악 한 곡 = [가수, 노래, 키값]
        ArrayList<String> music = new ArrayList<>();
        music.add(singer);
        music.add(song);
        music.add(videoId);

        ArrayList<ArrayList<String>> musicList = new ArrayList<>();
        if (requestSongsMap.get(sessionId) == null) {
            // 처음 노래를 추가한 경우
            musicList.add(music);
            requestSongsMap.put(sessionId, musicList);
        } else {
            // 이미 노래 목록이 있던 경우
            musicList = requestSongsMap.get(sessionId);
            musicList.add(music);
        }

        String strMusicList = "";
        for(int i=0; i < musicList.size()-1; i++) {
            String strMusic = musicList.get(i).get(0) + ',' + musicList.get(i).get(1) + ',' + musicList.get(i).get(2);
            strMusicList = strMusicList.concat(strMusic).concat("/");
        }
        // 마지막 노래 다음에는 / 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + ',' + finalMusic.get(1) + ',' + finalMusic.get(2));

        JsonObject result = new JsonObject();
        result.addProperty("musicStatus", musicStatus);
        result.addProperty("musicList", strMusicList);

        params.add("data", result);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
            System.out.println("[Music] 음악 추가 반환 내용 : " + params);
        }
    }


    /**
     * 음악 삭제
     * musicStatus:5
     * */
    private void delMusic(String sessionId, Integer musicStatus, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        String singer = data.get("singer").getAsString();
        String song = data.get("song").getAsString();
        String videoId = data.get("videoId").getAsString();
        System.out.println("[Music] 삭제하고 싶은 노래 : " + singer + ", " + song);
        // 해당 세션에 아이디 추가

        ArrayList<ArrayList<String>> musicList = requestSongsMap.get(sessionId);
        // 지금 삭제하려는 음악 찾아서 삭제
        System.out.println("[Music] 삭제 전 음악 목록 : " + musicList);
        for(int i=0; i < musicList.size(); i++) {
            if (musicList.get(i).contains(videoId)) {
                musicList.remove(i);
                break;
            }
        }
        System.out.println("[Music] 삭제 후 음악 목록 : " + musicList);

        // 음악 목록 string으로 감싸서 반환
        String strMusicList = "";
        for(int i=0; i < musicList.size()-1; i++) {
            String strMusic = musicList.get(i).get(0) + ',' + musicList.get(i).get(1) + ',' + musicList.get(i).get(2);
            strMusicList = strMusicList.concat(strMusic).concat("/");
        }
        // 마지막 노래 다음에는 / 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + ',' + finalMusic.get(1) + ',' + finalMusic.get(2));

        JsonObject result = new JsonObject();
        result.addProperty("musicStatus", musicStatus);
        result.addProperty("musicList", strMusicList);

        params.add("data", result);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] 음악 삭제 반환 내용 " + params);
    }

}
