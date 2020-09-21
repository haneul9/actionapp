jQuery.sap.declare("common.MEmployeeProfile2");
jQuery.sap.require("control.L2PTab");
jQuery.sap.require("control.L2PDataSet");
jQuery.sap.require("control.L2PEmpBasic");

common.MEmployeeProfile2 = {
	/** 
	* @memberOf common.MEmployeeProfile2
	*/	
		
	vTableHeader : [],	
	vTableType : "",
	vTableMenuId : "",
	vController : null,
		
	makeBasicProfile : function(oController, Pernr) {
		var oDetailInfoLayout = sap.ui.getCore().byId(oController.PAGEID + "_DetailInfoLayout");		
		oDetailInfoLayout.addStyleClass("L2PDetailInfoLayout");
		
		var oBasicInfoLayout = sap.ui.getCore().byId(oController.PAGEID + "_BasicInfoLayout");
		oBasicInfoLayout.destroyContent();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var vPersonHeaderInfo = {};
		
		var vUsrty = "";
		if(oController._vSCreenType == "ess") {
			vUsrty = "E";
		} else if(oController._vSCreenType == "mss") {
			vUsrty = "M";
		} else if(oController._vSCreenType == "hass") {
			vUsrty = "H";
		} else if(oController._vSCreenType == "gass") {
			vUsrty = "G";
		} else if(oController._vSCreenType == "bsc") {
			vUsrty = "B";
		} else if(oController._vSCreenType == "top") {
			vUsrty = "T";
		}    
		
		oModel.read("/EmpProfileHeaderNewSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27"
				    + "%20and%20Accty%20eq%20%27" + vUsrty + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						vPersonHeaderInfo = oData.results[0];
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		var vColumns = [{label : "회사입사일"},
		                {label : "그룹입사일"},
		                {label : "소속발령일"},
		                {label : "소속발령일"},
		                {label : "직책발령일"}
		                ];
		
		var oEmpBasic = new control.L2PEmpBasic({
			empData : vPersonHeaderInfo,
			labels : vColumns
		});
		oBasicInfoLayout.destroyContent();
		oBasicInfoLayout.addContent(oEmpBasic);
	},
	
	makeDetailInfo : function(oController, Pernr) {
		var oMasterTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_MasterTabMenuLayout");
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		oSubTabMenuLayout.setVisible(false);
		
		oMasterTabMenuLayout.destroyContent();
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var vUsrty = "";
		if(oController._vSCreenType == "ess") {
			vUsrty = "E";
		} else if(oController._vSCreenType == "mss") {
			vUsrty = "M";
		} else if(oController._vSCreenType == "hass") {
			vUsrty = "H";
		} else if(oController._vSCreenType == "gass") {
			vUsrty = "G";
		} else if(oController._vSCreenType == "bsc") {
			vUsrty = "B";
		} else if(oController._vSCreenType == "top") {
			vUsrty = "T";
		}     
		
		var vPersonMenuInfo = [];
		oModel.read("/EmpProfileMenuSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				    "%20and%20Usrty%20eq%20%27" + vUsrty + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vPersonMenuInfo.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(vPersonMenuInfo.length < 1) return;
		
		oController._vMasterTabs = [];
		
		oController._vSubTabs = [];
		
		for(var i=0; i<vPersonMenuInfo.length; i++) {
			if(vPersonMenuInfo[i].Menuc2 == "") {
				var oneData = {};
				oneData.id = "M" + vPersonMenuInfo[i].Menuc1;
				oneData.label = vPersonMenuInfo[i].Menu1;
				oneData.childControl = vPersonMenuInfo[i].Child;
				oneData.merge = parseInt(vPersonMenuInfo[i].Merge);				
				oController._vMasterTabs.push(oneData);
			} else {
				var oneData = {};
				oneData.id = "S" + vPersonMenuInfo[i].Menuc2;
				oneData.label = vPersonMenuInfo[i].Menu2;
				oneData.parent = "M" + vPersonMenuInfo[i].Menuc1;
				oneData.childControl = vPersonMenuInfo[i].Child;
				oneData.merge = parseInt(vPersonMenuInfo[i].Merge);
				
				oController._vSubTabs.push(oneData);
			}
		}
		
		var vItemIds = [];
		var vItemLebels = [];
		
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			vItemIds.push(oController._vMasterTabs[i].id);
			vItemLebels.push(oController._vMasterTabs[i].label);
		}
		
		var oMasterTabLayout = new control.L2PTab({
			cssPath : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/css/",
			itemIds : vItemIds,
			itemLabels : vItemLebels,
			selectedKey : oController._vMasterTabs[0].id,
			select : common.MEmployeeProfile2.onSelectMasterTabMenu,
			bgColor : "#53abe6"
		});		
		oMasterTabLayout.addCustomData(new sap.ui.core.CustomData({key:"oController", value : oController}));
		
		oMasterTabMenuLayout.addContent(oMasterTabLayout);
		
		if(oController._vMasterTabs[0].childControl == "5" || oController._vMasterTabs[0].childControl == "7") {
			common.MEmployeeProfile2.makeListData(oController, Pernr, oController._vMasterTabs[0].id, oController._vMasterTabs[0].childControl, oController._vMasterTabs[0].merge);
		} else if(oController._vMasterTabs[0].childControl == "1") {
			common.MEmployeeProfile2.makeSubTabMenu(oController, Pernr, oController._vMasterTabs[0].id, "1");
		} else if(oController._vMasterTabs[0].childControl == "2") {
			common.MEmployeeProfile2.makeSubTabMenu(oController, oController._vSelectedPernr, oController._vMasterTabs[0].id, "2");
			common.MEmployeeProfile2.makeDataSet(oController, oController._vSelectedPernr, oController._vMasterTabs[0].id);
		}
	},
	
	makeListData : function(oController, Pernr, Menuid, MenuType, MenuMerge) {
		$("#" + oController.PAGEID + "_DataSetLayout").css("display", "none");
		$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "block");		
		
		common.MEmployeeProfile2.vTableType = MenuType;
		common.MEmployeeProfile2.vTableMenuId = Menuid;
		common.MEmployeeProfile2.vController = oController;
		
		var oDHtmlxTableToolBar = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTableToolBar");
		if(MenuType == "8") { //if(Menuid == "SHACT" || Menuid == "SHACS") {
			oDHtmlxTableToolBar.setVisible(true);
		} else {
			oDHtmlxTableToolBar.setVisible(false);
		}
		
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var addZero = function(d) {
			if(d < 10) return "0" + d;
			else return "" + d;
		};
		
		var vTableHeight = window.innerHeight - 391;
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		if(oSubTabMenuLayout.getVisible()) {
			vTableHeight = window.innerHeight - 425;
		} else {
			vTableHeight = window.innerHeight - 391;
		}
		vTableHeight = vTableHeight + 32;
		
		$("#" + oController.PAGEID + "_DHtmlxTable").css("height", vTableHeight);
		
		var IBSHeet_Locale = "";
		var vLocale = sap.ui.getCore().getConfiguration().getLanguage().toUpperCase();
		if(vLocale.indexOf("KO") != -1 || vLocale.indexOf("KR") != -1) {
			IBSHeet_Locale = "";
		} else {
			IBSHeet_Locale = "en";
		}
		if(typeof EmpolyeeProfileTable2 == "undefined") {
			createIBSheet2(document.getElementById(oController.PAGEID + "_DHtmlxTable"), "EmpolyeeProfileTable2", "100%",  (vTableHeight) + "px", IBSHeet_Locale);
		}
		
		EmpolyeeProfileTable2.Reset();
		
		EmpolyeeProfileTable2.SetTheme("TT", "TopTeam");
		
		var initdata = {};
		
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:0};
		
		initdata.Cols = [];
		
		common.MEmployeeProfile2.vTableHeader = [];
		oModel.read("/TableHeaderSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				"%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							common.MEmployeeProfile2.vTableHeader.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(common.MEmployeeProfile2.vTableHeader.length < 1) {
			return;
		}
		
		var c_w = Math.floor(100 / common.MEmployeeProfile2.vTableHeader.length);
		
		for(var i=0; i<common.MEmployeeProfile2.vTableHeader.length; i++) {
			var oneCol = {};
			oneCol.Header = common.MEmployeeProfile2.vTableHeader[i].Header;
			if(common.MEmployeeProfile2.vTableHeader[i].Fldty == "50") {
				oneCol.Type = "Img";
			} else if(common.MEmployeeProfile2.vTableHeader[i].Fldty == "80") {
				oneCol.Type = "Html";
			} else {
				oneCol.Type = "Text";
			}
			oneCol.Edit = 0;
			oneCol.Width = c_w;
			oneCol.SaveName = "Value" + addZero(i+1);
			oneCol.Align = "Left";
			
			if(MenuType == "7") {
				if(i < MenuMerge) {
					oneCol.ColMerge = 1;
				} else {
					oneCol.ColMerge = 0;
				}
			}
			initdata.Cols.push(oneCol);
		}
		
		IBS_InitSheet(EmpolyeeProfileTable2, initdata);
		EmpolyeeProfileTable2.FitColWidth();
		EmpolyeeProfileTable2.SetSelectionMode(0);
		
		EmpolyeeProfileTable2.SetCellFont("FontSize", 0, "Value01", EmpolyeeProfileTable2.HeaderRows(), EmpolyeeProfileTable2.LastCol(), 12);
		EmpolyeeProfileTable2.SetCellFont("FontName", 0, "Value01", EmpolyeeProfileTable2.HeaderRows(), EmpolyeeProfileTable2.LastCol(), "Malgun Gothic");
		EmpolyeeProfileTable2.SetCellFont("FontBold", 0, "Value01", EmpolyeeProfileTable2.HeaderRows(), EmpolyeeProfileTable2.LastCol(), 1);
		EmpolyeeProfileTable2.SetHeaderRowHeight(32);
		EmpolyeeProfileTable2.SetDataRowHeight(32);
		
		EmpolyeeProfileTable2.SetHeaderBackColor("rgb(255,255,255)");
		EmpolyeeProfileTable2.SetFocusAfterProcess(0);
		
		
		if(MenuType == "7") {
			EmpolyeeProfileTable2.SetMergeSheet(1);
		} else {
			EmpolyeeProfileTable2.SetMergeSheet(0);
		}
		
		var vPersonListData = {data : []};
		
		var vCcntr = "";
		try {
			var oConcurrentPerson = sap.ui.getCore().byId(oController.PAGEID + "_ConcurrentPerson");
			var oItem = oConcurrentPerson.getSelectedItem();
			var oCustomData = oItem.getCustomData();
			vCcntr = oCustomData[0].getValue();
		} catch(ex) {}		
		
		var oPath = "/TableContentsSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				    "%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27";
		if(vCcntr != null && vCcntr != "") {
			oPath += "%20and%20Ccntr%20eq%20%27" + vCcntr + "%27";
		}

		oModel.read(oPath, 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							vPersonListData.data.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		EmpolyeeProfileTable2.LoadSearchData(vPersonListData);		
	},
	
	onSelectMasterTabMenu : function(oEvent) {
		var vMenuId = oEvent.getParameter("menuid");
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		var oController = oCustomData[0].getValue();
		
		var vMenuControlType = "";
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			if(oController._vMasterTabs[i].id == vMenuId) {
				vMenuControlType = oController._vMasterTabs[i].childControl;
				break;
			}
		}
		
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		
		if(vMenuControlType == "5") {
			oSubTabMenuLayout.setVisible(false);
			common.MEmployeeProfile2.makeListData(oController, oController._vSelectedPernr, vMenuId);
		} else if(vMenuControlType == "1") {
			common.MEmployeeProfile2.makeSubTabMenu(oController, oController._vSelectedPernr, vMenuId, "1");
		} else if(vMenuControlType == "2") {
			common.MEmployeeProfile2.makeSubTabMenu(oController, oController._vSelectedPernr, vMenuId, "2");
			common.MEmployeeProfile2.makeDataSet(oController, oController._vSelectedPernr, vMenuId);
		}
		
	},
	
	makeDataSet : function(oController, Pernr, MenuId) {
		var oDataSetLayout = sap.ui.getCore().byId(oController.PAGEID + "_DataSetLayout");
		oDataSetLayout.destroyContent();
		
		var oDHtmlxTableToolBar = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTableToolBar");
		oDHtmlxTableToolBar.setVisible(false);
		
		$("#" + oController.PAGEID + "_DataSetLayout").css("display", "block");
		$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "none");		
		
		var vTableHeight = window.innerHeight - 391;
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		if(oSubTabMenuLayout.getVisible()) {
			vTableHeight = window.innerHeight - 425;
		} else {
			vTableHeight = window.innerHeight - 391;
		}
		vTableHeight = vTableHeight + 32;
		oDataSetLayout.setHeight((vTableHeight) + "px");
		
		var oDataSet = new control.L2PDataSet({
			pageId : oController.PAGEID,
			menuId : MenuId,
			subMenus : oController._vSubTabs,
			pernr : Pernr
		}).setModel(sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV"));
		
		oDataSetLayout.addContent(oDataSet);
	},
	
	makeSubTabMenu : function(oController, Pernr, MenuId, vMenuControlType) {
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		oSubTabMenuLayout.destroyContent();
		oSubTabMenuLayout.setVisible(true);
		
		var vItemIds = [];
		var vItemLebels = [];
		var idx = 0;
		var vFirstMenuId = "";
		var vFirstType = "";
		var vFirstMerge = "";
		for(var i=0; i<oController._vSubTabs.length; i++) {
			if(oController._vSubTabs[i].parent == MenuId) {
				if(idx == 0) {
					vFirstMenuId = oController._vSubTabs[i].id;
					vFirstType = oController._vSubTabs[i].childControl;
					vFirstMerge = oController._vSubTabs[i].merge;
				}
				vItemIds.push(oController._vSubTabs[i].id);
				vItemLebels.push(oController._vSubTabs[i].label);
				idx++;
			}
		}
		
		var vParentIdx = 0;
		for(var i=0; i<oController._vMasterTabs.length; i++) {
			if(oController._vMasterTabs[i].id == MenuId) {
				vParentIdx = (i+1);
				break;
			}
		}
		
		var oSubTabLayout = new control.L2PTab({
			cssPath : "/sap/bc/ui5_ui5/sap/ZL2P01UI59000/css/",
			height : 30,
			itemIds : vItemIds,
			itemLabels : vItemLebels,
			selectedKey : vFirstMenuId,
			secondMenu : true,
			parentMenuCount : oController._vMasterTabs.length,
			selectParentIdx : vParentIdx,
			bgColor : "#FFFFFF",
			select : common.MEmployeeProfile2.onSelectSubTabMenu
		});
		oSubTabLayout.addCustomData(new sap.ui.core.CustomData({key:"oController", value : oController}));
		
		oSubTabMenuLayout.addContent(oSubTabLayout);
		
		if(vMenuControlType == "1") common.MEmployeeProfile2.makeListData(oController, Pernr, vFirstMenuId, vFirstType, vFirstMerge);
	},
	
	onSelectSubTabMenu : function(oEvent) {
		var vMenuId = oEvent.getParameter("menuid");
		
		var oControl = oEvent.getSource();
		var oCustomData = oControl.getCustomData();
		var oController = oCustomData[0].getValue();
		
		var vMenuControlType = "";
		var vMenuMerge = 0;
		for(var i=0; i<oController._vSubTabs.length; i++) {
			if(oController._vSubTabs[i].id == vMenuId) {
				vMenuControlType = oController._vSubTabs[i].childControl;
				vMenuMerge = oController._vSubTabs[i].merge;
				break;
			}
		}
		
		var oDHtmlxTableToolBar = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTableToolBar");
		
		if(vMenuControlType == "5" || vMenuControlType == "7" || vMenuControlType == "8") {
			common.MEmployeeProfile2.makeListData(oController, oController._vSelectedPernr, vMenuId, vMenuControlType, vMenuMerge);
			document.location.href = "#" + oController.PAGEID + "_DHtmlxTable";
		} else if(vMenuControlType == "6") {
			$("#" + oController.PAGEID + "_DataSetLayout").css("display", "block");
			$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "none");
			oDHtmlxTableToolBar.setVisible(false);
			document.location.href = "#" + oController.PAGEID + "_" + vMenuId;
		}
	},	
};

