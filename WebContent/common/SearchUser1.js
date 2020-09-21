jQuery.sap.declare("common.SearchUser1");
jQuery.sap.require("common.Common");
/** 
* ����˻��� Dialog�� ���� JS �̴�.
* @Create By ������
*/

common.SearchUser1 = {
	/** 
	* @memberOf common.SearchUser1
	*/	
	
	oController : null,
	EsBusyDialog : new sap.m.BusyDialog(),
	//Add by Wave2
	fPersaEnabled : true,
	
	vHeight : 330,
	clicks : 0,
	_vSPath : -1,
	
	searchFilterBar: function(oEvent) {	
		
		var oController = common.SearchUser1.oController;
		
		var dateFormat1 = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"}); 
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var oFilters = [];
		var filterString = "/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, oPersa.getSelectedKey()));
		oFilters.push(new sap.ui.model.Filter("Actda", sap.ui.model.FilterOperator.EQ, vActda));
		
		if(oEname.getValue() != "") {
			if(oEname.getValue().length < 2) {
				sap.m.MessageBox.alert("성명은 2자 이상이어야 합니다");
				return;
			}
			filterString += "%20and%20Ename%20eq%20%27" + encodeURI(oEname.getValue()) + "%27";
			oFilters.push(new sap.ui.model.Filter("Ename", sap.ui.model.FilterOperator.EQ, encodeURI(oEname.getValue())));
		}
		
		var oFulln_Tokens = oFulln.getTokens();
		if(oFulln_Tokens && oFulln_Tokens.length) {
			var oFulln_filterString = "";
			for(var i=0; i<oFulln_Tokens.length; i++) {
				if(oFulln_filterString == "") oFulln_filterString = "%20and%20(";
				else oFulln_filterString += "%20or%20";
				oFulln_filterString += "Orgeh%20eq%20%27" + oFulln_Tokens[i].getKey() + "%27";
				oFilters.push(new sap.ui.model.Filter("Orgeh", sap.ui.model.FilterOperator.EQ, oFulln_Tokens[i].getKey()));
			}
			if(oFulln_filterString != "") filterString += oFulln_filterString + ")";
		}
		
		if(oStat1 && oStat1.getSelectedKey() != "0000") {
			filterString += "%20and%20Stat1%20eq%20%27" + oStat1.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Stat1", sap.ui.model.FilterOperator.EQ, oStat1.getSelectedKey()));
		}
		
		if(oZzjobgr &&  oZzjobgr.getSelectedKey() != "0000" && oZzjobgr.getSelectedKey() != "0") {
			filterString += "%20and%20Zzjobgr%20eq%20%27" + oZzjobgr.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzjobgr", sap.ui.model.FilterOperator.EQ, oZzjobgr.getSelectedKey()));
		}
		
		if(oZzcaltl && oZzcaltl.getSelectedKey() != "0000" && oZzcaltl.getSelectedKey() != "0"  && oZzcaltl.getSelectedKey() != "") {
			filterString += "%20and%20Zzcaltl%20eq%20%27" + oZzcaltl.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzcaltl", sap.ui.model.FilterOperator.EQ, oZzcaltl.getSelectedKey()));
		}
		
		if(oZzpsgrp && oZzpsgrp.getSelectedKey() != "0000" && oZzpsgrp.getSelectedKey() != "0" && oZzpsgrp.getSelectedKey() != "") {
			filterString += "%20and%20Zzpsgrp%20eq%20%27" + oZzpsgrp.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzpsgrp", sap.ui.model.FilterOperator.EQ, oZzpsgrp.getSelectedKey()));
		}
		
		if(oZzrollv && oZzrollv.getSelectedKey() != "0000" && oZzrollv.getSelectedKey() != "0" && oZzrollv.getSelectedKey() != "" ) {
			filterString += "%20and%20Zzrollv%20eq%20%27" + oZzrollv.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Zzrollv", sap.ui.model.FilterOperator.EQ, oZzrollv.getSelectedKey()));
		}
		
		if(oPersg && oPersg.getSelectedKey() != "0000" && oPersg.getSelectedKey() != "0" && oPersg.getSelectedKey() != "") {
			filterString += "%20and%20Persg%20eq%20%27" + oPersg.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persg", sap.ui.model.FilterOperator.EQ, oPersg.getSelectedKey()));
		}
		
		if(oPersk && oPersk.getSelectedKey() != "0000" && oPersk.getSelectedKey() != "0" && oPersk.getSelectedKey() != "") {
			filterString += "%20and%20Persk%20eq%20%27" + oPersk.getSelectedKey() + "%27";
			oFilters.push(new sap.ui.model.Filter("Persk", sap.ui.model.FilterOperator.EQ, oPersk.getSelectedKey()));
		}

		if(oFilters.length < 4) {
			sap.m.MessageBox.alert("최소한 2개이상의 검색조건이 있어야 합니다.");
			return;
		}
		
		
//		var oCheckHeader = sap.ui.getCore().byId(oController.PAGEID + "_ES_CheckHeader");
//		oCheckHeader.setChecked(false);
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		var vEmpSearchResult = {EmpSearchResultSet : []};
		oController.BusyDialog.open();
		var readProcess = function(){
//			common.SearchUser1.EsBusyDialog.close();
			oCommonModel.read("/EmpSearchResultSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {	
								oData.results[i].Chck = false ;
								vEmpSearchResult.EmpSearchResultSet.push(oData.results[i]);
							}
						
//							if(vEmpSearchResult.EmpSearchResultSet.length > 0) {
//								mEmpSearchResult.setData(vEmpSearchResult);	
//							}		
							mEmpSearchResult.setData(vEmpSearchResult);	
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			oController.BusyDialog.close();
		}
		
//		common.SearchUser1.EsBusyDialog.open();
		
	
		
		setTimeout(readProcess , 300);

//		clearSelection
	},
	
	onAfterOpenSearchDialog : function(oEvent) {
		console.log("!@#!@#!@#!@#");
		var oController = common.SearchUser1.oController;
//		var a = $("__column36"); 
//		console.log(a);
//		a.css('paddingTop','0px !important');
		common.SearchUser1.onAfterRendering();
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");		
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		
		// selection �ʱ�ȭ
		var oSearchTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		if(oSearchTable){
			oSearchTable.clearSelection();
		}
		
		
		oStat1.removeAllItems();
		oStat1.destroyItems();
		
		//Add by Wave2
		oPersa.setEnabled(common.SearchUser1.fPersaEnabled);
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var vWave = "";
		if(common.SearchUser1.oController.Wave && common.SearchUser1.oController.Wave == "1") {
			vWave = "1";
		} else if(common.SearchUser1.oController.Wave && common.SearchUser1.oController.Wave == "2") {
			vWave = "2";
		}
		
		try {
			  oCommonModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27 and Wave eq '" + vWave + "'", 
			  //oCommonModel.read("/PersAreaListSet/?$filter=Actty%20eq%20%271%27",
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								oPersa.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Persa, 
											text : oData.results[i].Pbtxt}));
							}
							if(oController._vPersa == "") {
								oPersa.setSelectedKey(oData.results[0].Persa);
								oController._vPersa = oData.results[0].Persa;
							} else {
								oPersa.setSelectedKey(oController._vPersa);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
		} catch(ex) {
			common.Common.log(ex);
		}
		
