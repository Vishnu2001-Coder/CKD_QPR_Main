sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (
    Controller,
    MessageBox,
    MessageToast
) {
    "use strict";

    return Controller.extend("qpr.controller.View1", {

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