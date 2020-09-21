sap.ui.jsfragment("fragment.COMMON_SEARCH_ORG", {

	createContent : function(oController) {	
		
		jQuery.sap.require("common.SearchOrg");
		
		var dateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "yyyy-MM-dd"});
		var curDate = new Date();
		
		var oFilterBar = new sap.m.Toolbar({
			content : [ new sap.m.ToolbarSpacer({width: "10px"}),
			            new sap.m.Label({
			            	text : "기준일자"
			            }).addStyleClass("L2PFontFamily"),

			            new sap.m.DatePicker(oController.PAGEID + "_COMMON_SEARCH_ORG_Datum", {
							value: dateFormat.format(curDate), 
							valueFormat : "yyyy-MM-dd",
			            	displayFormat : gDtfmt,
							width : "120px",
							enabled : false
						}),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Label({text : "검색어"}).addStyleClass("L2PFontFamily"),
						new sap.m.Input(oController.PAGEID + "_COMMON_SEARCH_ORG_Stext", {
							width: "150px"
						}).attachBrowserEvent("keyup", common.SearchOrg.onKeyUp),
						new sap.m.ToolbarSpacer({width: "10px"}),
						new sap.m.Button(oController.PAGEID + "_COMMON_SEARCH_ORG_SearchButton", {
							icon : "sap-icon://search",
							text : "검색",
							type : sap.m.ButtonType.Emphasized,
							customData : [{key : "Persa", value : oController._vPersa}],
							press : common.SearchOrg.searchOrg
						}),
						new sap.m.ToolbarSpacer({width: "10px"})
			        ]
		}).addStyleClass("L2PToolbarNoBottomLine");
		
		var JSonModel =  new sap.ui.model.json.JSONModel();
		var oTable = new sap.ui.table.Table(oController.PAGEID + "_COMMON_SEARCH_ORG_TABLE", {
			enableColumnReordering : false,
			enableColumnFreeze : false,
			columnHeaderHeight  : 35,
			visibleRowCount : 12, 
			showNoData : true,
			selectionMode : sap.ui.table.SelectionMode.MultiToggle,
			noData : "No data found" ,
		});
//		oTable.attachCellClick(common.SearchOrg.onClick);
//		oTable.attachBrowserEvent("dblclick", common.SearchOrg.onDblClick );
		oTable.setModel(JSonModel);
		oTable.bindRows("/JoblistSet");
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	vAlign : "Middle",
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true ,
			sortProperty : "Fulln",
			label : new sap.ui.commons.TextView({text : "소속부서", textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily"), 
			filterProperty : "Fulln" ,
			width : "70%" ,
			template : new sap.ui.commons.TextView({
				text : "{Fulln}", 
				textAlign : "Center"}).addStyleClass("L2PFontFamily")
		
		});
		oTable.addColumn(oColumn) ;
		
		var oColumn = new sap.ui.table.Column({
			hAlign : "Center",
			flexible : false,
        	vAlign : "Middle",
        	autoResizable : true,
        	resizable : true,
			showFilterMenuEntry : true ,
			sortProperty : "EnameM",
			label : new sap.ui.commons.TextView({text : "조직장", textAlign : "Center", width : "100%"}).addStyleClass("L2PFontFamily"),
			filterProperty : "EnameM" ,
			width : "30%" ,
			template : new sap.ui.commons.TextView({
				text : "{EnameM}", 
				textAlign : "Center"}).addStyleClass("L2PFontFamily")
		});
		oTable.addColumn(oColumn) ;
			
		var oLayout = new sap.ui.commons.layout.VerticalLayout({
			width : "100%",
			content : [oFilterBar, oTable ]
		});
		
		var oDialog = new sap.m.Dialog(oController.PAGEID + "_COMMON_SEARCH_ORG_Dialog", {
			contentWidth : "900px",
			contentHeight : "500px",
			showHeader : true,
			title : "조직 검색",
			beforeOpen : common.SearchOrg.onBeforeOpenSearchOrgDialog,
			afterOpen : common.SearchOrg.onAfterOpenSearchOrgDialog,
			afterClose : common.SearchOrg.onAfterCloseSearchOrgDialog,
			beginButton :  new sap.m.Button({
				icon : "sap-icon://accept",
				text : "선택",
				press : common.SearchOrg.onConfirm}),
			endButton : new sap.m.Button({
				icon : "sap-icon://sys-cancel-2",
				text :  "취소",
				press : common.SearchOrg.onClose}),
			content : [oLayout]
		});	
		
		if (!jQuery.support.touch) { // apply compact mode if touch is not supported
			oDialog.addStyleClass("sapUiSizeCompact");
	    };
		
		return oDialog;
	}

});