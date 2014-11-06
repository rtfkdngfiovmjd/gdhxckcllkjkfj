var BASE_URL = 'http://192.168.10.108/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
var pagina_atual = 'login';

$(function(){
    //Atualização de página
    $(document).on('click','#atualizar-notas',function(){
        $('#coteudo-notas').hide();
        $('#load').show();
        carrega_notas_adx(true);
    });
    $(document).on('click','#atualizar-mural',function(){
        $('#conteudo-mural').hide();
        $('#load').show();
        carrega_mural_adx();
    });
    //Sair da aplicação
    $(document).on('click','#sair',function(){
        sair();
    });
    //Entrar na aplicação
    $(document).on('click','#entrar',function(){
        if($("#unidade").val()==""){
            alert("Informe a unidade");
            return false;
        }
        if($("#aluno").val()==""){
            alert("Informe seu usuário");
            return false;
        }
        if($("#senha").val()==""){
            alert("Informe sua senha");
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
                    }
                    pagina_atual = 'mural';
                    $('body').load("mural.html");
                    carrega_mural_adx();
                    carrega_notas_adx();
                };
            },
            error: function(){
                alert('Estamos com problemas para verificar seu usuário, verifique se você está conectado a internet');
            },
        });
    });

    //Se o aluno existir já entra na aplicação
    if(aluno != null && unidade != null){
        $('#tela').show();
        pagina_atual = 'mural';
        $('body').load("mural.html");
        carrega_notas_adx();
        carrega_mural_adx();
    }
    else{
        pagina_atual = 'login';
        $('body').load("login.html");
        $('#tela').show();
    }
});

function carrega_pagina(){
    pagina_atual = $('.content').attr('data-page');
    console.log(pagina_atual);
    if(pagina_atual == 'notas'){
        gera_html_notas();
    }
    else if(pagina_atual == 'disciplina'){
        gerar_html_disciplina(window.location.href.split("#")[1]);
    }
    else if(pagina_atual == 'mural'){
        gerar_html_mural();
    }
}

function get_class_nota(nota){
    if(nota >= 70){
        return 'badge-primary';
    }
    else{
        return 'badge-negative';
    }
}

function carrega_notas_adx(gerar_html){
    verifica_usuario();
    $.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL+'notasMobile.php',
        data:{
            aluno:aluno,
            unidade:unidade
        },
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(ret) {
            ret = remove_espaco_nome_disciplina(ret);
            localStorage.setItem('ret',JSON.stringify(ret));
            if(gerar_html){
                gera_html_notas();
            }
        },
        error: function(){
            alert('Estamos com problemas para buscar suas notas, verifique se está conectado a internet!');
            if(gerar_html){
                gera_html_notas();
            }
        },
    });
}


function gera_html_notas(){
    var ret = jQuery.parseJSON(localStorage.getItem('ret'));
    $('#lista-notas').html('');
    for(var key in ret){
        $('#lista-notas').append('<li class="table-view-cell"><a data-transition="slide-in" href="disciplina.html#'+key+'" class="disciplina navigate-right"><span class="badge '+get_class_nota(ret[key].nota)+'">'+ret[key].nota+'</span>'+ret[key].nome+'</a></li>');
    }
    $('#load').hide();
    $('#coteudo-notas').show();
}

function gerar_html_disciplina(disciplina){
    var ret = jQuery.parseJSON(localStorage.getItem('ret'));
    var agendamentos = '';
    $('#conteudo').html('');
    $('#conteudo').append('<ul class="table-view"><li class="table-view-cell"><a><span class="badge badge-inverted">Nota</span>Agendamentos<p>'+disciplina+'</p></a></li></ul>');
    for(var key in ret[disciplina].etapas){
        agendamentos = '';
        $('#conteudo').append('<ul class="table-view etapa"><li class="table-view-cell etapa-nome"><span class="badge badge-primary">'+ret[disciplina].etapas[key].nota+'</span>'+key+'</li></ul>');
        agendamentos = agendamentos + '<div class="card"><ul class="table-view">';
        for(var key2 in ret[disciplina].etapas[key].agenda){
            agendamentos = agendamentos + '<li class="table-view-cell"><span class="badge nota-agendamento">'+ret[disciplina].etapas[key].agenda[key2].nota+'</span>'+ret[disciplina].etapas[key].agenda[key2].nome+'<p>Data: '+ret[disciplina].etapas[key].agenda[key2].data+'</p><p>Valor: '+ret[disciplina].etapas[key].agenda[key2].valor+'</p></li>';
        }
        agendamentos = agendamentos + '</ul></div>';
        $('#conteudo').append(agendamentos);
    }
    $('#load').hide();
    $('#conteudo').show();
}

function gerar_html_mural(){
    var mural = jQuery.parseJSON(localStorage.getItem('mural'));
    var modais;
    $('#lista-mural').html('');
    for(var key in mural){
        $('#lista-mural').append('<li class="table-view-cell media"><a href="#myModalexample'+key+'"><div class="media-body">'+mural[key].assunto+'<p>'+remove_tag_string(mural[key].texto).slice(0,100)+'...</p></div></a></li>');
        modais = modais + '<div id="myModalexample'+key+'" class="modal"><header class="bar bar-nav"><a class="icon icon-close pull-right" href="#myModalexample'+key+'"></a><h1 class="title titulo-modal">AVISOS</h1></header><div class="content"><p class="titulo-aviso">'+mural[key].assunto+'</p><p class="remetente-data">Data: '+mural[key].data+'<br />De: '+valida_remetente(mural[key].remetente)+'</p><p class="texto-aviso content-padded">'+mural[key].texto+'</p></div></div>';
    }
    $('#modais').append(modais);
    $('#load').hide();
    $('#conteudo-mural').show();
    $('.texto-aviso').find('a').each(function(){
        $(this).attr('onclick','window.open("'+$(this).attr('href')+'", "_system")');
    })
}

function carrega_mural_adx(){
    verifica_usuario();
    $.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL+'muralMobile.php',
        data:{
            aluno:aluno,
            unidade:unidade
        },
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(ret) {
            localStorage.setItem('mural',JSON.stringify(ret));
            gerar_html_mural();
        },
        error: function(){
            alert('Estamos com problemas para buscar seu mural, verifique se está conectado a internet!');
            gerar_html_mural();
        },
    });
}

function remove_espaco_nome_disciplina(dados){
    var key_sem_espaco;
    for(var key in dados){
        key_sem_espaco = key.trim();
        if (key_sem_espaco != key) {
            dados[key_sem_espaco] = dados[key];
            delete dados[key];
        }
    }
    return dados;
}

function remove_tag_string(html){
    var div = document.createElement("div");
    div.innerHTML = html;
    var text = div.textContent || div.innerText || "";
    return text;
}

function valida_remetente(text){
    if (text == null) {
        return 'Não informado'
    }
    else{
        return text;
    }
}

function sair(){
    localStorage.clear();
    aluno = null;
    unidade = null;
    pagina_atual = 'login';
    $('body').load('login.html');
    return false;
}

function verifica_usuario(){
    if(aluno == null || unidade == null){
        alert('Algo aconteceu e você não está mais logado!');
        sair();
    }
}

window.addEventListener('push', carrega_pagina);//evento que é disparado quando o ratchet carrega uma nova página