function EmpolyeeProfileTable2_OnSearchEnd(result) {
	if(common.MEmployeeProfile2.vTableType != "8") {
		for(var i=0; i<common.MEmployeeProfile2.vTableHeader.length; i++) {
			if(common.MEmployeeProfile2.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile2.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable2.SetColWidth(i, parseInt(common.MEmployeeProfile2.vTableHeader[i].Width));
			}
		}
		
		EmpolyeeProfileTable2.FitColWidth();
	} else {
		EmpolyeeProfileTable2.FitSize(1, 1);
		
		for(var i=0; i<common.MEmployeeProfile2.vTableHeader.length; i++) {
			if(common.MEmployeeProfile2.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile2.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable2.SetColWidth(i, parseInt(common.MEmployeeProfile2.vTableHeader[i].Width));
			}
		}
	}
	
	EmpolyeeProfileTable2.SetCellFont("FontSize", EmpolyeeProfileTable2.HeaderRows(), "Value01", EmpolyeeProfileTable2.RowCount() + EmpolyeeProfileTable2.HeaderRows(), EmpolyeeProfileTable2.LastCol(), 12);
	EmpolyeeProfileTable2.SetCellFont("FontName", EmpolyeeProfileTable2.HeaderRows(), "Value01", EmpolyeeProfileTable2.RowCount() + EmpolyeeProfileTable2.HeaderRows(), EmpolyeeProfileTable2.LastCol(), "Malgun Gothic");
}

function EmpolyeeProfileTable2_OnSmartResize(Width, Height) {
	console.log("Type31 : " + common.MEmployeeProfile2.vTableType);
	if(common.MEmployeeProfile2.vTableType != "8") {
		for(var i=0; i<common.MEmployeeProfile2.vTableHeader.length; i++) {
			if(common.MEmployeeProfile2.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile2.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable2.SetColWidth(i, parseInt(common.MEmployeeProfile2.vTableHeader[i].Width));
			}
		}
		
		EmpolyeeProfileTable2.FitColWidth();
	} else {
		EmpolyeeProfileTable2.FitSize(1, 1);
		
		for(var i=0; i<common.MEmployeeProfile2.vTableHeader.length; i++) {
			if(common.MEmployeeProfile2.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile2.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable2.SetColWidth(i, parseInt(common.MEmployeeProfile2.vTableHeader[i].Width));
			}
		}
	}
}
