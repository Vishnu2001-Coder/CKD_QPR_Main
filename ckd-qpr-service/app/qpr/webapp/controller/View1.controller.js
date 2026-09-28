sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    Controller,
    MessageBox,
    MessageToast,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    return Controller.extend("qpr.controller.View1", {

        onInit: function () {

            // just for testing purpose 
            console.log(
                "QPRItems Model:",
                this.getOwnerComponent().getModel("QPRItems")
            );


            // just for testing purpose 
            console.log(
                "QPR Items:",
                this.getOwnerComponent()
                    .getModel("QPRItems")
                    .getProperty("/items")
            );

            //-----------------------------------------------------------------------//


            let filterData = {
                invoiceId: "",
                salesOrder_ID: "",
                salesOrderNo: "No sales order selected",
                recieptDate: "",
                unpackedDate: "",
                assemblerName: "Auto",
                country: "Auto"
            };

            let filterDataModel = new JSONModel(filterData);

            this.getView().setModel(filterDataModel, "FilterData");

        },

        //For Auto sales Order data 1.fetch the Invoice , 2.take the particluar record along with salesOrder
        onInvoiceFilterChange: function (oEvent) {

            let invoiceValue =
                oEvent.getSource().getValue();            //get the filter value data

            this.getView().getModel("FilterData").setProperty("/invoiceId", invoiceValue)

            let ckdModel =
                this.getView().getModel("ckd");

            ckdModel.read("/Invoices", {                  // bind the invoice Entity v2 syntax

                filters: [
                    new Filter(                         // fetch the filter data directly
                        "invoiceNo",
                        FilterOperator.EQ,
                        invoiceValue
                    )
                ],

                urlParameters: {
                    $expand: "salesOrder"          //along with sales
                },

                success: (oData) => {                              //checking and retriving the data

                    console.log("FUll Response", oData);
                    console.log("ONLY Invoice", oData.results[0]);
                    console.log("ONLY Invice Along With Sales", oData.results[0].salesOrder);      // which retuen a particular record (Association Entity Records)
                    console.log("ONLY SalesOrderNo", oData.results[0].salesOrder.salesOrderNo);
                    console.log("ONLY SalesOrder_ID", oData.results[0].salesOrder_ID);

                    const salesOrder_ID = oData.results[0].salesOrder_ID;
                    this.getView()
                        .getModel("FilterData")                      //set the salesorder data in json model
                        .setProperty("/salesOrder_ID", salesOrder_ID);


                    let salesOrder =
                        oData?.results?.[0]?.salesOrder;    //Get Sales Order

                    if (!salesOrder) {
                        return;
                    }

                    let salesOrderNo =
                        salesOrder.salesOrderNo;       //get Sales Order Number

                    // Set Sales Order
                    this.getView()
                        .getModel("FilterData")                      //set the salesorder data in json model
                        .setProperty(
                            "/salesOrderNo",
                            salesOrderNo
                        );

                    console.log(
                        "Sales Order:",
                        salesOrderNo
                    );
                },

                error: function (oError) {

                    console.error(
                        "Invoice read failed:",
                        oError
                    );

                }
            });
        },


        // =====================================================
        // GO BUTTON
        // =====================================================

        onGo: function () {

            console.log("Hi im a Go");

            //Get all the  Filter Data

            const oSalesOrderModel =
                this.getView().getModel("FilterData");

            // 4 fields from FilterData model

            const invoiceNo =
                oSalesOrderModel.getProperty("/invoiceId");

            const salesOrderNo =
                oSalesOrderModel.getProperty("/salesOrderNo");

            const sDateOfContainerReceipt =
                oSalesOrderModel.getProperty("/recieptDate");

            const sUnpackingDate =
                oSalesOrderModel.getProperty("/unpackedDate");

            const sAssembler =
                oSalesOrderModel.getProperty("/assemblerName");

            const sCountry =
                oSalesOrderModel.getProperty("/country");

            const salesOrderID =
                oSalesOrderModel.getProperty("/salesOrder_ID");


            // Department
            const oDepartment =
                this.byId("departmentCombo").getSelectedItem()?.getText();

            // Plant
            const oPlant =
                this.byId("plantCombo").getSelectedItem()?.getText();

            const oFilterData = {
                invoiceNo: invoiceNo,
                salesNo: salesOrderNo,
                dateOfContainerReceipt: sDateOfContainerReceipt,
                unpackingDate: sUnpackingDate,
                assembler: sAssembler,
                country: sCountry,
                department: oDepartment,
                plant: oPlant
            };

            console.log(oFilterData);
            console.log(salesOrderID);
            


            //--------------------------------------------------------------------------------------------//


            console.log(
                "GO clicked. Sales Order:",
                salesOrderNo
            );

            //  validation 

            if (
                !salesOrderNo ||
                salesOrderNo === "No sales order selected"
            ) {

                MessageToast.show(
                    "Please select an Invoice first."
                );

                return;
            }

            //Get the CKD service and bind the Invoices entity

            let ckdModel =
                this.getView().getModel("ckd");         //this 

            ckdModel.read("/SalesOrderItems", {

                filters: [
                    new Filter(
                        "salesOrder_ID",
                        FilterOperator.EQ,
                        salesOrderID
                    )
                ],
                  urlParameters: {
                    $expand: "modelFamily"          //along with sales
                },



                success: (oData) => {

                    console.log("SalesItem  Response:", oData);

                    this.processSalesOrderData(oData);            //its a Custom function 

                },

                error: (oError) => {

                    console.error(
                        "Sales Order fetch failed:",
                        oError
                    );

                    MessageBox.error(
                        "Failed to fetch Sales Order data."
                    );
                }
            });
        },


        // Processing

        processSalesOrderData: function (oData) {


            // -----------------------------------------
            // IMPORTANT:
            // Adjust this after seeing your actual response
            // -----------------------------------------

            let aSalesOrders =
                oData.results;

                 let aSalesOrderlength =
                oData.results.length;

            console.log(
                "Sales Order records:",
                aSalesOrders,aSalesOrderlength
            );

            // -----------------------------------------
            // Get unique Model Families
            // -----------------------------------------
        let model_fam =  aSalesOrders.map((val)=>{
            return val.modelFamily.familyName;
          })

          console.log(model_fam);

          //set the model
        var mod = this.getOwnerComponent().getModel("QPRItems").getProperty("/modelFamilies");
        console.log(mod);
        
        for(let index of model_fam){
           mod.push(index);
        }
      
        
        this.getOwnerComponent().getModel("QPRItems").setProperty("/modelFamilies",mod);
          console.log(mod);
          



            // let oFamilyMap = {};

            // aSalesOrders.forEach((val)=> {

            //     let sModelFamily =
            //         oItem.modelFamily;

            //     if (sModelFamily) {

            //         oFamilyMap[sModelFamily] = {
            //             modelFamily: sModelFamily
            //         };
            //     }
            // });

            // let aModelFamilies =
            //     Object.values(oFamilyMap);

            // console.log(
            //     "Unique Model Families:",
            //     aModelFamilies
            // );

            // -----------------------------------------
            // Bind Model Families
            // -----------------------------------------

            // oQPRModel.setProperty(
            //     "/modelFamilies",
            //     aModelFamilies
            // );

            // // -----------------------------------------
            // // Make table visible
            // // -----------------------------------------

            // this.byId("QPRs").setVisible(true);
        },


        // =====================================================
        // SAVE
        // =====================================================

        onSave: function () {

            MessageToast.show(
                "QPR saved as draft."
            );
        },


        // =====================================================
        // SUBMIT
        // =====================================================

        onSubmit: function () {

            MessageBox.confirm(
                "Do you want to submit this QPR?",
                {
                    title: "Submit QPR",

                    onClose: function (sAction) {

                        if (
                            sAction ===
                            MessageBox.Action.OK
                        ) {

                            MessageToast.show(
                                "QPR submitted successfully."
                            );
                        }
                    }
                }
            );
        }

    });

});