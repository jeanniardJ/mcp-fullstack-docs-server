# namespaces - Documentation PHP

> Source: Documentation officielle php
> Téléchargé le 27/06/2025

---

Downloads                              
Documentation                              
Get Involved                              
Help                              
Search docs
Getting Started
Introduction
A simple tutorial
Language Reference
Basic syntax
Types
Variables
Constants
Expressions
Operators
Control Structures
Functions
Classes and Objects
Namespaces
Enumerations
Errors
Exceptions
Fibers
Generators
Attributes
References Explained
Predefined Variables
Predefined Exceptions
Predefined Interfaces and Classes
Predefined Attributes
Context options and parameters
Supported Protocols and Wrappers
Security
Introduction
General considerations
Installed as CGI binary
Installed as an Apache module
Session Security
Filesystem Security
Database Security
Error Reporting
User Submitted Data
Hiding PHP
Keeping Current
Features
HTTP authentication with PHP
Cookies
Sessions
Handling file uploads
Using remote files
Connection handling
Persistent Database Connections
Command line usage
Garbage Collection
DTrace Dynamic Tracing
Function Reference
Affecting PHP's Behaviour
Audio Formats Manipulation
Authentication Services
Command Line Specific Extensions
Compression and Archive Extensions
Cryptography Extensions
Database Extensions
Date and Time Related Extensions
File System Related Extensions
Human Language and Character Encoding Support
Image Processing and Generation
Mail Related Extensions
Mathematical Extensions
Non-Text MIME Output
Process Control Extensions
Other Basic Extensions
Other Services
Search Engine Extensions
Server Specific Extensions
Session Extensions
Text Processing
Variable and Type Related Extensions
Web Services
Windows Only Extensions
XML Manipulation
GUI Extensions
Keyboard Shortcuts?
This help
j
Next menu item
k
Previous menu item
g p
Previous man page
g n
Next man page
G
Scroll to bottom
g g
Scroll to top
g h
Goto homepage
g s
Goto search(current page)
/
Focus search box
Overview &raquo;
&laquo; OOP Changelog        
- PHP Manual      - Language Reference      
Change language:
English
German
Spanish
French
Italian
Japanese
Brazilian Portuguese
Russian
Turkish
Ukrainian
Chinese (Simplified)
Other
# Namespaces
## Table of Contents- [Overview](language.namespaces.rationale.php)- [Namespaces](language.namespaces.definition.php)- [Sub-namespaces](language.namespaces.nested.php)- [Defining multiple namespaces in the same file](language.namespaces.definitionmultiple.php)- [Basics](language.namespaces.basics.php)- [Namespaces and dynamic language features](language.namespaces.dynamic.php)- [namespace keyword and __NAMESPACE__](language.namespaces.nsconstants.php)- [Aliasing and Importing](language.namespaces.importing.php)- [Global space](language.namespaces.global.php)- [Fallback to global space](language.namespaces.fallback.php)- [Name resolution rules](language.namespaces.rules.php)- [FAQ](language.namespaces.faq.php)
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/language/namespaces.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Flanguage.namespaces%0A%0A---)
[＋add a note](/manual/add-note.php?sect=language.namespaces&repo=en&redirect=https://www.php.net/manual/en/language.namespaces.php)
### User Contributed Notes 4 notes
[up](/manual/vote-note.php?id=104136&page=language.namespaces&vote=up)
[down](/manual/vote-note.php?id=104136&page=language.namespaces&vote=down)
259
***Anonymous***[ &para;](#104136)**14 years ago**
`The keyword 'use' has two different applications, but the reserved word table links to here.It can apply to namespace constucts:file1:<?php namespace foo;  class Cat {     static function says() {echo 'meoow';}  } ?>file2:<?php namespace bar;  class Dog {    static function says() {echo 'ruff';}  } ?>file3:<?php namespace animate;  class Animal {    static function breathes() {echo 'air';}  } ?>file4:<?php namespace fub;  include 'file1.php';  include 'file2.php';  include 'file3.php';  use foo as feline;  use bar as canine;  use animate;  echo \feline\Cat::says(), "<br />\n";  echo \canine\Dog::says(), "<br />\n";  echo \animate\Animal::breathes(), "<br />\n";  ?>Note that felineCat::says()should be\feline\Cat::says()(and similar for the others)but this comment form deletes the backslash (why???) The 'use' keyword also applies to closure constructs:<?php function getTotal($products_costs, $tax)    {        $total = 0.00;                $callback =            function ($pricePerItem) use ($tax, &$total)            {                                $total += $pricePerItem * ($tax + 1.0);            };                array_walk($products_costs, $callback);        return round($total, 2);    }?>`
[up](/manual/vote-note.php?id=119306&page=language.namespaces&vote=up)
[down](/manual/vote-note.php?id=119306&page=language.namespaces&vote=down)
29
***Anonymous***[ &para;](#119306)**9 years ago**
`Tested on PHP 7.0.5, WindowsThe line "use animate;" equals the line "use animate as animate;"but the "use other\animate;" equals "use other\animate as animate;"file1:<?php namespace foo;  class Cat {     static function says() {echo 'meoow';}  } ?>file2:<?php namespace bar;  class Dog {    static function says() {echo 'ruff';}  } ?>file3:<?php namespace other\animate;  class Animal {    static function breathes() {echo 'air';}  } ?>file4:<?php namespace fub;  include 'file1.php';  include 'file2.php';  include 'file3.php';  use foo as feline;  use bar as canine;  use other\animate;       //use other\animate as animate;  echo feline\Cat::says(), "<br />\n";  echo canine\Dog::says(), "<br />\n";  echo \animate\Animal::breathes(), "<br />\n";  ?>`
[up](/manual/vote-note.php?id=118554&page=language.namespaces&vote=up)
[down](/manual/vote-note.php?id=118554&page=language.namespaces&vote=down)
16
***varuninorbit at yahoo dot co dot in***[ &para;](#118554)**9 years ago**
`here is a simple example to use namespace<?phpnamespace app\a{    class one{       public static function _1(){        echo 'a one _1<br>';       }    }}namespace app\b{    class one{        public static function _2(){            echo 'b one _2<br>';        }    }}namespace app{    echo a\one::_1();    echo b\one::_2();    echo a\two::_1();}namespace app\a{    class two{       public static function _1(){        echo 'a two _1<br>';       }    }}prints a one _1b one _2a two _1`
[up](/manual/vote-note.php?id=116959&page=language.namespaces&vote=up)
[down](/manual/vote-note.php?id=116959&page=language.namespaces&vote=down)
15
***davidkennedy85 at gmail dot com***[ &para;](#116959)**10 years ago**
`In addition to using namespaces and closures, the use keyword has another new meaning as of PHP 5.4 - using traits:<?phptrait Hello {    public function sayHello() {        echo 'Hello ';    }}trait World {    public function sayWorld() {        echo 'World';    }}class MyHelloWorld {    use Hello, World;    public function sayExclamationMark() {        echo '!';    }}$o = new MyHelloWorld();$o->sayHello();$o->sayWorld();$o->sayExclamationMark();?>More info here: [http://php.net/manual/en/language.oop5.traits.php](http://php.net/manual/en/language.oop5.traits.php)`
[＋add a note](/manual/add-note.php?sect=language.namespaces&repo=en&redirect=https://www.php.net/manual/en/language.namespaces.php)
[Language Reference](langref.php)
[Basic syntax](language.basic-syntax.php)
[Types](language.types.php)
[Variables](language.variables.php)
[Constants](language.constants.php)
[Expressions](language.expressions.php)
[Operators](language.operators.php)
[Control Structures](language.control-structures.php)
[Functions](language.functions.php)
[Classes and Objects](language.oop5.php)
[Namespaces](language.namespaces.php)
[Enumerations](language.enumerations.php)
[Errors](language.errors.php)
[Exceptions](language.exceptions.php)
[Fibers](language.fibers.php)
[Generators](language.generators.php)
[Attributes](language.attributes.php)
[References Explained](language.references.php)
[Predefined Variables](reserved.variables.php)
[Predefined Exceptions](reserved.exceptions.php)
[Predefined Interfaces and Classes](reserved.interfaces.php)
[Predefined Attributes](reserved.attributes.php)
[Context options and parameters](context.php)
[Supported Protocols and Wrappers](wrappers.php)
- [Copyright &copy; 2001-2025 The PHP Documentation Group](/manual/en/copyright.php)
- [My PHP.net](/my.php)
- [Contact](/contact.php)
- [Other PHP.net sites](/sites.php)
- [Privacy policy](/privacy.php)
[](javascript:;)
↑ and ↓ to navigate •
Enter to select •
Esc to close
Press Enter without
selection to search using Google