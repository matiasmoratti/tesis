var especificos = new Widget();

especificos.loadWidget = function () {
    params = {};
    params.tipo = 'commentBox';
    data = especificos.getObjectsInUrl(window.location.href, params);
    var commentIcon;
    $.each(data, function (i, item) {
        $(especificos.getWidgetContainer()).append(getCommentIcon(item));
    });
    return null;
}

especificos.onReady = function (){    
       $('body').on("click", '.iconoComentarioEspecifico', showSpecificBox);
        changeClickListeners();
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
            $(especificos.getWidgetContainer()).append(getCommentIcon(boxObject));
        }
        boxAux = especificos.getBox(tagAux, "Comentarios relacionados");
        boxAux.classList.add('specificBox');

       // boxElement = document.getElementById("specificBox" + tagAux);

        positionLeft = boxObject.element.positionLeft + 25;
        positionTop = boxObject.element.positionTop + 25;

     //   boxElement.style.left = positionLeft + 'px';
    //    boxElement.style.top = positionTop + 'px';
        boxAux.style.left = positionLeft + 'px';
        boxAux.style.top = positionTop + 'px';

        bodyAux = especificos.getPrincipalBody("bodyComentario" + tagAux);
        listaAux = especificos.getPrincipalList("listaComentario" + tagAux);

        //Creo los objetos
        params = {};
        params.tag = tagAux;
        params.tipo = 'comment';
        datosComentarios = especificos.getObjectsInUrl(window.location.href, params);
        $.each(datosComentarios, function (i, item) {
            li = especificos.getLi();
            div = especificos.getDiv();
            div.classList.add('commentText');
            span = especificos.getSpan();
            span.classList.add('date','sub-text');
            span.innerHTML=item.username + " dijo el " + item.date;
            p = especificos.getP();
            p.innerHTML=item.element.texto;
            div.appendChild(span);
            div.appendChild(p);
            li.appendChild(div);
            listaAux.appendChild(li);
        });

        bodyAux.appendChild(listaAux);
        formAux = especificos.getForm('');
        textareaAux =especificos.getTextArea('textoComentario' + tagAux);
        textareaAux.placeholder = 'Escribe un comentario...';
        buttnAux = especificos.getButton('agregarComentario' + tagAux);
        buttnAux.classList.add('agregarComentarioEspecifico');
        buttnAux.innerHTML='Agregar';
        formAux.appendChild(textareaAux);
        formAux.appendChild(buttnAux);
        bodyAux.appendChild(formAux);
        boxAux.appendChild(bodyAux);

        $(especificos.getWidgetContainer()).append(boxAux);

        $(".agregarComentarioEspecifico").on('click',function (e) {
            var tag = e.target.id.substr(especificos.idWidget.toString().length + 17);
            var usuarioComentario = especificos.getUser();
            var textoComentarioTag = especificos.getWidgetElement("textoComentario" + tag);
            if (textoComentarioTag.value != "") {
                obj = {}
                obj['texto'] = textoComentarioTag.value;
                obj['tipo'] = 'comment';
                obj['tag'] = tag;
                result = especificos.saveObject(obj);
                if (result != 0) {
                    var parrafo = especificos.getP();
                    var span = especificos.getSpan();
                    span.setAttribute('class', 'date sub-text');
                    var d = new Date();
                    var hs = d.getHours();
                    var mins = d.getMinutes();
                    var secs = d.getSeconds();
                    span.innerHTML = usuarioComentario + " dijo el " + $.datepicker.formatDate('dd-mm-yy', d) + " " + hs + ":" + mins + ":" + secs;
                    parrafo.innerHTML = textoComentarioTag.value;
                    var divComentario = especificos.getDiv();
                    divComentario.setAttribute('class', 'commentText');
                    var lineaComentario = especificos.getLi();
                    //Uno los objetos
                    divComentario.appendChild(span);
                    divComentario.appendChild(parrafo);
                    lineaComentario.appendChild(divComentario);
                    $(especificos.getWidgetElement("listaComentario" + tag)).append(lineaComentario);
                    $(textoComentarioTag).val("");
                    $(especificos.getWidgetElement("listaComentario" + tag)).animate({scrollTop: $(especificos.getWidgetElement("listaComentario" + tag))[0].scrollHeight});
                }
            }
            return false;
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