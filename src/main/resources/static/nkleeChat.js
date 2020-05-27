let WebRTC = (function () {

    // connecting to our signaling server
    let webSocketConn = new WebSocket('ws://172.18.97.21:8080/socket');

    // 암호화 및 대역폭 관리, 오디오 및 비디오 연결 담당
    let peerConnection;

    // 음성 및 영상 데이터가 아닌 json/text 데이터들을 주고 받는 것을 담당
    let dataChannel;

    // 사용자 이름
    let myName;

    // common
    let EMPTY = "";

    // ----------------------------------------------
    // 초기화
    // ----------------------------------------------
    let init = function () {

        if (bindUserName() == false) {
            return;
        }

        webSocketConn.onopen = function () {
            console.log("Connected to the signaling server");
        };

        webSocketConn.onmessage = function (msg) {
            console.log("[From WebSocket] onmessage : " + msg.data);
            let content = JSON.parse(msg.data);
            let data = content.data;

            switch (content.event) {
                case "join": // 참여
                    handleJoin(content);
                    break;
                case "offer": // 제안
                    handleOffer(data);
                    break;
                case "answer": // 수락
                    handleAnswer(data);
                    break;
                case "candidate": // 연결
                    handleCandidate(data);
                    break;
                default:
                    break;
            }
        };

        let configuration = {
            "iceServers": [{
                "url": "stun:stun2.1.google.com:19302"
            }]
        };

        peerConnection = new RTCPeerConnection(configuration, {
            optional: [{
                RtpDataChannels: true
            }]
        });

        peerConnection.onicecandidate = function (event) {
            if (event.candidate) {
                sendMsg({
                    event: "candidate",
                    data: event.candidate
                });
            }
        };

        dataChannel = peerConnection.createDataChannel("dataChannel", {
            reliable: true
        });

        dataChannel.onopen = function (event) {
            console.log("event : " + JSON.stringify(event));
            let readyState = dataChannel.readyState;
            if (readyState == "open") {
                dataChannel.send("Connected together!!");
            }
        };

        dataChannel.onerror = function (error) {
            console.log("Error occured on datachannel:", error);
        };

        dataChannel.onmessage = function (event) { // 받는 메세지
            let message = event.data;
            console.log("message:", message);
            newMessage("replies", message);
        };

        dataChannel.onclose = function () {
            console.log("data channel is closed");
        };

        // join
        sendMsg({
            event: "join",
            name: myName
        });

    };

    // ----------------------------------------------
    // 유저 이름 셋팅
    // ----------------------------------------------
    let bindUserName = function () {
        myName = prompt("이름을 입력해주세요. : ", EMPTY);
        if (myName == EMPTY) {
            alert("이름을 입력하셔야 합니다.");
            return false;
        }

        $(".wrap > p").text(myName);
    };

    // ----------------------------------------------
    // WebSocket 메세지 전송
    // ----------------------------------------------
    let sendMsg = function (message) {
        waitForConnection(function () {
            webSocketConn.send(JSON.stringify(message));
        }, 1000);
    };

    // [readyState]
    // 0 : CONNECTING 소켓이 생성, 연결은 아직 안된 상태
    // 1 : OPEN	연결되었고, 통신할 준비가 되었다.
    // 2 : CLOSING 연결이 닫히는 중
    // 3 : CLOSED 연결이 닫힘
    // Uncaught InvalidStateError: Failed to execute 'send' on 'WebSocket': Still in CONNECTING state 오류가 발생하는 것을 방지하기 위해서
    let waitForConnection = function (callback, interval) {
        if (webSocketConn.readyState === 1) { // 연결
            callback();
        } else {
            setTimeout(function () {
                waitForConnection(callback, interval);
            }, interval);
        }
    };

    let createOffer = function () {
        if (confirm("Peer와 연결하시겠습니까?")) {
            peerConnection.createOffer(function (offer) { // 신호를 보내는 쪽의 SDP 생성
                sendMsg({
                    event: "offer",
                    data: offer
                });
                peerConnection.setLocalDescription(offer);
                console.log(offer.sdp);
            }, function (error) {
                alert("Error creating an offer : " + error);
            });
        }
    };

    // ----------------------------------------------
    // Peer to Peer 연결 작업
    // ----------------------------------------------
    let handleOffer = function (offer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        peerConnection.createAnswer(function (answer) { // 신호를 받는 쪽의 SDP 생성
            sendMsg({
                event: "answer",
                data: answer
            });
            peerConnection.setLocalDescription(answer);
            console.log(answer.sdp);
        }, function (error) {
            alert("Error creating an answer : " + error);
        });
    };

    let handleAnswer = function (answer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("connection established successfully!!"); // peer 간에 통신이 가능한 상태
    };

    let handleCandidate = function (candidate) {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    let handleJoin = function (content) {
        let users = content.users;
        if (users != undefined) {
            let contantParent = $('#contacts > ul');
            contantParent.empty();
            users.forEach(user => {
                let userName = user.userName;
                let remoteAddress = user.remoteAddress;
                let contact = $('#template > .contact');
                let newContact = contact.clone();
                newContact.find(".name").text(userName);
                newContact.find(".preview").text(remoteAddress);
                $(newContact).appendTo(contantParent);
            });
        }
    };

    let sendMessage = function (msg) {
        if (dataChannel.readyState != "open") {
            alert("peer to peer 연결이 원할하지 않습니다. 다시 연결 시도해주세요.");
            return false;
        }

        dataChannel.send(msg);
    };

    return {
        init: init,
        sendMessage: sendMessage,
        createOffer: createOffer,
    }

})();