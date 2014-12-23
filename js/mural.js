$(function () {
    $(document).on('click', '#atualizar-mural', function() {
        $('#conteudo-mural').hide();
        $('#load').show();
        carrega_mural_adx();
    });
    $(document).on('click','#fechar-modal',function(){
        pagina_atual = 'mural';
    });
    $(document).on('click','.alterar-modal',function(event){
        var assunto = $(this).attr('data-assunto');
        var data = $(this).attr('data-data');
        var remetente = $(this).attr('data-remetente');
        var text = $(this).attr('data-texto');
        $('.titulo-aviso').html(assunto);
        $('#data').html('Data: ' + data);
        $('#remetente').html('De: ' + remetente);
        $('.texto-aviso').html(decodeURI(text));
        $('.texto-aviso').find('a').each(function() {
            $(this).attr('onclick', 'window.open("' + $(this).attr('href') + '", "_system")');
            $(this).removeAttr('href');
        });
        pagina_atual = 'mural-modal';
    });
});

function carrega_mural_adx() {
    verifica_usuario();
    $.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL + 'muralMobile.php',
        data: {
            aluno: aluno,
            unidade: unidade
        },
        timeout: 5000,
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(dados) {
            mural = JSON.parse(JSON.stringify(dados).replace('\\n', '<br />')).mural;
            if(mural == undefined){
                mural = false;
            }
            data_atualizacao_mural = dados.hora;
            if (lembrar) {
                var d = new Date();
                localStorage.setItem('mural', JSON.stringify(mural).replace('\\n', '<br />'));
                localStorage.setItem('data_atualizacao_mural', dados.hora);
            }

            gerar_html_mural();
        },
        error: function(x, t, m) {
            if(t==="timeout"){
                notification('Erro, tente novamente!', 'notification-error');
            }else {
                notification('Sem conexão com a internet!', 'notification-error');
            }
            mural = JSON.parse(localStorage.getItem('mural'));
            gerar_html_mural();
        }
    });
}

function gerar_html_mural() {
    $('#lista-mural').html('');
    $('#modais').html('');
    $('#nome-usuario').html(aluno + ' - ' + nome);
    $('#lista-mural').append('\
                        <p class="atualizado" id="atualizado-mural">\
                            '+data_atualizacao_mural+'\
                        </p>');
    if (mural == "") {
        $('#lista-mural').append('\
                            <div class="card">\
                                <ul class="table-view">\
                                    <li class="table-view-cell" style="text-align: justify">\
                                        Você não possui avisos!\
                                    </li>\
                                </ul>\
                            </div>');
    } else {
        for (var key in mural) {
            $('#lista-mural').append('\
                                <div class="card">\
                                    <ul class="table-view">\
                                        <li class="table-view-cell media">\
                                            <a class="alterar-modal" data-assunto="' + mural[key].assunto + '" data-data="' + mural[key].data + '" data-remetente="' + valida_remetente(mural[key].remetente) + '" data-texto="\'<pre>' + encodeURI(mural[key].texto) + '</pre>\'" href="#myModal">\
                                                <div class="media-body">\
                                                    <span class="nome-azul">\
                                                        ' + mural[key].assunto + '\
                                                    </span>\
                                                    <p>\
                                                        Toque para visualizar\
                                                    </p>\
                                                </div>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                </div>');
        }
        $('body').append('\
                    <div id="myModal" class="modal">\
                        <header class="bar bar-nav">\
                            <a id="fechar-modal" class="icon icon-left-open pull-left" href="#myModal">\
                            </a>\
                            <h1 class="title titulo-modal">\
                                AVISOS\
                            </h1>\
                        </header>\
                        <div class="modal-content content">\
                            <ul class="table-view">\
                                <li class="table-view-cell titulo titulo-aviso">\
                                </li>\
                            </ul>\
                            <div class="card">\
                                <span id="data">\
                                </span>\
                                <br />\
                                <span id="remetente">\
                                </span>\
                            </div>\
                            <div class="card content-padded">\
                                <p class="texto-aviso">\
                                </p>\
                            </div>\
                        </div>\
                    </div>');
    }
    $('#load').hide();
    $('#conteudo-mural').show();
}

function valida_remetente(text) {
    if (text == null) {
        return 'Não informado'
    } else {
        return text;
    }
}
