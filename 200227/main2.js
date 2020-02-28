
// 최초작성 김민성 2020-02-05
//
// 리뉴얼된 메인페이지에서 동작하는 js
//
// 함수 리스트 :
//
// init_main() 페이지가 로드됐을 때 실행되는 함수.
// 로그인, 비로그인시에 따라 다른 로직으로 실행됨
// 비로그인시에 각 언어 카테고리 별로 다른 데이터를 가져와야함
// ex) 전체 코드, 자바, 안드로이드, 등등..
//
// time_on_page() 사용자가 페이지에 머무르는 시간을 체크하기 위한 함수
//
// TODO : 모달창 띄우는 함수, 모달창 내에서 동작하는 함수들, 즐겨찾기 버튼 눌렀을 때 동작하는 함수 작성 해야함
// 실서버에 적용할 때 파일 이름 뒤에 숫자 제거 해야함,
// 현재 클라단에서 예전에 추가한 콘텐츠가 저장되어있는 방식대로 코드가 짜져 있는데
// 이 부분을 현재 콘텐츠를 추가하는 방식에 맞게 수정하고 이 코드를 php단으로 옮겨야함




// 민성) 사용자가 보기 좋게 화면 확대 비율을 맞춰줌
// html,css 작업을 할때 애초에 사용자가 보기 좋은 비율로 맞춰놓고 작업했으면 아래 코드는 필요없는데..!!
document.body.style.zoom = "80%";

// 민성) 9개의 컨텐츠 코드들의 primary key를 저장하는 배열
// 나중에 primary key들을 클라이언트단으로 노출시키지 않는 법을 고민 해봐야함

var keys=new Array();


// 민성) 모달창을 띄웠을 때 서버로부터 해당 콘텐츠의 소스를 전부 가져와서 아래와 같은 변수에 저장한다

var modal_source = new Array();
var titles = new Array();
var sources = new Array();

//각 로고 클릭시 로고에 알맞은 페이지로 이동시켜주는 코드







$(document).ready(function () {
    // init_main();
    // test();
    init_contents_by_language(1);
    dropdown_search();


})


// 민성) 페이지가 로드됐을 때 실행되는 함수
function init_main(){

    var ajax_url = "/backend/php/common/main3.php";
    var ajax_type = "POST";

    var req_json = Object();
    var now_page = get_now_page();
    req_json.reqPage = now_page;
    req_json.reqType = "init";

    var token = localStorage.getItem("cpToken");
    req_json.reqBody = {"Token" : token};

    console.log(JSON.stringify(nv_ajax(ajax_url, ajax_type, req_json)) + " init_main()의 결과입니다");

}

// 민성) 언어 카테고리 버튼을 클릭했을 때 동작하는 함수
// 매개변수에 언어를 string 타입으로 넘겨주면 해당 언어의 콘텐츠를 불러오도록 서버에 요청함
function init_contents_by_language(language_no){
    console.log("init_contents_by_language(language_no) is called!");

    var ajax_url = "/backend/php/common/main3.php";
    var ajax_type = "POST";

    var req_json = Object();
    var now_page = get_now_page();
    req_json.reqPage = now_page;
    req_json.reqType = "category";

    var token = localStorage.getItem("cpToken");
    req_json.reqBody = {"Language_no":language_no, "Token" : token};
    // console.log(nv_ajax(ajax_url, ajax_type, req_json));
    var result = nv_ajax(ajax_url, ajax_type, req_json);
    console.log(result);

    init_contents_by_language_result(result);

    // console.log(JSON.stringify(nv_ajax(ajax_url, ajax_type, req_json)) + " init_contents_by_language(language)의 결과입니다");
    // init_main_result(nv_ajax(ajax_url, ajax_type, req_json));
}




// 민성) 언어별로 콘텐츠를 서버로부터 불러왔을 때 결과를 화면에 보여주는 함수
// DOM트리에 직접 접근해서 콘텐츠를 보여줘야함
// 코드명, 코드번호, 작성자명, 썸네일을 보여줘야함

// 기존에 아이템이 있으면 지우고 다시 아이템을 쌓아야 한다


