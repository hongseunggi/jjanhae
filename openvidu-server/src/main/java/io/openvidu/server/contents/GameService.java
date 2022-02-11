package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.apache.commons.collections.IterableMap;

import java.util.Iterator;
import java.util.Map;
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
     * 게임이 실행되고 있지 않은 단계
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
     * 특정 사용자가 게임을 고르는 동안, 다른 사용자들은 '게임을 선택중입니다' 문구가 화면이 보여야 한다.
     * 특정 사용자가 게임을 선택했을 때, 그에 맞는 게임 진행을 위해 미리 준비
     * */
    private void selectGame(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("Select Game ...");
        System.out.println("[ data ] " + data);
        // 게임 아이디를 받아 그에 해당하는 게임을 진행
        int gameId = data.get("gameId").getAsInt();

        // 업다운 게임이 랜덤숫자를 생성해야 하기 때문에
        // 선택단계에서 미리 랜덤숫자 생성
        if(gameId == UPDOWN) {
            System.out.println("Select UPDOWN ...");
            // 각 세션ID에 랜덤숫자 생성해서 넣기, 세션ID는 각 방 번호를 뜻함.
            int number = (int) (Math.random() * 100) + 1;
            System.out.printf("sessionId : %s, number : %d\n", data.get("sessionId").getAsString(), number);
            numberMap.put(data.get("sessionId").getAsString(), number);
            // 생성해서 맵에 저장하고 있다가 후에 startGame에서 정답맞출때에 쓰임

        } else if (gameId == YANGSECHAN) {
            System.out.println("Select YANGSECHAN ...");
            // 나중에 정답맞출것을 대비해서 Map에 저장
            System.out.printf("streamId : %s, gamename : %s\n", data.get("streamId").getAsString(),
                    data.get("gamename").toString());

            // TODO 저장하기 전에 이미 같은 gamename이 있는지 중복검사는 프론트에서 해야되네...?

            nicknameMap.put(data.get("streamId").getAsString(), data.get("gamename").toString());
            Iterator<Map.Entry<String, String>> iter = nicknameMap.entrySet().iterator();
            while(iter.hasNext()) {
                System.out.println("open Map ...");
                Map.Entry<String, String> map = iter.next();
                System.out.printf("Key : %s, Value : %s\n", map.getKey(), map.getValue());
            }
            // 그리고 클라이언트에서 보낸 data 그대로 브로드 캐스팅...

        } else if (gameId == FORBIDDEN) {
            System.out.println("Select FORBIDDEN ...");
            // 나중에 정답맞출것을 대비해서 Map에 저장
            System.out.printf("streamId : %s, word : %s\n", data.get("streamId").getAsString(),
                    data.get("word").toString());
            wordMap.put(data.get("streamId").getAsString(), String.valueOf(data.get("word")));
            // 그리고 클라이언트에서 보낸 data 그대로 브로드 캐스팅...
        }

        // 브로드캐스팅
        System.out.println("data : " + data);
        params.addProperty("data", data.toString());
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }

    } // end of selectGame


    /**
     * 게임 시작
     * 게임 선택 완료 후 진행
     * */
    private void startGame(Participant participant, JsonObject message, Set<Participant> participants,
                           JsonObject params, JsonObject data) {
        System.out.println("Start Game ...");

        int gameId = data.get("gameId").getAsInt();
        String streamId = data.get("streamId").getAsString();

        switch (gameId) {
            case YANGSECHAN: // 양세찬 게임
                // 자신의 닉네임(gamename)을 맞추기
                // 사용자가 종료버튼 누르면 끝나도록
                String userAnswer = nicknameMap.get(streamId);
                System.out.println("map size : " + nicknameMap.size());
                System.out.println("userAnswer : " + userAnswer);
                if(nicknameMap.size()!=0 && userAnswer.equals(data.get("gamename").toString())) { // 정답일 시 종료
                    System.out.printf("%s님 정답입니다!\n", streamId);
                    data.addProperty("gameStatus", 3);
                    data.addProperty("answerYn", "Y");
                } else { // 정답 아닐 시 계속 진행
                    System.out.printf("%s님 아쉬워요.. 정답이 아닙니다ㅠ,ㅜ\n", streamId);
                    data.addProperty("answerYn", "N");
                }

                break;
            case FORBIDDEN: // 금지어 게임
                // 사용자가 경고버튼 누르면 siren 0->1 바꿔넣기
                // 한사람 걸리면 끝?
                // 사용자가 종료버튼 누르면 끝나도록


                break;
            case UPDOWN: // 업다운 게임
                // streamId와 해당사용자가 입력한 숫자가 넘어오면,
                // 답과 숫자가 맞는지 판별
                // 정답이 나오면 종료


        }

        // 브로드캐스팅
        System.out.println("data : " + data);
        params.addProperty("data", data.toString());
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }

    } // end of startGame


    /**
     * 게임 종료
     * */
    private void finishGame(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("Finish Game ...");
        data.addProperty("gameStatus", 3);
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    } // end of finishGame


    /**
     * 벌칙
     * */
    private  void completePenalty(Participant participant, JsonObject message, Set<Participant> participants,
                                  JsonObject params, JsonObject data) {
        System.out.println("Complete Penalty ...");
        data.addProperty("gameStatus", 0);
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    } // end of completePenalty

}