# MQ & Kafka

---
***Kafka use cases***

- Messaging System
- Activity Tracking
- Gather metrics from many different locations
- Application logs gathering
- Stream processing
- De-coupling of system dependencies
- Integration with Spark, Flink, Storm, Hadoop, and other Big Data technologies

---

---
***MQ vs Kafka***

MQ
- consume된 message는 큐에서 바로 삭제
- message replay 불가능
- AMQP 기반: Message Broker를 통해 queue와 통신하기 용이
- 메시지를 받았을때 or 처리하였을 때 acknowlegment 발생
- 프로세스 실패하면 새로운 message로 queue에 추가

Kafka
- consume된 record는 retention 조건(time or size limit)에 따라 삭제
- record replay 가능
- TCP/IP 기반
- Offset으로 가장 마지막에 처리한 record를 tracking
- 프로세스 실패하면 offset을 움직이지 않음

Simple Message Queue
Complicated Kafka

---