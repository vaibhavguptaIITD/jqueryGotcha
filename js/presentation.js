$(function(){
	//configure hashes
	var sections = $(".sections");
	window.onhashchange = function(){
		handleHashChange();
	};
	function handleHashChange(){
		var hash = location.hash;
		sections.hide();
		if(hash){
			showSection(hash);
			clearPreview();
			return;
		}
		location.hash = "#"+sections.get(0).id;

	}
	function showSection(hash){
		$(hash).show();
		$("li.active").removeClass("active");
		$("a[href="+hash+"]").closest("li").addClass("active");
	}
	function getHash(url){
		var pattern = /#([^\s]+)/;
		var matches = pattern.exec(url);
		if(matches){
			return matches[1];
		}
		return null;
	}

	var clearPreview = (function(){
		var $errorContainer = $("#windowError"),
		$logContainer = $("#log"),
		$preview = $("#preview");
		return function(){
			$errorContainer.hide().find("p.message").empty();
			$logContainer.hide().find("p.message").empty();
			$preview.hide().empty();
		};
	}());


	//configure code highlight
	var THEME = "solarized dark";

	var html = CodeMirror.fromTextArea(document.getElementById('html'), {
		mode: 'text/html',
		theme:THEME
	});
	var javascript = CodeMirror.fromTextArea(document.getElementById('javascript'), {
		mode: 'javascript',
		theme:THEME
	});

	var explanationCode = CodeMirror.fromTextArea(document.getElementById('explainCode'), {
		mode: 'javascript',
		theme:THEME
	});

	$(window).trigger("hashchange");

	//configure code sandbox
	$("#runCode").click(function(){
		var bodyText = html.getValue(),
		scriptText = javascript.getValue();
		runCode(bodyText, scriptText);
	});

	$("#runExample").click(function(){
		var scriptText = explanationCode.getValue();
		runCode("", scriptText);
	});

	var runCode = (function(){
		var htmlTemplate = "{{{body}}}<script>{{{script}}}</script>",
		template = Handlebars.compile(htmlTemplate),
		$preview = $("#preview");
		return function(bodyText, scriptText){
			var output = template({body: bodyText, script: scriptText});
			$preview.html(output).show();
		};
	}());

	$("#highlight").click(function(){
		var $this = $(this),
		$childIcon = $this.find("i"),
		linesToHighlight = $this.attr("data-highlight"),
		linesToHighlightArray = getNumberArrayFromDelimitedString(linesToHighlight);
		if($childIcon.hasClass("icon-white")){
			highlightCode(linesToHighlightArray);
			$childIcon.removeClass("icon-white");
		}
		else{
			unhighlightCode(linesToHighlightArray);
			$childIcon.addClass("icon-white");
		}
	});

	function getNumberArrayFromDelimitedString(str){
		var pattern = /\d+/g,
		matches = null,
		numberArray = [];
		while(matches = pattern.exec(str)){
			numberArray.push(parseInt(matches[0], 10));
		}
		return numberArray;

	}

	function highlightCode(linesToHighlightArray){
		var totalLineCount = javascript.lineCount(),
		i = 0;
		for(; i < totalLineCount; i++){
			if(linesToHighlightArray.indexOf(i) == -1){
				javascript.addLineClass(i, "wrap","dim");
			}
			else{
				javascript.addLineClass(i, "wrap","highlight");
			}
		}
	}

	function unhighlightCode(linesToHighlightArray){
		var totalLineCount = javascript.lineCount(),
		i = 0;
		for(; i < totalLineCount; i++){
			if(linesToHighlightArray.indexOf(i) == -1){
				javascript.removeLineClass(i, "wrap","dim");
			}
			else{
				javascript.removeLineClass(i, "wrap","highlight");
			}
		}
	}
	$(".alert  > .close").click(function(){
		var $this = $(this);
		$this.closest(".alert").hide().find("p.message").empty();
	});

});

window.onerror = (function(){
	var $logContainer = $("#windowError");
	return function(message){
		logMessage($logContainer, message);
	};
}());

var log = (function(){
	var $logContainer = $("#log");
	return function(message){
		logMessage($logContainer, message);
	};
}());

function logMessage($container, message){
	var $p = $container.find("p.message");
	$p.append("<p>"+message+"</p>");
	$container.show();
}