sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Messaging"
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
                assemblerName: "",
                country: "",
                plant: "",
                department: "",

                items: []
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
                    $expand: "salesOrder($expand=plant($expand=departments($expand=employees)))"        //along with sales
                },

                success: (oData) => {

                    console.log("Full Response:", oData);

                    const invoice = oData?.results?.[0];

                    if (!invoice) {
                        console.log("Invoice not found");
                        return;
                    }

                    console.log("Invoice:", invoice);

                    // ------------------------------------------------
                    // SALES ORDER
                    // ------------------------------------------------

                    const salesOrder = invoice.salesOrder;

                    if (!salesOrder) {
                        console.log("Sales Order not found");
                        return;
                    }

                    console.log("Sales Order:", salesOrder);
                    console.log("Sales Order No:", salesOrder.salesOrderNo);
                    console.log("Sales Order ID:", invoice.salesOrder_ID);


                    // ------------------------------------------------
                    // SET SALES ORDER ID
                    // ------------------------------------------------

                    const oFilterDataModel = this.getView().getModel("FilterData");

                    oFilterDataModel.setProperty(
                        "/salesOrder_ID",
                        invoice.salesOrder_ID
                    );


                    // ------------------------------------------------
                    // SET SALES ORDER NUMBER
                    // ------------------------------------------------

                    oFilterDataModel.setProperty(
                        "/salesOrderNo",
                        salesOrder.salesOrderNo
                    );


                    // ------------------------------------------------
                    // PLANT
                    // ------------------------------------------------

                    const plant = salesOrder.plant;

                    if (!plant) {
                        console.log("Plant not found");
                        return;
                    }

                    console.log("Plant:", plant);


                    // ------------------------------------------------
                    // COUNTRY
                    // ------------------------------------------------

                    const country = plant.country;

                    oFilterDataModel.setProperty(
                        "/country",
                        country
                    );

                    console.log("Country:", country);


                    // ------------------------------------------------
                    // DEPARTMENTS
                    // ------------------------------------------------

                    const departments = plant.departments?.results || [];

                    console.log("Departments:", departments);


                    // Find RETURN_DEALER department

                    const returnDepartment = departments.find(
                        department =>
                            department.departmentType === "RETURN_DEALER"  // this becaome true , and retuen a this Objects
                    );

                    if (!returnDepartment) {
                        console.log("RETURN_DEALER department not found");
                        return;
                    }

                    console.log(
                        "RETURN_DEALER Department:",
                        returnDepartment
                    );


                    // ------------------------------------------------
                    // EMPLOYEES
                    // ------------------------------------------------

                    const employees =
                        returnDepartment.employees?.results || [];

                    console.log(
                        "RETURN_DEALER Employees:",
                        employees
                    );


                    // Find Manager

                    const manager = employees.find(
                        employee =>
                            employee.jobTitle === "Returns Manager"
                    );

                    if (!manager) {
                        console.log("Returns Manager not found");
                        return;
                    }


                    // ------------------------------------------------
                    // SET ASSEMBLER NAME
                    // ------------------------------------------------

                    const assemblerName = manager.employeeName;

                    oFilterDataModel.setProperty(
                        "/assemblerName",
                        assemblerName
                    );

                    console.log(
                        "Assembler Name:",
                        assemblerName
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


        //set all the 6 properties and fetch the SalesOrder Detatils
        onGo: function () {

            console.log("Hi im a Go");

            //Reset the all Input Box Except model family
            console.log("All input should getting empty");


            let empty = [{
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
                uom: "",
                attachments: []
            }]
             this.getOwnerComponent().getModel("QPRItems").setProperty("/items", empty);

            //File Uplaosder making as an empty
            let aUploaders = this.getView().findAggregatedObjects(true, function (oControl) {
                return oControl.isA("sap.ui.unified.FileUploader");
            });

            aUploaders.forEach(function (oUploader) {
                oUploader.clear();
            });

            // console.log("Uploaders found:", aUploaders.length);
            // console.log("Items after reset:", oModel.getProperty("/items"));

           


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
                oSalesOrderModel.getProperty("/salesOrder_ID");        //this is for dropDown Value List prupose


            // Department
            const oDepartment =
                this.byId("departmentCombo").getSelectedItem()?.getText();

            // Plant
            const oPlant =
                this.byId("plantCombo").getSelectedItem()?.getText();

            //Putting inside Objects ,because backend Purpose
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
            this.filterBarData = oFilterData;
            console.log(oFilterData);
            console.log(salesOrderID);

            // Get existing FilterData JSONModel
            const oFilterDataModel = this.getView().getModel("FilterData");

            // Update values
            oFilterDataModel.setProperty("/invoiceId", invoiceNo);
            oFilterDataModel.setProperty("/salesOrderNo", salesOrderNo);
            oFilterDataModel.setProperty("/recieptDate", sDateOfContainerReceipt);
            oFilterDataModel.setProperty("/unpackedDate", sUnpackingDate);
            oFilterDataModel.setProperty("/assemblerName", sAssembler);
            oFilterDataModel.setProperty("/country", sCountry);
            oFilterDataModel.setProperty("/department", oDepartment);
            oFilterDataModel.setProperty("/plant", oPlant);

            // Get complete FilterData object
            let filterModeldata = oFilterDataModel.getData();

            console.log("Filter Data:", filterModeldata);


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

            ckdModel.read("/SalesOrderItems", {      //slaesOrderItems table

                filters: [
                    new Filter(
                        "salesOrder_ID",
                        FilterOperator.EQ,
                        salesOrderID
                    )
                ],
                urlParameters: {
                    $expand: "modelFamily"          //along with 
                },



                success: (oData) => {

                    console.log("SalesItem  Response:", oData);
                    this.salesItemResponse = oData;

                    this.processSalesOrderData(oData);            //its a Custom function . So this is using then only our ui5 execute

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


        //Set the modelFamilies
        processSalesOrderData: function (oData) {

            let aSalesOrders = oData.results;                           //return a array of records 
            this.salesRecords = aSalesOrders;

            let aSalesOrderlength =                               //All datas conrtain in results
                oData.results.length;

            console.log(
                "Sales Order records:",
                aSalesOrders, aSalesOrderlength
            );

            //Getting and Storing Particluar Properties
            let model_fam = aSalesOrders.map((val) => {
                return { Id: val.modelFamily.ID, FamilyName: val.modelFamily.familyName, };
            })
            console.log("map", model_fam);

            let modelFamily1 = this.getOwnerComponent().getModel("QPRItems").setProperty("/modelFamilies", model_fam);   //set the data in json directly the array , beacuse i set the array .so directly. if it is a not a array mean , we need to use push.

            var mod = this.getOwnerComponent().getModel("QPRItems").getProperty("/modelFamilies");         // Checking 
            console.log("final Checking", mod);

        },

        //Get GroupCode From modelFamDropDown
        async modelFamDropDown(oEvent) {

            //get Path
            let path = oEvent.getSource().getBindingContext("QPRItems").getPath();
            console.log("path", path);

            path = path.split("/").pop(); //  ['', 'items', '0']
            console.log(path);

            // ComboBox
            let oComboBox = oEvent.getSource().getSelectedKey();       // it retuern the value , based on key    
            console.log("Selected Model Family ID:", oComboBox);
            this.selectedComboId = oComboBox;

            try {
                const odata = await this.getView().getModel("qpr").bindContext(`/ModelFamilies('${oComboBox}')`, null, { $expand: "modelGroups" }).requestObject();
                this.modelFamRes = odata;                                  //for description pupose
                let code = odata.modelGroups.groupCode;

                let selectedGroupName = odata.familyName;
                this.selectedModelName = selectedGroupName;

                this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/modelFamily`, this.selectedModelName);
                let getModelName = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/modelFamily`);
                console.log("Checking ModelName", getModelName);


                console.log(odata);
                console.log(code);
                this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/modelGroup`, code);           //set the group code
                console.log(this.getOwnerComponent().getModel("QPRItems").getProperty("/items"));

                this.addHuDropdown(path);
            }

            catch (err) {
                console.log("Error:");
            }
        },
        async addHuDropdown(path) {
            let huRes = await this.getView().getModel("qpr").bindList("/HUContainers", null, null, null, {
                $filter: `ModelFamilies_ID eq ${this.selectedComboId}`,
                $expand: "ModelFamilies"
            }).requestContexts();

            var huNumberObjects = huRes.map((res) => {
                return { Id: res.getObject().ID, huNumber: res.getObject().huNumber }
            });
            console.log("huNumberObjects :", huNumberObjects);

            this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/huNumbers`, huNumberObjects);
        },

        huno_Press(event) {                // the event is only trigger , when the dropDown value is select
            console.log("Hi im a huno_press");

            let path = event.getSource().getBindingContext("QPRItems").getPath();
            path = path.split("/").pop();

            let value = event.getSource().getSelectedKey();
            console.log("value :", value);

            this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/huNumber`, value);

            let checkHu = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/huNumbers`);
            let huId;
            let selecetedHuId = checkHu.forEach(val => {
                if (val.huNumber == value) {
                    huId = val.Id
                }
            })

            this.setPartsDropDown(path, huId);
        },

        async setPartsDropDown(path, huId) {
            var partsResponse = await this.getView().getModel("qpr").bindList("/Parts", null, null, null, { $filter: `huContainer_ID eq '${huId}'` }).requestContexts();
            var partNumbers = partsResponse.map(val => {
                return { partNo: val.getObject().partNumber }
            });
            console.log(partNumbers);
            this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/partNumbers`, partNumbers);

        },
        partno_Press(event) {
            console.log("Hi im a Part_press");

            let path = event.getSource().getBindingContext("QPRItems").getPath();
            path = path.split("/").pop();
            console.log("pat :", path);
            console.log(typeof (path));


            let input = event.getSource();


            let value = event.getSource().getSelectedKey();
            console.log("value :", value);

            let neccessaryIndex = Number(path) - 1;
            console.log(neccessaryIndex);


            // CHANGE 1: Create a flag
            let isDuplicate = false;

            if (path === "0") {
                input.setValueState("Success");
                input.setValueStateText("Valid Quantity");

                this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/partNo`, value);

                let checkPart = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/partNo`);
                console.log("checkPart :", checkPart);
                this.setDescription(path);

            }
            else {
                let checkPart = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items`);
                console.log(checkPart);
                checkPart.forEach((val, index) => {
                    if (index <= neccessaryIndex) {
                        console.log(index, neccessaryIndex);
                        console.log("outside If :", val.partNo, value);
                        if (val.partNo === value) {
                            console.log("Inside If :", val.partNo, value);
                            // CHANGE 2: Don't set ValueState here
                            isDuplicate = true;
                        }

                    }
                    if (isDuplicate) {

                        input.setValueState("Error");
                        input.setValueStateText("This Part Already Selected");

                    }
                    else {

                        input.setValueState("Success");
                        input.setValueStateText("Valid Quantity");

                        this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/partNo`, value);

                        let checkPart = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/partNo`);
                        console.log("checkPart :", checkPart);
                        this.setDescription(path);

                    }

                })
            }


        },

        setDescription(path) {

            console.log("im a description");

            let getCurntModel = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/modelFamily`);
            console.log("getCurntModel :", getCurntModel);
            console.log(this.modelFamRes.familyName);


            if (this.modelFamRes.familyName === getCurntModel) {
                console.log("Is there ");
                let descr;
                descr = this.modelFamRes.description;
                this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/description`, this.modelFamRes.description);
            }
            else {
                console.log("no family");
                this.salesRecords.forEach(val => {
                    if (val.modelFamily.familyName === getCurntModel) {
                        let descr;
                        descr = val.modelFamily.description;
                        this.getOwnerComponent().getModel("QPRItems").setProperty(`/items/${path}/description`, descr);
                    }
                })
            }


        },





        // async huno_Press(event) {
        //     let path = event.getSource().getBindingContext("QPRItems").getPath();
        //     path = path.split("/").pop();

        //     let curntModelName = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/modelFamily`);
        //     if (!curntModelName) {
        //         MessageBox.warning("Select a Model Family")

        //     }
        //     else {
        //         let modelGroup = this.getOwnerComponent().getModel("QPRItems").getProperty("/modelFamilies");
        //         console.log("modelGroup :", modelGroup);
        //         console.log("curntModel :", curntModelName);

        //         let curntModelFamId;
        //         modelGroup.forEach(val => {
        //             if (val.FamilyName == curntModelName) {
        //                 curntModelFamId = val.Id;
        //                 this.curntModelFamId = curntModelFamId;
        //                 console.log("curntModelFamId", curntModelFamId);
        //             }
        //         })
        //     }

        //     const huValue = event.getParameter("value");
        //     console.log(huValue);

        //     console.log(this.curntModelFamId);

        //     let huRes = await this.getView().getModel("qpr").bindList("/HUContainers", null, null, null, {
        //         $filter: `ModelFamilies_ID eq ${this.curntModelFamId}`,
        //         $expand: "ModelFamilies"
        //     }).requestContexts();

        //     var huNumberObjects = huRes.map((res) => {
        //         return { Id: res.getObject().ID, huNumber: res.getObject().huNumber }
        //     });
        //     console.log("huNumberObjects :", huNumberObjects);


        //     this.getOwnerComponent().getModel("QPRItems").setProperty("/huNumbers", huNumberObjects);


        //     console.log("huNumberObjects :",huNumberObjects);
        //     let oInput = event.getSource();                         // !!!
        //     let isValid = false;

        //     for (let hu of huNumberObjects) {
        //         if (hu === huValue) {
        //             console.log("hi", hu, huValue);
        //             isValid = true;
        //             break;
        //         }
        //     }

        //     if (isValid) {
        //         // HU is valid
        //         oInput.setValueState("Success");                   //!!!
        //         oInput.setValueStateText("Valid HU-Number");
        //         console.log(huValue);
        //         this.getHuId(huValue);                              // see this is controller Method

        //     } else {
        //         // HU is invalid
        //         console.log("hiError");

        //         oInput.setValueState("Error");
        //         oInput.setValueStateText("Invalid HU-Number");
        //     }

        // },

        // async getHuId(huValue) {
        //     var huResponse = await this.getView().getModel("qpr").bindList("/HUContainers", null, null, null, { $filter: `huNumber eq '${huValue}'`, }).requestContexts();
        //     console.log(huResponse);
        //     console.log(huResponse[0]);
        //     console.log("HUID :", huResponse[0].getObject().ID);

        //     let huId = huResponse[0].getObject().ID;

        //     this.getParts(huId);

        // },

        // async getParts(huId) {
        //     var partsResponse = await this.getView().getModel("qpr").bindList("/Parts", null, null, null, { $filter: `huContainer_ID eq '${huId}'` }).requestContexts();
        //     //this.partRes=partsResponse.map((val)=>{ return val.getObject()});
        //     let partsData = partsResponse.map((val) => { return val.getObject().partNumber });
        //     console.log("Parts", partsData);

        //     this.parts = partsData;

        // },

        // partno_Press(event) {
        //     let userPartInput = event.getParameter("value");
        //     let input = event.getSource();

        //     let rightInput = false;
        //     for (let index of this.parts) {
        //         console.log(index, this.parts);

        //         if (userPartInput === index) {
        //             this.partValue = userPartInput;
        //             rightInput = true;
        //             break;
        //         }
        //     }
        //     if (rightInput) {
        //         this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/partNo", userPartInput)
        //         input.setValueState("Success")
        //         input.setValueStateText("Valid Part Number")
        //         this.setDescription();
        //     }
        //     else {
        //         input.setValueState("Error")
        //         input.setValueStateText("InValid Part Number")
        //     }
        // },
        // setDescription() {
        //     console.log("Description :", this.modelFamRes.description);
        //     this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/description", this.modelFamRes.description);
        // },

        quantitySelect(event) {

            console.log("Hi quantity");

            let path = event.getSource().getBindingContext("QPRItems").getPath();
            path = path.split("/").pop();
            console.log("path :", path);


            let input = event.getSource();

            let model = this.getOwnerComponent().getModel("QPRItems").getProperty(`/items/${path}/modelFamily`);
            console.log("model :", model);                //Model


            if (model) {
                input.setValueState("Success")
                input.setValueStateText("Valid Quantity")
            }
            else {
                input.setValueState("Error");
                input.setValueStateText("Select the Model family ")
            }


            let modelFamilies = this.getOwnerComponent().getModel("QPRItems").getProperty(`/modelFamilies`);
            console.log(modelFamilies);

            let modelId;
            modelFamilies.forEach(val => {
                if (val.FamilyName === model) {
                    modelId = val.Id
                }
            })


            let userSelectedQuantity = event.getParameter("value")            //value
            console.log("user Selected Quantity :", userSelectedQuantity);
            console.log("SalesItem Response :", this.salesItemResponse);
            let salesRes = this.salesItemResponse.results;

            let orginalquantity = 0

            salesRes.forEach((val) => {
                if (val.modelFamily_ID === modelId) {
                    orginalquantity = val.quantity;
                }

            });
            console.log("orginalquantity :", orginalquantity);
            // let input = event.getSource();

            if (userSelectedQuantity <= orginalquantity) {
                console.log("before setmodel", userSelectedQuantity);
                this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/quantity", userSelectedQuantity);


                input.setValueState("Success")
                input.setValueStateText("Valid Quantity")

            }
            else {
                input.setValueState("Error");
                input.setValueStateText("Quantity is High then Order")
            }
        },
        selectPartCondition(event) {
            console.log("selectPartCondition");
            let part = event.getSource().getSelectedKey();
            console.log(part);

            this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/partCondition", part);

        },
        selectPackageCondition(event) {
            console.log("selectPackageCondition");

            let packageCon = event.getSource().getSelectedKey();
            console.log(packageCon);

            this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/packagingCondition", packageCon);


        },
        selectNatureOfDefect(event) {
            console.log("selectNatureOfDefect");
            let natureOfDefect = event.getSource().getSelectedKey();
            console.log(natureOfDefect);

            this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/natureOfDefect", natureOfDefect)
        },
        selectReplacementOrRework(event) {
            console.log("selectReplacementOrRework");


            let replacementOrRework = event.getSource().getSelectedKey();
            console.log(replacementOrRework);

            this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/replacementOrRework", replacementOrRework)

        },
        selectUOM(event) {
            console.log("uom");


            let uom = event.getSource().getSelectedKey();
            console.log(uom);

            this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/uom", uom)



        },
        onImageUpload: function (oEvent) {

            // Get row path
            let path = oEvent.getSource()
                .getBindingContext("QPRItems")
                .getPath();

            console.log("Path:", path);

            path = path.split("/").pop();   // ['', 'items', '0']
            console.log("Row Index:", path);

            // Get FileUploader
            let oUploader = oEvent.getSource();
            console.log("Uploader:", oUploader);    // i dont know why 

            // Get selected files
            let aFiles = oEvent.getParameter("files");

            if (!aFiles || aFiles.length === 0) {
                sap.m.MessageToast.show("Please select files.");
                return;
            }

            console.log("Selected Files:", aFiles);
            console.log("Total Files:", aFiles.length);

            // Get QPRItems model
            let oModel =
                this.getOwnerComponent().getModel("QPRItems");

            // Get current row attachments
            let aAttachments =
                oModel.getProperty(`/items/${path}/attachments`) || [];

            console.log(
                "Existing Attachments:",
                aAttachments
            );

            // Read every selected file
            for (let i = 0; i < aFiles.length; i++) {

                let oFile = aFiles[i];

                console.log("File Name:", oFile.name);
                console.log("File Type:", oFile.type);
                console.log("File Size:", oFile.size);

                let oReader = new FileReader();

                oReader.onload = (event) => {

                    // Get Base64 data
                    let sDataUrl = event.target.result;

                    let sBase64 =
                        sDataUrl.split(",")[1];

                    console.log(
                        "Base64 created for:",
                        oFile.name
                    );

                    // Get latest attachments
                    let aAttachments =
                        oModel.getProperty(
                            `/items/${path}/attachments`
                        ) || [];

                    // Check duplicate file
                    let bAlreadyExists =
                        aAttachments.some(function (oAttachment) {

                            return (
                                oAttachment.Filename === oFile.name &&
                                oAttachment.Mimetype === oFile.type
                            );

                        });

                    if (bAlreadyExists) {

                        console.log(
                            "File already exists:",
                            oFile.name
                        );

                        return;
                    }

                    // Create attachment object
                    let attachment = {

                        Filename: oFile.name,

                        Mimetype: oFile.type,

                        DecodedValue: sBase64

                    };

                    // Add attachment
                    aAttachments.push(attachment);

                    // Set attachment array
                    oModel.setProperty(
                        `/items/${path}/attachments`,
                        aAttachments
                    );

                    console.log(
                        "Attachment Added:",
                        attachment
                    );

                    console.log(
                        "Current Attachments:",
                        oModel.getProperty(
                            `/items/${path}/attachments`
                        )
                    );
                };

                // Read file
                oReader.readAsDataURL(oFile);
            }

            sap.m.MessageToast.show(
                aFiles.length + " file(s) selected."
            );
        },
        onFileUploaderChange: function (oEvent) {

            // Get row path
            let path = oEvent.getSource()
                .getBindingContext("QPRItems")
                .getPath();

            console.log("FileUploader Change Path:", path);

            path = path.split("/").pop();

            console.log(
                "FileUploader Row Index:",
                path
            );

            // Get FileUploader
            let oUploader = oEvent.getSource();

            // Get current files from FileUploader
            let aFiles = oEvent.getParameter("files");

            // QPRItems model
            let oModel =
                this.getOwnerComponent().getModel("QPRItems");

            // Current attachments
            let aAttachments =
                oModel.getProperty(
                    `/items/${path}/attachments`
                ) || [];

            console.log(
                "Before Sync:",
                aAttachments
            );

            /*
             * If FileUploader has no files,
             * remove all attachments from this row.
             */
            if (!aFiles || aFiles.length === 0) {

                oModel.setProperty(
                    `/items/${path}/attachments`,
                    []
                );

                console.log(
                    "All files removed from FileUploader."
                );

                console.log(
                    "Attachments after remove:",
                    oModel.getProperty(
                        `/items/${path}/attachments`
                    )
                );

                return;
            }

            /*
             * Create list of files currently
             * available in FileUploader.
             */
            let aCurrentFileNames = [];

            for (let i = 0; i < aFiles.length; i++) {

                aCurrentFileNames.push(
                    aFiles[i].name
                );
            }

            console.log(
                "Current FileUploader Files:",
                aCurrentFileNames
            );

            /*
             * Remove attachments which no longer
             * exist in FileUploader.
             */
            aAttachments = aAttachments.filter(
                function (oAttachment) {

                    return aCurrentFileNames.includes(
                        oAttachment.Filename
                    );

                }
            );

            /*
             * Update model
             */
            oModel.setProperty(
                `/items/${path}/attachments`,
                aAttachments
            );

            console.log(
                "After Sync:",
                aAttachments
            );
        },
        onPreviewImages: function (oEvent) {

            // Get row path
            let path = oEvent.getSource()
                .getBindingContext("QPRItems")
                .getPath();

            console.log(
                "Preview Path:",
                path
            );

            path = path.split("/").pop();

            console.log(
                "Preview Row Index:",
                path
            );

            // Get QPRItems model
            let oModel =
                this.getOwnerComponent().getModel("QPRItems");

            // Get attachments
            let aImages =
                oModel.getProperty(
                    `/items/${path}/attachments`
                ) || [];

            console.log(
                "Preview Attachments:",
                aImages
            );

            console.log(
                "Preview Files:",
                aImages.length
            );

            if (aImages.length === 0) {

                sap.m.MessageToast.show(
                    "No images uploaded for this row."
                );

                return;
            }

            // Create dialog
            let oDialog = new sap.m.Dialog({

                title: "Uploaded Images",

                contentWidth: "700px",

                contentHeight: "500px",

                stretchOnPhone: true,

                resizable: true,

                draggable: true,

                horizontalScrolling: false,

                verticalScrolling: true,

                beginButton: new sap.m.Button({

                    text: "Close",

                    press: function () {

                        oDialog.close();

                    }

                }),

                afterClose: function () {

                    oDialog.destroy();

                }

            });

            // Add images
            aImages.forEach(function (oDoc) {

                let sMimeType =
                    (oDoc.Mimetype || "").toLowerCase();

                let sBase64 =
                    oDoc.DecodedValue || "";

                if (sMimeType.indexOf("image/") === 0) {

                    let oImage = new sap.m.Image({

                        width: "450px",

                        height: "300px",

                        densityAware: false,

                        decorative: false,

                        src:
                            "data:" +
                            sMimeType +
                            ";base64," +
                            sBase64

                    });

                    let oFileName = new sap.m.Text({

                        text:
                            oDoc.Filename || "Image",

                        textAlign: "Center",

                        width: "100%"

                    });

                    let oImageBox = new sap.m.VBox({

                        width: "100%",

                        alignItems: "Center",

                        justifyContent: "Center",

                        items: [

                            oImage,

                            oFileName

                        ]

                    });

                    oDialog.addContent(
                        oImageBox
                    );
                }

            });

            oDialog.open();
        },

        // onImageUpload(event) { //5 steps access the file , read the file using read As Array buffer, convert to Uint8Array because we access , and convert to Charcter , and convert to Base64 .
        //     console.log("Hi im file");

        //     let file = event.getParameter("files")[0];     //[0] is mandatory

        //     console.log(file);
        //     console.log("File Name:", file.name);
        //     console.log("File Type:", file.type);
        //     console.log("File Size:", file.size);

        //     // we read the file help of FileReader and readadArrayBuffer
        //     let reader = new FileReader();                                      //browser Object
        //     reader.readAsArrayBuffer(file)                                      //this componet only read our file

        //     //After Read the file , this reload function automattically Execute
        //     reader.onload = (event) => {
        //         console.log(event.target.result);                                // this a converted as Binary data  , but not index based . so, we cant access    | binary data ->low level 0 and 1 , ultimatly level  bytes 21, 137 like this 

        //         let accessImage = new Uint8Array(event.target.result);           // using Uint8Array , we can access a each binary code(Byte).
        //         console.log(accessImage);

        //         //Convert Ascii Value(byte) to form of String (Combine the Unique Character )
        //         let binaryString = "";
        //         for (let index of accessImage) {
        //             binaryString += String.fromCharCode(index);
        //         }
        //         console.log(binaryString);

        //         let base64 = btoa(binaryString);
        //         console.log(base64);                   //when payload this json only accept this base 64 not byte 


        //         let attachment = {
        //             fileName: file.name,
        //             fileType: file.type,
        //             fileContent: base64
        //         }

        //         let att = this.getOwnerComponent().getModel("QPRItems").getProperty("/items/0/attachments");
        //         att.push(attachment);                  //its a object not a array. so , i use push to store . otherwise i use set directly 

        //         this.getOwnerComponent().getModel("QPRItems").setProperty("/items/0/attachments", att);

        //         let attCheck = this.getOwnerComponent().getModel("QPRItems").getProperty("/items/0/attachments");
        //         console.log(attCheck);

        //     }

        // },


        onAddRow() {  //create a empty json object, just push to the existing json array properties and set those

            let items = this.getOwnerComponent().getModel("QPRItems").getProperty("/items")

            let newItem = {
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
                uom: "",
                attachments: []
            };

            items.push(newItem);

            this.getOwnerComponent().getModel("QPRItems").setProperty("/items", items);
            console.log(items);
        },

        onDeleteRow: function () {

            let oTable = this.byId("QPRs");

            // Get all selected rows
            let aSelectedItems = oTable.getSelectedItems();      // this is for getSelectedItem for single thing , this items for multiple rows

            console.log("Selected Items:", aSelectedItems);

            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select a row to delete.");
                return;
            }

            let oModel = this.getOwnerComponent().getModel("QPRItems");

            let aItems = oModel.getProperty("/items");

            // Get indexes of selected rows
            let aIndexes = aSelectedItems.map(function (oItem) {

                let sPath = oItem
                    .getBindingContext("QPRItems")
                    .getPath();

                console.log("Selected Path:", sPath);

                return parseInt(sPath.split("/").pop());
            });

            console.log("Selected Indexes:", aIndexes);

            // IMPORTANT:
            // Delete from highest index to lowest index
            aIndexes.sort(function (a, b) {
                return b - a;
            });

            aIndexes.forEach(function (iIndex) {
                aItems.splice(iIndex, 1);
            });

            // Update model
            oModel.setProperty("/items", aItems);

            // Clear selection
            oTable.removeSelections(true);

            sap.m.MessageToast.show(
                aIndexes.length + " row(s) deleted successfully."
            );
        },

        // =====================================================
        // SAVE
        // =====================================================

        onSave: function () {

            console.log("Hi save");
            console.log("filterBarData", this.filterBarData);

            let items = this.getOwnerComponent().getModel("QPRItems").getProperty("/items")

            console.log("items", items);
            MessageToast.show(
                "QPR saved as draft."
            );
        },
        formatDateForCAP: function (sDate) {

            if (!sDate) {
                return null;
            }

            let oDate = new Date(sDate);

            if (isNaN(oDate.getTime())) {
                return null;
            }

            let sYear = oDate.getFullYear();
            let sMonth = String(oDate.getMonth() + 1).padStart(2, "0");
            let sDay = String(oDate.getDate()).padStart(2, "0");

            return sYear + "-" + sMonth + "-" + sDay;
        },

        // =====================================================
        // SUBMIT
        // =====================================================

        onSubmit: function () {



            let filterModeldata = this.getView().getModel("FilterData").getData();  //getData(), because we wnat to get the all the data. 

            let qprItemsJsonModel = this.getOwnerComponent().getModel("QPRItems").getProperty("/items");

            console.log("Filter Data:", filterModeldata);
            console.log("QPR Items:", qprItemsJsonModel);


            // =====================================================
            // 2. HEADER VALIDATION
            // =====================================================

            if (!filterModeldata.invoiceId) {
                MessageBox.warning("Please select an Invoice.");
                return;
            }

            if (!filterModeldata.salesOrder_ID) {
                MessageBox.warning("Please select an Invoice first.");
                return;
            }

            if (!filterModeldata.recieptDate) {
                MessageBox.warning(
                    "Please select Date of Container Receipt."
                );
                return;
            }

            if (!filterModeldata.unpackedDate) {
                MessageBox.warning(
                    "Please select Unpacking Date."
                );
                return;
            }

            if (!filterModeldata.plant) {
                MessageBox.warning(
                    "Plant information is not available for the selected Invoice."
                );
                return;
            }

            if (!filterModeldata.department) {
                MessageBox.warning(
                    "Department information is not available for the selected Invoice."
                );
                return;
            }

            let oPayload = {
                invoice: filterModeldata.invoiceId,
                salesOrder: filterModeldata.salesOrder_ID,
                dateOfContainerReceipt: this.formatDateForCAP(filterModeldata.recieptDate),
                unpackingDate: this.formatDateForCAP(filterModeldata.unpackedDate),
                assembler: filterModeldata.assemblerName,
                country: filterModeldata.country,
                plant: filterModeldata.plant,
                department: filterModeldata.department,

                items: []
            };


            // =====================================================
            // 3. ITEM VALIDATION
            // =====================================================
            if (
                !qprItemsJsonModel ||
                qprItemsJsonModel.length === 0
            ) {
                MessageBox.warning(
                    "Please add at least one QPR item."
                );
                return;
            }
            // =====================================================
            // 4. ITEM VALIDATION + DUPLICATE PART VALIDATION
            // =====================================================

            let aParts = [];

            for (let i = 0; i < qprItemsJsonModel.length; i++) {

                let oRow = qprItemsJsonModel[i];
                let iRow = i + 1;


                // =====================================================
                // MODEL FAMILY
                // =====================================================

                if (!oRow.modelFamily || oRow.modelFamily.trim() === "") {
                    MessageBox.warning(
                        "Please select Model Family in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // MODEL GROUP
                // =====================================================

                if (!oRow.modelGroup || oRow.modelGroup.trim() === "") {
                    MessageBox.warning(
                        "Please select Model Group in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // HU NUMBER
                // =====================================================

                if (!oRow.huNumber || oRow.huNumber.trim() === "") {
                    MessageBox.warning(
                        "Please select HU in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // PART NUMBER
                // =====================================================

                if (!oRow.partNo || oRow.partNo.trim() === "") {
                    MessageBox.warning(
                        "Please select Part Number in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // DESCRIPTION
                // =====================================================

                if (!oRow.description || oRow.description.trim() === "") {
                    MessageBox.warning(
                        "Description is missing in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // CASE NUMBER
                // =====================================================

                if (!oRow.caseNumber || oRow.caseNumber.trim() === "") {
                    MessageBox.warning(
                        "Please enter Case Number in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // QUANTITY
                // =====================================================

                if (
                    oRow.quantity === "" ||
                    oRow.quantity === null ||
                    oRow.quantity === undefined ||
                    isNaN(Number(oRow.quantity)) ||
                    Number(oRow.quantity) <= 0
                ) {
                    MessageBox.warning(
                        "Please enter a valid Quantity in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // UOM
                // =====================================================

                if (!oRow.uom || oRow.uom.trim() === "") {
                    MessageBox.warning(
                        "Please select UOM in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // PART CONDITION
                // =====================================================

                if (!oRow.partCondition || oRow.partCondition.trim() === "") {
                    MessageBox.warning(
                        "Please select Part Condition in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // PACKAGING CONDITION
                // =====================================================

                if (
                    !oRow.packagingCondition ||
                    oRow.packagingCondition.trim() === ""
                ) {
                    MessageBox.warning(
                        "Please select Packaging Condition in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // NATURE OF DEFECT
                // =====================================================

                if (
                    !oRow.natureOfDefect ||
                    oRow.natureOfDefect.trim() === ""
                ) {
                    MessageBox.warning(
                        "Please select Nature of Defect in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // REPLACEMENT / REWORK
                // =====================================================

                if (
                    !oRow.replacementOrRework ||
                    oRow.replacementOrRework.trim() === ""
                ) {
                    MessageBox.warning(
                        "Please select Replacement / Rework in row " + iRow
                    );
                    return;
                }


                // =====================================================
                // ATTACHMENTS
                // =====================================================

                if (
                    !oRow.attachments ||
                    !Array.isArray(oRow.attachments) ||
                    oRow.attachments.length === 0
                ) {
                    MessageBox.warning(
                        "Please upload at least one attachment in row " + iRow
                    );
                    return;
                }

                // =====================================================
                // DUPLICATE PART VALIDATION
                // =====================================================

                if (aParts.includes(oRow.partNo)) {

                    MessageBox.error(
                        "Duplicate Part Number: " +
                        oRow.partNo +
                        "\n\nThe same part cannot be selected twice."
                    );

                    return;
                }

                aParts.push(oRow.partNo);
            }



            qprItemsJsonModel.forEach((oRow) => {
                let oItem = {
                    modelFamily: oRow.modelFamily,
                    modelGroup: oRow.modelGroup,
                    hu: oRow.huNumber,
                    part: oRow.partNo,
                    description: oRow.description,
                    caseNumber: oRow.caseNumber,
                    Quantity: Number(oRow.quantity),
                    uom: oRow.uom,
                    partCondition: oRow.partCondition,
                    packagingCondition: oRow.packagingCondition,
                    natureOfDefect: oRow.natureOfDefect,
                    replacementOrRework: oRow.replacementOrRework,

                    attachments: (oRow.attachments).map(function (oAttachment) {

                        return {
                            fileName: oAttachment.Filename,
                            fileType: oAttachment.Mimetype,
                            fileContent: oAttachment.DecodedValue
                        };

                    })
                };

                oPayload.items.push(oItem);
            });

            console.log("========== QPR PAYLOAD ==========");
            console.log("Invoice:", oPayload.invoice);
            console.log("Sales Order:", oPayload.salesOrder);
            console.log(
                "Date of Container Receipt:",
                oPayload.dateOfContainerReceipt
            );
            console.log(
                "Unpacking Date:",
                oPayload.unpackingDate
            );
            console.log("Assembler:", oPayload.assembler);
            console.log("Country:", oPayload.country);
            console.log("Items:", oPayload.items);

            console.log(
                "Total Payload Size:",
                (JSON.stringify(oPayload).length / 1024 / 1024).toFixed(2),
                "MB"
            );

            console.log("================================");

            console.log(oPayload);




            MessageBox.confirm(
                "Do you want to submit this QPR?",
                {
                    title: "Submit QPR",

                    onClose: function (sAction) {

                        if (sAction !== MessageBox.Action.OK) {
                            return;
                        }

                        // =====================================================
                        // ODATA V2 POST
                        // =====================================================

                        let oQPRRequestModel =
                            this.getOwnerComponent().getModel();

                        if (!oQPRRequestModel) {
                            MessageBox.error(
                                "QPR Request OData V2 model is not configured."
                            );
                            return;
                        }

                        oQPRRequestModel.create("/QPRs", oPayload,
                            {
                                success: function (oData) {

                                    console.log("QPR POST Response:", oData);

                                    MessageBox.success(
                                        "QPR submitted successfully.\n\n" +
                                        "QPR Number: " +
                                        oData.qprNumber,
                                        {
                                            title: "QPR Submitted"
                                        }
                                    );

                                },

                                error: function (oError) {

                                    console.error(
                                        "QPR POST Error:",
                                        oError
                                    );

                                    let sErrorMessage =
                                        "Failed to submit QPR.";

                                    try {

                                        let oErrorResponse =
                                            JSON.parse(oError.responseText);

                                        if (
                                            oErrorResponse.error &&
                                            oErrorResponse.error.message
                                        ) {
                                            sErrorMessage =
                                                oErrorResponse.error.message.value ||
                                                oErrorResponse.error.message;
                                        }

                                    } catch (e) {
                                        console.error(
                                            "Error response parsing failed:",
                                            e
                                        );
                                    }

                                    MessageBox.error(
                                        sErrorMessage
                                    );
                                }
                            }
                        );
                    }.bind(this)
                }
            );
        }
    });
});