function init_contents_by_language_result(data){
    var retBody = data['retBody'];
    var totCnt = retBody['totCnt'];

    console.log(retBody['Hot_code']);



    if(data['retCode'] == '-1') {

        alert("에러 메시지 : "+data['errMsg']);

    }else {

        // 정상동작하는 경우 서버에서 불러온 컴포넌트의 수 만큼 컨텐츠를 보여준다

        if($('.c_item_rank_item').length>0)  $('.c_wrap_main_rank').empty();
        console.log('length : ' + $('.c_item_rank_item').length);

        for (let i = 0; i < totCnt; i++) {

            var element = retBody['Hot_code'][i]['list'][0];


            var title = element['title'];
            var code_no = element['no'];
            var user_no = element['user_no'];
            var img = element['img'];
            if(user_no == 1) user_no = 'admin';
            if(img.split('/,/').length>1) img = img.split('/,/')[0];

            keys.push(code_no);


            // 썸네일 이미지의 주소

            var thumb='/backend/resource/xml/admin/'+img.split('_')[0]+'/'+img;
            var rank_icon_1= '/frontend/resource/icon/1-st.png'
            var rank_icon_2= '/frontend/resource/icon/2-nd.png'
            var rank_icon_3= '/frontend/resource/icon/3-rd.png'
            var rank_icon_4= '/frontend/resource/icon/4-th.png'
            var rank_icon_5= '/frontend/resource/icon/5-th.png'
            var rank_icon_6= '/frontend/resource/icon/6-th.png'
            var rank_icon_7= '/frontend/resource/icon/7-th.png'
            var rank_icon_8= '/frontend/resource/icon/8-th.png'
            var rank_icon_9= '/frontend/resource/icon/9-th.png'

            var rank_collections=[rank_icon_1,rank_icon_2,rank_icon_3,
                                  rank_icon_4,rank_icon_5,rank_icon_6,
                                  rank_icon_7,rank_icon_8,rank_icon_9];

               



           
            var rank = i+1;
            // /backend/resource/xml/admin/alertdialog1/alertdialog1_0.png


            $('.c_wrap_main_rank').append($('<div/>', {
                class: 'c_main_rank_item_',
                id: 'i_main_rank_item_' +rank,
            }))

             // 컨텐츠에 회색 화면 씌우기 시작
            
          
            //랭킹 아이콘 넣기 시작
           
              // $('#i_main_rank_item_'+rank).append($('<img/>',{
            //     src:rank_collections[i],
            //     class:'c_item_rank_item',
            //     id:'i_item_rank_item'+rank

            // }))

            $('#i_main_rank_item_' +rank).append($('<div/>',{
                class:'c_item_rank_item',
                id:'i_item_rank_item'+rank

            }));
           
            $('#i_item_rank_item'+rank).append($('<img/>',{
                src:rank_collections[i],
                class:'c_item_rank_icon',
                id:'i_item_rank_icon'+rank

            }))
          

            //랭킹 아이콘 넣기 끝


            // 썸네일 생성
            $('#i_main_rank_item_' +rank).append($('<div/>',{
                onclick :'go_code_detail()',
                class:'c_wrap_contents',
                id:'i_wrap_contents'+rank

            }));

            

            $('#i_wrap_contents'+rank).append($('<img/>',{
                src:thumb,
                class:'c_item_thumbnail',
                id:'i_item_thumbnail_'+rank

            }))
          


            // 컨텐츠에 회색 화면 씌우기 끝
            //
  
          
            //
         


            $('#i_main_rank_item_' +rank).append($('<div/>',{
                class:'c_item_info',
                id:'i_item_info_'+rank

            }));

            // 유저 정보를 담기 위한 태그 생성

            $('#i_item_info_' +rank).append($('<div/>',{
                
                class:'c_user_info',
                id:'i_user_info_'+rank

            }));


            $('#i_user_info_' +rank).append($('<img/>',{
                onclick: "go_mypage()",
                src:"/frontend/resource/icon/person.png",
                class:'c_person',
                id:'i_person_'+rank

            }));

            $('#i_user_info_' +rank).append($('<span/>',{
                text: user_no,
                onclick: "go_mypage()",
                class:'c_user_name',
                id:'i_user_name_'+rank

            }));


            $('#i_user_info_' +rank).append($('<button/>',{
                onclick:"add_code();",
                class:'c_button_favorite',
                id:'i_button_favorite_'+rank,


            }));
            $('#i_user_info_' +rank).append($('<button/>',{
                onclick:"make_modal("+rank+");",
                class:'c_button_more',
                id:'i_button_more_'+rank,


            }));
            //즐쳐찾기 버튼의 이미지
            // $('#i_user_info_' +rank).append($('<img/>',{
            //     src:"/frontend/resource/icon/favorite.png",
            //     alt:"favorite",
            //     class:'c_favorite',
            //     // id:'i_favorite_'+rank,
            //
            //
            // }));
            $('#i_button_favorite_' +rank).append($('<img/>',{
                src:"/frontend/resource/icon/favorite.png",
                alt:"favorite",
                class:'c_favorite',
                // id:'i_favorite_'+rank,


            }));

            // $('#i_user_info_' +rank).append($('<img/>',{
            //     src:"/frontend/resource/icon/more.png",
            //     alt:"more",
            //     class:'c_more',
            //     // id:'i_more_'+rank,
            //
            //
            // }));
            $('#i_button_more_' +rank).append($('<img/>',{
                src:"/frontend/resource/icon/more.png",
                alt:"more",
                class:'c_more',
                // id:'i_more_'+rank,


            }));


            $('#i_item_info_' +rank).append($('<p/>',{
                class:'c_title',
                id:'i_title_'+rank,
                text:title

            }));

        }

    }


   
}

