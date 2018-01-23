---
title: Kotlin coroutines specification
read_time: true
layout: single
author_profile: true
related: true
permalink: "/kotlin-coroutines-spec"
---

This page describes Kotlin coroutines from the algorithmic point of view. It also contains a very short overview of basic features. For more information see the [official guide](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md).

# Intro


# Cancellation

В процессе ожидания (или до старта) корутина может быть отменена. В случае текущего исполнения, она кинет CancellationException в том месте, где проснётся. Если же ешё не была запущена, то будет удалена из очереди на исполнения.

Так же у корутины могут быть дети. Они тоже должны отменяться при отмене родителя.

# Communication between coroutines

## Channels

Две операции:
* recieve(): T
* send(val: T)

SPSC, SPMC, MPSC channels
channel with cache

## Select expression

Cancellation: CASN + Could be optimized by HTM

## Mutexes

Специальная блокировка между корутинами. Логично продолжать ожидающую корутину в том же потоке (как и с каналами), но тут вероятность успеха от такой оптимизации кажется куда больше. Тоже можно использовать релаксированную приоритетную очередь.