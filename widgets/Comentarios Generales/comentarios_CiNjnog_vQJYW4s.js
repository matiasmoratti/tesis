var comentarios = new Widget();
comentarios.descripcion = "Permite realizar comentarios entre los usuarios sobre una web en particular.";
comentarios.icono = "commenting";
comentarios.tittle = "Comentarios sobre la Web";

comentarios.loadWidget = function () {
  items = comentarios.getObjectsInUrl(window.location.href);

  var data = {items : items};

  comentarios.createTemplate('principal', comentarios.tittle, 'comentarios_L76B80n.html', data);
  comentarios.onCloseTemplate('principal', function(){
        comentarios.close();
  });
  comentarios.setTemplatePosition('principal', '10%', '10%');
}

comentarios.onCloseWidget = function (){
    $("#textoComentarioGeneral").val("");
}


comentarios.onReady = function () {
    $(comentarios.getWidgetElement("#listaComentariosGenerales")).scrollTop($(comentarios.getWidgetElement("#listaComentariosGenerales"))[0].scrollHeight);

    $(comentarios.getWidgetElement("#agregarComentarioGeneral")).on('click', function (event) {
        if ($(comentarios.getWidgetElement("#textoComentarioGeneral")).val() != "") {
            var c = {};
            c['texto'] = $(comentarios.getWidgetElement("#textoComentarioGeneral")).val();
            result = comentarios.saveObject(c);
            if (result != 0) {

               var d = new Date();
               var hs = d.getHours();
               var mins = d.getMinutes();
               var secs = d.getSeconds();
               var spanText = comentarios.getUser() + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
               var textoComentario = $(comentarios.getWidgetElement("#textoComentarioGeneral")).val();
               var data = {spanText: spanText,
                         textoComentario : textoComentario};

                comentarios.injectInTemplate('principal','lineaComentario.html', data,"#listaComentariosGenerales");
                $(comentarios.getWidgetElement("#textoComentarioGeneral")).val("");
                $(comentarios.getWidgetElement("#listaComentariosGenerales")).animate({scrollTop: $(comentarios.getWidgetElement("#listaComentariosGenerales"))[0].scrollHeight});
            }
        }

        return false;
    });
}
