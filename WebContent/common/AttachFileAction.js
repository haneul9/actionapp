jQuery.sap.declare("common.AttachFileAction");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("common.Common");

/**
 * ���繮���� ����÷�� ���� Function�� JS
 * @Create By ����
 */

common.AttachFileAction = {
		
	oController : null,
		
	/** 
	* @memberOf common.AttachFileAction
	*/
	
	/*
	 * ����÷�� panel �� FileUploader Control�� ǥ�ÿ��� ���� ����
	 * �������� �� ÷������ ���ο� ���� Control�� ǥ�ÿ��θ� �����Ѵ�.
	 */
	setAttachFile : function(oController) {	
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		var oDeleteBtn = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_DELETE_BTN");
		var oFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		
		oFileUploader.setValue("");
		
		if(oController._vAstat == "00" || oController._vAstat == "10") {
			oFileUploader.setVisible(true);
			oDeleteBtn.setVisible(true);
			oFileList.setMode(sap.m.ListMode.MultiSelect);
		} else {
			oFileUploader.setVisible(false);
			oDeleteBtn.setVisible(false);
			oFileList.setMode(sap.m.ListMode.None);
		}
	},
	
	/*
	 * ÷������ ����Ʈ�� Binding�Ѵ�.
	 */
	refreshAttachFileList : function(oController) {
		
		var f1 = $("#" + oController.PAGEID + "_ATTACHFILE_BTN-fu");
		if ($.browser.msie) {
			f1.replaceWith(f1 = f1.clone( true ));
	    } else {
              f1.val('');
        }
		         
//		         sap.ui.getCore().byId(oController.PAGEID + "_Attach1").setValue("");
//		         sap.ui.getCore().byId(oController.PAGEID + "_Attach2").setValue("");
//		         sap.ui.getCore().byId(oController.PAGEID + "_Attach3").setValue("");
		         
		var oAttachFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var oAttachFileColumn = sap.ui.getCore().byId(oController.PAGEID + "_CAF_ColumnList");
		var oAttachingFileList = sap.ui.getCore().byId(oController.PAGEID + "_CAF_List");
		oAttachingFileList.removeAllItems();
		oAttachingFileList.destroyItems();
		oController._vUploadFiles = [];
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.clear();
		var oFilters = [];
		oFilters.push(new sap.ui.model.Filter("Appno", sap.ui.model.FilterOperator.EQ, oController._vAppno));
		oFilters.push(new sap.ui.model.Filter("Appty", sap.ui.model.FilterOperator.EQ, oController._vAppty));
		
		oAttachFileList.bindItems("/FileListSet", oAttachFileColumn, null, oFilters);
		
		
	},
	
	/*
	 * ÷������ ũ�Ⱑ Max Size�� �Ѿ��� ����� ó������
	 */
	fileSizeExceed : function (oEvent) {
		var sName = oEvent.getParameter("fileName");
		var fSize = oEvent.getParameter("fileSize");
		var fLimit = this.getMaximumFileSize();
		
		var sMsg = "&sName 파일(&fSize MB)은 최대 허용 쿠기 &fLimit MB를 초과하였습니다.";
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&fSize", fSize);
		sMsg = sMsg.replace("&fLimit", fLimit);
		
		sap.m.MessageBox.alert(sMsg);
	},
	
	/*
	 * ÷�������� ������ ���� ���������� �ƴ� ����� ó������
	 */
	typeMissmatch : function (oEvent) {
		var oController = common.AttachFileAction.oController;
		
		var sName = oEvent.getParameter("fileName");
		var sType = oEvent.getParameter("fileType");
		var sMimeType = this.getMimeType();
		if (!sMimeType) {			
			var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
			sMimeType = oFileUploader.getFileType();
		}
		var sMsg = "&sName 파일의  &sType 은 허용된 파일 확장자가 아닙니다.";
		sMsg = sMsg.replace("&sName", sName);
		sMsg = sMsg.replace("&sType", sType);
		
		sap.m.MessageBox.alert(sMsg);
	},
	
	/*
	 * ÷�������� Upload�� �Ϸ�Ǿ����� ó�� ����
	 * refreshAttachFileList Function�� ȣ���Ѵ�.
	 */
	uploadComplete: function (oEvent) {
		var oController = common.AttachFileAction.oController;
		
		if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
			oController.BusyDialog.close();
		}
		
		var sResponse = oEvent.getParameter("response");
		sap.m.MessageBox.alert(sResponse, {title : "안내"});
		
		var oFileUploader = sap.ui.getCore().byId(oController.PAGEID + "_ATTACHFILE_BTN");
		oFileUploader.setValue("");
		
		common.AttachFileAction.refreshAttachFileList(oController);
	},
	
	/*
	 * ÷�������� Upload�� �����Ͽ����� ó�� ����
	 */
	uploadAborted : function(oEvent) {
		sap.m.MessageBox.alert("파일 업로드에 실패하였습니다.");
	},
	
	/*
	 * Upload�� ÷�������� �������� ��� ó�� ���� 
	 */
	onFileChange : function(oEvent) {
		var oController = common.AttachFileAction.oController;
		oController._vUploadFiles = [];
		var files = jQuery.sap.domById(oController.PAGEID + "_ATTACHFILE_BTN" + "-fu").files;
		if(files) {
			for(var i=0; i<files.length; i++) {
				oController._vUploadFiles.push(files[i]);
				//oAttachingFileList.addItem(new sap.m.DisplayListItem({label : files[i].name, value : files[i].size}));
			}
		}
		
	},
	
	/*
	 * ÷�ε� ������ ����ó��
	 */
	onDeleteAttachFile : function(oEvent) {
		var oController = common.AttachFileAction.oController;
		
		var oModel = sap.ui.getCore().getModel("ZL2P01GW9000_SRV");
		
		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_CAF_Table");
		var vContexts = oTable.getSelectedContexts(true);
		
		var fProcessFlag = true;
		
		if(vContexts && vContexts.length) {
			try {
				if(!oController.BusyDialog) {
					oController.BusyDialog = new sap.m.Dialog({showHeader : false}); 			
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : "파일을 삭제중입니다. 잠시만 기다려 주십시오."}));
					oController.getView().addDependent(oController.BusyDialog);
				} else {
					oController.BusyDialog.removeAllContent();
					oController.BusyDialog.destroyContent();
					oController.BusyDialog.addContent(new sap.m.BusyIndicator({text : "파일을 삭제중입니다. 잠시만 기다려 주십시오."}));
				}
				if(!oController.BusyDialog.isOpen()) {
					oController.BusyDialog.open();
				}
				
				for(var i=0; i<vContexts.length; i++) {
					oModel.remove(
							"/FileListSet(Appno='" + vContexts[i].getProperty("Appno") 
							+ "',Appty='" + vContexts[i].getProperty("Appty")
							+ "',Fnumr='" + vContexts[i].getProperty("Fnumr") + "')",
							null,
						    function (oData, response) {
								fProcessFlag = true;
						    },
						    function (oError) {
						    	fProcessFlag = false;
						    	var Err = {};
						    	if(oError.response) {
							        Err = window.JSON.parse(oError.response.body);
									common.Common.showErrorMessage(Err.error.message.value);
						    	} else {
						    		sap.m.MessageBox.alert(rError2);
						    	}
						    	rError = oError;
						    }
					);
					if(!fProcessFlag) {
						break;
					}
				}
				
				common.AttachFileAction.refreshAttachFileList(oController);
				
				if(oController.BusyDialog && oController.BusyDialog.isOpen()) {
					oController.BusyDialog.close();
				}
				
				if(!fProcessFlag) {
					return;
				}
				sap.m.MessageBox.alert("파일들을 삭제하였습니다.");				
			} catch(ex) {
				common.Common.log(ex);
			}
		}
	},
	
	/*
	 * ÷�������� �ٿ�ε� �Ѵ�.
	 */
	onDownloadAttachFile : function(oEvent) {
		var oSrc = oEvent.getSource();
		var vAseqn = "", vDocid = "";
		var oCustomList = oSrc.getCustomData();
		if(oCustomList && oCustomList.length == 4) {
			vAseqn = oCustomList[0].getValue();
			vDocid = oCustomList[1].getValue();
		}
		document.iWorker.location.href = "/sap/bc/bsp/sap/ZUI5_HR_BSP/download.htm?ty=DOC&doc_id=" + vDocid + "&seq=" + vAseqn;
	},
	
	uploadFile : function(oController) {
		try {
			var _handleSuccess = function(data){
				console.log("파일 업로드를 완료하였습니다." + ", " + data);
			}; 
			var _handleError = function(data){
				var errorMsg = null;
				if (data.responseText){
					errorMsg = /<message xml:lang="ko">(.*?)<\/message>/.exec(data.responseText);
				}else{
					errorMsg = "파일 업로드에 실패하였습니다.";
				}
				if(errorMsg && errorMsg.length) {
					console.log("Error: " + errorMsg[1]);
				} else {
					console.log("Error: " + errorMsg);
				}
			};
			
			if(oController._vUploadFiles && oController._vUploadFiles.length) {
				for(var i=0; i<oController._vUploadFiles.length; i++) {
					var file = oController._vUploadFiles[i];
					if (file) {
						
						sap.ui.getCore().getModel("ZL2P01GW9000_SRV").refreshSecurityToken();
						var oRequest = sap.ui.getCore().getModel("ZL2P01GW9000_SRV")._createRequest();
						var oHeaders = {
							"x-csrf-token": oRequest.headers['x-csrf-token'],
							"slug": oController._vAppno + "|" + oController._vAppty + "|" + encodeURI(file.name)
						}; 
						
						jQuery.ajax({
							type: 'POST',
							async : false,
							url: "/sap/opu/odata/sap/ZL2P01GW9000_SRV/FileSet/",
							headers: oHeaders,
							cache: false,
							contentType: file.type,
							processData: false,
							data: file,
							success: _handleSuccess,
							error: _handleError,
						});
					}
				}
			}
		} catch(oException) {
			jQuery.sap.log.error("File upload failed:\n" + oException.message);
		}
	}
		
};