var App;

(function(){
	"use strict";
	var Init = function(){
		//Declare the modules of your platform
		var modulesApp = {
			module1: {url: 'modules/'},
			module2: {url: 'modules/'}
		}

		var modules = {};

		for(var k in modulesApp){
			if(modulesApp.hasOwnProperty(k)){
				modules[k] = {};
				modules[k].nombre = k;
				modules[k].url = modulesApp[k].url;
			}
		}

		this.modules = modulesApp;
		console.log('modules', modules);

		var j = {name: 'My App', modules:modules, div:'#content'};
		App = new AppSystem(j);
		var This = this;
		App.init(function(){
			This.buildMenu();
		});
	};

	Init.prototype.buildMenu = function(){
		var menu = document.getElementById('menu');
		var ul = document.createElement('ul');
		for(var k in this.modules){
			if(this.modules.hasOwnProperty(k)){
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.href = '#';
				a.setAttribute('data-module', k);
				a.appendChild(document.createTextNode(k));
				li.appendChild(a);
				ul.appendChild(li);

				a.addEventListener('click', function(){
					var m = this.getAttribute('data-module');
					App.getModule(m);
					App.current.start();
				});
			}
		}

		//Change language button.
		var li = document.createElement('li');
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.href = '#';
		a.setAttribute('data-ltag', 'change-language');
		var k = App.language.getMainText('change-language');
		a.appendChild(document.createTextNode(k));

		var This = this;
		a.addEventListener('click', function(){
			This.changeLanguage();
		});

		li.appendChild(a);
		ul.appendChild(li);

		menu.appendChild(ul);
	};

	Init.prototype.changeLanguage = function(){
	if(typeof App.language !== 'undefined'){
		var currentLang = App.language.language;

		var l = '';
		switch(currentLang){
			case 'es':
				l = 'en';
			break;
			case 'en':
				l = 'es';
			break;
		}

		if(typeof App.current !== 'undefined'){
			App.current.translateTo(l);
		}else{
			App.translateTo(l);
		}
	}
}

	var i = new Init();
})();