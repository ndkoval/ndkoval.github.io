---
title:  "My talks"
layout: single
permalink: /talks/
author_profile: true
comments: true
toc: true
toc_label: "Talks"
---

The talks are arranged in themes. Some talks were given multiple times, choose the most recent one.

## <a id="lock_free_algorithms_testing"/> Lock-free algorithms testing

:ru: Latest: Joker 2017\\
:ru: [Slides](/presentations/lin_check_joker_2017.pdf)

{% include video id="_0_HOnTSS0E" provider="youtube" %}

Writing multithreaded programs is hard, however, testing them is not easier at all. Thinking about all dangerous execution scenarios and writing tests for them is a difficult task, therefore it is often limited to a simple set of stress tests that are not always enough to detect an error. In order to solve this problem, the *Lin-Check* tool has been developed, which automatically checks a multithreaded Java code for linearizability. The first part of the talk is dedicated to various strategies and techniques for checking for linearizability. In the second part, we discuss the provided API and its ability to test your data structures.

### Historical materials
{: .no_toc}
:ru: SECR 2017: [slides]() and [video]()

## <a id="dl_check"/> How to find deadlock not getting into it

:ru: Latest: JEEConf 2017\\
:gb: [Slides](/presentations/dl_check_jeeconf_2017.pdf)

{% include video id="T6zwGIv8lwA" provider="youtube" %}

Deadlocks are one of the main problems in multithreaded programming. This talk presents *Dl-Check* – a novel tool for detecting potential deadlocks at runtime of Java programs. In order to implement this tool, the bytecode instrumentation is required as well as the ASM framework is advantageous. In the first part of the talk, the general approach and the algorithm for online detection of potential deadlocks are presented. As for the second part, byte-code instrumentation and several useful techniques and associated cases related to it are discussed.

### Historical materials
{: .no_toc}
:ru: JPoint 2017: [slides]() and [video]()\\
:ru: JBreak 2017: [slides]() and [video]()

