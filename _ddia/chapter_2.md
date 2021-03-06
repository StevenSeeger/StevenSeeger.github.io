---
title: "Chapter 2: Data Models and Query Langugages"
permalink: /books/ddia/chapter_2/
sidebar:
    title: "Designing Data-Intensive Applications"
    url: /books/ddia/
    nav: ddia_sidebar
toc: true
---

Data models are one of the most important parts of developing software because it can define how we think about the problem that we are solving. Most applications build by laying data models on top of each other, leaving the question: how is the data represented in terms of the next lower layer?

The layers are important because it hides the complexity of each layer below it (imagine having to deal with low levels such as representing bytes of data as 1's and 0's the entire time), and allows for engineers and developers to work together more effectively. That being said, there are many types of data models, and each has it own pros and cons. It takes a lot of effort to understand one data model, so choosing the right one can be difficult. Understanding data models in a general sense can help in making these decisions.

## Relation Model Versus Document Model

The best known model today is SQL, where data is organized into relations (i.e. tables) and each relation is an unordered collection of tuples (i.e. rows). When first brought up, it was a theoretical proposal, with concerns about implementation. The roots of these relational databases is in business data processing. The use cases were mainly limited to transaction preocessing and batch processing. Other databases at the time required a lot of thought and import from developers, while the relational database's goal was to abstract that away.

Competing approaches to relational databases include network models, hierarchical models, object databases, and XML databases. Each generated hype, but never truly caught on. As computers became more powerful and connected, relational databases managed to stay relevant, and generalize well beyond their orginal scope of work. Relation databases are still used widely today, for things such as online publishing, discussion, social networks, ecommerce, gamins, etc.

### The Birth of NoSQL

NoSQL started out as a twitter hashtag to reference a meetup on open source, distributed, nonrelational databases - not any specific technology. A number of databases now associate with NoSQL, and NoSQL has retrospecively been defined as "Not Only SQL". The drive to adopt NoSQL included the following points:
* Greater scalability - large datasets or very high write throughput
* Preference for free and open source software
* Specialized query operations not well supported by relational models
* Frustration with the restriveness of relational schemas

There are many different requirements for different types of systems, and the best choice of technology can change depending on those requirements. That being said, relational databases most likely won't be going anywhere, and will be used in tandem with nonrelation databases - which is an idea called polyglot persistence. 

**Polyglot Persistence:** a term that refers to using multiple data storage technologies for varying data storage needs across an application or within smaller components of an application. Such varying data storage needs could arise in both the cases, i.e. an enterprise with multiple applications or singular components of an application needing to store data differently.
{: .notice--info}

### The Object-Relational Mismatch

Most application development is done in an object-oriented langaguge. This leads to critism of the SQL - if data is stored in relational tables, the transition alyer is required between objects between the code and the database. Object-relational mapping (ORM) tries to reduce the boilerplate code for the transition layer, but it cannot compledly do away with it. 

A one-to-many relationship can represent this. For example, on LinkedIn, a person can have worked at multiple places. This introduces the need to map between multiple tables to retrieve all the data needed. A data structure like that could be represented in a document, such as JSON. Document-oriented databases would be able to support a model like this, and some feel like this reduces the impendence mismatch (the mismatch between how the code handles data and the data models handles it). 

### Many-to-One and Many-to-Many Relationships

If a user interface has a free-text field, it can make sense to using standardized lists instead:
* Consistent style and spelling
* Ease of updating - data is kept in a single place and can be updated once
* Localization support - easy transalation
* Better search

When storing an ID or text string, it might be a question of duplication. Human-meaningful information may need to change, while human-meaningless information (such as ID) can remain the same forever - you may need to update the value that the ID refers to though. Removing duplication is the key idea behind normalization in databases.

**Noramlization:** For a database, this means storing values that can be duplicated in just one place
{: .notice--info}

The downside of normalization is that it requires many-to-one relationships that dont work well with the document model (they do work well with the relational model though). If the database does not support joins, you may need to emulate joins in code.

### Are Document Databases Repeating History?

Document databases, like older databases, work well for one-to-many relationships, but many-to-many were difficult, and joins aren't supported. This brought one many solutions, with the largest two being relational models and network models. The problems that were faced when database models were being designed then, are still some of the issues that are faced today.

#### The network model

