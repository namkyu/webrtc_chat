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
                case "offer":
                    handleOffer(data);
                    break;
                case "answer":
                    handleAnswer(data);
                    break;
                case "candidate":
                    handleCandidate(data);
                    break;
                case "join":
                    handleJoin(content);
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
                send({
                    event: "candidate",
                    data: event.candidate
                });
            }
        };

        // creating data channel
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

        // when we receive a message from the other peer, printing it on the console
        dataChannel.onmessage = function (event) { // 받는 메세지
            let message = event.data;
            console.log("message:", message);
            newMessage("replies", message);
        };

        dataChannel.onclose = function () {
            console.log("data channel is closed");
        };

        // join
        send({
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
    let send = function (message) {
        webSocketConn.send(JSON.stringify(message));
    };


    let createOffer = function () {
        if (confirm("Peer와 연결하시겠습니까?")) {
            peerConnection.createOffer(function (offer) {
                send({
                    event: "offer",
                    data: offer
                });
                peerConnection.setLocalDescription(offer);
                console.log(offer.sdp);
            }, function (error) {
                alert("Error creating an offer");
            });
        }
    };

    // ----------------------------------------------
    // Peer to Peer 연결 작업
    // ----------------------------------------------
    let handleOffer = function (offer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        peerConnection.createAnswer(function (answer) { // create and send an answer to an offer
            peerConnection.setLocalDescription(answer);
            send({
                event: "answer",
                data: answer
            });
        }, function (error) {
            alert("Error creating an answer");
        });
    };

    let handleAnswer = function (answer) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("connection established successfully!!");
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










