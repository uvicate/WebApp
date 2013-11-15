function Initclass(j){
    if(typeof j !== 'object'){
        throw new Error('j was expected to be an object, '+(typeof j+' was received.'));
    }

    var data = (j.data !== undefined) ? j.data : {};
    var defaults = (j.defaults !== undefined) ? j.defaults : {};
    var synonyms = (j.synonyms !== undefined) ? j.synonyms : {};
        
    for(var k in synonyms){
        if(data[k] !== undefined){
            data[ synonyms[k] ] = data[k];
        }
    }

    var types = {};
    for (var llave in defaults){
        types[llave] = typeof defaults[llave];
    }
    
    for(var key in defaults){
        data[key] = (typeof data[key] === 'undefined') ? defaults[key] : data[key];    
    }
    
    for(var key in data){
        var t = typeof data[key];
        if(t !== types[key] && types[k] !== undefined){
            throw new Error ('Error : '+key+' was expected to be '+types[key]+', but was received: '+t);
        }else{
            this[key] = data[key];
        }
    }
}

(function(){
    // 
    // JSONHttpRequest 0.3.0
    //
    // Copyright 2011 Torben Schulz <http://pixelsvsbytes.com/>
    // 
    // This program is free software: you can redistribute it and/or modify
    // it under the terms of the GNU General Public License as published by
    // the Free Software Foundation, either version 3 of the License, or
    // (at your option) any later version.
    // 
    // This program is distributed in the hope that it will be useful,
    // but WITHOUT ANY WARRANTY; without even the implied warranty of
    // MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    // GNU General Public License for more details.
    // 
    // You should have received a copy of the GNU General Public License
    // along with _self program. If not, see <http://www.gnu.org/licenses/>.
    // 
    ///////////////////////////////////////////////////////////////////////

    function JSONHttpRequest() {
        var _xmlHttpRequest = getXMLHTTPRequest();
        var _responseJSON = null;
        var _userContentType = false;
        // INFO Defining 'this' as '_self' improves compression, since keywords won't be shortened,
        //      but variables will, and it delivers us from the need to reset the scope of the anonymous
        //      function in the for-loop via call() or apply().
        var _self = this;

        var property = {
            get: function() {
                try {
                    _responseJSON = _xmlHttpRequest.responseText ? (!_responseJSON ? JSON.parse(_xmlHttpRequest.responseText) : _responseJSON) : null;
                }
                catch (e) {
                    if (_self.strictJSON)
                        throw e;
                }
                return _responseJSON;
            },
            enumerable: true,
            configurable: true
        }
        
        _self.strictJSON = true;
        Object.defineProperty(_self, 'responseJSON', property);
        
        _self.sendJSON = function(data) {
            try {
                data = JSON.stringify(data);
                _responseJSON = null;
                if (!_userContentType)
                    _xmlHttpRequest.setRequestHeader('Content-Type', 'application/json;charset=encoding');          
                _userContentType = false;
            }
            catch (e) {
                if (_self.strictJSON)
                    throw e;
            }
            _xmlHttpRequest.send(data);
        }
        
        // INFO proxy setup
        
        function proxy(name) {
            try {
                if ((typeof _xmlHttpRequest[name]) == 'function') {
                    _self[name] = function() {
                        if (name == 'setRequestHeader')
                            _userContentType = arguments[0].toLowerCase() == 'content-type';
                        return _xmlHttpRequest[name].apply(_xmlHttpRequest, Array.prototype.slice.apply(arguments));
                    };
                }
                else {
                    property.get = function() { return _xmlHttpRequest[name]; }
                    property.set = function(value) { _xmlHttpRequest[name] = value; }
                    Object.defineProperty(_self, name, property);   
                }
            }
            catch (e) {
                // NOTE Swallow any exceptions, which may rise here.
            }
        }
        
        // FIX onreadystatechange is not enumerable [Opera]
        proxy('onreadystatechange');
        
        for (n in _xmlHttpRequest)
            proxy(n);
    }

    // Ajax Stuff
    // =======================
    var _Vi = function(j){

        var json = (j === undefined ) ? {} : j;
        
        var defaults = {
            url: '',
            cache: false,
            header:'Content-Type',
            valorHeader:'application/x-www-form-urlencoded',
            div:'',
            cargando:'...',
            modo:'GET',
            datos:{},
            respuesta:'text',
            input:'',
            formulario:'',
            enviaArchivo:false,
            historial:false,
            urlH: '/',
            mensajeH: '',
            mClass: false,
            mensaje:{}
        }

        // The original variables are in spanish, so I added translated variables as well
        synonyms = {
            headerValue: 'valorHeader',
            container: 'div',
            loading: 'cargando',
            mode: 'modo',
            data: 'datos',
            response: 'respuesta',
            sendFile: 'enviaArchivo',
            history: 'historial',
            messageH: 'mensajeH',
            message: 'mensaje',
        }

        var js = {data:j, defaults:defaults, synonyms:synonyms};
        Initclass.call(this, js);
    }

    function getXMLHTTPRequest() {
        var req;
        if(XMLHttpRequest){
            req = new XMLHttpRequest();
        }else{
            try {
                req = new XMLHttpRequest();
            } catch(err1) {
                try {
                    req = new ActiveXObject("Msxml2.XMLHTTP");
                } catch (err2) {
                    try {
                        req = new ActiveXObject("Microsoft.XMLHTTP");
                    } catch (err3) {
                        req = false;
                    } 
                } 
            }
        }
        return req;
    }

    _Vi.prototype.httpHandler = function(){
        var http;
        switch(this.respuesta){
            case 'objeto':
            case 'object':
            case 'json':
                http = new JSONHttpRequest();
            break;
            default:
                if(XMLHttpRequest){
                    http = new XMLHttpRequest();
                }else{
                    http = getXMLHTTPRequest();
                }
            break;
        }

        return http;
    };

    _Vi.prototype.ajax = function(callback){
        var http = this.httpHandler();
        this.http = http;
        
        var myRand = '';
        if(this.cache === false){
            myRand = "?rand="+ parseInt(Math.random()*999999999999999);
        }
        
        var url = this.url+myRand;
        if(this.mod === 'GET' && this.enviaArchivo === false){
            var datos = '';
            
            for(var llave in this.datos){
                datos += '&' + encodeURIComponent(llave) + '=' + encodeURIComponent(this.datos[llave]);
            }
            
            url += datos;
        }
        
        var datos = '';
        for(var llave in this.datos){
            if(typeof this.datos[llave] === "object"){
                this.datos[llave] = JSON.pruned(this.datos[llave]);
            }
            datos +=encodeURIComponent(llave)+'='+encodeURIComponent(this.datos[llave])+'&';
        }
        
        var esto = this;
        if(http.open !== undefined){
            http.open(this.modo, url, true);
            http.setRequestHeader(this.header, this.valorHeader);
            http.send(datos);
        }else{
            http.sendJSON();
        }
        

        http.onreadystatechange = function(){
            if(http.readyState === 4){
                if(http.status === 200){
                    esto.success(callback);
                }else{
                    switch(http.status){
                        case 500:
                        case 404:
                        case 413:
                            esto.failed(callback, http.status);
                        break;
                    }
                }
            } 
        }
    }

    _Vi.prototype.failed = function(callback, status){
        if(typeof callback === 'function'){
            r = {success: false, status:status};
            callback(r);
        }
    }

    _Vi.prototype.success = function(callback){                    
        if(this.historial == true){
            if(window.dhtmlHistory === undefined){
                console.log('Para que el historial funcione, necesitas implementar RSH');
            }else{
                dhtmlHistory.add(
                    this.urlH,
                    {message: this.mensajeH});
            }
        }
        
        var respuesta;
        switch(this.respuesta){
            case 'xml':
                respuesta = this.http.responseXML.documentElement;
            break;
            case 'texto':
            case 'text':
            default:
                respuesta = this.http.responseText;
            break;
            case 'objeto':
            case 'object':
            case 'json':
                respuesta = this.http.responseJSON;
                this.messageHandler();
            break;
        }

        if(this.dom !== null && this.dom !== undefined){
            this.showInDOM(callback, respuesta);
        }else{
            if(typeof callback === 'function'){
                callback(respuesta);
            }
        }
    }

    _Vi.prototype.messageHandler = function(){
        if(window.Mensaje !== undefined && this.mClass === true){
            if(this.respuesta.exito !== undefined && this.mensaje.tipo === undefined){
                var t;
                switch(this.respuesta.exito){
                    case true:
                        t = 'info';
                    break;
                    case false:
                        t = 'danger';
                    break;
                    default:
                        t = respuesta.exito;
                }
                this.mensaje.tipo = t;
            }
            if(respuesta.titulo !== undefined && this.mensaje.titulo === undefined){
                this.mensaje.titulo = respuesta.titulo;
            }
            if(respuesta.mensaje !== undefined && this.mensaje.mensaje === undefined){
                this.mensaje.mensaje = respuesta.mensaje;
            }
            var m = Mensaje(this.mensaje);
            m.insertar();
        }
    }

    _Vi.prototype.uploader = function(callback){
        var uri = this.url;
        var xhr = new XMLHttpRequest();
        var fd = new FormData();
        var metodo;
        
        fd = this.datos;
        
        xhr.open(this.modo, uri, true);
        xhr.send(fd);

        xhr.onreadystatechange = function(){
            if (xhr.readyState == 4 && xhr.status == 200) {
                respuesta = eval('('+xhr.responseText+')');
                
                if(callback!=undefined){
                    callback(respuesta);
                }else{
                    return respuesta;
                }
                
            }
        }
        
        delete xhr;
        delete fd;
    }

    _Vi.prototype.DOMHandler = function(){
        if(typeof this.div !== 'object' && this.div.appendChild === undefined){
            var dom = document.querySelector(this.div);
        }else{
            var dom = this.div
        }
        this.dom = dom;
    }

    _Vi.prototype.showInDOM = function(callback, response){
        this.dom.innerHTML = response;
        if(typeof callback === 'function'){
            callback();
        }
    }

    _Vi.prototype.content = function(callback){
        this.contenido(callback);
    }

    _Vi.prototype.contenido = function(callback){
        this.respuesta = 'string';
        this.modo = 'GET';
        this.DOMHandler();

        if(this.dom !== null){
            return this.ajax(callback);
        }else{
            console.log('No se ha encontrado el elemento DOM '.this.div);
        }
    }

    _Vi.prototype.server = function(callback){
        this.response = 'object';
        this.respondo(callback);
    }

    _Vi.prototype.respondo = function(callback){
        
        this.modo = 'POST';
        this.div = undefined;
        return this.ajax(callback);
    }

    _Vi.prototype.form = function(json, callback){
        
        for(var llave in json){
            this.llave = json.llave;
        }
        
        var datos = {};
        var esto = this;

        var dom = document.querySelector(this.input);
        for(var i = 0, len = dom.length; i < len; i++){
            var d = dom[i];
            var vlr = d.value;
            var nombre = d.name;
            if(nombre==''){
                nombre = d.id;
            }
            datos[nombre]=vlr;
        }

        this.datos = datos;
        
        this.modo = 'POST';
        var respondo = esto.ajax(callback);
        
        return respondo;
        
    }

    window.Vi = function(json){
        return new _Vi(json);
    }

})();

