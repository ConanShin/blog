Chapter 2. Widget 개념
===
###### tags: `Flutter` `Stateless Widget` `Stateful Widget`

- Build 함수가 실행될때 화면에 UI component가 Rendering 됨
- MaterialApp과 Scaffold를 활용하여 구조를 잡음
    - MaterialApp: https://api.flutter.dev/flutter/material/MaterialApp-class.html
    - Scaffold: https://api.flutter.dev/flutter/material/Scaffold-class.html
- Stateful Widget:
    - setState함수를 이용하여 stateful 컴포넌트에 존재하는 state 변수를 수정하고 rerender 진행
- Stateless Widget:
    - 순수 UI 목적을 가진 컴포넌트로 변동하는 state를 내포할 수 없음