WebRTC Mechanism
===

###### tags: `WebRTC`

- Signaling
    - WebRTC는 RTCPeerConnection API를 활용하여 데이터를 스트리밍합니다. 하지만 그전에 어떤 사용자에게 데이터를 전송할지 coordination을 포함하진 않습니다.
        따라서 우리는 올바른 사용자간 peer-to-peer 환경을 제공하기 위해 signaling을 사용합니다.
    - Protocol에 제약은 없으며 SIP, XMPP, Socket.io등 다양하게 활용하시면 됩니다.
    - [appr.tc](https://appr.tc/)는 XHR과 Channel API를 사용한 간단한 예제입니다.
    ![](https://www.html5rocks.com/en/tutorials/webrtc/basics/jsep.png)
    - Signaling을 통해 교환되는 정보 4가지
        1. 통신을 열고 닫는데 사용되는 세션 컨트롤 및 에러 메세지
        2. 코덱이나 코덱 설정, 대역폭, 미디어 타입 같은 미디어 메타데이터
        3. 보안 연결을 수립하기 위해 사용되는 키 데이터
        4. 호스트의 IP 주소와 포트 같은 네트워크 데이터

    - 브라우저는 signaling을 통해 연결을 맺을 상대방의 통신 정보를 어플리케이션에서 습득 후 peer to peer로 미디어 및 데이터를 전송할 수 있는 권한을 얻는다.

- 필요한 지식
    - NAT은 공인망과 내부망이 분리되어 있는 환경에서 각 망의 IP:Port를 맵핑해주는 역할을 한다.
        - Normal(Full Cone) NAT
          내부서버A에서 공유기를 거쳐 IP_A:Port_A인 external IP와 맵핑되어 외부서버로 패킷이 전달했다면 어떠한 외부서버도 IP_A:Port_A를 통해 내부서버A로 패킷을 전달할 수 있다.
        - Restricted Cone NAT: 
          내부서버A(IP_A:Port_A)에서 외부서버B(IP_B:Port_B)로 패킷을 전달했다면, IP_A:Port_A를 통해 내부서버A로 패킷을 전달하려는 외부서버는 IP_B주소를 가지고 있어야만하며 Port는 무관하다.
        - Port Restricted Cone NAT
          Restricted Cone NAT과 방식은 같으며 제약이 Port까지 추가된다.
        - Symmetric NAT
          외부서버에서 내부서버로 패킷을 보낼때마다 다른 NAT맵핑을 사용하게 되는데. Restricted Cone NAT은 external Port가 일정하지만 symmetric NAT은 접속하는 외부서버에 따라 external Port가 다르다.

    - STUN(Session Traversal Utilities for NAT)는 Peer간 통신을 하는데 public종단을 거칠 때에 NAT상에 맵핑된 peer의 접속정보(IP주소)를 열람하는 역할을 한다.
        ![](https://i.imgur.com/luRtnFf.png)

    - TURN(Traversal Using Relays around NAT)는 STUN이 IP주소를 확인하는 과정을 실패하여 Peer간 직접 통신이 어려울 경우 NAT사이에서 데이터를 전달해 줄 TURN서버를 사용하게 된다. TURN은 별도의 공용 주소를 사용하며 데이터를 전달해주기 때문에 peer to peer 직접 연결하는 것보다 컴퓨팅 자원이 소모 된다. 
       ![](https://i.imgur.com/8uwDQXy.png)

- Steps
    ![](https://i.imgur.com/dEcrHuL.png)
    1. Peer A와 Peer B는 Signaling Server를 통해 자신의 SDP(video / audio에 대한 데이터)를 상대방에게 전송한다.
    2. 자신의 SDP는 RTCPeerConnection의 localDescription으로 등록하고 상대방의 SDP는 remoteDescription으로 등록한다.
    3. local description이 등록되는 시점에 STUN/TURN서버를 통해 iceCandidate이 생성되는데 이 candidate에는 자신의 host정보가 담겨 있다.
    4. 이 정보를 Signaling Server를 통해 다시 서로에게 전달을 하면 PeerConnection의 addIceCandidate으로 서로의 candidate을 등록하게 된다.
    5. 이렇게 SDP(Media에 대한 정보)와 Candidate(Host에 대한 정보)를 Peer간 주고받으면 모든 준비가 끝나며 PeerConnection 객체의 ontrack 이벤트를 통해 서로의 Media Stream데이터를 전달 받을 수 있게된다.

refs:
- https://www.youtube.com/watch?v=p2HzZkd2A40
- https://juyoung-1008.tistory.com/27