// 민성) 모달창에서 코드를 복사하는 함수

// TODO) 나중에 서버단에 로그를 쌓기 위해 서버로 유저의 토큰을 전송 해야함

function copy_code(index){

    toastr.options = {
        closeButton: false,
        progressBar: false,
        showMethod: 'slideDown',
        timeOut: 4000
    };



    $('.c_hide_copy_code').text(sources[index]);
    var copyText = document.getElementById("i_hide_copy_code").textContent;



    var textArea = document.createElement('textarea');
    textArea.textContent = copyText;
    document.body.append(textArea);

    textArea.select();
    document.execCommand("copy");
    textArea.remove();




    toastr.success(titles[index], '소스코드 복사 성공 🎉👏');

    console.log("copy_code() is called!");

    // live_copy_code()

}

function live_copy_code() {

    var copyText = document.getElementById("i_hide_copy_code").textContent;



    var textArea = document.createElement('textarea');
    textArea.textContent = copyText;
    document.body.append(textArea);

    textArea.select();
    document.execCommand("copy");
    textArea.remove();

    window.alert("복사 완료");

}



// 민성) 즐겨찾기에 추가를 위한 함수
function add_code(){
    console.log("add_code() is called!");
}

// 민성) 즐겨찾기를 추가하는 함수
function add_mycode(code_no){

    var token = localStorage.getItem("cpToken");

    if(token != null) {



        console.log("add_mycode is clicked()! code_no : " + code_no );





        var btn_add_mycode = $('#btn_mycode' + code_no).text();


        var ajax_url = "/backend/php/common/main3.php";
        var ajax_type = "POST";



        var ajax_data = Object();
        var now_page = get_now_page();

        ajax_data.reqPage = now_page;
        ajax_data.reqType = "add_mycode";

        var token = localStorage.getItem("cpToken");

        ajax_data.reqBody = {"Code_no": code_no, "Token": token};



        var ajax_result;


        ajax_result = nv_ajax(ajax_url, ajax_type, ajax_data);




        var mycode_no = ajax_result['retBody'];

        console.log("add_mycode() mycode_no : " + mycode_no);


        if (ajax_result['retCode'] == '0') {

            alert("즐겨찾기 추가 성공");
            $('#btn_mycode' + code_no).text('- 즐겨찾기 취소');
            $('#btn_mycode' + code_no).attr("onclick", "delt_mycode(" + mycode_no + "," + code_no + ");");
            $('#btn_mycode' + code_no).css("background-color", "#ff6f61");
            $('#btn_mycode' + code_no).css("color", "#fff");

        } else {

            alert("즐겨찾기 추가 실패");

        }

    }else{


        if(confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?") == true){
            location.replace("/login.html");

        }
        else{
            return ;
        }

    }
}

