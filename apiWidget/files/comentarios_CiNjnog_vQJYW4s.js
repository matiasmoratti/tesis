var comentarios = new Widget();
comentarios.descripcion = "Permite realizar comentarios entre los usuarios sobre una web en particular.";
comentarios.icono = "commenting";
comentarios.tittle = "Comentarios Generales";
comentarios.loadWidget = function () {
  // var html = "<div class='detailBox socialEye <%= idWidget %>'><div class='titleBox socialEye'><label class='socialEye'><%= title %></label><button class='botonCerrar socialEye cerrar<%= idWidget %>' aria-hidden='true'>&times;</button></div><div id='<%= idWidget %>principalGenerales' class='actionBox socialEye principal<%= idWidget %>'><ul id='<%= idWidget %>listaComentariosGenerales' class='commentList socialEye list<%= idWidget %>'><% _.each(items, function(item) { %><li class='socialEye'><div class='socialEye commentText'><span class='socialEye sub-text'><%= item.username %> dijo el <%= item.date %></span><p class='socialEye'><%= item.element.texto %></p></div></li><% }); %></ul><form class='socialEye form<%= idWidget %>'><textarea class='form-control socialEye textArea<%= idWidget %>' type='text' id='<%= idWidget %>textoComentarioGeneral' placeholder='Escriba su comentario...'></textarea><button class='submitButton socialEye button<%= idWidget %>' id='<%= idWidget %>agregarComentarioGeneral'>Agregar</button></form></div></div>";

  items = comentarios.getObjectsInUrl(window.location.href);

  var data = {idWidget: comentarios.idWidget,
            title : comentarios.tittle,
            items : items,
            file: 'comentarios_L76B80n.html'};
  comentarios.createTemplate('principal', 'Comentarios', 'comentarios_L76B80n.html', data);
}

comentarios.onCloseWidget = function (){
    $("#textoComentarioGeneral").val("");
}


comentarios.onReady = function () {
    $("#"+comentarios.idWidget+"listaComentariosGenerales").scrollTop($("#"+comentarios.idWidget+"listaComentariosGenerales")[0].scrollHeight);
    $(".cerrar"+comentarios.idWidget).on('click',function (e) {
        comentarios.close();
    });

    $(comentarios.getWidgetElement("agregarComentarioGeneral")).on('click', function (event) {
        if ($(comentarios.getWidgetElement("textoComentarioGeneral")).val() != "") {
            var c = {};
            c['texto'] = $(comentarios.getWidgetElement("textoComentarioGeneral")).val();
            result = comentarios.saveObject(c);
            if (result != 0) {

               var d = new Date();
               var hs = d.getHours();
               var mins = d.getMinutes();
               var secs = d.getSeconds();
               var spanText = comentarios.getUser() + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
               var textoComentario = $(comentarios.getWidgetElement("textoComentarioGeneral")).val();
               var data = {spanText: spanText,
                         textoComentario : textoComentario};

                comentarios.injectInTemplate('principal', "#"+comentarios.idWidget+"listaComentariosGenerales",'lineaComentario.html', data);
                $(comentarios.getWidgetElement("textoComentarioGeneral")).val("");
                $(comentarios.getWidgetElement("listaComentariosGenerales")).animate({scrollTop: $(comentarios.getWidgetElement("listaComentariosGenerales"))[0].scrollHeight});
            }
        }

        return false;
    });
}
