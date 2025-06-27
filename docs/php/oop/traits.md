# traits - Documentation PHP

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
Anonymous classes &raquo;
&laquo; Object Interfaces        
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
## Traits
PHP implements a way to reuse code called Traits.
Traits are a mechanism for code reuse in single inheritance languages such as
PHP. A Trait is intended to reduce some limitations of single inheritance by
enabling a developer to reuse sets of methods freely in several independent
classes living in different class hierarchies. The semantics of the combination
of Traits and classes is defined in a way which reduces complexity, and avoids
the typical problems associated with multiple inheritance and Mixins.
A Trait is similar to a class, but only intended to group functionality in a
fine-grained and consistent way. It is not possible to instantiate a Trait on
its own. It is an addition to traditional inheritance and enables horizontal
composition of behavior; that is, the application of class members without
requiring inheritance.
**Example #1 Trait example**
`<?phptrait TraitA {    public function sayHello() {        echo 'Hello';    }}trait TraitB {    public function sayWorld() {        echo 'World';    }}class MyHelloWorld{    use TraitA, TraitB; // A class can use multiple traits    public function sayHelloWorld() {        $this->sayHello();        echo ' ';        $this->sayWorld();        echo "!\n";    }}$myHelloWorld = new MyHelloWorld();$myHelloWorld->sayHelloWorld();?>`
The above example will output:
Hello World!
### Precedence
An inherited member from a base class is overridden by a member inserted
by a Trait. The precedence order is that members from the current class
override Trait methods, which in turn override inherited methods.
**Example #2 Precedence Order Example**
An inherited method from a base class is overridden by the
method inserted into MyHelloWorld from the SayWorld Trait. The behavior is
the same for methods defined in the MyHelloWorld class. The precedence order
is that methods from the current class override Trait methods, which in
turn override methods from the base class.
`<?phpclass Base {    public function sayHello() {        echo 'Hello ';    }}trait SayWorld {    public function sayHello() {        parent::sayHello();        echo 'World!';    }}class MyHelloWorld extends Base {    use SayWorld;}$o = new MyHelloWorld();$o->sayHello();?>`
The above example will output:
Hello World!
**Example #3 Alternate Precedence Order Example**
`<?phptrait HelloWorld {    public function sayHello() {        echo 'Hello World!';    }}class TheWorldIsNotEnough {    use HelloWorld;    public function sayHello() {        echo 'Hello Universe!';    }}$o = new TheWorldIsNotEnough();$o->sayHello();?>`
The above example will output:
Hello Universe!
### Multiple Traits
Multiple Traits can be inserted into a class by listing them in the `use`
statement, separated by commas.
**Example #4 Multiple Traits Usage**
`<?phptrait Hello {    public function sayHello() {        echo 'Hello ';    }}trait World {    public function sayWorld() {        echo 'World';    }}class MyHelloWorld {    use Hello, World;    public function sayExclamationMark() {        echo '!';    }}$o = new MyHelloWorld();$o->sayHello();$o->sayWorld();$o->sayExclamationMark();?>`
The above example will output:
Hello World!
### Conflict Resolution
If two Traits insert a method with the same name, a fatal error is produced,
if the conflict is not explicitly resolved.
To resolve naming conflicts between Traits used in the same class,
the `insteadof` operator needs to be used to choose exactly
one of the conflicting methods.
Since this only allows one to exclude methods, the `as`
operator can be used to add an alias to one of the methods. Note the
`as` operator does not rename the method and it does not
affect any other method either.
**Example #5 Conflict Resolution**
In this example, Talker uses the traits A and B.
Since A and B have conflicting methods, it defines to use
the variant of smallTalk from trait B, and the variant of bigTalk from
trait A.
The Aliased_Talker makes use of the `as` operator
to be able to use B&#039;s bigTalk implementation under an additional alias
`talk`.
`<?phptrait A {    public function smallTalk() {        echo 'a';    }    public function bigTalk() {        echo 'A';    }}trait B {    public function smallTalk() {        echo 'b';    }    public function bigTalk() {        echo 'B';    }}class Talker {    use A, B {        B::smallTalk insteadof A;        A::bigTalk insteadof B;    }}class Aliased_Talker {    use A, B {        B::smallTalk insteadof A;        A::bigTalk insteadof B;        B::bigTalk as talk;    }}?>`
### Changing Method Visibility
Using the `as` syntax, one can also adjust the visibility
of the method in the exhibiting class.
**Example #6 Changing Method Visibility**
`<?phptrait HelloWorld {    public function sayHello() {        echo 'Hello World!';    }}// Change visibility of sayHelloclass MyClass1 {    use HelloWorld { sayHello as protected; }}// Alias method with changed visibility// sayHello visibility not changedclass MyClass2 {    use HelloWorld { sayHello as private myPrivateHello; }}?>`
### Traits Composed from Traits
Just as classes can make use of traits, so can other traits. By using one
or more traits in a trait definition, it can be composed partially or
entirely of the members defined in those other traits.
**Example #7 Traits Composed from Traits**
`<?phptrait Hello {    public function sayHello() {        echo 'Hello ';    }}trait World {    public function sayWorld() {        echo 'World!';    }}trait HelloWorld {    use Hello, World;}class MyHelloWorld {    use HelloWorld;}$o = new MyHelloWorld();$o->sayHello();$o->sayWorld();?>`
The above example will output:
Hello World!
### Abstract Trait Members
Traits support the use of abstract methods in order to impose requirements
upon the exhibiting class. Public, protected, and private methods are supported.
Prior to PHP 8.0.0, only public and protected abstract methods were supported.
**Caution**
As of PHP 8.0.0, the signature of a concrete method must follow the
[signature compatibility rules](language.oop5.basic.php#language.oop.lsp).
Previously, its signature might be different.
**Example #8 Express Requirements by Abstract Methods**
`<?phptrait Hello {    public function sayHelloWorld() {        echo 'Hello'.$this->getWorld();    }    abstract public function getWorld();}class MyHelloWorld {    private $world;    use Hello;    public function getWorld() {        return $this->world;    }    public function setWorld($val) {        $this->world = $val;    }}?>`
### Static Trait Members
Traits can define static variables, static methods and static properties.
**Note**: 
As of PHP 8.1.0, calling a static method, or accessing a static property directly on a trait is deprecated.
Static methods and properties should only be accessed on a class using the trait.
**Example #9 Static Variables**
`<?phptrait Counter{    public function inc()    {        static $c = 0;        $c = $c + 1;        echo "$c\n";    }}class C1{    use Counter;}class C2{    use Counter;}$o = new C1();$o->inc();$p = new C2();$p->inc();?>`
The above example will output:
1
1
**Example #10 Static Methods**
`<?phptrait StaticExample{    public static function doSomething()    {        return 'Doing something';    }}class Example{    use StaticExample;}echo Example::doSomething();?>`
The above example will output:
Doing something
**Example #11 Static Properties**
**Caution**
Prior to PHP 8.3.0, static properties defined in a trait were shared
across all classes in the same inheritance hierarchy which used that trait.
As of PHP 8.3.0, if a child class uses a trait with a static property,
it will be considered distinct from the one defined in the parent class.
`<?phptrait T{    public static $counter = 1;}class A{    use T;    public static function incrementCounter()    {        static::$counter++;    }}class B extends A{    use T;}A::incrementCounter();echo A::$counter, "\n";echo B::$counter, "\n";?>`
Output of the above example in PHP 8.3:
2
1
### Properties
Traits can also define properties.
**Example #12 Defining Properties**
`<?phptrait PropertiesTrait{    public $x = 1;}class PropertiesExample{    use PropertiesTrait;}$example = new PropertiesExample();$example->x;?>`
If a trait defines a property then a class can not define a property with
the same name unless it is compatible (same visibility and type,
readonly modifier, and initial value), otherwise a fatal error is issued.
**Example #13 Conflict Resolution**
`<?phptrait PropertiesTrait {    public $same = true;    public $different1 = false;    public bool $different2;    public bool $different3;}class PropertiesExample {    use PropertiesTrait;    public $same = true;    public $different1 = true; // Fatal error    public string $different2; // Fatal error    readonly protected bool $different3; // Fatal error}?>`
### Constants
Traits can, as of PHP 8.2.0, also define constants.
**Example #14 Defining Constants**
`<?phptrait ConstantsTrait {    public const FLAG_MUTABLE = 1;    final public const FLAG_IMMUTABLE = 5;}class ConstantsExample {    use ConstantsTrait;}$example = new ConstantsExample;echo $example::FLAG_MUTABLE;?>`
The above example will output:
1
If a trait defines a constant then a class can not define a constant with
the same name unless it is compatible (same visibility, initial value, and
finality), otherwise a fatal error is issued.
**Example #15 Conflict Resolution**
`<?phptrait ConstantsTrait {    public const FLAG_MUTABLE = 1;    final public const FLAG_IMMUTABLE = 5;}class ConstantsExample {    use ConstantsTrait;    public const FLAG_IMMUTABLE = 5; // Fatal error}?>`
### Final methods
As of PHP 8.3.0, the [final](language.oop5.final.php)
modifier can be applied using the `as` operator
to methods imported from traits. This can be used to prevent child classes
from overriding the method. However, the class that uses the trait can still
override the method.
**Example #16 Defining a method coming from a trait as `final`**
`<?phptrait CommonTrait{    public function method()    {        echo 'Hello';    }}class FinalExampleA{    use CommonTrait {        CommonTrait::method as final; // The 'final' prevents child classes from overriding the method    }}class FinalExampleB extends FinalExampleA{    public function method() {}}?>`
The above example will output
something similar to:
Fatal error: Cannot override final method FinalExampleA::method() in ...
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/language/oop5/traits.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Flanguage.oop5.traits%0A%0A---)
[＋add a note](/manual/add-note.php?sect=language.oop5.traits&repo=en&redirect=https://www.php.net/manual/en/language.oop5.traits.php)
### User Contributed Notes 25 notes
[up](/manual/vote-note.php?id=107965&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=107965&page=language.oop5.traits&vote=down)
659
***Safak Ozpinar / safakozpinar at gmail***[ &para;](#107965)**13 years ago**
`Unlike inheritance; if a trait has static properties, each class using that trait has independent instances of those properties.Example using parent class:<?phpclass TestClass {    public static $_bar;}class Foo1 extends TestClass { }class Foo2 extends TestClass { }Foo1::$_bar = 'Hello';Foo2::$_bar = 'World';echo Foo1::$_bar . ' ' . Foo2::$_bar; // Prints: World World?>Example using trait:<?phptrait TestTrait {    public static $_bar;}class Foo1 {    use TestTrait;}class Foo2 {    use TestTrait;}Foo1::$_bar = 'Hello';Foo2::$_bar = 'World';echo Foo1::$_bar . ' ' . Foo2::$_bar; // Prints: Hello World?>`
[up](/manual/vote-note.php?id=107548&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=107548&page=language.oop5.traits&vote=down)
460
***greywire at gmail dot com***[ &para;](#107548)**13 years ago**
`The best way to understand what traits are and how to use them is to look at them for what they essentially are:  language assisted copy and paste.If you can copy and paste the code from one class to another (and we've all done this, even though we try not to because its code duplication) then you have a candidate for a trait.`
[up](/manual/vote-note.php?id=113047&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=113047&page=language.oop5.traits&vote=down)
256
***Stefan W***[ &para;](#113047)**11 years ago**
`Note that the "use" operator for traits (inside a class) and the "use" operator for namespaces (outside the class) resolve names differently. "use" for namespaces always sees its arguments as absolute (starting at the global namespace):<?phpnamespace Foo\Bar;use Foo\Test;  // means \Foo\Test - the initial \ is optional?>On the other hand, "use" for traits respects the current namespace:<?phpnamespace Foo\Bar;class SomeClass {    use Foo\Test;   // means \Foo\Bar\Foo\Test}?>Together with "use" for closures, there are now three different "use" operators. They all mean different things and behave differently.`
[up](/manual/vote-note.php?id=109508&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=109508&page=language.oop5.traits&vote=down)
107
***t8 at  AT pobox dot com***[ &para;](#109508)**12 years ago**
`Another difference with traits vs inheritance is that methods defined in traits can access methods and properties of the class they're used in, including private ones.For example:<?phptrait MyTrait{  protected function accessVar()  {    return $this->var;  }}class TraitUser{  use MyTrait;  private $var = 'var';  public function getVar()  {    return $this->accessVar();  }}$t = new TraitUser();echo $t->getVar(); // -> 'var'                                                                                                                                                                                                                          ?>`
[up](/manual/vote-note.php?id=106958&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=106958&page=language.oop5.traits&vote=down)
101
***chris dot rutledge at gmail dot com***[ &para;](#106958)**13 years ago**
`It may be worth noting here that the magic constant __CLASS__ becomes even more magical - __CLASS__ will return the name of the class in which the trait is being used.for example<?phptrait sayWhere {    public function whereAmI() {        echo __CLASS__;    }}class Hello {    use sayWHere;}class World {    use sayWHere;}$a = new Hello;$a->whereAmI(); //Hello$b = new World;$b->whereAmI(); //World?>The magic constant __TRAIT__ will giev you the name of the trait`
[up](/manual/vote-note.php?id=116907&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=116907&page=language.oop5.traits&vote=down)
61
***qeremy (!) gmail***[ &para;](#116907)**10 years ago**
`Keep in mind; "final" keyword is useless in traits when directly using them, unlike extending classes / abstract classes.<?phptrait Foo {    final public function hello($s) { print "$s, hello!"; }}class Bar {    use Foo;    // Overwrite, no error    final public function hello($s) { print "hello, $s!"; }}abstract class Foo {    final public function hello($s) { print "$s, hello!"; }}class Bar extends Foo {    // Fatal error: Cannot override final method Foo::hello() in ..    final public function hello($s) { print "hello, $s!"; }}?>But this way will finalize trait methods as expected;<?phptrait FooTrait {    final public function hello($s) { print "$s, hello!"; }}abstract class Foo {    use FooTrait;}class Bar extends Foo {    // Fatal error: Cannot override final method Foo::hello() in ..    final public function hello($s) { print "hello, $s!"; }}?>`
[up](/manual/vote-note.php?id=123648&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=123648&page=language.oop5.traits&vote=down)
11
***yeu_ym at yahoo dot com***[ &para;](#123648)**6 years ago**
`Here is an example how to work with visiblity and conflicts.<?phptrait A{    private function smallTalk()    {        echo 'a';    }    private function bigTalk()    {        echo 'A';    }}trait B{    private function smallTalk()    {        echo 'b';    }    private function bigTalk()    {        echo 'B';    }}trait C{    public function smallTalk()    {        echo 'c';    }    public function bigTalk()    {        echo 'C';    }}class Talker{    use A, B, C {        //visibility for methods that will be involved in conflict resolution        B::smallTalk as public;        A::bigTalk as public;        //conflict resolution        B::smallTalk insteadof A, C;        A::bigTalk insteadof B, C;        //aliases with visibility change        B::bigTalk as public Btalk;        A::smallTalk as public asmalltalk;                //aliases only, methods already defined as public        C::bigTalk as Ctalk;        C::smallTalk as cmallstalk;    }}(new Talker)->bigTalk();//A(new Talker)->Btalk();//B(new Talker)->Ctalk();//C(new Talker)->asmalltalk();//a(new Talker)->smallTalk();//b(new Talker)->cmallstalk();//c`
[up](/manual/vote-note.php?id=128242&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=128242&page=language.oop5.traits&vote=down)
9
***JustAddingSomeAdditionalUseCase***[ &para;](#128242)**2 years ago**
`I have not seen this specific use case:"Wanting to preserve action of parent class method, the trait one calling ::parent & also the child class mehod action".// Child class.use SuperTrait {  initialize as initializeOr;}public function initialize(array &$element) {  ...  $this->initializeOr($element);}// Trait.public function initialize(array &$element) {  ...  parent::initialize($element);}// Parent class.public function initialize(array &$element) {  ...}`
[up](/manual/vote-note.php?id=119872&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=119872&page=language.oop5.traits&vote=down)
32
***canufrank***[ &para;](#119872)**8 years ago**
`A number of the notes make incorrect assertions about trait behaviour because they do not extend the class.So, while "Unlike inheritance; if a trait has static properties, each class using that trait has independent instances of those properties.Example using parent class:<?phpclass TestClass {    public static $_bar;}class Foo1 extends TestClass { }class Foo2 extends TestClass { }Foo1::$_bar = 'Hello';Foo2::$_bar = 'World';echo Foo1::$_bar . ' ' . Foo2::$_bar; // Prints: World World?>Example using trait:<?phptrait TestTrait {    public static $_bar;}class Foo1 {    use TestTrait;}class Foo2 {    use TestTrait;}Foo1::$_bar = 'Hello';Foo2::$_bar = 'World';echo Foo1::$_bar . ' ' . Foo2::$_bar; // Prints: Hello World?>"shows a correct example, simply adding<?phprequire_once('above');class Foo3 extends Foo2 {}Foo3::$_bar = 'news';echo Foo1::$_bar . ' ' . Foo2::$_bar . ' ' . Foo3::$_bar; // Prints: Hello news newsI think the best conceptual model of an incorporated trait is an advanced insertion of text, or as someone put it "language assisted copy and paste." If Foo1 and Foo2 were defined with $_bar, you would not expect them to share the instance. Similarly, you would expect Foo3 to share with Foo2, and it does.Viewing this way explains away a lot of  the 'quirks' that are observed above with final, or subsequently declared private vars,`
[up](/manual/vote-note.php?id=122773&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=122773&page=language.oop5.traits&vote=down)
15
***rawsrc***[ &para;](#122773)**7 years ago**
`About the (Safak Ozpinar / safakozpinar at gmail)'s great note, you can still have the same behavior than inheritance using trait with this approach : <?phptrait TestTrait {    public static $_bar;}class FooBar {    use TestTrait;}class Foo1 extends FooBar {}class Foo2 extends FooBar {}Foo1::$_bar = 'Hello';Foo2::$_bar = 'World';echo Foo1::$_bar . ' ' . Foo2::$_bar; // Prints: World World`
[up](/manual/vote-note.php?id=114383&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=114383&page=language.oop5.traits&vote=down)
13
***qschuler at neosyne dot com***[ &para;](#114383)**11 years ago**
`Note that you can omit a method's inclusion by excluding it from one trait in favor of the other and doing the exact same thing in the reverse way.<?phptrait A {    public function sayHello()    {        echo 'Hello from A';    }    public function sayWorld()    {        echo 'World from A';    }}trait B {    public function sayHello()    {        echo 'Hello from B';    }    public function sayWorld()    {        echo 'World from B';    }}class Talker {    use A, B {        A::sayHello insteadof B;        A::sayWorld insteadof B;        B::sayWorld insteadof A;    }}$talker = new Talker();$talker->sayHello();$talker->sayWorld();?>The method sayHello is imported, but the method sayWorld is simply excluded.`
[up](/manual/vote-note.php?id=121780&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=121780&page=language.oop5.traits&vote=down)
7
***katrinaelaine6 at gmail dot com***[ &para;](#121780)**7 years ago**
`Adding to "atorich at gmail dot com":The behavior of the magic constant __CLASS__ when used in traits is as expected if you understand traits and late static binding ([http://php.net/manual/en/language.oop5.late-static-bindings.php](http://php.net/manual/en/language.oop5.late-static-bindings.php)).<?php$format = 'Class: %-13s | get_class(): %-13s | get_called_class(): %-13s%s';trait TestTrait {    public function testMethod() {        global $format;        printf($format, __CLASS__, get_class(), get_called_class(), PHP_EOL);    }        public static function testStatic() {        global $format;        printf($format, __CLASS__, get_class(), get_called_class(), PHP_EOL);    }}trait DuplicateTrait {    public function duplMethod() {        global $format;        printf($format, __CLASS__, get_class(), get_called_class(), PHP_EOL);    }        public static function duplStatic() {        global $format;        printf($format, __CLASS__, get_class(), get_called_class(), PHP_EOL);    }}abstract class AbstractClass {        use DuplicateTrait;        public function absMethod() {        global $format;        printf($format, __CLASS__, get_class(), get_called_class(), PHP_EOL);    }        public static function absStatic() {        global $format;        printf($format, __CLASS__, get_class(), get_called_class(), PHP_EOL);    }}class BaseClass extends AbstractClass {    use TestTrait;}class TestClass extends BaseClass { }$t = new TestClass();$t->testMethod();TestClass::testStatic();$t->absMethod();TestClass::absStatic();$t->duplMethod();TestClass::duplStatic();?>Will output:Class: BaseClass     | get_class(): BaseClass     | get_called_class(): TestClass    Class: BaseClass     | get_class(): BaseClass     | get_called_class(): TestClass    Class: AbstractClass | get_class(): AbstractClass | get_called_class(): TestClass    Class: AbstractClass | get_class(): AbstractClass | get_called_class(): TestClass    Class: AbstractClass | get_class(): AbstractClass | get_called_class(): TestClass    Class: AbstractClass | get_class(): AbstractClass | get_called_class(): TestClassSince Traits are considered literal "copying/pasting" of code, it's clear how the methods defined in DuplicateTrait give the same results as the methods defined in AbstractClass.`
[up](/manual/vote-note.php?id=107735&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=107735&page=language.oop5.traits&vote=down)
18
***Edward***[ &para;](#107735)**13 years ago**
`The difference between Traits and multiple inheritance is in the inheritance part.   A trait is not inherited from, but rather included or mixed-in, thus becoming part of "this class".   Traits also provide a more controlled means of resolving conflicts that inevitably arise when using multiple inheritance in the few languages that support them (C++).  Most modern languages are going the approach of a "traits" or "mixin" style system as opposed to multiple-inheritance, largely due to the ability to control ambiguities if a method is declared in multiple "mixed-in" classes.Also, one can not "inherit" static member functions in multiple-inheritance.`
[up](/manual/vote-note.php?id=120038&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=120038&page=language.oop5.traits&vote=down)
17
***marko at newvibrations dot net***[ &para;](#120038)**8 years ago**
`As already noted, static properties and methods in trait could be accessed directly using trait. Since trait is language assisted c/p, you should be aware that static property from trait will be initialized to the value trait property had in the time of class declaration. Example:<?phptrait Beer {    protected static $type = 'Light';    public static function printed(){        echo static::$type.PHP_EOL;    }    public static function setType($type){        static::$type = $type;    }}class Ale {    use Beer;}Beer::setType("Dark");class Lager {    use Beer;}Beer::setType("Amber");header("Content-type: text/plain");Beer::printed();  // Prints: AmberAle::printed();   // Prints: LightLager::printed(); // Prints: Dark?>`
[up](/manual/vote-note.php?id=118718&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=118718&page=language.oop5.traits&vote=down)
9
***balbuf***[ &para;](#118718)**9 years ago**
`(It's already been said, but for the sake of searching on the word "relative"...)The "use" keyword to import a trait into a class will resolve relative to the current namespace and therefore should include a leading slash to represent a full path, whereas "use" at the namespace level is always absolute.`
[up](/manual/vote-note.php?id=108293&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=108293&page=language.oop5.traits&vote=down)
43
***ryan at derokorian dot com***[ &para;](#108293)**13 years ago**
`Simple singleton trait.<?phptrait singleton {        /**     * private construct, generally defined by using class     */    //private function __construct() {}        public static function getInstance() {        static $_instance = NULL;        $class = __CLASS__;        return $_instance ?: $_instance = new $class;    }        public function __clone() {        trigger_error('Cloning '.__CLASS__.' is not allowed.',E_USER_ERROR);    }        public function __wakeup() {        trigger_error('Unserializing '.__CLASS__.' is not allowed.',E_USER_ERROR);    }}/** * Example Usage */class foo {    use singleton;        private function __construct() {        $this->name = 'foo';    }}class bar {    use singleton;        private function __construct() {        $this->name = 'bar';    }}$foo = foo::getInstance();echo $foo->name;$bar = bar::getInstance();echo $bar->name;`
[up](/manual/vote-note.php?id=121823&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=121823&page=language.oop5.traits&vote=down)
5
***bscheshirwork at gmail dot com***[ &para;](#121823)**7 years ago**
`[https://3v4l.org/mFuQE](https://3v4l.org/mFuQE)1. no deprecate if same-class-named method get from trait2. replace same-named method ba to aa in Ctrait ATrait {    public function a(){        return 'Aa';    }}trait BTrait {    public function a(){        return 'Ba';    }}class C {    use ATrait{        a as aa;    }    use BTrait{        a as ba;    }        public function a() {        return static::aa() . static::ba();    }}$o = new C;echo $o->a(), "\n";class D {    use ATrait{        ATrait::a as aa;    }    use BTrait{        BTrait::a as ba;    }        public function a() {        return static::aa() . static::ba();    }}$o = new D;echo $o->a(), "\n";class E {    use ATrait{        ATrait::a as aa;        ATrait::a insteadof BTrait;    }    use BTrait{        BTrait::a as ba;    }        public function e() {        return static::aa() . static::ba();    }}$o = new E;echo $o->e(), "\n";class F {    use ATrait{        a as aa;    }    use BTrait{        a as ba;    }        public function f() {        return static::aa() . static::ba();    }}$o = new F;echo $o->f(), "\n";AaAa AaBa Deprecated: Methods with the same name as their class will not be constructors in a future version of PHP; E has a deprecated constructor in /in/mFuQE on line 48 AaBa Fatal error: Trait method a has not been applied, because there are collisions with other trait methods on F in /in/mFuQE on line 65`
[up](/manual/vote-note.php?id=119077&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=119077&page=language.oop5.traits&vote=down)
6
***Carlos Alberto Bertholdo Carucce***[ &para;](#119077)**9 years ago**
`If you want to resolve name conflicts and also change the visibility of a trait method, you'll need to declare both in the same line:trait testTrait{        public function test(){        echo 'trait test';    }    }class myClass{        use testTrait {        testTrait::test as private testTraitF;    }        public function test(){        echo 'class test';        echo '<br/>';        $this->testTraitF();    }    }$obj = new myClass(); $obj->test(); //prints both 'trait test' and 'class test'$obj->testTraitF(); //The method is not accessible (Fatal error: Call to private method myClass::testTraitF() )`
[up](/manual/vote-note.php?id=110521&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=110521&page=language.oop5.traits&vote=down)
13
***D. Marti***[ &para;](#110521)**12 years ago**
`Traits are useful for strategies, when you want the same data to be handled (filtered, sorted, etc) differently.For example, you have a list of products that you want to filter out based on some criteria (brands, specs, whatever), or sorted by different means (price, label, whatever). You can create a sorting trait that contains different functions for different sorting types (numeric, string, date, etc). You can then use this trait not only in your product class (as given in the example), but also in other classes that need similar strategies (to apply a numeric sort to some data, etc).<?phptrait SortStrategy {    private $sort_field = null;    private function string_asc($item1, $item2) {        return strnatcmp($item1[$this->sort_field], $item2[$this->sort_field]);    }    private function string_desc($item1, $item2) {        return strnatcmp($item2[$this->sort_field], $item1[$this->sort_field]);    }    private function num_asc($item1, $item2) {        if ($item1[$this->sort_field] == $item2[$this->sort_field]) return 0;        return ($item1[$this->sort_field] < $item2[$this->sort_field] ? -1 : 1 );    }    private function num_desc($item1, $item2) {        if ($item1[$this->sort_field] == $item2[$this->sort_field]) return 0;        return ($item1[$this->sort_field] > $item2[$this->sort_field] ? -1 : 1 );    }    private function date_asc($item1, $item2) {        $date1 = intval(str_replace('-', '', $item1[$this->sort_field]));        $date2 = intval(str_replace('-', '', $item2[$this->sort_field]));        if ($date1 == $date2) return 0;        return ($date1 < $date2 ? -1 : 1 );    }    private function date_desc($item1, $item2) {        $date1 = intval(str_replace('-', '', $item1[$this->sort_field]));        $date2 = intval(str_replace('-', '', $item2[$this->sort_field]));        if ($date1 == $date2) return 0;        return ($date1 > $date2 ? -1 : 1 );    }}class Product {    public $data = array();        use SortStrategy;        public function get() {        // do something to get the data, for this ex. I just included an array        $this->data = array(            101222 => array('label' => 'Awesome product', 'price' => 10.50, 'date_added' => '2012-02-01'),            101232 => array('label' => 'Not so awesome product', 'price' => 5.20, 'date_added' => '2012-03-20'),            101241 => array('label' => 'Pretty neat product', 'price' => 9.65, 'date_added' => '2012-04-15'),            101256 => array('label' => 'Freakishly cool product', 'price' => 12.55, 'date_added' => '2012-01-11'),            101219 => array('label' => 'Meh product', 'price' => 3.69, 'date_added' => '2012-06-11'),        );    }        public function sort_by($by = 'price', $type = 'asc') {        if (!preg_match('/^(asc|desc)$/', $type)) $type = 'asc';        switch ($by) {            case 'name':                $this->sort_field = 'label';                uasort($this->data, array('Product', 'string_'.$type));            break;            case 'date':                $this->sort_field = 'date_added';                uasort($this->data, array('Product', 'date_'.$type));            break;            default:                $this->sort_field = 'price';                uasort($this->data, array('Product', 'num_'.$type));        }    }}$product = new Product();$product->get();$product->sort_by('name');echo '<pre>'.print_r($product->data, true).'</pre>';?>`
[up](/manual/vote-note.php?id=115125&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=115125&page=language.oop5.traits&vote=down)
12
***Kristof***[ &para;](#115125)**11 years ago**
`don't forget you can create complex (embedded) traits as well<?phptrait Name {  // ...}trait Address {  // ...}trait Telephone {  // ...}trait Contact {  use Name, Address, Telephone;}class Customer {  use Contact;}class Invoce {  use Contact;}?>`
[up](/manual/vote-note.php?id=112295&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=112295&page=language.oop5.traits&vote=down)
4
***Oddant***[ &para;](#112295)**12 years ago**
`I think it's obvious to notice that using 'use' followed by the traits name must be seen as just copying/pasting lines of code into the place where they are used.`
[up](/manual/vote-note.php?id=125386&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=125386&page=language.oop5.traits&vote=down)
1
***guidobelluomo at gmail dot com***[ &para;](#125386)**4 years ago**
`If you override a method which was defined by a trait, calling the parent method will also call the trait's override. Therefore if you need to derive from a class which has a trait, you can extend the class without losing the trait's functionality:<?phptrait ExampleTrait{    public function output()    {        parent::output();        echo "bar<br>";    }}class Foo{    public function output()    {        echo "foo<br>";    }}class FooBar extends Foo{    use ExampleTrait;}class FooBarBaz extends FooBar{    use ExampleTrait;    public function output()    {        parent::output();        echo "baz";    }}(new FooBarBaz())->output();?>Output:foobarbaz`
[up](/manual/vote-note.php?id=120901&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=120901&page=language.oop5.traits&vote=down)
2
***cody at codysnider dot com***[ &para;](#120901)**8 years ago**
`/*DocBlocks pertaining to the class or trait will NOT be carried over when applying the trait.Results trying a couple variations on classes with and without DocBlocks that use a trait with a DocBlock*/<?php/** * @Entity */trait Foo{    protected $foo;}/** * @HasLifecycleCallbacks */class Bar{    use \Foo;        protected $bar;}class MoreBar{    use \Foo;        protected $moreBar;}$w = new \ReflectionClass('\Bar');echo $w->getName() . ":\r\n";echo $w->getDocComment() . "\r\n\r\n";$x = new \ReflectionClass('\MoreBar');echo $x->getName() . ":\r\n";echo $x->getDocComment() . "\r\n\r\n";$barObj = new \Bar();$y = new \ReflectionClass($barObj);echo $y->getName() . ":\r\n";echo $y->getDocComment() . "\r\n\r\n";foreach($y->getTraits() as $traitObj) {    echo $y->getName() . " ";    echo $traitObj->getName() . ":\r\n";    echo $traitObj->getDocComment() . "\r\n";}$moreBarObj = new \MoreBar();$z = new \ReflectionClass($moreBarObj);echo $z->getName() . " ";echo $z->getDocComment() . "\r\n\r\n";foreach($z->getTraits() as $traitObj) {    echo $z->getName() . " ";    echo $traitObj->getName() . ":\r\n";    echo $traitObj->getDocComment() . "\r\n";}`
[up](/manual/vote-note.php?id=116895&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=116895&page=language.oop5.traits&vote=down)
2
***84td84 at gmail dot com***[ &para;](#116895)**10 years ago**
`A note to 'Beispiel #9 Statische Variablen'. A trait can also have a static property:trait Counter {    static $trvar=1;    public static function stfunc() {        echo "Hello world!"    }}class C1 {    use Counter;}print "\nTRVAR: " . C1::$trvar . "\n";   //prints 1$obj = new C1();C1::stfunc();   //prints  Hello world!$obj->stfunc();   //prints Hello world!A static property (trvar) can only be accessed using the classname (C1).But a static function (stfunc) can be accessed using the classname or the instance ($obj).`
[up](/manual/vote-note.php?id=110195&page=language.oop5.traits&vote=up)
[down](/manual/vote-note.php?id=110195&page=language.oop5.traits&vote=down)
3
***artur at webprojektant dot pl***[ &para;](#110195)**12 years ago**
`Trait can not have the same name as class because it will  show: Fatal error: Cannot redeclare class`
[＋add a note](/manual/add-note.php?sect=language.oop5.traits&repo=en&redirect=https://www.php.net/manual/en/language.oop5.traits.php)
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