// 민성) 즐겨찾기를 취소하는 버튼
function delt_mycode(mycode_no, code_no){

    var token = localStorage.getItem("cpToken");

    if(token != null) {


        var ajax_url = "/backend/php/common/main3.php";
        var ajax_type = "POST";



        var ajax_data = Object();
        var now_page = get_now_page();

        ajax_data.reqPage = now_page;
        ajax_data.reqType = "delt_mycode";





        var token = localStorage.getItem("cpToken");

        ajax_data.reqBody = {"Mycode_no": mycode_no, "Token": token};


        var ajax_result;


        ajax_result = nv_ajax(ajax_url, ajax_type, ajax_data);

        if (ajax_result['retCode'] == '0') {

            alert("즐겨찾기 취소 성공");

            console.log("delt_mycode is clicked! mycode_no : " + mycode_no);



            $('#btn_mycode' + code_no).text('+ 즐겨찾기');
            $("#btn_mycode" + code_no).attr("onclick", "add_mycode(" + code_no + ");");
            $('#btn_mycode' + code_no).css("background-color", "#fff");
            $('#btn_mycode' + code_no).css("color", "#6c757d");

        } else {

            alert("즐겨찾기 취소 실패 ");

        }

    }else{

        if(confirm("로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?") == true){
            location.replace("/login.html");

        }
        else{
            return ;
        }

    }



}

// 민성) 마이페이지로 이동하는 함수
function go_mypage(){
  
     location.href = "mypage.html";
}




// 상세보기 페이지로 넘어갈 때 실행되는 함수, 
function go_code_detail(code_no) {

    var ajax_url = "/backend/php/common/main3.php";
    var ajax_type = "POST";



    var ajax_data = Object();
    var now_page = get_now_page();

    ajax_data.reqPage = now_page;
    ajax_data.reqType = "click_contents";





    var token = localStorage.getItem("cpToken");

    ajax_data.reqBody = {
        "Code_no": code_no,
        "Token": token
    };


    var ajax_result;


    ajax_result = nv_ajax(ajax_url, ajax_type, ajax_data);

    location.href = "code_detail_c.html?code_no=" + code_no;


}


// 민성) 동적으로 태그 생성해서 할당하는 코드 동작하는지 확인하는 테스트 함수
function test(){

    for (let i = 1; i <= 3; i++) {
        console.log("i : " + i);

        // $('.c_wrap_main_rank').append($('<div/>', {
        //     class: 'c_main_rank_item',
        //     text: 'hello!'
        // }));

        var rank = i;



        $('.c_wrap_main_rank').append($('<div/>', {
            class: 'c_main_rank_item',
            id: 'i_main_rank_item_' +rank,

        }))

        // 썸네일 생성
        $('#i_main_rank_item_'+rank).append($('<img/>',{
            src:'/frontend/resource/icon/menu.png',
            class:'c_item_thumbnail',
            id:'i_item_thumbnail_'+rank

            // 컨텐츠 정보를 담기 위한 태그 생성
        }))


        $('#i_main_rank_item_' +rank).append($('<div/>',{
            class:'c_item_info',
            id:'i_item_info_'+rank

        }));

        // 유저 정보를 담기 위한 태그 생성

        $('#i_item_info_' +rank).append($('<div/>',{
            class:'c_user_info',
            id:'i_user_info_'+rank

        }));

        $('#i_item_info_' +rank).append($('<div/>',{
            class:'c_user_info',
            id:'i_user_info_'+rank

        }));

        $('#i_user_info_' +rank).append($('<img/>',{
            src:"/frontend/resource/icon/person.png",
            class:'c_person',
            id:'i_person_'+rank

        }));

        $('#i_user_info_' +rank).append($('<span/>',{
            text:'user_nickname',
            class:'c_user_name',
            id:'i_user_name_'+rank

        }));

        $('#i_user_info_' +rank).append($('<img/>',{
            src:"/frontend/resource/icon/favorite.png",
            alt:"favorite",
            class:'c_favorite',
            // id:'i_favorite_'+rank,


        }));

        $('#i_user_info_' +rank).append($('<img/>',{
            src:"/frontend/resource/icon/more.png",
            alt:"more",
            class:'c_more',
            // id:'i_more_'+rank,


        }));


        $('#i_item_info_' +rank).append($('<p/>',{
            class:'c_title',
            id:'i_title_'+rank,
            text:'Handler3'

        }));


    }

}


// 민성) 모달창을 생성하는 함수
// 모달창 레이아웃을 세팅하고 서버로부터 모달창에 필요한 데이터를 가져온다

