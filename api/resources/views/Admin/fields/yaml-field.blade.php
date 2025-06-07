<style type="text/css" media="screen">
    #editor { 
        height: 500px;
        font-size: 16px;
    }
</style>


    <div id="editor">{{ $config_file }}</div>

    <input type="hidden" name="config_file" id="config_file" value="{{ $config_file }}">
    

<script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/yaml");
    editor.setFontSize(16);

    editor.on('change', function() {
        document.getElementById('config_file').value = editor.getValue();
    });
</script>