var BASE_URL = 'http://192.168.10.108/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
var pagina_atual = 'login';
var lembrar = null;
var ret;
var mural;

$(function(){
    //botão de voltar do android
    document.addEventListener("backbutton", botao_voltar, false);

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
    $(document).on('click','#notas, #voltar-notas',function(){
        $('body').load('notas.html',function(){
            carrega_pagina();
        });
    });
    $(document).on('click','#mural',function(){
        $('body').load('mural.html',function(){
            carrega_pagina();
        });
    });

    //Entrar na aplicação
    $(document).on('click','#entrar',function(){
        if($("#unidade").val()==""){
            notification('Informe a unidade!','notification-error');
            return false;
        }
        if($("#aluno").val()==""){
            notification('Informe seu usuário!','notification-error');
            return false;
        }
        if($("#senha").val()==""){
            notification('Informe sua senha!','notification-error');
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
            success: function(dados) {
                if (dados.erro==1 ) {
                    notification('Senha ou usuário incorretos!','notification-error');
                    location.reload();
                } else{
                    aluno = $("#aluno").val();
                    unidade = $("#unidade").val();
                    lembrar = $("#lembrar")[0].checked;
                    if (lembrar) {
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
                notification('Sem conexão com a internet!','notification-error')
            },
        });
    });    

    //Se o aluno existir já entra na aplicação
    if(aluno != null && unidade != null){
        lembrar = true;
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

function carrega_pagina(disciplina){
    pagina_atual = $('.content').attr('data-page');
    if(pagina_atual == 'notas'){ 
        gera_html_notas();
    }
    else if(pagina_atual == 'disciplina'){
        gerar_html_disciplina(disciplina);
    }
    else if(pagina_atual == 'mural'){
        gerar_html_mural();
    }
}

function get_class_nota(nota,valor){
    if(parseFloat(nota) >= parseFloat(valor)*0.7){
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
        success: function(dados) {
            ret = remove_espaco_nome_disciplina(dados);
            if (lembrar) {
                localStorage.setItem('ret',JSON.stringify(ret));
            }
            if(gerar_html){
                gera_html_notas();
            }
        },
        error: function(){
            ret =  JSON.parse(localStorage.getItem('ret'));
            if(gerar_html){
                notification('Sem conexão com a internet!','notification-error')
            }
            if(gerar_html){
                gera_html_notas();
            }
        },
    });
}


function gera_html_notas(){
    $('#lista-notas').html('');
    for(var key in ret){
        $('#lista-notas').append('<div class="card"><ul class="table-view"><li class="table-view-cell"><a onclick="$(\'body\').load(\'disciplina.html\',function(){carrega_pagina(\''+key+'\');})" class="disciplina navigate-right"><span class="badge '+get_class_nota(ret[key].nota,100)+'">'+parseFloat(ret[key].nota).toFixed(1)+'</span><span class="nome-azul">'+ret[key].nome+'</span></a></li></ul></div>');
    }
    $('#load').hide();
    $('#coteudo-notas').show();
}

function gerar_html_disciplina(disciplina){
    var agendamentos = '';
    $('#conteudo').html('');
    $('#conteudo').append('<ul class="table-view"><li class="table-view-cell titulo"><span class="badge badge-inverted nome">Nota</span>Agendamentos<p class="nome">'+disciplina+'</p></li></ul>');
    for(var key in ret[disciplina].etapas){
        agendamentos = '';
        $('#conteudo').append('<ul class="table-view etapa"><li class="table-view-cell etapa-nome"><span class="badge '+get_class_nota(ret[disciplina].etapas[key].nota,ret[disciplina].etapas[key].pontos)+'">'+parseFloat(ret[disciplina].etapas[key].nota).toFixed(1)+'</span>'+key+'</li></ul>');
        agendamentos = agendamentos + '<div class="card"><ul class="table-view">';
        for(var key2 in ret[disciplina].etapas[key].agenda){
            agendamentos = agendamentos + '<li class="table-view-cell"><span class="badge '+get_class_nota(ret[disciplina].etapas[key].agenda[key2].nota,ret[disciplina].etapas[key].agenda[key2].valor)+'">'+parseFloat(ret[disciplina].etapas[key].agenda[key2].nota).toFixed(1)+'</span><span class="nome-azul">'+ret[disciplina].etapas[key].agenda[key2].nome+'</span><p>Data: '+ret[disciplina].etapas[key].agenda[key2].data+'</p><p>Valor: '+ret[disciplina].etapas[key].agenda[key2].valor+'</p></li>';
        }
        agendamentos = agendamentos + '</ul></div>';
        $('#conteudo').append(agendamentos);
    }
    $('#load').hide();
    $('#conteudo').show();
}

function gerar_html_mural(){
    $('#lista-mural').html('');
    $('#modais').html('');
    for(var key in mural){
        $('#lista-mural').append('<div class="card"><ul class="table-view"><li class="table-view-cell media"><a onclick="altera_conteudo_modal(\''+mural[key].assunto+'\',\''+mural[key].data+'\',\''+valida_remetente(mural[key].remetente)+'\',\'<pre>'+encodeURI(mural[key].texto)+'</pre>\')" href="#myModal"><div class="media-body"><span class="nome-azul">'+mural[key].assunto+'</span><p>Toque para visualizar</p></div></a></li></ul></div>');
    }
    $('body').append('<div id="myModal" class="modal"><header class="bar bar-nav"><a id="fechar-modal" onclick="pagina_atual = \'mural\'" class="icon icon-left-nav pull-left" href="#myModal"></a><h1 class="title titulo-modal">AVISOS</h1></header><div class="modal-content content"><ul class="table-view"><li class="table-view-cell titulo titulo-aviso"></li></ul><div class="card"><span id="data"></span><br /><span id="remetente"></span></div><div class="card content-padded"><p class="texto-aviso"></p></div></div></div>');
    $('#load').hide();
    $('#conteudo-mural').show();
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
        success: function(dados) {
            mural = JSON.parse(JSON.stringify(dados).replace('\\n','<br />'));
            if (lembrar) {
                localStorage.setItem('mural',JSON.stringify(dados).replace('\\n','<br />'));
            }
           
            gerar_html_mural();
        },
        error: function(){
            mural =  JSON.parse(localStorage.getItem('mural'));
            notification('Sem conexão com a internet!','notification-error')
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
    ret = null;
    lembrar = null;
    aluno = null;
    unidade = null;
    mural = null;
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

function altera_conteudo_modal(assunto,data,remetente,text){
    $('.titulo-aviso').html(assunto);
    $('#data').html('Data: '+data);
    $('#remetente').html('De: '+remetente);
    $('.texto-aviso').html(decodeURI(text));
    $('.texto-aviso').find('a').each(function(){
        $(this).attr('onclick','window.open("'+$(this).attr('href')+'", "_system")');
    });
    pagina_atual = 'mural-modal';
}

function notification(text,classe){
    $('.notification').remove();
    $('body').append($('<div class="notification '+classe+'"><p>'+text+'</p></div>').hide().fadeIn(800));
    $(document).on('click','body',function(){
        $('.notification').fadeOut(800,function(){
            $(this).remove();
        });
    });
    setTimeout(function(){
        $('.notification').fadeOut(800,function(){
            $(this).remove();
        });
    }, 5000);
}

function botao_voltar(){
    if (pagina_atual == 'mural') {
        navigator.app.exitApp();
        return false;
    }
    else if (pagina_atual == 'notas') {
        $('body').load('mural.html',function(){
            carrega_pagina();
        });
    }
    else if (pagina_atual == 'disciplina') {
        $('body').load('notas.html',function(){
            carrega_pagina();
        });
    }
    else if (pagina_atual == 'mural-modal') {
        $('#myModal').removeClass('active');
    }
    return false;
}