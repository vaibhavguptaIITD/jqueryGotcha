$(function(){
	//configure hashes
	var sections = $(".sections > div");
	window.onhashchange = function(){
		handleHashChange();
	};
	function handleHashChange(){
		var hash = location.hash;
		sections.hide();
		if(hash){
			showSection(hash);
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
	$(window).trigger("hashchange");

	//configure code highlight
	var editor = CodeMirror.fromTextArea(document.getElementById('html'), {
        mode: 'text/html',
        theme:"solarized dark"
     });
	var javascript = CodeMirror.fromTextArea(document.getElementById('javascript'), {
        mode: 'javascript',
        theme:"solarized dark"
    });

	//configure code sandbox
	$("#runCode").click(function(){
		var bodyText = editor.getValue(),
		scriptText = javascript.getValue(),
		htmlTemplate = "{{{body}}}<script>{{{script}}}</script>",
		template = Handlebars.compile(htmlTemplate);
		var output = template({body: bodyText, script: scriptText});
		$("#preview").html(output).show();
	});

});