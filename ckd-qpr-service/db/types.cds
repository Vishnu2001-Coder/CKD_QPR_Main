namespace ckd_qpr.db_types;
//Plant live status
type PlantStatus      : String enum {
    ACTIVE;
    INACTIVE;
};

//Processing the kit (Return Dealer) - Replace Requesting plant (Order Dealer)
type DepartmentType   : String enum {
    ORDER_DEALER;
    RETURN_DEALER;
};

//Whether Department is running on the plant or not
type DepartmentStatus : String enum {
    ACTIVE;
    INACTIVE;
};


// Whether it is Manufacturing plant or Assembly plant
type PlantType : String enum {
   MANUFACTURING;
   ASSEMBLY;
   WAREHOUSE;
};

// Whether employee is temporary or permanent
type EmployeeType : String enum {
    PERMANENT;
    CONTRACT;
};

//Employee Working Status
type EmployeeStatus : String enum {
    ACTIVE;
    INACTIVE;
};

// invoice status DRAFT, POSTED, PAID, CANCELLED
type InvoiceStatus : String enum {
    DRAFT;
    POSTED;
    PAID;
    CANCELLED;
}