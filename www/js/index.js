var aluno = localStorage.getItem('aluno');
var unidade = localStorage.getItem('unidade');
var nome = localStorage.getItem('nome');
var senha = localStorage.getItem('senha');
//var login = localStorage.getItem('login');
var data_atualizacao_mural = localStorage.getItem('data_atualizacao_mural');
var data_atualizacao_notas = localStorage.getItem('data_atualizacao_notas');
var pagina_atual = 'login';
var lembrar = null;
var notas;
var mural;
var alunos = '/alunos';
//var unidade = 'caratinga';
var LOGIN = JSON.parse( localStorage.getItem('login') );
//console.log(JSON.parse(.getItem('login')));

//var BASE_URL = "http://192.168.10.240/user/joaovitor/adx";
var BASE_URL = "https://adx.doctum.edu.br/adx/unidades/";
var BASE_URL_HTTP = "http://adx.doctum.edu.br/adx/unidades/";
//var BASE_URL = "35.163.238.248/adx/unidades/";
//console.log(LOGIN)
$(function() { 
	//botão de voltar do android
	document.addEventListener("backbutton", botao_voltar, false);
	$.ajaxSetup({headers: {"Pragma": "no-cache","Cache-Control": "no-cache"}});

	$(document).on('tap', '#atualizar-notas', function() {
		$('#conteudo-notas').hide();
		$('#load').show();
		carrega_notas_adx(true);
	});
	$(document).on('tap', '#atualizar-mural', function() {
		$('#conteudo-mural').hide();
		$('#load').show();
		carrega_mural_adx();
	});
//-----------------------------------------------------------------------------------

	$(document).on('tap', '#atualizar-trabalhos', function() {
		$('#conteudo-trabalhos').hide();
		$('#load').show();
		carrega_trabalhos_adx(true);
	});

	$(document).on('tap', '#atualizar-boletos', function() {
		$('#conteudo-boletos').hide();
		$('#load').show();
		carrega_boletos_adx(true);
	});
//-----------------------------------------------------------------------------------

	//Sair da aplicação
	$(document).on('tap', '#sair', function() {
		sair();
	});
	$(document).on('tap', '#notas, #voltar-notas', function() {
		$('body').load('notas.html', function() {
			carrega_pagina();
		});
	});
	$(document).on('tap', '#agendamento, #voltar-trabalhos', function() {
		$('body').load('trabalhos.html', function() {
			carrega_pagina();
		});
	});
	$(document).on('tap', '#mural', function() {
		$('body').load('mural.html', function() {
			carrega_pagina();
		});
	});
	$(document).on('tap', '#trabalhos', function() {
		$('body').load('trabalhos.html', function() {
			carrega_pagina();
		});
	});
	$(document).on('tap', '#boletos', function() {
		$('body').load('boletos.html', function() {
			carrega_pagina();
		});
	});
	$(document).on('tap', '#parcelas, #voltar-boletos', function() {
		$('body').load('boletos.html', function() {
			carrega_pagina();
		});
	});
	//Entrar na aplicação
	$(document).on('tap', '#entrar', function() {
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
		
		var page = BASE_URL + $("#unidade").val() + '/mobile/aluno/leitura/loginMobile.php';
		//var page = 'http://192.168.10.240/user/joaovitor/adx/mobile/aluno/leitura/loginMobile.php';
		//alert(page)
		//console.log($("#aluno").val());
		//console.log($("#senha").val())
		$.ajax({
			type: 'GET', // defaults to 'GET'
			url: page,
			data: {
				unidade: $("#unidade").val(),
				aluno: $("#aluno").val(),
				senha: $("#senha").val(),
				consulta_externa: 1,
			},
			dataType: 'json', //'json', 'xml', 'html', or 'text'
			async: true,
			success: function(dados) {
				//alert(JSON.stringify(dados))
				if (dados.erro == 1) {
					notification('Dados incorretos!', 'notification-error');
				} else {
					aluno = $("#aluno").val();
					unidade = $("#unidade").val();
					senha = $("#senha").val();
					nome = dados.nome;
					LOGIN = dados.login;
					lembrar = $("#lembrar")[0].checked;
					if (lembrar) {
						localStorage.setItem('aluno', aluno);
						localStorage.setItem('unidade', unidade);
						localStorage.setItem('nome', nome);
						localStorage.setItem('login', JSON.stringify(dados.login));
					}
					pagina_atual = 'mural';
					$('body').load("mural.html");
					carrega_mural_adx();
					carrega_notas_adx();
					carrega_trabalhos_adx();
					carrega_boletos_adx();
					reConectar();
				};
			},
			error: function(erro) {
				//alert(JSON.stringify(erro))
				notification('Sem conexão com a internet!', 'notification-error')
			},
		});
	});

	//Se o aluno existir já entra na aplicação
	if (aluno != null && unidade != null) {
		lembrar = true;
		$('#tela').show();
		pagina_atual = 'mural';
		$('body').load("mural.html");
		carrega_notas_adx();
		carrega_trabalhos_adx();
		carrega_mural_adx();
		carrega_boletos_adx();
	} else {
		pagina_atual = 'login';
		$('body').load("login.html");
		$('#tela').show();
	}

	setInterval(function() {
		$('#atualizado-mural').html(data_atualizacao_mural);}, 1000);
	setInterval(function() {
		$('#atualizado-notas').html(data_atualizacao_notas);}, 1000);
});



