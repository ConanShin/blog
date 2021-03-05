App Service Warmer
===

```bash
*/15 * * * * /usr/bin/curl -s ${backend server url} -w "\n" >> ${log file path}
```

- Azure App Service는 20분의 idle시간 이후 리소스를 다른 프로세스로 뺏기기 때문에 해당 서버를 Keep Warm시키기 위해 15분마다 http 호출을 해준다.
- curl에 대한 로그를 로그파일에 쌓는 방법은 위 처럼 >> 명령으로 새로운 로그를 append 시켜주며 새로 append된 로그는 "\n" 캐릭터로 new line에 작성되도록 한다.