//		oPersa.setSelectedKey(oController._vPersa);
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oController._vPersa + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
//		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg", "Zzrollv"];
		var vControls = ["Stat1", "Persg"];
		
		
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext :"-- 선택 --"});
		}
		filterString += ")";
		
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
		
//		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg , oZzrollv];
		var oControls = [oStat1, oPersg];
		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
			for(var j=0; j<vControls.length; j++) {
				if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
				}
			}
		}
		oStat1.setSelectedKey("3");
		
		if(	oController._vEnamefg && oController._vEnamefg == "X"){ 
			var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
			oEname.setValue(oController._oControl.getValue());
			common.SearchUser1.searchFilterBar();
		}
	},
	
	onBeforeOpenSearchDialog : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oEname = sap.ui.getCore().byId(oController.PAGEID + "_ES_Ename");
		var oFulln = sap.ui.getCore().byId(oController.PAGEID + "_ES_Fulln");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oEname.setValue("");
		oFulln.removeAllTokens();
		oFulln.destroyTokens();
		oFulln.setValue("");
		
		oStat1.removeAllItems();
		oStat1.destroyItems();
		if(oZzjobgr){
			oZzjobgr.removeAllItems();
			oZzjobgr.destroyItems();
		}
		if(oZzcaltl){
			oZzcaltl.removeAllItems();
			oZzcaltl.destroyItems();
		}
		if(oZzpsgrp){
			oZzpsgrp.removeAllItems();
			oZzpsgrp.destroyItems();
		}
		if(oPersg){
			oPersg.removeAllItems();
			oPersg.destroyItems();
		}
		if(oZzrollv) oZzrollv.destroyItems();
		if(oPersk) oPersk.destroyItems();
		
		oPersa.destroyItems();
		
		var mEmpSearchResult = sap.ui.getCore().getModel("EmpSearchResult");
		mEmpSearchResult.setData(null);
		
