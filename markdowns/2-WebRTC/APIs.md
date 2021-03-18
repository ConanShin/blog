WebRTC APIs
===

###### tags: `WebRTC`

- WebRTC란?
    - Real Time Communication의 약자로 웹상에서 별도의 플러그인 없이 화상서비스 뿐만아니라 peer-to-peer 데이터 공유가 가능해지는 서비스 입니다.
    - 현재 Google Chrome, Safari, Firefox, 그리고 Opera를 지원하고 있습니다.
    - [appr.tc](https://appr.tc/)에서 간단한 demo를 체험할 수 있습니다.

- WebRTC의 주요 API 3가지
    1. MediaStream: Accessing audio and video
        ![](https://i.imgur.com/airoUgz.jpg)
        ref: https://youtu.be/p2HzZkd2A40
        ```javascript
        const constraints = {video: true, audio: true} 
        
        const successCallback = stream => {
            const video = document.querySelector('video')
            video.src = window.URL.createObjectURL(stream)
        }
        
        const errorCallback = error => {
            console.log('getUserMedia error: ', error)
        }
        
        navigator.getUserMedia(constraints, successCallback, errorCallback)
        ```
        ```java
        Supporting constraints
        dictionary MediaTrackSupportedConstraints {
          boolean width = true;
          boolean height = true;
          boolean aspectRatio = true;
          boolean frameRate = true;
          boolean facingMode = true;
          boolean resizeMode = true;
          boolean sampleRate = true;
          boolean sampleSize = true;
          boolean echoCancellation = true;
          boolean autoGainControl = true;
          boolean noiseSuppression = true;
          boolean latency = true;
          boolean channelCount = true;
          boolean deviceId = true;
          boolean groupId = true;
        };
        ```
        [examples](http://webaudiodemos.appspot.com/)
    2. RTCPeerConnection: Internet을 통해 다른 WebRTC endpoint로 실시간 연결
        ![](https://i.imgur.com/MS1LpfX.jpg)
        ref: https://www.youtube.com/watch?v=p2HzZkd2A40
        - Signal processing
        - Codec handling
        - Peer to peer communication
        - Security
        - Bandwidth management
        ```javascript
        pc = new RTCPeerConnection(null)
        pc.onaddstream = gotRemoteStream
        pc.addStream(localStream)
        pc.createOffer(gotOffer)
        
        const gotOffer = desc => {
            pc.setLocalDescription(desc)
            sendOffer(desc)
        }
        
        const gotAnswer = desc => {
            pc.setRemoteDescription(desc)
        }
        
        const gotRemoteStream = event => {
            attachMediaStream(remoteVideo, event.stream)
        }
        ```
        [sample](https://simpl.info/rtcpeerconnection/)
    3. RTCDataChannel: Video와 Audio뿐만 아니라 어떠한 형식의 데이터도 공유 가능
        - Websocket과 유사함
        - Ultra-low latency
        - Unreliable and reliable(UDP/TCP)
        - Secure(Data encryption)
        ```javascript
        const pc = new webkitRTCPeerConnection(servers, {optional: [{RtpDataChannels: true}]})
        pc.ondatachannel = event => {
            receiveChannel = event.channel
            receiveChannel.onmessage = event => {
                document.querySelector('div#receive').innerHTML = event.data
            }
        }
        
        sendChannel = pc.createDataChannel('sendDataChannel', {reliable: false})
        document.querySelector('button#send').onclick = () => {
            const data = document.querySelector('textarea#send').value
            sendChannel.send()
        }
        ```
        [sample](https://simpl.info/rtcdatachannel/)
