package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class SingService {
    /** 노래방 시작 **/
    static final int START_NORAEBANG = 0;
    /** 노래 추가 **/
    static final int ADD_MUSIC = 1;
    /** 노래 재생 **/
    static final int PLAY_MUSIC = 2;
    /** 노래 삭제 **/
    static final int DEL_MUSIC = 3;
    /** 노래방 끝 **/
    static final int FINISH_NORAEBANG = -1;
    /** 일반 노래방 **/
    static final int NORMAL_MODE = 1;
    /** 복불복 노래방 **/
    static final int FILTER_MODE = 2;

    static RpcNotificationService rpcNotificationService;

    // < sessionId, 노래목록 = [[가수, 노래, 비디오아이디], [가수, 노래, 비디오아이디], [가수, 노래, 비디오아이디]] >
    protected ConcurrentHashMap<String, ArrayList<ArrayList<String>>> singRoomsMap = new ConcurrentHashMap<>();


    public void controlSing (Participant participant, JsonObject message, Set<Participant> participants,
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
        System.out.println("[Sing] *** server get data : " + data);
        System.out.println("[Sing] *** server get params : " + params);

        // 원하는 상태에 따른 수행 방식 변경
        int singStatus = data.get("singStatus").getAsInt();
        String sessionId = message.get("sessionId").getAsString();

        switch (singStatus) {
            case START_NORAEBANG: // 노래방 시작
            case FINISH_NORAEBANG: // 노래방 끝
                sendStatus(sessionId, singStatus, participants, params, data);
                return;
            case ADD_MUSIC: // 노래 추가
                addSong(sessionId, participants, params, data);
                return;
            case PLAY_MUSIC: // 노래 재생
                playSong(sessionId, participants, params, data);
                return;
            case DEL_MUSIC: // 노래 삭제
                delSong(sessionId, participants, params, data);
                return;
        }

    }

    /**
     * 노래방 시작, 끝!
     * singStatus: 0, -1
     * */
    private void sendStatus(String sessionId, Integer singStatus, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("[Sing] *** NO ~ RAE ~ BANG !!!");

        // 음악 한 곡 = [가수, 노래, 키값]
        ArrayList<ArrayList<String>> reserveSongList = new ArrayList<>();

        // 노래 목록 초기화
        if (singStatus == START_NORAEBANG) {
            // 노래방을 시작한 경우
            singRoomsMap.put(sessionId, reserveSongList);
        } else {
            // 노래방을 끝낸 경우
           singRoomsMap.remove(sessionId);
        }

        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
        System.out.println("[Sing] *** return params : " + params);
    }

    /**
     * 음악 추가
     * singStatus: 1
     * */
    private void addSong(String sessionId, Set<Participant> participants, JsonObject params, JsonObject data) {

        // 요청 받은 값들
        System.out.println("[Sing] *** ADD SONG");
        String singer = data.get("singer").getAsString();
        String song = data.get("song").getAsString();
        String videoId = data.get("videoId").getAsString();


        // 음악 한 곡 = [가수, 노래, 키값]
        ArrayList<String> music = new ArrayList<>();
        music.add(singer);
        music.add(song);
        music.add(videoId);

        ArrayList<ArrayList<String>> musicList = new ArrayList<>();

        if (singRoomsMap.get(sessionId) == null) {
            // 아마 노래방 시작할 때 초기화해서 null이 있을린 없어야 하지만
            // 혹시 모르니 처리를 해줍시다!
            musicList.add(music);
            singRoomsMap.put(sessionId, musicList);
        } else {
            // 이미 노래 목록이 있던 경우
            musicList = singRoomsMap.get(sessionId);
            musicList.add(music);
        }

        // 리스트를 문자열로 감싸주는 과정
        String strMusicList = "";

        for(int i=0; i < musicList.size()-1; i++) {
            // strMusic = 가수^노래제목^키값
            String strMusic = musicList.get(i).get(0) + '^' + musicList.get(i).get(1) + '^' + musicList.get(i).get(2);
            strMusicList = strMusicList.concat(strMusic).concat("|");
        }
        // 마지막 노래 다음에는 | 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + '^' + finalMusic.get(1) + '^' + finalMusic.get(2));

        data.addProperty("reserveSongList", strMusicList);

        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
        System.out.println("[Sing] *** ADD SONG return : " + params);
    }

    /**
     * 음악 재생
     * singStatus: 2
     * */
    private void playSong(String sessionId, Set<Participant> participants, JsonObject params, JsonObject data) {
        System.out.println("[Sing] *** PLAY SONG NOW");

        if (singRoomsMap.get(sessionId) == null || singRoomsMap.get(sessionId).isEmpty()) {
            // 노래가 없는 경우
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
            }
            System.out.println("[Sing] *** playlist is EMPTY in this session : " + params);
            return;
        }

        // 예약된 노래들이 있는 경우
        ArrayList<ArrayList<String>> musicList = singRoomsMap.get(sessionId);
        ArrayList<String> firstMusic = musicList.get(0);
        String strFirstMusic = firstMusic.get(0) + '^' + firstMusic.get(1) + '^' + firstMusic.get(2);
        String strMusicList = "";

        System.out.println("[Sing] *** Now SONG : " + firstMusic);
        System.out.println("[Sing] *** reserved SONGS : " + musicList);

        // 제일 처음에 있는 노래 삭제
        musicList.remove(0);
        System.out.println("[Sing] *** After del first song in list" + musicList);


        for(int i=0; i < musicList.size()-1; i++) {
            // strMusic = 가수^노래제목^키값
            String strMusic = musicList.get(i).get(0) + '^' + musicList.get(i).get(1) + '^' + musicList.get(i).get(2);
            strMusicList = strMusicList.concat(strMusic).concat("|");
        }
        // 마지막 노래 다음에는 | 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + '^' + finalMusic.get(1) + '^' + finalMusic.get(2));

        data.addProperty("nowSing", strFirstMusic);
        data.addProperty("reserveSongList", strMusicList);


        // 일반 모드와 필터 모드는 다르다!!
        int singMode = data.get("singMode").getAsInt();

        if (singMode == FILTER_MODE) {
            // 필터를 적용할 사람의 수는 참여자 수의 반
            // 사용자 랜덤 선택을 위해 리스트를 복사해두고 섞음
            System.out.println("[Sing] *** 참가자들" + participants);

            // StreamId들만 저장할 리스트 생성
            ArrayList<String> participantsList = new ArrayList<>();
            for (Participant p : participants) {
                // 참가자들의 streamId를 저장한다.
                participantsList.add(p.getPublisherStreamId());
            }
            Collections.shuffle(participantsList);
            System.out.println("[Sing] *** 섞은 참가자들 stream Id" + participantsList);
            // 반만 뽑음!
            int halfSize = participantsList.size() / 2;
            // voiceFilter = "스트림아이디/스트림아이디"
            String voiceFilter = "";
            for(int i = 0; i < halfSize-1; i++) {
                String filtered = participantsList.get(i);
                voiceFilter = voiceFilter.concat(filtered).concat("/");
            }
            // 마지막에 / 가 붙지 않도록
            voiceFilter = voiceFilter.concat(participantsList.get(halfSize-1));

            data.addProperty("voiceFilter", voiceFilter);
            System.out.println("[Sing] *** 걸린 참가자들" + voiceFilter);
        }

        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
        System.out.println("[Sing] *** PLAY SONG return : " + params);
    }


    /**
     * 음악 삭제
     * singStatus: 3
     * */
    private void delSong(String sessionId, Set<Participant> participants, JsonObject params, JsonObject data) {
        System.out.println("[Sing] *** DELETE RESERVED SONG");

        if (singRoomsMap.get(sessionId) == null || singRoomsMap.get(sessionId).isEmpty()) {
            // 노래가 없는 경우
            data.addProperty("reserveSongList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
            }
            System.out.println("[Sing] *** playlist is EMPTY in this session : " + params);
            return;
        }

        // 예약된 노래들이 있는 경우
        ArrayList<ArrayList<String>> musicList = singRoomsMap.get(sessionId);
        System.out.println("[Sing] *** NOW song list" + musicList);

        String videoId = data.get("videoId").getAsString();
        System.out.println("[Sing] *** Want to delete this : " + videoId);


        // 해당 음악 앞에서부터 찾아서 삭제
        for(int i=0; i < musicList.size(); i++) {
            if (musicList.get(i).contains(videoId)) {
                musicList.remove(i);
                break;
            }
        }
        System.out.println("[Sing] *** After del requested song in list" + musicList);

        // 만약에! 지웠는데 노래가 없다면
        if (musicList.isEmpty()) {
            data.addProperty("reserveSongList", "");
            params.add("data", data);
            for (Participant p : participants) {
                rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                        ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
            }
            System.out.println("[Sing] *** playlist is EMPTY in this session : " + params);
            return;
        }

        // 지우고 나서 목록 만들기
        String strMusicList = "";

        for(int i=0; i < musicList.size()-1; i++) {
            // strMusic = 가수^노래제목^키값
            String strMusic = musicList.get(i).get(0) + '^' + musicList.get(i).get(1) + '^' + musicList.get(i).get(2);
            strMusicList = strMusicList.concat(strMusic).concat("|");
        }
        // 마지막 노래 다음에는 | 붙이지 않도록
        ArrayList<String> finalMusic = musicList.get(musicList.size()-1);
        strMusicList = strMusicList.concat(finalMusic.get(0) + '^' + finalMusic.get(1) + '^' + finalMusic.get(2));

        data.addProperty("reserveSongList", strMusicList);

        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
        System.out.println("[Sing] *** DELETE SONG return : " + params);
    }
}