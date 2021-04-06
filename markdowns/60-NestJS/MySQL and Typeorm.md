NestJS + typeorm + mysql
===
###### tags: `nestjs`

1. installation
    ```npm install --save-dev @nestjs/typeorm typeorm mysql2```
    
2. setup
    - module
        ```javascript=
        const mysqlInstance = TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'localhost',
            password: 'password',
            database: 'database_name',
            entities: [User, Device],
            synchronize: true,
        })

        @Module({
            imports: [mysqlInstance, TypeOrmModule.forFeature([User, Device])],
            controllers: [DeviceController],
            providers: [UserService, DeviceService],
            exports: [UserService, DeviceService],
        })
        export class MysqlModule {
        }
        ```
        - synchronize option은 현존하는 Schema의 Database와 데이터를 동기화 시켜주는 옵션인데 해당 Database를 다른 instance에서도 사용하고 있다면 데이터가 날아갈 수 있으니 사용에 주의할 것

    - entity
        ```javascript=
        import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

        @Entity({name: 'user'})
        export class User {
            @PrimaryGeneratedColumn()
            id: number

            @Column()
            user_id: string
        }
        ```
        - PrimartGeneratedColumn은 1씩 increment하는 auto generate column을 만들어준다
        - Entity({name}) 값을 주면 특정 테이블과 맵핑하게 된다
    
    - service & repository
        ```javascript=
        @Injectable()
        export class UserService {
            constructor(
                @InjectRepository(User)
                private userRepository: Repository<User>
            ) {}

            find(userId: string): Promise<User> {
                return this.userRepository.findOne({user_id: userId});
            }
        }
        ```
        - 특별할 것 없는 service이며 여기서 repository를 선언하는 부분이 포인트!
    