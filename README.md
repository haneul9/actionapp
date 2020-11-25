# actionapp

<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>통합주소검색</title>
		
		<script src="resources/sap-ui-cachebuster/sap-ui-core.js"
				id="sap-ui-bootstrap"
				data-sap-ui-libs="sap.m,sap.ui.commons,sap.ui.core, sap.suite.ui.commons,sap.ui.ux3, 
								  sap.ui.unified, sap.ui.layout, sap.ui.comp, sap.ca.ui, sap.ui.table"
				data-sap-ui-xx-bindingSyntax="complex"
				data-sap-ui-theme=	"sap_bluecrystal"
				data-sap-ui-appCacheBuster="./">
		</script>
<!-- 		<input type="text" id="postCode" name="postCode" id="postCode" placeholder="사원번호" /> -->
		<!-- iOS에서는 position:fixed 버그가 있음, 적용하는 사이트에 맞게 position:absolute 등을 이용하여 top,left값 조정 필요 -->
		<div id="layer" style="display:none;position:fixed;overflow:hidden;z-index:1;-webkit-overflow-scrolling:touch;">
<!-- 		<img src="//t1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="btnCloseLayer" style="cursor:pointer;position:absolute;right:-3px;top:-3px;z-index:1" onclick="closeDaumPostcode()" alt="닫기 버튼"> -->
		</div>
		
		<script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
		<script>
			var sServiceURL1 = "/sap/opu/odata/sap/ZHR_COMMON_SRV/";
	        var oModel = new sap.ui.model.odata.ODataModel(sServiceURL1, true);
	        
			var getUrlParameter = function getUrlParameter(sParam) {
			    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
			        sURLVariables = sPageURL.split('&'),
			        sParameterName,
			        i;
	
			    for (i = 0; i < sURLVariables.length; i++) {
			        sParameterName = sURLVariables[i].split('=');
	
			        if (sParameterName[0] === sParam) {
			            return sParameterName[1] === undefined ? true : sParameterName[1];
			        }
			    }
			};
			
			var CBFunction = getUrlParameter('CBF');
			if(CBFunction === undefined) CBFunction = "fn_setAddress";
	        

	        // 우편번호 찾기 화면을 넣을 element
		    window.scrollTo(0,1);
		    var element_layer = document.getElementById('layer');
		
		    function closeDaumPostcode() {
		        // iframe을 넣은 element를 안보이게 한다.
		        element_layer.style.display = 'none';
		    }
			/*
				 영어 선택이 가능한 Version
			*/
		    // function sample2_execDaumPostcode() {
		        new daum.Postcode({
		            oncomplete: function(data) {
		                // 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
		
		                // 각 주소의 노출 규칙에 따라 주소를 조합한다.
		                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
		                var fullAddr = '';// 최종 주소 변수
		                var extraAddr = ''; // 조합형 주소 변수
		                 // 사용자가 영어를 선택할 경우
		                if(data.userLanguageType == "E"){
		                	 if(data.userSelectedType === 'R'){
		                		 fullAddr = data.roadAddressEnglish ;
		                	 }else{
		                		 fullAddr = data.jibunAddressEnglish ;
		                	 }
		                }else{
		                	 // 기본 주소가 도로명 타입일때 조합한다.
			                if(data.userSelectedType === 'R'){
			                	fullAddr = data.roadAddress ;
			                    //법정동명이 있을 경우 추가한다.
			                    if(data.bname !== ''){
			                        extraAddr += data.bname;
			                    }
			                    // 건물명이 있을 경우 추가한다.
			                    if(data.buildingName !== ''){
			                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			                    }
			                    // 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
			                    fullAddr += (extraAddr !== '' ? '('+ extraAddr +')' : '');
			                }else{
			                	// 지번 일 경우에는 지번 주소
			                	fullAddr = data.jibunAddress ;
			                }
		                }
		                // iframe을 넣은 element를 안보이게 한다.
		                // (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
            		    var param = "'" + data.zonecode + "', '" + fullAddr + "', '" + data.sido  + "'";

						$(opener.location).attr("href", "javascript:" + CBFunction + "(" + param + ");");
		                element_layer.style.display = 'none';
		                //window.open('about:blank','_self').self.close();
		                window.close();
		            },
		            width : '100%',
		            height : '100%',
		            maxSuggestItems : 5
		        }).embed(element_layer);
		   //  }
		
	        // iframe을 넣은 element를 보이게 한다.
	        element_layer.style.display = 'block';
	
	        // iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
	        initLayerPosition();
	        
		    // 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
		    // resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
		    // 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
		    function initLayerPosition(){
		        var width = 500; //우편번호서비스가 들어갈 element의 width
		        var height = 500; //우편번호서비스가 들어갈 element의 height
		        var borderWidth = 3; //샘플에서 사용하는 border의 두께
		
		        // 위에서 선언한 값들을 실제 element에 넣는다.
		        element_layer.style.width = width + 'px';
		        element_layer.style.height = height + 'px';
		        element_layer.style.border = borderWidth + 'px solid';
		        // 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
// 		        element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
// 		        element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
		        element_layer.style.left = '10px';
		        element_layer.style.top = '10px';
		    }
		</script>
	</head>
	<body>
	</body>
</html>
