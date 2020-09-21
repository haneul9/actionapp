jQuery.sap.declare("common.ExcelDownload");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");

//common.ExcelDownload = {
//	/** 
//	* @memberOf common.ExcelDownload
//	*/	
//
//		
//	exceldown : function(oController) {
//		var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//		
//		var items = oTable.getItems();
//		var cols = oTable.getColumns();
//		var oModel = oTable.getModel();
//		 var cellId = null;
//	     var cellObj = null;
//	     var cellVal = null;
//	     var headerColId = null;
//	     var headerColObj = null;
//	     var headerColVal = null;
//	     var column = null;
//	     var json = {}; var colArray = []; var itemsArray = [];
//	     //push header column names to array
//	     for(var j=0; j<cols.length;j++){
//	            column = "";
//	            column = cols[j];
//	            headerColId = column.getAggregation("header").getId();
//	            headerColObj = sap.ui.getCore().byId(headerColId);
//	            headerColVal = headerColObj.getText();
//	            if(headerColObj.getVisible()){
//	                json={name: headerColVal};
//	                colArray.push(json);
//	            }
//	        }
//	        itemsArray.push(colArray);
//	      //push table cell values to array
//	      for (i = 0; i < items.length; i++) {
//	          colArray = [];
//	          cellId = "";   cellObj = "";  cellVal = "";
//	          headerColId = null; headerColObj = null; headerColVal = null;
//	          var item = items[i];
//	            for(var j=0; j<cols.length;j++){
//	                cellId = item.getAggregation("cells")[j].getId();
//	                cellObj = sap.ui.getCore().byId(cellId);
//	                if(cellObj.getVisible()){
//	                    if(cellObj instanceof sap.m.Text ||cellObj instanceof sap.m.Label ||cellObj instanceof sap.m.Link) cellVal = cellObj.getText();
//	                    if(cellObj instanceof sap.m.ObjectNumber){
//	                        var k = cellObj.getUnit();
//	                        cellVal = cellObj.getNumber()+" "+k;
//	                    }
//	                    if(cellObj instanceof sap.m.ObjectIdentifier){
//	                        var objectIdentifierVal = "";
//	                        if(cellObj.getTitle() != undefined && cellObj.getTitle() != "" && cellObj.getTitle() != null )
//	                            objectIdentifierVal = cellObj.getTitle();
//	                        if(cellObj.getText() != undefined && cellObj.getText() != "" && cellObj.getText() != null )
//	                            objectIdentifierVal = objectIdentifierVal+" "+cellObj.getText();
//	                  
//	                        cellVal = objectIdentifierVal;
//	                    }
//	                    if(cellObj instanceof sap.ui.core.Icon){
//	                    	if(cellObj.getTooltip() != undefined && cellObj.getTooltip() != "" && cellObj.getTooltip() != null ){
//	                        	cellVal = cellObj.getTooltip();
//	                        }else if(cellObj.mProperties.src == "sap-icon://status-completed"){
//	                        	cellVal = cellObj.mBindingInfos.color.binding.oValue;
//	                        }else{
//	                        	console.log(cellObj.mProperties.src);
//	                        	if( cellObj.mProperties.src != "") cellVal = "X";
//	                        	else cellVal = "";
//	                        }
//	                    }
//	                    if(j==0){
//	                        json={ name:  "\r"+cellVal};
//////	                    	 json={ name:  "\r\n" +cellVal};
////	                    	 json={ name:  '\n'};
//////	                    	json={ name:  "\n"};
//	                    }
//	                    else
//	                    {
//	                        json={ name:  cellVal};
//	                    }
//	                    colArray.push(json);
//	                }
//	            }
//	            itemsArray.push(colArray);
//	      
//	      
//	        }
//         //export json array to csv file
//          var oExport = new sap.ui.core.util.Export({
//                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
//                exportType: new sap.ui.core.util.ExportTypeCSV({
//                    separatorChar: "," 
//                }),
//                // Pass in the model created above
//                models: oModel,
//                // binding information for the rows aggregation
//                rows: {
//                    path: "/"
//                },
//                // column definitions with column name and binding info for the content
//                columns: [itemsArray]
//            });
//          
//          oExport.saveFile().always(function() {
//                this.destroy();
//            });
//	},	
//};