function make_modal(rank){
    // console.log("make_modal() is called!");
    // Get the modal
    var modal = document.getElementById('i_modal');

    modal.style.display = "block";
    init_modal(rank)

}
// // Get the modal
var modal = document.getElementById('i_modal');

// Get the button that opens the modal
// var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var modal_close = document.getElementsByClassName("c_modal_close")[0];

// When the user clicks on the button, open the modal
// btn.onclick = function() {
//     modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
modal_close.onclick = function() {
    modal.style.display = "none";
    // $('html, body').css({'overflow': 'auto', 'height': '100%'}); //scroll hidden 해제

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }


    // 모달창 레이아웃을 세팅하고 서버에서 데이터를 가져온다
    // 매개변수로 콘텐츠가 몇번째 순위인지 넘긴다
}

// 민성) 모달창을 띄웠을 때 모달창이 필요한 데이터를 서버로부터 불러오는 함수
// 모달창 레이아웃 세팅이 끝났을 때 호출된다

function init_modal(rank){



    console.log("init_modal() is called! rank : " + rank);

    var modal_source = new Array();

    // 랭킹에서 1을 빼야 인덱스처럼 사용 가능
    var index = rank-1;
    var code_no = keys[index];

    console.log("init_modal(language_no) is called!");

    var ajax_url = "/backend/php/common/main3.php";
    var ajax_type = "POST";

    var req_json = Object();
    var now_page = get_now_page();
    req_json.reqPage = now_page;
    req_json.reqType = "modal";

    var token = localStorage.getItem("cpToken");
    req_json.reqBody = {"Code_no":code_no, "Token" : token};
    console.log("reqBody : "  + JSON.stringify(req_json));
    console.log("code_no : " + code_no);
    console.log("keys : " + JSON.stringify(keys ));


    // console.log(nv_ajax(ajax_url, ajax_type, req_json));
    var result = nv_ajax(ajax_url, ajax_type, req_json);
    console.log(result);


    var title = $("#i_title_" + rank).text();
    $(".c_modal_title").text(title);
    console.log($("#i_title_" + rank).text());

    init_modal_result(result);

}

// 민성) 서버로부터 모달창에 필요한 데이터를 전송 받고 나서 모달창에서 데이터를 보여주는 함수
function init_modal_result(result) {
    // 0. 모달창의 소스를 저장하는 배열을 초기화 한다.
    modal_source = new Array();

    if(titles.length>0 && sources.length > 0){
        titles.length=0;
        sources.length=0;

    }
    //
    // titles = [];
    // sources = [];



    console.log("init_modal_result()" + result);

    // 1. 결과값에서 필요한 변수들을 추출한다.

    var retBody = result['retBody'];
    var code_component = retBody['code_component'];
    var list = code_component['list'];

    // 코드 컴포넌트의 총 갯수
    var totCnt = code_component['totCnt'];


    // 2. 코드 컴포넌트의 총 갯수 만큼 탭을 만든다.

    $(".c_ul_tabs").children().remove();


    for (let i = 0; i < totCnt; i++) {
        console.log("create tab , index: " + i);

        var title = list[i]['title'];
        var source = list[i]['source'];
        var language = list[i]['language'];
        console.log('language : ' + language);

        titles.push(title+"."+language);
        sources.push(source);

        modal_source[title] = source;


        $('.c_ul_tabs').append($('<li/>',{

            class:'c_tab_item',
            id:'i_tab_item_'+i

        }));
        $('#i_tab_item_' + i).append($('<a/>',{

            text:titles[i],
            onclick:"click_tab("+i+")"


        }));


    }

    // 3. 디폴트로 첫번째 탭을 클릭한 상태로 모달창을 띄운다


    // console.log(code_component);
   click_tab(0);

    // 4. 콘텐츠의 타이틀을 세팅한





}