function carrega_pagina(disciplina) {
	pagina_atual = $('.content').attr('data-page');
	if (pagina_atual == 'notas') {
		gera_html_notas();
	} else if (pagina_atual == 'disciplina') {
		gerar_html_disciplina(disciplina);
	} else if (pagina_atual == 'mural') {
		gerar_html_mural();
	}
	else if (pagina_atual == 'trabalhos') {
		gerar_html_trabalhos();
	}
	else if (pagina_atual == 'agendamento') {
		gerar_html_agendamento(disciplina);
	}
	else if (pagina_atual == 'boletos') {
		gerar_html_boletos();
	}
	else if (pagina_atual == 'parcelas') {
		gerar_html_parcelas(disciplina);
	}
}

function get_class_nota(nota, valor) {
	if (isNaN(nota)) {
		return false;
	} else if (parseFloat(nota) >= parseFloat(valor) * 0.7) {
		return 'badge-primary';
	} else {
		return 'badge-negative';
	}
}

//---------------------------------------------------------------------------------------------------------------------------------

function carrega_trabalhos_adx(gerar_html) {
	verifica_usuario();
	var page = BASE_URL + unidade + '/mobile/aluno/leitura/trabalhosMobile.php';
	//var page = 'http://192.168.10.240/user/joaovitor/adx/mobile/aluno/leitura/trabalhosMobile.php';
	$.ajax({
		type: 'GET', // defaults to 'GET'
		url: page,
		data: {
			aluno: aluno,
			sid:LOGIN.sid
		},
		dataType: 'json', //'json', 'xml', 'html', or 'text'
		async: false,
		success: function(dados) {
			agenda = remove_espaco_nome_disciplina(dados.agendamentos);
			data_atualizacao_notas = dados.hora;
			if (lembrar) {
				localStorage.setItem('agenda', JSON.stringify(agenda));
				localStorage.setItem('data_atualizacao_notas', dados.hora);
			}
			if (gerar_html) {
				gerar_html_trabalhos();
			}
		},
		error: function() {
			//console.log(55551111)
			notas = JSON.parse(localStorage.getItem('notas'));
			if (gerar_html) {
				notification('Sem conexão com a internet!', 'notification-error')
			}
			if (gerar_html) {
				gerar_html_trabalhos();
			}
		},
	});
}


function gerar_html_trabalhos() {
	cont = 0
	$('#lista-trabalhos').html('');
	$('#nome-usuario').html(aluno.substring(0,2)+'-'+aluno.substring(2,4)+'-'+aluno.substring(4,9)+' - ' + nome);
	$('#lista-trabalhos').append('\
							<p class="atualizado" id="atualizado-notas">\
								'+data_atualizacao_notas+'\
							</p>');
	//ancap
	for (var key in agenda) {
		var entregue = parseFloat(agenda[key].agendamento_entregue).toFixed(1);
		if (agenda[key].situacao_disciplina == '0' || agenda[key].situacao_disciplina == '2' || agenda[key].situacao_disciplina == '8' || agenda[key].situacao_disciplina == '9' || agenda[key].situacao_disciplina == '11' || agenda[key].situacao_disciplina == '12') {
			cont = 1;
			$('#lista-trabalhos').append('\
				<div class="card">\
					<ul class="table-view" codigo=\
						' + agenda[key].codigo_agendamento + '\
						">\
				        <li class="table-view-cell">\
					        <span class="nome-azul">\
						        ' + agenda[key].agendamento_disciplina + ' -' +'\
						        ' + agenda[key].data_entrega + '\
						        ' + ((agenda[key].arquivo_entregue == 0) ? '' : '<span class="icon icon-check"></span>' )+'\
						    </span>\
				        </li>\
				        <li class="table-view-cell">\
					        <span class="nome-azul">\
				         		<a  onclick="$(\'body\').load(\'agendamento.html\',function(){carrega_pagina(\'' + key + '\');})" class="disciplina navigate-right" id_atividade= ' + agenda[key].codigo_agendamento + '>  ' + agenda[key].agendamento_descricao + ' </a>\
				         	</span>\
				        </li>\
			        </ul>\
			    </div>');
		}
	}
	if(cont == 0){
		$('#lista-trabalhos').append('\
			<div class="card">\
				<ul class="table-view">\
					<li class="table-view-cell" style="text-align: justify">\
						Você não possui agendamentos!\
					</li>\
				</ul>\
			</div>');
	}
	$('#load').hide();
	$('#conteudo-trabalhos').show();
}


