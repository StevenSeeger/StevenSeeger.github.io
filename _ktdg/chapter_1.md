---
title: "Chapter 1: Meet Kafka"
permalink: /books/ktdg/chapter_1/
toc: true
---

The pipeline of data is a crucial component in data driven companies - the faster, easier and more transparent data moves from a source to a usable state and place, the more quickly that data can be leveraged.

## Publish/Subscribe Messaging

The concept of publish/subscribe messaging is important. It is characterized as a publisher (or sender of the data) creating a message, without sending it to specific place, but rather has many subscribers (things listening in) to fetch that new message. This may not seem straight forward at first, espeically when systems are small. It may seem better to create direct connections between nodes, but this quickly becomes cluttered as more and more nodes need to communciate. You may be tempted to set up a single pub/sub application to handle the messages, but sometimes it is usful to create separate systems to handle the different loads and messages.

## Enter Kafka

Kafka is often described as a distributed commit log or a distributing streaming platform. It is meant to be durable, scalable and safe method of storing and sending messages, which are the base unit of data within Kafka. Messages are seen as arrays of bytes, and so the format or meaning of the message means nothing to Kafka. For efficiency, messages are often batched (or grouped) together then processed, instead of streamed. The purpose of this is to conserve network resources. Something to remember is that that larger the batch, the more messages can be handled in a single time unit, but any given message will take longer to be passed along.

Schemas can be used in Kafka, and is recommended. Having a consistent data format allows the writing and reading of messages to be decoupled.

Topics can be thought of folders or a database table - items that are similar are grouped together. These topics are then partitioned (the storage of the messages are split across multiple data storage units) to increase the scalability of the application. The term "stream" is often used to describe a topic in Kafka.

There are Producers and Consumers within the Kafka ecosystem, which create messages or read messages respectively. Producers create messages with specific topics, and can include whether it needs to be included in specific partition (this is optional though). Consumers can work in groups to read from a topic, with a consumer reading from multiple partitions, or a single partition.

A single Kafka server is called a broker - this handles the receiving of messages, assigning the offset (or order in which it came in) and storage. Brokers are meant to work as part of the cluster, which is multiple brokers working together to handle the influx of messages, using a single Kafka broker to be the leader and manage the cluster.

Multiple clusters might be desired when there is need of segregation of data types, security requirements and disaster recovery. Tools like MirrorMaker are useful, and this allows for messages to be consumed from one Kafka cluster to another, and even taking in aggreage kafka source aggregates, and consuming them and producing more messages to be consumed by an external system for storage.

## Why Kafka?