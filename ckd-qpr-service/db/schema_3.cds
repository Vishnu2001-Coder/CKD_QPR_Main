namespace QPR.db;

using { ckd_qpr.db.ModelFamilies as ModelFamilies ,ckd_qpr.db.ModelGroups as ModelGroups,ckd_qpr.db.HUContainers as HandlingUnits,ckd_qpr.db.Parts as Parts } from './schema_1';
using { ckd_qpr.db1.Invoices as Invoices,ckd_qpr.db1.SalesOrders as SalesOrders ,ckd_qpr.db1.Employees as Employees , ckd_qpr.db1.Department as Departments } from './schema_2';


entity QPRs {
    key ID                     : UUID;

        qprNumber              : String(30);

        invoice                : Association to Invoices;

        salesOrder             : Association to SalesOrders;

        dateOfContainerReceipt : Date;
        unpackingDate          : Date;

        assembler              : Association to Employees;
        
        country                : String(100);

        department             : Association to Departments;
        plant                  : String(50);

        status                 : String(30);

        items                  : Composition of many QPRItems
                                     on items.qpr = $self;
}

entity QPRItems {
    key ID                  : UUID;

        qpr                 : Association to QPRs;

        modelFamily         : Association to ModelFamilies;
        modelGroup          : Association to ModelGroups;

        hu                  : Association to HandlingUnits;
        part                : Association to Parts;

        caseNumber          : String(50);

        invoiceQuantity     : Decimal(13, 3);
        claimQuantity       : Decimal(13, 3);

        uom                 : String(10);

        partCondition       : String(50);
        packagingCondition  : String(50);
        natureOfDefect      : String(100);
        replacementOrRework : String(30);

        remarks             : String(500);

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
