WebApp
======

AJAX WebApp handler.

Create AJAX web apps with translation support

How to use it?
--------------

The first thing to do is initialize an object and tell it the modules you are going to use in your platform.

```
var modulesApp = {
	module1: {url: 'modules/', nombre: 'module1'},
	module2: {url: 'modules/', nombre: 'module2'}
}
```
the previous code is a JSON with the modules that the platform will have.
Then, proceed to create the Object.

```
var j = {name: 'My App', modules:modules, div:'#content'};
App = new AppSystem(j);
App.init(function(){});
```
The main object is initialized now. This object will hold all the neccesary variables for us. Although the main object is all set up an ready to rumble, the modules have not yet been initialized, so you may want to create a menu to tell the user about your modules or start a module right away, in any case you have to start a module.

```
App.getModule('module1');
App.current.start()
```
getModule will set the current module to the one you searched, and then you have to start it.
The start process will call this files in order:

1. The CSS file
2. The main HTML file
3. The XML file of the current language
3. The main JS file

Setting up the ftp Structure
----------------------------

A modules folder will hold all the client side (JS, HTML, CSS) called "modules" or a custom name. Inside that folder all the existing modules will be put.

Each module will have 3 folders with the following files:
* css/style.css
* html/main.html
* js/main.js

For the languages, you have to create a folder called "language" and within will have all the supported languages of your platform. For default the main language is English, the "English" language folder must be called with the language code "en", for spanish would be "es" and so on.

* language/
	* en
	* es

Each language folder must contain a main xml file called "main" and must have all the modules in folders aswell. Each module in the language folder must have a "content.xml" as following:

* en/
	* main.xml
	*module1/
		*content.xml
	*module2/
		*content.xml

The main xml of the language is intended for all the texts you may repeat in some or all the modules, like name days or month names, etc. And the content xml of each module is for that module specifically.

All the xml files must be as following

```
<content>
		<dom>
			<title>Hello, I'm a web app</title>
			<change-language>Change language</change-language>
		</dom>
		<exra-text>Oh noes!</exra-text>
</content>

```

1. An optional utf encoding at the beginning of the file http://www.w3schools.com/xml/xml_encoding.asp
2. The "content" node must exist, although the name is not mandatory.
2. the "dom" node is mandatory.

Linking the HTML with the Language
----------------------------------

It is advised that you don't use any text in your HTML files or the translation will not be possible.
The desired DOM nodes to be translated must have a tag called "data-ltag" which will have the name of the tag in the XML file.

```
<h1 data-ltag="title"></h1>
```

The h1 tag will call the "title" node in the XML explained before. The translation will happen automatically when starting the module. All the tags within the "dom" tag in the XML file will be searched in the HTML file each time the module is translated.

But if you create dom dinamically you have two options of calling Language text.

1. Re-translating the site.

```
App.current.translate()
```
This will read the current dom and re translate all that matches

2. Calling the nodes manually.

```
var text = App.current.language.getText('exra-text');
```
the "getText" method will search only in the current XML file, but if you want to get text of the main XML of the language, use this.

```
var mainText = App.current.language.getMainText('main-text');
```

the text variable will hold the "Oh noes!" string, doesn't matter that it is outside the "dom" tag of the XML, and it is better that it is outside, because this string will be used dynamically and only in certain cases, not every time the html is called.

Translating the app to another language
---------------------------------------

If the application is English and the user wants it in Spanish, this is done as following

```
App.current.translateTo('es');
```

Requirements
------------

Modern Browser:
* Firefox
* Google Chrome
* Safari
* Opera
* IE > 9