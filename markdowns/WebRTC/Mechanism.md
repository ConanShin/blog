WebRTC Mechanism
===

###### tags: `WebRTC`

- Signaling
    - WebRTC는 RTCPeerConnection API를 활용하여 데이터를 스트리밍합니다. 하지만 그전에 어떤 사용자에게 데이터를 전송할지 coordination을 포함하진 않습니다.
        따라서 우리는 올바른 사용자간 peer-to-peer 환경을 제공하기 위해 signaling을 사용합니다.
    - Protocol에 제약은 없으며 SIP, XMPP, Socket.io등 다양하게 활용하시면 됩니다.
    - [appr.tc](https://appr.tc/)는 XHR과 Channel API를 사용한 간단한 예제입니다.
    ![](https://www.html5rocks.com/en/tutorials/webrtc/basics/jsep.png)
    ref: https://www.youtube.com/watch?v=p2HzZkd2A40
    - Signaling을 통해 교환되는 정보 4가지
        1. 통신을 열고 닫는데 사용되는 세션 컨트롤 및 에러 메세지
        2. 코덱이나 코덱 설정, 대역폭, 미디어 타입 같은 미디어 메타데이터
        3. 보안 연결을 수립하기 위해 사용되는 키 데이터
        4. 호스트의 IP 주소와 포트 같은 네트워크 데이터

    - 브라우저는 signaling을 통해 연결을 맺을 상대방의 통신 정보를 어플리케이션에서 습득 후 peer to peer로 미디어 및 데이터를 전송할 수 있는 권한을 얻는다.

    - 필요한 지식
        1. NAT
        NAT는 공인망과 내부망이 분리되어 있는 환경에서 각 망의 IP:Port를 맵핑해주는 역할을 한다.
        NAT에는 아래와 같은 방식이 있다.
            - Normal(Full Cone) NAT
              내부서버A에서 공유기를 거쳐 IP_A:Port_A인 external IP와 맵핑되어 외부서버로 패킷이 전달했다면 어떠한 외부서버도 IP_A:Port_A를 통해 내부서버A로 패킷을 전달할 수 있다.
            - Restricted Cone NAT: 
              내부서버A(IP_A:Port_A)에서 외부서버B(IP_B:Port_B)로 패킷을 전달했다면, IP_A:Port_A를 통해 내부서버A로 패킷을 전달하려는 외부서버는 IP_B주소를 가지고 있어야만하며 Port는 무관하다.
            - Port Restricted Cone NAT
              Restricted Cone NAT과 방식은 같으며 제약이 Port까지 추가된다.
            - Symmetric NAT
              외부서버에서 내부서버로 패킷을 보낼때마다 다른 NAT맵핑을 사용하게 되는데. Restricted Cone NAT은 external Port가 일정하지만 symmetric NAT은 접속하는 외부서버에 따라 external Port가 다르다.
              
        2. STUN(Session Traversal Utilities for NAT)
           Peer간 통신을 하는데 public종단을 거칠 때에 NAT상에 맵핑된 peer의 접속정보(IP주소)를 열람하는 역할을 한다.
            ![](https://i.imgur.com/luRtnFf.png)

        3. TURN(Traversal Using Relays around NAT)
           STUN이 IP주소를 열람하는 과정에서 실패를 하여 Peer간 직접 통신이 어려울 경우 NAT사이에서 데이터를 전달해 줄 TURN서버를 사용하게 된다. TURN은 별도의 공용 주소를 사용하며 데이터를 전달해주기 때문에 peer to peer 직접 연결하는 것보다 컴퓨팅 자원이 소모 된다. 
           ![](https://i.imgur.com/8uwDQXy.png)

    ```javascript
    const signaling = new SignalingChannel();
    const constraints = {audio: true, video: true};
    const configuration = {iceServers: [{urls: 'stuns:stun.example.org'}]};
    const pc = new RTCPeerConnection(configuration);

    // Send any ice candidates to the other peer.
    pc.onicecandidate = ({candidate}) => signaling.send({candidate});

    // Let the "negotiationneeded" event trigger offer generation.
    pc.onnegotiationneeded = async () => {
      try {
        await pc.setLocalDescription(await pc.createOffer());
        // Send the offer to the other peer.
        signaling.send({desc: pc.localDescription});
      } catch (err) {
        console.error(err);
      }
    };

    // Once remote track media arrives, show it in remote video element.
    pc.ontrack = (event) => {
      // Don't set srcObject again if it is already set.
      if (remoteView.srcObject) return;
      remoteView.srcObject = event.streams[0];
    };

    // Call start() to initiate.
    async function start() {
      try {
        // Get local stream, show it in self-view, and add it to be sent.
        const stream =
          await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) =>
          pc.addTrack(track, stream));
        selfView.srcObject = stream;
      } catch (err) {
        console.error(err);
      }
    }

    signaling.onmessage = async ({desc, candidate}) => {
      try {
        if (desc) {
          // If you get an offer, you need to reply with an answer.
          if (desc.type === 'offer') {
            await pc.setRemoteDescription(desc);
            const stream =
              await navigator.mediaDevices.getUserMedia(constraints);
            stream.getTracks().forEach((track) =>
              pc.addTrack(track, stream));
            await pc.setLocalDescription(await pc.createAnswer());
            signaling.send({desc: pc.localDescription});
          } else if (desc.type === 'answer') {
            await pc.setRemoteDescription(desc);
          } else {
            console.log('Unsupported SDP type.');
          }
        } else if (candidate) {
          await pc.addIceCandidate(candidate);
        }
      } catch (err) {
        console.error(err);
      }
    };
    ```
    