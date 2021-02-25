2021-02-23
===

###### tags: `preprocessing` `한글`

- 한글 형태소 분석기
Komoran 추천추천 강추천

- 임의 텍스트를 sequence 벡터로 표현
```python
!pip install konlpy

from keras.preprocessing.text import text_to_word_sequence
from konlpy.tag import Okt
import json
import re

def preprocessing(review):
    okt = Okt()
    stop_words = set(['은', '는', '이', '가', '하', '아', '것', '들','의', '있', '되', '수', '보', '주', '등', '한'])
    
    review_text = re.sub("[^가-힣ㄱ-ㅎㅏ-ㅣ\\s]", "", review)
    word_review = okt.morphs(review_text, stem=True)
    word_review = [token for token in word_review if not token in stop_words]    
    return word_review

def to_sequence(text, word_index):
    tokens = preprocessing(text)
    print(tokens)
    return [word_index.get(w) for w in tokens if w in word_index]



with open('/content/drive/MyDrive/SKT/Machine Learning Learning/data_in_4.2.2/data_configs.json') as json_file:
    json_data = json.load(json_file)
    word_index = json_data['vocab']
    print(json_data['vocab'])

    sequence = to_sequence('영화를 겁나 재밌게 봤어요', word_index)
    print(sequence)

```

- Sequence를 Model로 predict
```python
from tensorflow.keras.preprocessing.sequence import pad_sequences
input = '영화 겁나 재미없다'
print('input: ' + input)
sequence = to_sequence(input, word_index)
sequence = [sequence]
model.predict(pad_sequences(sequence, 8))
```

- Result
```
input: 영화 겁나 재미없다
['영화', '겁나다', '재미없다']
array([[0.00208169]], dtype=float32)

0.00208169 -> 0(부정)과 가까운 값
```
```
input: 영화 겁나 재밌다
['영화', '겁나다', '재밌다']
array([[0.99173295]], dtype=float32)

0.99173295 -> 1(긍정)과 가까운 값
```