(function(){
    "use strict";

    var App = function(j){
        var defaults = {
            currents: {language: 'en', languages: {}},
            modules: {},
            div: '',
            loaded: false
        }

        var js = {defaults: defaults, data: j};
        Initclass.call(this, js);

        if(typeof this.currentLang !== 'undefined'){
            this.currents.language = this.currentLang;
        }

        this.currents.div = this.div;

        for(var m in this.modules){
            if(this.modules.hasOwnProperty(m)){
                this.setModule(m, this.modules[m]);
            }
        }
    }

    App.prototype.init = function(callback) {
        callback = (typeof callback !== 'function') ? function(){} : callback;
        callback();
    };

    App.prototype.setModule = function(name, json) {
        json.currents = this.currents;
        json.parent = this;
        this.modules[name] = new Module(json);
    };

    App.prototype.getModule = function(name) {
        this.current = this.modules[name];
        return this.current;
    };

    App.prototype.startModule = function(callback) {
        var all = (this.loaded === true) ? false : true;
        var params = {translate: {all: all}};
        this.current.start(callback, params);
        this.loaded = true;
    };

    App.prototype.getLanguage = function() {
        return this.getLang();
    };

    App.prototype.getLang = function() {
        return this.currents.language
    };

    App.prototype.setLanguage = function(language) {
        this.setLang(language);
    };

    App.prototype.setLang = function(language) {
        this.currents.language = language;
    };

    App.prototype.translate = function(callback) {
        this.current.translate(callback);
    };

    App.prototype.translateTo = function(language) {
        this.setLanguage(language);
        this.current.translateTo(this.getLanguage());
    };

    var Module = function(j){
        var defaults = {
            nombre: '',
            url: '',
            data: {},
            currents: {},
            name: '',
            parent: {}
        }

        // The original variables are in spanish, so I added translated variables as well
        synonyms = {
            nombre: 'name'
        }

        var js = {data:j, defaults:defaults, synonyms:synonyms};
        Initclass.call(this, js);
    }

    Module.prototype.getCSS = function(parameters, callback){
        callback = (typeof callback !== 'function') ? function(){} : callback;

        if(parameters.load === true){
            var href = this.getUrl()+'/css/'+parameters.file;      
            var antiq = document.querySelector('head link[data-'+this.name+']');
            if(antiq !== null){
                antiq.parentNode.removeChild(antiq);
            }

            var l = document.createElement('link');
            l.setAttribute('href', href);
            l.setAttribute('data-'+this.name, this.name);
            l.type = 'text/css';
            l.rel = 'stylesheet';

            var head = document.getElementsByTagName('head')[0];
            head.appendChild(l);
        }

        callback();
    };
        
    Module.prototype.getHTML = function(parameters, callback){
        callback = (typeof callback !== 'function') ? function(){} : callback;

        if(parameters.load === true){
            var json = {
                url: this.getUrl()+'/html/'+parameters.file,
                div: this.parent.div
            }
            if(typeof callback !== 'function'){
                callback = function(){};
            }

            new Vi(json).content(callback);
        }else{
            callback();
        }
    };
        
    Module.prototype.getJS = function(parameters, callback){

        callback = (typeof callback !== 'function') ? function(){} : callback;

        if(parameters.load === true){
            var head    = document.getElementsByTagName("head")[0];
            var script  = document.createElement("script");
            var done    = false; // Handle Script loading
            
            var url = './'+this.getUrl()+'/js/'+parameters.file;
            script.src  = url;
            script.onload = script.onreadystatechange = function() { // Attach handlers for all browsers
                if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                    done = true;
                    callback();
                    script.onload = script.onreadystatechange = null; // Handle memory leak in IE
                }
            };

            head.appendChild(script);
        }else{
            callback();
        }
    }

    Module.prototype.translateTo = function(language, parameters) {
        this.currents.language = language;
        parameters = this.preLoad(parameters);
        parameters.translate.all = true;
        this.translate(parameters);
    };

    Module.prototype.translate = function(parameters, callback) {
        parameters = (typeof parameters !== 'object') ? this.preLoad().translate : parameters;
        callback = (typeof callback !== 'function') ? function(){} : callback;

        var t = this;
        if(parameters.load === true){
            this.getXML(parameters, callback);
        }else{
            callback(t);
        }
    };

    Module.prototype.isTranslated = function(file) {
        var r = false;
        if(typeof this.currents.languages === 'object'){
            var lang = this.currents.languages;
            if(typeof lang[this.name] === 'object'){
                var l = lang[this.name];
                if(typeof l[file] === 'object'){
                    r = true
                }
            }
        }

        return r;
    };

    Module.prototype.getXML = function(parameters, callback) {
        callback = (typeof callback !== 'function') ? function(){} : callback;

        var t = this;
        if(this.isTranslated(parameters.file) === false){
            new Vi({url: this.getLanguageUrl()+parameters.file, response: 'xml', cache: true}).server(function(r){
                t.setLanguageJson(r, parameters.file);
                t.translateModule(parameters, callback);
            });
        }else{
            t.setLanguageJson(this.getLanguageJson(parameters.file), parameters.file);
            this.translateModule(parameters, callback);
        }


    };

    Module.prototype.translateModule = function(parameters, callback) {
        callback = (typeof callback !== 'function') ? function(){} : callback;

        var xmls = {};
        if(parameters.all === true || typeof this.currents.mainXML === 'undefined'){
            var t = this;
            this.setMainXML(function(){
                xmls = {'00': t.currents.mainXML};
                xmls.current = t.getLanguageJson(parameters.file);
                languageToDOM(xmls);

                callback(t);
            });
        }else{
            xmls.current = this.getLanguageJson(parameters.file);
            languageToDOM(xmls);
            callback(this);
        }
        
    };

    Module.prototype.setMainXML = function(callback) {
        var t = this;
        if(typeof t.currents.mainXML === undefined || t.currents.mainLang !== t.currents.language){
            callback = (typeof callback !== 'function') ? function(){} : callback;
            new Vi({url: 'language/'+this.currents.language+'/main.xml', response: 'xml', cache: true}).server(function(r){
                t.currents.mainXML = r;
                t.currents.mainLang = t.currents.language;
                callback();
            });
        }else{
            callback();
        }
    };

    Module.prototype.getMainXML = function() {
        return (this.currents.mainXML !== undefined) ? this.currents.mainXML : {};
    };

    Module.prototype.setLanguageJson = function(j, file) {
        if(typeof file === 'undefined'){
            file = 'content.xml';
        }

        this.currents.jlang = j;
        this.currents.jlangfile = file;
        if(typeof this.currents.languages[this.currents.language] !== 'object'){
            this.currents.languages[this.currents.language] = {};
        }

        if(typeof this.currents.languages[this.currents.language][this.name] !== 'object'){
            this.currents.languages[this.currents.language][this.name] = {};
        }
        this.currents.languages[this.currents.language][this.name][file] = j;
    };

    Module.prototype.getLanguageJson = function(file, module) {
        if(typeof file === 'undefined'){
            file = 'content.xml';
        }

        if(typeof module === 'undefined'){
            module = this.name;
        }
        var langs = this.currents.languages;
        var currentLang = langs[this.currents.language];
        var j = this.currents.languages[this.currents.language][module][file];
        
        return j;
    };

    Module.prototype.ajax = function(url, j){
        if(j.mClass === undefined){
            j.mClass = false;
        }
        if(j.mensaje === undefined){
            j.mensaje = {};
        }
        j.response = 'object';
        j.url = url + j.file;
        delete j.file; 

        Vi(j).server(function(r){
            if(typeof j.callback === 'function'){
                j.callback(r);
            }
        });
    }

    //Obtiene la dirección de la categoría a la que pertenece el módulo (si es que aplica).
    Module.prototype.getServerCat = function(file, data, callback){
        this.getServer(file, data, callback);
    }
    
    //Obtiene la dirección del módulo en el servidor.
    Module.prototype.getServer = function(file, data, callback){
        var j = {};
        if(typeof file !== 'object'){
            j.file = file;
            j.data = data;
            j.callback = callback;
        }else{
            j = file;
        }
        this.ajax(this.getUrl()+'/server/', j);
    }
    
    Module.prototype.getLanguageUrl = function() {
        return 'language/'+this.currents.language+'/'+this.name+'/';
    };
    
    Module.prototype.getUrl = function(){
        return this.url+this.name;
    }
    
    //url url de los archivos del servidor
    Module.prototype.getUrlServer = function(){
       return this.getUrl();
    }
    
    Module.prototype.getText = function(tag, file){
        var x = this.getLanguageJson(file).getElementsByTagName(tag)[0];
        var y = x.childNodes[0];
        return y.nodeValue;
    }

    Module.prototype.getMainText = function(tag, file) {
        var x = this.getMainXML(file).getElementsByTagName(tag)[0];
        var y = x.childNodes[0];
        return y.nodeValue;
    };

    Module.prototype.preLoad = function(parameters) {
        var p = parameters;
        p = (typeof p !== 'object') ? {} : p;

        //Javascript
        //----------
        p.js = (typeof p.js !== 'object') ? {} : p.js;
        p.js.load = (typeof p.js.load !== 'boolean') ? true : p.js.load;
        p.js.file = (typeof p.js.file !== 'string') ? 'main.js' : p.js.file;

        //CSS
        //----------
        p.css = (typeof p.css !== 'object') ? {} : p.css;
        p.css.load = (typeof p.css.load !== 'boolean') ? true : p.css.load;
        p.css.file = (typeof p.css.file !== 'string') ? 'style.css' : p.css.file;

        //HTML
        //----------
        p.html = (typeof p.html !== 'object') ? {} : p.html;
        p.html.load = (typeof p.html.load !== 'boolean') ? true : p.html.load;
        p.html.file = (typeof p.html.file !== 'string') ? 'main.html' : p.html.file;

        //Translate
        //----------
        p.translate = (typeof p.translate !== 'object') ? {} : p.translate;
        p.translate.load = (typeof p.translate.load !== 'boolean') ? true : p.translate.load;
        p.translate.file = (typeof p.translate.file !== 'string') ? 'content.xml' : p.translate.file;

        return p;
    };

    Module.prototype.start = function(callback, parameters) {
        var t = this;

        if(typeof callback !== 'function'){
            callback = function(){};
        }

        var params = this.preLoad(parameters);

        this.getCSS(params.css, function(){
            t.getHTML(params.html, function(){
                t.translate(params.translate, function(tr){
                    tr.getJS(params.js, callback);
                });
            });
        })
    };

    window.AppSystem = function(j){
        return new App(j);
    }

    function languageToDOM(xmls){
        for(var xml in xmls){
            if(xmls.hasOwnProperty(xml)){
                var xm = xmls[xml].getElementsByTagName('dom');
                for(var i = 0, len = xm.length; i < len; i++){
                    var dom = xm[i];
                    for(var j = 0, len2 = dom.childNodes.length; j < len2; j++){
                        var node = dom.childNodes[j];
                        if(node.nodeName !== '#text'){
                            if(node.childNodes[0] !== undefined){
                                var tags = document.querySelectorAll('*[data-ltag="'+node.childNodes[0].parentNode.tagName+'"]');
                                if(tag !== null){
                                    for(var k = 0, len3 = tags.length; k < len3; k++){
                                        var tag = tags[k];
                                        var c = 'class';
                                        var attr = node.getAttribute(c);
                                        if(attr !== '' && attr !== null){
                                            tag.setAttribute(c, attr);
                                        }
                                        var t = node.childNodes[0].data;
                                        t = document.innerHTML=t;
                                        tag.innerHTML = t;
                                        //Se hizo este cambio para poder introducir CDATA en el XML
                                        //tag.appendChild(t);
                                    }
                                }
                            }    
                        }
                    }
                }
            }
        }
    }

})();

