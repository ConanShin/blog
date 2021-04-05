FCM 연동
===

- Firebase Setup
  https://conanshin.github.io/blog/99-ETC/FCM.html
- Flutter Setup
    - pubspec.yml
    ```yml
    firebase_messaging: ^7.0.3
    firebase_core: ^0.5.0+1
    ```
    - main.dart
    ```dart=
    import 'package:has_office_app/push.manger.dart';
    
    PushManager().registerToken();
    PushManager().listenFirebaseMessaging();
    ```
    - push.manager.dart
    ```dart=
    import 'package:firebase_messaging/firebase_messaging.dart';
    import 'dart:io';

    class PushManager {
      static final PushManager _manager = PushManager._internal();
      final _firebaseMessaging = FirebaseMessaging();

      factory PushManager() => _manager;

      PushManager._internal();

      void _requestIOSPermission() {
        _firebaseMessaging.requestNotificationPermissions(IosNotificationSettings(sound: true, badge: true, alert: true));

        _firebaseMessaging.onIosSettingsRegistered.listen((IosNotificationSettings settings) {
          print("Settings registered: $settings");
        });
      }

      void registerToken() {
        if (Platform.isIOS) _requestIOSPermission();

        _firebaseMessaging.getToken().then((token) {
          print('token: ' + token);
        });
      }

      void listenFirebaseMessaging() {
        _firebaseMessaging.configure(
          onMessage: (Map<String, dynamic> message) async {
            // Triggered if a message is received whilst the app is in foreground
            print('on message $message');
          },
          onResume: (Map<String, dynamic> message) async {
            // Triggered if a message is received whilst the app is in background
            print('on resume $message');
          },
          onLaunch: (Map<String, dynamic> message) async {
            // Triggered if a message is received if the app was terminated
            print('on launch $message');
          },
        );
      }
    }
    ```
- Token firebase에 등록
    - 앱 실행시키면 terminal에 token이 표시됨
      ![](https://i.imgur.com/nmtBkvM.png)
    - 위 토큰값을 firebase에 cloud message test시 token값으로 사용
      cloud message > 새 알림(신규시 skip) > 테스트 메시지 전송
      ![](https://i.imgur.com/Co9CdCi.png)

    