2021-02-09
===
###### tags: `Embedding` `Categorizing`

### Gensim Word2Vec
:question:  word2vec이면 `cbow` or  `skip-gram`일텐데 둘 중 뭘로 하려나?
:a: word2vec의 패러미터에 따라 모드를 선택할 수 있음. 1: skip-gram; otherwise CBOW [document](https://radimrehurek.com/gensim/models/word2vec.html#gensim.models.word2vec.Word2Vec)

:question: Word2Vec Downsampling은 어떻게 이루어지나
0.001일 경우 1000번 나오는걸 한번만 학습? 1000번 이상 나오면 그이후로는 학습을 하지 않는다?
얼마나 자주 나온 단어를, 얼만큼 샘플링하여 학습하는거징?

### RandomForest
n개의 의사결정 트리를 통해 문장을 분류하는 기법
패러미터
* n_estimators: 몇 개의 트리를 만들 것인지. 나중에 이 트리들의 결과값을 앙상블하여 최종 결과를 만듬
* max_depth: 각 tree의 최대 깊이. 디폴트일 경우 각 leaf가 pure하거나 min_samples_split개보다 적게 가지고 있을 때까지 확장됨.
* max_samples: train데이터에서 학습에 사용할 샘플 데이터 갯수

### Vectorizer
* CountVectorizer: word index에서 각 단어별 빈도 수를 count
* TfIdf: 문장에서 단어의 중요도를 기반
* Word2Vec: CBow / Skip-Gram 알고리즘으로 단어끼리 유사도를 기반

### Categorizer
* Linear Regression
* Random Forest
* KNN
* K-Means