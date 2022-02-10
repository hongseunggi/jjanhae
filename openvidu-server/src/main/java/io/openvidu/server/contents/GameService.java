package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class GameService {

    /** 게임 준비 */
    static final int PREPAREGAME = 0;
    /** 게임 선택 */
    static final int SELECTGAME = 1;
    /** 게임 시작 */
    static final int STARTGAME = 2;
    /** 게임 종료 */
    static final int FINISHGAME = 3;
    /** 벌칙 */
    static final int COMPLETEPENALTY = 4;
    /** 양세찬 게임 */
    static final int YANGSECHAN = 1;
    /** 금지어 게임 */
    static final int FORBIDDEN = 2;
    /** 업다운 게임 */
    static final int UPDOWN = 3;


    static RpcNotificationService rpcNotificationService;


    /** 양세찬 게임은 sessionId:nickname */
    protected ConcurrentHashMap<String, String> nicknameMap = new ConcurrentHashMap<>();
    /** 금지어 게임은 sessionId:word */
    protected ConcurrentHashMap<String, String> wordMap = new ConcurrentHashMap<>();
    /** 업다운 게임은 sessionId:number */
    protected ConcurrentHashMap<String,Integer> numberMap = new ConcurrentHashMap<>();


    public void controlGame(Participant participant, JsonObject message, Set<Participant> participants,
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
        System.out.println("[ data ] : " + data);
        System.out.println("[ params ] : " + params);

        // 게임 상태에 따라 분기
        int gameStatus = data.get("gameStatus").getAsInt();

        // 게임상태 추가, 벌칙완료 상태일 때만 4->0 으로
        data.addProperty("gameStatus", Integer.toString(gameStatus));

        switch (gameStatus) {
            case PREPAREGAME: // 게임 준비
                prepareGame(participant, message, participants, params, data);
                return;
            case SELECTGAME: // 게임 선택
                selectGame(participant, message, participants, params, data);
                return;
            case STARTGAME: // 게임 시작
                startGame(participant, message, participants, params, data);
                return;
            case FINISHGAME: // 게임 종료
                finishGame(participant, message, participants, params, data);
                return;
            case COMPLETEPENALTY: // 벌칙 종료
                completePenalty(participant, message, participants, params, data);
        }

    } // end of controlGame


    /**
     * 게임 준비
     * 특정 사용자가 게임을 고르는 동안, 다른 사용자들은 '게임을 선택중입니다' 문구가 화면이 보여야 한다.
     * */
    private void prepareGame(Participant participant, JsonObject message, Set<Participant> participants,
                             JsonObject params, JsonObject data) {
        System.out.println("Prepare Game ...");
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
    } // end of prepareGame


    /**
     * 게임 선택
     * 특정 사용자가 게임을 선택했을 때, 그에 맞는 게임 진행을 위해 미리 준비
     * */
    private void selectGame(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("Select Game ...");

        // 게임 아이디를 받아 그에 해당하는 게임을 진행
        int gameId = data.get("gameId").getAsInt();

        // 업다운 게임이 랜덤숫자를 생성해야 하기 때문에
        // 선택단계에서 미리 랜덤숫자 생성
        if(gameId == UPDOWN) {
            
        }

    } // end of selectGame


    /**
     * 게임 시작
     * 게임 선택 완료 후 진행
     * */
    private void startGame(Participant participant, JsonObject message, Set<Participant> participants,
                           JsonObject params, JsonObject data) {
        System.out.println("Start Game ...");
    } // end of startGame


    /**
     * 게임 종료
     * */
    private void finishGame(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("Finish Game ...");
    } // end of finishGame


    /**
     * 벌칙
     * */
    private  void completePenalty(Participant participant, JsonObject message, Set<Participant> participants,
                                  JsonObject params, JsonObject data) {
        System.out.println("Complete Penalty ...");
    } // end of completePenalty

}