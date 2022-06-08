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

Due to the structure of b-trees, write-ahead logs are maintained (otherwise known as a redo log). If there is a crash at any point, the B-tree can be brough back to a reliable state by utilizing the write-ahead log. 

#### B-tree Optimizations

Many optimizations have been made, and without going into too much detail, they include migrating away from write-ahead logs towards a copy-on-write schema, reducing the of keys by not storing the entire key, page placement on the disk, additional pointers, and fractal trees (but nothing to do with fractals).

### Comparing B-Trees and LSM-Trees

LSM-trees are faster for writes and B-trees faster for reads generally. This is just a rule of thumb, and highly is dependent on the type of work and data of the workload.

#### Advantages of LSM-Trees

LSM-Trees have lower write amplification than other methods. They are also better able to be compressed to be smaller files. 

#### Downsides of LSM-Trees

Compaction processes can interefere with performance of reads and writes. If there is a high rate of writes, compaction might not be able to be keep up with the writes and disk space can run out. 

### Other Indexing Structures

Many tables rely on key-value pairs, akin to creating a primary index. There are secondary indexes that can be created, and often are used to allow for joins to optimally perform. 

#### Storing values within the index

The key in the index is what is going to be queried. The value can be an actual row, or a reference to the row stored elsewhere. When the rows are stored elsewhere, the place is known as a heap file. The heap file is largely random, and if the leap from the index to the heap file is costly in terms of performance, a clustered index might be the proper solution. An intermediate solution might also be useful, the covering idex or index with included columns.

#### Multi-column indexes

A popular form of multi-column indexes is concatenated indexes, which combines several fields into one key (usually by appending the columns one to another). The index is useful for finding something by the first column, or by the order by with the columns were appended, but become useless if referencing any column besides the first one, or the columns out of order. Examples of good uses might be geolocation (i.e. having longitude and longitude), colors of products (i.e RGB values), etc.

#### Full-text search and fuzzy indexes

Most indexes assume exact data, but sometimes indexes and search algorithms need to be able to search for simlar keys. A common form is levenshtein distance.

#### Keeping everything in memory

In-memory databases have become more common as cost of RAM has become cheaper. This usually require special hardware/solutions to preserve the database if the system crashes (or the it allowable that the database can be lost if a system crashes). The performance advantage is due to avoiding the overhead of encoding in-memory data structures. It also allows for data models that are difficult to implement with disk-based indexes. 

## Transaction Processing Or Analytics?

**ACID:** Atomicity, Consistency, Isolation, Durability
{: .notice--info}

Transactions dont have to have ACID properties. Applications that look up records using a key and an index, the access pattern is known as online transaction processing (OLTP). Applications that query lots of data, use only a few columns and calculates aggregate data, uses an access pattern known as online analytic processing (OLAP). The key differences are shown below:

| Proptery             | Transaction Processing Systems (OLTP)             | Analyic Systems (OLAP)                   |
| -------------------- | ------------------------------------------------- | ---------------------------------------- |
| Main Read Pattern    | Small number of records per query, fetched by key | Aggregate over large number of records   |
| Main write pattern   | Random-access, low-latency writes from user input | Bulk import (ETL) or event stream        |
| Primarily used by    | End user/customer, via web-application            | Internal analyst, for decision support   |
| What data represents | Latest state of data (current point in time)      | History of events that happend over time |
| Dataset size         | Gigabytes to terabytes                            | Terabytes to petabytes                   |

### Data Warehousing

A datawarehouse is a seperate database that analysts can query, without affecting end-user facing databases and operations. The data warehouse contains read-only data, and is usually loaded in via ETL. The data warehouse can be optimized for analytics. 

#### The divergence between OLTP databases and data warehouses

The data model for warehouses is commonly relational, mainly because SQL is a good fit for analytics queries. While a OLTP database and data warehouse look simlar, the internal systems vary greatly. They are optimized for different query patterns.

### Stars and Snowflakes: Schemas for Analytics

Many data warehouses uses the star schema. Fact tables include individual events, and dim tables contain data to represent the who, what, where, when, how and why of the fact table. Snowflake schemas take this idea one step further, with dim tables being broken down into subdimensional tables. In a typical data warehouse, tables are often very wide. 

## Column-Oriented Storage

Column-Oriented databases ignore all other columns that are not needed in a query. This can save a lot of work, as less data needs to be read.

### Column Compression

Column-oriented storage is easy to compressed. The data can be quite repetitive in the columns, and different compression techniques can be applied to get the best compression.

#### Memory bandwidth and vectorized processing

Scanning over millions of rows to the disk is expensive, CPU cache is small, avoiding branch mispredictions and bubbles, etc. all lead to bottlenecks. Column-oriented storage reduces the the volume loaded onto the disk, and makes efficient use of CPU cycles. In some cases, a for loop can be executed many times faster than all the fucntion calls that may be needed.

### Sort Order in Column Storage

The order of the rows is does not matter. An order can be imposed, and an index laid on top if desired though. Sorting a column indepentently makes little sense because the location of the each value in the column references to the row it is related to. The data will be needed to be sorted a row at a time. The sort order matters due to limiting the amount of sorting that needs to occur in each step.

#### Several different sort orders

Different queries benefit from different sort orders, so some solutions are to store the data in several ways. Data needs to be replicated across multiple machines, so the replications are sorted in different ways, and when a query is submitted, the query is submitted to the data that best matches it. This idea is very similar to having multiple secondary indexes in a row-oriented store, with the largest difference being row-oriented store every row in a single place, whereas the column store only contains column values.

### Writing to Column-Oriented Storage

Column-oriented storage, compression and sorting makes read queries faster, but make writes more difficult. For this case, all writes go to an in-memory store, and added to a sorted structure in prep to be written to a disk. When enough writes are prepared, they are bulk imported. The query optimizer handles the interim before the data is written to properly return the data without dirty reads and writes.

### Aggregation: Data Cubes and Materialized Views

Materialized views create a cache of a query, instead of having to query the raw data each time. When the underlying data changes, the materialized view will update (automatically most of the time) and materialized views are often not used in OLTP databases because of this. A common materialized view is known as a data cube or OLAP cube. It is a grid of aggregates grouped by different dimensions. Advantages of data cubes is that you can query some data very quickly. No need to scan millions of rows to compute some values on the fly. The downside is that the data cube doesn't have the same flexibilty, and there is no way to calculate on dimensions that didn't orginally exist in the data cube.

## Summary

Two broad categories of storage engines exist: transaction processing (OLTP) and analytics (OLAP). Knowing the internal of these systems, and the different storage techinques can help us better decide which storage type to use, as well as how to optimize using those engines.