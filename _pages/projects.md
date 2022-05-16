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

This page describes the projects where I have a key role, omitting the small ones.
Each project description is equipped with related publications and public talks.

## Synchronization Primitives for Kotlin Coroutines

### Fast and scalable buffered channels
*Improving data flow processing with new buffered channels in Kotlin Coroutines*

Traditional concurrent programming involves manipulating shared mutable state. Alternatives to this programming style are communicating sequential processes (CSP) and actor models, which share data via explicit communication. These models have been known for almost half a century, and have recently had started to gain significant traction among modern programming languages. The common abstraction for communication between several processes is the *channel*. Although channels are similar to producer-consumer data structures, they have different semantics and support additional operations, such as the `select` expression. Despite their growing popularity, most known implementations of channels use lock-based data structures and can be rather inefficient. Under this project, I am working on efficient and scalable channel algorithms, which are far faster than the already existing ones. New related publications are coming soon.

**Related publications:**
* [Scalable FIFO Channels for Programming via Communicating Sequential Processes](/publications/#europar19-channels) @ Euro-Par 2019
* [POSTER: Lock-free channels for programming via communicating sequential processes](/publications/#ppopp19-channels) @ PPoPP 2019

**Related talks:**
* [How we created a channel algorithm in Kotlin Coroutines](/talks/#channels-jpoint-2019)
* [Channels in Kotlin Coroutines](/talks/#channels-joker-2018)

### *CancellableQueueSynchronizer*: a framework for building fair and abortable synchronization primitives
This project was started with a novel sempahore algorithm for Kotlin Coroutines (see the [source code](https://github.com/Kotlin/kotlinx.coroutines/blob/master/kotlinx-coroutines-core/common/src/sync/Semaphore.kt)). After that, we decided to create a flexible abstraction for implementing synchronization and communication primitives. The one is called `SegmentQueueSynchronizer` and makes the development of such primitives much faster making them simpler and more efficient at the same time. Since we also support abortability of waiting requests (e.g., `lock` operation can be aborted by timeout) and these algorithm parts are usually the most complicated and error-prone ones, we decided to prove everything formally in the Iris framework for Coq. Now we are completing the proofs and working on experiments, and looking forward to a new paper soon!


## Testing Concurrency on the JVM

### Lincheck: a framework for testing concurrent data structures
<https://github.com/Kotlin/kotlinx-lincheck>

*Lincheck* is a practical tool for testing concurrent algorithms implemented in JVM-based languages, such as Java, Kotlin, or Scala. Roughly, *lincheck* takes the list of operations on the  data structure to be tested, generates a series of concurrent scenarios, executes them in either stress testing or model checking mode, and checks whether there exists some sequential execution which can explain the results.
I use this tool to test the concurrent algorithms in the Kotlin Coroutines library and to check a set of student assignments.
In addition, it was used to find several known and unknown bugs in popular libraries, such as the race between removing and adding an element to the head of the Java's `ConcurrentLinkedDeque`.

**Related publications:**
* [POSTER: Testing Concurrency on the JVM with Lincheck](/publications/#ppopp20-lincheck) @ PPoPP 2020

**Related talks (by me):**
* [Testing concurrent algorithms with Lincheck](/talks/#lincheck-joker-2019)
* [Lincheck: testing concurrent data structures on Java](#lincheck-hydra-2019)
* [Lock-free algorithms testing](/talks/#lock_free_algorithms_testing)

**Related talks (by my colleagues):**


### Dl-Check: a tool for finding potential deadlocks<a id="dl-check"/>
<https://github.com/Devexperts/dlcheck>

*Dl-Check* determines potential deadlock as a lock hierarchy violation and finds them via dynamic analysis in Java programs. This tool is implemented as Java agent and injects analysis code within class transformation during class loading, therefore it’s possible to use *Dl-Check* without any code change. The base algorithm for finding lock hierarchy violations is based on new cycles detection in the lock-order graph. For this purpose, an algorithm for incremental topological order maintenance is used.

**Related publications:**
* [Dl-Check: dynamic potential deadlock detection tool for Java programs](/publications/#dl_check_17) @ TMPA 2017

**Related talks:**
* [How to find deadlock not getting into it](/talks/#dl_check)

### Time-Test: a library for testing time-based functionality<a id="time-test"/>
<https://github.com/Devexperts/time-test>

*Time-test* helps to test time-dependent functionality via time virtualization. It is implemented as a Java agent and replaces all time-dependent methods invocations with its own implementations on the fly. Unlike other implementations, it works not with `System.currentTimeMillis()` and `System.nanoTime()` methods only, but with `Object.wait(..)`, `Thread.sleep(..)`, and `Unsafe.park(..)` as well. In addition, *time-test* has a special `waitUntilThreadsAreFrozen(timeout)` method which waits until all threads have done their work.

**Related posts**
* [Time machine for Java](http://nkoval.info/blog/time-machine-for-java)

## Usages: A Tool For Finding Code Usages in Maven Repositories <a id="usages"/>
<https://github.com/Devexperts/usages>

*Usages* tool finds code usages in the specified Maven repositories. It indexes repositories, downloads required artifacts, and scans `.class` files in them. The tool analyzes all kinds of dependencies: usages of fields and methods, extensions of classes and implementations of interfaces, usages of annotations, overrides of methods, and so on. The tool is separated into 2 parts: server application, which collects all information and analyzes classes, and a client one, which is implemented as an IntelliJ IDEA plugin.

<!-- ## JAgent  <a id="jagent"/>
*Framework for simplifying java agents development*\\
<https://github.com/Devexperts/jagent> -->
