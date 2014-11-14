"use strict";
(function(window, document, undefined){
	var keys = {};
	var stringToCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause":19,"Caps":20,"Esc":27,"Escape":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Windows":91,"Right Click":93,"Num0":96,"Num1":97,"Num2":98,"Num3":99,"Num4":100,"Num5":101,"Num6":102,"Num7":103,"Num8":104,"Num9":105,"Num*":106,"Num+":107,"Num-":109,"Num.":110,"Num/":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};
	var eventList = {};
	var KeyInput = {};
	KeyInput.ready = false;
	KeyInput.setup = function(){
		document.documentElement.addEventListener("keyup", keyUp, false);
		document.documentElement.addEventListener("keydown", keyDown, false);
		KeyInput.ready = true;
	}
	KeyInput.cleanup = function(){
		for(var i in keys){
			if(keys.hasOwnProperty(i)){
				KeyInput.off(Number(i));
			}
		}
		document.documentElement.removeEventListener("keyup", keyUp, false);
		document.documentElement.removeEventListener("keydown", keyDown, false);
		KeyInput.ready = false;
	};
	KeyInput.getKey = function(keyCode){
		var key = typeof keyCode === 'number' ? keyCode : stringToCode[""+keyCode];
		return keys[key];
	};
	KeyInput.setKey = function(keyCode, bool){
		var key = typeof keyCode === 'number' ? keyCode : stringToCode[""+keyCode];
		if(undefined === keys[key]){return KeyInput;}
		if(bool !== true && bool !== false){
			console.warn("KeyInput.setKey: You must pass in a boolean value as the second parameter.");
			return;
		}
		if(bool === keys[key]){return;}
		keys[key] = bool;
		if(eventList["Key"+keyCode]){
			var node = eventList["Key"+keyCode].first;
			while(node !== null){
				node.callback(bool);
				node = node.next;
			}
		}
		return KeyInput;
	};
	KeyInput.on = function(keyCode, callback){
		var key = typeof keyCode === 'number' ? keyCode : stringToCode[""+keyCode];
		keys[key] = false;
		if(callback){
			if(typeof callback === 'function'){
				if(!eventList["Key"+key]){
					eventList["Key"+key] = {first:null, last:null};
				}
				var node = {previous:null, next:null, callback:callback};
				if(null === eventList["Key"+key].first){
					eventList["Key"+key].first = node;
					eventList["Key"+key].last = node;
				}
				else{
					node.next = eventList["Key"+key].first;
					eventList["Key"+key].first.previous = node;
					eventList["Key"+key].first = node;
				}
			}
		}
		return KeyInput;
	};
	KeyInput.off = function(keyCode, callback){
		var key = typeof keyCode === 'number' ? keyCode : stringToCode[""+keyCode];
		if(undefined === callback){
			if(eventList["Key"+key]){
				while(null !== eventList["Key"+key].first){
					var node = eventList["Key"+key].first;
					eventList["Key"+key].first = node.next;
					node.previous = null;
					node.next = null;
				}
				eventList["Key"+key].last = null;
				delete eventList["Key"+key];
			}
			return KeyInput;
		}
		
		var node = eventList["Key"+key].first;
		while(node != null){
			if(node.callback === callback){
				break;
			}
			node = node.next;
		}
		if(node !== null){
			if(eventList["Key"+key].first === node){
				eventList["Key"+key].first = eventList["Key"+key].first.next;
			}
			if(eventList["Key"+key].last === node){
				eventList["Key"+key].last = eventList["Key"+key].last.previous;
			}
			if(node.previous !== null){
				node.previous.next = node.next;
			}
			if(node.next !== null ){
				node.next.previous = node.previous;
			}
		}
		if(null === eventList["Key"+key].first){
			delete eventList["Key"+key];
		}
		return KeyInput;
	};
	var keyDown = function(e){
		e = e || window.event;
		var keyCode = (typeof e.which === "undefined") ? e.keyCode : e.which;
		if(true === keys[keyCode]){return;}
		keys[keyCode] = true;
		if(eventList["Key"+keyCode]){
			var node = eventList["Key"+keyCode].first;
			while(node !== null){
				node.callback(true);
				node = node.next;
			}
		}
	};
	var keyUp = function(e){
		e = e || window.event;
		var keyCode = (typeof e.which === "undefined") ? e.keyCode : e.which;
		if(false === keys[keyCode]){return;}
		keys[keyCode] = false;
		if(eventList["Key"+keyCode]){
			var node = eventList["Key"+keyCode].first;
			while(node !== null){
				node.callback(false);
				node = node.next;
			}
		}
	};
	var global = global || window;
	global.KeyInput = KeyInput;
}(window, document));