2021-01-22
===
###### tags: `Convolution` `Dialation`

#### dropout
과적합 방지를 위한 정규화 방법, rate 파라미터의 비율만큼 dropout이 적용된다.

#### convolution(합성곱 연산)
![](https://i.imgur.com/Yf0pUmr.png)

#### dialation_rate
![](https://qph.fs.quoracdn.net/main-qimg-d9025e88d7d792e26f4040b767b25819)
- 주변 픽셀의 Contextual Information을 고려하기 위함
- kernel size(receptive field)를 늘려서 주변 픽셀을 고려하기 되면 연산 복잡도가 증가됨
- 0 padding을 통해 연산 복잡도는 줄이고 주변을 고려할 수 있는 convolution layer를 생성

#### strides
필터가 적용되는 위치의 간격

#### receptive field
kernel_size = output을 만들어내는 영역

downsampling/upsampling: 데이터의 차원을 변경시켜 이미지를 압축하거나 늘리는 방식

pooling/unpooling
- pooling: 가로 세로 방향의 공간을 줄이는 연산, 에를 들어 최대 풀링 2X2의 경우 2X2 사이즈 내에서 최값을 뽑아낸다. 
- unpooling: 풀링의 반대, 같은 값으로 채우거나 0으로 채우는 등 여러 방법이 있다.
 
data format:
- batch: 몇장의 사진을 이번 트레이닝에 input으로 사용할 것인가
- channel: 사진은 RGB로 3개의 채널을 가짐 (데이터의 속성 갯수)

padding='same' : input size와 같도록 맞춰준다 

conv1D
- :exclamation:우리가 헷갈렸던 부분 : 1D짜리 convolution을 적용한다고 생각했는데 (filter size가 1 * n 이라 생각했는데)
- 실제 : convolution 방향이 1D였던 것(가로 방향으로만 convolution하도록 filter size가 자동으로 정해짐) 

```python=
inputs = tf.keras.Input(shape = (1, 28, 28)) # (1)
dropout = tf.keras.layers.Dropout(rate=0.2)(inputs)
conv = tf.keras.layers.Conv1D(10, 3, padding='same', activation=tf.nn.relu)(inputs) # (2)
```
1. input size는 28*28
2. input이 1D convolution을 통과하여 (28-2)*1 이 되고,  padding='same' 옵션을 주었으니 input size와 같아지도록 padding을 추가하여 28*1이 됨. 채널 10이므로 28 * 1 * 10

