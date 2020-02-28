<?php

// 최초작성 김민성 2020-02-05

// 리뉴얼된 메인페이지에서 동작하는 php 스크립트

// 상세 기능 :


header("Content-Type: application/json; charset=UTF-8"); // 이 코드 추가하면, 브라우저에서 json 형태로 볼 수 있음
include_once('/nginx/stickode/backend/header/include.php');

$req_page = $_POST['reqPage'];
$req_type = $_POST['reqType'];
$req_body = $_POST['reqBody'];

//$language_no=$req_body['Language_no'];

// 로그인한 유저의 jwt 토큰
$login_user_token = $_POST['reqBody']['Token'];

switch($req_type) {

    // 메인 페이지 첫 세팅
    case "category" : // 메인 페이지 첫 셋팅
        init_contents_by_language($req_body);
        break;

    case "modal" : // 모달창 띄웠을 때 셋팅
        init_modal($req_body);
        break;
}



// language_no별로 code에 관련된 클라이언트단에 필요한 모든 데이터를 가져와 클라이언트로 보내주는 함수
function init_contents_by_language($req_body){
    $language_no=$req_body['Language_no'];

//    해당 언어중 인기있는 언어 1~9위 까지 code_no를 배열 형태로 가져옴
    $hot_code_no = get_hot_code_no_by_language($language_no);



    // 결과를 담는 배열
    // totCnt : 코드 수, Hot_code : 각 코드의 정보들이 담기는 배열
    $result = array();
    //

    // 언어별로 인기있는 code_no 배열을 순회하면서 클라이언트에 보내줄 데이터를 담음

    // 필요한 데이터 : 썸네일, 작성자이름, 코드 타이틀, 코드넘버
    $hot_code = array();
    foreach ($hot_code_no as $code_no){

        $dbHandler = new DBHandler();
        $dbHandler->setTable("code"); // 테이블 이름
        $columns = "no, title, user_no, img"; // 가져올 컬럼 : 코드 구성요소 번호, 타이틀, 코드 번호

        $where = "no=".$code_no;

        $dbHandler->setColumns($columns);
        $result = $dbHandler->gets($where,"no asc", "");
        if(!$result) {

            $retJson = setError('-1'," code data get faitl");   //에러코드 리턴
            $dbHandler->TransactionRollback();      //롤백
            $dbHandler->Close();
            echo json_encode($retJson); // main.html 으로 데이터 보내주기
            break;

        } else {
            array_push($hot_code,$result);

        }
    }
    $result['totCnt'] = count($hot_code_no);
    $result['Hot_code'] = $hot_code;
    $retJson = array("retCode"=>'0', "errMsg"=>'', "retBody"=>$result);
    echo json_encode($retJson);



}

// 언어별로 인기있는 code_no를 가져오는 함수
function get_hot_code_no_by_language($language_no){

    $mongo_connection = new MongoDB\Driver\Manager("mongodb://user:user12!!@localhost:27017");
    $mongo_bulk = new MongoDB\Driver\BulkWrite;

    // 전체 언어에서 가장 많이 사용하는 언어
    // $filter =['logType' => "click_contents"];
    // 언어별 넘버에 따라서 나오는 값이 다름
    $filter =['language_no' => $language_no];

    $query=new MongoDB\Driver\Query($filter);
    $rows =$mongo_connection->executeQuery("stickode.User",$query);

    $return_array=array();

    foreach($rows as $row ){
        array_push($return_array,
            array(
                'date' =>$row ->date,
                'code_no'=>$row ->logBody ->code_no
            )
        );
    }

    $return_code_no =array();

    for($i=0; $i<count($return_array); $i++){

        array_push($return_code_no,
            $return_array[$i]['code_no']
        );

    }

    $rank_code_no=array_count_values($return_code_no);

    $return_rank_code_no=array();

    $return_rank_code_no=array_keys($rank_code_no);


    $code_rank_9=array();

    for($i=0; $i<9; $i++){
      
      
        if(isset($return_rank_code_no[$i])){
            array_push($code_rank_9,
            $return_rank_code_no[$i]
        );
        }
        else
        {
                break;
        }



    }


    $array_filter=array_filter($code_rank_9);

    return $array_filter;

    

}


// 민성) 모달창을 띄웠을 때 코드 컴포넌트 소스를 보내주는 함수
function init_modal($req_body){
    $code_no = $req_body['Code_no'];

//    $code_detail_arr = array();
//    $code_detail_arr["login_user_id"] = $user_id;

    // 1. DB연결
    $dbHandler = new DBHandler();


    // 2-2. 코드 구성요소 정보
    $dbHandler->setTable("code_component"); // 테이블 이름
    $columns = "no, title, source, web_xml, language"; // 가져올 컬럼 // TODO 태깅화 끝나고 web_source -> source, 원용씨 확인 후 web_xml-> xml
    $where = "code_no=".$code_no; // where 조건 : 메인화면에서 넘어온 code_no
    $dbHandler->setColumns($columns);
    $result_for_code_component = $dbHandler->gets($where,"no asc", "");



    foreach ($result_for_code_component["list"] as $key => $value) {


        $unit = explode('_', $result_for_code_component["list"][$key]['web_xml']);


        if($unit[1] == "1.xml"){ // TODO 콘테츠 제작 완성후에는 total1.xml로 변경 해야됨. 기존 데이터는 total.xnl -> tatol1.xml 변경해야됨
            $default_code_component_no = $result_for_code_component["list"][$key]['no'];
        }


        $resultXML = get_source_without_tag($result_for_code_component["list"][$key]['source']);
        $result_for_code_component["list"][$key]['source'] = (string) $resultXML;





    }
    // 4. DB 연결 종료
    $dbHandler->Close();


    $code_detail_arr["code_component"] = $result_for_code_component;
    $retJson = array('retCode'=>'0', 'errMsg'=>'', 'retBody'=>$code_detail_arr);



    echo json_encode($retJson);








    //



}

?>