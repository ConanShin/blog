NestJS + Keycloak
===
###### tags: `nestjs`

1. Installation
    ```npm install -g nest```
2. Project Setup
    generate project
    ```nest create project_name```
    install dependency
    ```yarn add --dev nest-keycloak-connect```
    
4. Keycloak module import
    ```javascript=
    @Module({
    imports: [
        KeycloakConnectModule.register({
            authServerUrl: KEYCLOAK_SERVER_BASE_URL + '/auth',
            realm: REALM_NAME,
            clientId: CLIENT_ID,
            secret: CLIENT_SECRET
        })
    ]
    ```
5. Guards
    - Authorization header를 검증 (JWT토큰)
      401 Unauthorized를 return
    ```javascript=
    providers: [{
        provide: APP_GUARD,
        useClass: AuthGuard,
    }]
    ```
    - Role Guard
      Keycloak에 정의된 role에 따른 권한 검증 (ex. admin or user)
    ```javascript=
    providers: [{
      provide: APP_GUARD,
      useClass: RoleGuard,
    }]
    ```
    ```javascript=
    @Roles('user') // <-- client role
    getHello(): string {
        return this.appService.getHello();
    }
    @Roles('realm:user') // <-- realm role
    getHello(): string {
        return this.appService.getHello();
    }
    ```