(function () {
    'use strict';

    var DEFAULT_MAX_DEPTH = 1000;
    var DEFAULT_ARRAY_MAX_LENGTH = 1000;
    var seen; // Same variable used for all stringifications

    Date.prototype.toPrunedJSON = Date.prototype.toJSON;
    String.prototype.toPrunedJSON = String.prototype.toJSON;

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function str(key, holder, depthDecr, arrayMaxLength) {
        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            partial,
            value = holder[key];
        if (value && typeof value === 'object' && typeof value.toPrunedJSON === 'function') {
            value = value.toPrunedJSON(key);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            if (depthDecr<=0 || seen.indexOf(value)!==-1) {
                return '"-pruned-"';
            }
            seen.push(value);
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = Math.min(value.length, arrayMaxLength);
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value, depthDecr-1, arrayMaxLength) || 'null';
                }
                v = partial.length === 0
                    ? '[]'
                    : '[' + partial.join(',') + ']';
                return v;
            }
            for (k in value) {
                if (Object.prototype.hasOwnProperty.call(value, k)) {
                    try {
                        v = str(k, value, depthDecr-1, arrayMaxLength);
                        if (v) partial.push(quote(k) + ':' + v);
                    } catch (e) { 
                        // this try/catch due to some "Accessing selectionEnd on an input element that cannot have a selection." on Chrome
                    }
                }
            }
            v = partial.length === 0
                ? '{}'
                : '{' + partial.join(',') + '}';
            return v;
        }
    }

    JSON.pruned = function (value, depthDecr, arrayMaxLength) {
        seen = [];
        depthDecr = depthDecr || DEFAULT_MAX_DEPTH;
        arrayMaxLength = arrayMaxLength || DEFAULT_ARRAY_MAX_LENGTH;
        return str('', {'': value}, depthDecr, arrayMaxLength);
    };

}());