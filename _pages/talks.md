---
title:  "My talks"
layout: single
permalink: /talks/
author_profile: true
comments: true
toc: true
toc_label: "Talks"
---

Most of the talks are arranged by projects. Some talks were given multiple times, please choose the most recent version. Enjoy your time of watching them!


&nbsp;
# Kotlin Coroutines
Since I am working on communication and synchronization primitives for Kotlin, I gave several talks about this project.

## How we created a channel algorithm in Kotlin Coroutines <a id="channels-jpoint-2019"/>
:ru: JPoint 2019\\
:en: [Slides](/presentations/jpoint_2019_channels.pdf)

{% include video id="cdpQMDgQP8Y" provider="youtube" %}

Most programming languages are introducing mechanics of asynchronous programming. Kotlin, for its part, implemented coroutines which use channels to connect with each other. Therefore, high-load applications depend on performance of those channels, which need to be implemented in an effective and scalable way.

In this talk, we'll discuss which channel algorithms other programming languages and libraries use, how we in Kotlin develop our own solution, which challenges and subtle aspects we encounter in the process and what we managed to achieve.

## Channels in Kotlin Coroutines <a id="channels-joker-2018"/>
:ru: Joker 2018\\
:en: [Slides](/presentations/joker_2018_channels.pdf)

{% include video id="XHMXyYlQ8Eg" provider="youtube" %}

Unlike traditional concurrent programming with shared mutable state manipulation, coroutines use channels for communication. Essentially, you can send a value into channels from one coroutine and receive this value into another. At the same time, send and receive operations can be synchronized, so the sender waits for the receiver or vice versa. In this talk, we'll consider the existent channel algorithms, discuss the one developed in Kotlin coroutines, and find out which is better: Kotlin or Go.


&nbsp;
# Lincheck
This set of talks is about [Lincheck](/projects/#lin-check) tool for testing concurrency on JVM.


## Testing concurrent algorithms with Lincheck <a id="lincheck-joker-2019"/>
:ru: Joker 2019\\
:en: [Slides](/presentations/joker_2019_lincheck.pdf)

{% include video id="9cB36asOjPo" provider="youtube" %}

Everybody knows that concurrent programming is bug-prone. Moreover, some bugs in complicated algorithms occur rarely and are hard to reproduce; thus, it is difficult to detect them via simple hand-written tests. In this talk, we discuss *Lincheck* tool for testing and debugging concurrent code. We will talk about both the capabilities and the API of the tool, and implementation details.


## Lincheck: testing concurrent data structures on Java <a id="lincheck-hydra-2019"/>
:ru: Hydra 2019\\
:en: [Slides](/presentations/hydra_2019_lincheck.pdf)

{% include video id="hwbpUEGHvvY" provider="youtube" %}

Writing concurrent programs is hard. However, testing them is not easy as well. In this talk, I present [Lincheck](/projects/#lin-check), a tool for testing concurrent algorithms on JVM-based languages. Essentially, it takes some declarations of the data structure operations, generates random scenarios, runs them a lot of times, and verifies the corresponding results. During the talk, we will mostly focus on the verification phase.

At first, we will discuss how LTS (Labeled Transition System) formalism can help us with implementing the verification phase efficiently. After that, I extend LTS to support dual data structures; this formalism is useful for data structures with partial methods (synchronous queues, blocking queues, channels, semaphores, ...). However, such an extension is not sufficient, and some small tricks should be added, which restrict the model a bit but make it possible to use it in practice.


## Lock-free algorithms testing <a id="lock_free_algorithms_testing"/>

:ru: Latest: Joker 2017\\
:ru: [Slides](/presentations/lin_check_joker_2017.pdf)

{% include video id="_0_HOnTSS0E" provider="youtube" %}

Writing multithreaded programs is hard, however, testing them is not easier at all. Thinking about all dangerous execution scenarios and writing tests for them is a difficult task, therefore it is often limited to a simple set of stress tests that are not always enough to detect an error. In order to solve this problem, the *Lincheck* tool has been developed, which automatically checks a multithreaded Java code for linearizability. The first part of the talk is dedicated to various strategies and techniques for checking for linearizability. In the second part, we discuss the provided API and its ability to test your data structures.

### Historical materials
{: .no_toc}
:ru: SECR 2017: [slides]() and [video]()



&nbsp;
# Other
These talks are related to either relatively small projects or simply cannot be assigned to any one. However, they are also important for me.

## <a id="htm_java"/> Hardware transactional memory in Java

:ru: Latest: JPoint 2018\\
:ru: [Slides](/presentations/htm_java_jpoint_2018.pdf)

{% include video id="Plt8ZPlaLIU" provider="youtube" %}

This talk is devoted to the transactional memory, which you can find in modern processors more and more often and which is supposed to make the world of concurrency a better place. In this talk we discuss possible ways to use transactional memory for improving performance, the already existing optimizations in OpenJDK based on it, and the possibility to run transactions directly from Java code.

## <a id="lock_free_hashtables"/> On the way to efficient concurrent hash table

:ru: Latest: JBreak 2018\\
:ru: [Slides](/presentations/hashtables_jbreak_2018.pdf)

{% include video id="BpgL2LGEhP4" provider="youtube" %}

Nowadays, hash tables are probably the most used data structures, the performance of which influences many application components. However, is it that simple to write a fast implementation which uses all the power of multi-core architectures? How efficient are the standard solutions in Java? We will try to get the answer to these and many other questions during this talk. We will touch on both theoretical aspects and some practical approaches for high-performance algorithms development.

## <a id="dl_check"/> How to find deadlock not getting into it

:ru: Latest: JEEConf 2017\\
:gb: [Slides](/presentations/dl_check_jeeconf_2017.pdf)

{% include video id="T6zwGIv8lwA" provider="youtube" %}

Deadlocks are one of the main problems in multithreaded programming. This talk presents *Dl-Check* – a novel tool for detecting potential deadlocks at runtime of Java programs. In order to implement this tool, the bytecode instrumentation is required as well as the ASM framework is advantageous. In the first part of the talk, the general approach and the algorithm for online detection of potential deadlocks are presented. As for the second part, byte-code instrumentation and several useful techniques and associated cases related to it are discussed.

### Historical materials
{: .no_toc}
:ru: JPoint 2017: [slides]() and [video]()\\
:ru: JBreak 2017: [slides]() and [video]()

