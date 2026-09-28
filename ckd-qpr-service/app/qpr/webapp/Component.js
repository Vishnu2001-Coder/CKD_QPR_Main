sap.ui.define([
    "sap/ui/core/UIComponent",
    "qpr/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
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
                        modelFamily: "",
                        modelGroup: "",
                        caseNumber: "",
                        huNumber: "",
                        partNo: "",
                        description: "",
                        quantity: "",
                        partCondition: "",
                        packagingCondition: "",
                        natureOfDefect: "",
                        replacementOrRework: "",
                        attachments: []
                    }
                ],
                modelFamilies: [],           //for DropDown

                modelGroups: []
            }

            var model = new JSONModel(QprModel);

            this.setModel(model, "QPRItems");

            // set the device model
            // this.setModel(models.createDeviceModel(), "device");

            // enable routing
            this.getRouter().initialize();
        }
    });
});