//common.ExcelDownload = {
//		/** 
//		* @memberOf common.ExcelDownload
//		*/	
//
//			
//		exceldown : function(oController) {
//			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
//			var oColumList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
//			
//			var items = oTable.getItems();
//			var cols = oTable.getColumns();
//			var oModel = oTable.getModel();
//			
//			if(items.length < 1) return;
//	         //export json array to csv file
//            var oExport = new sap.ui.core.util.Export({
//                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
//                exportType: new sap.ui.core.util.ExportTypeCSV({
//                    separatorChar: "," 
//                }),
////            	exportType: new  sap.ui.core.util.ExportType({
////            		  fileExtension: 'xls'
////    		    }),
//                // Pass in the model created above
//                models: oModel,
//                // binding information for the rows aggregation
//                rows: {
//                    path: oModel.aBindings[0].sPath
//                },
//            });
//            
//            var cellId = null;
//	        var cellObj = null;
//	        var cellVal = null;
//	        var headerColId = null;
//	        var headerColObj = null;
//	        var headerColVal = null;
//	        var column = null;
//	        var json = {}; var colArray = []; var itemsArray = [];
//	     //push header column names to array
//		    for(var j=0; j<cols.length;j++){
//		            column = "";
//		            column = cols[j];
//		            headerColId = column.getAggregation("header").getId();
//		            headerColObj = sap.ui.getCore().byId(headerColId);
//		            headerColVal = headerColObj.getText();
//	                if(headerColObj.getVisible()){
//		            	cellId = items[0].getAggregation("cells")[j].getId();
//		                cellObj = sap.ui.getCore().byId(cellId);
//	                	 if(cellObj instanceof sap.m.Text ||cellObj instanceof sap.m.Label ||cellObj instanceof sap.m.Link){
//	                		 console.log(cellObj.mBindingInfos.text.formatter);
//	                		 
//			                   if((cellObj.mBindingInfos.text.formatter != undefined && cellObj.mBindingInfos.text.formatter.name == "DateFormatter") || 
//			                		   cellObj.mBindingInfos.text.type != undefined && cellObj.mBindingInfos.text.type.sName == "Date"){
//			                		 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//					            			name : headerColObj.getText(),
//					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : common.Common.DateFormatter }}
//					            		}));
//			                   }else if(cellObj.mBindingInfos.text.parts.length == 2){ // from ~ to ( ��¥ )
//			                	   if(((cellObj.mBindingInfos.text.parts[0].formatter != undefined && cellObj.mBindingInfos.text.parts[0].formatter.name == "DateFormatter") ||
//			                	   	   (cellObj.mBindingInfos.text.parts[0].type != undefined && cellObj.mBindingInfos.text.parts[0].type.sName == "Date")) &&
//			                	   	  ((cellObj.mBindingInfos.text.parts[1].formatter != undefined && cellObj.mBindingInfos.text.parts[1].formatter.name == "DateFormatter") ||
//					                   (cellObj.mBindingInfos.text.parts[1].type != undefined && cellObj.mBindingInfos.text.parts[1].type.sName == "Date"))){
//				                	   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//					            			name : headerColObj.getText(),
//					            			template : {content : {parts :[{path : cellObj.mBindingInfos.text.parts[0].path, formatter : common.Common.DateFormatter},
//			  					                  						   {path : cellObj.mBindingInfos.text.parts[1].path, formatter : common.Common.DateFormatter}],
//			  					                  						   formatter : function(fVal1, fVal2) {
//									  					            	    return fVal1 + " ~ " + fVal2;
//									  					                   }
//					            								   }
//					            			            }
//			                		  })); 
//			                	   }
//			                   }else{
//			                	   if( cellObj.mBindingInfos.text.parts[0].path == "Fasex"){
//			                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//					            			name : headerColObj.getText(),
//					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
//					            				return fval == "1" ? "남" :"여";
//			            					}}}
//					            		})); 
//			                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Eecnt"){
//			                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//					            			name : headerColObj.getText(),
//					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
//					            				return " " + fval;
//			            					}}}
//					            		})); 
//			                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Prrte"){
//			                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//					            			name : headerColObj.getText(),
//					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
//					            				return fval + " %";
//			            					}}}
//					            		})); 
////				                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Smbda" && cellObj.mBindingInfos.text.parts.length > 1 &&
////				                			   cellObj.mBindingInfos.text.parts[1].path == "Smeda"){
////				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
////						            			name : headerColObj.getText(),
////						            			template : {content : {parts :[{path : "Smbda", formatter : common.Common.DateFormatter},
////				  					                  						   {path : "Smeda", formatter : common.Common.DateFormatter}],
////				  					                  						   formatter : function(fVal1, fVal2) {
////										  					            	    return fVal1 + " ~ " + fVal2;
////										  					                   }
////						            								   }
////						            			            }
////				                		  })); 
//			                	   }else{
//			                		   if(cellObj.mBindingInfos.text.parts[0].path == "Bakda"){
//			                			   console.log("cellObj.mBindingInfos");
//			                			   console.log(cellObj.mBindingInfos);
//			                		   }
//			                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//					            			name : headerColObj.getText(),
//					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path
//			            					}}
//					            		}));  
//			                	   } 
//		                      }
//		                   
//                	 }else if(cellObj instanceof sap.ui.core.Icon){
//	                		if(cellObj.mBindingInfos.color != undefined){
//	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//				            			name : headerColObj.getText(),
//				            			template : {content : {path : cellObj.mBindingInfos.color.parts[0].path}}
//				            		}));
//	                		}else if(cellObj.mBindingInfos.src != undefined){
//	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//				            			name : headerColObj.getText(),
//				            			template : {content : {path : cellObj.mBindingInfos.src.parts[0].path}}
//				            	  }));
//	                		}else if(cellObj.mBindingInfos.visible != undefined){
//	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
//				            			name : headerColObj.getText(),
//				            			template : {content : {path : cellObj.mBindingInfos.visible.parts[0].path}}
//				            	  }));
//	                		}
//		                   
//            	     }
//	               
//                }
//	        }
//	                
//            oExport.saveFile().always(function() {
//                this.destroy();
//            });
//		},	
//	};


