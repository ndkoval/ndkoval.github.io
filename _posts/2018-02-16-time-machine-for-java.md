---
read_time: true
comments: true
layout: single_wide
author_profile: true
share: true
related: true
permalink: "/blog/:title"
title: Time machine for Java
date: '2018-02-16 00:00:00'
tags: time-test java concurrency
---

This article describes a tool developed to support unit-testing of time-dependent logic in Java applications. Originally it has been written for [Devexperts' blog](https://blog.devexperts.com/time-machine-for-java).

It is not always simple to write unit tests for time-dependent functionality. In straightforward situations simply replacing a method which returns the current time with a custom implementation will work. However, it is not enough for real programs testing. Let’s try to understand why such solutions do not work and what do we really want in order to test time-dependent logic.

Here is a simple method counting the number of days before the end of the world:

```java
fun daysBeforeDoom() {
    return doomTime - System.currentTimeMillis()) / millisInDay
}
```

Replacing all invocations of System.currentTimeMillis() with either an existing tools ([one](https://github.com/TOPdesk/time-transformer-agent/), [two](https://stackoverflow.com/questions/2001671/override-java-system-currenttimemillis-for-testing-time-sensitive-code)) or by writing a system specific  code transformer using [ASM](http://asm.ow2.org/) or [AspectJ](https://www.eclipse.org/aspectj/) framework will often suffice.

However, there are other cases where this approach is insufficient. Imagine we want our code to wake up each day and display "\<N\> days left until the doomsday” as in the following code snippet.

```java
while (true) {
    Thread.sleep(ONE_DAY)
    println(“${daysBeforeDoom()} days left till the doomsday”)
}
```

How can we test this code? How do we assert that it is invoked every day and that it displays the correct message? Using the simple approach described above and replacing `System.currentTimeMillis()` only allows us to test the correctness of the message. However, we would need to wait for a whole day to test it.

This way, it is practically impossible to test such code without additional tools. Let’s try to create one!

Currently we have two methods that return the current time: `System.currentTimeMillis()` and `System.nanoTime()`. We also have several time-dependent methods that wait for an event with an optional timeout: `Thread.sleep(..)`, `Object.wait(..)`, and `LockSupport.park(..)`.

In order to manage time, we want to create a new method `increaseTime(..)` which can change the current time and wake up waiting threads by virtual timeout.

To enable this, all of the existing time-dependent methods are need to be replaced with custom implementations. Let’s see how this may work.

**Test example:**

```java
increaseTime(ONE_DAY)
checkMessage()
```

You might have noticed that this test creates a potential race condition between our check message and the actual time it takes to complete the print operation.  Of course, one approach is to add a pause.

**Repaired test:**

```java
increaseTime(ONE_DAY)
Thread.sleep(500 /*ms*/)
checkMessage()
```

In regular practice, this test will almost always work but it is not guaranteed that `checkMessage()` is invoked after the message is printed. This can occur due to the complexity of the test logic or simply having the code executed on an overcommitted server. You might be tempted to increase the timeout but this makes the tests slower and still offers no guarantee of correctness.

Instead we need a special method that waits until all woken up threads have been completed.

**Test we would like to write:**

```java
increaseTime(ONE_DAY)
waitUntilThreadsAreFrozen(1_000/*ms, timeout*/)
checkMessage()
```

The inherent challenge is that we want to support all time-dependent methods during testing, but we also want a `waitUntilThreadsAreFrozen(..)` method and it is not simple to support both.

Working at Devexperts I have developed [**time-test**](https://github.com/Devexperts/time-test) tool for testing time-dependent logic. Let’s look at how it works.

**Time-test** is implemented as a Java agent. To utilize it you should add `javaagent:timetest.jar` and include it in the classpath. The tool transforms byte-code and replaces all time-dependent method invocations with our specific implementations. However, writing a good java agent sometimes is not simple so I have developed a [JAgent](https://github.com/Devexperts/jagent) framework at Devexperts to simplify java agents development.

When creating your time dependent tests you should enable `TestTimeProvider`. It implements all required  time-dependent methods (`System.currentTimeMillis()`, `Thread.sleep(..)`, `Object.wait(..)`, `LockSupport.park(..)`, ...) and overrides their default implementations. In most tests, you do not need to actually manage the underyling time so the tool internally continues to utilize the default time-dependent methods wrapped inside the overloaded method. After starting `TestTimeProvider` you can use the `TestTimeProvider.setTime(..)`, `TestTimeProvider.increaseTime(..)` and `TestTimeProvider.waitUntilThreadsAreFrozen(..)` methods.

**TimeProvider.java:**

```java
long timeMillis();
long nanoTime();
void sleep(long millis) throws InterruptedException;
void sleep(long millis, int nanos) throws InterruptedException;
void waitOn(Object monitor, long millis) throws InterruptedException;
void waitOn(Object monitor, long millis, int nanos) throws InterruptedException;
void notifyAll(Object monitor);
void notify(Object monitor);
void park(boolean isAbsolute, long time);
void unpark(Object thread);
```

As previously described, the primary challenge  of the `TestTimeProvider` implementation is supporting both the time-dependent methods along side the additional `waitUntilThreadsAreFrozen(..)` method. Thus on every time change all required threads are marked as resumed and only then are woken up. At the same time, `waitUntilThreadsAreFrozen(..)` waits until all threads are in the waiting state and none of them are marked as resumed. With this approach threads wake up, reset their resumed mark, perform their task and then return to a waiting state before `waitUntilThreadsAreFrozen(..)` recognize them as complete.

**Test with TestTimeProvider:**

```java
@Before
public void setup() {
    // Use TestTimeProvider for this test
    TestTimeProvider.start(/* initial time could be passed here */);
}


@After
public void reset() {
    // Reset time provider to default after the test execution
    TestTimeProvider.reset();
}


@Test
public void test() {
    runMyConcurrentApplication();
    TestTimeProvider.increaseTime(60_000 /*ms*/);
    TestTimeProvider.waitUntilThreadsAreFrozen(1_000 /*ms*/);
    checkMyApplicationState();
}
```

There is another one complexity with the time virtualization. The described approach works well if you need to control the time among all JVM. However, you usually want to make it possible not to affect testing library (e.g. JUnit) work, GC thread and other not related to your testing code things. Therefore, you need to understand if you are executing in the testing code to decide must you virtualize time here or not. For this purpose, **time-test** have to know entry points to the testing code (usually, test classes). After that, **time-test** traces new threads starts and marks them as ours too, which means that the virtual time should be used for them. However, there are some problems if you use shared scheduler like `ForkJoinPool` because it is started not from the testing code. In order to work with it as well, the definition of entry points has to be expanded.

I think now you understand that it is not simple to test time-dependant functionality and hope that the **time-test** tool will make your life easier. The tool is open-sourced and available on [GitHub](https://github.com/Devexperts/time-test).