function gerar_html_agendamento(disciplina) {
	reConectar();
	var arq_prof = '';
	$('#conteudo-agenda').html('');
	$('#conteudo-agenda').append('\
						<ul class="table-view">\
							<li class="table-view-cell titulo">\
								Agendamentos\
								<p class="nome">\
									' + agenda[disciplina].descricao.titulo + '\
								</p>\
							</li>\
						</ul>');
	$('#conteudo-agenda').append('\
					<p class="atualizado atualizado-agendamento" id="atualizado-trabalhos">\
						'+data_atualizacao_notas+'\
					</p>');

	for (var key in agenda[disciplina].descricao) {
		if(key == 'titulo'){
			/*$('#conteudo-agenda').append('\
							<ul class="table-view etapa">\
								<li class="table-view-cell etapa-nome">\
									' + agenda[disciplina].descricao.titulo + '\
								</li>\
							</ul>');*/

							
		$('#conteudo-agenda').append('\
			<div class="card">\
				<ul class="table-view">\
					<li class="table-view-cell">\
						<span class="nome-azul">\
							' + agenda[disciplina].descricao.titulo + '\
						</span>\
						<p>\
							Valor: ' + ((agenda[disciplina].descricao.valor == null) ? '0' : agenda[disciplina].descricao.valor) + ' ponto(s)'  +'\
						</p>\
						<p>\
							CH APS: ' + ((agenda[disciplina].descricao.aps == null) ? '-' : agenda[disciplina].descricao.aps) + ' hora(s)' +'\
						</p>\
						<p>\
							Status: ' + agenda[disciplina].status_entrega + '\
						</p>\
						<p>\
							Publicação: ' + agenda[disciplina].status.data_publicacao + '\
						</p>\
						<p>\
							Encerramento: ' + agenda[disciplina].status.data_encerramento + '\
						</p>\
					</li>\
				</ul>\
			</div>');

		if(agenda[disciplina].arquivo){
			arq_prof = arq_prof + '\
				<div class="card">\
					<ul class="table-view">\
					<li class="table-view-cell">\
						<span class="nome-azul">\
							' + 'Material de Apoio' + '\
						</span>\
						<li id="botoes_down">';
						arq_prof = arq_prof + '\
						</li>\
					</li>\
					</ul>\
				</div>';
				$('#conteudo-agenda').append(arq_prof);
				for(var num in agenda[disciplina].arquivo){
					$("#botoes_down").append(
						$("<li>").attr({
							class:"table-view-cell",
						}).append(
						    agenda[disciplina].arquivo[num].nome, 
						    $("<button>").attr({
								id: num,
								style: "float:right;",
								class: "btn btn-mini btn-danger"
							}).click(function(){
								arqs = $(this).attr('id')
								//console.log( agenda[disciplina].arquivo[arqs] )
								downloadFile(agenda[disciplina].arquivo[arqs]);
							}).text("Download")
						)
					 );
				}
		}



		document.addEventListener("deviceready", onDeviceReady, false);

		 // http://192.168.10.240/user/joaovitor/adx/alunos/modulos/portal/download.php?tipo=doc20140321150017.pdf&nome=doc20140321150017.pdf&arquivo=L3Zhci93d3cvaGQxLzE5MDgzMTc0OTM1MzMwMTY3NzE2NWJmOC42NTAwODc2Nw==
		    function downloadFile(arquivo_down){
		        window.requestFileSystem(
		                     LocalFileSystem.PERSISTENT, 0, 
		                     function onFileSystemSuccess(fileSystem) {
		                     fileSystem.root.getFile(
		                                 "dummy.html", {create: true, exclusive: false}, 
		                                 function gotFileEntry(fileEntry){
		                                 //var sPath = fileEntry.toURL().replace("dummy.html","");
		                                 var sPath = "/storage/emulated/0/Download/";
		                                 //var uri = 'http://192.168.10.240/user/joaovitor/adx/alunos/modulos/portal/download.php?tipo=' + arquivo_down.nome + '&nome=' + arquivo_down.nome + '&arquivo=' + arquivo_down.link;
		                                 var uri = BASE_URL_HTTP + unidade + '/alunos/modulos/portal/download.php?tipo=' + arquivo_down.nome + '&nome=' + arquivo_down.nome + '&arquivo=' + arquivo_down.link + '&consulta_externa=' + true;
		                                 var res = encodeURI(uri);
		                                 var fileTransfer = new FileTransfer();
		                                 fileEntry.remove();
		                                 fileTransfer.download(
		                                           res,
		                                           sPath + arquivo_down.nome,
		                                           function(entry) {
		                                            window.open(entry.toURL(), "_system");
		                                           	showAlertDowload(entry.toURL());
		                                           },
		                                           function(error) {
			                                           alertUploadError("Erro ao fazer o Download!")
			                                           //console.log("download error source " + error.source);
			                                           //console.log("download error target " + error.target);
			                                           //console.log("upload error code: " + error.code);
		                                           }
		                                           );
		                                 }, 
		                                 fail);
		                     }, 
		                     fail);
		 
		    }

		function showAlertDowload(message) {
		    navigator.notification.alert(
		        message,                // message
		        'Download',            // title
		        'Download Completo'                  // buttonName
		    );
		}

		function fail(evt) {
		    console.log(evt.target.error.code);
		}

		function showAlertUpload(message) {
		    navigator.notification.alert(
		        message,                // message
		        'Upload',            // title
		        'Upload Completo'                  // buttonName
		    );
		}
		function alertUploadError(message){
			 navigator.notification.alert(
		        message                // message
		    );
		}
		function onDeviceReady()
		{
		}

		if (agenda[disciplina].entrega_online == "Sim") {

			if( agenda[disciplina].status_entrega == "Em andamento" ){
				$('#conteudo-agenda').append('\
				<div class="card">\
					<ul class="table-view">\
						<li class="table-view-cell">\
							<span class="nome-azul">\
								' + 'Envio de Arquivos' + '\
							</span>\
							<li id="fileuploader" class="fileUpload btn btn-primary">\
							\
							</li>\
							<li class="fileUpload btn btn-primary" style="display:none" id="botao_envia_dados">\
								<div id="enviadados" class="ajax-file-upload">Enviar</div>\
							</li>\
						</li>\
					</ul>\
				</div>');
			}
			$('#conteudo-agenda').append('\
				<div class="card">\
					<ul class="table-view">\
						<li class="table-view-cell">\
							<span class="nome-azul">\
								' + 'Arquivos Enviados' + '\
							</span>\
							<li  id="arquivos_enviados">\
							</li>\
						</li>\
					</ul>\
				</div>');
			arq_enviados(agenda[disciplina], disciplina);
			/*document.getElementById("uploadBtn").onchange = function () {
			    document.getElementById("uploadFile").value = this.value;
			};*/
			//var url = 'http://192.168.10.240/user/joaovitor/adx/mobile/aluno/escrita/entregaAtividadeMobile.php';
			var url = BASE_URL + unidade+'/mobile/aluno/escrita/entregaAtividadeMobile.php';

			var uploadObj = $("#fileuploader").uploadFile({
				url:url,
				method:"POST",
				dragDrop:false,
				multiple:false,
				maxFileCount:10,
				autoSubmit:false,
				statusBarWidth: "100%",
				abortStr: "Enviando...",
				cancelStr: "Cancelar",
				uploadStr: "Anexar Arquivo",
				formData:{agendamento:agenda[disciplina].codigo_agendamento, aluno: LOGIN.aluno, requisicao: "submete_trabalho", consulta_externa:1},
				onSuccess: function(files,data,xhr,pd)
            	{
					carrega_trabalhos_adx();
            	    $('#arquivos_enviados').empty();
            		arq_enviados(agenda[disciplina], disciplina);
            		showAlertUpload('Arquivo enviado com Sucesso!');
            		$(".ajax-file-upload-container").children().remove();
            		$("#botao_envia_dados").hide();		
            	},
            	onError: function(files,status,errMsg,pd)
            	{
            		$(".ajax-file-upload-container").children().remove();
            		$("#botao_envia_dados").hide();	
            		alertUploadError("Erro ao enviar o arquivo!");
            	},
            	onLoad:function(obj){
            		$(".ajax-file-upload-container").css("margin-left", "10px");
            	},
            	onSelect:function(files){
            		$("#botao_envia_dados").show();
            		return true;
            	},
            	onCancel: function(files,pd){
            		if( $(".ajax-file-upload-container").children().length == 0){
            			$("#botao_envia_dados").hide();		
            		}
            		return true;
            	}
			});

			$("#enviadados").click(function(){
				uploadObj.startUpload();

			});
		}

		

		}
	}

	$('#load').hide();
	$('#conteudo-agenda').show();
}


	function arq_enviados(obj_arquivo, disc){
	// a antigo = <a class="linkDownload" href="'+BASE_URL+'/alunos/modulos/portal/download.php?mine='+obj_arquivo.arquivo_entregue[arq].mine+'&nome='+obj_arquivo.arquivo_entregue[arq].nome+'&arquivo='+encodedArquivo+'" id='+obj_arquivo.arquivo_entregue[arq].codigo_arquivo+'>'+obj_arquivo.arquivo_entregue[arq].nome+' <i class="icon-download"></i></a>';
		var arquivos = '';
		var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
		for(var arq in obj_arquivo.arquivo_entregue){
			var arquiv = obj_arquivo.arquivo_entregue[arq].diretorio+"/"+obj_arquivo.arquivo_entregue[arq].chave;
			var encodedArquivo = Base64.encode(arquiv);
				arquivos = arquivos + '\
					<li class="table-view-cell" >\
						<div>'+obj_arquivo.arquivo_entregue[arq].nome+'</div>';
			if (obj_arquivo.status_entrega == "Em andamento"){	

				arquivos = arquivos + '\
						<button id="exclui_ativ_'+obj_arquivo.codigo_agendamento+'" data-cod_entrega ="'+obj_arquivo.arquivo_entregue[arq].codigo_entrega_arquivo+'"  type="button" id_atividade='+obj_arquivo.codigo_agendamento+' class="btn btn-negative"> Excluir  </button>';
			}
			arquivos = arquivos + '\
					</li>';
			}
			if(obj_arquivo.arquivo_entregue == ''){
				arquivos = '<li class="table-view-cell">Nenhum arquivo foi enviado ainda!</li>';
			}
			$('#arquivos_enviados').append(arquivos);

			$("[id^=exclui_ativ_]").click(function(){
				var codigo_arquivo = $(this).data("cod_entrega");
				deleta_arquivos_entregues(codigo_arquivo, disc);
			})
}

