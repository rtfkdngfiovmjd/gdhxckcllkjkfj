$(function () {
    $(document).on('keyup','#aluno', function(){
        if ($('#aluno').val().length == 9){
            $('#senha').focus();
        }
    });
    $(document).on('keydown','#aluno', function(event){
        var key = event.keyCode || event.charCode;
        if( key == 8 || key == 46 ){
            return;
        }
        else if ($('#aluno').val().length >= 9){
            $('#senha').focus();
            return false;
        }
    });
    $(document).on('click','.limpar',function(){
        $('#aluno').val('');
        $('#senha').val('');
        $('#unidade').val('');
    });
    $(document).on('focusin','.login-input', function(){
        $('#logo').hide();
        $('.login').css('margin-top','15px');
    });
    $(document).on('focusout','.login-input', function(){
        $('#logo').show();
        $('.login').css('margin-top','80px');
    });
    $(document).on('click','.manter-conectado', function(){
        if($('#lembrar')[0].checked == false){
            $('#lembrar')[0].checked = true;
        }
        else if($('#lembrar')[0].checked == true){
            $('#lembrar')[0].checked = false;
        }
        return false;
    });

    //Entrar na aplicação
    $(document).on('mousedown', '#entrar', function() {
        if ($("#unidade").val() == "") {
            notification('Informe a unidade!', 'notification-error');
            return false;
        }
        if ($("#aluno").val() == "") {
            notification('Informe seu usuário!', 'notification-error');
            return false;
        }
        if ($("#senha").val() == "") {
            notification('Informe sua senha!', 'notification-error');
            return false;
        }
        $.ajax({
            type: 'GET', // defaults to 'GET'
            url: BASE_URL + 'loginMobile.php',
            data: {
                unidade: $("#unidade").val(),
                aluno: $("#aluno").val(),
                senha: $("#senha").val()
            },
            dataType: 'json', //'json', 'xml', 'html', or 'text'
            async: true,
            success: function(dados) {
                if (dados.erro == 1) {
                    notification('Dados incorretos!', 'notification-error');
                } else {
                    aluno = $("#aluno").val();
                    unidade = $("#unidade").val();
                    nome = dados.nome;
                    lembrar = $("#lembrar")[0].checked;
                    if (lembrar) {
                        localStorage.setItem('aluno', aluno);
                        localStorage.setItem('unidade', unidade);
                        localStorage.setItem('nome', nome);
                    }
                    pagina_atual = 'mural';
                    $('body').load("mural.html",function(){
                        $('#menu').load('menu.html', function () {
                            $('#mural').addClass('item-ativo').next('hr').addClass('hr-ativo');
                        });
                    });
                    carrega_mural_adx();
                    carrega_notas_adx();
                    carrega_financeiro_adx();
                };
            },
            error: function() {
                notification('Sem conexão com a internet!', 'notification-error')
            }
        });
    });
});