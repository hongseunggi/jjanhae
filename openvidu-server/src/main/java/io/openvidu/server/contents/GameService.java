package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;
import org.apache.commons.collections.IterableMap;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class GameService {

    /** 게임 비활성화 */
    static final int NOGAME = -1;
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

    /** 공통순서 */
    protected ConcurrentHashMap<String, Map<Integer, String>> sOrderMap = new ConcurrentHashMap<>();
    protected ConcurrentHashMap<String, String> sCounterClockWise = new ConcurrentHashMap<>(); // 방인원에따라 순서가 달라지기 때문
    /** 양세찬 게임은 sessionId:nickname */
    protected ConcurrentHashMap<String, Map<String, String>> sNicknameMap = new ConcurrentHashMap<>();
//    protected Map<String, String> nicknameMap = new ConcurrentHashMap<>();
    /** 금지어 게임은 sessionId:word */
    protected ConcurrentHashMap<String, Map<String, String>> sWordMap = new ConcurrentHashMap<>();
//    protected ConcurrentHashMap<String, String> wordMap = new ConcurrentHashMap<>();
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
        System.out.println("[ message ] : " + message);

        // 게임 상태에 따라 분기
        int gameStatus = data.get("gameStatus").getAsInt();

        // 게임상태 추가, 벌칙완료 상태일 때만 4->0 으로
        data.addProperty("gameStatus", gameStatus);

        switch (gameStatus) {
            case NOGAME: // 게임 비활성화
                noGame(participant, message, participants, params, data);
                break;
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
     * 게임 비활성화
     * gameStatus: -1
     * */
    private void noGame(Participant participant, JsonObject message, Set<Participant> participants,
                        JsonObject params, JsonObject data) {
        System.out.println("No Game ...");
        params.add("data", data);
        // 브로드 캐스팅
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params); // sendMessage
        }
    }


    /**
     * 게임 준비
     * 게임 시작을 위한 초기화
     * gameStatus: 0
     * */
    private void prepareGame(Participant participant, JsonObject message, Set<Participant> participants,
                             JsonObject params, JsonObject data) {
        System.out.println("Prepare Game ...");


        if(data.get("gameId").getAsInt() == YANGSECHAN) {
            System.out.println("YangSeChan Game Prepare To Initial ...");
            // 준비단계에서 미리 초기화 시켜두기
            // nicknameMap에 streamId를 Key로 해서 모두 빈값으로 초기화시켜 놓는다.
            Map<Integer, String> orderMap = new HashMap<>(); // 순서를 매핑시킴
            Map<String, String> nicknameMap = new HashMap<>();
            int index = 1;
            for (Participant p : participants) {
                nicknameMap.put(p.getPublisherStreamId(), "");
                orderMap.put(index, p.getPublisherStreamId());
                index++;
            }

            // 매핑된 순서 확인
            System.out.println("mapping order check .....");
            Iterator<Map.Entry<Integer, String>> entry = orderMap.entrySet().iterator();
            while(entry.hasNext()) {
                Map.Entry<Integer, String> e = entry.next();
                System.out.printf("%d : %s\n", e.getKey(), e.getValue());
            }

            // sNicknameMap에 nicknameMap을 넣음
            String sessionId = message.get("sessionId").getAsString();
            sNicknameMap.put(sessionId, nicknameMap);
            sOrderMap.put(sessionId, orderMap); // 1이 누구이고 2는 누구인지 매핑

            // 방인원수에 따라 시계방향 순서가 달라지므로 방 세션마다 반시계방향 순서를 저장해놓는다
            String counterClockWise = "";
            int size = 4;
            if (participants.size() < 4) size = participants.size();
            for (int i = 1; i <= size; i++) {
                counterClockWise += Integer.toString(i); // 1234
            }
            for (int i = participants.size(); i >= size+1; i--) {
                counterClockWise += Integer.toString(i); // 8765
            }
            System.out.println("counterClockWise : " + counterClockWise);
            sCounterClockWise.put(message.get("sessionId").getAsString(), counterClockWise);
            Iterator<Map.Entry<String, String>> iter = sCounterClockWise.entrySet().iterator();
            while(iter.hasNext()) {
                Map.Entry<String, String> cur = iter.next();
                System.out.printf("%s, %s\n", cur.getKey(), cur.getValue());
            }

            data.addProperty("targetId", orderMap.get(counterClockWise.charAt(0)-'0')); // 저장해야할 아이디
            data.addProperty("streamId", orderMap.get(counterClockWise
                    .charAt(counterClockWise.length()-1)-'0')); // targetId를 바꿔주는 Id

        } else if (data.get("gameId").getAsInt() == FORBIDDEN) {
            System.out.println("Forbidden Game Prepare To Initial ...");
            // 준비단계에서 미리 초기화 시켜두기
            // nicknameMap에 streamId를 Key로 해서 모두 빈값으로 초기화시켜 놓는다.
            Map<Integer, String> orderMap = new HashMap<>(); // 순서를 매핑시킴
            Map<String, String> wordMap = new HashMap<>();
            int index = 1;
            for (Participant p : participants) {
                wordMap.put(p.getPublisherStreamId(), "");
                orderMap.put(index, p.getPublisherStreamId());
                index++;
            }

            // 매핑된 순서 확인
            System.out.println("mapping order check .....");
            Iterator<Map.Entry<Integer, String>> entry = orderMap.entrySet().iterator();
            while(entry.hasNext()) {
                Map.Entry<Integer, String> e = entry.next();
                System.out.printf("%d : %s\n", e.getKey(), e.getValue());
            }

            // sNicknameMap에 nicknameMap을 넣음
            String sessionId = message.get("sessionId").getAsString();
            sWordMap.put(sessionId, wordMap);
            sOrderMap.put(sessionId, orderMap); // 1이 누구이고 2는 누구인지 매핑

            // 방인원수에 따라 시계방향 순서가 달라지므로 방 세션마다 반시계방향 순서를 저장해놓는다
            String counterClockWise = "";
            int size = 4;
            if (participants.size() < 4) size = participants.size();
            for (int i = 1; i <= size; i++) {
                counterClockWise += Integer.toString(i); // 1234
            }
            for (int i = participants.size(); i >= size+1; i--) {
                counterClockWise += Integer.toString(i); // 8765
            }
            System.out.println("counterClockWise : " + counterClockWise);
            sCounterClockWise.put(message.get("sessionId").getAsString(), counterClockWise);
            Iterator<Map.Entry<String, String>> iter = sCounterClockWise.entrySet().iterator();
            while(iter.hasNext()) {
                Map.Entry<String, String> cur = iter.next();
                System.out.printf("%s, %s\n", cur.getKey(), cur.getValue());
            }

            data.addProperty("targetId", orderMap.get(counterClockWise.charAt(0)-'0')); // 저장해야할 아이디
            data.addProperty("streamId", orderMap.get(counterClockWise
                    .charAt(counterClockWise.length()-1)-'0')); // targetId를 바꿔주는 Id
        }

        data.addProperty("gameStatus", 1);
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
     * gameStatus: 1
     * */
    private void selectGame(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("Select Game ...");
        System.out.println("[ data ] " + data);
        // 게임 아이디를 받아 그에 해당하는 게임을 진행
        int gameId = data.get("gameId").getAsInt();
        /** participatn id test */
//        System.out.println("set size : "+participants.size());
//        System.out.println("[ participant id ] ... ");
//        Iterator<Participant> pid = participants.iterator();
//        while(pid.hasNext()) {
//            Participant partiwon = pid.next();
//            System.out.printf("public id : %s, private id : %s\n", partiwon.getParticipantPublicId(),
//                    partiwon.getParticipantPrivateId());
//            System.out.println("Stream Id 비교...");
//            System.out.printf("%s, %s\n", partiwon.getPublisherStreamId(), data.get("streamId").getAsString());
//        }
        /** End participatn id test */

        // 업다운 게임이 랜덤숫자를 생성해야 하기 때문에
        // 선택단계에서 미리 랜덤숫자 생성
        if(gameId == UPDOWN) {
            System.out.println("Select UPDOWN ...");
            // 각 세션ID에 랜덤숫자 생성해서 넣기, 세션ID는 각 방 번호를 뜻함.
            int number = (int) (Math.random() * 100) + 1;
            System.out.printf("sessionId : %s, number : %d\n", message.get("sessionId").getAsString(), number);
            numberMap.put(message.get("sessionId").getAsString(), number);
            data.addProperty("gameStatus", 2);
            // 생성해서 맵에 저장하고 있다가 후에 startGame에서 정답맞출때에 쓰임

        } else if (gameId == YANGSECHAN) {
            System.out.println("Select YANGSECHAN ...");
            System.out.println("This is to Save Gamename ...");
            /** 시계방향으로 돌며 닉네임 정하는 단계 */
            // 처음에 index = 1 로 온다.
            int index = data.get("index").getAsInt();
            int size = participants.size();
            data.addProperty("gameStatus", 1);
            if(index == participants.size()) {
                // 이번이 마지막 사람일 경우 gameStatus=2로 다음 상태로 넘어가도록 함
                data.addProperty("gameStatus", 2);
            }

            String sessionId = message.get("sessionId").getAsString();
            System.out.println("session Id : "+sessionId);

            // countWise 에서 현재 순서를 조회해옴
            System.out.println("sCountClockWise size : " + sCounterClockWise.size());
            Iterator<Map.Entry<String, String>> iter = sCounterClockWise.entrySet().iterator();
            while(iter.hasNext()) {
                Map.Entry<String, String> cur = iter.next();
                System.out.printf("%s, %s\n", cur.getKey(), cur.getValue());
            }
            String countClockWise = sCounterClockWise.get(sessionId); // 12348765
            System.out.println("countClockWise : " + countClockWise);
            // 현재 순서가 누구인지 조회
            Map<Integer, String> orderMap = sOrderMap.get(sessionId);
            System.out.println("order Map size : "+orderMap.size());
            String curStreamId = orderMap.get(countClockWise.charAt(index-1)-'0');
//            System.out.println("req first streamId : " + data.get("streamId").getAsString());
            System.out.println("curStreamId : " + curStreamId);
            data.addProperty("streamId", curStreamId);

            data.addProperty("index", ++index);
            System.out.println("increased index : "+index);
            if(index > size) {
                index -= size; // 만약 size=8이고, index=9일 시, 1로 돌려놓기 위해
                // FE에서 index=8 응답 받았을 시 다음 gameStatus로 넘어가면 size를 넘어갈일이 없긴 하지만 혹시모르므로
            }
            System.out.println("decreased index : "+index);

            Map<String, String> nicknameMap = sNicknameMap.get(sessionId); // 해당 방의 닉네임맵
            nicknameMap.put(curStreamId, data.get("gamename").getAsString());
            Iterator<Map.Entry<String, String>> iter2 = nicknameMap.entrySet().iterator();
            while(iter2.hasNext()) {
                System.out.println("open Map ...");
                Map.Entry<String, String> map = iter2.next();
                System.out.printf("Key : %s, Value : %s\n", map.getKey(), map.getValue());
            }
            // 다음 저장할 유저의 Stream ID를 클라이언트로 보냄
            String nextStreamId = orderMap.get(countClockWise.charAt(index-1)-'0');
            System.out.println("nextStreamId : " + nextStreamId);
            data.addProperty("targetId", nextStreamId);
            // 그리고 클라이언트에서 보낸 data 그대로 브로드 캐스팅...

        } else if (gameId == FORBIDDEN) {
            System.out.println("Select FORBIDDEN ...");
            System.out.println("This is to Save Gamename ...");
            /** 시계방향으로 돌며 닉네임 정하는 단계 */
            // 처음에 index = 1 로 온다.
            int index = data.get("index").getAsInt();
            int size = participants.size();
            data.addProperty("gameStatus", 1);
            if(index == participants.size()) {
                // 이번이 마지막 사람일 경우 gameStatus=2로 다음 상태로 넘어가도록 함
                data.addProperty("gameStatus", 2);
            }

            String sessionId = message.get("sessionId").getAsString();
            System.out.println("session Id : "+sessionId);

            // countWise 에서 현재 순서를 조회해옴
            System.out.println("sCountClockWise size : " + sCounterClockWise.size());
            Iterator<Map.Entry<String, String>> iter = sCounterClockWise.entrySet().iterator();
            while(iter.hasNext()) {
                Map.Entry<String, String> cur = iter.next();
                System.out.printf("%s, %s\n", cur.getKey(), cur.getValue());
            }
            String countClockWise = sCounterClockWise.get(sessionId); // 12348765
            System.out.println("countClockWise : " + countClockWise);
            // 현재 순서가 누구인지 조회
            Map<Integer, String> orderMap = sOrderMap.get(sessionId);
            System.out.println("order Map size : "+orderMap.size());
            String curStreamId = orderMap.get(countClockWise.charAt(index-1)-'0');
//            System.out.println("req first streamId : " + data.get("streamId").getAsString());
            System.out.println("curStreamId : " + curStreamId);
            data.addProperty("streamId", curStreamId);

            data.addProperty("index", ++index);
            System.out.println("increased index : "+index);
            if(index > size) {
                index -= size; // 만약 size=8이고, index=9일 시, 1로 돌려놓기 위해
                // FE에서 index=8 응답 받았을 시 다음 gameStatus로 넘어가면 size를 넘어갈일이 없긴 하지만 혹시모르므로
            }
            System.out.println("decreased index : " + index);

            Map<String, String> wordMap = sWordMap.get(sessionId); // 해당 방의 닉네임맵
            wordMap.put(curStreamId, data.get("gamename").getAsString());
            Iterator<Map.Entry<String, String>> iter2 = wordMap.entrySet().iterator();
            while(iter2.hasNext()) {
                System.out.println("open Map ...");
                Map.Entry<String, String> map = iter2.next();
                System.out.printf("Key : %s, Value : %s\n", map.getKey(), map.getValue());
            }
            // 다음 저장할 유저의 Stream ID를 클라이언트로 보냄
            String nextStreamId = orderMap.get(countClockWise.charAt(index-1)-'0');
            System.out.println("nextStreamId : " + nextStreamId);
            data.addProperty("targetId", nextStreamId);
            // 그리고 클라이언트에서 보낸 data 그대로 브로드 캐스팅...
        }

        // 브로드캐스팅
        System.out.println("data : " + data);
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }

    } // end of selectGame


    /**
     * 게임 시작
     * 게임 선택 완료 후 진행
     * gameStatus: 2
     * */
    private void startGame(Participant participant, JsonObject message, Set<Participant> participants,
                           JsonObject params, JsonObject data) {
        System.out.println("Start Game ...");

        int gameId = data.get("gameId").getAsInt();
        String streamId = data.get("streamId").getAsString();

        switch (gameId) {
            case YANGSECHAN: // 양세찬 게임
                // 자신의 닉네임(gamename)을 맞추기
                // 사용자가 종료버튼 누르면 끝나도록 (gameStatus = 3으로 요청이 어차피 오게 되므로 별도로 뭐 해줄필요없이 뿌리기만하면됨)
                Map<String, String> nicknameMap = sNicknameMap.get(message.get("sessionId").getAsString());
                String userAnswer = nicknameMap.get(streamId);
                System.out.println("map size : " + nicknameMap.size());
                System.out.println("userAnswer : " + userAnswer);
                System.out.println("userInput : " + data.get("gamename").getAsString());
                System.out.println("result : " + userAnswer.equals(data.get("gamename").getAsString()));
                if(nicknameMap.size()!=0 && userAnswer.equals(data.get("gamename").getAsString())) { // 정답일 시 종료
                    System.out.printf("%s!! It's Answer!!!\n", streamId);
                    data.addProperty("answerYn", "Y");
                } else { // 정답 아닐 시 계속 진행
                    System.out.printf("%s... No Answer.. ;(\n", streamId);
                    data.addProperty("answerYn", "N");
                }

                break;
            case FORBIDDEN: // 금지어 게임
                // 사용자가 경고버튼 누르면 어차피 siren = 1로 오므로 브로드캐스트만 하면됨
                // 사용자가 종료버튼 누르면 끝나도록 (gameStatus = 3으로 요청이 어차피 오게 되므로 별도로 뭐 해줄필요없이 뿌리기만하면됨)
                Map<String, String> wordMap = sWordMap.get(message.get("sessionId").getAsString());
                String wordAnswer = wordMap.get(streamId);
                System.out.println("map size : " + wordMap.size());
                System.out.println("userAnswer : " + wordAnswer);
                String sirenYn = data.get("sirenYn").getAsString();
                System.out.println("sirenYn : "+sirenYn);
                if("N".equals(sirenYn)) { // siren을 누르지 않았을 때
                    System.out.println("User don't click siren..");
                    System.out.println("So Remove sirenYn");
                    data.remove("sirenYn");
                    // 정답일 시
                    if(wordMap.size()!=0 && wordAnswer.equals(data.get("gamename").getAsString())) {
                        System.out.printf("%s!! It's Answer!!!\n", streamId);
                        data.addProperty("answerYn", "Y");
                    } else {
                        System.out.printf("%s... No Answer.. ;(\n", streamId);
                        data.addProperty("answerYn", "N");
                    }
                } else { // siren을 눌렀을 시
                    // 그대로 보내줌
                    System.out.println("user click siren ...");
                }

                break;
            case UPDOWN: // 업다운 게임
                // streamId와 해당사용자가 입력한 숫자가 넘어오면,
                // 답과 숫자가 맞는지 판별
                // 정답이 나오면 종료
                String sessionId = message.get("sessionId").getAsString();
                if(numberMap.get(sessionId) == data.get("number").getAsInt()) { // 정답일 시 updown = "same"
                    System.out.printf("%d is Answer!!\n", data.get("number").getAsInt());
                    data.addProperty("updown", "same");
                    data.addProperty("gameStatus", 2); // 정답일 시 게임종료 // 승기요청으로 잠시 3->2로 수정
                } else if (numberMap.get(sessionId) > data.get("number").getAsInt()) { // 정답보다 작을 시 updown = "up"
                    System.out.printf("Answer : %d, User Input : %d => up!!\n", numberMap.get(sessionId),
                            data.get("number").getAsInt());
                    data.addProperty("updown", "up");
                } else { // 정답보다 클 시 updown = "down"
                    System.out.printf("Answer : %d, User Input : %d => down!!\n", numberMap.get(sessionId),
                            data.get("number").getAsInt());
                    data.addProperty("updown", "down");
                }

        }

        // 브로드캐스팅
        System.out.println("data : " + data);
        params.add("data", data);
        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }

    } // end of startGame


    /**
     * 게임 종료
     * gameStatus: 3
     * */
    private void finishGame(Participant participant, JsonObject message, Set<Participant> participants,
                            JsonObject params, JsonObject data) {
        System.out.println("Finish Game ...");
        data.addProperty("gameStatus", 3);
        params.add("data", data);

        // 각 게임에 따라 종료 후 처리 다르게
        int gameId = data.get("gameId").getAsInt();
        String sessionId = message.get("sessionId").getAsString();
        if(gameId == YANGSECHAN) {
            sNicknameMap.remove(sessionId);
            System.out.println("yangsechan game... "+sessionId+" delete success");
        } else if (gameId == FORBIDDEN) {
            sWordMap.remove(sessionId);
            System.out.println("forbidden game... "+sessionId+" delete success");
        } else if (gameId == UPDOWN) {
            numberMap.remove(sessionId);
            System.out.println("updown game... "+sessionId+" delete success");
        }

        for (Participant p : participants) {
            rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                    ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
        }
    } // end of finishGame


    /**
     * 벌칙
     * gameStatus: 4
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