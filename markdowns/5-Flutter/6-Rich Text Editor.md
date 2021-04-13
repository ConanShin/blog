Rich Text Editor
===
###### tags: `Flutter`

- 기본 구조
    ![](https://i.imgur.com/NUT1vFd.png)

- Editor Field (Text Field 위젯)
    - code
        ```java=
        class EditorFieldWidget extends StatelessWidget {
          const EditorFieldWidget({Key key, this.type, this.controller, this.focusNode}) : super(key: key);

          final TextType type;                    // provider의 _types[row_index]
          final TextEditingController controller; // provider의 _texts[row_index]
          final FocusNode focusNode;              // provider의 _nodes[row_index]

          @override
          Widget build(BuildContext context) {
            return TextField(
                controller: controller,
                focusNode: focusNode, 
                autofocus: true,
                keyboardType: TextInputType.multiline,
                maxLines: null,
                cursorColor: Colors.teal,
                textAlign: type.align,
                decoration: InputDecoration(
                    border: InputBorder.none,
                    prefixText: type.prefix,
                    prefixStyle: type.textStyle,
                    isDense: true,
                    contentPadding: type.padding
                ),
                style: type.textStyle
            );
          }
        }
        ```
    - 중요한 property의 provider에서 제공한다.
      - TextType type: bold, quote, bullet point와 같은 text type 변수
      - TextEditingController controller: text에 리스너를 추가하여 text의 세부사항을 조절(provider 설명참조)
      - FocusNode focusNode: 현재 widget에 focusNode를 추가하여 focus를 강제로 할당
- Editor Toolbar (Toolbar 위젯)
    - code
        ```java=
        class EditorToolbarWidget extends StatelessWidget {
          const EditorToolbarWidget({Key key, this.onSelected, this.selectedType})
              : super(key: key);

          final double height = 56;
          final TextType selectedType;             // provider의 selectedType
          final ValueChanged<TextType> onSelected; // provider의 void setType

          @override
          Widget build(BuildContext context) {
            return PreferredSize(
              preferredSize: Size.fromHeight(height),
              child: Material(
                elevation: EDITOR_TOOLBAR,
                color: Colors.white,
                child: Row(children: <Widget>[
                  IconButton(
                    icon: Icon(CommunityMaterialIcons.format_size,
                        color: selectedType == TextType.H1
                            ? Theme.of(context).accentColor
                            : Theme.of(context).primaryColor),
                    onPressed: () => onSelected(TextType.H1)),
                  IconButton(
                    icon: Icon(CommunityMaterialIcons.format_quote_open,
                        color: selectedType == TextType.QUOTE
                            ? Theme.of(context).accentColor
                            : Theme.of(context).primaryColor),
                    onPressed: () => onSelected(TextType.QUOTE)),
                  IconButton(
                    icon: Icon(CommunityMaterialIcons.format_list_bulleted,
                        color: selectedType == TextType.BULLET
                            ? Theme.of(context).accentColor
                            : Theme.of(context).primaryColor),
                    onPressed: () => onSelected(TextType.BULLET)),
                  IconButton(
                      icon: Icon(CommunityMaterialIcons.keyboard_close,
                          color: Theme.of(context).primaryColor),
                      onPressed: () => FocusScope.of(context).unfocus())
                ])),
            );
          }
        }
        ```
    - 기본 구조는 특별할게 없는 IconButton을 4개 가지고 있는 Row widget이다.
      widget들간 Zindex가 꼬일것을 방지하기 위해 elevation에 대한 변수를 별도 공용 파일로 관리했다.
    - Toolbar의 메뉴에 따른 text 옵션은 enum으로 정의
      ```java=
        enum TextType { H1, T, QUOTE, BULLET }

        extension SphereTextStyle on TextType {
          TextStyle get textStyle {
            switch (this) {
              case TextType.QUOTE:
                return TextStyle(
                    fontSize: 12.0,
                    fontStyle: FontStyle.italic
                );
              case TextType.H1:
                return TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold);
                break;
              default:
                return TextStyle(fontSize: 12.0);
            }
          }

          EdgeInsets get padding {
            switch (this) {
              case TextType.H1:
                return EdgeInsets.fromLTRB(16, 24, 16, 8);
                break;
              case TextType.BULLET:
                return EdgeInsets.fromLTRB(24, 8, 16, 8);
              default:
                return EdgeInsets.fromLTRB(16, 8, 16, 8);
            }
          }

          TextAlign get align {
            switch (this) {
              case TextType.QUOTE:
                return TextAlign.center;
                break;
              default:
                return TextAlign.start;
            }
          }

          String get prefix {
            switch (this) {
              case TextType.BULLET:
                return '\u2219';
                break;
              default:
                return '';
            }
          }
        }
      ```
- Editor Widget (Provider와 위 2개의 Widget들을 연결해주는 역할)
    - 큰 틀의 위젯에는 3가지 part가 있다.
    - SafeArea
        ```java=
          Widget build(BuildContext context) {
            return SafeArea(
              child: Scaffold(
                  body: Stack(
                    children: <Widget>[
                      _textRows(),
                      if(_showToolbar) _toolbar()
                    ],
                  )),
            );
          }
        ```
        SafeArea에서는 cursor가 toolbar밑으로 감쳐지는 것을 방지하며
        keyboard 사용유무에 따라 toolbar도 함께 감추어줄지 판단하여 화면에 표시한다.
        <img src="https://i.imgur.com/teO4aXG.png" width="500px"/>
    - TextRows
        ```java=
        Widget _textRows() {
            return Positioned(
              top: 10, // 상단 여백
              left: 0,
              right: 0,
              bottom: EditorToolbarWidget().height,
              child: Consumer<EditorProvider>(
                  builder: (context, state, _) {
                    return ListView.builder(
                        itemCount: state.length,
                        itemBuilder: (context, index) {
                          return Focus(
                              onFocusChange: (hasFocus) {
                                if (hasFocus) state.setFocus(state.typeAt(index));
                              },
                              child: EditorFieldWidget(
                                type: state.typeAt(index),
                                controller: state.textAt(index),
                                focusNode: state.nodeAt(index),
                              )
                          );
                        }
                    );
                  }
              ),
            );
          }
        ```
        - Focus 위젯을 사용하여 몇번째 row(index)에 focus가 주어졌는지 판단하여
          provider에서 해당 노드가 선택하고 있었던 text type을 toolbar에 표시해준다.
        - EditorFieldWidget에 type, controller, focusNode를 provider와 연결해준다.
    - Toolbar
        ```java=
        Widget _toolbar() {
            return Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Selector<EditorProvider, TextType>(
                selector: (buildContext, state) => state.selectedType,
                builder: (context, selectedType, _) {
                  return EditorToolbarWidget(
                    selectedType: selectedType,
                    onSelected:
                    Provider.of<EditorProvider>(context, listen: false)
                        .setType,
                  );
                },
              ),
            );
        }
        ```
        - Toolbar에 선택된 메뉴가 무엇인지 provider에서 selectedType값을 받아 표시한다.
        - 메뉴를 선택했을때 provider의 setType함수가 호출될 수 있도록 연결해준다.
- Provider
    - State Management
        ```java=
        class EditorProvider extends ChangeNotifier {
          List<FocusNode> _nodes = []; // 각 row별 focusNode를 관리하는 리스트
          List<TextEditingController> _texts = []; // 각 row별 textController를 관리하는 리스트
          List<TextType> _types = []; // 각 row별 text style를 관리하는 리스트
          TextType selectedType; // 현재 toolbar에 선택된 메뉴

          EditorProvider({TextType defaultType = TextType.T}){
            selectedType = defaultType;
            insert(index: 0);
          }

          int get length => _texts.length;
          int get focus => _nodes.indexWhere((node) => node.hasFocus);
          FocusNode nodeAt(int index) => _nodes.elementAt(index);
          TextEditingController textAt(int index) => _texts.elementAt(index);
          TextType typeAt(int index) => _types.elementAt(index);

          // 현재 선택된 controller의 text type을 변경해주고 toolbar에 표시
          void setType(TextType type) {
            if (selectedType == type) {
              selectedType = TextType.T;
            } else {
              selectedType = type;
            }
            _types.removeAt(focus);
            _types.insert(focus, selectedType);
            notifyListeners();
          }

          void setFocus(TextType type) {
            selectedType = type;
            notifyListeners();
          }

          // 새로운 row를 삽입
          void insert({int index, String text, TextType type = TextType.T}) {
            _texts.insert(index, newController(index: index, text: text, type: type));
            _types.insert(index, type);
            _nodes.insert(index, FocusNode());
          }
        }
        ```
    - TextEditingController
        ```java=
        TextEditingController newController({int index, String text, TextType type = TextType.T}) {
            final String startingCharacter = '\u200B'; // 시작지점을 알기 위한 표시
            final TextEditingController controller = TextEditingController(text: startingCharacter + (text ?? ''));

            controller.addListener(() {
              // TextEditingController의 가장 앞에 cursor를 위치하게 되면 \u200B 캐릭터보다 앞에 놓이는 경우가 있음
              if (controller.value.selection.baseOffset == 0 && controller.text.length > 0) {
                textAt(_texts.indexOf(controller)).selection = TextSelection.fromPosition(TextPosition(offset: 1));
              }
              // 시작 케릭터가 사라졌을 경우 previous 컨트롤러에 텍스트를 이어 붙임
              if (!controller.text.startsWith(startingCharacter)) {
                final int selectedIndex = _texts.indexOf(controller);
                if (selectedIndex > 0) {
                  textAt(selectedIndex - 1).text += controller.text;
                  textAt(selectedIndex - 1).selection= TextSelection.fromPosition(TextPosition(
                      offset: textAt(selectedIndex - 1).text.length - controller.text.length
                  ));
                  nodeAt(selectedIndex - 1).requestFocus();
                  _texts.removeAt(selectedIndex);
                  _nodes.removeAt(selectedIndex);
                  _types.removeAt(selectedIndex);
                  notifyListeners();
                }
              }
              // 새로운 행 생성시 새로운 text controller를 삽입
              if(controller.text.contains('\n')) {
                final int selectedIndex = _texts.indexOf(controller);
                List<String> _split = controller.text.split('\n');
                controller.text = _split.first;
                insert(
                    index: selectedIndex + 1,
                    text: _split.last,
                    type: typeAt(selectedIndex) == TextType.BULLET
                        ? TextType.BULLET
                        : TextType.T
                );
                textAt(selectedIndex + 1).selection = TextSelection.fromPosition(
                    TextPosition(offset: 1)
                );
                nodeAt(selectedIndex + 1).requestFocus();
                notifyListeners();
              }
            });

            return controller;
      }
        ```