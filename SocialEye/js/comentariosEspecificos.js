var especificos = new Widget();

especificos.loadWidget = function () {
    params = {};
    params.tipo = 'commentBox';
    data = especificos.getObjectsInUrl(window.location.href, params);
    var commentIcon;
    $.each(data, function (i, item) {
        $("#socialEyeContainer").append(getCommentIcon(item));
    });
    return "";
}

especificos.onReady = function (){    
       $('body').on("click", '.iconoComentarioEspecifico', showSpecificBox);
        changeClickListeners();
}

function getSpecificBox(tag){
        var commentBox = "<div class='specificBox socialEye' id='specificBox" + tag + "'>";
        commentBox += "<div class='titleBox'>";
        commentBox += "<label> Comentarios relacionados </label>";
        commentBox += "<button type='button' class='close botonCerrar cerrarEspecifico' id='cerrarComentario" + tag + "' aria-hidden='true'>&times;</button>";
        commentBox += "</div>";
        commentBox += "<div class='actionBox'>";
        commentBox += "<ul id='listaComentario" + tag + "' class='commentList'>";
        params = {};
        params.tag = tag;
        params.tipo = 'comment';
        data = especificos.getObjectsInUrl(window.location.href, params);
        $.each(data, function (i, item) {
            commentBox += "<li><div class='commentText'>";
            commentBox += "<span class='date sub-text'>" + item.username + " dijo el " + item.date + "</span>";
            commentBox += "<p>" + item.element.texto + "</p>";
            commentBox += "</div>";
            commentBox += "</li>";
        });
        commentBox += "<li>";
        commentBox += "</li>";
        commentBox += "</ul>";
        commentBox += "<form class='form-inline' role='form'>";
        commentBox += "<textarea class='form-control' id='textoComentario" + tag + "' type='text' placeholder='Escribe un comentario' ></textarea>";
        commentBox += "<button type = 'button' id='agregarComentario" + tag + "' class='btn btn-primary agregarComentarioEspecifico'>Agregar</button>";
        commentBox += "</form>";
        commentBox += "</div>";
        commentBox += "</div>";
        return commentBox;
}

function showSpecificBox(e){
        var tagAux;
        var boxElement;
        var elementClicked = document.getElementById(e.target.id);
        if(!($(elementClicked).hasClass("iconoClick"))){
            tagAux = getXPath(e.target);
        }
        else{
            tagAux = e.target.id;
        }

        params = {};
        params.tag = tagAux;
        params.tipo = 'commentBox';
        var boxObject = especificos.getObjectInUrl(window.location.href, params);
        if(boxObject == null){
            obj = {};
            obj.tag = tagAux;
            obj.tipo = 'commentBox';
            obj.positionLeft = e.pageX;
            obj.positionTop = e.pageY;
            especificos.saveObject(obj);
            params = {};
            params.tag = tagAux;
            params.tipo = 'commentBox';
            boxObject = especificos.getObjectInUrl(window.location.href, params);
            $("#socialEyeContainer").append(getCommentIcon(boxObject));
        }
        $("#socialEyeContainer").append(getSpecificBox(tagAux));

        boxElement = document.getElementById("specificBox" + tagAux);

        positionLeft = boxObject.element.positionLeft + 25;
        positionTop = boxObject.element.positionTop + 25;

        boxElement.style.left = positionLeft + 'px';
        boxElement.style.top = positionTop + 'px';

        $(".agregarComentarioEspecifico").on('click',function (e) {
            var tag = e.target.id.substr(17, e.target.id.length);
            var usuarioComentario = especificos.getUser();
            var textoComentarioTag = document.getElementById("textoComentario" + tag);
            if (textoComentarioTag.value != "") {
                obj = {}
                obj['texto'] = textoComentarioTag.value;
                obj['tipo'] = 'comment';
                obj['tag'] = tag;
                result = especificos.saveObject(obj);
                if (result == true) {
                    //Creo los objetos
                    var parrafo = document.createElement('p');
                    parrafo.innerHTML = textoComentarioTag.value;
                    var span = document.createElement('span');
                    span.setAttribute('class', 'date sub-text');
                    var d = new Date();
                    var hs = d.getHours();
                    var mins = d.getMinutes();
                    var secs = d.getSeconds();
                    span.innerHTML = usuarioComentario + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                    var divComentario = document.createElement('div');
                    divComentario.setAttribute('class', 'commentText');
                    var lineaComentario = document.createElement('li');
                    //Uno los objetos
                    divComentario.appendChild(span);
                    divComentario.appendChild(parrafo);
                    lineaComentario.appendChild(divComentario);
                    var listaComentarioTag = document.getElementById("listaComentario" + tag);
                    $(listaComentarioTag).append(lineaComentario);
                    $(textoComentarioTag).val("");
                    $(listaComentarioTag).animate({scrollTop: $(listaComentarioTag)[0].scrollHeight});
                }
            }
            return false;
        });

        $(".cerrarEspecifico").on('click',function (e) {
            var tag = e.target.id.substr(16, e.target.id.length);
            var boxElement = document.getElementById('specificBox' + tag);
            $(boxElement).remove();
        });
}

function getCommentIcon(item){
    var commentIcon = "<a class='socialEye iconoComentarioEspecifico' title='Mostrar comentarios' style='position:absolute; top:"+item.element.positionTop+"px; left:"+item.element.positionLeft+"px'>";
    commentIcon += "<span class='fa-stack fa-lg socialEye'>";
    commentIcon += "<i id='"+item.element.tag+"' class='fa fa-comments fa-stack-1x socialEye iconoClick'>";
    commentIcon += "</i></span></a>"; 
    return commentIcon;
}


function getXPath(element) {
        var val = element.value;
        var xpath = '';
        for (; element && element.nodeType == 1; element = element.parentNode) {
            var id = $(element.parentNode).children(element.tagName).index(element) + 1;
            id > 1 ? (id = '[' + id + ']') : (id = '');
            xpath = '/' + element.tagName.toLowerCase() + id + xpath;
        }
        return xpath;
}

function toArray(arraylike) {
        var array = new Array(arraylike.length);
        for (var i = 0, n = arraylike.length; i < n; i++)
            array[i] = arraylike[i];
        return array;
}

function changeClickListeners() {
        var all = toArray(document.getElementsByTagName('a')).concat(toArray(document.getElementsByTagName('div')));
        for (var i = 0, max = all.length; i < max; i++) {  
                all[i]._onclick = all[i].onclick;
                all[i].onclick = function (e) {    
                    if(!($(e.target).parents().hasClass('socialEye'))){               
                        e.stopPropagation();
                        e.preventDefault();
                        showSpecificBox(e);
                    }
                }           
        }
}