# classes-objects - Documentation PHP

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
Properties &raquo;
&laquo; Introduction        
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
## The Basics
### class
Basic class definitions begin with the
keyword `class`, followed by a class name,
followed by a pair of curly braces which enclose the definitions
of the properties and methods belonging to the class.
The class name can be any valid label, provided it is not a
PHP [reserved word](reserved.php).
As of PHP 8.4.0, using a single underscore `_` as a
class name is deprecated.
A valid class name starts with a letter or underscore,
followed by any number of letters, numbers, or underscores.
As a regular expression, it would be expressed thus:
`^[a-zA-Z_\x80-\xff][a-zA-Z0-9_\x80-\xff]*$`.
A class may contain its
own [constants](language.oop5.constants.php), [variables](language.oop5.properties.php)
(called "properties"), and functions (called "methods").
**Example #1 Simple Class definition**
`<?phpclass SimpleClass{    // property declaration    public $var = 'a default value';    // method declaration    public function displayVar() {        echo $this->var;    }}?>`
The pseudo-variable $this is available when a
method is called from within an object context.
$this is the value of the calling object.
**Warning**
Calling a non-static method statically throws an
[Error](class.error.php).
Prior to PHP 8.0.0, this would generate a deprecation notice,
and $this would be undefined.
**Example #2 Some examples of the $this pseudo-variable**
`<?phpclass A{    function foo()    {        if (isset($this)) {            echo '$this is defined (';            echo get_class($this);            echo ")\n";        } else {            echo "\$this is not defined.\n";        }    }}class B{    function bar()    {        A::foo();    }}$a = new A();$a->foo();A::foo();$b = new B();$b->bar();B::bar();?>`
Output of the above example in PHP 7:
$this is defined (A)
Deprecated: Non-static method A::foo() should not be called statically in %s  on line 27
$this is not defined.
Deprecated: Non-static method A::foo() should not be called statically in %s  on line 20
$this is not defined.
Deprecated: Non-static method B::bar() should not be called statically in %s  on line 32
Deprecated: Non-static method A::foo() should not be called statically in %s  on line 20
$this is not defined.
Output of the above example in PHP 8:
$this is defined (A)
Fatal error: Uncaught Error: Non-static method A::foo() cannot be called statically in %s :27
Stack trace:
#0 {main}
thrown in %s  on line 27
#### Readonly classes
As of PHP 8.2.0, a class can be marked with the
readonly modifier.
Marking a class as readonly will add the
[readonly modifier](language.oop5.properties.php#language.oop5.properties.readonly-properties)
to every declared property, and prevent the creation of
[dynamic properties](language.oop5.properties.php#language.oop5.properties.dynamic-properties).
Moreover, it is impossible to add support for them by using the
[AllowDynamicProperties](class.allowdynamicproperties.php) attribute. Attempting to do so
will trigger a compile-time error.
`<?php#[\AllowDynamicProperties]readonly class Foo {}// Fatal error: Cannot apply #[AllowDynamicProperties] to readonly class Foo?>`
As neither untyped nor static properties can be marked with the
`readonly` modifier, readonly classes cannot declare
them either:
`<?phpreadonly class Foo{    public $bar;}// Fatal error: Readonly property Foo::$bar must have type?>`
`<?phpreadonly class Foo{    public static int $bar;}// Fatal error: Readonly class Foo cannot declare static properties?>`
A readonly class can be
[extended](language.oop5.basic.php#language.oop5.basic.extends)
if, and only if, the child class is also a
readonly class.
### new
To create an instance of a class, the `new` keyword must
be used.  An object will always be created unless the object has a
[constructor](language.oop5.decon.php) defined that throws an
[exception](language.exceptions.php) on error. Classes
should be defined before instantiation (and in some cases this is a
requirement).
If a variable containing a [string](language.types.string.php) with the name of a class is used with
`new`, a new instance of that class will be created. If
the class is in a namespace, its fully qualified name must be used when
doing this.
**Note**: 
If there are no arguments to be passed to the class&#039;s constructor,
parentheses after the class name may be omitted.
**Example #3 Creating an instance**
`<?phpclass SimpleClass {}$instance = new SimpleClass();var_dump($instance);// This can also be done with a variable:$className = 'SimpleClass';$instance = new $className(); // new SimpleClass()var_dump($instance);?>`
As of PHP 8.0.0, using `new` with arbitrary expressions
is supported. This allows more complex instantiation if the expression
produces a [string](language.types.string.php). The expressions must be wrapped in parentheses.
**Example #4 Creating an instance using an arbitrary expression**
In the given example we show multiple examples of valid arbitrary expressions that produce a class name.
This shows a call to a function, string concatenation, and the **`::class`** constant.
`<?phpclass ClassA extends \stdClass {}class ClassB extends \stdClass {}class ClassC extends ClassB {}class ClassD extends ClassA {}function getSomeClass(): string{    return 'ClassA';}var_dump(new (getSomeClass()));var_dump(new ('Class' . 'B'));var_dump(new ('Class' . 'C'));var_dump(new (ClassD::class));?>`
Output of the above example in PHP 8:
object(ClassA)#1 (0) {
}
object(ClassB)#1 (0) {
}
object(ClassC)#1 (0) {
}
object(ClassD)#1 (0) {
}
In the class context, it is possible to create a new object by
`new self` and `new parent`.
When assigning an already created instance of a class to a new variable, the new variable
will access the same instance as the object that was assigned. This
behaviour is the same when passing instances to a function. A copy
of an already created object can be made by
[cloning](language.oop5.cloning.php) it.
**Example #5 Object Assignment**
`<?phpclass SimpleClass {    public string $var;}$instance = new SimpleClass();$assigned   =  $instance;$reference  =& $instance;$instance->var = '$assigned will have this value';$instance = null; // $instance and $reference become nullvar_dump($instance);var_dump($reference);var_dump($assigned);?>`
The above example will output:
NULL
NULL
object(SimpleClass)#1 (1) {
["var"]=>
string(30) "$assigned will have this value"
}
It&#039;s possible to create instances of an object in a couple of ways:
**Example #6 Creating new objects**
`<?phpclass Test{    public static function getNew()    {        return new static();    }}class Child extends Test {}$obj1 = new Test(); // By the class name$obj2 = new $obj1(); // Through the variable containing an objectvar_dump($obj1 !== $obj2);$obj3 = Test::getNew(); // By the class methodvar_dump($obj3 instanceof Test);$obj4 = Child::getNew(); // Through a child class methodvar_dump($obj4 instanceof Child);?>`
The above example will output:
bool(true)
bool(true)
bool(true)
It is possible to access a member of a newly created object
in a single expression:
**Example #7 Access member of newly created object**
`<?phpecho (new DateTime())->format('Y'), PHP_EOL;// surrounding parentheses are optional as of PHP 8.4.0echo new DateTime()->format('Y'), PHP_EOL;?>`
The above example will output
something similar to:
2025
2025
**Note**: 
Prior to PHP 7.1, the arguments are not evaluated if there is no constructor
function defined.
### Properties and methods
Class properties and methods live in separate "namespaces", so it is
possible to have a property and a method with the same name. Referring to
both a property and a method has the same notation, and whether a property
will be accessed or a method will be called, solely depends on the context,
i.e. whether the usage is a variable access or a function call.
**Example #8 Property access vs. method call**
`<?phpclass Foo{    public $bar = 'property';        public function bar() {        return 'method';    }}$obj = new Foo();echo $obj->bar, PHP_EOL, $obj->bar(), PHP_EOL;`
The above example will output:
property
method
That means that calling an anonymous
function which has been assigned to a property is not directly
possible. Instead the property has to be assigned to a variable first, for
instance. It is possible to call such a property directly
by enclosing it in parentheses.
**Example #9 Calling an anonymous function stored in a property**
`<?phpclass Foo{    public $bar;        public function __construct() {        $this->bar = function() {            return 42;        };    }}$obj = new Foo();echo ($obj->bar)(), PHP_EOL;`
The above example will output:
42
### extends
A class can inherit the constants, methods, and properties of another class by
using the keyword `extends` in the class
declaration. It is not possible to extend multiple classes; a
class can only inherit from one base class.
The inherited constants, methods, and properties can be overridden by
redeclaring them with the same name defined in the parent
class. However, if the parent class has defined a method or constant
as [final](language.oop5.final.php),
they may not be overridden.  It is possible to access the overridden
methods or static properties by referencing them
with [parent::](language.oop5.paamayim-nekudotayim.php).
**Note**: 
As of PHP 8.1.0, constants may be declared as final.
**Example #10 Simple Class Inheritance**
`<?phpclass SimpleClass{    function displayVar()    {        echo "Parent class\n";    }}class ExtendClass extends SimpleClass{    // Redefine the parent method    function displayVar()    {        echo "Extending class\n";        parent::displayVar();    }}$extended = new ExtendClass();$extended->displayVar();?>`
The above example will output:
Extending class
a default value
#### Signature compatibility rules
When overriding a method, its signature must be compatible with the parent
method. Otherwise, a fatal error is emitted, or, prior to PHP 8.0.0, an
**`[E_WARNING](errorfunc.constants.php#constant.e-warning)`** level error is generated.
A signature is compatible if it respects the
[variance](language.oop5.variance.php) rules, makes a
mandatory parameter optional, adds only optional new parameters and
doesn&#039;t restrict but only relaxes the visibility.
This is known as the Liskov Substitution Principle, or LSP for short.
The [constructor](language.oop5.decon.php#language.oop5.decon.constructor),
and `private` methods are exempt from these signature
compatibility rules, and thus won&#039;t emit a fatal error in case of a
signature mismatch.
**Example #11 Compatible child methods**
`<?phpclass Base{    public function foo(int $a) {        echo "Valid\n";    }}class Extend1 extends Base{    function foo(int $a = 5)    {        parent::foo($a);    }}class Extend2 extends Base{    function foo(int $a, $b = 5)    {        parent::foo($a);    }}$extended1 = new Extend1();$extended1->foo();$extended2 = new Extend2();$extended2->foo(1);`
The above example will output:
Valid
Valid
The following examples demonstrate that a child method which removes a parameter, or makes an optional
parameter mandatory, is not compatible with the parent method.
**Example #12 Fatal error when a child method removes a parameter**
`<?phpclass Base{    public function foo(int $a = 5) {        echo "Valid\n";    }}class Extend extends Base{    function foo()    {        parent::foo(1);    }}`
Output of the above example in PHP 8 is similar to:
Fatal error: Declaration of Extend::foo() must be compatible with Base::foo(int $a = 5) in /in/evtlq on line 13
**Example #13 Fatal error when a child method makes an optional parameter mandatory**
`<?phpclass Base{    public function foo(int $a = 5) {        echo "Valid\n";    }}class Extend extends Base{    function foo(int $a)    {        parent::foo($a);    }}`
Output of the above example in PHP 8 is similar to:
Fatal error: Declaration of Extend::foo(int $a) must be compatible with Base::foo(int $a = 5) in /in/qJXVC on line 13
**Warning**
Renaming a method&#039;s parameter in a child class is not a signature
incompatibility. However, this is discouraged as it will result in a
runtime [Error](class.error.php) if
[named arguments](functions.arguments.php#functions.named-arguments)
are used.
**Example #14 Error when using named arguments and parameters were renamed in a child class**
`<?phpclass A {    public function test($foo, $bar) {}}class B extends A {    public function test($a, $b) {}}$obj = new B;// Pass parameters according to A::test() contract$obj->test(foo: "foo", bar: "bar"); // ERROR!`
The above example will output
something similar to:
Fatal error: Uncaught Error: Unknown named parameter $foo in /in/XaaeN:14
Stack trace:
#0 {main}
thrown in /in/XaaeN on line 14
### ::class
The `class` keyword is also used for class
name resolution.
To obtain the fully qualified name of a class `ClassName`
use `ClassName::class`. This is particularly useful with
[namespaced](language.namespaces.php) classes.
**Example #15 Class name resolution**
`<?phpnamespace NS {    class ClassName {    }        echo ClassName::class;}?>`
The above example will output:
NS\ClassName
**Note**: 
The class name resolution using `::class` is a
compile time transformation. That means at the time the class name string
is created no autoloading has happened yet. As a consequence, class names
are expanded even if the class does not exist. No error is issued in
that case.
**Example #16 Missing class name resolution**
`<?phpprint Does\Not\Exist::class;?>`
The above example will output:
Does\Not\Exist
As of PHP 8.0.0, `::class` may also be used on
objects. This resolution happens at runtime, not compile time. Its effect is
the same as calling [get_class()](function.get-class.php) on the object.
**Example #17 Object name resolution**
`<?phpnamespace NS {    class ClassName {    }    $c = new ClassName();    print $c::class;}?>`
The above example will output:
NS\ClassName
### Nullsafe methods and properties
As of PHP 8.0.0, properties and methods may also be accessed with the
"nullsafe" operator instead: `?->`. The nullsafe operator
works the same as property or method access as above, except that if the
object being dereferenced is **`[null](reserved.constants.php#constant.null)`** then **`[null](reserved.constants.php#constant.null)`**
will be returned rather than an exception thrown. If the dereference is part of a
chain, the rest of the chain is skipped.
The effect is similar to wrapping each access in an [is_null()](function.is-null.php)
check first, but more compact.
**Example #18 Nullsafe Operator**
`<?php// As of PHP 8.0.0, this line:$result = $repository?->getUser(5)?->name;// Is equivalent to the following code block:if (is_null($repository)) {    $result = null;} else {    $user = $repository->getUser(5);    if (is_null($user)) {        $result = null;    } else {        $result = $user->name;    }}?>`
**Note**: 
The nullsafe operator is best used when null is considered a valid and expected
possible value for a property or method return. For indicating an error,
a thrown exception is preferable.
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/language/oop5/basic.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Flanguage.oop5.basic%0A%0A---)
[＋add a note](/manual/add-note.php?sect=language.oop5.basic&repo=en&redirect=https://www.php.net/manual/en/language.oop5.basic.php)
### User Contributed Notes 11 notes
[up](/manual/vote-note.php?id=79856&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=79856&page=language.oop5.basic&vote=down)
654
***aaron at thatone dot com***[ &para;](#79856)**17 years ago**
`I was confused at first about object assignment, because it's not quite the same as normal assignment or assignment by reference. But I think I've figured out what's going on.First, think of variables in PHP as data slots. Each one is a name that points to a data slot that can hold a value that is one of the basic data types: a number, a string, a boolean, etc. When you create a reference, you are making a second name that points at the same data slot. When you assign one variable to another, you are copying the contents of one data slot to another data slot.Now, the trick is that object instances are not like the basic data types. They cannot be held in the data slots directly. Instead, an object's "handle" goes in the data slot. This is an identifier that points at one particular instance of an obect. So, the object handle, although not directly visible to the programmer, is one of the basic datatypes. What makes this tricky is that when you take a variable which holds an object handle, and you assign it to another variable, that other variable gets a copy of the same object handle. This means that both variables can change the state of the same object instance. But they are not references, so if one of the variables is assigned a new value, it does not affect the other variable.<?php// Assignment of an objectClass Object{   public $foo="bar";};$objectVar = new Object();$reference =& $objectVar;$assignment = $objectVar//// $objectVar --->+---------+//                |(handle1)----+// $reference --->+---------+   |//                              |//                +---------+   |// $assignment -->|(handle1)----+//                +---------+   |//                              |//                              v//                  Object(1):foo="bar"//?>$assignment has a different data slot from $objectVar, but its data slot holds a handle to the same object. This makes it behave in some ways like a reference. If you use the variable $objectVar to change the state of the Object instance, those changes also show up under $assignment, because it is pointing at that same Object instance.<?php$objectVar->foo = "qux";print_r( $objectVar );print_r( $reference );print_r( $assignment );//// $objectVar --->+---------+//                |(handle1)----+// $reference --->+---------+   |//                              |//                +---------+   |// $assignment -->|(handle1)----+//                +---------+   |//                              |//                              v//                  Object(1):foo="qux"//?>But it is not exactly the same as a reference. If you null out $objectVar, you replace the handle in its data slot with NULL. This means that $reference, which points at the same data slot, will also be NULL. But $assignment, which is a different data slot, will still hold its copy of the handle to the Object instance, so it will not be NULL.<?php$objectVar = null;print_r($objectVar);print_r($reference);print_r($assignment);//// $objectVar --->+---------+//                |  NULL   | // $reference --->+---------+//                           //                +---------+// $assignment -->|(handle1)----+//                +---------+   |//                              |//                              v//                  Object(1):foo="qux"?>`
[up](/manual/vote-note.php?id=120909&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=120909&page=language.oop5.basic&vote=down)
90
***kStarbe at gmail point com***[ &para;](#120909)**8 years ago**
`You start using :: in second example although the static concept has not been explained. This is not easy to discover when you are starting from the basics.`
[up](/manual/vote-note.php?id=100314&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=100314&page=language.oop5.basic&vote=down)
131
***Doug***[ &para;](#100314)**14 years ago**
`What is the difference between  $this  and  self ?Inside a class definition, $this refers to the current object, while  self  refers to the current class.It is necessary to refer to a class element using  self ,and refer to an object element using  $this .Note also how an object variable must be preceded by a keyword in its definition.The following example illustrates a few cases:<?phpclass Classy {const       STAT = 'S' ; // no dollar sign for constants (they are always static)static     $stat = 'Static' ;public     $publ = 'Public' ;private    $priv = 'Private' ;protected  $prot = 'Protected' ;function __construct( ){  }public function showMe( ){    print '<br> self::STAT: '  .  self::STAT ; // refer to a (static) constant like this    print '<br> self::$stat: ' . self::$stat ; // static variable    print '<br>$this->stat: '  . $this->stat ; // legal, but not what you might think: empty result    print '<br>$this->publ: '  . $this->publ ; // refer to an object variable like this    print '<br>' ;}}$me = new Classy( ) ;$me->showMe( ) ;/* Produces this output:self::STAT: Sself::$stat: Static$this->stat:$this->publ: Public*/?>`
[up](/manual/vote-note.php?id=126640&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=126640&page=language.oop5.basic&vote=down)
8
***johannes dot kingma at gmail dot com***[ &para;](#126640)**3 years ago**
`BEWARE! Like Hayley Watson pointed out class names are not case sensitive. <?phpclass Foo{}class foo{} // Fatal error: Cannot declare class foo, because the name is already in use?>As well as<?phpclass BAR{}$bar = new Bar();echo get_class($bar);?> Is perfectly fine and will return 'BAR'.This has implications on autoloading classes though. The standard spl_autoload function will strtolower the class name to cope with case in-sensitiveness and thus the class BAR can only be found if the file name is bar.php (or another variety if an extension was registered with spl_autoload_extensions(); ) not BAR.php for a case sensitive file and operating system like linux. Windows file system is case sensitive but the OS is not  and there for autoloading BAR.php will work.`
[up](/manual/vote-note.php?id=85220&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=85220&page=language.oop5.basic&vote=down)
72
***wbcarts at juno dot com***[ &para;](#85220)**16 years ago**
`CLASSES and OBJECTS that represent the "Ideal World"Wouldn't it be great to get the lawn mowed by saying $son->mowLawn()? Assuming the function mowLawn() is defined, and you have a son that doesn't throw errors, the lawn will be mowed. In the following example; let objects of type Line3D measure their own length in 3-dimensional space. Why should I or PHP have to provide another method from outside this class to calculate length, when the class itself holds all the neccessary data and has the education to make the calculation for itself?<?php/* * Point3D.php * * Represents one locaton or position in 3-dimensional space * using an (x, y, z) coordinate system. */class Point3D{    public $x;    public $y;    public $z;                  // the x coordinate of this Point.    /*     * use the x and y variables inherited from Point.php.     */    public function __construct($xCoord=0, $yCoord=0, $zCoord=0)    {        $this->x = $xCoord;    $this->y = $yCoord;        $this->z = $zCoord;    }    /*     * the (String) representation of this Point as "Point3D(x, y, z)".     */    public function __toString()    {        return 'Point3D(x=' . $this->x . ', y=' . $this->y . ', z=' . $this->z . ')';    }}/* * Line3D.php * * Represents one Line in 3-dimensional space using two Point3D objects. */class Line3D{    $start;    $end;    public function __construct($xCoord1=0, $yCoord1=0, $zCoord1=0, $xCoord2=1, $yCoord2=1, $zCoord2=1)    {        $this->start = new Point3D($xCoord1, $yCoord1, $zCoord1);        $this->end = new Point3D($xCoord2, $yCoord2, $zCoord2);    }    /*     * calculate the length of this Line in 3-dimensional space.     */     public function getLength()    {        return sqrt(            pow($this->start->x - $this->end->x, 2) +            pow($this->start->y - $this->end->y, 2) +            pow($this->start->z - $this->end->z, 2)        );    }    /*     * The (String) representation of this Line as "Line3D[start, end, length]".     */    public function __toString()    {        return 'Line3D[start=' . $this->start .            ', end=' . $this->end .            ', length=' . $this->getLength() . ']';    }}/* * create and display objects of type Line3D. */echo '<p>' . (new Line3D()) . "</p>\n";echo '<p>' . (new Line3D(0, 0, 0, 100, 100, 0)) . "</p>\n";echo '<p>' . (new Line3D(0, 0, 0, 100, 100, 100)) . "</p>\n";?>  <--  The results look like this  -->Line3D[start=Point3D(x=0, y=0, z=0), end=Point3D(x=1, y=1, z=1), length=1.73205080757]Line3D[start=Point3D(x=0, y=0, z=0), end=Point3D(x=100, y=100, z=0), length=141.421356237]Line3D[start=Point3D(x=0, y=0, z=0), end=Point3D(x=100, y=100, z=100), length=173.205080757]My absolute favorite thing about OOP is that "good" objects keep themselves in check. I mean really, it's the exact same thing in reality... like, if you hire a plumber to fix your kitchen sink, wouldn't you expect him to figure out the best plan of attack? Wouldn't he dislike the fact that you want to control the whole job? Wouldn't you expect him to not give you additional problems? And for god's sake, it is too much to ask that he cleans up before he leaves?I say, design your classes well, so they can do their jobs uninterrupted... who like bad news? And, if your classes and objects are well defined, educated, and have all the necessary data to work on (like the examples above do), you won't have to micro-manage the whole program from outside of the class. In other words... create an object, and LET IT RIP!`
[up](/manual/vote-note.php?id=122293&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=122293&page=language.oop5.basic&vote=down)
25
***Hayley Watson***[ &para;](#122293)**7 years ago**
`Class names are case-insensitive:<?phpclass Foo{}class foo{} //Fatal error.?>Any casing can be used to refer to the class<?phpclass bAr{}$t = new Bar();$u = new bar();echo ($t instanceof $u) ? "true" : "false"; // "true"echo ($t instanceof BAR) ? "true" : "false"; // "true"echo is_a($u, 'baR') ? "true" : "false"; // "true"?>But the case used when the class was defined is preserved as "canonical":<?phpecho get_class($t); // "bAr"?>And, as always, "case-insensitivity" only applies to ASCII.<?phpclass пасха{}class Пасха{} // valid$p = new ПАСХА(); // Uncaught warning.?>`
[up](/manual/vote-note.php?id=127136&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=127136&page=language.oop5.basic&vote=down)
7
***pawel dot zimnowodzki at gmail dot com***[ &para;](#127136)**3 years ago**
`Although there is no null-safe operator for not existed array keys I found workaround for it: ($array['not_existed_key'] ?? null)?->methodName()`
[up](/manual/vote-note.php?id=92958&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=92958&page=language.oop5.basic&vote=down)
31
***moty66 at gmail dot com***[ &para;](#92958)**15 years ago**
`I hope that this will help to understand how to work with static variables inside a class<?phpclass a {    public static $foo = 'I am foo';    public $bar = 'I am bar';        public static function getFoo() { echo self::$foo;    }    public static function setFoo() { self::$foo = 'I am a new foo'; }    public function getBar() { echo $this->bar;    }            }$ob = new a();a::getFoo();     // output: I am foo    $ob->getFoo();    // output: I am foo//a::getBar();     // fatal error: using $this not in object context$ob->getBar();    // output: I am bar                // If you keep $bar non static this will work                // but if bar was static, then var_dump($this->bar) will output null // unset($ob);a::setFoo();    // The same effect as if you called $ob->setFoo(); because $foo is static$ob = new a();     // This will have no effects on $foo$ob->getFoo();    // output: I am a new foo ?>RegardsMotaz Abuthiab`
[up](/manual/vote-note.php?id=92123&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=92123&page=language.oop5.basic&vote=down)
38
***Notes on stdClass***[ &para;](#92123)**15 years ago**
`stdClass is the default PHP object. stdClass has no properties, methods or parent. It does not support magic methods, and implements no interfaces.When you cast a scalar or array as Object, you get an instance of stdClass. You can use stdClass whenever you need a generic object instance.<?php// ways of creating stdClass instances$x = new stdClass;$y = (object) null;        // same as above$z = (object) 'a';         // creates property 'scalar' = 'a'$a = (object) array('property1' => 1, 'property2' => 'b');?>stdClass is NOT a base class! PHP classes do not automatically inherit from any class. All classes are standalone, unless they explicitly extend another class. PHP differs from many object-oriented languages in this respect.<?php// CTest does not derive from stdClassclass CTest {    public $property1;}$t = new CTest;var_dump($t instanceof stdClass);            // falsevar_dump(is_subclass_of($t, 'stdClass'));    // falseecho get_class($t) . "\n";                   // 'CTest'echo get_parent_class($t) . "\n";            // false (no parent)?>You cannot define a class named 'stdClass' in your code. That name is already used by the system. You can define a class named 'Object'.You could define a class that extends stdClass, but you would get no benefit, as stdClass does nothing.(tested on PHP 5.2.8)`
[up](/manual/vote-note.php?id=86235&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=86235&page=language.oop5.basic&vote=down)
21
***Jeffrey***[ &para;](#86235)**16 years ago**
`A PHP Class can be used for several things, but at the most basic level, you'll use classes to "organize and deal with like-minded data". Here's what I mean by "organizing like-minded data". First, start with unorganized data.<?php$customer_name;$item_name;$item_price;$customer_address;$item_qty;$item_total;?>Now to organize the data into PHP classes:<?phpclass Customer {  $name;          // same as $customer_name  $address;       // same as $customer_address}class Item {  $name;          // same as $item_name  $price;         // same as $item_price  $qty;           // same as $item_qty  $total;         // same as $item_total}?>Now here's what I mean by "dealing" with the data. Note: The data is already organized, so that in itself makes writing new functions extremely easy.<?phpclass Customer {  public $name, $address;                   // the data for this class...  // function to deal with user-input / validation  // function to build string for output  // function to write -> database  // function to  read <- database  // etc, etc}class Item {  public $name, $price, $qty, $total;        // the data for this class...  // function to calculate total  // function to format numbers  // function to deal with user-input / validation  // function to build string for output  // function to write -> database  // function to  read <- database  // etc, etc}?>Imagination that each function you write only calls the bits of data in that class. Some functions may access all the data, while other functions may only access one piece of data. If each function revolves around the data inside, then you have created a good class.`
[up](/manual/vote-note.php?id=122844&page=language.oop5.basic&vote=up)
[down](/manual/vote-note.php?id=122844&page=language.oop5.basic&vote=down)
4
***Anonymous***[ &para;](#122844)**7 years ago**
`At first I was also confused by the assignment vs referencing but here's how I was finally able to get my head around it. This is another example which is somewhat similar to one of the comments but can be helpful to those who did not understand the first example. Imagine object instances as rooms where you can store and manipulate your properties and functions.  The variable that contains the object simply holds 'a key' to this room and thus access to the object. When you assign this variable to another new variable, what you are doing is you're making a copy of the key and giving it to this new variable. That means these two variable now have access to the same 'room' (object) and can thus get in and manipulate the values. However, when you create a reference, what you doing is you're making the variables SHARE the same key. They both have access to the room. If one of the variable is given a new key, then the key that they are sharing is replaced and they now share a new different key. This does not affect the other variable with a copy of the old key...that variable still has access to the first room`
[＋add a note](/manual/add-note.php?sect=language.oop5.basic&repo=en&redirect=https://www.php.net/manual/en/language.oop5.basic.php)
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