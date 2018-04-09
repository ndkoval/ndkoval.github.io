---
title:  "Projects"
layout: single
permalink: /projects/
author_profile: true
comments: true
toc: true
toc_label: Projects
---

Only those projects where I had a key role are presented here. For each of the projects short descriptions, links to my blog posts, publications, and talks are attached.

## UI-Lag-Finder
*Tool for detecting potential lags in UI threads*\\
<https://github.com/Devexperts/uilagfinder>

This tool finds potentially long operations invocations in UI thread. The long operation is determined as a method, which needs access to filesystem or network.  The approach is based on two main techniques – applying static analysis to widen the scope of detection and run-time code instrumentation to detect violations on the fly. Static analysis phase detects methods that contain potentially long operations on a Function Call Graph (FCG) and marks them as “long”. Collected data is used by the run-time part to widen the scope of analysis and report if a long operation is invoked in UI thread. The run-time analysis also detects if UI thread may be blocked too long due to acquiring a lock which could be held during a long operation invocation.


## Lin-Check <a id="lin-check"/>
*Framework for testing concurrent algorithms for correctness*\\
<https://github.com/Devexperts/lin-check>

Lin-Check is a testing framework for checking that concurrent data structure is linearizable. The approach is based on linearization definition and tries to find non-linearizable execution with specified operations, using a specially crafted test to produce lots of different executions. The execution is represented as a list of actors for every test thread, where the actor is the operation (e.g. put(key, value) and get(key) in java.util.Map) with already counted parameters.

### Related talks
[Lock-free algorithms testing](/talks/#lock_free_algorithms_testing)

## Dl-Check
*Tool for finding potential deadlocks via dynamic analysis*\\
<https://github.com/Devexperts/dlcheck>

Dl-Check determines potential deadlock as a lock hierarchy violation and finds them via dynamic analysis in Java programs. This tool is implemented as Java agent and injects analysis code within class transformation during class loading, therefore it’s possible to use Dl-Check without any code change. The base algorithm for finding lock hierarchy violations is based on new cycles detection in the lock-order graph. For this purpose, an algorithm for incremental topological order maintenance is used. However, existing solutions are not efficient for concurrent execution, so currently I am working on scalable topological order maintenance algorithm.

### Related talks
[How to find deadlock not getting into it](/talks/#dl_check)

### Related publications
[Dl-Check: dynamic potential deadlock detection tool for Java programs](/publications/#dl_check_17)

## Usages
*Tool for finding code usages among Maven repositories*\\
<https://github.com/Devexperts/usages>

*Usages* tool finds code usages in the specified Maven repositories. It indexes repositories, downloads required artifacts and scans ".class" files in them. The tool analyzes all kinds of dependencies: usages of fields and methods, extensions of classes and implementations of interfaces, usages of annotations, overrides of methods. The tool is separated into 2 parts: server application, which collects all information and analyzes classes, and a client one, which is implemented as IntelliJ Plugin. 
{: .text-justify}

## Time-test
*Library for testing time-based functionality in Java programs*\\
<https://github.com/Devexperts/time-test>

*Time-test* helps to test time-dependent functionality via time virtualization. It is implemented as a Java agent and replaces all time-dependent methods invocations with its own implementations. Unlike other implementations, it works not with `System.currentTimeMillis()` and `System.nanoTime()` methods only, but with `Object.wait(..)`, `Thread.sleep(..)`, and `Unsafe.park(..)` as well. In addition, *time-test* has a special `waitUntilThreadsAreFrozen(timeout)` method which waits until all threads have done their work. 
{: .text-justify}

### Related posts
[Time machine for Java](http://nkoval.info/blog/time-machine-for-java)

## JAgent
*Framework for simplifying java agents development*\\
<https://github.com/Devexperts/jagent>

TODO short description