The network model was standardized by the Conference on Data Systems Languages (CODSAYL) committee, and implemented by many vendors. This became known as the CODASYL model. This model was a generalization of the hierarchical model. Iin a hierarchical model, each record has exactly one parent, while in the CODSAYL model, a recond could have many. This allows for many-to-one and many-to-many relations be represented. The links in the records were not keys, but more similar to pointers. The only way to access a record was to follow a path along a chain of records, otherwise known as the access path. This lead to issues when querying to naviagating around in n-dimensional data spce.

The network model made code for querying and updating the database complicated and inflexible. If you wanted to access a record, but didn't have an access path, you had to write a lot of database code to retrieve the recond.

#### The relational model

All data in a relational model is laid out in the open. There are no nested structures, no access paths. All rows in a table could be viewed, and inserting rows was easy. A optimizer handles how a query is executed, which could be imagined as the access path, but this was managed by the optimizer, and the programmer rarely had to worry about them.

#### Comparison to document databases

Document databases revert back to network models by allowing for nested records. However, when it comes to relationships, it is more akin to that of a relational model using unique identifiers. In this case called a document reference and not a foriegn key.

### Relational Versus Document Databases Today

Many differences when comparing relational vs document databases. This includes fault tolerance and concurrency. The main arguements to use a document data model are:
* Schema Flexibility
* Performance
* Data Structures

Relational models counter this by having:
* Support for Joins
* Many-to-one relationships
* Many-to-many relationships

#### Which data model leads to simpler application code?

If the application uses data in a document-like structure, probably a better idea to go with a document model. Shredding the data (as in relational databases) can lead to lots of schemas and complicated (and unncessary) application code. But document models do have limiations. You cannot refer directly to nested items (but if the document is not deeply nested, this many not present a large problem). Poor support for joins may be a problem, but there are situations where many-to-many relations are not needed. If joins are needed, then it is possible to reduce that need by keeping denormalized data, but that can prove challenging. Joins can be emulated in application code, but this can often add complexity, and degrade performance.

#### Schema flexibility in the document model

Most document databases do not enforce any schema on the data. No schema means arbitrary keys and values can be added, but when reading, clients have no guarentee about what fields in a document may contain. Document databases are sometimes called schemaless, but that is misleading because there is an implcit schema, just not enforced. It is better to think of it as schema-on-read (schema is interpreted when the data is read).

Schema-on-read is similar to runtime type checking, while for schema-on-write is more similar to compiletime type checking. Both have their own pros and cons, with neither being the right solution. This is most notiable when changing the format of the data. In a document database, new values would be placed in, with a function to handle when old documents are read. When dealing with schema-on-write, a migration is needed. While schema changes have a reputation for being slow and requiring downtime, this is not entirely justified. Running `UPDATE` on a large table is likely to be slow because every row needs to be rewritten (although you can leave the new field as empty and fill it in during read time).

Schema-on-read can be more advantageous if the collection doesnt have the same structure because:
* many difference types of objects, and not feasible to put each object in its own table
* structure of the data is determined by external systems

#### Data locality for queries

Document is normally stored as a continuous string, encoded into some file type. If an entire/large portions of a document is regularly loaded into memory, storage locality would be a big advantage, but would not be possible if a document was split among many tables. Documents are encouraged to be kept fairly small to reduce the cost of loading it into memory, or when changes occur.

Locality isn't limited to document models, as some vendors allow for nested rows in a parent table. This is the idea of a multi-table index cluster table or column family.

#### Convergence of document and relational databases

Relational databases have started to support holding and editing documents. This is a good thing because as relational and document models become more similar, it will be easier to find solutions for a wider variety of needs.

## Query Langagues for Data

SQL is a declarative language and not imperative. This means that you specify the pattern of data wanted/transformed, but not how to get the data. In the case of SQL a query optimizer is utilized to decide how best to get the data. This allows for abstraction of code, easier implementation, and often is better suited to parallel execution.

### Declarative Queries on the Web

CSS and XSL are both declarative. This allows for things such as defining a backgroud color to be handled in a simple way of including a statement such as `background-color="blue"` without having to write out a lot of code to handle that event. In JavaScript, using a Document Object Model, this adds several lines of code and complexity (I am not going to write out that bit of code because it requires accessing each element of a document, iterating throught the length, classnames, and children to look for the background color to set).

### MapReduce Querying

> MapReduce is a programming model for processing large amounts of data in bulk across many machine

