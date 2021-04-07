NestJS + FCM
===
###### tags: `nestjs`

1. Firebase Admin SDK Secret Key 다운로드
    ![](https://i.imgur.com/nfY0MIw.png)
2. NestJS에 적용
    - module
    ```javascript=
    @Module({
        imports: [],
        providers: [FirebaseService],
        exports: [FirebaseService],
    })
    export class FirebaseModule {}
    ```
    - service (.json파일 여기서 사용)
    ```javascript=
    @Injectable()
    export class FirebaseService {
        constructor() {
            const options = {credential: admin.credential.cert(require('./firebase.config.json'))}
            admin.initializeApp(options)
        }

        sendNotification(token: string, title: string, body: string) {
            const message = {
                notification: {title, body},
                token
            }
            return admin.messaging().send(message)
        }

        broadcastNotification(topic: string, title: string, body: string) {
            const message = {
                notification: {title, body},
                topic
            }
            return admin.messaging().send(message)
        }
    }
    ```