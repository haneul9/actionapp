jQuery.sap.declare("common.Common");

jQuery.sap.require("sap.ui.commons.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.layout.VerticalLayout");
jQuery.sap.require("sap.suite.ui.commons.BusinessCard");

common.Common = {
		
		/** 
		* @memberOf common.Common
		*/
	
	displayHelp : function(oEvent) {
		console.log("cache refresh test");
		return;
		
//		var oControl = oEvent.getSource();
//		var vControlId = oControl.getId();
//		var vTmp = vControlId.split("_");
//		var vHelpId = vTmp[0];
//		var fImageExists = false;
//		
//		var request = $.ajax({ 
//			  url: "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/help/" + vHelpId + ".jpg",
//			  cache: false,
//			  async: false
//		});
//		
//		request.done(function( html ) {
//			fImageExists = true;
//		});
//			 
//		request.fail(function( jqXHR, textStatus ) {
//			fImageExists = false;
//		});	
//		
//		var oBackLayout = $(".L2POverlayBackLayout");
//		oBackLayout.css("display", "Block");
//		oBackLayout.css("visibility", "visible");
//		
//		var vH = window.innerHeight - 40;
//		var vW = window.innerWidth - 40;
//		
//		var oOverlay = $(".L2POverlay");
//		oOverlay.css("visibility", "visible");
//		oOverlay.css("position", "absolute");
//		
//		oOverlay.css("display", "Block");
//		oOverlay.css("opacity", 0.1);
//		oOverlay.css("height", 10);
//		oOverlay.css("width", 10);
//		oOverlay.css("left", vW);
//		
//		oOverlay.animate({
//		    width: vW,
//		    height: vH,
//		    left: 10,
//		}, 1000);
//		
//		oOverlay.animate({
//		    opacity: 1.0
//		}, 500);
//		
//		var oOverlayInner = $("#HelpOvrelay-inner");
//		if(fImageExists)
//			oOverlayInner.html("<img src='/sap/bc/ui5_ui5/sap/ZL2P01UI59000/help/" + vHelpId + ".jpg' style=''>");
//		else
//			oOverlayInner.html("<span class='notice'>���� �̹����� �����ϴ�.</span>");
//		
//		var oOverlayClose = $("#HelpOvrelay-close");
//		oOverlayClose.click(function() {
//			oOverlay.slideUp( "slow", function() {
//				oOverlay.css("visibility", "hidden");
//				oBackLayout.css("display", "None");
//				oBackLayout.css("visibility", "hidden");
//			});
//		});
//		
//		$( window ).resize(function() {
//			var oOverlay = $(".L2POverlay");
//			oOverlay.css("height", window.innerHeight - 40);
//			oOverlay.css("width", window.innerWidth - 40);
//		});
	},
	
	loadCodeData : function(Persa, Actda, Controls, Persa_nc) {
		var locale = sap.ui.getCore().getConfiguration().getLanguage(); //���
        
        if(!Controls || !Controls.length) {
        	return;
        }
        
		var filterString = "/?$filter=Persa%20eq%20%27" + Persa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + Actda + "T00%3a00%3a00%27";
		if(Persa_nc == "X") filterString += "%20and%20Persa_nc%20eq%20%27X%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpCodeList");
		
		var vEmpCodeList = {EmpCodeListSet : []};
		
		var addfilterString = "%20and%20(";
		var add_idx = 0;
		for(var i=0; i<Controls.length; i++) {
			var Fieldname = Controls[i].Fieldname;
			Fieldname = Fieldname.substring(0,1) + Fieldname.substring(1).toLowerCase();
			
//			if(Fieldname == "Werks" || Fieldname == "Btrtl" || Fieldname == "Rlsorgeh" || Fieldname == "Trfgr"
//				|| Fieldname == "Trfst" || Fieldname == "Persg" || Fieldname == "Persk") {
//				continue;
//			}
			add_idx++;
			addfilterString += "Field%20eq%20%27" + Fieldname + "%27";
			//if(i != (Controls.length - 1)) {
			addfilterString += "%20or%20";
			//}
			vEmpCodeList.EmpCodeListSet.push({Field : Fieldname, Ecode : "0000", Etext : "-- 선택 --"});
		}
		addfilterString = addfilterString.substring(0, addfilterString.length - 8);
		addfilterString += ")";
		
		if(add_idx > 0) {
			filterString = filterString + addfilterString;
		}
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vEmpCodeList.EmpCodeListSet.push(oData.results[i]);
							}
							mEmpCodeList.setData(vEmpCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	loadDomainData : function(Controls, Molga) {
        if(!Controls || !Controls.length) {
        	return;
        }
        
		var filterString = "/?$filter=";
		
		var mDomainCodeList = sap.ui.getCore().getModel("DomainCodeList");
		
		var vDomainCodeList = {DomainValueListSet : []};
		
		var addfilterString = "(";
		var add_idx = 0;
		for(var i=0; i<Controls.length; i++) {
			var Fieldname = Controls[i].Fieldname;
			
			add_idx++;
			addfilterString += "Domname%20eq%20%27" + Fieldname + "%27";
			addfilterString += "%20or%20";
			vDomainCodeList.DomainValueListSet.push({Domname : Fieldname, DomvalueL : "0000", Ddtext : "-- 선택 --"});
		}
		addfilterString = addfilterString.substring(0, addfilterString.length - 8);
		addfilterString += ")";
		
		if(add_idx > 0) {
			filterString = filterString + addfilterString;
		}
		
		if(Molga && Molga != "") {
			filterString += " and DomvalueL eq '" + Molga + "'";
		}
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		oCommonModel.read("/DomainValueListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								vDomainCodeList.DomainValueListSet.push(oData.results[i]);
							}
							mDomainCodeList.setData(vDomainCodeList);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	log : function(msg) {
		if(typeof console === "undefined") {
		} else {
			console.log(msg);
		}
	},
	
	onChangeRegno : function(oEvent){
		var vValue = oEvent.getParameter("value");
		vValue = vValue.replace("-", "");
		
		if(isNaN(vValue)) {
			sap.m.MessageBox.alert("숫자만 입력가능합니다.");
		}
	},
	
	showProcessMessageBox : function(msg, w) {
		var vTop = (window.innerHeight / 2) - 50;
		var vLeft = (window.innerWidth / 2) - 150;
		if(w) {
			vLeft = (window.innerWidth / 2) - (w/2);
		}
		
		$("#Processing_Msg").css("top", vTop);
		$("#Processing_Msg").css("left", vLeft);
		
		$("#Processing_MsgText").html(msg);
		
		$("#Processing_Msg").css("display", "block");
	},
	
	hideProcessMessageBox : function() {
		$("#Processing_Msg").css("display", "none");
	},
	
	showErrorMessage : function(msg) {
		sap.m.MessageBox.show(
		          msg, {
		          icon: sap.m.MessageBox.Icon.ERROR,
		          title: "Error",
		          actions: [sap.m.MessageBox.Action.OK],
		          styleClass: "sapUiSizeCompact"
		        }
		 );
	},
	
	showWarningMessage : function(msg) {
		sap.m.MessageBox.show(
		          msg, {
		          icon: sap.m.MessageBox.Icon.WARNING,
		          title: "Warning",
		          actions: [sap.m.MessageBox.Action.OK],
		          styleClass: "sapUiSizeCompact"
		        }
		 );
	}, 
	
	getTime : function(d) {
		if(d == null || d == "") return 0;
		var vTmp1 = new Date(d);
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
	
	setTime : function(d) {
		if(d == null) {
			console.log("Date Null !!!");
			return null;
		}
		var vTmp1 = d;
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
	
	setTime1 : function(d1) {
		if(d1 == null) {
			return null;
		}
		var vTmp1 = new Date(d1);
		
		if(vTmp1.getTimezoneOffset() < 0) {
			vTmp1.setTime(vTmp1.getTime() - (vTmp1.getTimezoneOffset() * 60000));
		} else {
			vTmp1.setTime(vTmp1.getTime() + (vTmp1.getTimezoneOffset() * 60000));
		}
		
		return vTmp1.getTime();
	},
	
	DateFormatter : function(fVal) { 
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		return fVal != null ? dateFormat.format(new Date(common.Common.setTime(new Date(fVal)))) : "";
		//return fVal != null ? dateFormat.format(new Date(fVal)) : "";
	},
	
	getODataPropertyInfo : function(model_name, entity_name, property_name) {
		var oModel = sap.ui.getCore().getModel(model_name)
		var oMetaModel = oModel.getMetaModel();
		
		var oEntityType = oMetaModel.getODataEntityType(model_name + "." + entity_name);
		
		var oProperty = oMetaModel.getODataProperty(oEntityType, property_name);
		
		return oProperty;		
	},
	
	getODataPropertyLength : function(model_name, entity_name, property_name) {
		var oModel = sap.ui.getCore().getModel(model_name)
		if(!oModel) return 0;
		
		var oMetaModel = oModel.getMetaModel();
		
		var oEntityType = oMetaModel.getODataEntityType(model_name + "." + entity_name);
		if(!oEntityType) return 0;
		
		var oProperty = oMetaModel.getODataProperty(oEntityType, property_name);
		
		var maxLength = 0;
		if(oProperty) {
			if(oProperty.type == "Edm.Decimal") {
				maxLength = parseInt(oProperty.precision);
				if(parseInt(oProperty.scale) > 0) maxLength += parseInt(oProperty.scale) + 1;
			} else if(oProperty.type == "Edm.String") {
				maxLength = parseInt(oProperty.maxLength);
			}
		}		
		
		return maxLength;		
	},
	
	numberWithCommas : function(x) {
		if(x == undefined){
			
		}else{
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	},
	
//	setFormatTime : function(vDate){
//		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
//		do{
//			_vIndex = _vValue.indexOf("'",_vStartPoint);
//			if( _vIndex != -1){
//				_vValue = _vValue.substring(0,_vIndex) + "\\" + _vValue.substring(_vIndex,_vValue.length) ;
//				_vStartPoint = _vIndex + 2 ;
//			}
//		}while( vDate.indexOf("/") != -1 ); 	
//	}
};