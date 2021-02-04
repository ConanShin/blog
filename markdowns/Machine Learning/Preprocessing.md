2021-02-04
===

###### tags: `전처리` `preprocessing`

#### 1. 불용어 제거
``` python
def preprocessing( review, remove_stopwords = False ): 
    # 불용어 제거는 옵션으로 선택 가능하다.
    
    # 1. HTML 태그 제거
    review_text = BeautifulSoup(review, "html5lib").get_text()	

    # 2. 영어가 아닌 특수문자들을 공백(" ")으로 바꾸기
    review_text = re.sub("[^a-zA-Z]", " ", review_text)

    # 3. 대문자들을 소문자로 바꾸고 공백단위로 텍스트들 나눠서 리스트로 만든다.
    words = review_text.lower().split()

    if remove_stopwords: 
        # 4. 불용어들을 제거
    
        #영어에 관련된 불용어 불러오기
        stops = set(stopwords.words("english"))
        # 불용어가 아닌 단어들로 이루어진 새로운 리스트 생성
        words = [w for w in words if not w in stops]
        # 5. 단어 리스트를 공백을 넣어서 하나의 글로 합친다.	
        clean_review = ' '.join(words)

    else: # 불용어 제거하지 않을 때
        clean_review = ' '.join(words)

    return clean_review
```

#### 2. 단어를 단어사전을 사용해서 인덱스로 벡터화
``` python
tokenizer = Tokenizer()
tokenizer.fit_on_texts(clean_train_reviews)
text_sequences = tokenizer.texts_to_sequences(clean_train_reviews)
```
#### 3. 문장 길이 동기화
``` python
word_vocab = tokenizer.word_index
word_vocab["<PAD>"] = 0

data_configs = {}
data_configs['vocab'] = word_vocab
data_configs['vocab_size'] = len(word_vocab)

MAX_SEQUENCE_LENGTH = 174 
train_inputs = pad_sequences(text_sequences, maxlen=MAX_SEQUENCE_LENGTH, padding='post')
```
* Median 산출
* 중간값에 맞추어 문장 길이 변환
* 긴 문장은 후반부 생략
* 짧은 문장은 패딩으로 채우기 
#### 4. 전처리 후 데이터 저장
    
#### 불용어 제거해서 히스토그램 찍어보기
``` python
word_size = [len(r.split()) for r in clean_train_reviews]
np.median(word_size)

import matplotlib.pyplot as plt
plt.figure(figsize=(15,10))
plt.hist(word_size, bins=50, facecolor='r', label='train')
```
![](https://i.imgur.com/TIsvbgs.png)

---

###### tags: `모델링` `modeling`


word index ? tf-idf? 둘 중 뭐써야함?

### Tf-IDF Vectorizer
:question: 왜 analyzer = 'char'로 주지..? 왜 'word'로 준거랑 차이가 없지..? SHIIITTT!!

#### TEST
* analyzer="char" & ngram_range=(1,2): 0.782800
* analyzer="char" & ngram_range=(1,3): 0.859800
* analyzer="char" & ngram_range=(1,7): 0.850800
* analyzer="word" & ngram_range=(1,2): 0.887600

`vectorizer = TfidfVectorizer(min_df = 0.0, analyzer="char", sublinear_tf=True, ngram_range=(1,3), max_features=5000) 
`


TfidfVectorizer 파라미터 정리
* min-df : 설정한 값 이상 등장하는 단어만 등록, 단어의 등장횟수가 아니라 문서의 수
* analyzer : 단어 단위로 볼지 문장 단위로 볼지
* ngram_range : 문자 혹은 단어의 묶음을 처리하는 범위, 단어를 기준으로 하고 (1, 1)로 놓았을 경우 벡터라이저와 같은 결과를 보임(단어 하나씩만 처리하기 때문) (1,2)로 놓았을 경우 go, go to 등이 개별 단어로 처리된다. 묶여야 의미가 살아나는 표현들을 처리하기 위한 파리미터
* max_feature : 각 벡터의 최대 길이를 처리
* sublinear_tf : 단어의 빈도 수에 대한 스무딩 여부, 로그값으로 변환해 값을 완만하게 처리
``` python
import numpy as np 
def sublinear_func(input): 
    result = 1 + np.log(input) 
    return result
```