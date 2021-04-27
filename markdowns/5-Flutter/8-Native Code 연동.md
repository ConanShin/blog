Platform Specific Code
===

###### tags: `Flutter`
<img src="https://i.imgur.com/sfvIQbN.png" width="500px"/>

- Flutter 개발을 하다보면 iOS나 Android native 코드를 작성해야 하는 경우가 발생한다.
  이러한 경우 문제를 해결하는 방법은 찾아보았고 3가지 방법을 확인할 수 있었다.
  1. Android는 AAR을 ios는 Library을 각각 만들어 flutter project에 plugin형식으로 import 한다.
  2. Method Channel(not typesafe)를 이용하여 각 native 코드와 integrate한다.
  3. Pigeon(typesafe)을 이용하여 navtive 코드와 integrate한다.

- AAR과 Library 각각 생성해서 flutter에 plugin으로 붙이는 과정은 복잡하고 stackoverflow에서 여러 시행착오와 어려움을 호소하는 사람들이 많이 보였다. 그래서 flutter에서 제공하는 MethodChannel을 이용했는데 이 방식은 flutter에서 변수를 넘겨줄때 native코드에서 해당 변수를 다른 타입으로 받거나 이상하게 사용하면 runtime시 오류가 발생하는 문제가 있었다.

- Runtime이 아닌 Compile 과정에서 type check를 통해 불안정한 서비스 제공을 막아주는 typesafe한 코드를 작성하고 싶었기에 Method Channel말고 [Pigeon](https://pub.dev/packages/pigeon)을 사용해 보기로 했다.
- 현재 pigeon은 iOS는 Objective C로만 제공이 되고 Android는 Java로만 제공이 되는 제약사항이 있었지만 추후에 Swift나 Kotlin 코드 작성이 불가피해지면 bridge로 해결하고자 한다.

- 먼저 pigeon을 설치하는데 필자는 ^0.2.1버전을 설치하였으니 참고바란다.
    ```yml=
    dev_dependencies:
        pigeon: ^0.2.1
    ```
- 간단한 pigeon 템플릿 코드를 작성한다
    ```java=
    import 'package:pigeon/pigeon.dart';

    class SearchRequest {
      String query; // native에 넘겨줄 리퀘스트 파라미터
    }

    class SearchReply {
      String result; // native에서 받을 결과 파라미터
    }

    @HostApi()
    abstract class Api {
      SearchReply search(SearchRequest request);
    }
    ```
- Pigeon command를 통해 iOS와 Android를 위한 pigeon 클래스틑 생성해 준다.
    ```shell=
    flutter pub run --no-sound-null-safety pigeon \
      --input pigeons/message.dart \
      --dart_out lib/pigeon.dart \
      --objc_header_out ios/Runner/pigeon.h \
      --objc_source_out ios/Runner/pigeon.m \
      --java_out ./android/app/src/main/java/com/conanshin/test_project/Pigeon.java \
      --java_package "com.conanshin.test_project"
    ```
    위 명령을 통해 Android와 iOS폴더 하위에 각각 pigeon 클래스가 생성된것을 확인할 수 있는데 간혹 iOS workspace에서는 Android Studio의 Flutter 프로젝트에서 추가된 파일들을 인식하지 못하는 경우가 발생한다.
    이를 확인하기 위해서는 iOS workspace를 xcode에서 열람하여 pigeon.m과 pigeon.h 파일이 각각 위치하고 있는지를 확인해주면 되고 없을시에는 메뉴얼로 추가해주도록 한다.
    
- Android (MainActivity.java)
    ```java=
    public class MainActivity extends FlutterActivity {
        private static class MyApi implements Pigeon.Api {
            @Override
            public Pigeon.SearchReply search(Pigeon.SearchRequest request) {
                Pigeon.SearchReply reply = new Pigeon.SearchReply();
                reply.setResult(String.format("Hi %s!", request.getQuery()));
                return reply;
            }
        }

        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            Pigeon.Api.setup(Objects.requireNonNull(getFlutterEngine()).getDartExecutor().getBinaryMessenger(), new MyApi());
        }
    }
    ```
- iOS (AppDelegate.m)
    ```objective-c=
    @implementation AppDelegate

    - (BOOL)application:(UIApplication *)application
        didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
      [GeneratedPluginRegistrant registerWithRegistry:self];
      // Override point for customization after application launch.
      FlutterViewController* controller =
          (FlutterViewController*)self.window.rootViewController;
      ApiSetup(controller.binaryMessenger, self);
      return [super application:application didFinishLaunchingWithOptions:launchOptions];
    }

    -(SearchReply *)search:(SearchRequest*)input error:(FlutterError **)error {
        SearchReply* result = [[SearchReply alloc] init];
        result.result  = [NSString stringWithFormat:@"%s%@","Hi ",input.query];
        return result;
    }

    @end
    ```
- Dart
    ```dart=
    SearchRequest()..query = "Conan";
    Api api = Api();
    SearchReply reply = await api.search(request);
    print("###### ${reply.result}");
    // flutter: ###### Hi Conan
    ```