---
title: "Chapter 3: Storage and Retrieval"
permalink: /books/ddia/chapter_3/
sidebar:
    title: "Designing Data-Intensive Applications"
    url: /books/ddia/
    nav: ddia_sidebar
toc: true
---

A database needs to do two fundamental things: Store data and Fetch data. A database handles how we store that data, and how we find that data once it is stored. Understanding these elements helps developers choose which storeage engine to use, as well as how to tune said storage engine. There a large differences for storage engines that are optimized for transactional workloads and analytical ones. There are two main families of storage engines: `log-structured` and `page-oriented`.

## Data Structures That Power Your Database

Many databases use an append-only data file, interally called a log (which is different tahn an application log. Here it is an append only sequence of records). Databases are usually good at adding data, but looking up data can be an issue, which is why an `index` can be created. An index is an additional structure that helps you find data, but the additional cost/overhead of maintaing an index can be large. This trade-off is important because indexes can greatly enhance reads, but each index that exists slows down writes. 

### Hash Indexes

Indexes for key-value data normaly use hash indexes (but are not the only ones). The hash map can keep the key, and the byte offset kept in a hash map, then when you look up a key, you use the hash map to find the byte offset. A storage engine that uses this method is well suited for occasions when the value for each key is updated frequently. This works particularly well if all the keys are kept in memory. If disk-space becomes an issue, then a compaction can be done, which throws away duplicates keys in the log keeping only the most recent update for each key.

Hash Tables have limitations though. The table must fit in memory, and range queries are not efficient. 

### SSTables and LSM-Trees

SSTables (otherwise known as Sorted String Tables) have several advantages over log segments with hash indexes:
1. Merging sements is simple and efficient
2. Finding a particular key is easier because an index with all the keys is no longer needed
3. Read requests sscan over several key-value pairs, it is possible to group records into blocks and compress it before writing to a disk

#### Constructing and maintaining SSTables

* Write comes in, add to an in memory balanced tree (i.e. a memtable)
* When the memtables becomes too large, write out to a disk as an SSTable file
* On read - Try finding key in the memtable, then the next most recent on-disk segment, etc.
* Run merging and compaction to combine segment files and discard unneeded values

#### Making an LSM-tree out of SSTables

LSM-Trees can be built out of SSTables, and that can be seen in several key-value storage engine libraries.

#### Performance optimizations

Lots of details goes into optimizations. For a LSM-Tree, searching for a non-existant key can be expensive. Different strategies can determine the order and timing of SSTables in terms of compaction and merging.

### B-Trees

The most widely used form of indexing structure is the B-tree. B-trees keep key-value pairs sorted by key. They break the database down to fixed-sized blocks/pages. Each page either points to an address of data, or another page. This allows for quick traversal of the data, to minimize the amount of searches that are performed by having large pages of data. When enough data is added that a new page is added, the B-Tree changes a pointer to data, to be a pointer that goes to another page. 

#### Making B-trees reliable

