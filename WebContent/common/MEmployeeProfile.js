jQuery.sap.declare("common.MEmployeeProfile");
jQuery.sap.require("control.L2PTab");
jQuery.sap.require("control.L2PDataSet");
jQuery.sap.require("control.L2PEmpBasic");

common.MEmployeeProfile = {
	/** 
	* @memberOf common.MEmployeeProfile
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
			select : common.MEmployeeProfile.onSelectMasterTabMenu,
			bgColor : "#53abe6",
			height : 30
		});		
		oMasterTabLayout.addCustomData(new sap.ui.core.CustomData({key:"oController", value : oController}));
		
		oMasterTabMenuLayout.addContent(oMasterTabLayout);
		
		if(oController._vMasterTabs[0].childControl == "5" || oController._vMasterTabs[0].childControl == "7") {
			common.MEmployeeProfile.makeListData(oController, Pernr, oController._vMasterTabs[0].id, oController._vMasterTabs[0].childControl, oController._vMasterTabs[0].merge);
		} else if(oController._vMasterTabs[0].childControl == "1") {
			common.MEmployeeProfile.makeSubTabMenu(oController, Pernr, oController._vMasterTabs[0].id, "1");
		} else if(oController._vMasterTabs[0].childControl == "2") {
			common.MEmployeeProfile.makeSubTabMenu(oController, oController._vSelectedPernr, oController._vMasterTabs[0].id, "2");
			common.MEmployeeProfile.makeDataSet(oController, oController._vSelectedPernr, oController._vMasterTabs[0].id);
		}
		common.MEmployeeProfile.getRelatedLin(oController, Pernr, oController._vMasterTabs[0].id);
	},
	
	makeListData : function(oController, Pernr, Menuid, MenuType, MenuMerge) {
		$("#" + oController.PAGEID + "_DataSetLayout").css("display", "none");
		$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "block");	
		
		common.MEmployeeProfile.vTableType = MenuType;
		common.MEmployeeProfile.vTableMenuId = Menuid;
		common.MEmployeeProfile.vController = oController;
		
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
		
		var vTableHeight = window.innerHeight - 386;

		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		if(oSubTabMenuLayout.getVisible()) {
			vTableHeight = window.innerHeight - 420;
		} else {
			vTableHeight = window.innerHeight - 386;
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
		
		createIBSheet2(document.getElementById(oController.PAGEID + "_DHtmlxTable"), "EmpolyeeProfileTable", "100%",  (vTableHeight) + "px", IBSHeet_Locale);
		
		EmpolyeeProfileTable.Reset();
		
		EmpolyeeProfileTable.SetTheme("TT", "TopTeam");
		
		var initdata = {};
		
		initdata.HeaderMode = {Sort:0,ColMove:0,ColResize:1,HeaderCheck:0};
		
		initdata.Cols = [];
		
		common.MEmployeeProfile.vTableHeader = [];
		oModel.read("/TableHeaderSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
				"%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27", 
				null, 
				null, 
				false,
				function(oData, oResponse) {					
					if(oData && oData.results.length) {
						for(var i=0; i<oData.results.length; i++) {
							common.MEmployeeProfile.vTableHeader.push(oData.results[i]);
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
		
		if(common.MEmployeeProfile.vTableHeader.length < 1) {
			return;
		}
		
		var c_w = Math.floor(100 / common.MEmployeeProfile.vTableHeader.length);
		
		for(var i=0; i<common.MEmployeeProfile.vTableHeader.length; i++) {
			var oneCol = {};
			oneCol.Header = common.MEmployeeProfile.vTableHeader[i].Header;
			if(common.MEmployeeProfile.vTableHeader[i].Fldty == "50") {
				oneCol.Type = "Img";
			} else if(common.MEmployeeProfile.vTableHeader[i].Fldty == "80") {
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
		
		IBS_InitSheet(EmpolyeeProfileTable, initdata);
		EmpolyeeProfileTable.FitColWidth();
		EmpolyeeProfileTable.SetSelectionMode(0);
		
		EmpolyeeProfileTable.SetCellFont("FontSize", 0, "Value01", EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), 12);
		EmpolyeeProfileTable.SetCellFont("FontName", 0, "Value01", EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), "Malgun Gothic");
		EmpolyeeProfileTable.SetCellFont("FontBold", 0, "Value01", EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), 1);
		EmpolyeeProfileTable.SetHeaderRowHeight(32);
		EmpolyeeProfileTable.SetDataRowHeight(32);
		
		EmpolyeeProfileTable.SetHeaderBackColor("rgb(255,255,255)");
		EmpolyeeProfileTable.SetFocusAfterProcess(0);
		
		
		if(MenuType == "7") {
			EmpolyeeProfileTable.SetMergeSheet(1);
		} else {
			EmpolyeeProfileTable.SetMergeSheet(0);
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
		EmpolyeeProfileTable.LoadSearchData(vPersonListData);
	},
	
	getRelatedLin : function(oController, Pernr, Menuid) {
		var oModel = sap.ui.getCore().getModel("ZHRXX_EMP_PROFILE_SRV");
		
		var vScreenType = "";
		if(oController._vSCreenType == "ess") {
			vScreenType = "E";
		} else if(oController._vSCreenType == "mss") {
			vScreenType = "M";
		} else if(oController._vSCreenType == "hass") {
			vScreenType = "H";
		} else if(oController._vSCreenType == "gass") {
			vScreenType = "G";
		} else if(oController._vSCreenType == "top") {
			vScreenType = "T";
		}   
		
		var oSModifyBtn = sap.ui.getCore().byId(oController.PAGEID + "_ModifyBtn");
		if(oSModifyBtn) {
			oController.oActionSheet = null;
			
			var vActionSheets = [];
			oModel.read("/RelatedLinkSet/?$filter=Pernr%20eq%20%27" + Pernr + "%27" +
					"%20and%20Usrty%20eq%20%27" + vScreenType + "%27" +
					"%20and%20Menuc%20eq%20%27" + Menuid.substring(1) + "%27", 
					null, 
					null, 
					false,
					function(oData, oResponse) {					
						if(oData && oData.results.length) {
							for(var i=0; i<oData.results.length; i++) {
								vActionSheets.push(oData.results[i]);
							}
						}
					},
					function(oResponse) {
						common.Common.log(oResponse);
					}
			);
			
			if(vActionSheets.length < 1) {
				oSModifyBtn.setVisible(false);
			} else {
				oController.oActionSheet = new sap.m.ActionSheet({
					title : "",
					placement : "Top"
				});
				oController.oActionSheet.destroyButtons();
				
				for(var i=0; i<vActionSheets.length; i++) {
					oController.oActionSheet.addButton(
						new sap.m.Button({
							text : vActionSheets[i].Utitltx,
							customData : {key : "Url", value : vActionSheets[i].Url},
							press : common.MEmployeeProfile.onPressActionSheet
						})
					);
				}
				oSModifyBtn.setVisible(true);
			}
		}
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
			common.MEmployeeProfile.makeListData(oController, oController._vSelectedPernr, vMenuId);
		} else if(vMenuControlType == "1") {
			common.MEmployeeProfile.makeSubTabMenu(oController, oController._vSelectedPernr, vMenuId, "1");
		} else if(vMenuControlType == "2") {
			common.MEmployeeProfile.makeSubTabMenu(oController, oController._vSelectedPernr, vMenuId, "2");
			common.MEmployeeProfile.makeDataSet(oController, oController._vSelectedPernr, vMenuId);
		}
		
		common.MEmployeeProfile.getRelatedLin(oController, oController._vSelectedPernr, vMenuId);		
	},
	
	makeDataSet : function(oController, Pernr, MenuId) {
		var oDataSetLayout = sap.ui.getCore().byId(oController.PAGEID + "_DataSetLayout");
		oDataSetLayout.destroyContent();
		
		var oDHtmlxTableToolBar = sap.ui.getCore().byId(oController.PAGEID + "_DHtmlxTableToolBar");
		oDHtmlxTableToolBar.setVisible(false);
		
		$("#" + oController.PAGEID + "_DataSetLayout").css("display", "block");
		$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "none");
		
		
		var vTableHeight = window.innerHeight - 386;
		var oSubTabMenuLayout = sap.ui.getCore().byId(oController.PAGEID + "_SubTabMenuLayout");
		if(oSubTabMenuLayout.getVisible()) {
			vTableHeight = window.innerHeight - 420;
		} else {
			vTableHeight = window.innerHeight - 386;
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
			select : common.MEmployeeProfile.onSelectSubTabMenu
		});
		oSubTabLayout.addCustomData(new sap.ui.core.CustomData({key:"oController", value : oController}));
		
		oSubTabMenuLayout.addContent(oSubTabLayout);
		
		if(vMenuControlType == "1") common.MEmployeeProfile.makeListData(oController, Pernr, vFirstMenuId, vFirstType, vFirstMerge);
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
		
		if(vMenuControlType == "5" || vMenuControlType == "7" || vMenuControlType == "8") {
			common.MEmployeeProfile.makeListData(oController, oController._vSelectedPernr, vMenuId, vMenuControlType, vMenuMerge);
			document.location.href = "#" + oController.PAGEID + "_DHtmlxTable";
		} else if(vMenuControlType == "6") {
			$("#" + oController.PAGEID + "_DataSetLayout").css("display", "block");
			$("#" + oController.PAGEID + "_DHtmlxTable").css("display", "none");
			try {
				document.location.href = "#" + oController.PAGEID + "_" + vMenuId;	
			} catch(ex) {
				
			}
		}
	},
	
	onPressActionSheet : function(oEvent) {
		var oButton = oEvent.getSource();
		
		var oCustomData = oButton.getCustomData();
		var vUrl = "";
		for(var i=0; i<oCustomData.length; i++) {
			if(oCustomData[i].getKey() == "Url") {
				vUrl = oCustomData[i].getValue();
			}
		}
		
		if(vUrl != "") {
			if(vUrl.indexOf("http") == -1) {
				window.open("http://" + vUrl);
			} else {
				window.open(vUrl);
			}
		}
	},
	
};

function EmpolyeeProfileTable_OnSearchEnd(result) {
	if(common.MEmployeeProfile.vTableType != "8") {
		for(var i=0; i<common.MEmployeeProfile.vTableHeader.length; i++) {
			if(common.MEmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.MEmployeeProfile.vTableHeader[i].Width));
			}
		}
		
		EmpolyeeProfileTable.FitColWidth();
	} else {
		EmpolyeeProfileTable.FitSize(1, 1);
		
		for(var i=0; i<common.MEmployeeProfile.vTableHeader.length; i++) {
			if(common.MEmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.MEmployeeProfile.vTableHeader[i].Width));
			}
		}
	}	
	
	EmpolyeeProfileTable.SetCellFont("FontSize", EmpolyeeProfileTable.HeaderRows(), "Value01", EmpolyeeProfileTable.RowCount() + EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), 12);
	EmpolyeeProfileTable.SetCellFont("FontName", EmpolyeeProfileTable.HeaderRows(), "Value01", EmpolyeeProfileTable.RowCount() + EmpolyeeProfileTable.HeaderRows(), EmpolyeeProfileTable.LastCol(), "Malgun Gothic");
}

function EmpolyeeProfileTable_OnSmartResize(Width, Height) {
	if(common.MEmployeeProfile.vTableType != "8") {
		for(var i=0; i<common.MEmployeeProfile.vTableHeader.length; i++) {
			if(common.MEmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.MEmployeeProfile.vTableHeader[i].Width));
			}
		}
		
		EmpolyeeProfileTable.FitColWidth();
	} else {
		EmpolyeeProfileTable.FitSize(1, 1);
		
		for(var i=0; i<common.MEmployeeProfile.vTableHeader.length; i++) {
			if(common.MEmployeeProfile.vTableHeader[i].Width != "" && parseInt(common.MEmployeeProfile.vTableHeader[i].Width) > 0) {
				EmpolyeeProfileTable.SetColWidth(i, parseInt(common.MEmployeeProfile.vTableHeader[i].Width));
			}
		}
	}	
}