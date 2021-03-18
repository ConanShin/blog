2021-02-16
===

###### tags: `RNN` `LSTM` `CNN`

https://mingrammer.com/understanding-the-asterisk-of-python/

LSTM의 output은 hidden state과 같은거?
RNN의 output은 hidden state과 다른거?
### RNN

![](https://i.imgur.com/go68Xut.png)
**노드 =  메모리 셀 = RNN 셀** :  은닉층에서 활성화 함수를 통해 결과를 내보내는 역할을 하는 노드
 바로 이전 시점에서의 은닉층의 메모리 셀에서 나온 값을 자신의 입력으로 사용
**은닉 상태(hidden state)** : 메모리 셀이 출력층 방향으로 또는 다음 시점 t+1의 자신에게 보내는 값

![](https://i.imgur.com/Gn6inQ6.png =200x)

**Wx** : 입력층에서 입력값을 위한 가중치
**Wh**  : 이전 시점 t-1의 은닉 상태값인 ht−1을 위한 가중치 
은닉층 : ht=tanh(Wxxt+Whht−1+b)
출력층 : yt=f(Wyht+b)

![](https://i.imgur.com/FTwMYxE.png)

**각각의 가중치 Wx, Wh, Wy의 값은 모든 시점에서 값을 동일하게 공유**

출처 : https://wikidocs.net/22886


### LSTM vs RNN
RNN은 초기에 들어온 information이 문장이 길어질수록 vanish되는 현상이 있다.
LSTM은 Cell state 사용하여 위 현상을 막아준다.

hidden state값을 그대로 output으로 사용할 수도 있지만 hidden에 별도 공식을 추가하여 output으로 사용을 할 수도 있다.

### CNN
Yoon Kim(2014) http://emnlp2014.org/papers/pdf/EMNLP2014181.pdf
- CNN 레이어 1개만 사용해도 괜찮은 성능을 보여줌
- 모델 모형 참조