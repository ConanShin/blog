Free Cloud Storage
===

- 저렴한 DB 비교
    - Constraints
        - Azure, AWS, Google의 Free tier는 제외했다. (필자는 1년 무료 기간이 전부 만료된 상태)
        - 서울 혹은 아시아 리전 기준이다.
        - 가장 저렴한것을 기준으로 별도 백업과 같은 서비스 제공은 고려하지 않았다.
    - Azure SQL DB vs AWS Dynamo DB vs Google Firestore
        - Azure SQL DB
          ![](https://i.imgur.com/xT4pmXd.png)
          별도 무료 스토리지 제공은 없지만 1기가당 가격이 저렴하며 읽기/쓰기 요청에 대한 요금이 없다.

        - AWS Dynamo DB
          ![](https://i.imgur.com/j0wWA8N.png)
          25기가까지 스토리지 비용이 무료이지만 읽기/쓰기 요청에 대한 과금이 있다.

        - Google Firestore
          ![](https://i.imgur.com/qif8uds.png)
          1기가의 적은 스토리지만 무료로 제공되며 읽기/쓰기에 대한 일일 무료 할당량이 존재한다.
- 저렴한 File Storage 비교
    - Azure Blob Storage vs AWS S3 vs Google 
        - Azure Blob Storage
          ![](https://i.imgur.com/mzJe3fE.png)
          ![](https://i.imgur.com/fKefyLo.png)
        - AWS S3
          ![](https://i.imgur.com/VrElTuB.png)
          ![](https://i.imgur.com/C7lgVqU.png)
        - Google Cloud Storage
          ![](https://i.imgur.com/TKaZDeF.png)
      

- Conclusion
    - DB: 개발 서버 및 사용량이 적은 환경이면 Firestore가 적합하며 스토리지가 25기가 정도 필요하다 싶으면 AWS를 그것을 초과하면 Azure를 사용하면 될것 같다.
    - File Storage: 금액은 대동소이하다. Google은 무료사용 용량을 제공하지만 다른 storage보다 조금 비싸며 Azure와 AWS중에는 Azure가 조금 더 저렴하다.