# exceptions - Documentation PHP

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
Extending Exceptions &raquo;
&laquo; Errors in PHP 7        
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
# Exceptions
## Table of Contents- [Extending Exceptions](language.exceptions.extending.php)
PHP has an exception model similar to that of other programming
languages. An exception can be [`throw`](language.exceptions.php)n, and caught ("[`catch`](language.exceptions.php#language.exceptions.catch)ed") within
PHP. Code may be surrounded in a [`try`](language.exceptions.php) block, to facilitate the catching
of potential exceptions. Each [`try`](language.exceptions.php) must have at least one corresponding
[`catch`](language.exceptions.php#language.exceptions.catch) or [`finally`](language.exceptions.php#language.exceptions.finally) block.
If an exception is thrown and its current function scope has no [`catch`](language.exceptions.php#language.exceptions.catch)
block, the exception will "bubble up" the call stack to the calling
function until it finds a matching [`catch`](language.exceptions.php#language.exceptions.catch) block. All [`finally`](language.exceptions.php#language.exceptions.finally) blocks it encounters
along the way will be executed. If the call stack is unwound all the way to the
global scope without encountering a matching [`catch`](language.exceptions.php#language.exceptions.catch) block, the program will
terminate with a fatal error unless a global exception handler has been set.
The thrown object must be an [`instanceof`](language.operators.type.php) [Throwable](class.throwable.php).
Trying to throw an object that is not will result in a PHP Fatal Error.
As of PHP 8.0.0, the [`throw`](language.exceptions.php) keyword is an expression and may be used in any expression
context. In prior versions it was a statement and was required to be on its own line.
## catch
A [`catch`](language.exceptions.php#language.exceptions.catch) block defines how to respond to a thrown exception. A [`catch`](language.exceptions.php#language.exceptions.catch)
block defines one or more types of exception or error it can handle, and
optionally a variable to which to assign the exception. (The variable was
required prior to PHP 8.0.0.)  The first [`catch`](language.exceptions.php#language.exceptions.catch) block a thrown exception
or error encounters that matches the type of the thrown object will handle
the object.
Multiple [`catch`](language.exceptions.php#language.exceptions.catch) blocks can be used to catch different classes of
exceptions. Normal execution (when no exception is thrown within the [`try`](language.exceptions.php)
block) will continue after that last [`catch`](language.exceptions.php#language.exceptions.catch) block defined in sequence.
Exceptions can be [`throw`](language.exceptions.php)n (or re-thrown) within a [`catch`](language.exceptions.php#language.exceptions.catch) block. If not,
execution will continue after the [`catch`](language.exceptions.php#language.exceptions.catch) block that was triggered.
When an exception is thrown, code following the statement will not be
executed, and PHP will attempt to find the first matching [`catch`](language.exceptions.php#language.exceptions.catch) block.
If an exception is not caught, a PHP Fatal Error will be issued with an
"`Uncaught Exception ...`" message, unless a handler has
been defined with [set_exception_handler()](function.set-exception-handler.php).
As of PHP 7.1.0, a [`catch`](language.exceptions.php#language.exceptions.catch) block may specify multiple exceptions
using the pipe (`|`) character. This is useful for when
different exceptions from different class hierarchies are handled the
same.
As of PHP 8.0.0, the variable name for a caught exception is optional.
If not specified, the [`catch`](language.exceptions.php#language.exceptions.catch) block will still execute but will not
have access to the thrown object.
## finally
A [`finally`](language.exceptions.php#language.exceptions.finally) block may also be specified after or
instead of [`catch`](language.exceptions.php#language.exceptions.catch) blocks. Code within the [`finally`](language.exceptions.php#language.exceptions.finally) block will always be
executed after the [`try`](language.exceptions.php) and [`catch`](language.exceptions.php#language.exceptions.catch) blocks, regardless of whether an
exception has been thrown, and before normal execution resumes.
One notable interaction is between the [`finally`](language.exceptions.php#language.exceptions.finally) block and a [`return`](function.return.php) statement.
If a [`return`](function.return.php) statement is encountered inside either the [`try`](language.exceptions.php) or the [`catch`](language.exceptions.php#language.exceptions.catch) blocks,
the [`finally`](language.exceptions.php#language.exceptions.finally) block will still be executed. Moreover, the [`return`](function.return.php) statement is
evaluated when encountered, but the result will be returned after the [`finally`](language.exceptions.php#language.exceptions.finally) block
is executed. Additionally, if the [`finally`](language.exceptions.php#language.exceptions.finally) block also contains a [`return`](function.return.php) statement,
the value from the [`finally`](language.exceptions.php#language.exceptions.finally) block is returned.
Another notable interaction is between an exception thrown from within a [`try`](language.exceptions.php) block,
and an exception thrown from within a [`finally`](language.exceptions.php#language.exceptions.finally) block. If both blocks throw an exception,
then the exception thrown from the [`finally`](language.exceptions.php#language.exceptions.finally) block will be the one that is propagated,
and the exception thrown from the [`try`](language.exceptions.php) block will used as its previous exception.
## Global exception handler
If an exception is allowed to bubble up to the global scope, it may be caught
by a global exception handler if set. The [set_exception_handler()](function.set-exception-handler.php)
function can set a function that will be called in place of a [`catch`](language.exceptions.php#language.exceptions.catch) block if no
other block is invoked. The effect is essentially the same as if the entire program
were wrapped in a [`try`](language.exceptions.php)-[`catch`](language.exceptions.php#language.exceptions.catch) block with that function as the [`catch`](language.exceptions.php#language.exceptions.catch).
## Notes
**Note**: 
Internal PHP functions mainly use
[Error reporting](errorfunc.configuration.php#ini.error-reporting), only modern
[Object-oriented](language.oop5.php)
extensions use exceptions. However, errors can be easily translated to
exceptions with [ErrorException](class.errorexception.php).
This technique only works with non-fatal errors, however.
**Example #1 Converting error reporting to exceptions**
`<?phpfunction exceptions_error_handler($severity, $message, $filename, $lineno) {    throw new ErrorException($message, 0, $severity, $filename, $lineno);}set_error_handler('exceptions_error_handler');?>`
**Tip**
The [Standard PHP Library (SPL)](book.spl.php#intro.spl) provides
a good number of built-in
exceptions.
## Examples
**Example #2 Throwing an Exception**
`<?phpfunction inverse($x) {    if (!$x) {        throw new Exception('Division by zero.');    }    return 1/$x;}try {    echo inverse(5) . "\n";    echo inverse(0) . "\n";} catch (Exception $e) {    echo 'Caught exception: ',  $e->getMessage(), "\n";}// Continue executionecho "Hello World\n";?>`
The above example will output:
0.2
Caught exception: Division by zero.
Hello World
**Example #3 Exception handling with a [`finally`](language.exceptions.php#language.exceptions.finally) block**
`<?phpfunction inverse($x) {    if (!$x) {        throw new Exception('Division by zero.');    }    return 1/$x;}try {    echo inverse(5) . "\n";} catch (Exception $e) {    echo 'Caught exception: ',  $e->getMessage(), "\n";} finally {    echo "First finally.\n";}try {    echo inverse(0) . "\n";} catch (Exception $e) {    echo 'Caught exception: ',  $e->getMessage(), "\n";} finally {    echo "Second finally.\n";}// Continue executionecho "Hello World\n";?>`
The above example will output:
0.2
First finally.
Caught exception: Division by zero.
Second finally.
Hello World
**Example #4 Interaction between the [`finally`](language.exceptions.php#language.exceptions.finally) block and [`return`](function.return.php)**
`<?phpfunction test() {    try {        throw new Exception('foo');    } catch (Exception $e) {        return 'catch';    } finally {        return 'finally';    }}echo test();?>`
The above example will output:
finally
**Example #5 Nested Exception**
`<?phpclass MyException extends Exception { }class Test {    public function testing() {        try {            try {                throw new MyException('foo!');            } catch (MyException $e) {                // rethrow it                throw $e;            }        } catch (Exception $e) {            var_dump($e->getMessage());        }    }}$foo = new Test;$foo->testing();?>`
The above example will output:
string(4) "foo!"
**Example #6 Multi catch exception handling**
`<?phpclass MyException extends Exception { }class MyOtherException extends Exception { }class Test {    public function testing() {        try {            throw new MyException();        } catch (MyException | MyOtherException $e) {            var_dump(get_class($e));        }    }}$foo = new Test;$foo->testing();?>`
The above example will output:
string(11) "MyException"
**Example #7 Omitting the caught variable**
Only permitted in PHP 8.0.0 and later.
`<?phpclass SpecificException extends Exception {}function test() {    throw new SpecificException('Oopsie');}try {    test();} catch (SpecificException) {    print "A SpecificException was thrown, but we don't care about the details.";}?>`
The above example will output:
A SpecificException was thrown, but we don&#039;t care about the details.
**Example #8 Throw as an expression**
Only permitted in PHP 8.0.0 and later.
`<?phpfunction test() {    do_something_risky() or throw new Exception('It did not work');}function do_something_risky() {    return false; // Simulate failure}try {    test();} catch (Exception $e) {    print $e->getMessage();}?>`
The above example will output:
It did not work
**Example #9 Exception in try and in finally**
`<?phptry {    try {        throw new Exception(message: 'Third', previous: new Exception('Fourth'));    } finally {        throw new Exception(message: 'First', previous: new Exception('Second'));    }} catch (Exception $e) {    var_dump(        $e->getMessage(),        $e->getPrevious()->getMessage(),        $e->getPrevious()->getPrevious()->getMessage(),        $e->getPrevious()->getPrevious()->getPrevious()->getMessage(),    );}`
The above example will output:
string(5) "First"
string(6) "Second"
string(5) "Third"
string(6) "Fourth"
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/language/exceptions.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Flanguage.exceptions%0A%0A---)
[＋add a note](/manual/add-note.php?sect=language.exceptions&repo=en&redirect=https://www.php.net/manual/en/language.exceptions.php)
### User Contributed Notes 13 notes
[up](/manual/vote-note.php?id=91159&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=91159&page=language.exceptions&vote=down)
127
***ask at nilpo dot com***[ &para;](#91159)**16 years ago**
`If you intend on creating a lot of custom exceptions, you may find this code useful.  I've created an interface and an abstract exception class that ensures that all parts of the built-in Exception class are preserved in child classes.  It also properly pushes all information back to the parent constructor ensuring that nothing is lost.  This allows you to quickly create new exceptions on the fly.  It also overrides the default __toString method with a more thorough one.<?phpinterface IException{    /* Protected methods inherited from Exception class */    public function getMessage();                 // Exception message     public function getCode();                    // User-defined Exception code    public function getFile();                    // Source filename    public function getLine();                    // Source line    public function getTrace();                   // An array of the backtrace()    public function getTraceAsString();           // Formated string of trace        /* Overrideable methods inherited from Exception class */    public function __toString();                 // formated string for display    public function __construct($message = null, $code = 0);}abstract class CustomException extends Exception implements IException{    protected $message = 'Unknown exception';     // Exception message    private   $string;                            // Unknown    protected $code    = 0;                       // User-defined exception code    protected $file;                              // Source filename of exception    protected $line;                              // Source line of exception    private   $trace;                             // Unknown    public function __construct($message = null, $code = 0)    {        if (!$message) {            throw new $this('Unknown '. get_class($this));        }        parent::__construct($message, $code);    }        public function __toString()    {        return get_class($this) . " '{$this->message}' in {$this->file}({$this->line})\n"                                . "{$this->getTraceAsString()}";    }}?>Now you can create new exceptions in one line:<?phpclass TestException extends CustomException {}?>Here's a test that shows that all information is properly preserved throughout the backtrace.<?phpfunction exceptionTest(){    try {        throw new TestException();    }    catch (TestException $e) {        echo "Caught TestException ('{$e->getMessage()}')\n{$e}\n";    }    catch (Exception $e) {        echo "Caught Exception ('{$e->getMessage()}')\n{$e}\n";    }}echo '<pre>' . exceptionTest() . '</pre>';?>Here's a sample output:Caught TestException ('Unknown TestException')TestException 'Unknown TestException' in C:\xampp\htdocs\CustomException\CustomException.php(31)#0 C:\xampp\htdocs\CustomException\ExceptionTest.php(19): CustomException->__construct()#1 C:\xampp\htdocs\CustomException\ExceptionTest.php(43): exceptionTest()#2 {main}`
[up](/manual/vote-note.php?id=103819&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=103819&page=language.exceptions&vote=down)
78
***Johan***[ &para;](#103819)**14 years ago**
`Custom error handling on entire pages can avoid half rendered pages for the users:<?phpob_start();try {    /*contains all page logic     and throws error if needed*/    ...} catch (Exception $e) {  ob_end_clean();  displayErrorPage($e->getMessage());}?>`
[up](/manual/vote-note.php?id=128869&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=128869&page=language.exceptions&vote=down)
11
***tianyiw at vip dot qq dot com***[ &para;](#128869)**1 year ago**
`Easy to understand `finally`.<?phptry {    try {        echo "before\n";        1 / 0;        echo "after\n";    } finally {        echo "finally\n";    }} catch (\Throwable) {    echo "exception\n";}?># Print:beforefinallyexception`
[up](/manual/vote-note.php?id=129177&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=129177&page=language.exceptions&vote=down)
7
***jlherren***[ &para;](#129177)**1 year ago**
`As noted elsewhere, throwing an exception from the `finally` block will replace a previously thrown exception. But the original exception is magically available from the new exception's `getPrevious()`.<?phptry {    try {        throw new RuntimeException('Exception A');    } finally {        throw new RuntimeException('Exception B');    }}catch (Throwable $exception) {    echo $exception->getMessage(), "\n";    // 'previous' is magically available!    echo $exception->getPrevious()->getMessage(), "\n";}?>Will print:Exception BException A`
[up](/manual/vote-note.php?id=112507&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=112507&page=language.exceptions&vote=down)
30
***Edu***[ &para;](#112507)**12 years ago**
`The "finally" block can change the exception that has been throw by the catch block.<?phptry{        try {                throw new \Exception("Hello");        } catch(\Exception $e) {                echo $e->getMessage()." catch in\n";                throw $e;        } finally {                echo $e->getMessage()." finally \n";                throw new \Exception("Bye");        }} catch (\Exception $e) {        echo $e->getMessage()." catch out\n";}?>The output is:Hello catch inHello finally Bye catch out`
[up](/manual/vote-note.php?id=86476&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=86476&page=language.exceptions&vote=down)
24
***Shot (Piotr Szotkowski)***[ &para;](#86476)**16 years ago**
`‘Normal execution (when no exception is thrown within the try block, *or when a catch matching the thrown exception’s class is not present*) will continue after that last catch block defined in sequence.’‘If an exception is not caught, a PHP Fatal Error will be issued with an “Uncaught Exception …” message, unless a handler has been defined with set_exception_handler().’These two sentences seem a bit contradicting about what happens ‘when a catch matching the thrown exception’s class is not present’ (and the second sentence is actually correct).`
[up](/manual/vote-note.php?id=121228&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=121228&page=language.exceptions&vote=down)
14
***christof+php[AT]insypro.com***[ &para;](#121228)**8 years ago**
`In case your E_WARNING type of errors aren't catchable with try/catch you can change them to another type of error like this:<?php     set_error_handler(function($errno, $errstr, $errfile, $errline){            if($errno === E_WARNING){                // make it more serious than a warning so it can be caught                trigger_error($errstr, E_ERROR);                return true;            } else {                // fallback to default php error handler                return false;            }    });    try {            // code that might result in a E_WARNING    } catch(Exception $e){            // code to handle the E_WARNING (it's actually changed to E_ERROR at this point)    } finally {            restore_error_handler();    }?>`
[up](/manual/vote-note.php?id=121673&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=121673&page=language.exceptions&vote=down)
15
***daviddlowe dot flimm at gmail dot com***[ &para;](#121673)**7 years ago**
`Starting in PHP 7, the classes Exception and Error both implement the Throwable interface. This means, if you want to catch both Error instances and Exception instances, you should catch Throwable objects, like this:<?phptry {    throw new Error( "foobar" );    // or:    // throw new Exception( "foobar" );}catch (Throwable $e) {    var_export( $e );}?>`
[up](/manual/vote-note.php?id=117029&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=117029&page=language.exceptions&vote=down)
16
***Simo***[ &para;](#117029)**10 years ago**
`#3 is not a good example. inverse("0a") would not be caught since (bool) "0a" returns true, yet 1/"0a" casts the string to integer zero and attempts to perform the calculation.`
[up](/manual/vote-note.php?id=122434&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=122434&page=language.exceptions&vote=down)
12
***mlaopane at gmail dot com***[ &para;](#122434)**7 years ago**
`<?php/** * You can catch exceptions thrown in a deep level function */function employee(){    throw new \Exception("I am just an employee !");}function manager(){    employee();}function boss(){    try {        manager();    } catch (\Exception $e) {        echo $e->getMessage();    }}boss(); // output: "I am just an employee !"`
[up](/manual/vote-note.php?id=115240&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=115240&page=language.exceptions&vote=down)
17
***telefoontoestel at nospam dot org***[ &para;](#115240)**11 years ago**
`When using finally keep in mind that when a exit/die statement is used in the catch block it will NOT go through the finally block. <?phptry {    echo "try block<br />";    throw new Exception("test");} catch (Exception $ex) {    echo "catch block<br />";} finally {    echo "finally block<br />";}// try block// catch block// finally block?><?phptry {    echo "try block<br />";    throw new Exception("test");} catch (Exception $ex) {    echo "catch block<br />";    exit(1);} finally {    echo "finally block<br />";}// try block// catch block?>`
[up](/manual/vote-note.php?id=116273&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=116273&page=language.exceptions&vote=down)
10
***Tom Polomsk***[ &para;](#116273)**10 years ago**
`Contrary to the documentation it is possible in PHP 5.5 and higher use only try-finally blocks without any catch block.`
[up](/manual/vote-note.php?id=106696&page=language.exceptions&vote=up)
[down](/manual/vote-note.php?id=106696&page=language.exceptions&vote=down)
9
***Sawsan***[ &para;](#106696)**13 years ago**
`the following is an example of a re-thrown exception and the using of getPrevious function:<?php$name = "Name";//check if the name contains only letters, and does not contain the word nametry   {   try     {      if (preg_match('/[^a-z]/i', $name))        {           throw new Exception("$name contains character other than a-z A-Z");       }          if(strpos(strtolower($name), 'name') !== FALSE)       {          throw new Exception("$name contains the word name");       }       echo "The Name is valid";     }   catch(Exception $e)     {     throw new Exception("insert name again",0,$e);     }   } catch (Exception $e)   {   if ($e->getPrevious())   {    echo "The Previous Exception is: ".$e->getPrevious()->getMessage()."<br/>";   }   echo "The Exception is: ".$e->getMessage()."<br/>";   } ?>`
[＋add a note](/manual/add-note.php?sect=language.exceptions&repo=en&redirect=https://www.php.net/manual/en/language.exceptions.php)
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