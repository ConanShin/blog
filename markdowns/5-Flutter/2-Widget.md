Chapter 2. Widget
===
###### tags: `Flutter` `Stateless Widget` `Stateful Widget`

- Flutter Widget이란
    - App bar, text, icon, button 등 화면을 구성하는 컴포넌트 단위
    ![](https://i.imgur.com/Sb7DlQE.png)

    - Layer 및 위치를 담당
    ![](https://i.imgur.com/vCN0IF9.png)

    - Application 전체도 하나의 위젯

- LifeCycle
    ![](https://i.imgur.com/llH7dRF.png)
    - https://mobikul.com/lifecycle-of-a-flutter-app/
    
- 기본 구조
    - Application -> MaterialApp -> Page -> Scaffold
    ![](https://i.imgur.com/RQwhPsq.png)
    - MaterialApp: https://api.flutter.dev/flutter/material/MaterialApp-class.html
    - Scaffold: https://api.flutter.dev/flutter/material/Scaffold-class.html

- Widget 종류
    - Stateful Widget:
        - 계속 움직이며 변화가 생길 수 있는 동적인 위젯 
        - setState함수를 이용하여 stateful 컴포넌트에 존재하는 state 변수를 수정하고 rerender 진행
        ```java
        class HomePage extends StatefulWidget {
          _HomePageState createState() => new _HomePageState();
        }
        class _HomePageState extends State<HomePage> {
          @override
          void initState() {
            super.initState();
          }

          @override
          Widget build(context) {
            return Center(
            );
          }
        }
        ```
    - Stateless Widget:
        - 변화가 없는 정적인 위젯
        - 순수 UI 목적을 가진 컴포넌트로 변동하는 state를 내포할 수 없음
        ```java
        class UserPage extends StatelessWidget {
          @override
          Widget build(context) {
            return Center(
            );
          }
        }
        ```
        