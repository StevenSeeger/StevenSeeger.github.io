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

