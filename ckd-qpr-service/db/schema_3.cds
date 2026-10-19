namespace QPR.db;

// using { ckd_qpr.db.ModelFamilies as ModelFamilies ,ckd_qpr.db.ModelGroups as ModelGroups,ckd_qpr.db.HUContainers as HandlingUnits,ckd_qpr.db.Parts as Parts } from './schema_1';
// using { ckd_qpr.db1.Invoices as Invoices,ckd_qpr.db1.SalesOrders as SalesOrders ,ckd_qpr.db1.Employees as Employees , ckd_qpr.db1.Department as Departments } from './schema_2';


entity QPRs {
    key ID                     : UUID;

        qprNumber              : String(30);

        invoice                : String(100); //Association to Invoices;

        salesOrder             : String(100); //Association to SalesOrders;

        dateOfContainerReceipt : Date;        //"10/7/26" doesnt accept Its a DataPicker , it accept this format "2026-10-05"
        unpackingDate          : Date;

        assembler              : String(100); //Association to Employees;

        country                : String(100);

        department             : String(100); //Association to Departments;
        plant                  : String(50);

        status_1               : String(30) default 'Pending';  // this default will be  store ,before store the data in database. we didnt send this data in logic side.
        status_2               : String(30) default 'Pending';
        status_3               : String(30) default 'Pending';
        status_4               : String(30) default 'Pending';

        items                  : Composition of many QPRItems
                                     on items.qpr = $self;
}

entity QPRItems {
    key ID                  : UUID;

        qpr                 : Association to QPRs;

        modelFamily         : String; // Association to ModelFamilies;

        modelGroup          : String; //  Association to ModelGroups;

        hu                  : String; //Association to HandlingUnits;

        part                : String; //Association to Parts;

        description         : String;

        caseNumber          : String(50);

        Quantity            : Integer;

        uom                 : String(10);

        partCondition       : String(50);

        packagingCondition  : String(50);

        natureOfDefect      : String(100);

        replacementOrRework : String(30);

        attachments         : Composition of many QPRAttachments
                                  on attachments.qprItem = $self;
}

entity QPRAttachments {
    key ID          : UUID;

        qprItem     : Association to QPRItems;

        fileName    : String(255);
        fileType    : String(100);

        fileContent : LargeBinary
        @Core.MediaType: fileType;
}
