# command-line - Documentation PHP

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
Differences to other SAPIs &raquo;
&laquo; Persistent Database Connections        
- PHP Manual      - Features      
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
# Using PHP from the command line
## Table of Contents- [Differences to other SAPIs](features.commandline.differences.php)- [Options](features.commandline.options.php)- [Usage](features.commandline.usage.php)- [I/O streams](features.commandline.io-streams.php)- [Interactive shell](features.commandline.interactive.php)- [Built-in web server](features.commandline.webserver.php)- [INI settings](features.commandline.ini.php)
## Introduction
The main focus of CLI SAPI
is for developing shell applications with PHP. There
are quite a few differences between the CLI SAPI and other
SAPIs which are explained in this chapter. It is worth
mentioning that CLI and CGI are different
SAPIs although they do share many of the same behaviors.
The CLI SAPI is enabled by default using
**--enable-cli**, but may be disabled using
the **--disable-cli** option when running
**./configure**.
The name, location and existence of the CLI/CGI
binaries will differ depending on how PHP is installed on your system. By
default when executing **make**, both the CGI
and CLI are built and placed as sapi/cgi/php-cgi and
sapi/cli/php respectively, in your PHP source directory.
You will note that both are named php. What happens during
**make install** depends on your configure line. If a module
SAPI is chosen during configure, such as apxs, or the
**--disable-cgi** option is used, the CLI is
copied to {PREFIX}/bin/php during
**make install** otherwise the CGI is placed
there. So, for example, if **--with-apxs** is
in your configure line then the CLI is copied to {PREFIX}/bin/php
during **make install**. If you want to override
the installation of the CGI binary, use make
install-cli after **make install**. Alternatively you
can specify **--disable-cgi** in your configure
line.
**Note**: 
Because both **--enable-cli** and
**--enable-cgi** are enabled by default,
simply having **--enable-cli** in your
configure line does not necessarily mean the CLI will be copied as
{PREFIX}/bin/php during **make install**.
The CLI binary is distributed in the main folder as 
php.exe on Windows. The CGI version is
distributed as php-cgi.exe. Additionally, a 
php-win.exe is distributed if PHP is configured using
**--enable-cli-win32**. This does the same as
the CLI version, except that it doesn&#039;t output anything and thus provides
no console.
**Note**: 
**What SAPI do I have?**
From a shell, typing **php -v** will tell you
whether php is CGI or CLI. See
also the function [php_sapi_name()](function.php-sapi-name.php) and the constant
**`[PHP_SAPI](reserved.constants.php#constant.php-sapi)`**.
**Note**: 
A Unix `man`ual page is available by typing man
php in the shell environment.
### Found A Problem?
[Learn How To Improve This Page](https://github.com/php/doc-base/blob/master/README.md)
•
[Submit a Pull Request](https://github.com/php/doc-en/blob/master/features/commandline.xml)
•
[Report a Bug](https://github.com/php/doc-en/issues/new?body=From%20manual%20page:%20https:%2F%2Fphp.net%2Ffeatures.commandline%0A%0A---)
[＋add a note](/manual/add-note.php?sect=features.commandline&repo=en&redirect=https://www.php.net/manual/en/features.commandline.php)
### User Contributed Notes 33 notes
[up](/manual/vote-note.php?id=108883&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=108883&page=features.commandline&vote=down)
120
***sep16 at psu dot edu***[ &para;](#108883)**13 years ago**
`You can easily parse command line arguments into the $_GET variable by using the parse_str() function.<?phpparse_str(implode('&', array_slice($argv, 1)), $_GET);?>It behaves exactly like you'd expect with cgi-php.$ php -f somefile.php a=1 b[]=2 b[]=3This will set $_GET['a'] to '1' and $_GET['b'] to array('2', '3').Even better, instead of putting that line in every file, take advantage of PHP's auto_prepend_file directive.  Put that line in its own file and set the auto_prepend_file directive in your cli-specific php.ini like so:auto_prepend_file = "/etc/php/cli-php5.3/local.prepend.php"It will be automatically prepended to any PHP file run from the command line.`
[up](/manual/vote-note.php?id=119901&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=119901&page=features.commandline&vote=down)
28
***ohcc at 163 dot com***[ &para;](#119901)**8 years ago**
`use " instead of ' on windows when using the cli version with -rphp -r "echo 1" -- correctphp -r 'echo 1'  PHP Parse error:  syntax error, unexpected ''echo' (T_ENCAPSED_AND_WHITESPACE), expecting end of file in Command line code on line 1`
[up](/manual/vote-note.php?id=113224&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=113224&page=features.commandline&vote=down)
22
***PSIKYO at mail dot dlut dot edu dot cn***[ &para;](#113224)**11 years ago**
`If you edit a php file in windows, upload and run it on linux with command line method. You may encounter a running problem probably like that:[root@ItsCloud02 wsdl]# ./lnxcli.phpExtension './lnxcli.php' not present.Or you may encounter some other strange problem.Care the enter key. In windows environment, enter key generate two binary characters '0D0A'. But in Linux, enter key generate just only a 'OA'.I wish it can help someone if you are using windows to code php and run it as a command line program on linux.`
[up](/manual/vote-note.php?id=121914&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=121914&page=features.commandline&vote=down)
25
***apmuthu at usa dot net***[ &para;](#121914)**7 years ago**
`Adding a pause() function to PHP waiting for any user input returning it:<?phpfunction pause() {    $handle = fopen ("php://stdin","r");    do { $line = fgets($handle); } while ($line == '');    fclose($handle);    return $line;}?>`
[up](/manual/vote-note.php?id=125955&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=125955&page=features.commandline&vote=down)
23
***Anonymous***[ &para;](#125955)**4 years ago**
`We can pass many arguments directly into the hashbang line.As example many ini setting via the -d parameter of php.---#!/usr/bin/php -d memory_limit=2048M -d post_max_size=0phpinfo();exit;---./script | grep memorymemory_limit => 2048M => 2048M---But we can also use this behaviour into a second script, so it call the first as an interpreter, via the hashbang:---#!./script arg1 arg2 arg3 ---However the parameters are dispatched in a different way into $argvAll the parameters are in $argv[1], $argv[0] is the interpreter script name, and $argv[1] is the caller script name.To get back the parameters into $argv, we can simply test if $argv[1] contains spaces, and then dispatch again as normal: #!/usr/bin/php -d memory_limit=2048M -d post_max_size=0<?phpvar_dump($argv);if (strpos($argv[1], ' ') !== false){  $argw = explode(" ", $argv[1]);  array_unshift($argw, $argv[2]);  $argv = $argw;}var_dump($argv); ?>---array(3) {  [0]=>  string(8) "./script"  [1]=>  string(15) "arg1 arg2 arg3 "  [2]=>  string(14) "./other_script"}array(4) {  [0]=>  string(8) "./other_script"  [1]=>  string(4) "arg1"  [2]=>  string(4) "arg2"  [3]=>  string(4) "arg3"}---This will maintain the same behaviour in all cases and allow to even double click a script to call both parameters of another script, and even make a full interpreter language layer.  The other script doesn't has to be php. Take care of paths.`
[up](/manual/vote-note.php?id=116023&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=116023&page=features.commandline&vote=down)
26
***frankNospamwanted at. toppoint dot. de***[ &para;](#116023)**10 years ago**
`Parsing commandline argument GET String without changing the PHP script (linux shell):URL: index.php?a=1&b=2Result: output.htmlecho "" | php -R 'include("index.php");' -B 'parse_str($argv[1], $_GET);' 'a=1&b=2' >output.html(no need to change php.ini)You can put this   echo "" | php -R 'include("'$1'");' -B 'parse_str($argv[1], $_GET);' "$2"in a bash script "php_get" to use it like this:  php_get index.php 'a=1&b=2' >output.htmlor directed to text browser...  php_get index.php 'a=1&b=2' |w3m -T text/html`
[up](/manual/vote-note.php?id=57143&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=57143&page=features.commandline&vote=down)
24
***drewish at katherinehouse dot com***[ &para;](#57143)**19 years ago**
`When you're writing one line php scripts remember that 'php://stdin' is your friend. Here's a simple program I use to format PHP code for inclusion on my blog:UNIX:  cat test.php | php -r "print htmlentities(file_get_contents('php://stdin'));"DOS/Windows:  type test.php | php -r "print htmlentities(file_get_contents('php://stdin'));"`
[up](/manual/vote-note.php?id=39576&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=39576&page=features.commandline&vote=down)
33
***ben at slax0rnet dot com***[ &para;](#39576)**21 years ago**
`Just a note for people trying to use interactive mode from the commandline.The purpose of interactive mode is to parse code snippits without actually leaving php, and it works like this:[root@localhost php-4.3.4]# php -aInteractive mode enabled<?php echo "hi!"; ?><note, here we would press CTRL-D to parse everything we've entered so far>hi!<?php exit(); ?><ctrl-d here again>[root@localhost php-4.3.4]#I noticed this somehow got ommited from the docs, hope it helps someone!`
[up](/manual/vote-note.php?id=105568&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=105568&page=features.commandline&vote=down)
25
***Kodeart***[ &para;](#105568)**13 years ago**
Check directly without calling functions:<?phpif (PHP_SAPI === 'cli'){// ...}?>You can define a constant to use it elsewhere<?phpdefine('ISCLI', PHP_SAPI === 'cli');?>
[up](/manual/vote-note.php?id=94924&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=94924&page=features.commandline&vote=down)
27
***notreallyanaddress at somerandomaddr dot com***[ &para;](#94924)**15 years ago**
`If you want to be interactive with the user and accept user input, all you need to do is read from stdin.  <?phpecho "Are you sure you want to do this?  Type 'yes' to continue: ";$handle = fopen ("php://stdin","r");$line = fgets($handle);if(trim($line) != 'yes'){    echo "ABORTING!\n";    exit;}echo "\n";echo "Thank you, continuing...\n";?>`
[up](/manual/vote-note.php?id=26201&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=26201&page=features.commandline&vote=down)
14
***phpnotes at ssilk dot de***[ &para;](#26201)**22 years ago**
`To hand over the GET-variables in interactive mode like in HTTP-Mode (e.g. your URI is myprog.html?hugo=bla&bla=hugo), you have to callphp myprog.html '&hugo=bla&bla=hugo'(two & instead of ? and &!)There just a little difference in the $ARGC, $ARGV values, but I think this is in those cases not relevant.`
[up](/manual/vote-note.php?id=56928&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=56928&page=features.commandline&vote=down)
20
***OverFlow636 at gmail dot com***[ &para;](#56928)**19 years ago**
I needed this, you proly wont tho.puts the exicution args into $_GET<?phpif ($argv) {foreach ($argv as $k=>$v){if ($k==0) continue;$it = explode("=",$argv[$i]);if (isset($it[1])) $_GET[$it[0]] = $it[1];}}?>
[up](/manual/vote-note.php?id=76606&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=76606&page=features.commandline&vote=down)
17
***lucas dot vasconcelos at gmail dot com***[ &para;](#76606)**17 years ago**
Just another variant of previous script that group arguments doesn't starts with '-' or '--'<?phpfunction arguments($argv) {$_ARG = array();foreach ($argv as $arg) {if (ereg('--([^=]+)=(.*)',$arg,$reg)) {$_ARG[$reg[1]] = $reg[2];} elseif(ereg('^-([a-zA-Z0-9])',$arg,$reg)) {$_ARG[$reg[1]] = 'true';} else {$_ARG['input'][]=$arg;}}return $_ARG;}print_r(arguments($argv));?>$ php myscript.php --user=nobody /etc/apache2/*Array([input] => Array([0] => myscript.php[1] => /etc/apache2/apache2.conf[2] => /etc/apache2/conf.d[3] => /etc/apache2/envvars[4] => /etc/apache2/httpd.conf[5] => /etc/apache2/mods-available[6] => /etc/apache2/mods-enabled[7] => /etc/apache2/ports.conf[8] => /etc/apache2/sites-available[9] => /etc/apache2/sites-enabled)[user] => nobody)
[up](/manual/vote-note.php?id=53252&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=53252&page=features.commandline&vote=down)
15
***roberto dot dimas at gmail dot com***[ &para;](#53252)**20 years ago**
`One of the things I like about perl and vbscripts, is the fact that I can name a file e.g. 'test.pl' and just have to type 'test, without the .pl extension' on the windows command line and the command processor knows that it is a perl file and executes it using the perl command interpreter.I did the same with the file extension .php3 (I will use php3 exclusivelly for command line php scripts, I'm doing this because my text editor VIM 6.3 already has the correct syntax highlighting for .php3 files ).I modified the PATHEXT environment variable in Windows XP, from the " 'system' control panel applet->'Advanced' tab->'Environment Variables' button-> 'System variables' text area".Then from control panel "Folder Options" applet-> 'File Types' tab, I added a new file extention (php3), using the button 'New'  and typing php3 in the window that pops up.Then in the 'Details for php3 extention' area I used the 'Change' button to look for the Php.exe executable so that the php3 file extentions are associated with the php executable.You have to modify also the 'PATH' environment variable, pointing to the folder where the php executable is installedHope this is useful to somebody`
[up](/manual/vote-note.php?id=24970&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=24970&page=features.commandline&vote=down)
16
***jeff at noSpam[] dot genhex dot net***[ &para;](#24970)**22 years ago**
`You can also call the script from the command line after chmod'ing the file (ie: chmod 755 file.php).On your first line of the file, enter "#!/usr/bin/php" (or to wherever your php executable is located).  If you want to suppress the PHP headers, use the line of "#!/usr/bin/php -q" for your path.`
[up](/manual/vote-note.php?id=98647&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=98647&page=features.commandline&vote=down)
16
***Anonymous***[ &para;](#98647)**14 years ago**
`Using CLI (on WIN at least), some INI paths are relative to the current working directory.  For example, if your error_log = "php_errors.log", then php_errors.log will be created (or appended to if already exists) in whatever directory you happen to be in at the moment if you have write access there.  Instead of having random error logs all over the place because of this behavior, you may want to set error_log to a full path, perhaps to the php.exe directory.`
[up](/manual/vote-note.php?id=83843&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=83843&page=features.commandline&vote=down)
22
***thomas dot harding at laposte dot net***[ &para;](#83843)**17 years ago**
`Parsing command line: optimization is evil!One thing all contributors on this page forgotten is that you can suround an argv with single or double quotes. So the join coupled together with the preg_match_all will always break that :)Here is a proposal:#!/usr/bin/php<?phpprint_r(arguments($argv));function arguments ( $args ){  array_shift( $args );  $endofoptions = false;  $ret = array    (    'commands' => array(),    'options' => array(),    'flags'    => array(),    'arguments' => array(),    );  while ( $arg = array_shift($args) )  {    // if we have reached end of options,    //we cast all remaining argvs as arguments    if ($endofoptions)    {      $ret['arguments'][] = $arg;      continue;    }    // Is it a command? (prefixed with --)    if ( substr( $arg, 0, 2 ) === '--' )    {      // is it the end of options flag?      if (!isset ($arg[3]))      {        $endofoptions = true;; // end of options;        continue;      }      $value = "";      $com   = substr( $arg, 2 );      // is it the syntax '--option=argument'?      if (strpos($com,'='))        list($com,$value) = split("=",$com,2);      // is the option not followed by another option but by arguments      elseif (strpos($args[0],'-') !== 0)      {        while (strpos($args[0],'-') !== 0)          $value .= array_shift($args).' ';        $value = rtrim($value,' ');      }      $ret['options'][$com] = !empty($value) ? $value : true;      continue;    }    // Is it a flag or a serial of flags? (prefixed with -)    if ( substr( $arg, 0, 1 ) === '-' )    {      for ($i = 1; isset($arg[$i]) ; $i++)        $ret['flags'][] = $arg[$i];      continue;    }    // finally, it is not option, nor flag, nor argument    $ret['commands'][] = $arg;    continue;  }  if (!count($ret['options']) && !count($ret['flags']))  {    $ret['arguments'] = array_merge($ret['commands'], $ret['arguments']);    $ret['commands'] = array();  }return $ret;}exit (0)/* vim: set expandtab tabstop=2 shiftwidth=2: */?>`
[up](/manual/vote-note.php?id=32701&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=32701&page=features.commandline&vote=down)
17
***monte at ispi dot net***[ &para;](#32701)**22 years ago**
`I had a problem with the $argv values getting split up when they contained plus (+) signs. Be sure to use the CLI version, not CGI to get around it.Monte`
[up](/manual/vote-note.php?id=39655&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=39655&page=features.commandline&vote=down)
16
***linn at backendmedia dot com***[ &para;](#39655)**21 years ago**
`For those of you who want the old CGI behaviour that changes to the actual directory of the script use:chdir(dirname($_SERVER['argv'][0]));at the beginning of your scripts.`
[up](/manual/vote-note.php?id=71154&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=71154&page=features.commandline&vote=down)
17
***goalain eat gmail dont com***[ &para;](#71154)**18 years ago**
If your php script doesn't run with shebang (#!/usr/bin/php),and it issues the beautifull and informative error message:"Command not found."  just dos2unix yourscript.phpet voila.If you still get the "Command not found." Just try to run it as ./myscript.php , with the "./"if it works - it means your current directory is not in the executable search path.If your php script doesn't run with shebang (#/usr/bin/php),and it issues the beautifull and informative message:"Invalid null command." it's probably because the "!" is missing in the the shebang line (like what's above) or something else in that area.\Alon
[up](/manual/vote-note.php?id=74088&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=74088&page=features.commandline&vote=down)
16
***rob***[ &para;](#74088)**18 years ago**
`i use emacs in c-mode for editing.  in 4.3, starting a cli script like so:#!/usr/bin/php -q /* -*- c -*- */<?phptold emacs to drop into c-mode automatically when i loaded the file for editing.  the '-q' flag didn't actually do anything (in the older cgi versions, it suppressed html output when the script was run) but it caused the commented mode line to be ignored by php.in 5.2, '-q' has apparently been deprecated.  replace it with '--' to achieve the 4.3 invocation-with-emacs-mode-line behavior:#!/usr/bin/php -- /* -*- c -*- */<?phpdon't go back to your 4.3 system and replace '-q' with '--'; it seems to cause php to hang waiting on STDIN...`
[up](/manual/vote-note.php?id=123606&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=123606&page=features.commandline&vote=down)
9
***sam marshall***[ &para;](#123606)**6 years ago**
`When using the -R flag, the name of the variable containing the content of the current line (not including the LF) is $argn.For example you can do this code:cat file.txt | php -R 'echo $argn . "\n";'This will just output each line of the input file without doing anything to it.`
[up](/manual/vote-note.php?id=75532&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=75532&page=features.commandline&vote=down)
16
***eric dot brison at anakeen dot com***[ &para;](#75532)**18 years ago**
`Just a variant of previous script to accept arguments with '=' also<?phpfunction arguments($argv) {    $_ARG = array();    foreach ($argv as $arg) {      if (ereg('--([^=]+)=(.*)',$arg,$reg)) {        $_ARG[$reg[1]] = $reg[2];      } elseif(ereg('-([a-zA-Z0-9])',$arg,$reg)) {            $_ARG[$reg[1]] = 'true';        }       }  return $_ARG;}?>$ php myscript.php --user=nobody --password=secret -p --access="host=127.0.0.1 port=456" Array(    [user] => nobody    [password] => secret    [p] => true    [access] => host=127.0.0.1 port=456)`
[up](/manual/vote-note.php?id=54756&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=54756&page=features.commandline&vote=down)
12
***docey***[ &para;](#54756)**19 years ago**
`dunno if this is on linux the same but on windows evertimeyou send somthing to the console screen php is waiting forthe console to return. therefor if you send a lot of small short amounts of text, the console is starting to be using more cpu-cycles then php and thus slowing the script.take a look at this sheme:cpu-cycle:1 ->php: print("a");cpu-cycle:2 ->cmd: output("a");cpu-cycle:3 ->php: print("b");cpu-cycle:4 ->cmd: output("b");cpu-cycle:5 ->php: print("c");cpu-cycle:6 ->cmd: output("c"); cpu-cylce:7 ->php: print("d");cpu-cycle:8 ->cmd: output("d"); cpu-cylce:9 ->php: print("e");cpu-cycle:0 ->cmd: output("e"); on the screen just appears "abcde". but if you write your script this way it will be far more faster:cpu-cycle:1 ->php: ob_start();cpu-cycle:2 ->php: print("abc");cpu-cycle:3 ->php: print("de");cpu-cycle:4 ->php: $data = ob_get_contents();cpu-cycle:5 ->php: ob_end_clean();cpu-cycle:6 ->php: print($data);cpu-cycle:7 ->cmd: output("abcde");now this is just a small example but if you are writing anapp that is outputting a lot to the console, i.e. a textbased screen with frequent updates, then its much better to first cach all output, and output is as one big chunk oftext instead of one char a the time. ouput buffering is ideal for this. in my script i outputtedalmost 4000chars of info and just by caching it first, itspeeded up by almost 400% and dropped cpu-usage.because what is being displayed doesn't matter, be it 2chars or 40.0000 chars, just the call to output takes a great deal of time. remeber that.maybe someone can test if this is the same on unix-basedsystems. it seems that the STDOUT stream just waits for the console to report ready, before continueing execution.`
[up](/manual/vote-note.php?id=75985&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=75985&page=features.commandline&vote=down)
9
***bluej100@gmail***[ &para;](#75985)**18 years ago**
`In 5.1.2 (and others, I assume), the -f form silently drops the first argument after the script name from $_SERVER['argv']. I'd suggest avoiding it unless you need it for a special case.`
[up](/manual/vote-note.php?id=50358&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=50358&page=features.commandline&vote=down)
10
***obfuscated at emailaddress dot com***[ &para;](#50358)**20 years ago**
`This posting is not a php-only problem, but hopefully will save someone a few hours of headaches.  Running on MacOS (although this could happen on any *nix I suppose), I was unable to get the script to execute without specifically envoking php from the command line:[macg4:valencia/jobs] tim% test.php./test.php: Command not found.However, it worked just fine when php was envoked on the command line:[macg4:valencia/jobs] tim% php test.phpWell, here we are...  Now what?Was file access mode set for executable?  Yup.[macg4:valencia/jobs] tim% ls -l total 16-rwxr-xr-x  1 tim  staff   242 Feb 24 17:23 test.phpAnd you did, of course, remember to add the php command as the first line of your script, yeah?  Of course.#!/usr/bin/php<?php print "Well, here we are...  Now what?\n"; ?>So why dudn't it work?  Well, like I said... on a Mac.... but I also occasionally edit the files on my Windows portable (i.e. when I'm travelling and don't have my trusty Mac available)...  Using, say, WordPad on Windows... and BBEdit on the Mac...Aaahhh... in BBEdit check how the file is being saved!  Mac?  Unix?  or Dos?  Bingo.  It had been saved as Dos format.  Change it to Unix:[macg4:valencia/jobs] tim% ./test.phpWell, here we are...  Now what?[macg4:valencia/jobs] tim% NB: If you're editing your php files on multiple platforms (i.e. Windows and Linux), make sure you double check the files are saved in a Unix format...  those \r's and \n's 'll bite cha!`
[up](/manual/vote-note.php?id=33119&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=33119&page=features.commandline&vote=down)
13
***Adam, php(at)getwebspace.com***[ &para;](#33119)**22 years ago**
`Ok, I've had a heck of a time with PHP > 4.3.x and whether to use CLI vs CGI. The CGI version of 4.3.2 would return (in browser):---No input file specified.---And the CLI version would return:---500 Internal Server Error---It appears that in CGI mode, PHP looks at the environment variable PATH_TRANSLATED to determine the script to execute and ignores command line. That is why in the absensce of this environment variable, you get "No input file specified." However, in CLI mode the HTTP headers are not printed. I believe this is intended behavior for both situations but creates a problem when you have a CGI wrapper that sends environment variables but passes the actual script name on the command line.By modifying my CGI wrapper to create this PATH_TRANSLATED environment variable, it solved my problem, and I was able to run the CGI build of 4.3.2`
[up](/manual/vote-note.php?id=31360&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=31360&page=features.commandline&vote=down)
8
***Popeye at P-t-B dot com***[ &para;](#31360)**22 years ago**
`In *nix systems, use the WHICH command to show the location of the php binary executable. This is the path to use as the first line in your php shell script file. (#!/path/to/php -q) And execute php from the command line with the -v switch to see what version you are running.example:# which php/usr/local/bin/php# php -vPHP 4.3.1 (cli) (built: Mar 27 2003 14:41:51)Copyright (c) 1997-2002 The PHP GroupZend Engine v1.3.0, Copyright (c) 1998-2002 Zend TechnologiesIn the above example, you would use: #!/usr/local/bin/phpAlso note that, if you do not have the current/default directory in your PATH (.), you will have to use ./scriptfilename to execute your script file from the command line (or you will receive a "command not found" error). Use the ENV command to show your PATH environment variable value.`
[up](/manual/vote-note.php?id=62162&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=62162&page=features.commandline&vote=down)
10
***stromdotcom at hotmail dot com***[ &para;](#62162)**19 years ago**
`Spawning php-win.exe as a child process to handle scripting in Windows applications has a few quirks (all having to do with pipes between Windows apps and console apps).To do this in C++:// We will run php.exe as a child process after creating// two pipes and attaching them to stdin and stdout// of the child process// Define sa struct such that child inherits our handlesSECURITY_ATTRIBUTES sa = { sizeof(SECURITY_ATTRIBUTES) };sa.bInheritHandle = TRUE;sa.lpSecurityDescriptor = NULL;// Create the handles for our two pipes (two handles per pipe, one for each end)// We will have one pipe for stdin, and one for stdout, each with a READ and WRITE endHANDLE hStdoutRd, hStdoutWr, hStdinRd, hStdinWr;// Now create the pipes, and make them inheritableCreatePipe (&hStdoutRd, &hStdoutWr, &sa, 0))SetHandleInformation(hStdoutRd, HANDLE_FLAG_INHERIT, 0);CreatePipe (&hStdinRd, &hStdinWr, &sa, 0)SetHandleInformation(hStdinWr, HANDLE_FLAG_INHERIT, 0);// Now we have two pipes, we can create the process// First, fill out the usage structsSTARTUPINFO si = { sizeof(STARTUPINFO) };PROCESS_INFORMATION pi;si.dwFlags = STARTF_USESTDHANDLES;si.hStdOutput = hStdoutWr;si.hStdInput  = hStdinRd;// And finally, create the processCreateProcess (NULL, "c:\\php\\php-win.exe", NULL, NULL, TRUE, NORMAL_PRIORITY_CLASS, NULL, NULL, &si, &pi);// Close the handles we aren't usingCloseHandle(hStdoutWr);CloseHandle(hStdinRd);// Now that we have the process running, we can start pushing PHP at itWriteFile(hStdinWr, "<?php echo 'test'; ?>", 9, &dwWritten, NULL);// When we're done writing to stdin, we close that pipeCloseHandle(hStdinWr);// Reading from stdout is only slightly more complicatedint i;std::string processed("");char buf[128];while ( (ReadFile(hStdoutRd, buf, 128, &dwRead, NULL) && (dwRead != 0)) ) {    for (i = 0; i < dwRead; i++)        processed += buf[i];}    // Done reading, so close this handle tooCloseHandle(hStdoutRd);A full implementation (implemented as a C++ class) is available at [http://www.stromcode.com](http://www.stromcode.com)`
[up](/manual/vote-note.php?id=78093&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=78093&page=features.commandline&vote=down)
8
***losbrutos at free dot fr***[ &para;](#78093)**17 years ago**
`an another "another variant" :<?phpfunction arguments($argv){  $_ARG = array();  foreach ($argv as $arg)  {    if (preg_match('#^-{1,2}([a-zA-Z0-9]*)=?(.*)$#', $arg, $matches))    {      $key = $matches[1];      switch ($matches[2])      {        case '':        case 'true':          $arg = true;          break;        case 'false':          $arg = false;          break;        default:          $arg = $matches[2];      }      $_ARG[$key] = $arg;    }    else    {      $_ARG['input'][] = $arg;    }  }  return $_ARG;}?>$php myscript.php arg1 -arg2=val2 --arg3=arg3 -arg4 --arg5 -arg6=falseArray(    [input] => Array        (            [0] => myscript.php            [1] => arg1        )    [arg2] => val2    [arg3] => arg3    [arg4] => true    [arg5] => true    [arg5] => false)`
[up](/manual/vote-note.php?id=29468&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=29468&page=features.commandline&vote=down)
8
***Alexander Plakidin***[ &para;](#29468)**22 years ago**
`How to change current directory in PHP script to script's directory when running it from command line using PHP 4.3.0?(you'll probably need to add this to older scripts when running them under PHP 4.3.0 for backwards compatibility)Here's what I am using:chdir(preg_replace('/\\/[^\\/]+$/',"",$PHP_SELF));Note: documentation says that "PHP_SELF" is not available in command-line PHP scripts. Though, it IS available. Probably this will be changed in future version, so don't rely on this line of code...Use $_SERVER['PHP_SELF'] instead of just $PHP_SELF if you have register_globals=Off`
[up](/manual/vote-note.php?id=19167&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=19167&page=features.commandline&vote=down)
6
***pyxl at jerrell dot com***[ &para;](#19167)**23 years ago**
`Assuming --prefix=/usr/local/php, it's better to create a symlink from /usr/bin/php or /usr/local/bin/php to target /usr/local/php/bin/php so that it's both in your path and automatically correct every time you rebuild.  If you forgot to do that copy of the binary after a rebuild, you can do all kinds of wild goose chasing when things break.`
[up](/manual/vote-note.php?id=78672&page=features.commandline&vote=up)
[down](/manual/vote-note.php?id=78672&page=features.commandline&vote=down)
5
***james_s2010 at NOSPAM dot hotmail dot com***[ &para;](#78672)**17 years ago**
I was looking for a way to interactively get a single character response from user. Using STDIN with fread, fgets and such will only work after pressing enter. So I came up with this instead:#!/usr/bin/php -q<?phpfunction inKey($vals) {$inKey = "";While(!in_array($inKey,$vals)) {$inKey = trim(`read -s -n1 valu;echo \$valu`);}return $inKey;}function echoAT($Row,$Col,$prompt="") {// Display prompt at specific screen coordsecho "\033[".$Row.";".$Col."H".$prompt;}// Display prompt at position 10,10echoAT(10,10,"Opt : ");// Define acceptable responses$options = array("1","2","3","4","X");// Get user response$key = inKey($options);// Display user response & exitechoAT(12,10,"Pressed : $key\n");?>Hope this helps someone.
[＋add a note](/manual/add-note.php?sect=features.commandline&repo=en&redirect=https://www.php.net/manual/en/features.commandline.php)
[Features](features.php)
[HTTP authentication with PHP](features.http-auth.php)
[Cookies](features.cookies.php)
[Sessions](features.sessions.php)
[Handling file uploads](features.file-upload.php)
[Using remote files](features.remote-files.php)
[Connection handling](features.connection-handling.php)
[Persistent Database Connections](features.persistent-connections.php)
[Command line usage](features.commandline.php)
[Garbage Collection](features.gc.php)
[DTrace Dynamic Tracing](features.dtrace.php)
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