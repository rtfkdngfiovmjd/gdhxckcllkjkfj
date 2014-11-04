var BASE_URL = 'http://192.168.10.108/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
$(function(){
    if(aluno != null){
        window.location.href = "mural.html";
    }
    else{
        $('#tela').show();
    }
    $(document).on('click','#entrar',function(){
        if($("#unidade").val()==""){
            alert("Informe a unidade");
            return false;
        }
        $.ajax({
            type: 'GET', // defaults to 'GET'
            url: BASE_URL+'loginMobile.php',
            data:{
                unidade : $("#unidade").val(),
                aluno : $("#aluno").val(),
                senha : $("#senha").val()
            },
            dataType: 'json', //'json', 'xml', 'html', or 'text'
            async: true,
            success: function(ret) {
                if (ret.erro==1 ) {
                    alert("Senha ou usuário incorretos");
                    location.reload();
                } else{
                    aluno = $("#aluno").val();
                    unidade = $("#unidade").val();
                    if ($("#lembrar")[0].checked) {
                        localStorage.setItem('aluno',aluno);
                        localStorage.setItem('unidade',unidade);
                    };
                    window.location.href = "mural.html";
                };
            },
        });
    });
});