

// connecting to our signaling server
var webSocketConn = new WebSocket('ws://172.18.97.21:8080/socket');

// 암호화 및 대역폭 관리, 오디오 및 비디오 연결 담당
var peerConnection;

// 음성 및 영상 데이터가 아닌 json/text 데이터들을 주고 받는 것을 담당
var dataChannel;

var myName;
var EMPTY = "";

// ------------------------------------------------------------
// 웹소켓
// ------------------------------------------------------------
webSocketConn.onopen = function () {
    console.log("Connected to the signaling server");
    initialize();
};

webSocketConn.onmessage = function (msg) {
    console.log("[websocket] onmessage : " + msg.data);
    var content = JSON.parse(msg.data);
    var data = content.data;

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

function send(message) {
    webSocketConn.send(JSON.stringify(message));
}

// ------------------------------------------------------------
// caller
// ------------------------------------------------------------
// 먼저 연결하고자 하는 Peer 가 SDP 를 만든다.
function createOffer() {
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
}

function handleAnswer(answer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("connection established successfully!!");
}

// ------------------------------------------------------------
// callee
// ------------------------------------------------------------
// 응답하는 Peer 가 만든 SDP 를 일컫는다.
function handleOffer(offer) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    // create and send an answer to an offer
    peerConnection.createAnswer(function (answer) {
        peerConnection.setLocalDescription(answer);
        send({
            event: "answer",
            data: answer
        });
    }, function (error) {
        alert("Error creating an answer");
    });
}

// ------------------------------------------------------------
// common function
// ------------------------------------------------------------
function initialize() {
    myName = prompt("이름을 입력해주세요. : ", EMPTY);
    if (myName == EMPTY) {
        alert("이름을 입력하셔야 합니다.");
        return;
    }

    $(".wrap > p").text(myName);

    var configuration = {
        "iceServers": [{
            "url": "stun:stun2.1.google.com:19302"
        }]
    };

    // RTCPeerConnection 객체 생성 시 stun 서버 정보를 입력
    // stun 서버를 통해 peer 가 자신의 public ip 정보를 알아낸다.
    peerConnection = new RTCPeerConnection(configuration, {
        optional: [{
            RtpDataChannels: true
        }]
    });

    // Setup ice handling
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

    dataChannel.onopen = function(event) {
        console.log("event : " + JSON.stringify(event));
        var readyState = dataChannel.readyState;
        if (readyState == "open") {
            dataChannel.send("Connected together!!");
        }
    };

    dataChannel.onerror = function (error) {
        console.log("Error occured on datachannel:", error);
    };

    // when we receive a message from the other peer, printing it on the console
    dataChannel.onmessage = function (event) { // 받는 메세지
        var message = event.data;
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
}

function sendMessage(msg) {
    if (dataChannel.readyState != "open") {
        alert("peer to peer 연결이 원할하지 않습니다. 다시 연결 시도해주세요.");
        return;
    }

    dataChannel.send(msg);
}

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

// 방 입장
function handleJoin(content) {
    var users = content.users;
    if (users != undefined) {
        // 유저 목록 초기화
        var contantParent = $('#contacts > ul');
        contantParent.empty();

        // 유저 목록 출력
        users.forEach(user => {
            var userName = user.userName;
            var remoteAddress = user.remoteAddress;
            var contact = $('#template > .contact');
            var newContact = contact.clone();
            newContact.find(".name").text(userName);
            newContact.find(".preview").text(remoteAddress);
            $(newContact).appendTo(contantParent);
        });
    }
}

