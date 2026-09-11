namespace ckd_qpr.db;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity ModelGroups : cuid, managed {

    groupCode   : String(20) not null;
    groupName   : String(100) not null;

    modelFamily : Composition of many ModelFamilies
                      on modelFamily.modelGroups = $self;
}

entity ModelFamilies : cuid, managed {

    familyName   : String(100) not null;
    description  : String(255);

    modelGroups  : Association to one ModelGroups;             

    HUContainers : Association to many HUContainers
                       on HUContainers.ModelFamilies = $self;


}


entity HUContainers : cuid, managed {

    huNumber      : String(30) not null;
    commodity   : String(50); //PARTS Category

    ModelFamilies : Association to one ModelFamilies not null;

    Parts         : Composition of many Parts
                        on Parts.huContainer = $self;
}


entity Parts : cuid, managed {

    partNumber  : String(40) not null;
    partName    : String(150);
    quantity    : Integer default 1;
    huContainer : Association to HUContainers not null;
}
