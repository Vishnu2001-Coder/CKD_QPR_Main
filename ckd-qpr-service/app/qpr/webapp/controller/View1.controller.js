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

        onInit() {
            let salesOrderID = {
                ID: "No sales order selected",
                recieptDate :"",
                unpackedDate:"",
                assemblerName:"Auto",
                country      : "Auto"
            };

            let salesOrderIDModel = new JSONModel(salesOrderID);
            this.getView().setModel(salesOrderIDModel, "salesOrderID");

            //1) get The smartFilterBar
            const mySmartFilterBar = this.byId("smartFilterBar");

            //2) after smartFilterBar Initialized
            mySmartFilterBar.attachInitialized(() => {
                //get the particular filter by key
                let invoiceFilter = mySmartFilterBar.getControlByKey("invoiceNo");
                //   console.log("hello");
                //check attachSelectionChangeProperty present in the filter
                if (invoiceFilter.attachSelectionChange) {
                    // console.log("hi");
                    invoiceFilter.attachSelectionChange(
                        this.onInvoiceFilterChange,
                        this,
                    );
                }
            });
        },
        onInvoiceFilterChange: async function (oEvent) {
            let invoiceValue = oEvent.getSource().getValue();
            //ckd service model
            let ckdModel = this.getView().getModel("ckd");

            //Read Invoices entity using expand
            ckdModel.read("/Invoices", {
                filters: [new Filter("invoiceNo", FilterOperator.EQ, invoiceValue)],
                urlParameters: {
                    $expand: "salesOrder",
                },
                success: (oData) => {
                    // console.log(oData);
                    let salesOrderNo = oData?.results[0].salesOrder.salesOrderNo;

                    //set salesOrderNo to the model
                    this.getView()
                        .getModel("salesOrderID")
                        .setProperty("/ID", salesOrderNo);
                },
                error: function (oError) {
                    console.log(oError);
                },
            });
        },

        onSave: function () {

            MessageToast.show(
                "QPR saved as draft."
            );

        },

        onSubmit: function () {

            MessageBox.confirm(
                "Do you want to submit this QPR?",
                {
                    title: "Submit QPR",

                    onClose: function (sAction) {

                        if (sAction === MessageBox.Action.OK) {

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