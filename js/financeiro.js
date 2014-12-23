$(function(){
    $(document).on('click','.card-accordion', function () {
        if($(this).children().children().children('.accordion').css('display') == 'block'){
            $('.accordion').hide();
            $(this).children('.center').children().removeClass('icon-angle-up').addClass('icon-angle-down');
            return false;
        }
        $('.accordion').hide();
        $(this).children().children().children('.accordion').show();
        $('.card-accordion').children('.center').children().removeClass('icon-angle-up').addClass('icon-angle-down');
        $(this).children('.center').children().removeClass('icon-angle-down').addClass('icon-angle-up');
    });
    $(document).on('click','.linha', function(){
        cordova.plugins.clipboard.copy($(this).val());
        notification('Linha digitável copiada!', 'notification-success');
        return false;
    })
    $(document).on('click','.download', function(){
        window.open($(this).attr('href'), "_system");
        return false;
    })
    $(document).on('click', '#atualizar-boletos', function() {
        $('#conteudo-boletos').hide();
        $('#load').show();
        carrega_financeiro_adx(true);
    });
});

function carrega_financeiro_adx(gerar_html) {
    verifica_usuario();
    $.ajax({
        type: 'GET', // defaults to 'GET'
        url: BASE_URL + 'boletosMobile.php',
        dataType: 'json', //'json', 'xml', 'html', or 'text'
        async: true,
        success: function(dados) {
            boletos = dados.boletos;
            data_atualizacao_boletos = dados.hora;
            if (lembrar) {
                localStorage.setItem('boletos', JSON.stringify(boletos));
                localStorage.setItem('data_atualizacao_boletos', data_atualizacao_boletos);
            }
            if (gerar_html) {
                gera_html_boletos();
            }
        },
        error: function(x, t, m) {
            boletos = JSON.parse(localStorage.getItem('boletos'));
            if (gerar_html) {
                if(t==="timeout"){
                    notification('Erro, tente novamente!', 'notification-error');
                }
                else {
                    notification('Sem conexão com a internet!', 'notification-error');
                    gera_html_boletos();
                }
            }
        }
    });
}


function gera_html_boletos() {
    $('#nome-usuario').html(aluno + ' - ' + nome);
    $('#lista-boletos').html('');
    if(boletos == undefined){
        $('#lista-boletos').append('\
                            <div class="card">\
                                <ul class="table-view">\
                                    <li class="table-view-cell" style="text-align: justify">\
                                        Não há informações a serem mostradas!\
                                    </li>\
                                </ul>\
                            </div>');
    }
    else {
        $('#lista-boletos').append('\
                            <p class="atualizado" id="atualizado-boletos">\
                                ' + data_atualizacao_boletos + '\
                            </p>');
        for (var key in boletos) {
            $('#lista-boletos').append('\
                                <div class="card card-accordion">\
                                    <ul class="table-view">\
                                        <li class="table-view-cell">\
                                            <a>\
                                                <span class="badge ' + get_class_boleto(boletos[key]) + '">\
                                                    ' + boletos[key].parcela + '\
                                                </span>\
                                                <span class="nome-azul">\
                                                    Vencimento: ' + boletos[key].vencimento + '\
                                                </span>\
                                                <p>\
                                                    Pagamento: ' + boletos[key].pagamento + '\
                                                </p>\
                                                <div class="accordion">\
                                                    <p>\
                                                        Valor: R$ ' + boletos[key].valor + '\
                                                    </p>\
                                                    <p>\
                                                        Linha Digitável: clique na caixa para copiar\
                                                    </p>\
                                                    <textarea readonly rows="3" class="linha justificar">' + boletos[key].linha + '</textarea>\
                                                    <p>\
                                                        <a target="_system" href="' + boletos[key].link + '" class="download btn btn-primary">\
                                                            <span class="icon icon-download"></span>\
                                                            Baixar boleto\
                                                        </a>\
                                                    </p>\
                                                </div>\
                                            </a>\
                                        </li>\
                                    </ul>\
                                    <p class="center"><i class="icon icon-angle-down"></i></p>\
                                </div>');
        }
    }
    $('#load').hide();
    $('#conteudo-boletos').show();
}

function get_class_boleto(boleto) {
    if((boleto.pagamento == '' || boleto.pagamento == null || boleto.pagamento == undefined) && boleto.vencido == 'sim'){
        return 'badge-negative';
    }
    else if((boleto.pagamento == '' || boleto.pagamento == null || boleto.pagamento == undefined) && boleto.vencido == 'nao'){
        return 'badge-primary';
    }
    else{
        return 'badge-positive';
    }
}