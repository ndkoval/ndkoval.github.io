---
title: Algorithms in Kotlin coroutines
tags: kotlin coroutines concurrency algorithms
date: '2018-01-23 00:00:00'
read_time: true
comments: true
layout: single
author_profile: true
share: true
related: true
permalink: "/blog/:title"
---

This post has some inaccuracies. An updated one with new communication algorithms will be published after a while.
{: .notice--warning}

The post describes Kotlin coroutines from the algorithmic point of view with a very short overview of basic features. The main reason to write this post is to collect my knowledge of the current Kotlin coroutines implementation and thoughts about possible optimizations. Thanks to [Roman Elizarov](https://www.linkedin.com/in/relizarov) for the help with understanding all ins and outs.

For more information about coroutines features see the [official guide](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md).
{: .notice--info}

# Intro
Coroutines are like light-weight threads with a possibility to suspend and, therefore, to utilize available resources better. Usually, coroutines are used for small tasks with I/O or synchronization operations. See [this talk](https://www.youtube.com/watch?list=PLQ176FUIyIUY6UK1cgVsbdPYA3X5WLam5&v=_hfBv0a09Jc) by Roman Elizarov if you are a beginner in coroutines.

This article talks about two problems: efficient communication and efficient scheduling.

# Communication

## Cancellation
While a coroutine is suspended, it is possible to cancel it and then a `CancellationException` is thrown right after it wakes up. According to the [documentation](https://github.com/Kotlin/kotlinx.coroutines/blob/master/coroutines-guide.md#children-of-a-coroutine), a coroutine can have children and in case the coroutine is canceled, all children have to be canceled too. From the algorithmic point of view, it does not matter are they cancelled atomically or asynchronously one by one, therefore the second strategy is used for better performance.

## Channels
Channel is a simple abstraction to transfer a stream of values between coroutines. Two basic operations form a channel: `send(val: T)` and `recieve(): T`. The standard channel is conceptually very similar to `BlockingQueue` with one element. One key difference is that instead of a blocking put operation it has a suspending send, and instead of a blocking take operation it has a suspending receive. When coroutine becomes blocked it is added to waiting queue for this channel. Note that only one type of channel utilizer (sender or receiver) could be in the queue, and this condition should be checked during the add operation. Here is an example of such queue contract.

```java
class WaitingQueue {
  
  /*
   * Atomically checks that the queue does not 
   * have any receiver and adds sender to it, 
   * otherwise polls the first receiver
   */
  fun addSenderOrPollReceiver(Coroutine c): Coroutine? { 
    ... 
  }
  
  /**
   * Atomically checks that the queue does not 
   * have any sender and adds receiver to it,
   * otherwise polls the first sender
   */
  fun addReceiverOrPollSender(Coroutine c): Coroutine? {
    ...
  }
  
  /**
   * Removes coroutine from the queue when it cancelled
   */
  fun remove(Coroutine c) = atomic {
    c.queueNode.remove()
  }
}
```

In order to implement that queue with good `remove()` performance and lock-free operations, a concurrent double-linked list [1] is used. However, some heuristics and approaches could improve the performance.

First of all, while the queue contains no or a single coroutine it seems to be more efficient to have just a link to this coroutine without the queue structure. However, such approach requires additional synchronization for growing from the single element to the normal queue.

The second idea is to use arrays instead of linked lists. It is impossible to use arrays always because there could be about 10000 coroutines in the waiting queue and remove from the middle would take a lot of time. However, it is not a problem if the queue is small. As well as with single element optimization, using this optimization growing from array to double-linked queue should be maintained.

Next idea could help for both previous optimization and the original algorithm. Let's just use hardware transactional memory for the growing procedure and for updating two links ('prev' and 'next') in double-linked queue. Of course, this optimization should be used as a fast path only.

The last idea is about using more modern data structure. However, let's analyze current algorithm at first. Double-linked lists are used mainly to perform `remove()` operation in O(1). However, it is not a problem to perform it in O(log N). In addition, it seems that fair queue contract is not required here. Thus, it should be more efficient to use relaxed queue which does not guarantee first-in-first-out order. 

### Buffered channel
The channel mentioned before has no buffer. Unbuffered channels transfer elements when sender and receiver meet each other (aka rendezvous). If send is invoked first, then it is suspended until receive is invoked, if receive is invoked first, it is suspended until send is invoked. In addition, it is possible to use channels with specified buffer capacity and not to wait on send operation when there is a free space in the buffer. According to the official guide, channels are fair and process send/receive operations in FIFO order. However, it seems that FIFO order is superfluous here and using relaxed queue could improve receiver's performance. 

### Restricted channels
Another way to optimize communication between coroutines is to use restricted channels. For example, if only one sender or receiver is used, it is possible to write a faster algorithm without the double-linked queue under the hood. And in case a channel is used only to send values from one coroutine to another, using single-producer single-consumer (SPSC) queue algorithm should really improve the communication performance. Such restrictions are not implemented now, but they could be introduced later.

### Select expression
Coroutines in Kotlin support `select` expression, which makes it possible to await multiple suspending functions simultaneously and select the first one that becomes available. The main difficulty is to retrive value from one channel and to remove itself from waiting lists from other channels atomically. For this purpose CASN (multi-word CAS) algorithm is used. In practice, number of channels the coroutine is subscribed is small and hardware transactional memory would highly improve the required atomic operation.

In addition, it does not obviously that CASN is required for `select`. It is easier just to separate retrieving into two phases: changing received value from null to the received one and then removing from all waiting queues step by step.

## Mutexes
Mutual exclusion protects all modifications of the shared state with a critical section that is never executed concurrently. In a blocking world you'd typically use `synchronized` or `ReentrantLock` for that. Coroutine's alternative is called `Mutex`. It has `lock` and `unlock` functions to delimit a critical section. The key difference is that `Mutex.lock()` is a suspending function. It does not block an execution thread (where coroutine is executing).

As similar to waiting on channels, a double-linked queue is used as a waiting queue for mutexes and same optimizations could be used here.

<a id="scheduling"/> 
# Scheduling
Another problem is choosing the dispatch thread for a resumed coroutine. It is not easy to answer where coroutine should be executed after it has been launched or woken up. Not taking into account the fact that it is possible to launch a coroutine in the current thread, standard `ForkJoinPool` is used to start or resume a coroutine in the current implementation. In other words, `ForkJoinPool` decides which thread is used for the coroutine execution. However, `ForkJoinPool` uses aggressive task stealing strategy and it leads to some problems. The popular case is if one coroutine sends a value to another, then does small work and suspends, while another coroutine resumes. In case of using `ForkJoinPool`, the second coroutine is resumed in other thread with a high probability and gets a cache miss when reads transmitted value. However, it would be better to wait for a short period of time and resume the second coroutine in the same thread. At the same time it is not efficient to wait for a long time, so an adaptive algorithm to choose the right wait time could be used. Note that this problem also relates to mutexes and new coroutine launches (it also seems better to launch it in the current thread because of cache locality).

# References
[1] Sundell, H., & Tsigas, P. (2004, December). Lock-free and practical doubly linked list-based deques using single-word compare-and-swap. In International Conference On Principles Of Distributed Systems (pp. 240-255). Springer, Berlin, Heidelberg.\\