function carrega_boletos_adx(gerar_html) {
	verifica_usuario();
	var page = BASE_URL + unidade + '/mobile/aluno/leitura/boletosMobile.php';
	//var page = 'http://192.168.10.240/user/joaovitor/adx/mobile/aluno/leitura/boletosMobile.php';
	$.ajax({
		type: 'GET', // defaults to 'GET'
		url: page,
		data: {
			aluno: aluno,
			sid:LOGIN.sid
		},
		dataType: 'json', //'json', 'xml', 'html', or 'text'
		async: false,
		success: function(dados) {
			boletos = remove_espaco_nome_disciplina(dados.boletos);
			data_atualizacao_notas = dados.hora;
			if (lembrar) {
				localStorage.setItem('boletos', JSON.stringify(boletos));
				localStorage.setItem('data_atualizacao_notas', dados.hora);
			}
			if (gerar_html) {
				gerar_html_boletos();
			}
		},
		error: function() {
			//console.log(55551111)
			notas = JSON.parse(localStorage.getItem('notas'));
			if (gerar_html) {
				notification('Sem conexão com a internet!', 'notification-error')
			}
			if (gerar_html) {
				gerar_html_boletos();
			}
		},
	});
}

function gerar_html_boletos() {
	$('#lista-boletos').html('');
	$('#nome-usuario').html(aluno.substring(0,2)+'-'+aluno.substring(2,4)+'-'+aluno.substring(4,9)+' - ' + nome);
	$('#lista-boletos').append('\
							<p class="atualizado" id="atualizado-boletos">\
								'+data_atualizacao_notas+'\
							</p>');
	//anarchy
	for (var key in boletos) {
		$('#lista-boletos').append('\
			<div class="card">\
					<ul class="table-view" codigo=\
						' + boletos[key].codigo+ '\
						">\
				        <li class="table-view-cell">\
				        	<span class="nome-azul">\
				         		<a  onclick="$(\'body\').load(\'parcelas.html\',function(){carrega_pagina(\'' + key + '\');})" class="disciplina navigate-right" id_atividade= ' + boletos[key].codigo + '>  ' + boletos[key].parcela + 'ªParcela - Vencimento:' + boletos[key].vencimento+' </a></i>\
				         	' +((boletos[key].pagamento == null) ? '' : '<span class="icon icon-check"></span>')+ '\
				         	</span>\
				        </li>\
			        </ul>\
			    </div>');
			
	}
	$('#load').hide();
	$('#conteudo-boletos').show();
}