function click_tab(index){

    // 0. 모든 탭을 클릭 안한 상태로 변경한다

    // 0. 1)
    var title = titles[index];
    var source = sources[index];

    var source_num = sources.length;
    console.log("num : " + source_num);


    for (let i = 0; i < source_num; i++) {
        $("#i_tab_item_"+i ).css("background-color","#FFFFFF");
        $("#i_tab_item_"+i +" a" ).css("color","#00AB49");

    }



    console.log("click_tab()");
    // 1. 클릭한 탭을 클릭한 상태로 변경한다
    //
    $("#i_tab_item_"+index).css("background-color","#00AB49");
    $("#i_tab_item_"+index+" a").css("color","#FFFFFF");




    // 3. 에디터 언어별 옵션 변경

    // 3-1) 어떤 언어인지 정규식을 통해 추출
    var language = title.split(".").reverse()[0];

    console.log("language : " + language);

    var origin_code_textarea = document.getElementById('i_modal_editor');
    $(".CodeMirror").remove();

    switch (language) {

        case "xml" :

            var origin_code_editor = CodeMirror.fromTextArea(origin_code_textarea, {

                mode: "xml",
                theme: "darcula", // 어두운 테마
                lineNumbers: true, // 라인 넘버링
                autoCloseTags: true,
                readOnly: true
            });

            break;
        case "java" :

            var origin_code_editor = CodeMirror.fromTextArea(origin_code_textarea, {

                mode: "text/x-java",
                theme: "darcula", // 어두운 테마
                lineNumbers: true, // 라인 넘버링
                autoCloseTags: true,
                readOnly: true
            });

            break;
    }
    origin_code_editor.setSize("100%", "100%");

    //  2. 에디터에 소스를 할당
    origin_code_editor.setValue(source);

    // 3. 코드 복사 함수에 매개변수를 변경해줘야 한다

    $(".c_copy").attr("onclick","copy_code(" + index+")");

}

//웹킷 스크롤바 만들기 시작 

const gap = 16;

const carousel = document.getElementById("c_wrap_category_item"),
  content = document.getElementById("c_category_item"),
  next = document.getElementById("next"),
  prev = document.getElementById("prev");

// const carousel = document.getElementsByClassName("c_wrap_category_item"),
//   content = document.getElementsByClassName("c_category_item"),
//   next = document.getElementById("next"),
//   prev = document.getElementById("prev");

next.addEventListener("click", e => {
  carousel.scrollBy(width + gap, 0);
  if (carousel.scrollWidth !== 0) {
    prev.style.display = "flex";
  }
  if (content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
    next.style.display = "none";
  }
});
prev.addEventListener("click", e => {
  carousel.scrollBy(-(width + gap), 0);
  if (carousel.scrollLeft - width - gap <= 0) {
    prev.style.display = "none";
  }
  if (!content.scrollWidth - width - gap <= carousel.scrollLeft + width) {
    next.style.display = "flex";
  }
});

let width = carousel.offsetWidth;
window.addEventListener("resize", e => (width = carousel.offsetWidth));

// dropdown 시작하는 메소드
function dropdown_search(){
  
    $('#dropDown').click(function(){
      $('.drop-down').toggleClass('drop-down--active');
    });
    
    // document.getElementById('dropDown').onclick =function(){
    //   $('#drop-down').toggleClass('drop-down--active');
    // }
  
}


// 언어별 페이지로 이동시키는 함수


// 매개변수로 어떤 언어의 페이지로 이동시킬지 넘긴다
function go_category(language){

    // location/gerf


}


//웹킷 스크롤바 만들기 끝


// var origin_code_textarea = document.getElementById('i_modal_editor');
// var origin_code_editor = CodeMirror.fromTextArea(origin_code_textarea, {
//
//     mode: "text/x-java",
//     // theme: "eclipse",
//
//     theme: "darcula", // 어두운 테마
//     lineNumbers: true, // 라인 넘버링
//     autoCloseTags: true,
//     readOnly: true
// });
//
// origin_code_editor.setSize("100%", "100%");



// modal.style.display = "block";
// $('html, body').css({'overflow': 'hidden', 'height': '100%'});


// var origin_code_textarea = document.getElementById('i_modal_editor');
// var origin_code_editor = CodeMirror.fromTextArea(origin_code_textarea, {
//
//     mode: "text/x-java",
//     // theme: "eclipse",
//
//     theme: "darcula", // 어두운 테마
//     lineNumbers: true, // 라인 넘버링
//     autoCloseTags: true,
//     readOnly: true
// });
// origin_code_editor.setValue("class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{class minseong{" +
//     "}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
// origin_code_editor.setSize("100%", "100%");



// 민성) 모달창에서 탭을 클릭했을 때 실행되는 함수

