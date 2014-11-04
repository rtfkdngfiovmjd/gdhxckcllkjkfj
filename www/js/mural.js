var BASE_URL = 'http://192.168.10.108/';
var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
//Carrega notas quando abrir app pela primeira vez
$(function(){
	carrega_notas_adx();
	$(document).on('click','#atualizar-notas',function(){
		$('#lista-notas').hide();
		$('#load').show();
		carrega_notas_adx(true);
	});
});

function carrega_pagina(){
	if($('.content').attr('data-page') == 'notas'){
		gera_html_notas();
	}
	else if($('.content').attr('data-page') == 'disciplina'){
		gerar_html_disciplina(window.location.href.split("#")[1]);
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
        	localStorage.setItem('ret',JSON.stringify(ret));
        	if(gerar_html){
        		gera_html_notas();
        	}
        },
    });
}

function gera_html_notas(){
	var ret = jQuery.parseJSON(localStorage.getItem('ret'));
	$('.table-view').html('');
	for(var key in ret){
        $('.table-view').append('<li class="table-view-cell"><a data-transition="slide-in" href="disciplina.html#'+key+'" class="disciplina navigate-right"><span class="badge '+get_class_nota(ret[key].nota)+'">'+ret[key].nota+'</span>'+ret[key].nome+'</a></li>');
	}
	$('#load').hide();
    $('#lista-notas').show();
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
			agendamentos = agendamentos + '<li class="table-view-cell">'+ret[disciplina].etapas[key].agenda[key2].nome+'</li>';
		}
		agendamentos = agendamentos + '</ul></div>';
		$('#conteudo').append(agendamentos);
	}
	
	$('#load').hide();
    $('#conteudo').show();
}

window.addEventListener('push', carrega_pagina);