function gerar_html_parcelas(parcela) {
	reConectar();
	var arq_boleto = '';
	$('#conteudo-parcelas').html('');
	$('#conteudo-parcelas').append('\
						<ul class="table-view">\
							<li class="table-view-cell titulo">\
								Parcelas\
								<p class="nome">\
									' + boletos[parcela].parcela+'ª Parcela\
								</p>\
							</li>\
						</ul>');
	$('#conteudo-parcelas').append('\
					<p class="atualizado atualizado-parcelas" id="atualizado-boletos">\
						'+data_atualizacao_notas+'\
					</p>');
		
	$('#conteudo-parcelas').append('\
		<div class="card">\
			<ul class="table-view">\
				<li class="table-view-cell">\
					<span class="nome-azul">\
						' + boletos[parcela].parcela +'ª Parcela\
					</span>\
					<p>\
						Nosso número: ' + boletos[parcela].numero_boleto +'\
					</p>\
					<p>\
						Emissão: ' + boletos[parcela].emissao +'\
					</p>\
					<p>\
						Vencimento: ' + boletos[parcela].vencimento +'\
					</p>\
					<p>\
						Pago em: ' + ((boletos[parcela].pagamento == null) ? '<font color="red">Em aberto!' : '<font color="green">'+boletos[parcela].pagamento)+ ' \
					</p>\
				</li>\
			</ul>\
		</div>');
if(boletos[parcela].pagamento == null){
		arq_boleto = arq_boleto + '\
			<div class="card">\
				<ul class="table-view">\
				<li class="table-view-cell">\
					<span class="nome-azul">\
						' + 'Download Boleto' + '\
					</span>\
					<li id="botoes_down_boleto">';
					arq_boleto = arq_boleto + '\
					</li>\
				</li>\
				</ul>\
			</div>';
		}

	$('#conteudo-parcelas').append(arq_boleto);
	$("#botoes_down_boleto").append(
		$("<li>").attr({
			class:"table-view-cell",
		}).append(
		    boletos[parcela].parcela+'ª Parcela', 
		    $("<button>").attr({
				id: parcela,
				style: "float:right;",
				class: "btn btn-mini btn-danger"
			}).click(function(){
				arqs_boleto = $(this).attr('id')
				//console.log(boletos[parcela])
				downloadFileBoleto(boletos[parcela]);
			}).text("Download")
		)
	 );

	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady(){}
	function downloadFileBoleto(arquivo_bol){ //console.log('entrou');
	        window.requestFileSystem(
	                     LocalFileSystem.PERSISTENT, 0, 
	                     function onFileSystemSuccess(fileSystem) {
	                     fileSystem.root.getFile(
	                                 "dummy.html", {create: true, exclusive: false}, 
	                                 function gotFileEntry(fileEntry){
	                                 var sPath = "/storage/emulated/0/Download/";
	                                 //var uri = 'http://192.168.10.240/user/joaovitor/adx/tes/boleto_imprime.php?cod_aluno='+aluno+'&b_num_boletos[0]='+arquivo_bol.codigo+'&reprint=sim&boleto_aluno=5';
	                                 //var uri = 'http://192.168.10.240/user/joaovitor/adx/tes/boleto_imprime.php?cod_aluno=110300021&b_num_boletos[0]=000263182&reprint=sim&boleto_aluno=5';
	                                 var uri = BASE_URL_HTTP + unidade + '/tes/boleto_imprime.php?cod_aluno='+aluno+'&b_num_boletos[0]='+arquivo_bol.codigo+'&reprint=sim&boleto_aluno=5';
	                                 var fileTransfer = new FileTransfer();
	                                 fileEntry.remove();
	                                 fileTransfer.download(
	                                           uri,
	                                           sPath + 'doc.pdf',
	                                           function(entry) {
		                                           window.open(entry.toURL(), "_system");
		                                           showAlertDowload(entry.toURL());
	                                           },
	                                           function(error) {
	                                               alertDownError("Erro ao fazer o Download!");
		                                           //console.log(JSON.stringify(error))
		                                           //console.log("download error source " + error.source);
		                                           //console.log("download error target " + error.target);
		                                           //console.log("upload error code: " + error.code);
	                                           }
	                                           );
	                                 }, 
	                                 fail);
	                     }, 
	                     fail);
	 
	    }

		function showAlertDowload(message) {
		    navigator.notification.alert(
		        message,                // message
		        'Download',            // title
		        'Download Completo'                  // buttonName
		    );
		}

		function fail(evt) {
		    console.log(evt.target.error.code);
		}
		function alertDownError(message){
			navigator.notification.alert(
		        message                // message
		    );
		}
		



	$('#conteudo-parcelas').append('\
		<div class="card">\
			<ul class="table-view">\
				<li class="table-view-cell">\
					<b>Obs.: O processamento dos boletos ocorrerá em até 72 horas úteis após o pagamento.</b>\
				</li>\
			</ul>\
		</div>\
	');

	$('#load').hide();
	$('#conteudo-parcelas').show();
}
//---------------------------------------------------------------------------------------------------------------------------------

