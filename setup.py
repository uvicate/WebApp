#!python
import json
import os

def newPath(path):
	if not os.path.exists(path): os.makedirs(path)

def genericXml():
	body = '<content>\n\t<dom>\n\t</dom>\n</content>'
	return body

def genericJS():
	body = '(function(){\n\t"use strict";\n\tvar Module = function(){};\n\n\tvar m = new Module();})();'
	return body

#Each webapp project has the same directory structure
	#/
	#	modules/
	#		module1/
	#			css/style.css
	#			js/main.js
	#			html/main.js
	#	language/
	#		en/
	#			main.xml
	#			module1/
	#				content.xml
def initialDirs(js):
	#root path of the project
	#------------------------
	rootpath = os.getcwd() + '/' + js['project_path']
	newPath(rootpath)

	#language path
	#-------------
	languagePath(rootpath, js)

	#Modules path
	#------------
	modulesPath(rootpath, js)
	

def languagePath(rootpath, js):
	langpath = rootpath + '/language'
	newPath(langpath)

	#Path for each language
	for lang in js['languages']:
		specificlang = langpath + '/' + lang
		newPath(specificlang)

		#And now creates the main xml file for the language
		main = open(specificlang + '/main.xml', 'w+')
		main.write(genericXml())
		main.close

		#Then creates each module in the language path
		for module in js['modules']:
			modulelang = specificlang + '/' + module
			newPath(modulelang)

			content = open(modulelang + '/content.xml', 'w+')
			content.write(genericXml())
			content.close

def modulesPath(rootpath, js):
	modulespath = rootpath + '/' + js['module_path']
	if not os.path.exists(modulespath): os.makedirs(modulespath)

	#Path for each module
	for module in js['modules']:
		modulepath = modulespath + '/' + module
		newPath(modulepath)

		#files for each module
		csspath = modulepath + '/css'
		newPath(csspath)
		cssfile = open(csspath + '/style.css', 'w+')
		cssfile.close

		jspath = modulepath + '/js'
		newPath(jspath)
		jsfile = open(jspath + '/main.js', 'w+')
		jsfile.write(genericJS())
		jsfile.close

		htmlpath = modulepath + '/html'
		newPath(htmlpath)
		htmlfile = open(htmlpath + '/main.html', 'w+')
		htmlfile.close

#Reads the setup json
fo = open("setup.json", "r")
js = fo.read()
fo.close()
jsObj = json.loads(js)

initialDirs(jsObj)
