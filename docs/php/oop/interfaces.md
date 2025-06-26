# interfaces - Documentation PHP

> Source: Documentation officielle php
> Téléchargé le 25/06/2025

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
Traits &raquo;
&laquo; Class Abstraction        
- PHP Manual      - Language Reference      - Classes and Objects      
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
## Object Interfaces
Object interfaces allow you to create code which specifies which methods and properties a
class must implement, without having to define how these methods or properties are
implemented.  Interfaces share a namespace with classes, traits, and enumerations, so they may
not use the same name.
Interfaces are defined in the same way as a class, but with the `interface`
keyword replacing the `class` keyword and without any of the methods having
their contents defined.
All methods declared in an interface must be public; this is the nature of an
interface.
In practice, interfaces serve two complementary purposes:
To allow developers to create objects of different classes that may be used interchangeably
because they implement the same interface or interfaces.  A common example is multiple database access services,
multiple payment gateways, or different caching strategies.  Different implementations may
be swapped out without requiring any changes to the code that uses them.
To allow a function or method to accept and operate on a parameter that conforms to an
interface, while not caring what else the object may do or how it is implemented. These interfaces
are often named like `Iterable`, `Cacheable`, `Renderable`,
or so on to describe the significance of the behavior.
Interfaces may define
[magic methods](language.oop5.magic.php) to require implementing classes to
implement those methods.
**Note**: 
Although they are supported, including [constructors](language.oop5.decon.php#language.oop5.decon.constructor)
in interfaces is strongly discouraged. Doing so significantly reduces the flexibility of the object implementing the
interface.  Additionally, constructors are not enforced by inheritance rules, which can cause inconsistent
and unexpected behavior.
### implements
To implement an interface, the `implements` operator is used.
All methods in the interface must be implemented within a class; failure to do
so will result in a fatal error. Classes may implement more than one interface
if desired by separating each interface with a comma.
**Warning**
A class that implements an interface may use a different name for its parameters than
the interface.  However, as of PHP 8.0 the language supports [named arguments](functions.arguments.php#functions.named-arguments), which means
callers may rely on the parameter name in the interface.  For that reason, it is strongly
recommended that developers use the same parameter names as the interface being implemented.
**Note**: 
Interfaces can be extended like classes using the [extends](language.oop5.inheritance.php) 
operator.
**Note**: 
The class implementing the interface must declare all methods in the interface
with a [compatible signature](language.oop5.basic.php#language.oop.lsp). A class can implement multiple interfaces
which declare a method with the same name. In this case, the implementation must follow the
[signature compatibility rules](language.oop5.basic.php#language.oop.lsp) for all the interfaces. So
[covariance and contravariance](language.oop5.variance.php) can be applied.
### Constants
It&#039;s possible for interfaces to have constants. Interface constants work exactly 
like [class constants](language.oop5.constants.php).
Prior to PHP 8.1.0, they cannot be overridden by a class/interface that inherits them.
### Properties
As of PHP 8.4.0, interfaces may also declare properties.
If they do, the declaration must specify if the property is to be readable,
writeable, or both.
The interface declaration applies only to public read and write access.
An class may satisfy an interface property in multiple ways.
It may define a public property.
It may define a public
[virtual property](language.oop5.property-hooks.php#language.oop5.property-hooks.virtual)
that implements only the corresponding hook.
Or a read property may be satisfied by a `readonly` property.
However, an interface property that is settable may not be `readonly`.
**Example #1 Interface properties example**
`<?phpinterface I{    // An implementing class MUST have a publicly-readable property,    // but whether or not it's publicly settable is unrestricted.    public string $readable { get; }    // An implementing class MUST have a publicly-writeable property,    // but whether or not it's publicly readable is unrestricted.    public string $writeable { set; }    // An implementing class MUST have a property that is both publicly    // readable and publicly writeable.    public string $both { get; set; }}// This class implements all three properties as traditional, un-hooked// properties. That's entirely valid.class C1 implements I{    public string $readable;    public string $writeable;    public string $both;}// This class implements all three properties using just the hooks// that are requested.  This is also entirely valid.class C2 implements I{    private string $written = '';    private string $all = '';    // Uses only a get hook to create a virtual property.    // This satisfies the "public get" requirement.    // It is not writeable, but that is not required by the interface.    public string $readable { get => strtoupper($this->writeable); }    // The interface only requires the property be settable,    // but also including get operations is entirely valid.    // This example creates a virtual property, which is fine.    public string $writeable {        get => $this->written;        set {            $this->written = $value;        }    }    // This property requires both read and write be possible,    // so we need to either implement both, or allow it to have    // the default behavior.    public string $both {        get => $this->all;        set {            $this->all = strtoupper($value);        }    }}?>`
### Examples
**Example #2 Interface example**
`<?php// Declare the interface 'Template'interface Template{    public function setVariable($name, $var);    public function getHtml($template);}// Implement the interface// This will workclass WorkingTemplate implements Template{    private $vars = [];      public function setVariable($name, $var)    {        $this->vars[$name] = $var;    }      public function getHtml($template)    {        foreach($this->vars as $name => $value) {            $template = str_replace('{' . $name . '}', $value, $template);        }         return $template;    }}// This will not work// Fatal error: Class BadTemplate contains 1 abstract methods// and must therefore be declared abstract (Template::getHtml)class BadTemplate implements Template{    private $vars = [];      public function setVariable($name, $var)    {        $this->vars[$name] = $var;    }}?>`
**Example #3 Extendable Interfaces**
`<?phpinterface A{    public function foo();}interface B extends A{    public function baz(Baz $baz);}// This will workclass C implements B{    public function foo()    {    }    public function baz(Baz $baz)    {    }}// This will not work and result in a fatal errorclass D implements B{    public function foo()    {    }    public function baz(Foo $foo)    {    }}?>`
**Example #4 Variance compatibility with multiple interfaces**
`<?phpclass Foo {}class Bar extends Foo {}interface A {    public function myfunc(Foo $arg): Foo;}interface B {    public function myfunc(Bar $arg): Bar;}class MyClass implements A, B{    public function myfunc(Foo $arg): Bar    {        return new Bar();    }}?>`
**Example #5 Multiple interface inheritance**
`<?phpinterface A{    public function foo();}interface B{    public function bar();}interface C extends A, B{    public function baz();}class D implements C{    public function foo()    {    }    public function bar()    {    }    public function baz()    {    }}?>`
**Example #6 Interfaces with constants**
`<?phpinterface A{    const B = 'Interface constant';}// Prints: Interface constantecho A::B;class B implements A{    const B = 'Class constant';}// Prints: Class constant// Prior to PHP 8.1.0, this will however not work because it was not// allowed to override constants.echo B::B;?>`
**Example #7 Interfaces with abstract classes**
`<?phpinterface A{    public function foo(string $s): string;    public function bar(int $i): int;}// An abstract class may implement only a portion of an interface.// Classes that extend the abstract class must implement the rest.abstract class B implements A{    public function foo(string $s): string    {        return $s . PHP_EOL;    }}class C extends B{    public function bar(int $i): int    {        return $i * 2;    }}?>`
**Example #8 Extending and implementing simultaneously**
`<?phpclass One{    /* ... */}interface Usable{    /* ... */}interface Updatable{    /* ... */}// The keyword order here is important. 'extends' must come first.class Two extends One implements Usable, Updatable{    /* ... */}?>`
An interface, together with type declarations, provides a good way to make sure
that a particular object contains particular methods. See
[instanceof](language.operators.type.php) operator and
[type declarations](language.types.declarations.php).
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/language/oop5/interfaces.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Flanguage.oop5.interfaces%0A%0A---)
[＋add a note](/manual/add-note.php?sect=language.oop5.interfaces&repo=en&redirect=https://www.php.net/manual/en/language.oop5.interfaces.php)
### User Contributed Notes 4 notes
[up](/manual/vote-note.php?id=102755&page=language.oop5.interfaces&vote=up)
[down](/manual/vote-note.php?id=102755&page=language.oop5.interfaces&vote=down)
37
***thanhn2001 at gmail dot com***[ &para;](#102755)**14 years ago**
`PHP prevents interface a contant to be overridden by a class/interface that DIRECTLY inherits it.  However, further inheritance allows it.  That means that interface constants are not final as mentioned in a previous comment.  Is this a bug or a feature?<?phpinterface a{    const b = 'Interface constant';}// Prints: Interface constantecho a::b;class b implements a{}// This works!!!class c extends b{    const b = 'Class constant';}echo c::b;?>`
[up](/manual/vote-note.php?id=126731&page=language.oop5.interfaces&vote=up)
[down](/manual/vote-note.php?id=126731&page=language.oop5.interfaces&vote=down)
22
***vcnbianchi***[ &para;](#126731)**3 years ago**
`Just as all interface methods are public, all interface methods are abstract as well.`
[up](/manual/vote-note.php?id=115529&page=language.oop5.interfaces&vote=up)
[down](/manual/vote-note.php?id=115529&page=language.oop5.interfaces&vote=down)
5
***williebegoode at att dot net***[ &para;](#115529)**10 years ago**
`In their book on Design Patterns, Erich Gamma and his associates (AKA: "The Gang of Four") use the term "interface" and "abstract class" interchangeably. In working with PHP and design patterns, the interface, while clearly a "contract" of what to include in an implementation is also a helpful guide for both re-use and making changes. As long as the implemented changes follow the interface (whether it is an interface or abstract class with abstract methods), large complex programs can be safely updated without having to re-code an entire program or module.In PHP coding with object interfaces (as a keyword) and "interfaces" in the more general context of use that includes both object interfaces and abstract classes, the purpose of "loose binding" (loosely bound objects) for ease of change and re-use is a helpful way to think about both uses of the  term "interface." The focus shifts from "contractual" to "loose binding" for the purpose of cooperative development and re-use.`
[up](/manual/vote-note.php?id=125893&page=language.oop5.interfaces&vote=up)
[down](/manual/vote-note.php?id=125893&page=language.oop5.interfaces&vote=down)
-1
***xedin dot unknown at gmail dot com***[ &para;](#125893)**4 years ago**
`This page says that if extending multiple interfaces with the same methods, the signature must be compatible. But this is not all there is to it: the order of `extends` matters. This is a known issue, and while it is disputable whether or not it is a bug, one should be aware of it, and code interfaces with this in mind.[https://bugs.php.net/bug.php?id=67270](https://bugs.php.net/bug.php?id=67270)[https://bugs.php.net/bug.php?id=76361](https://bugs.php.net/bug.php?id=76361)[https://bugs.php.net/bug.php?id=80785](https://bugs.php.net/bug.php?id=80785)`
[＋add a note](/manual/add-note.php?sect=language.oop5.interfaces&repo=en&redirect=https://www.php.net/manual/en/language.oop5.interfaces.php)
[Classes and Objects](language.oop5.php)
[Introduction](oop5.intro.php)
[The Basics](language.oop5.basic.php)
[Properties](language.oop5.properties.php)
[Property Hooks](language.oop5.property-hooks.php)
[Class Constants](language.oop5.constants.php)
[Autoloading Classes](language.oop5.autoload.php)
[Constructors and Destructors](language.oop5.decon.php)
[Visibility](language.oop5.visibility.php)
[Object Inheritance](language.oop5.inheritance.php)
[Scope Resolution Operator (::)](language.oop5.paamayim-nekudotayim.php)
[Static Keyword](language.oop5.static.php)
[Class Abstraction](language.oop5.abstract.php)
[Object Interfaces](language.oop5.interfaces.php)
[Traits](language.oop5.traits.php)
[Anonymous classes](language.oop5.anonymous.php)
[Overloading](language.oop5.overloading.php)
[Object Iteration](language.oop5.iterations.php)
[Magic Methods](language.oop5.magic.php)
[Final Keyword](language.oop5.final.php)
[Object Cloning](language.oop5.cloning.php)
[Comparing Objects](language.oop5.object-comparison.php)
[Late Static Bindings](language.oop5.late-static-bindings.php)
[Objects and references](language.oop5.references.php)
[Object Serialization](language.oop5.serialization.php)
[Covariance and Contravariance](language.oop5.variance.php)
[Lazy Objects](language.oop5.lazy-objects.php)
[OOP Changelog](language.oop5.changelog.php)
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