MapReduce is supported by some NoSQL datastores largely as a mechanism for read-only queries. It is neither a declarative or imperative language, but exists somewhere between the two. It allows for some data queries to be handled by an optimizer, and allows for some direct handling by the developer. MapReduce is fairly low-level, but must only use pure functions (i.e. only use data that is passed in, and is not allowed to query other data), but gains functionality in the fact that it can run anywhere, and rerun on failure.

Something else to note is that MapReduce is able to handle JavaScript code within a query (although some SQL databases now allow for this). This can introduce a usability problem though, as you more carefully have to manage coordinating JavaScript functions (which can often be harder than writing a single query). Something else to consider is that this reduces the opportunities for a query optimizer to enhance the performance of a query, but in MongoDB, support for declarative-like JSON functions have been added. This is leading some NoSQL systems to be somewhat recreating SQL.

**Note** SQL is not constrained to run on a single machine, and MapReduce is not the only solution for distributed query execution.
{: .notice--info}

## Graph-Like Data Models

Relational models can handle simple cases of many-to-many connections, but when it becomes more complex, it can make more sense to model data as a graph. A graph consists of vertices (nodes such as people in social networks) and edges (connections between nodes, or links between friends in a social network). Typical examples of graph models include:
* Social graphs
* The web graph
* Road or rail networks

Graphs are not restricted to homogeneous data, but con store different types of data objects consistently. There are many ways of handing graph data models.

### Property Graphs

A vertex contains:
* Unique identifier
* Set of outgoing edges
* Set of incoming edges
* Collection of properties (key-value pairs)

An edge contains:
* Unique identifier
* Vertex for the edge start
* Vertex for the edge end
* Label to describe the kind of relationship between the vertices
* Collection of properties (key-value pairs)

A good way to think about this is two relational tables. The verteices have an id, and json file of properties, while the edges have an id, two vertex ids (head and tail), a label and json for the properties of the edge. Import aspects of this model include:
* Any vertex can have an edge connecting it to another vertex
* Given any vertex, you can efficiently find incoming and outgoing edges (and traverse the graph)
* Using differenet labels, you can store several different kinds of info in a single graph, while maintaining a clean data model

### Cypher Query Language

Cypher is a declarative language for property graphs (named after a character in the matrix, and not related to ciphers in cryptography). In Cypher, each vertex is given a symbolic name, while using other parts can use those names to create edges. For example: `(Idaho) -[:WITHIN]-> (USA)`, where the edge is labeled as `WITHIN` and having `Idaho` and `USA` as the tail and head node respectively. This then allows for `MATCH` clauses to find patterns in the graph. As this is a declarative language, the developer does not need to concern themself with how a query should be executed.

### Graph Queries in SQL

Graph data can be stored in SQL, but it adds complexity and difficulty. In SQL you are required to know how far a query needs to traverse (i.e. the number of joins), while in graph SQL the amount of traversal is not needed to be known. This has been somewhat replicated in SQL with `recursive common table expressions`. In comparison, a query in a graph data model may only take 4 lines of code, while in a relational model, it may take over 25 lines of code. This shows that knowing how your data is important when picking a data model.

### Triple-Stores and SPARQL

Triple-store models are largely the same as Graph models, but use different terminologies. All information is store in a three-part statement: (subject, predicate, object). A triple's subject is similar to a vertex, with the object being one of two things:
* Value in a primative datatype
* Another vertex in the graph

#### The semantic web

The semantic web is that websites publish human-readable info, so they should publish machine readable info as well. The main idea was that triple-stores were meant to handle this idea, and creat the web of data.

#### The RDF data model

RDF model can be used within XML. It has a few quirks, as it was designed for internet-wide data exchange. The triple is often contained in the URL.

#### The SPARQL query language

SPARQL is the query langauge for triples-store using RDF. The query is more concise in SPARQL over that of Cypher. 

### The Foundation: Datalog

Datalog predates SPARQL and Cypher, and is similar to the triple-store model. Data is stored as `predicate(subject,object)`. When querying data, instead of using a `SELECT` right away, rules are defined about predicates; Rules can reference other rules and are a form of predicates. 

## Summary

Data models is a large subject. At first, data was first represented with a tree structure (i.e. hierarchical model), but ran into issues with many-to-many relationships. The relational model was introduced to handle that. When some applications struggled with relational models, NoSQL nonrelational model swere created with two main directions: `Graph` and `Document`. All three models (document, relational, graph) are used today, and each has its pros and cons for different situations.

The models listed above are not comprehensive though, with many still being built out today. 