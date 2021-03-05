Kudu Deployment
===

###### tags: `azure`

- Azure App Service 배포 셋팅
    1. 배포 센터(왼쪽 메뉴) > 설정(상단 메뉴) > git clone URI 복사
        ![](https://i.imgur.com/96JuJBI.png)   
    2. git remote에 azure repository 등록
        ```shell=
        git remote add azure ${uri}
        ```
    3. deploy
        ```shell=
        git push --force azure HEAD:master
        ```
        ![](https://i.imgur.com/1ipqh8n.png)

- Azure App Service로 kudu를 통해 배포할때 아래와 같은 에러가 발생할 수 있다.
    ```shell=
    error: RPC failed; HTTP 400 curl 22 The requested URL returned error: 400
    fatal: the remote end hung up unexpectedly
    fatal: the remote end hung up unexpectedly
    ```
    Azure Service Plan의 storage가 꽉차서 나는 오류인데 ([reference](https://github.com/microsoft/vscode-azureappservice/issues/1445))
    ![](https://i.imgur.com/INDPuph.png)
    위 사진 처럼 그 전에 배포했던 것이 마무리 되지 않아 storage를 잡아 먹고 있는 것을 확인할 수 있다.
- 해결책
    1. Storage가 여유가 생길때까지 기다리던지 Service Plan사이즈를 키워준다.
    2. Git 연결을 끊고 다시 맺는다.