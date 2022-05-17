---
title: "Chapter 1: Reliable, Scalable, and Maintainable Applications"
permalink: /books/ddia/chapter_1/
sidebar:
    title: "Designing Data-Intensive Applications"
    url: /books/ddia/
    nav: ddia_sidebar
toc: true
---

> Many applications today are data-intensive, as opposed to compute-intensive. Raw CPU power is merely a limiting factor for these applications - bigger problems are usually the amoutn of data, the complexity of the data, and the speed at which it is changing.

Some of the standard building blocks to data intensive applications include:
* databases
* caches
* search indexes
* stream processing
* batch processing

These data systems have been well thought-out, and many solutions have been built. Knowing which solution to use can be a difficult task. Understanding the commonalities and differences between solutions is useful in understanding which tools to use. The first section of the book focuses on three key concepts:
1. Reliablity - Systems works correctly even in the face of adversity
2. Scability - Growth in volume is able to be handled
3. Maintainability - Many people will work on the system, and should be able to do so productively

## Thinking About Data Systems

Data Systems can be a very broad term that covers a variety of tools (i.e. databases, queues, caches, etc.) To compound the issue, applications are becoming much more demanding, and tools are starting to limit the scope of the tasks it covers. This means that while tools are highly efficient, tools are started to be stitched together in pipelines to provide full usability.

When handling a data system, many questions can arise:
* How do you ensure that the data remains correct and complete, even when things go wrong internally?
* How do you provide consistently good performance to clients, even when parts of your system are degraded?
* How do you handle an increase in load?
* What does a good API for the service look like?

## Reliability

Basically means, that things are working correctly. What `working correctly` can mean different things at different companies, but the concept that things still work remains the same. Even when faults are introduced to the system, it should be resilient enough to keep working as expected (with no noticable difference to the end user). Fault-tolerant systems can be formed by delibertly triggering faults, and creating process to correctly handle the faults and errors that are generated. 

**Note:** Faults are different than failures. A fault is a component of the system not operating as expected, where as a failure is when a system stops providing the required usability to the user.
{: .notice--warning }

### Hardware Faults

This occurs when hard disks crash, RAM failes, blackouts, etc. The first response is to add redundancy, which could be replicated data sources, dual power supplies, back-up generators. Obviously this will not prevent all problems, but can keep a machine running well for years. But as data has grown, many places have moved from single machine to multi machine redundancy. This changed the scope of what needs to be handled.

### Software Errors

Most hardware faults are random and independent from eath other. Software errors are harder to handle because they are harder to anticipate, and handle because they are correlated. Bugs like these don't usually occur frequently until unusual circumstances occur. While there may not be a quick and easy solution for these problems, having checks and tests in place to ensure that everything is working as expected can be put in place.

**ProTip:** A good example of a test would be checking the number of messages into a queue equals the number of messages leaving a queue.
{: .notice--info}

### Human Errors

Humans are extremely buggy, and therefore write buggy code. A study showed that only 10~25% of outages were hardware faults. So the question remains, how do we ensure realiabilty when faced with human unreliablity?

* Design things in a way that minimizes the introductions of errors (abstractions, unit tests, APIs, small code changes)
* Decouple places where people make mistakes, and where people use the system (i.e. a sandbox env)
* Testing
* Quick and easy recovery methods from human error (easy to revert/rollback, tools to recompute data, etc.)
* Telemetry and montoring
* Good practices and training

### How Important is Reliability?

Reliability is not just to prevent the world from ending, but to ensure productivity and to keep away from legal issues. This can range from ensuring that companies using services are kept happy, but also to ensuring that a person's pictures and videos are kept valid and accessible.

## Scalability

A system meant to handle 10,000 users may not work for 100,000 users. Being able to handle changes in the amount of things handled by a system is usually under the scope of scalability. This isn't a one and done question, but can be thought about in terms of:
* If the system grows in a particular way, what are our options for coping with the growth?
* How can we add computing resources to handle the additional load?

### Describing Load

In order to determine how to scale, load parameters must be defined. The best choice for this will depend on the architecture of the system, but it may include numbers such as:
* Requests per second to web server
* Ratio of reads to writes in DB
* Number of simultaneously active users
* Hit rate on cache
 
**ProTip** You may want to look at averages, but bottnecks may be due to edge/extreme cases
{: .notice--info}

Twitter used to have a database the was queried, merged and sorted to show people tweets, but that was not an ideal solution because reading tweets occurs much more than posting a tweet. They switched to a cache for each user's home timline, requiring more power to post a tweet than read a tweet. If a person has many followers, this could mean millions of writes! Twitter is moving to combine the two approaches for different sets of people to manage people with lots of followers, and people with few followers.

### Describing Performance

Once load on the system is defined, testing an increase of load becomes easier. You can view it in two ways:
* When load parameters are increased, but system resources remains the same, what occurs?
* When load paramenteres are increased, how many more resources are needed to keep performance the same?

For batch processing, throughput is normally a main concern. How many records are processed per second. For online systems, the response time is important. There are obviously variations in how long things will take, even if the data is replicated and passed through again. Therefore, viewing the numbers in the sense of a distribution is key. Good metrics to follow would be percentiles as they would tell you what x% of responses are experiencing different times of processing/responses. You are also able to look at outliers (95%+ generally) to see what kind of performance the worst offenders have. Sometimes these outliers are important to address, as these might be key users, but at other times, it may be so costly to try to optimize for such a few amount of individuals that it does not make sense to address the issue. It may be down to an SLO/SLA to determine when to address some of these issues.

### Approaches for Coping with Load

> How do we maintain good performance even when our load parameters increase by some amount?

There are many solutions for many difference sizes of scale. There are scaling up (moving to more powerful machines) and scaling out (multiple less powerful machines). Distributing across multiple machines is know as shared-nothing. There are times when a combined approach is better as well, such as several powerful machine might be better and cheaper than a lot of small virtual machines.

Elasticity is also important. It means that a system is able to scale up and down on its own as more and less resources are needed depending on load size at any given time. 

Something important to keep in mind is that different problems require different solutions. For example, handling 100,000 1kb requests per second is different than handling 3 2gb requests per minute. This means that it important to create a system that handles the most common cases the best.

## Maintainability

The most cost for software doesn't come from inital development, but rather from maintenance. This could be in the form of stable operation, bug fixes, failures, new platforms, new use cases, tech debt, and new features. Software can designed in such a way that can minimize the pain from ongoing maintenance. There are three design principles that can help
* Operability: Easy for operations team to keep the system running smoothly
* Simplicity: Easy to understand for new people (low complexity)
* Evolvability: Easy to make changes to the system (extensibility, modifiability, plasticity)

### Operability: Making Life Easy for Operations
