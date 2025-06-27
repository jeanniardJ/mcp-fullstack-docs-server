# inheritance - Documentation PHP

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
Scope Resolution Operator (::) &raquo;
&laquo; Visibility        
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
## Object Inheritance
Inheritance is a well-established programming principle, and PHP makes use
of this principle in its object model. This principle will affect the way
many classes and objects relate to one another.
For example, when extending a class, the subclass inherits all of the
public and protected methods, properties and constants from the parent class.
Unless a class overrides
those methods, they will retain their original functionality.
This is useful for defining and abstracting functionality, and permits the
implementation of additional functionality in similar objects without the
need to reimplement all of the shared functionality.
Private methods of a parent class are not accessible to a child class. As a result,
child classes may reimplement a private method themselves without regard for normal
inheritance rules.  Prior to PHP 8.0.0, however, `final` and `static`
restrictions were applied to private methods.  As of PHP 8.0.0, the only private method
restriction that is enforced is `private final` constructors, as that
is a common way to "disable" the constructor when using static factory methods instead.
The [visibility](language.oop5.visibility.php)
of methods, properties and constants can be relaxed, e.g. a
`protected` method can be marked as
`public`, but they cannot be restricted, e.g.
marking a `public` property as `private`.
An exception are constructors, whose visibility can be restricted, e.g.
a `public` constructor can be marked as `private`
in a child class.
**Note**: 
Unless autoloading is used, the classes must be defined before they are
used. If a class extends another, then the parent class must be declared 
before the child class structure. This rule applies to classes that inherit 
other classes and interfaces.
**Note**: 
It is not allowed to override a read-write property with a [readonly property](language.oop5.properties.php#language.oop5.properties.readonly-properties) or vice versa.
`<?phpclass A {    public int $prop;}class B extends A {    // Illegal: read-write -> readonly    public readonly int $prop;}?>`
**Example #1 Inheritance Example**
`<?phpclass Foo{    public function printItem($string)    {        echo 'Foo: ' . $string . PHP_EOL;    }        public function printPHP()    {        echo 'PHP is great.' . PHP_EOL;    }}class Bar extends Foo{    public function printItem($string)    {        echo 'Bar: ' . $string . PHP_EOL;    }}$foo = new Foo();$bar = new Bar();$foo->printItem('baz'); // Output: 'Foo: baz'$foo->printPHP();       // Output: 'PHP is great' $bar->printItem('baz'); // Output: 'Bar: baz'$bar->printPHP();       // Output: 'PHP is great'?>`
### Return Type Compatibility with Internal Classes
Prior to PHP 8.1, most internal classes or methods didn&#039;t declare their return types,
and any return type was allowed when extending them.
As of PHP 8.1.0, most internal methods started to "tentatively" declare their return type,
in that case the return type of methods should be compatible with the parent being extended;
otherwise, a deprecation notice is emitted.
Note that lack of an explicit return declaration is also considered a signature mismatch,
and thus results in the deprecation notice.
If the return type cannot be declared for an overriding method due to PHP cross-version compatibility concerns,
a [ReturnTypeWillChange](class.returntypewillchange.php) attribute can be added to silence the deprecation notice.
**Example #2 The overriding method does not declare any return type**
`<?phpclass MyDateTime extends DateTime{    public function modify(string $modifier) { return false; }} // "Deprecated: Return type of MyDateTime::modify(string $modifier) should either be compatible with DateTime::modify(string $modifier): DateTime|false, or the #[\ReturnTypeWillChange] attribute should be used to temporarily suppress the notice" as of PHP 8.1.0?>`
**Example #3 The overriding method declares a wrong return type**
`<?phpclass MyDateTime extends DateTime{    public function modify(string $modifier): ?DateTime { return null; }} // "Deprecated: Return type of MyDateTime::modify(string $modifier): ?DateTime should either be compatible with DateTime::modify(string $modifier): DateTime|false, or the #[\ReturnTypeWillChange] attribute should be used to temporarily suppress the notice" as of PHP 8.1.0?>`
**Example #4 The overriding method declares a wrong return type without a deprecation notice**
`<?phpclass MyDateTime extends DateTime{    /**     * @return DateTime|false     */    #[\ReturnTypeWillChange]    public function modify(string $modifier) { return false; }} // No notice is triggered ?>`
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/language/oop5/inheritance.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Flanguage.oop5.inheritance%0A%0A---)
[＋add a note](/manual/add-note.php?sect=language.oop5.inheritance&repo=en&redirect=https://www.php.net/manual/en/language.oop5.inheritance.php)
### User Contributed Notes 6 notes
[up](/manual/vote-note.php?id=97333&page=language.oop5.inheritance&vote=up)
[down](/manual/vote-note.php?id=97333&page=language.oop5.inheritance&vote=down)
214
***jackdracona at msn dot com***[ &para;](#97333)**15 years ago**
`Here is some clarification about PHP inheritance – there is a lot of bad information on the net.  PHP does support Multi-level inheritance.  (I tested it using version 5.2.9).  It does not support multiple inheritance. This means that you cannot have one class extend 2 other classes (see the extends keyword).  However, you can have one class extend another, which extends another, and so on.  Example: <?phpclass A {        // more code here} class B extends A {        // more code here} class C extends B {        // more code here}  $someObj = new A();  // no problems$someOtherObj = new B(); // no problems$lastObj = new C(); // still no problems ?>`
[up](/manual/vote-note.php?id=121211&page=language.oop5.inheritance&vote=up)
[down](/manual/vote-note.php?id=121211&page=language.oop5.inheritance&vote=down)
104
***Mohammad Istanbouly***[ &para;](#121211)**8 years ago**
`I think the best way for beginners to understand inheritance is through a real example so here is a simple example I can gave to you <?phpclass Person{    public $name;    protected $age;    private $phone;    public function talk(){        //Do stuff here    }    protected function walk(){        //Do stuff here    }    private function swim(){        //Do stuff here    }}class Tom extends Person{    /*Since Tom class extends Person class this means         that class Tom is a child class and class person is         the parent class and child class will inherit all public         and protected members(properties and methods) from        the parent class*/     /*So class Tom will have these properties and methods*/     //public $name;     //protected $age;     //public function talk(){}     //protected function walk(){}     //but it will not inherit the private members      //this is all what Object inheritance means}`
[up](/manual/vote-note.php?id=117570&page=language.oop5.inheritance&vote=up)
[down](/manual/vote-note.php?id=117570&page=language.oop5.inheritance&vote=down)
20
***akashwebdev at gmail dot com***[ &para;](#117570)**9 years ago**
`The Idea that multiple inheritence is not supported is correct but with tratits this can be reviewed.for e.g. <?phptrait  custom{     public function hello()     {          echo "hello";     }}trait custom2{       public function hello()       {            echo "hello2";       }}class inheritsCustom{        use custom, custom2        {              custom2::hello insteadof custom;        }}$obj = new inheritsCustom();$obj->hello();?>`
[up](/manual/vote-note.php?id=94288&page=language.oop5.inheritance&vote=up)
[down](/manual/vote-note.php?id=94288&page=language.oop5.inheritance&vote=down)
15
***jarrod at squarecrow dot com***[ &para;](#94288)**15 years ago**
`You can force a class to be strictly an inheritable class by using the "abstract" keyword. When you define a class with abstract, any attempt to instantiate a separate instance of it will result in a fatal error. This is useful for situations like a base class where it would be inherited by multiple child classes yet you want to restrict the ability to instantiate it by itself.Example........<?phpabstract class Cheese{      //can ONLY be inherited by another class}class Cheddar extends Cheese{}$dinner = new Cheese; //fatal error$lunch = new Cheddar; //works!?>`
[up](/manual/vote-note.php?id=100005&page=language.oop5.inheritance&vote=up)
[down](/manual/vote-note.php?id=100005&page=language.oop5.inheritance&vote=down)
16
***strata_ranger at hotmail dot com***[ &para;](#100005)**14 years ago**
`I was recently extending a PEAR class when I encountered a situation where I wanted to call a constructor two levels up the class hierarchy, ignoring the immediate parent.  In such a case, you need to explicitly reference the class name using the :: operator.Fortunately, just like using the 'parent' keyword PHP correctly recognizes that you are calling the function from a protected context inside the object's class hierarchy.E.g:<?phpclass foo{  public function something()  {    echo __CLASS__; // foo    var_dump($this);  }}class foo_bar extends foo{  public function something()  {    echo __CLASS__; // foo_bar    var_dump($this);  }}class foo_bar_baz extends foo_bar{  public function something()  {    echo __CLASS__; // foo_bar_baz    var_dump($this);  }  public function call()  {    echo self::something(); // self    echo parent::something(); // parent    echo foo::something(); // grandparent  }}error_reporting(-1);$obj = new foo_bar_baz();$obj->call();// Output similar to:// foo_bar_baz// object(foo_bar_baz)[1]// foo_bar// object(foo_bar_baz)[1]// foo// object(foo_bar_baz)[1]?>`
[up](/manual/vote-note.php?id=129990&page=language.oop5.inheritance&vote=up)
[down](/manual/vote-note.php?id=129990&page=language.oop5.inheritance&vote=down)
2
***ignacio at inek dot com dot ar***[ &para;](#129990)**5 months ago**
`In case you have a public readonly property in a class you need to extend, adding other properties, this can be a way to do it:<?phpclass A {    public function __construct(        public readonly int $prop    ) {}}class B extends A {    public function __construct(        int $prop,        public readonly int $prop2    ) {        parent::__construct($prop);    }}?>`
[＋add a note](/manual/add-note.php?sect=language.oop5.inheritance&repo=en&redirect=https://www.php.net/manual/en/language.oop5.inheritance.php)
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