common.ExcelDownload = {
		/** 
		* @memberOf common.ExcelDownload
		*/	

			
		exceldown : function(oController) {
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			
			var items = oTable.getItems();
			var cols = oTable.getColumns();
			var oModel = oTable.getModel();
			var entity_name = oModel.aBindings[0].sPath.replace("/","") ;
			var oModelName , pointIndex , oMainModel, oMetaModel, oEntityType, vEntityName;
			try {
				entity_name = oModel.aBindings[0].sPath.replace("/","") ;
				eval("oModelName = oModel.aBindings[0].oModel.oData."+ entity_name + "[0].__metadata.type;");
				pointIndex = oModelName.indexOf(".");
				vEntityName = oModelName.substring(pointIndex+1, oModelName.length);
				oModelName = oModelName.substring(0, pointIndex);
				oMainModel = sap.ui.getCore().getModel(oModelName);
				oMetaModel = oMainModel.getMetaModel();
				oEntityType = oMetaModel.getODataEntityType(oModelName + "." + vEntityName); //entity_name);
			} catch (e) {
				// TODO: handle exception
				return ; 
			}
			if(items.length < 1) return;
	         //export json array to csv file
            var oExport = new sap.ui.core.util.Export({
                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new sap.ui.core.util.ExportTypeCSV({
                    separatorChar: "," 
                }),
                // Pass in the model created above
                models: oModel,
                // binding information for the rows aggregation
                rows: {
                    path: oModel.aBindings[0].sPath
                },
            });
            
            var cellId = null;
	        var cellObj = null;
	        var cellVal = null;
	        var headerColId = null;
	        var headerColObj = null;
	        var headerColVal = null;
	        var column = null;
	        
	     //push header column names to array
		    for(var j=0; j<cols.length;j++){
		            column = "";
		            column = cols[j];
		            headerColId = column.getAggregation("header").getId();
		            headerColObj = sap.ui.getCore().byId(headerColId);
		            headerColVal = headerColObj.getText();
	                if(headerColObj.getVisible()){
		            	cellId = items[0].getAggregation("cells")[j].getId();
		                cellObj = sap.ui.getCore().byId(cellId);
	                	 if(cellObj instanceof sap.m.Text ||cellObj instanceof sap.m.Label ||cellObj instanceof sap.m.Link){
	                		 var vFieldname = cellObj.mBindingInfos.text.parts[0].path ;
	                		 var oProperty = oMetaModel.getODataProperty(oEntityType, vFieldname);
	                		 if(cellObj.mBindingInfos.text.parts.length == 2){ // ��¥ from ~  to
	                			 var oProperty2 = oMetaModel.getODataProperty(oEntityType, cellObj.mBindingInfos.text.parts[1].path);
	                			 if(oProperty.type == "Edm.DateTime" && oProperty2.type == "Edm.DateTime"){
	                				 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
					            			name : headerColObj.getText(),
					            			template : {content : {parts :[{path : cellObj.mBindingInfos.text.parts[0].path, formatter : common.Common.DateFormatter},
			  					                  						   {path : cellObj.mBindingInfos.text.parts[1].path, formatter : common.Common.DateFormatter}],
			  					                  						   formatter : function(fVal1, fVal2) {
									  					            	    return fVal1 + " ~ " + fVal2;
									  					                   }
					            								   }
					            			            }
			                		  })); 
	                			 }
	                		 }else{
	                			 if(oProperty && oProperty.type == "Edm.DateTime"){
	                				 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
					            			name : headerColObj.getText(),
					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : common.Common.DateFormatter }}
					            		}));
		                		 }else{
		                			 if( cellObj.mBindingInfos.text.parts[0].path == "Fasex"){
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
						            				return fval == "1" ? "남" :"여";
				            					}}}
						            		})); 
				                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Eecnt"){
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
						            				return " " + fval;
				            					}}}
						            		})); 
				                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Prrte"){
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
						            				return fval + " %";
				            					}}}
						            		})); 
				                	   }else{
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path
				            					}}
						            		}));  
				                	   }
		                		 } 
	                		 }
		                   
                	 }else if(cellObj instanceof sap.ui.core.Icon){
	                		if(cellObj.mBindingInfos.color != undefined){
	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
				            			name : headerColObj.getText(),
				            			template : {content : {path : cellObj.mBindingInfos.color.parts[0].path}}
				            		}));
	                		}else if(cellObj.mBindingInfos.src != undefined){
	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
				            			name : headerColObj.getText(),
				            			template : {content : {path : cellObj.mBindingInfos.src.parts[0].path}}
				            	  }));
	                		}else if(cellObj.mBindingInfos.visible != undefined){
	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
				            			name : headerColObj.getText(),
				            			template : {content : {path : cellObj.mBindingInfos.visible.parts[0].path}}
				            	  }));
	                		}
		                   
            	     }
	               
                }
	        }
	                
            oExport.saveFile().always(function() {
                this.destroy();
            });
		},	
		
		
		exceldown2 : function(oController) {
			var oTable = sap.ui.getCore().byId(oController.PAGEID + "_TABLE");
			var oColumList = sap.ui.getCore().byId(oController.PAGEID + "_COLUMNLIST");
			
//			var items = oTable.getItems();
//			var cols = oTable.getColumns();
			var oModel = oTable.getModel();
			var entity_name = oModel.aBindings[0].sPath.replace("/","") ;
			var oModelName , pointIndex , oMainModel, oMetaModel, oEntityType, vEntityName;
			try {
				entity_name = oModel.aBindings[0].sPath.replace("/","") ;
				eval("oModelName = oModel.aBindings[0].oModel.oData."+ entity_name + "[0].__metadata.type;");
				pointIndex = oModelName.indexOf(".");
				vEntityName = oModelName.substring(pointIndex+1, oModelName.length);
				oModelName = oModelName.substring(0, pointIndex);
				oMainModel = sap.ui.getCore().getModel(oModelName);
				oMetaModel = oMainModel.getMetaModel();
				oEntityType = oMetaModel.getODataEntityType(oModelName + "." + vEntityName); //entity_name);
			} catch (e) {
				// TODO: handle exception
				return ; 
			}
			if(items.length < 1) return;
	         //export json array to csv file
            var oExport = new sap.ui.core.util.Export({
                // Type that will be used to generate the content. Own ExportType's can be created to support other formats
                exportType: new sap.ui.core.util.ExportTypeCSV({
                    separatorChar: "," 
                }),
                // Pass in the model created above
                models: oModel,
                // binding information for the rows aggregation
                rows: {
                    path: oModel.aBindings[0].sPath
                },
            });
            
            var cellId = null;
	        var cellObj = null;
	        var cellVal = null;
	        var headerColId = null;
	        var headerColObj = null;
	        var headerColVal = null;
	        var column = null;
	        
	     //push header column names to array
		    for(var j=0; j<cols.length;j++){
		            column = "";
		            column = cols[j];
		            headerColId = column.getAggregation("header").getId();
		            headerColObj = sap.ui.getCore().byId(headerColId);
		            headerColVal = headerColObj.getText();
	                if(headerColObj.getVisible()){
		            	cellId = items[0].getAggregation("cells")[j].getId();
		                cellObj = sap.ui.getCore().byId(cellId);
	                	 if(cellObj instanceof sap.m.Text ||cellObj instanceof sap.m.Label ||cellObj instanceof sap.m.Link){
	                		 var vFieldname = cellObj.mBindingInfos.text.parts[0].path ;
	                		 var oProperty = oMetaModel.getODataProperty(oEntityType, vFieldname);
	                		 if(cellObj.mBindingInfos.text.parts.length == 2){ // ��¥ from ~  to
	                			 var oProperty2 = oMetaModel.getODataProperty(oEntityType, cellObj.mBindingInfos.text.parts[1].path);
	                			 if(oProperty.type == "Edm.DateTime" && oProperty2.type == "Edm.DateTime"){
	                				 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
					            			name : headerColObj.getText(),
					            			template : {content : {parts :[{path : cellObj.mBindingInfos.text.parts[0].path, formatter : common.Common.DateFormatter},
			  					                  						   {path : cellObj.mBindingInfos.text.parts[1].path, formatter : common.Common.DateFormatter}],
			  					                  						   formatter : function(fVal1, fVal2) {
									  					            	    return fVal1 + " ~ " + fVal2;
									  					                   }
					            								   }
					            			            }
			                		  })); 
	                			 }
	                		 }else{
	                			 if(oProperty && oProperty.type == "Edm.DateTime"){
	                				 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
					            			name : headerColObj.getText(),
					            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : common.Common.DateFormatter }}
					            		}));
		                		 }else{
		                			 if( cellObj.mBindingInfos.text.parts[0].path == "Fasex"){
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
						            				return fval == "1" ? "남" :"여";
				            					}}}
						            		})); 
				                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Eecnt"){
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
						            				return " " + fval;
				            					}}}
						            		})); 
				                	   }else if( cellObj.mBindingInfos.text.parts[0].path == "Prrte"){
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path, formatter : function(fval){
						            				return fval + " %";
				            					}}}
						            		})); 
				                	   }else{
				                		   oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
						            			name : headerColObj.getText(),
						            			template : {content : {path : cellObj.mBindingInfos.text.parts[0].path
				            					}}
						            		}));  
				                	   }
		                		 } 
	                		 }
		                   
                	 }else if(cellObj instanceof sap.ui.core.Icon){
	                		if(cellObj.mBindingInfos.color != undefined){
	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
				            			name : headerColObj.getText(),
				            			template : {content : {path : cellObj.mBindingInfos.color.parts[0].path}}
				            		}));
	                		}else if(cellObj.mBindingInfos.src != undefined){
	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
				            			name : headerColObj.getText(),
				            			template : {content : {path : cellObj.mBindingInfos.src.parts[0].path}}
				            	  }));
	                		}else if(cellObj.mBindingInfos.visible != undefined){
	                			 oExport.addColumn(new sap.ui.core.util.ExportColumn({ 
				            			name : headerColObj.getText(),
				            			template : {content : {path : cellObj.mBindingInfos.visible.parts[0].path}}
				            	  }));
	                		}
		                   
            	     }
	               
                }
	        }
	                
            oExport.saveFile().always(function() {
                this.destroy();
            });
		},	
	};