function Llamada(){
    this.iniciarScript = function () {

        $("body").append(crearHtmlVideo());

    }

    function crearHtmlVideo() {
        video = "<div>";
        video += "<video id='localVideo' autoplay muted></video>";
        video += "</div>";
        video += "<div>";
        video += "<video id='remoteVideo' autoplay></video>";
        video += "</div>";
        video += "<div>";
        video += "<button id='startButton'>Start</button>";
        video += "<button id='callButton'>Call</button>";
        video += "<button id='hangupButton'>Hang Up</button>";
        video += "</div>";
        return video;
    }
}