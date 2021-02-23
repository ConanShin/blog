Zoom API 사용기
===

- [API LIST](https://marketplace.zoom.us/docs/api-reference/zoom-api)
- [Client SDK Document](https://marketplace.zoom.us/docs/sdk/native-sdks/web/reference)
- [Market Place](https://marketplace.zoom.us/)
1. Web SDK를 활용하기 위한 절차
    - JWT 어플리케이션 프로젝트 생성 후 API key를 발급받아야한다.
    ![](https://i.imgur.com/itkc6V3.png)
    - Zoom sdk에서는 기본적으로 API key와 Signature값을 요구한다.
    ``` javascript
    ZoomMtg.join({
        meetingNumber: 123456789,
        userName: 'User name',
        userEmail: '',
        passWord: '',
        apiKey: 'API_KEY',
        signature: 'SIGNATURE',
        success: function(res){console.log(res)},
        error: function(res){console.log(res)}
    });
    ```
    - Signature 발급을 위해 Sercret 값이 필요하다.
    ```javascript
    ZoomMtg.generateSignature({
        meetingNumber: 'Meeting Room Number',
        apiKey: 'API KEY',
        apiSecret: 'API SECRET',
        role: 0, // 1 host, 0 participant
        success: function(res){
            console.log(res.result);
        }
    });
    ```
    
2. 회의 만들기
    - Client에 API SECRET을 노출하는 것은 위험하기 때문에 위와 같은 방법 보다는 백엔드에서 JWT을 발급 후 Zoom API와 연동하는 것이 좋다.
      아래는 Zoom에서 권장한 SHA256기반의 jwt생성 함수다.
    ```javascript
    generateToken () {
        const API_KEY = 'API_KEY'
        const SECRET_KEY = 'SECRET_KEY'
        const EXP_TIME = 20 * 60 * 1000

        const header = {
            alg: 'HS256',
            typ: 'JWT'
        }
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '')

        const payload = {
            iss: API_KEY,
            exp: new Date(new Date().getTime() + EXP_TIME).getTime()
        }
        const encodedPayload =  Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '')

        const message = encodedHeader + '.' + encodedPayload
        const hmacSecret = crypto.createHmac('sha256', SECRET_KEY).update(message).digest('base64').replace(/=/g, '')

        return encodedHeader + '.' + encodedPayload + '.' + hmacSecret
    }
    ```
    - 회의를 만들기 위해서는 `POST https://api.zoom.us/v2/users/${userId}/meetings` API를 사용한다.
    - Header에 Authorization 필드에 위에서 발급받은 token값을 넣는다. 
    - Body에는 회의 주제와 회의 타입을 정의해서 API를 호출하면 되는데 타입 종류는 다음과 같다.
        - 지금바로 진행할 회의
        - 시작시간을 설정하고 추후해 진행할 회의
        - 반복으로 진행할 회의
        - 반복으로 진행할 회의이며 진행시간이 FIXED된 회의

3. 회의 참가하기
    - 위에서 생성된 회의를 Client에서 참가하는 방법을 알아볼텐데 필자는 Vue를 사용했다.
    - 먼저 Zoom SDK를 사용하기 위해 library 설치한다.
    ```
    npm install --save-dev @zoomus/websdk
    ```
    - Client에서 ZoomMtg 객체를 import만 해주어도 화면이 표시되는 것을 볼 수 있다.
    ```javascript
    import {ZoomMtg} from '@zoomus/websdk'
    ```
    - Zoom에서 필요한 클라이언트 라이브러리를 모두 준비해 주기위해 아래 스크립트도 추가해준다.
    ```javascript
    ZoomMtg.setZoomJSLib('https://source.zoom.us/1.9.0/lib', '/av')
    ZoomMtg.preLoadWasm()
    ZoomMtg.prepareJssdk()
    ```
    
    ```javascript
    ZoomMtg.init({
        leaveUrl: './zoom', //required
        success: response => {
            ZoomMtg.join({
                meetingNumber: room number,
                userName: 'USER NAME',
                userEmail: 'EMAIL ADDRESS',
                passWord: 'PASS CODE',
                apiKey: 'API KEY',
                signature: 'SIGNATURE',
                success: function(res){},
                error: function(res){}
            })
        }
    })
    ```
    - 여기서 signature값을 생성하기 위해서는 API Secret을 사용해야하는데 API Secret이 Client 소스에 노출되는 것을 방지하기 위해 backend에서 signature 생성해 주었다.
    ```javascript
    generateSignature (meetingNumber: string) {
        const ts = new Date().getTime() - 30000;
        const message = Buffer.from(this.API_KEY + meetingNumber + ts + Roles.ATTENDEE).toString('base64')
        const hash = crypto.createHmac('sha256', this.SECRET_KEY).update(message).digest('base64')

        return base64JS.Base64.encodeURI(this.API_KEY + '.' + meetingNumber + '.' + ts + '.' + Roles.ATTENDEE + '.' + hash)
    }
    ```
