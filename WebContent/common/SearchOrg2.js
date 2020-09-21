jQuery.sap.declare("common.SearchOrg");
jQuery.sap.require("common.Common");

var OrgTree = null;

/** 
* ����˻��� Dialog�� ���� JS �̴�.
* @Create By ����
*/

common.SearchOrg = {
	/** 
	* @memberOf common.SearchOrg
	*/	
	
	oController : null,
	vActionType : "Multi",
	vCallControlId : "",
	vCallControlType : "MultiInput",
	vNoPersa : false,
	
	handleIconTabBarSelect : function(oEvent) {
		
	    var sKey = oEvent.getParameter("selectedKey");
		
	    if (sKey === "2") {	    	
			common.SearchOrg.createOrgTree();
	    }
	    
	    var oTreeButtonBar = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_SetpSearch");
	    if (sKey === "1") {
	    	oTreeButtonBar.setVisible(false);
	    } else {
	    	oTreeButtonBar.setVisible(true);
	    }
	},

	/*
	 * dhtmlXTreeObject �� �̿��Ͽ� ������ Tree�� �����Ѵ�.
	 * "OrgehTree" EntitySet�� Read�Ͽ� ������ ���� Tree�� �����ϰ�
	 * ������ Ŭ���ϸ� "PernrInfo" EntitySet�� Read�Ͽ� ���ۿ� ���� ��� Tree�� �����Ѵ�.
	 */
	createOrgTree : function() {
		OrgTree = new dhtmlXTreeObject(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_OrgTree", "100%", "100%", 0);

		OrgTree.setSkin('dhx_skyblue');
		OrgTree.setImagePath("/sap/bc/ui5_ui5/sap/ZL2P01UI59000/css/imgs/dhxtree_skyblue/");
		
		if(common.SearchOrg.vActionType == "Single") {
			OrgTree.enableRadioButtons(true);
			OrgTree.enableSingleRadioMode(true);
			OrgTree.attachEvent("onDblClick", function(id){
			    OrgTree.setCheck(id, 1);
			    common.SearchOrg.onConfirm();
			});
			OrgTree.attachEvent("onSelect", function(id){
			    OrgTree.setCheck(id, 1);
			});
		} else {
			OrgTree.enableCheckBoxes(true);
		}
		
		//���� ��ü �����͸� �����ͼ� Tree�� �����Ѵ�.
		var vStype = "2";
		var vPersa = common.SearchOrg.oController._vPersa;
		var vDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum").getValue();
		
		var oPath = "/OrgListSet/?$filter=Stype%20eq%20%27" + vStype + "%27" 
		          + "%20and%20Datum%20eq%20datetime%27" + vDatum + "T00%3a00%3a00%27";
		
		if(common.SearchOrg.vNoPersa == false) oPath += "%20and%20Persa%20eq%20%27" + vPersa + "%27";
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		oModel.read (oPath,
				null, 
				null, 
				false, 
				function(oData, oResponse) {
					var i;
					if(oData) {
						for(i=0; i<oData.results.length; i++) {
							var vChiefName = "";
							if(oData.results[i].EnameM != null && oData.results[i].EnameM != "") {
								vChiefName = " <font color='blue'>(" + oData.results[i].PernrM + " " + oData.results[i].EnameM + ")</font>";
							}
							if(oData.results[i].OrgehUp === "00000000") {
								OrgTree.insertNewItem("0", oData.results[i].Orgeh, oData.results[i].Stext + vChiefName);
								OrgTree.showItemCheckbox(oData.results[i].Orgeh, true);
								OrgTree.setUserData(oData.results[i].Orgeh, "Zzempwp", oData.results[i].Zzempwp);
								OrgTree.setUserData(oData.results[i].Orgeh, "Zzempwptx", oData.results[i].Zzempwptx);
								OrgTree.setItemStyle(oData.results[i].Orgeh, "font-size:13px;font-family: 'Malgun Gothic'");
							} else {
								OrgTree.insertNewChild(oData.results[i].OrgehUp, oData.results[i].Orgeh, oData.results[i].Stext + vChiefName);
								OrgTree.showItemCheckbox(oData.results[i].Orgeh, true);
								OrgTree.setUserData(oData.results[i].Orgeh, "Zzempwp", oData.results[i].Zzempwp);
								OrgTree.setUserData(oData.results[i].Orgeh, "Zzempwptx", oData.results[i].Zzempwptx);
								OrgTree.setItemStyle(oData.results[i].Orgeh, "font-size:13px;font-family: 'Malgun Gothic'");
							}
						}
						
						for(i=0; i<oData.results.length; i++) {
							var nodeid = oData.results[i].Orgeh;
							if(parseInt(oData.results[i].Level) > 2) {
								OrgTree.closeItem(nodeid);
							}
						}
					}
				},
				function(oResponse) {
					common.Common.log(oResponse);
				}
		);
	},
	
	/*
	 * �˻�� �̿��Ͽ� ����� �˼� ó��
	 * �˻� ����� ���� �� ������̴�.
	 */
	searchOrg : function(oEvent) {
		
		var oIconTabbar = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_ICONTABBAR");
		var vSelectedTabKey = oIconTabbar.getSelectedKey();
		
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		
		if(oStext.getValue() == "") {
			var vMsg = "&Cntl 를(을) 입력해 주시기 바랍니다.";
			vMsg = vMsg.replace("&Cntl", "검색어");
			sap.m.MessageBox.alert(vMsg);
			return;
		}
		
		var vPersa = common.SearchOrg.oController._vPersa;
		var vStype = "1";
		if(common.SearchOrg.vCallControlId.indexOf("Host_orgeh") > 0) {
			var oHost_werks = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_Host_werks");
			if(oHost_werks) {
				try {
					vPersa = oHost_werks.getSelectedKey();
				} catch(ex) {
					var oCustomData = oHost_werks.getCustomData();
					vPersa = oCustomData[0].getValue();
				}
			}
			vStype = "3";
			common.SearchOrg.vNoPersa = false;
		}
		
		if(vSelectedTabKey == "1") {
			oFilters.push(new sap.ui.model.Filter("Stype", sap.ui.model.FilterOperator.EQ, vStype));
			
			if(vPersa != "" && common.SearchOrg.vNoPersa == false) {
				oFilters.push(new sap.ui.model.Filter("Persa", sap.ui.model.FilterOperator.EQ, vPersa));
			}
			
			if(oDatum.getValue() != "") {
				oFilters.push(new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
			}
			
			if(oStext.getValue() != "") {
				oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, (oStext.getValue())));
			}
			
			var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
			var oColumnList = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_COLUMNLIST");
			
			oTable.bindItems("/OrgListSet", oColumnList, null, oFilters);
		} else {	
			if(oStext.getValue() != "") {
				OrgTree.findItem(oStext.getValue(), 0, 1);
				
				var oNextBtn = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_NextButton");
				var oPrevBtn = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_PrevButton");
				oNextBtn.setEnabled(true);
				oPrevBtn.setEnabled(true);
			}
		}	
	},
	
	searchOrgNext : function(oEvent) {
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		if(oStext.getValue() != "") {
			OrgTree.findItem(oStext.getValue(), 0);
		}
	},
	
	searchOrgPrev : function(oEvent) {
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		if(oStext.getValue() != "") {
			OrgTree.findItem(oStext.getValue(), 1);
		}
	},
	
	/*
	 * ����˻� Dialog�� Close�Ѵ�.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog");
		if(oDialog) oDialog.close();
	},
	
	/*
	 * �˻�� �Է��ϰ� Enter Ű�� Ŭ�������� ó���ϴ� ����
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchOrg.searchOrg();
		}
	},
	
	/*
	 * �˻�ȭ��ּ� ���õ� ����� ���� ó���ϴ� �����̴�.
	 * ���õ� ��������� ������ "SelectPerson" Event�� �߻��Ѵ�.
	 */
	onConfirm : function(oEvent) {
		var oIconTabBar = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_ICONTABBAR");
		var TABID = oIconTabBar.getSelectedKey();
		var vSelectedOrg = [];
		
		
		//���� Tree���� ���õ� ���
		if(TABID == "2") {
			var checked_nodes_str =	OrgTree.getAllChecked();
			if(checked_nodes_str != "") {			
				var checked_nodes = checked_nodes_str.split(",");
				for(var i=0; i<checked_nodes.length; i++) {
					var vStext = OrgTree.getItemText(checked_nodes[i]);
					var pos1 = vStext.indexOf("<f");
					if(pos1 > 0) vStext = vStext.substring(0, pos1);
					
					var vOrgInfo = {};
					vOrgInfo.Orgeh = checked_nodes[i];
					vOrgInfo.Stext = vStext.replace("&amp;", "&");
					vOrgInfo.Zzempwp = OrgTree.getUserData(checked_nodes[i], "Zzempwp");
					vOrgInfo.Zzempwptx = OrgTree.getUserData(checked_nodes[i], "Zzempwptx");
					
					vSelectedOrg.push(vOrgInfo);
				}
			} else {
				sap.m.MessageBox.alert("부서를 선택해 주시기 바랍니다.");
				return;
			}
		//�˻��� �� ������ ���
		} else if(TABID == "1") {
			var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
			var vContexts = oTable.getSelectedContexts(true);
			
			if(vContexts && vContexts.length) {
				for(var i=0; i<vContexts.length; i++) {
					var vOrgInfo = {};
					vOrgInfo.Orgeh = vContexts[i].getProperty("Orgeh");
					vOrgInfo.Stext = vContexts[i].getProperty("Stext");
					vOrgInfo.Zzempwp = vContexts[i].getProperty("Zzempwp");
					vOrgInfo.Zzempwptx = vContexts[i].getProperty("Zzempwptx");
					
					vSelectedOrg.push(vOrgInfo);
				}				
			} else {
				sap.m.MessageBox.alert("부서를 선택해 주시기 바랍니다.");
				return;
			}
		}
		
		if(common.SearchOrg.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
			if(oMultiInput) {
				for(var i=0; i<vSelectedOrg.length; i++) {
					oMultiInput.addToken(new sap.m.Token({
						key : vSelectedOrg[i].Orgeh,
						text : vSelectedOrg[i].Stext
					}));
				}
			}
		} else if(common.SearchOrg.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchOrg.vCallControlId);
			if(oInput) {
				if(vSelectedOrg && vSelectedOrg.length) {
					oInput.setValue(vSelectedOrg[0].Stext);
					oInput.removeAllCustomData();
					oInput.addCustomData(new sap.ui.core.CustomData({key : "Orgeh", value : vSelectedOrg[0].Orgeh}));
				}
			}
			
			var vTempIds = common.SearchOrg.vCallControlId.split("_");
			var vPrefix = "";
			for(var i=0; i<(vTempIds.length - 1); i++) {
				vPrefix += vTempIds[i] + "_";
			}
			
			vPrefix = vPrefix.replace("Dis_", "");
			
			var oControl = sap.ui.getCore().byId(vPrefix + "Zzempwp");
			if(oControl) {				
				var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
				var vDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum").getValue();
				var vZzempwp = "";
				var vZzempwptx = "";
				oModel.read (
						"/OrgWorkplaceSet/?$filter=Orgeh%20eq%20%27" + vSelectedOrg[0].Orgeh + "%27" 
						+ "%20and%20Datum%20eq%20datetime%27" + vDatum + "T00%3a00%3a00%27",
						null, 
						null, 
						false, 
						function(oData, oResponse) {
							if(oData && oData.results.length) {
								vZzempwp = oData.results[0].Objid;
								vZzempwptx = oData.results[0].Stext;
							}
						},
						function(oResponse) {
							common.Common.log(oResponse);
						}
				);
				if(vZzempwp != null && vZzempwp != ""){
					if(typeof oControl.setSelectedKey == "function") {
						oControl.setSelectedKey(vZzempwp);
					} else if(typeof oControl.setValue == "function") {
						oControl.setValue(vZzempwptx);
						var oCustomData = oControl.getCustomData();
						if(oCustomData) {
							oControl.removeAllCustomData();
				    		oControl.destroyCustomData();
							oControl.addCustomData(new sap.ui.core.CustomData({
								key : "Zzempwp",
								value : vZzempwp
							}));
							for(var i=1; i<oCustomData.length; i++) {
					    		oControl.addCustomData(oCustomData[i]);
					    	}
						}
					} 
				}
			}
		}
		
		
		//�����˻� Dialog�� Close�Ѵ�.
		var oDialog = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenSearchOrgDialog : function(oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Stext");
		var oIconTabbar = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_ICONTABBAR");
		var oIconTabbarKey2 = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_ICONTABBAR_KEY2");
		
		var oDatum = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_COMMON_SEARCH_ORG_Datum");
		if(common.SearchOrg.oController._vActda != null) {
			oDatum.setValue(common.SearchOrg.oController._vActda);
		}
		
		if(common.SearchOrg.vActionType == "Single") {
			oTable.setMode(sap.m.ListMode.SingleSelectLeft);
		} else {
			oTable.setMode(sap.m.ListMode.MultiSelect );
		}
		oTable.unbindItems();
		oStext.setValue("");
		var sKey = oIconTabbar.getSelectedKey();
		if(sKey != "1")
			oIconTabbar.setSelectedKey("1");
		oIconTabbarKey2.setVisible(true);
		
		if(common.SearchOrg.vCallControlId.indexOf("Host_orgeh") > 0) {
			oIconTabbarKey2.setVisible(false);
			if(sKey != "1")
				oIconTabbar.setSelectedKey("1");
		}
	},
	
	onAfterOpenSearchOrgDialog : function(oEvent) {
		if(common.SearchOrg.vCallControlId.indexOf("Host_orgeh") > 0) {
			var oHost_werks = sap.ui.getCore().byId(common.SearchOrg.oController.PAGEID + "_Host_werks");
			console.log(oHost_werks.mProperties.showValueHelp);
			if(oHost_werks) {
				if(oHost_werks.mProperties.showValueHelp) {
					if(oHost_werks.getValue() == "") {
						sap.m.MessageBox.alert("Host 회사를 선택하신 후 소속을 선택바랍니다.", {
							onClose : function() {
								common.SearchOrg.onClose();
								return;
							}
						});					
					}
				} else {
					if(oHost_werks.getSelectedKey() == "" || oHost_werks.getSelectedKey() == "0000") {
						sap.m.MessageBox.alert("Host 회사를 선택하신 후 소속을 선택바랍니다.", {
							onClose : function() {
								common.SearchOrg.onClose();
								return;
							}
						});					
					}
				}
				
			} else {
				sap.m.MessageBox.alert("Host 회사를 선택하신 후 소속을 선택바랍니다.", {
					onClose : function() {
						common.SearchOrg.onClose();
						return;
					}
				});
			}
			
		}
	},
	
	onAfterCloseSearchOrgDialog : function(oEvent) {
		common.SearchOrg.vNoPersa = false;
	}
	
};