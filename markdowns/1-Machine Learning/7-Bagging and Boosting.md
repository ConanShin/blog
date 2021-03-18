2021-03-02
===

###### tags: `유사도` `XG Boost` `Bagging`
- 중복 문항 체크
    - pd Series의 value_counts 함수
    ```python=
    temp_array = pd.Series([1, 1, 1, 2, 3, 4, 5])
    temp_array.value_counts()
    ```
    - result
    ```
    1    3
    5    1
    4    1
    3    1
    2    1
    ```
    
- Preprocessing
    - Box plot으로 데이터의 분포를 확인
    - Bar chart로 라벨 별 데이터 개수가 균등한지 확인
        - 라벨 별 데이터 균등하게 맞추기
        ```python=
        train_pos_data = train_data.loc[train_data['is_duplicate'] == 1]
        train_neg_data = train_data.loc[train_data['is_duplicate'] == 0]

        class_difference = len(train_neg_data) - len(train_pos_data)
        sample_frac = 1 - (class_difference / len(train_neg_data))

        train_neg_data = train_neg_data.sample(frac = sample_frac)
        ```
    - Character와 Word 단위로 문항을 나눠 그 길이로 box plot과 bar chart를 확인하는 행위는 무엇을 위함인가..?
    - 데이터의 보편적인 특징(물음표로 끝난다거나 대문자로 시작하는 것)은 데이터 전처리에서 제거하여 편향된 학습을 방지


- XG Boost (Tree Boosting)
    - 앙상블이란 여러개의 학습 알고리즘을 사용해 더 좋은 성능을 얻음
    - 앙상블에는 배깅과 부스팅이 존재
        - Bagging: 여러개의 학습 알고리즘, 모델을 통해 각각 결과를 예측 후 모든 결과를 동등하게 취합하여 최종 결과를 얻음
            ex: Random Forest
        - Boosting: 여러개의 학습 알고리즘, 모델의 결과를 순차적으로 취합, 잘못 예측한 부분에 가중치를 주어 재학습 진행
    - 여러개의 의사결정 트리를 사용하되 결과들의 평균을 사용하는게 아니라 오답에 대한 가중치를 주어 재학습 진행


    ```python=
    train_data = xgb.DMatrix(train_input.sum(axis=1), label=train_label) # 학습 데이터 읽어 오기
    eval_data = xgb.DMatrix(eval_input.sum(axis=1), label=eval_label) # 평가 데이터 읽어 오기

    data_list = [(train_data, 'train'), (eval_data, 'valid')]
    
    params = {} # 인자를 통해 XGB모델에 넣어 주자 
    params['objective'] = 'binary:logistic' # 로지스틱 예측을 통해서 
    params['eval_metric'] = 'rmse' # root mean square error를 사용  

    bst = xgb.train(params, train_data, num_boost_round = 1000, evals = data_list, early_stopping_rounds=10)
    ``` 
    
    - Bagging은 Train Data Set을 n개로 나누어 n개의 트리(모델)에 각각 학습을 시킨 후
      Evaluate Data Set으로 n개의 모델을 평가하는데 그 중 가장 평가 결과가 우수한 트리(모델)의 결과를 최종 결과로 사용
    - XG Boosting은 Train Data Set을 n개의 트리(모델)에 학습 시킨 후
      Evaluate Data Set으로 n개의 모델을 평가하는데 평가 과정 중 오답인 데이터를 Train Data Set에 포함되도록 중요도를 조절하여 다음 학습 차례 때 해당 오답처리 되었던 데이터에 대해 정답이 될 수 있도록 학습을 진행