function carrega_notas_adx(gerar_html) {
	verifica_usuario();

	var page = BASE_URL + unidade + '/mobile/aluno/leitura/notasMobile.php';
	//var page = BASE_URL + '/mobile/aluno/leitura/notasMobile.php';
	$.ajax({
		type: 'GET', // defaults to 'GET'
		url: page,
		data: {
			aluno: aluno,
			unidade: unidade,
			sid:LOGIN.sid
		},
		dataType: 'json', //'json', 'xml', 'html', or 'text'
		async: true,
		success: function(dados) {
			notas = remove_espaco_nome_disciplina(dados.disciplinas);
			data_atualizacao_notas = dados.hora;
			if (lembrar) {
				localStorage.setItem('notas', JSON.stringify(notas));
				localStorage.setItem('data_atualizacao_notas', dados.hora);
			}
			if (gerar_html) {
				gera_html_notas();
			}
		},
		error: function(erro) {
			notas = JSON.parse(localStorage.getItem('notas'));
			if (gerar_html) {
				notification('Sem conexão com a internet!', 'notification-error')
			}
			if (gerar_html) {
				gera_html_notas();
			}
		},
	});
}


function gera_html_notas() {
	$('#lista-notas').html('');
	$('#nome-usuario').html(aluno.substring(0,2)+'-'+aluno.substring(2,4)+'-'+aluno.substring(4,9)+' - ' + nome);
	$('#lista-notas').append('\
							<p class="atualizado" id="atualizado-notas">\
								'+data_atualizacao_notas+'\
							</p>');
	for (var key in notas) {
		var nota = parseFloat(notas[key].nota).toFixed(1);
		$('#lista-notas').append('\
								<div class="card">\
									<ul class="table-view">\
										<li class="table-view-cell">\
											<a onclick="$(\'body\').load(\'disciplina.html\',function(){carrega_pagina(\'' + key + '\');})" class="disciplina navigate-right">\
												<span class="badge ' + get_class_nota(nota, 100) + '">\
													' + ((isNaN(nota)) ? "-" : nota) + '\
												</span>\
												<span class="nome-azul">\
													' + notas[key].nome + '\
												</span>\
											</a>\
										</li>\
									</ul>\
								</div>');
	}
	$('#load').hide();
	$('#conteudo-notas').show();
}

