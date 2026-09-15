namespace ckd_qpr.db1;

using
{
    cuid,
    managed
}
from '@sap/cds/common';

using { ckd_qpr.db.ModelFamilies as ModelFamilies } from './schema_1';

using { ckd_qpr.db_types as reusabletypes } from './types';

entity Plants : cuid, managed
{
    plantCode : String(10) not null;
    address : String(255);
    city : String(50);
    state : String(50);
    country : String(50);
    plantName : String(100) not null;
    plantType : reusabletypes.PlantType
        @assert.range : [MANUFACTURING, ASSEMBLY, WAREHOUSE];
    departments : Composition of many Department on departments.plant = $self;
    status : reusabletypes.PlantStatus
        @assert.range : [ACTIVE, INACTIVE];
}

annotate Plants with @assert.unique :
{
    PlantCode : [ plantCode ],
};

entity Department : cuid, managed
{
    departmentCode : String(20) not null;
    departmentName : String(100) not null;
    departmentType : reusabletypes.DepartmentType
        @assert.range : [ORDER_DEALER, RETURN_DEALER];
    status : reusabletypes.DepartmentStatus
        @assert.range : [ACTIVE, INACTIVE];
    plant : Association to one Plants;
    employees : Composition of many Employees on employees.department = $self;
}

annotate Department with @assert.unique :
{
    DepartmentCode : [ plant, departmentCode ],
};

entity Employees : cuid, managed
{
    employeeCode : String(20) not null;
    employeeName : String(100) not null;
    email : String(100)
        @assert.format : '^[A-Za-z0-9_]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$';

    /**
     * 1) Username : A-Z or a-z or 0-9 or _
     * 2) Doamin after @ : A-Z or a-z or dot . -
     * 3) Since \ and dot has special meaning in regex
     *     3.1) First we escape the the backslash for that we are using first backslash
     *     3.2) Second backslash is for escaping dot
     * 4) At last it can be org,in,com it can be 2 character or more that that
     */
    phone : String(20)
        @assert.format : '^\\+[1-9][0-9]{7,14}$';

    /**
     * 1) it should start with '+' Sign
     * 2) Number should start with numbers within 1 to 9
     * 3) followed by 7 to 14 digits
     */
    jobTitle : String(100);
    employeeType : reusabletypes.EmployeeType
        @assert.range : [PERMANENT, CONTRACT];
    department : Association to one Department;
    status : reusabletypes.EmployeeStatus
        @assert.range : [ACTIVE, INACTIVE];
}

annotate Employees with @assert.unique :
{
    EmployeeCode : [ employeeCode ],
};

entity SalesOrders : cuid, managed
{
    salesOrderNo : String(20) not null;
    orderDate : Date;
    plant : Association to one Plants;
    totalOrderPrice : Decimal(15,2);
    currency : String(3);
    status : reusabletypes.SalesOrderStatus
    @assert.range : [CREATED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED];
    items : Composition of many SalesOrderItems on items.salesOrder = $self;
}

annotate SalesOrders with @assert.unique :
{
    SalesOrderNo : [ salesOrderNo ],
};

entity SalesOrderItems : cuid, managed
{
    salesOrder : Association to one SalesOrders;
    itemNo : Integer not null;
    modelFamily : Association to one ModelFamilies;
    quantity : Integer not null;
    unitPrice : Decimal(15,2);
    totalItemPrice : Decimal(15,2);
    currency : String(3);
}

annotate SalesOrderItems with @assert.unique :
{
    ItemNo : [ salesOrder, itemNo ],
};

entity Invoices : cuid, managed
{
    invoiceNo : String(20) not null;
    invoiceDate : Date;
    dueDate : Date;
    salesOrder : Association to one SalesOrders;
    netAmount : Decimal(15,2);
    taxAmount : Decimal(15,2);
    totalAmount : Decimal(15,2);
    currency : String(3);
    status : reusabletypes.InvoiceStatus
        @assert.range : [DRAFT, POSTED, PAID, CANCELLED];
}

annotate Invoices with @assert.unique :
{
    InvoiceNo : [ invoiceNo ],
    uniqueSalesOrder : [ salesOrder ],
};

