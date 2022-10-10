---
title: "Chapter 4: Encoding and Evolution"
permalink: /books/ddia/chapter_4/
sidebar:
    title: "Designing Data-Intensive Applications"
    url: /books/ddia/
    nav: ddia_sidebar
toc: true
---

> Everything changes and nothing stands still. - Heraclitus of Ephesus

Applications change over time, and our data systems should be able to evolve and adapt to the new requirements and demands. In order to do this, rolling upgrades are a wise idea for server-side applications, but client-side applications are up to the whim of the user. Both these options mean that we will have both old and new code existing at the same time. Compatibility will be needed in both directions with backward and forward compatibility.

## Formats for Encoding Data

In memory, data is kept in differenet structures, but when sent over the network, the data is encoded as a sequence of bytes, instead of a pointer to where the data object is kept. The translation of in-memory representation to a byte sequence is called `encoding` and the reverse is `decoding`.

### Language-Specific Formats

Encoding libraries are very convenient, but are language specific. For exmaple, encoding in one language, then transmitting to another is difficult. Another issue is restoring data from the encoded state - the decoding process needs to instantiate an arbitrary class, which can allow for remote execution of code. Updates to the libraries often neglect compatility changes, and same with efficiency (CPU time and size of the encoded structure).

### JSON, XML and Binary Variants

JSON and XML are two large contenders - both being equally loved and hated. They both bring standardization and ease of use to the table, but also introduce other problems.
- There is a lot of ambiguity around the encoding of numbers. XML and CSV's do not distinguish between a number and a string made up entirely of digits, and while JSON does, it doesnt distinguish between integers and floats
- JSON and XML have support for Unicode characters, but not binary strings.
- Optional schema support exists for both XML and JSON. But since many opt to not use the schema, hardcoding needs to be done to properly read the data.
- CSV doesnt have any schema, so it is up to the user to define meanings for each row and column

Despite the flaws portrayed above, JSON/XML/CSV are all good for many purposes.

#### Binary encoding

For data used internally, there is less pressure to use a lowest-common-denominator encoding format. Different formats can be more compact or faster to parse. These solutions all have different pros and cons, and depending on the situation will determine which would be best for different applications.

### Thrift and Protocol Buffers

Buffers and Thrift were created by Google and Facebook, respectively. Both require a schema for any data that is encoded, and then can be used for decoding. Each has a different way (and multiple ways) of encoding the data in different ways, which may require the reciever to have access to the original schema provided. 

#### Field tags and schema evolution