function gerar_html_disciplina(disciplina) {
	var agendamentos = '';
	$('#conteudo').html('');
	$('#conteudo').append('\
						<ul class="table-view">\
							<li class="table-view-cell titulo">\
								<span class="badge badge-inverted nome">\
									Nota\
								</span>Agendamentos\
								<p class="nome">\
									' + disciplina + '\
								</p>\
							</li>\
						</ul>');
	$('#conteudo').append('\
					<p class="atualizado atualizado-disciplina" id="atualizado-notas">\
						'+data_atualizacao_notas+'\
					</p>');
	for (var key in notas[disciplina].etapas) {
		if ("" == key) {
			var mensagem = '\
					<div class="card">\
						<ul class="table-view">\
							<li class="table-view-cell" style="text-align: justify">\
								Ainda não existe agendamentos para essa disciplina!\
							</li>\
						</ul>\
					</div>';
			$('#conteudo').append(mensagem);
		} else {
			agendamentos = '';
			var etapa_nota = parseFloat(notas[disciplina].etapas[key].nota).toFixed(1);
			$('#conteudo').append('\
						<ul class="table-view etapa">\
							<li class="table-view-cell etapa-nome">\
								<span class="badge ' + get_class_nota(etapa_nota, notas[disciplina].etapas[key].pontos) + '">\
									' + ((isNaN(etapa_nota)) ? "-" : etapa_nota) + '\
								</span>' + key + '\
							</li>\
						</ul>');
			agendamentos = agendamentos + '\
									<div class="card">\
										<ul class="table-view">';
			for (var key2 in notas[disciplina].etapas[key].agenda) {
				var nota = parseFloat(notas[disciplina].etapas[key].agenda[key2].nota).toFixed(1);
				var valor = notas[disciplina].etapas[key].agenda[key2].valor;
				var horas = notas[disciplina].etapas[key].agenda[key2].horas;
				agendamentos = agendamentos + '\
										<li class="table-view-cell">\
											<span class="badge ' + get_class_nota(nota, notas[disciplina].etapas[key].agenda[key2].valor) + '">\
												' + ((isNaN(nota)) ? "-" : nota) + '\
											</span>\
											<span class="nome-azul">\
												' + notas[disciplina].etapas[key].agenda[key2].nome + '\
											</span>\
											<p>\
												Data: ' + notas[disciplina].etapas[key].agenda[key2].data + '\
											</p>\
											<p>\
												Valor: ' + ((valor == null) ? '-' : valor) + '\
											</p>\
											' + ((horas == 0) ? '' : '\
																	<p>\
																		Horas: ' + horas + '\
																	</p>') + '\
										</li>';
			}
			agendamentos = agendamentos + '\
										</ul>\
									</div>';
			$('#conteudo').append(agendamentos);
		}
	}
	$('#load').hide();
	$('#conteudo').show();
}

