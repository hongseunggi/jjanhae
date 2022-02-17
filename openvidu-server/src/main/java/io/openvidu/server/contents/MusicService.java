package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

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
    /** 음악 추가 **/
    static final int ADDMUSIC = 4;
    /** 음악 삭제 **/
    static final int DELETEMUSIC = 5;

    static RpcNotificationService rpcNotificationService;

     // < sessionId, 노래목록 = [[가수, 노래, 비디오아이디, 주소], [가수, 노래, 비디오아이디, 주소], [가수, 노래, 비디오아이디, 주소]] >
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


        // 입력받은 값들 출력
        System.out.println("[Music] *** server get music data : " + data); //{"videoId":"5uk6cFPL19w","nickname":"OpenVidu_User43","streamId":"str_CAM_DM92_con_ZIlIJZTwJ8"}
        System.out.println("[Music] *** server get music params : " + params); // {"from":"con_AG3mOjqFdT","type":"signal:music"}

        // 원하는 상태에 따른 수행 방식 변경
        int musicStatus = data.get("musicStatus").getAsInt();
        String sessionId = message.get("sessionId").getAsString();

        switch (musicStatus) {
            case PLAYMUSIC: // 음악 재생
            case PAUSEMUSIC: // 음악 일시정지
                sendStatus(participants, params, data);
                return;
            case NEXTMUSIC: // 음악 멈춤
                nextMusic(sessionId, participants, params, data);
                return;
            case ADDMUSIC: // 음악 추가
                addMusic(sessionId, participants, params, data);
                return;
            case DELETEMUSIC: // 음악 삭제
                delMusic(sessionId, participants, params, data);
                return;
        }

    }


    /**
     * 음악 상태 그대로 돌려줌
     * musicStatus: 1, 2
     * */
    private void sendStatus(Set<Participant> participants, JsonObject params, JsonObject data) {
        System.out.println("[Music] *** music status : " + data.get("musicStatus").getAsInt());
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] *** return params : " + params);
    }


    /**
     * 다음 곡 재생
     * musicStatus: 3
     * */
    private void nextMusic(String sessionId, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("[Music] *** next music please!! ");

        // 노래가 없는 경우
        if (requestSongsMap.get(sessionId) == null || requestSongsMap.get(sessionId).isEmpty()) {
            data.addProperty("musicList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Music] *** NO NEXT MUSIC!!! : " + params);
            return;
        }

        ArrayList<ArrayList<String>> musicList = requestSongsMap.get(sessionId);
        System.out.println("[Music] *** now playlist : " + musicList);
        System.out.println("[Music] *** first music : " + musicList.get(0));

        // 제일 처음에 있는 노래 삭제
        musicList.remove(0);
        System.out.println("[Music] after delete : " + musicList);

        // 만약에! 지웠는데 노래가 없다면
        if (musicList.isEmpty()) {
            data.addProperty("musicList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Music] *** NO NEXT MUSIC! OKAY? : " + params);
            return;
        }


        // 지우고 나서 처음 노래
        String firstMusic = musicList.get(0).get(0) + '^' + musicList.get(0).get(1) + '^' + musicList.get(0).get(2)+ '^' + musicList.get(0).get(3);
        System.out.println("[Sing] *** first song after delete : " + firstMusic);
        String strMusicList = "";
        for(int i=0; i < musicList.size()-1; i++) {
            // strMusic = 가수^노래제목^키값^썸네일주소
            String strMusic = musicList.get(i).get(0) + '^' + musicList.get(i).get(1) + '^'
                    + musicList.get(i).get(2) + '^' + musicList.get(i).get(3);
            // strMusicList = 노래|노래|노래
            strMusicList = strMusicList.concat(strMusic).concat("|");
        }
        // 마지막 노래 다음에는 / 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + '^' + finalMusic.get(1) + '^' + finalMusic.get(2) + '^' + finalMusic.get(3));

        data.addProperty("music", firstMusic);
        data.addProperty("musicList", strMusicList);

        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] *** next music return : " + params);
    }

    /**
     * 음악 추가
     * musicStatus: 4
     * */
    private void addMusic(String sessionId, Set<Participant> participants,
                          JsonObject params, JsonObject data) {

        // 요청 받은 값들
        System.out.println("[Music] *** ADD MUSIC");
        String singer = data.get("singer").getAsString();
        String song = data.get("song").getAsString();
        String videoId = data.get("videoId").getAsString();
        String thumUrl = data.get("thumUrl").getAsString();

        // 음악 한 곡 = [가수, 노래, 키값, 썸네일]
        ArrayList<String> music = new ArrayList<>();
        music.add(singer);
        music.add(song);
        music.add(videoId);
        music.add(thumUrl);

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

        // 리스트를 문자열로 감싸주는 과정
        String strMusicList = "";

        for(int i=0; i < musicList.size()-1; i++) {
            // strMusic = 가수^노래제목^키값^썸네일주소
            String strMusic = musicList.get(i).get(0) + '^' + musicList.get(i).get(1) + '^'
                    + musicList.get(i).get(2) + '^' + musicList.get(i).get(3);
            strMusicList = strMusicList.concat(strMusic).concat("|");
        }
        // 마지막 노래 다음에는 | 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + '^' + finalMusic.get(1) + '^' + finalMusic.get(2) + '^' + finalMusic.get(3));

        data.addProperty("musicList", strMusicList);

        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
        System.out.println("[Music] *** ADD MUSIC return : " + params);
    }


    /**
     * 음악 삭제
     * musicStatus:5
     * */
    private void delMusic(String sessionId, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        String videoId = data.get("videoId").getAsString();
        System.out.println("[Music] *** DELETE THIS MUSIC!! : " + videoId);

        // 노래가 없는 경우
        if (requestSongsMap.get(sessionId) == null || requestSongsMap.get(sessionId).isEmpty()) {
            data.addProperty("musicList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Music] *** NO MUSIC LEFT !!! : " + params);
            return;
        }

        ArrayList<ArrayList<String>> musicList = requestSongsMap.get(sessionId);

        // 지금 삭제하려는 음악 찾아서 삭제
        System.out.println("[Music] *** Before delete : " + musicList);
        for(int i=0; i < musicList.size(); i++) {
            if (musicList.get(i).contains(videoId)) {
                musicList.remove(i);
                break;
            }
        }
        System.out.println("[Music] *** After delete : " + musicList);

        // 만약에! 지웠는데 노래가 없다면
        if (musicList.isEmpty()) {
            data.addProperty("musicList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Music] *** NO NEXT MUSIC! OKAY? : " + params);
            return;
        }

        // 음악 목록 string으로 감싸서 반환
        String strMusicList = "";

        for(int i=0; i < musicList.size()-1; i++) {
            // strMusic = 가수^노래제목^키값^썸네일주소
            String strMusic = musicList.get(i).get(0) + '^' + musicList.get(i).get(1) + '^'
                    + musicList.get(i).get(2) + '^' + musicList.get(i).get(3);
            strMusicList = strMusicList.concat(strMusic).concat("|");
        }
        // 마지막 노래 다음에는 | 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + '^' + finalMusic.get(1) + '^' + finalMusic.get(2) + '^' + finalMusic.get(3));

        data.addProperty("musicList", strMusicList);

        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Music] DELETE MUSIC return " + params);
    }

}
