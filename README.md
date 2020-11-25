# actionapp

<!DOCTYPE html>
<html lang="ko">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<title>�����ּҰ˻�</title>
		
		<script src="resources/sap-ui-cachebuster/sap-ui-core.js"
				id="sap-ui-bootstrap"
				data-sap-ui-libs="sap.m,sap.ui.commons,sap.ui.core, sap.suite.ui.commons,sap.ui.ux3, 
								  sap.ui.unified, sap.ui.layout, sap.ui.comp, sap.ca.ui, sap.ui.table"
				data-sap-ui-xx-bindingSyntax="complex"
				data-sap-ui-theme=	"sap_bluecrystal"
				data-sap-ui-appCacheBuster="./">
		</script>
<!-- 		<input type="text" id="postCode" name="postCode" id="postCode" placeholder="�����ȣ" /> -->
		<!-- iOS������ position:fixed ���װ� ����, �����ϴ� ����Ʈ�� �°� position:absolute ���� �̿��Ͽ� top,left�� ���� �ʿ� -->
		<div id="layer" style="display:none;position:fixed;overflow:hidden;z-index:1;-webkit-overflow-scrolling:touch;">
<!-- 		<img src="//t1.daumcdn.net/localimg/localimages/07/postcode/320/close.png" id="btnCloseLayer" style="cursor:pointer;position:absolute;right:-3px;top:-3px;z-index:1" onclick="closeDaumPostcode()" alt="�ݱ� ��ư"> -->
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
	        

	        // �����ȣ ã�� ȭ���� ���� element
		    window.scrollTo(0,1);
		    var element_layer = document.getElementById('layer');
		
		    function closeDaumPostcode() {
		        // iframe�� ���� element�� �Ⱥ��̰� �Ѵ�.
		        element_layer.style.display = 'none';
		    }
			/*
				 ���� ������ ������ Version
			*/
		    // function sample2_execDaumPostcode() {
		        new daum.Postcode({
		            oncomplete: function(data) {
		                // �˻���� �׸��� Ŭ�������� ������ �ڵ带 �ۼ��ϴ� �κ�.
		
		                // �� �ּ��� ���� ��Ģ�� ���� �ּҸ� �����Ѵ�.
		                // �������� ������ ���� ���� ��쿣 ����('')���� �����Ƿ�, �̸� �����Ͽ� �б� �Ѵ�.
		                var fullAddr = '';// ���� �ּ� ����
		                var extraAddr = ''; // ������ �ּ� ����
		                 // ����ڰ� ��� ������ ���
		                if(data.userLanguageType == "E"){
		                	 if(data.userSelectedType === 'R'){
		                		 fullAddr = data.roadAddressEnglish ;
		                	 }else{
		                		 fullAddr = data.jibunAddressEnglish ;
		                	 }
		                }else{
		                	 // �⺻ �ּҰ� ���θ� Ÿ���϶� �����Ѵ�.
			                if(data.userSelectedType === 'R'){
			                	fullAddr = data.roadAddress ;
			                    //���������� ���� ��� �߰��Ѵ�.
			                    if(data.bname !== ''){
			                        extraAddr += data.bname;
			                    }
			                    // �ǹ����� ���� ��� �߰��Ѵ�.
			                    if(data.buildingName !== ''){
			                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
			                    }
			                    // �������ּ��� ������ ���� ���ʿ� ��ȣ�� �߰��Ͽ� ���� �ּҸ� �����.
			                    fullAddr += (extraAddr !== '' ? '('+ extraAddr +')' : '');
			                }else{
			                	// ���� �� ��쿡�� ���� �ּ�
			                	fullAddr = data.jibunAddress ;
			                }
		                }
		                // iframe�� ���� element�� �Ⱥ��̰� �Ѵ�.
		                // (autoClose:false ����� �̿��Ѵٸ�, �Ʒ� �ڵ带 �����ؾ� ȭ�鿡�� ������� �ʴ´�.)
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
		
	        // iframe�� ���� element�� ���̰� �Ѵ�.
	        element_layer.style.display = 'block';
	
	        // iframe�� ���� element�� ��ġ�� ȭ���� ����� �̵���Ų��.
	        initLayerPosition();
	        
		    // �������� ũ�� ���濡 ���� ���̾ ����� �̵���Ű���� �ϽǶ�����
		    // resize�̺�Ʈ��, orientationchange�̺�Ʈ�� �̿��Ͽ� ���� ����ɶ����� �Ʒ� �Լ��� ���� ���� �ֽðų�,
		    // ���� element_layer�� top,left���� ������ �ֽø� �˴ϴ�.
		    function initLayerPosition(){
		        var width = 500; //�����ȣ���񽺰� �� element�� width
		        var height = 500; //�����ȣ���񽺰� �� element�� height
		        var borderWidth = 3; //���ÿ��� ����ϴ� border�� �β�
		
		        // ������ ������ ������ ���� element�� �ִ´�.
		        element_layer.style.width = width + 'px';
		        element_layer.style.height = height + 'px';
		        element_layer.style.border = borderWidth + 'px solid';
		        // ����Ǵ� ������ ȭ�� �ʺ�� ���� ���� �����ͼ� �߾ӿ� �� �� �ֵ��� ��ġ�� ����Ѵ�.
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
