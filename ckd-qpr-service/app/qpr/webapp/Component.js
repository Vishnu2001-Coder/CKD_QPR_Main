sap.ui.define([
    "sap/ui/core/UIComponent",
    "qpr/model/models",
    "sap/ui/model/json/JSONModel",
    "sap/ushell/Container"
], (UIComponent, models, JSONModel, Container) => {
    "use strict";

    return UIComponent.extend("qpr.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            var QprModel = {
                items: [
                    {
                        modelFamily: "",     //change
                        modelGroup: "",     // model
                        caseNumber: "",     //
                        huNumber: "",
                        partNo: "",
                        description: "",
                        quantity: "",
                        partCondition: "",
                        packagingCondition: "",
                        natureOfDefect: "",
                        replacementOrRework: "",
                        uom: "",
                        attachments: [],

                        huNumbers: [],
                        partNumbers: []
                    }
                ],
                modelFamilies: [],           //for DropDown -> {id : "", familyNAme :""}

            }

            var model = new JSONModel(QprModel);

            this.setModel(model, "QPRItems");

            // set the device model
            // this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();

        try{
            if (Container && typeof Container.getUser==="function") {
                let details = Container.getUser();         //Actuaaly .the ushell contanier communicate with BuildWorkZone fiori Shell , and get user details.
                console.log(details.getEmail());           //Only work on BuildWorkzone , Throw Exception running locally and Html5 Repo
                console.log(details.getFirstName());
            }
          }
            catch(err){
                   console.log(err.message ,"Not Avilable the Launpad");

            }







        }
    });
});