function gerar_html_mural() {
	$('#lista-mural').html('');
	$('#modais').html('');
	$('#nome-usuario').html(aluno.substring(0,2)+'-'+aluno.substring(2,4)+'-'+aluno.substring(4,9)+' - ' + nome);
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
											<a onclick="altera_conteudo_modal(\'' + mural[key].assunto + '\',\'' + mural[key].data + '\',\'' + valida_remetente(mural[key].remetente) + '\',\'<pre>' + encodeURI(mural[key].texto) + '</pre>\')" href="#myModal">\
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
							<a id="fechar-modal" onclick="pagina_atual = \'mural\'" class="icon icon-left-nav pull-left" href="#myModal">\
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

function carrega_mural_adx() {
	verifica_usuario();
	//console.log(unidade)
	var page = BASE_URL + unidade + '/mobile/aluno/leitura/muralMobile.php';
	//var page = 'http://192.168.10.240/user/joaovitor/adx/mobile/aluno/leitura/muralMobile.php';
	$.ajax({
		type: 'GET', // defaults to 'GET'
		url: page,
		data: {
			aluno: aluno,
			unidade: unidade,
			sid:LOGIN.sid
		},
		dataType: 'json', //'json', 'xml', 'html', or 'text'
		async: true,
		success: function(dados) {
			mural = JSON.parse(JSON.stringify(dados).replace('\\n', '<br />')).mural;
			if (mural == undefined) {
				mural = '';
			}
			data_atualizacao_mural = dados.hora;
			if (lembrar) {
				var d = new Date();
				localStorage.setItem('mural', JSON.stringify(mural).replace('\\n', '<br />'));
				localStorage.setItem('data_atualizacao_mural', dados.hora);
			}

			gerar_html_mural();
		},
		error: function() {
			mural = JSON.parse(localStorage.getItem('mural'));
			notification('Sem conexão com a internet!', 'notification-error')
			gerar_html_mural();
		},
	});
}

function remove_espaco_nome_disciplina(dados) {
	var key_sem_espaco;
	for (var key in dados) {
		key_sem_espaco = key.trim();
		if (key_sem_espaco != key) {
			dados[key_sem_espaco] = dados[key];
			delete dados[key];
		}
	}
	return dados;
}

function remove_tag_string(html) {
	var div = document.createElement("div");
	div.innerHTML = html;
	var text = div.textContent || div.innerText || "";
	return text;
}

function valida_remetente(text) {
	if (text == null) {
		return 'Não informado'
	} else {
		return text;
	}
}

function sair() {
	localStorage.clear();
	notas = null;
	lembrar = null;
	aluno = null;
	unidade = null;
	nome = null;
	mural = null;
	data_atualizacao_mural = null;
	data_atualizacao_notas = null;
	pagina_atual = 'login';
	$('body').load('login.html');
	return false;
}

function verifica_usuario() {
	if (aluno == null || unidade == null) {
		alert('Algo aconteceu e você não está mais logado!');
		sair();
	}
}

function altera_conteudo_modal(assunto, data, remetente, text) {
	$('.titulo-aviso').html(assunto);
	$('#data').html('Data: ' + data);
	$('#remetente').html('De: ' + remetente);
	$('.texto-aviso').html(decodeURI(text));
	$('.texto-aviso').find('a').each(function() {
		$(this).attr('onclick', 'window.open("' + $(this).attr('href') + '", "_system")');
	});
	pagina_atual = 'mural-modal';
}

function notification(text, classe) {
	$('.notification').remove();
	$('body').append($('<div class="notification ' + classe + '"><p>' + text + '</p></div>').hide().fadeIn(800));
	$(document).on('tap', 'body', function() {
		$('.notification').fadeOut(800, function() {
			$(this).remove();
		});
	});
	setTimeout(function() {
		$('.notification').fadeOut(800, function() {
			$(this).remove();
		});
	}, 5000);
}

function botao_voltar() {
	if (pagina_atual == 'mural') {
		navigator.app.exitApp();
		return false;
	} else if (pagina_atual == 'notas') {
		$('body').load('mural.html', function() {
			carrega_pagina();
		});
	} else if (pagina_atual == 'disciplina') {
		$('body').load('notas.html', function() {
			carrega_pagina();
		});
	} else if (pagina_atual == 'mural-modal') {
		$('#myModal').removeClass('active');
	} else if (pagina_atual == 'agendamento') {
		$('body').load('trabalhos.html', function() {
			carrega_pagina();
		});
	}
	else if (pagina_atual == 'parcelas') {
		$('body').load('boletos.html', function() {
			carrega_pagina();
		});
	}
	return false;
}

function reConectar(){  
	//var page = "http://192.168.10.240/user/joaovitor/adx/mobile/aluno/leitura/testeConexao.php";
	var page = BASE_URL + unidade + '/mobile/aluno/leitura/testeConexao.php';

	$.ajax({
			url: page,
			data: { 
				codUsuario: LOGIN.aluno,
				id: LOGIN.id,
				sid:LOGIN.sid,
				consulta_externa: 1,
			}, 
			dataType: "json",
			method: "post",
		}).done(function(data){
			LOGIN.sid = data["sid"];
			//console.log(JSON.stringify(LOGIN));
			localStorage.setItem("login", JSON.stringify(LOGIN));
			console.log("RE-conectado");
		}).fail(function(a,b,c){
			//console.log(a);
			//console.log(b);
			//console.log(c);
		});

}

function showAlertExcluir(message) {
    navigator.notification.alert(
        message,              // message
        'Excluir',            // title
        'Excluir'             // buttonName
    );
}

var deleta_arquivos_entregues = function(atividade, disc){
	//var page = BASE_URL+"/mobile/aluno/escrita/entregaAtividadeMobile.php";
	var page = BASE_URL + unidade +"/mobile/aluno/escrita/entregaAtividadeMobile.php";

    data = { 'trabalhos_entregues': atividade, 'requisicao':'delete_arquivos_entregues', consulta_externa:1};
    $.ajax({
        url: page, 
        dataType: 'html', 
        type: 'POST',   
        async: false, 
        data: data,
        beforeSend : function( a ){
            a.overrideMimeType("text/plain;charset=\"iso-8859-1\"");
        },
        error: function(error) {
        	alert("Recarregue a página novamente");
            console.log(error);
        },
        success: function(ajaxResposta){
        	carrega_trabalhos_adx();
            $('#arquivos_enviados').empty();
            arq_enviados(agenda[disc], disc);
            showAlertExcluir(ajaxResposta)
        },
    });
}