//		var oFilter6 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter6");
//		var oFilter7 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter7");
//		var oFilter8 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter8");
//		var oFilter9 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter9");
//		
//		oFilter6.setVisible(false);
//		oFilter7.setVisible(false);
//		oFilter8.setVisible(false);
//		oFilter9.setVisible(false);
		
//		var oMore = sap.ui.getCore().byId(oController.PAGEID + "_ES_More");
//		oMore.setText("More");
	},
	
	/*
	 * ����˻� Dialog�� Close�Ѵ�.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchUser1.oController.PAGEID + "_ES_Dialog");
		if(oDialog) oDialog.close();
		
		
	},
	
	onExpandFilter : function(oEvent) {
//		var oController = common.SearchUser1.oController;
//		var fExpand = oEvent.getParameter("expand");
//
//		if(fExpand) {
//			$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight);
//		} else {
//			$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight + 160);
//		}
	},
	
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchUser1.searchFilterBar();
		}
	},
	
	onAfterRendering : function() { 
//		var oController = common.SearchUser1.oController;
//		
//		common.SearchUser1.vHeight = window.innerHeight - 300;
//		
//		$("#" + oController.PAGEID + "_ES_Table").css("height", common.SearchUser1.vHeight);
	},
	
	onChangePersa : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oItem = oEvent.getParameter("selectedItem");
		
		var oStat1 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Stat1");
		var oZzjobgr = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzjobgr");
		var oZzcaltl = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzcaltl");
		var oZzpsgrp = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzpsgrp");
		var oZzrollv = sap.ui.getCore().byId(oController.PAGEID + "_ES_Zzrollv");
		var oPersg = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persg");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oStat1.removeAllItems();
		oZzjobgr.removeAllItems();
		oZzcaltl.removeAllItems();
		oZzpsgrp.removeAllItems();
		oPersg.removeAllItems();
		
		oStat1.destroyItems();
		oZzjobgr.destroyItems();
		oZzcaltl.destroyItems();
		oZzpsgrp.destroyItems();
		oPersg.destroyItems();
		
		oZzrollv.destroyItems();
		oPersk.destroyItems();
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oItem.getKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		
		var mEmpCodeList = sap.ui.getCore().getModel("EmpSearchCodeList");
		var vEmpCodeList = {EmpCodeListSet : []};
		
//		var vControls = ["Stat1", "Zzjobgr", "Zzcaltl", "Zzpsgrp", "Persg", "Zzrollv"];
		var vControls = ["Stat1", "Persg"];
		filterString += "%20and%20(";
		for(var i=0; i<vControls.length; i++) {			
			filterString += "Field%20eq%20%27" + vControls[i] + "%27";
			if(i != (vControls.length - 1)) {
				filterString += "%20or%20";
			}
			vEmpCodeList.EmpCodeListSet.push({Field : vControls[i], Ecode : "0000", Etext : "-- 선택 --"});
		}
		filterString += ")";
		
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
		
//		var oControls = [oStat1, oZzjobgr, oZzcaltl, oZzpsgrp, oPersg , oZzrollv];
		var oControls = [oStat1, oPersg ];
		for(var i=0; i<vEmpCodeList.EmpCodeListSet.length; i++) {
			for(var j=0; j<vControls.length; j++) {
				if(vEmpCodeList.EmpCodeListSet[i].Field == vControls[j]) {
					oControls[j].addItem(new sap.ui.core.Item({key : vEmpCodeList.EmpCodeListSet[i].Ecode, text : vEmpCodeList.EmpCodeListSet[i].Etext}));
				}
			}
		}
		oStat1.setSelectedKey("3");
	},
	
	onChangePersg : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oCommonModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oItem = oEvent.getParameter("selectedItem");
		
		var oPersa = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persa");
		var oPersk = sap.ui.getCore().byId(oController.PAGEID + "_ES_Persk");
		
		oPersk.destroyItems();
		
		if(oItem.getKey() == "0000") return;
		
		var vActda = "";
		if(!oController._vActda) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
			var curDate = new Date();
			vActda = dateFormat.format(curDate);
		} else {
			vActda = oController._vActda;
		}
		
		var filterString = "/?$filter=Persa%20eq%20%27" + oPersa.getSelectedKey() + "%27";
		filterString += "%20and%20Actda%20eq%20datetime%27" + vActda + "T00%3a00%3a00%27";
		filterString += "%20and%20Field%20eq%20%27" + "Persk" + "%27";
		filterString += "%20and%20Excod%20eq%20%27" + oItem.getKey() + "%27";
		
		oPersk.addItem(new sap.ui.core.Item({key : "0000", text : "-- 선택 --"}));
		
		oCommonModel.read("/EmpCodeListSet" + filterString, 
					null, 
					null, 
					false,
					function(oData, oResponse) {
						if(oData && oData.results) {
							for(var i=0; i<oData.results.length; i++) {
								oPersk.addItem(
										new sap.ui.core.Item({
											key : oData.results[i].Ecode, 
											text : oData.results[i].Etext}));
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
		);
	},
	
	onClickMore : function(oEvent) {
		var oController = common.SearchUser1.oController;
		
		var oControl = oEvent.getSource();
		var vText = oControl.getText();
		
		
		var oFilter6 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter6");
//		var oFilter7 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter7");
//		var oFilter8 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter8");
//		var oFilter9 = sap.ui.getCore().byId(oController.PAGEID + "_ES_Filter9");
		
		if(vText == "More" ) {
			oFilter6.setVisible(true);
//			oFilter7.setVisible(true);
//			oFilter8.setVisible(true);
//			oFilter9.setVisible(true);
			oControl.setText("Hide");
		} else {
			oFilter6.setVisible(false);
//			oFilter7.setVisible(false);
//			oFilter8.setVisible(false);
//			oFilter9.setVisible(false);
			oControl.setText("More");
		}
	},
	
	onClick : function(oEvent) {
		var oController = common.SearchUser1.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID+"_EmpSearchResult_Table");
		var vContext = oEvent.getParameters().rowBindingContext;
		var oTableModel = oTable.getModel();
		if(vContext == undefined || oTableModel.getProperty(vContext.sPath)==null){
			return;
		}
        
		common.SearchUser1.clicks = common.SearchUser1.clicks + 1;
	        
	     if(common.SearchUser1.clicks == 1) {
	          setTimeout( common.SearchUser1.clearClicks, 500);
	     } else if(common.SearchUser1.clicks == 2) {
	    	 common.SearchUser1._vSPath = vContext.sPath;
	     }
	},
	
	clearClicks : function () {
		var oController = common.SearchUser1.oController;
		common.SearchUser1.clicks = 0;
		common.SearchUser1._vSPath = -1;
        
	},
	
	onDblClick : function(oEvent){
		var oController = common.SearchUser1.oController;
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_EmpSearchResult_Table");
		if(common.SearchUser1._vSPath == null || common.SearchUser1._vSPath == -1) return ;
		var vIndex = common.SearchUser1._vSPath.replace("/EmpSearchResultSet/","");
		oTable.clearSelection();
		oTable.setSelectedIndex(parseInt(vIndex));
		oController.onESSelectPerson();
	},
	
	
};