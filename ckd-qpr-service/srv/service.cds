using { ckd_qpr.db as db } from '../db/schema_1';
using { ckd_qpr.db1 as db1} from '../db/schema_2';

//CKDQPRMasterDataServices

@readonly
service QPRService {
    entity ModelGroups   as projection on db.ModelGroups;
    entity ModelFamilies as projection on db.ModelFamilies;
    entity HUContainers  as projection on db.HUContainers;
    entity Parts         as projection on db.Parts;
}



service CKDService {
    entity Plants          as projection on db1.Plants;
    entity Department      as projection on db1.Department;
    entity Employees       as projection on db1.Employees;
    entity SalesOrders     as projection on db1.SalesOrders;
    entity SalesOrderItems as projection on db1.SalesOrderItems;
    entity Invoices        as projection on db1.Invoices;
}