---
title:  "Projects"
layout: single
classes: wide
permalink: /projects/
author_profile: true
comments: true
toc: true
toc_label: List of projects
---

This page describes the projects where I have a key role, also omitting the small ones.
Each project description is equipped with related publications and public talks.

## Synchronization Primitives for Kotlin Coroutines
TODO

### Fast and scalable buffered channels
<!-- *Improving data flow processing with new buffered channels in Kotlin Coroutines* -->
Traditional concurrent programming involves manipulating shared mutable state. Alternatives to this programming style are communicating sequential processes (CSP) and actor models, which share data via explicit communication. These models have been known for almost half a century, and have recently had started to gain significant traction among modern programming languages. The common abstraction for communication between several processes is the *channel*. Although channels are similar to producer-consumer data structures, they have different semantics and support additional operations, such as the `select` expression. Despite their growing popularity, most known implementations of channels use lock-based data structures and can be rather inefficient. Under this project, I am working on efficient and scalable channel algorithms, which are far faster than the already existing ones. New related publications are coming soon.

**Related publications:**
* [POSTER: Memory-Friendly Lock-Free Bounded Queues](/publications/#ppopp20-bounded-queues) @ PPoPP 2020
* [Scalable FIFO Channels for Programming via Communicating Sequential Processes](/publications/#europar19-channels) @ Euro-Par 2019
* [POSTER: Lock-free channels for programming via communicating sequential processes](/publications/#ppopp19-channels) @ PPoPP 2019

**Related talks:**
* [How we created a channel algorithm in Kotlin Coroutines](/talks/#channels-jpoint-2019)
* [Channels in Kotlin Coroutines](/talks/#channels-joker-2018)

<br/>

### CQS: a formally-verified framework for fair synchronization
This project introduces a new framework for building synchronization primitives called the *CancellableQueueSynchronizer* (CQS). It enables efficient fair and abortable implementations of fundamental synchronization constructs such as mutexes, semaphores, barriers, count-down-latches, and blocking pools.
The first contribution is algorithmic, as implementing both fairness and abortability efficiently at this level of generality is  non-trivial.
Importantly, all the resulting algorithms come with *formal proofs* in the Iris framework for Coq. These proofs are modular, so it is easy to prove correctness for new primitives implemented on top of CQS. Some of the primitives are going to be a part of the standard Kotlin Coroutines library, as well the CQS framework itself. Compared against Java's \texttt{AbstractQueuedSynchronizer}, the only practical abstraction to provide similar semantics,
CQS shows significant improvements across all benchmarks, of up to two orders of magnitude.

**Related publications:**
* [A Formally-Verified Framework for Fair Synchronization in Kotlin Coroutines](https://arxiv.org/abs/2111.12682) @ Preprint on arXiv

**Related talks:**
* [Synchronization primitives can be faster with SegmentQueueSynchronizer](/talks/#hydra-2020-sqs)

## Concurrent Graph Algorithms
Parallel graph processing is a fundamental and well-studied topic in academia in both theoretical and practical aspects. However, some applications, such as social networks analysis and compilers, require these algorithms to be online, thus, concurrent. This project aims to build practically efficient concurrent algorithms for different aspects of graph processing, including using multi-queues as priority schedulers for some of the algorithms or online dynamic connectivity problems under edge insertion and deletions. Nowadays, most hardware platforms have several NUMA sockets, so it is essential to make all these algorithms NUMA-friendly.

**Related publications:**
* [Multi-queues can be state-of-the-art priority schedulers](/publications/#ppopp22-smq) @ PPoPP 2022
* [A Scalable Concurrent Algorithm for Dynamic Connectivity](/publications/#spaa21-dynamic-connectivity) @ SPAA 2021
* [In Search of the Fastest Concurrent Union-Find Algorithm](/publications/#opodis19-union-find) @ OPODIS 2019

**Related talks:**
* [Multi-Queues Can Be State-of-the-Art Priority Schedulers](/talks/#ppopp-smq)


## Testing Concurrency on the JVM
When developing new concurrent algorithms and solutions in general,
it is crucial to test them properly. The tools below help with that on the JVM.

### Lincheck: a framework for testing concurrent data structures
<https://github.com/Kotlin/kotlinx-lincheck>

*Lincheck* provides a simple and declarative way to write concurrent tests: instead of describing how to perform the test, the user specifies what to test by declaring all the operations to examine, along with the required correctness property. As a result, a typical concurrent test via *Lincheck* contains only about 15 lines of code and can test all data structures with the same interface, irrelevant of how these data structures are implemented.
Given the operations and the contract declaration (linearizability is the default one), *Lincheck* (1) generates a set of random concurrent scenarios, (2) examines them using either stress-testing or bounded model checking, and (3) verifies that the results of each invocation satisfy the required correctness property, providing an easy-to-follow trace to reproduce the found error in the model checking mode – this significantly simplifies the bug investigation.

*Lincheck* is successfully integrated into several big projects, such as the standard Kotlin Coroutines library, and identified both new and previously-known bugs in popular concurrency libraries, such as a novel race in Java's classic `ConcurrentLinkedDeque` and a non-trivial set of bugs in recently-proposed NVM data structures. I believe that *Lincheck* can significantly improve both the quality and the productivity of research and development of concurrent algorithms and become the state-of-the-art approach for checking their correctness on the JVM.


**Related publications:**
* [POSTER: Testing Concurrency on the JVM with Lincheck](/publications/#ppopp20-lincheck) @ PPoPP 2020

**Related talks:**
* [Testing concurrent algorithms with Lincheck](/talks/#lincheck-joker-2019)
* [Lincheck: testing concurrent data structures on Java](#lincheck-hydra-2019)
* [Lock-free algorithms testing](/talks/#lock_free_algorithms_testing)

<br/>

### Dl-Check: a tool for finding potential deadlocks<a id="dl-check"/>
<https://github.com/Devexperts/dlcheck>

*Dl-Check* determines potential deadlock as a lock hierarchy violation and finds them via dynamic analysis in Java programs. This tool is implemented as a Java agent and injects analysis code within class transformation during class loading, making it possible to use *Dl-Check* without code changes. The base algorithm for finding lock hierarchy violations is based on cycle detection in the lock-order graph's cycle, leveraging incremental topological order maintenance for that.

**Related publications:**
* [Dl-Check: dynamic potential deadlock detection tool for Java programs](/publications/#dl_check_17) @ TMPA 2017

**Related talks:**
* [How to find deadlock not getting into it](/talks/#dl_check)

<br/>

### Time-test: a library for testing time-based functionality<a id="time-test"/>
<https://github.com/Devexperts/time-test>

The *time-test* library helps to test time-dependent functionality via time virtualization. It is implemented as a Java agent and replaces all time-dependent method invocations with its implementations on the fly. Unlike other implementations, it works not with `System.currentTimeMillis()` and `System.nanoTime()` methods only, but with `Object.wait(..)`, `Thread.sleep(..)`, and `Unsafe.park(..)` as well. In addition, *time-test* has a special `waitUntilThreadsAreFrozen(timeout)` method, which waits until all threads have done their work.

**Related blog posts:**
* [Time machine for Java](/blog/time-machine-for-java)


## Usages: a tool for finding code usages in Maven repositories <a id="usages"/>
<https://github.com/Devexperts/usages>

*Usages* tool finds code usages in the specified Maven repositories. It indexes the specified repositories, downloading all artifacts and scanning `.class` files in them. The tool analyzes all kinds of dependencies: usages of fields and methods, extensions of classes and interface implementations, method overrides, and many others. The *Usages* tool is separated into two parts: a server application, which collects all information and analyzes JVM classes, and a client implemented as an IntelliJ IDEA plugin.
