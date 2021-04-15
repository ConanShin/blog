Build Context란?
===
###### tags: `Flutter`

### 정의
Build Context는 말 그대로 어떠한 위젯이 만들어(build)질 때 생성되는 context이며,
여기서 context는 트리구조의 Widget 집합에서 특정 위젯의 위치를 나타낸다.
위치라고 했지만 실제 해당 위젯의 속성을 내포하고 있는 객체다.

### Navigator에서의 Context
우리는 앱을 만드는데 있어 여러개의 navigator를 사용하는 환경을 경험해 봤을 것이다.
하단에 Global Navigation 메뉴 A, B, C, D가 있다고 가정해보자.
그럼 각각 메뉴는 자신만의 navigator를 내포하고 있을 수 있는데,
메뉴 안에서 Navigator.of(context).pushNamed('myRoute')라는 함수를 호출하게 된다면
context는 자신이 속해있는 트리구조에서 가장 가까운 부모의 NavigatorState찾아 myRoute를 푸쉬하게 되며,
여기서는 Global Navigation메뉴의 context가 아닌 A, B, C, D메뉴 중 하나의 context가 될 것이다.
반대로 만약 Global Navigation메뉴의 context를 인자로 넘겨 준다면 가장 최상단에 위치한
부모의 context를 이용해 global navigation 이동도 가능하니 알아두자.
:::warning
<img src="https://i.imgur.com/bWOE3et.png" width="300px"/> \
meeting_view의 context로 navigator pop했을때는 가장 가까운 nav_b를 사용하게 되니
정상적으로 meeting_view에서 office_view로 이동했고,
main_view의 build context를 meeting_view에 넘겨주어 main_view의 context로
pop했을 때는 nav_a(가장 가까운 navigator)를 사용하게 되니
meeting_view에서 검은 화면(정상적으로 main_view가 pop됨)으로 이동됬다.
:::

### .of(context) 함수
위 Navigator에서 설명한 것과 같이 .of함수는 context가 속해있는 위젯 트리에서
가장 가까운 부모중 해당 위젯(Navigator)을 찾게 된다.
이는 Navigator뿐만 아니라 Scaffold, Material 등 다양한 위젯에서 .of함수를 사용했을 때 동일하게 적용된다.

### Builder 위젯
```java=
// Widget Parent

@override
Widget build(BuildContext context) {
return new Scaffold(
    appBar: new AppBar(
      title: new Text(widget.title),
    ),
    body: new Container(),
    floatingActionButton: new FloatingActionButton(onPressed: () {
      Scaffold.of(context).showSnackBar( // <-- 이 부분에서 오류발생
            new SnackBar(
              content: new Text('SnackBar'),
            ),
          );
    }));
}
```
위 예제에서 우리는 scaffold안에 snackbar를 표시해 주고 싶다.
하지만 위 예제는 정상 작동하지 않을 것인데 그 이유는 바로 context에 있다.
저기서 context가 가르키고 있는 위젯은 Scaffold가 아닌 Parent Widget이다.
Parent Widget의 상위에 Scaffold가 존재하면 해당 위젯을 찾아오겠지만 그렇지 않을 경우
null을 리턴하게 되며 에러가 발생한다.
이를 해결하는 방법은 간단하다. Builder 위젯을 사용해 주면 되는데 예시는 아래와 같다.
```java=
@override
Widget build(BuildContext context) {
return new Scaffold(
    appBar: new AppBar(
    title: new Text(widget.title),
    ),
    body: new Container(),
    floatingActionButton: new Builder(builder: (context) { // <-- 이 부분
    return new FloatingActionButton(onPressed: () {
      Scaffold.of(context).showSnackBar(
            new SnackBar(
              backgroundColor: Colors.blue,
              content: new Text('SnackBar'),
            ),
          );
    });
    }));
}
```
위 처럼 Builder위젯을 선언해 주면 context를 받을 수 있는데
해당 context를 기점으로 Scaffold.of(context)를 호출 하면 가장 가까운 부모 중 Scaffold가 존재하기 때문에
정상적으로 해당 Scaffold에 snackbar를 띄워줄 수 있게된다.

### BuildContext class 내부
- debugDoingBuild: 위젯이 변경사항이 update되고 있는지 확인할 수 있는 boolean
- hashCode: 현재 build context 오브젝트의 고유 hash
- owner: 위젯의 구조 변경을 담당
- runtimeType: 런타임에서 해당 오브젝트가 어떤 primitive 타입을 가지고 있는지 식별
- size: 렌더링된 위젯의 사이즈
- widget: 해당 build context의 위젯
