<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Pragma, Cache-Control');
$db = mysql_connect('192.168.10.238','root','xad11doc') or die("Database error"); 

$unidades["1"] = "crgola";
$unidades["2"] = "ctga";
$unidades["3"] = "cat";
$unidades["4"] = "gpi";
$unidades["5"] = "iuna";
$unidades["6"] = "ipa";
$unidades["7"] = "jm";
$unidades["8"] = "jf";
$unidades["9"] = "leo";
$unidades["10"] = "mhu";
$unidades["11"] = "serra";
$unidades["12"] = "to";
$unidades["13"] = "vila";
$unidades["14"] = "vitoria";

mysql_select_db('harrison_ctga', $db);

$result = mysql_query("set names 'utf8'"); 
$query = "SELECT DISTINCT dis.nome, dis.abreviatura, a.descricao, DATE_FORMAT( a.data_entrega,  '%d/%m/%Y' ) , a.hora_entrega, a.valor, a.horas_aps, n.nota,e.descricao,e.pontos,a.codigo
	FROM 
		acad_matricula m
		INNER JOIN acad_item_matricula im ON im.matricula = m.codigo
		INNER JOIN ped_docencia d ON d.disciplina = im.disciplina AND d.turma = im.turma
		INNER JOIN ped_disciplina dis ON dis.codigo = d.disciplina
		LEFT JOIN acad_agendamento a ON a.docencia = d.codigo
		LEFT JOIN acad_notas n ON a.codigo = n.avaliacao AND n.matricula = m.codigo
		LEFT JOIN acad_etapa e ON a.etapa=e.codigo
	WHERE m.aluno ='{$_GET['aluno']}'
	AND m.semestre_letivo =33
	ORDER BY dis.nome,e.data_inicio DESC, a.data_entrega DESC 
	";
$result = mysql_query($query)or die(mysql_error()); 
$array=array();
while($row = mysql_fetch_row($result)){
	$array['notas'][$row[0]]['nome']=$row[0];
	$array['notas'][$row[0]]['abrev']=str_replace(array(' ','.',')','('),array('-','','-'),$row[1]);
	$array['notas'][$row[0]]['etapas'][$row[8]]['pontos']=$row[9];
	$array['notas'][$row[0]]['etapas'][$row[8]]['agenda'][$row[10]]['nome']=$row[2];
	$array['notas'][$row[0]]['etapas'][$row[8]]['agenda'][$row[10]]['data']=trim($row[3].' '.$row[4]);
	$array['notas'][$row[0]]['etapas'][$row[8]]['agenda'][$row[10]]['valor']=$row[5];
	$array['notas'][$row[0]]['etapas'][$row[8]]['agenda'][$row[10]]['horas']=$row[6];
	$array['notas'][$row[0]]['etapas'][$row[8]]['agenda'][$row[10]]['nota']=$row[7];
	 
	if(isset($array['notas'][$row[0]]['etapas'][$row[8]]['nota'])){
               $array['notas'][$row[0]]['etapas'][$row[8]]['nota']+=$row[7];
        }else{
               $array['notas'][$row[0]]['etapas'][$row[8]]['nota']=$row[7];
        }

	if(isset($array['notas'][$row[0]]['nota'])){
		$array['notas'][$row[0]]['nota']+=$row[7];
	}else{
		$array['notas'][$row[0]]['nota']=$row[7];
	}
//	$array2[]=$row;	 
}
$array['hora']=date('dmYHis');
echo json_encode($array);

?> 
