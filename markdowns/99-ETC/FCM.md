Firebase Cloud Messaging
===

1. 프로젝트 패키지 확인 (텍스트 문서에 저장해 두기)
    - Android는 Application 레벨의 build.gradle파일 확인
    ```java
    defaultConfig {
        applicationId "project.package.name" // <-- 이 부분
        minSdkVersion 26
        targetSdkVersion 28
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }
    ```
    - iOS는 Targets > Signing & Capabilities 부분 확인
    ![](https://i.imgur.com/mxovb34.png)

2. Firebase project 생성 (특별할 것 없으니 생략)
3. Firebase Application 추가
    - 기호에 맞게 iOS나 Android를 추가
    ![](https://i.imgur.com/6o8Mq7F.png)
    - 1번에서 기억해둔 패키지 이름을 여기에 입력
    ![](https://i.imgur.com/Vl0awxV.png)
    - 구성파일 다운로드
      iOS는 .plist파일 Android는 .json파일
      Android (주의: Android레벨이 아닌 Application레벨)
      ![](https://i.imgur.com/3UDhtOa.png)
      iOS (info.plist가 있는 부분에 추가)
      ![](https://i.imgur.com/d7QV4Pz.png)
4. iOS APN추가 (Android는 skip)
    - Apple Developer 사이트 회원가입 및 TEAM ID 발급(유료)
      https://developer.apple.com/account
      ![](https://i.imgur.com/xZeYbni.png)
    - Identifier, Certificate, Key 생성
      Certificates, IDs & Profiles 메뉴
        - Identifier
            ![](https://i.imgur.com/rCB0aYl.png)
        - Certificate
            Mac PC의 cert파일 발급
            ![](https://i.imgur.com/QtXkx73.png)
            Cert파일 등록 및 aps.cer파일 다운
            ![](https://i.imgur.com/zlqyyhj.png)
        - Key
            ![](https://i.imgur.com/L9kBj4d.png)
    - APN Key를 Firebase에 업로드
        위에서 다운받은 .p8파일 업로드시 ID는 파일명에 명시되어 있음
        - ![](https://i.imgur.com/LQRRk6y.png)
5. Project setup(iOS는 skip)
    - Android 레벨에 build.gradle에 dependency 추가
    ```java
    dependencies {
        classpath 'com.android.tools.build:gradle:3.5.0'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        classpath 'com.google.gms:google-services:4.3.5' // <-- 이 부분
    }
    ```
    - Application 레벨에 build.gradle에 plugin 추가
    ```java
    apply plugin: 'com.google.gms.google-services'
    ```
