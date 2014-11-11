<?php 
header('Access-Control-Allow-Origin: *');

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
$query = "SELECT DISTINCT f.nome,DATE_FORMAT(men.dt_grava,'%d/%m/%Y'),men.assunto,men.texto FROM
fer_mensagens men
INNER JOIN 
(
    SELECT 
         m.aluno aluno ,m.periodo,t.codigo turma, t.curso curso,m.pre_matricula 
    from 
         acad_matricula m 
    INNER join 
         acad_item_matricula im ON im.matricula = m.codigo 
    INNER JOIN 
         acad_turma t ON t.codigo = im.turma 
    WHERE 
         m.aluno = '{$_GET['aluno']}' 
    AND  
         t.tipo='reg'
    AND data_matricula < NOW()
ORDER BY pre_matricula DESC
LIMIT 1
) a ON (
		men.aluno = a.aluno 
	OR (
			men.turma = a.turma 
		AND
			men.aluno IS NULL
		)
	OR (
			men.curso = a.curso 
		AND 
			men.periodo IS NULL
		AND
			men.aluno IS NULL
		) 
	OR (
			men.curso = a.curso 
		AND 
			men.periodo = a.periodo
		AND
			men.turma IS NULL
		AND
			men.aluno IS NULL
		) 
	OR (
			men.aluno IS NULL 
		AND 
			men.turma IS NULL 
		AND 
			men.periodo IS NULL 
		AND 
			men.curso IS NULL
		)
	)
LEFT JOIN 
	acess_usuario u ON u.codigo = men.usuario
LEFT JOIN 
	rh_funcionario f ON f.codigo = u.user_func
WHERE dt_expira >= NOW() 
	";
$result = mysql_query($query)or die(mysql_error()); 
$array=array();
while($row = mysql_fetch_row($result)){
	$array['mural'][]=array('remetente'=>$row[0],'data'=>$row[1],'assunto'=>$row[2],'texto'=>$row[3]);
	
}
 $array['hora']=date('dmYHis');
echo json_encode($array);

?> 
