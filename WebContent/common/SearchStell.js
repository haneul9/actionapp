jQuery.sap.declare("common.SearchStell");
jQuery.sap.require("common.Common");

var StellTree = null;
var StellTreePer = null;

/** 
* 직무검색의 Dialog를 위한 JS 이다.
* @Create By 정명구
*/

common.SearchStell = {
	/** 
	* @memberOf common.SearchStell
	*/	
	
	oController : null,
	vActionType : "Multi",
	vCallControlId : "",
	vCallControlType : "MultiInput",
	
	/*
	 * 검색어를 이용하여 직무를 검색
	 * 검색 대상은 직무명 이다.
	 */
	searchStell : function(oEvent) {
		
		var oFilters = [];
		
		var oDatum = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum");
		var oStext = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");
		
		var vPersa = common.SearchStell.oController._vPersa;
		var oMultiInput = sap.ui.getCore().byId(common.SearchStell.vCallControlId);
		
		var filterString = "?$filter=Stype eq '1'" ;
		var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-dd"});
		
		if(oDatum.getValue() != "") {
			filterString += " and Datum%20eq%20datetime%27" + dateFormat.format(new Date(oDatum.getValue()))  + "T00%3a00%3a00%27";
			oFilters.push(new sap.ui.model.Filter("Datum", sap.ui.model.FilterOperator.EQ, oDatum.getValue()));
		}
		
		if(oStext.getValue() != "") {
			filterString += " and Stext eq '" + encodeURIComponent(oStext.getValue()) + "'";
			oFilters.push(new sap.ui.model.Filter("Stext", sap.ui.model.FilterOperator.EQ, (oStext.getValue())));
		}
		
		var oTable = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		
		var _JSonModel =  oTable.getModel();
		var vDatas = { JoblistSet : []}
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		var oPath = "/JoblistSet" +filterString;
		oModel.read(
				oPath,
				null,
				null,
				false,
				function(data,res){
					if(data && data.results.length){
						for(var i=0;i<data.results.length;i++){
							vDatas.JoblistSet.push(data.results[i]);
						}
					}
				},
				function(res){console.log(res);}
		);	
		
		_JSonModel.setData(vDatas);
		oTable.setModel(_JSonModel);
		oTable.bindRows("/JoblistSet");

		
	},
	
	
	/*
	 * 직무검색 Dialog를 Close한다.
	 */
	onClose : function(oEvent) {
		var oDialog = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog");
		if(oDialog) oDialog.close();
	},
	
	/*
	 * 검색어를 입력하고 Enter 키를 클릭했을때 처리하는 내용
	 */
	onKeyUp : function(oEvent) {
		if(oEvent.which == 13) {
			common.SearchStell.searchStell();
		}
	},
	
	/*
	 * 검색화면애서 선택된 사원에 대해 처리하는 내용이다.
	 * 선택된 사원정보를 가지고 "SelectPerson" Event를 발생한다.
	 */
	onConfirm : function(oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		var oModel = oTable.getModel();
		var vContexts = oTable.getSelectedIndices();
		var vSelectedStell = [];
		
		if(vContexts && vContexts.length) {
			for(var i=0; i<vContexts.length; i++) {
				var _selPath = oTable.getContextByIndex(vContexts[i]).sPath;
				var vStellInfo = {};
				vStellInfo.Stell = oModel.getProperty(_selPath +"/Stell");
				vStellInfo.Stext = oModel.getProperty(_selPath +"/Stext"); 
				
				vSelectedStell.push(vStellInfo);
			}				
		} else {
			sap.m.MessageBox.alert("직무를 선택해 주시기 바랍니다.");
			return;
		}
	
		
		if(common.SearchStell.vCallControlType == "MultiInput") {
			var oMultiInput = sap.ui.getCore().byId(common.SearchStell.vCallControlId);
			if(oMultiInput) {
				for(var i=0; i<vSelectedStell.length; i++) {
					oMultiInput.addToken(new sap.m.Token({
						key : vSelectedStell[i].Stell,
						text : vSelectedStell[i].Stext,
						editable  : false
					}));
				}
			}
		} else if(common.SearchStell.vCallControlType == "Input") {
			var oInput = sap.ui.getCore().byId(common.SearchStell.vCallControlId);
			if(oInput) {
				if(vSelectedStell && vSelectedStell.length) {
					oInput.setValue(vSelectedStell[0].Stext);
					oInput.removeAllCustomData();
					var vTmp = common.SearchStell.vCallControlId.split("_");
					//var vTmpId = vTmp[vTmp.length - 1];
					var vTmpId = common.SearchStell.vCallControlId.replace(vTmp[0]+ "_", "");
					/*
					 *  2015-07-16 직무 선택시 Main , Sub 직무를 Control에 추가
					 */
					oInput.addCustomData(new sap.ui.core.CustomData({key : vTmpId, value : vSelectedStell[0].Stell}));
					oInput.addCustomData(new sap.ui.core.CustomData({key : "Subjftx", value : vSelectedStell[0].SubStext}));
					oInput.addCustomData(new sap.ui.core.CustomData({key : "Manjftx", value : vSelectedStell[0].MainStext}));
				}
			}
		}
		
		
		//직무검색 Dialog를 Close한다.
		var oDialog = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Dialog");
		if(oDialog) oDialog.close();
	},
	
	onBeforeOpenSearchStellDialog : function(oEvent) {
		var oTable = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_TABLE");
		var oStext = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Stext");
		
		var oDatum = sap.ui.getCore().byId(common.SearchStell.oController.PAGEID + "_COMMON_SEARCH_STELL_Datum");
		if(common.SearchStell.oController._vActda != null) {
			oDatum.setValue(common.SearchStell.oController._vActda);
		}

		oTable.unbindRows();
		oStext.setValue("");
	    
   },
	
	onAfterOpenSearchStellDialog : function(oEvent){

		
	}
	
};