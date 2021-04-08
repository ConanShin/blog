iOS앱 배포하기
===
- Apple은 Apple의 Device에 Apple이 허락한 사람만 Apple이 허락한 Software를 설치할 수 있도록 제한하고 있다.
- Certificates (Apple이 허락한 사람)
    - .certSigningRequest 파일 생성
      ![](https://i.imgur.com/QtXkx73.png =800x)
    - Apple Developer Program에서 certificate 생성 (위 파일 사용)
      ![](https://i.imgur.com/Q9MuLWr.png =200x)
- Device (Apple이 허락한 Device)
    - Device의 Identifier 확인
      ![](https://i.imgur.com/VCRaNFJ.png =300x)
    - Apple Developer Program에서 Device 등록 (위 정보 사용)
      ![](https://i.imgur.com/v2irIVF.png =200x)
- Identifier (Apple이 허락한 Application)
    - Bundle ID 확인
      ![](https://i.imgur.com/qBdUyDD.png =600x)
    - Apple Developer Program에서 Identifier 생성 (위 정보 사용)
      ![](https://i.imgur.com/hkGrZMi.png =200x)
      ![](https://i.imgur.com/M09bSlZ.png =600x)
- Profile (Certificate, Device, Identifier를 하나의 정보로 그룹)
    - 위에서 생성했던 정보들을 선택하고 최종단계에 가면 Provisioning Profile을 다운받을 수 있다.
    - Xcode의 Preference > Accounts에서 Download Manual Profiles를 클릭
      ![](https://i.imgur.com/HwY46ks.png)
    - Targets의 Signing & Capabilities에서 Automatically manage signing 클릭
      ![](https://i.imgur.com/ciD8uiS.png)


