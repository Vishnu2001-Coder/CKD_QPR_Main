namespace ckd_qpr.db1;
using {cuid,managed} from '@sap/cds/common';

using {ckd_qpr.db.ModelFamilies as ModelFamilies} from './schema_1';
using {ckd_qpr.db_types as reusabletypes} from './types';

// 1) Avalible Plants Across multiple Country
entity Plants : cuid, managed {
    plantCode   : String(10) not null;
    address     : String(255);
    city        : String(50);
    state       : String(50);
    country     : String(50);
    plantName  : String(100) not null;                                //!!!
    plantType   : reusabletypes.PlantType   @assert.range: [
        MANUFACTURING,
        ASSEMBLY,
        WAREHOUSE
    ];
    departments : Composition of many Department
                      on departments.plant = $self; //orderdealer , return dealer
    status      : reusabletypes.PlantStatus @assert.range: [
        ACTIVE,
        INACTIVE
    ]; // ACTIVE, INACTIVE
};


//2) Departments in the plant
entity Department : cuid, managed {

    departmentCode : String(20) not null;
    departmentName : String(100) not null;
    departmentType : reusabletypes.DepartmentType;
    status         : reusabletypes.DepartmentStatus;
    plant          : Association to Plants;
    employees      : Composition of many Employees
                         on employees.department = $self
};

//3) Employees in the Department
entity Employees : cuid, managed {
    employeeCode : String(20) not null;
    employeeName : String(100) not null;
    email        : String(100) @assert.format:'^[A-Za-z0-9_]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'; 
    /**
     * 1) Username : A-Z or a-z or 0-9 or _
     * 2) Doamin after @ : A-Z or a-z or dot . -
     * 3) Since \ and dot has special meaning in regex 
     *     3.1) First we escape the the backslash for that we are using first backslash
     *     3.2) Second backslash is for escaping dot
     * 4) At last it can be org,in,com it can be 2 character or more that that
     */
    phone        : String(20) @assert.format:'^\\+[1-9][0-9]{7,14}$';
    /**
     * 1) it should start with '+' Sign
     * 2) Number should start with numbers within 1 to 9
     * 3) followed by 7 to 14 digits
     */
    jobTitle     : String(100);
    employeeType : reusabletypes.EmployeeType;
    department   : Association to Department;
    status       : reusabletypes.EmployeeStatus;
};

//4) SalesOrder Header
entity SalesOrders : cuid, managed {
    salesOrderNo    : String(20) not null;
    orderDate       : Date;
    plant           : Association to Plants;
    totalOrderPrice : Decimal(15, 2);
    currency        : String(3);
    status          : String(30);
    items           : Composition of many SalesOrderItems
                          on items.salesOrder = $self;
// CREATED, CONFIRMED, IN_PROGRESS,
// COMPLETED, CANCELLED
};


//5) SalesOrder Line item;
entity SalesOrderItems : cuid, managed {
    salesOrder     : Association to SalesOrders;
    itemNo         : Integer not null;
    modelFamily    : Association to ModelFamilies;
    quantity       : Integer not null;
    unitPrice      : Decimal(15, 2);
    totalItemPrice : Decimal(15, 2);
   currency       : String(3);                                                //!!!
};

//6) Invoice
entity Invoices : cuid, managed {

    invoiceNo    : String(20) not null;
    invoiceDate  : Date;
    dueDate      : Date;
    salesOrder   : Association to SalesOrders;                //@aeerrt 
    netAmount    : Decimal(15, 2); 
    taxAmount    : Decimal(15, 2);
    totalAmount  : Decimal(15, 2);
    currency     : String(3);
    status       : reusabletypes.InvoiceStatus;
};

//Unique capabiltiy Imposing
//-------------------------------
//1)One Invoice cannot point to multiple sales Order (strict one to one)
annotate Invoices with @assert.unique:{
    uniqueSalesOrder:[salesOrder]
};

//2)
annotate Plants with @assert.unique: {
    PlantCode: [plantCode]
};

//3)
annotate Department with @assert.unique: {
    DepartmentCode : [departmentCode]
};

//4)
annotate Employees with @assert.unique:{
     EmployeeCode : [employeeCode]
};

//5)
annotate SalesOrders with @assert.unique:{
    SalesOrderNo : [salesOrderNo]
};

//6)
annotate SalesOrderItems with @assert.unique:{
     ItemNo : [salesOrder,itemNo]
};

//7)
annotate Invoices with @assert.unique:{
     InvoiceNo:[invoiceNo]
};


