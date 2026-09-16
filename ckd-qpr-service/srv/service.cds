using { ckd_qpr.db as db } from '../db/schema_1';
using { ckd_qpr.db1 as db1} from '../db/schema_2';

//CKDQPRMasterDataServices


service QPRService {
    entity ModelGroups   as projection on db.ModelGroups;
    entity ModelFamilies as projection on db.ModelFamilies;
    entity HUContainers  as projection on db.HUContainers;
    entity Parts         as projection on db.Parts;
};



service CKDService {
    entity Plants          as projection on db1.Plants;
    entity Department      as projection on db1.Department;
    entity Employees       as projection on db1.Employees;
    
    entity SalesOrders     as projection on db1.SalesOrders;
    entity SalesOrderItems as projection on db1.SalesOrderItems;
    entity Invoices        as projection on db1.Invoices;
}

// https://port4004-workspaces-ws-gsz41.us10.trial.applicationstudio.cloud.sap/odata/v4/ckd/Invoices?$expand=salesOrder($expand=items($expand=modelFamily))


//For Covert to  EDMX
/*user: ckd-qpr-service $ cds compile * --to edmx
Error: 

    Found multiple service definitions in given model(s).
    Please choose by adding one of... 

    -s all 
    -s QPRService
    -s CKDService
  
    at _4odata (/extbin/globals/bun/global/install/node_modules/@sap/cds/lib/compile/to/edm.js:65:48)
    at cds_compile_to_edmx (/extbin/globals/bun/global/install/node_modules/@sap/cds/lib/compile/to/edm.js:38:9)
    at /extbin/globals/bun/global/install/node_modules/@sap/cds-dk/bin/compile/index.js:366:36
    at Generator.next (<anonymous>)
    at _write (/extbin/globals/bun/global/install/node_modules/@sap/cds-dk/lib/util/write.js:65:28)
    at Object.to (/extbin/globals/bun/global/install/node_modules/@sap/cds-dk/lib/util/write.js:40:42)
    at /extbin/globals/bun/global/install/node_modules/@sap/cds-dk/lib/util/write.js:53:49
    at async Object.exec (/extbin/globals/bun/global/install/node_modules/@sap/cds-dk/bin/cds.js:109:16)
    
user: ckd-qpr-service $ cds compile * --to edmx -s all
----- QPRService.xml -----
<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:Reference Uri="https://sap.github.io/odata-vocabularies/vocabularies/Common.xml">
    <edmx:Include Alias="Common" Namespace="com.sap.vocabularies.Common.v1"/>
  </edmx:Reference>
  <edmx:Reference Uri="https://oasis-tcs.github.io/odata-vocabularies/vocabularies/Org.OData.Core.V1.xml">
    <edmx:Include Alias="Core" Namespace="Org.OData.Core.V1"/>
  </edmx:Reference>
  <edmx:Reference Uri="https://sap.github.io/odata-vocabularies/vocabularies/UI.xml">
    <edmx:Include Alias="UI" Namespace="com.sap.vocabularies.UI.v1"/>
  </edmx:Reference>
  <edmx:DataServices>
    <Schema Namespace="QPRService" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <Annotation Term="Core.Links">
        <Collection>
          <Record>
            <PropertyValue Property="rel" String="author"/>
            <PropertyValue Property="href" String="https://cap.cloud.sap"/>
          </Record>
        </Collection>
      </Annotation>
      <EntityContainer Name="EntityContainer">
        <EntitySet Name="ModelGroups" EntityType="QPRService.ModelGroups">
          <NavigationPropertyBinding Path="modelFamily" Target="ModelFamilies"/>
        </EntitySet>
        <EntitySet Name="ModelFamilies" EntityType="QPRService.ModelFamilies">
          <NavigationPropertyBinding Path="modelGroups" Target="ModelGroups"/>
          <NavigationPropertyBinding Path="HUContainers" Target="HUContainers"/>
        </EntitySet>
        <EntitySet Name="HUContainers" EntityType="QPRService.HUContainers">
          <NavigationPropertyBinding Path="ModelFamilies" Target="ModelFamilies"/>
          <NavigationPropertyBinding Path="Parts" Target="Parts"/>
        </EntitySet>
        <EntitySet Name="Parts" EntityType="QPRService.Parts">
          <NavigationPropertyBinding Path="huContainer" Target="HUContainers"/>
        </EntitySet>
      </EntityContainer>
      <EntityType Name="ModelGroups">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="groupCode" Type="Edm.String" MaxLength="20" Nullable="false"/>
        <Property Name="groupName" Type="Edm.String" MaxLength="100" Nullable="false"/>
        <NavigationProperty Name="modelFamily" Type="Collection(QPRService.ModelFamilies)" Partner="modelGroups">
          <OnDelete Action="Cascade"/>
        </NavigationProperty>
      </EntityType>
      <EntityType Name="ModelFamilies">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="familyName" Type="Edm.String" MaxLength="100" Nullable="false"/>
        <Property Name="description" Type="Edm.String" MaxLength="255"/>
        <NavigationProperty Name="modelGroups" Type="QPRService.ModelGroups" Partner="modelFamily">
          <ReferentialConstraint Property="modelGroups_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="modelGroups_ID" Type="Edm.Guid"/>
        <NavigationProperty Name="HUContainers" Type="Collection(QPRService.HUContainers)" Partner="ModelFamilies"/>
      </EntityType>
      <EntityType Name="HUContainers">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="huNumber" Type="Edm.String" MaxLength="30" Nullable="false"/>
        <Property Name="commodity" Type="Edm.String" MaxLength="50"/>
        <NavigationProperty Name="ModelFamilies" Type="QPRService.ModelFamilies" Nullable="false" Partner="HUContainers">
          <ReferentialConstraint Property="ModelFamilies_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="ModelFamilies_ID" Type="Edm.Guid" Nullable="false"/>
        <NavigationProperty Name="Parts" Type="Collection(QPRService.Parts)" Partner="huContainer">
          <OnDelete Action="Cascade"/>
        </NavigationProperty>
      </EntityType>
      <EntityType Name="Parts">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="partNumber" Type="Edm.String" MaxLength="40" Nullable="false"/>
        <Property Name="partName" Type="Edm.String" MaxLength="150"/>
        <Property Name="quantity" Type="Edm.Int32" DefaultValue="1"/>
        <NavigationProperty Name="huContainer" Type="QPRService.HUContainers" Nullable="false" Partner="Parts">
          <ReferentialConstraint Property="huContainer_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="huContainer_ID" Type="Edm.Guid" Nullable="false"/>
      </EntityType>
      <Annotations Target="QPRService.ModelGroups/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="QPRService.ModelGroups/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelGroups/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelGroups/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelGroups/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelFamilies/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="QPRService.ModelFamilies/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelFamilies/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelFamilies/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.ModelFamilies/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.HUContainers/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="QPRService.HUContainers/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.HUContainers/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.HUContainers/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.HUContainers/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.Parts/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="QPRService.Parts/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.Parts/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="QPRService.Parts/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="QPRService.Parts/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
----- CKDService.xml -----
<?xml version="1.0" encoding="utf-8"?>
<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">
  <edmx:Reference Uri="https://sap.github.io/odata-vocabularies/vocabularies/Common.xml">
    <edmx:Include Alias="Common" Namespace="com.sap.vocabularies.Common.v1"/>
  </edmx:Reference>
  <edmx:Reference Uri="https://oasis-tcs.github.io/odata-vocabularies/vocabularies/Org.OData.Core.V1.xml">
    <edmx:Include Alias="Core" Namespace="Org.OData.Core.V1"/>
  </edmx:Reference>
  <edmx:Reference Uri="https://sap.github.io/odata-vocabularies/vocabularies/UI.xml">
    <edmx:Include Alias="UI" Namespace="com.sap.vocabularies.UI.v1"/>
  </edmx:Reference>
  <edmx:Reference Uri="https://oasis-tcs.github.io/odata-vocabularies/vocabularies/Org.OData.Validation.V1.xml">
    <edmx:Include Alias="Validation" Namespace="Org.OData.Validation.V1"/>
  </edmx:Reference>
  <edmx:DataServices>
    <Schema Namespace="CKDService" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <Annotation Term="Core.Links">
        <Collection>
          <Record>
            <PropertyValue Property="rel" String="author"/>
            <PropertyValue Property="href" String="https://cap.cloud.sap"/>
          </Record>
        </Collection>
      </Annotation>
      <EntityContainer Name="EntityContainer">
        <EntitySet Name="Plants" EntityType="CKDService.Plants">
          <NavigationPropertyBinding Path="departments" Target="Department"/>
        </EntitySet>
        <EntitySet Name="Department" EntityType="CKDService.Department">
          <NavigationPropertyBinding Path="plant" Target="Plants"/>
          <NavigationPropertyBinding Path="employees" Target="Employees"/>
        </EntitySet>
        <EntitySet Name="Employees" EntityType="CKDService.Employees">
          <NavigationPropertyBinding Path="department" Target="Department"/>
        </EntitySet>
        <EntitySet Name="SalesOrders" EntityType="CKDService.SalesOrders">
          <NavigationPropertyBinding Path="plant" Target="Plants"/>
          <NavigationPropertyBinding Path="items" Target="SalesOrderItems"/>
        </EntitySet>
        <EntitySet Name="SalesOrderItems" EntityType="CKDService.SalesOrderItems">
          <NavigationPropertyBinding Path="salesOrder" Target="SalesOrders"/>
          <NavigationPropertyBinding Path="modelFamily" Target="ModelFamilies"/>
        </EntitySet>
        <EntitySet Name="Invoices" EntityType="CKDService.Invoices">
          <NavigationPropertyBinding Path="salesOrder" Target="SalesOrders"/>
        </EntitySet>
        <EntitySet Name="ModelFamilies" EntityType="CKDService.ModelFamilies"/>
      </EntityContainer>
      <EntityType Name="Plants">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="plantCode" Type="Edm.String" MaxLength="10" Nullable="false"/>
        <Property Name="address" Type="Edm.String" MaxLength="255"/>
        <Property Name="city" Type="Edm.String" MaxLength="50"/>
        <Property Name="state" Type="Edm.String" MaxLength="50"/>
        <Property Name="country" Type="Edm.String" MaxLength="50"/>
        <Property Name="plantName" Type="Edm.String" MaxLength="100" Nullable="false"/>
        <Property Name="plantType" Type="Edm.String"/>
        <NavigationProperty Name="departments" Type="Collection(CKDService.Department)" Partner="plant">
          <OnDelete Action="Cascade"/>
        </NavigationProperty>
        <Property Name="status" Type="Edm.String"/>
      </EntityType>
      <EntityType Name="Department">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="departmentCode" Type="Edm.String" MaxLength="20" Nullable="false"/>
        <Property Name="departmentName" Type="Edm.String" MaxLength="100" Nullable="false"/>
        <Property Name="departmentType" Type="Edm.String"/>
        <Property Name="status" Type="Edm.String"/>
        <NavigationProperty Name="plant" Type="CKDService.Plants" Partner="departments">
          <ReferentialConstraint Property="plant_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="plant_ID" Type="Edm.Guid"/>
        <NavigationProperty Name="employees" Type="Collection(CKDService.Employees)" Partner="department">
          <OnDelete Action="Cascade"/>
        </NavigationProperty>
      </EntityType>
      <EntityType Name="Employees">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="employeeCode" Type="Edm.String" MaxLength="20" Nullable="false"/>
        <Property Name="employeeName" Type="Edm.String" MaxLength="100" Nullable="false"/>
        <Property Name="email" Type="Edm.String" MaxLength="100"/>
        <Property Name="phone" Type="Edm.String" MaxLength="20"/>
        <Property Name="jobTitle" Type="Edm.String" MaxLength="100"/>
        <Property Name="employeeType" Type="Edm.String"/>
        <NavigationProperty Name="department" Type="CKDService.Department" Partner="employees">
          <ReferentialConstraint Property="department_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="department_ID" Type="Edm.Guid"/>
        <Property Name="status" Type="Edm.String"/>
      </EntityType>
      <EntityType Name="SalesOrders">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="salesOrderNo" Type="Edm.String" MaxLength="20" Nullable="false"/>
        <Property Name="orderDate" Type="Edm.Date"/>
        <NavigationProperty Name="plant" Type="CKDService.Plants">
          <ReferentialConstraint Property="plant_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="plant_ID" Type="Edm.Guid"/>
        <Property Name="totalOrderPrice" Type="Edm.Decimal" Precision="15" Scale="2"/>
        <Property Name="currency" Type="Edm.String" MaxLength="3"/>
        <Property Name="status" Type="Edm.String"/>
        <NavigationProperty Name="items" Type="Collection(CKDService.SalesOrderItems)" Partner="salesOrder">
          <OnDelete Action="Cascade"/>
        </NavigationProperty>
      </EntityType>
      <EntityType Name="SalesOrderItems">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <NavigationProperty Name="salesOrder" Type="CKDService.SalesOrders" Partner="items">
          <ReferentialConstraint Property="salesOrder_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="salesOrder_ID" Type="Edm.Guid"/>
        <Property Name="itemNo" Type="Edm.Int32" Nullable="false"/>
        <NavigationProperty Name="modelFamily" Type="CKDService.ModelFamilies">
          <ReferentialConstraint Property="modelFamily_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="modelFamily_ID" Type="Edm.Guid"/>
        <Property Name="quantity" Type="Edm.Int32" Nullable="false"/>
        <Property Name="unitPrice" Type="Edm.Decimal" Precision="15" Scale="2"/>
        <Property Name="totalItemPrice" Type="Edm.Decimal" Precision="15" Scale="2"/>
        <Property Name="currency" Type="Edm.String" MaxLength="3"/>
      </EntityType>
      <EntityType Name="Invoices">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="invoiceNo" Type="Edm.String" MaxLength="20" Nullable="false"/>
        <Property Name="invoiceDate" Type="Edm.Date"/>
        <Property Name="dueDate" Type="Edm.Date"/>
        <NavigationProperty Name="salesOrder" Type="CKDService.SalesOrders">
          <ReferentialConstraint Property="salesOrder_ID" ReferencedProperty="ID"/>
        </NavigationProperty>
        <Property Name="salesOrder_ID" Type="Edm.Guid"/>
        <Property Name="netAmount" Type="Edm.Decimal" Precision="15" Scale="2"/>
        <Property Name="taxAmount" Type="Edm.Decimal" Precision="15" Scale="2"/>
        <Property Name="totalAmount" Type="Edm.Decimal" Precision="15" Scale="2"/>
        <Property Name="currency" Type="Edm.String" MaxLength="3"/>
        <Property Name="status" Type="Edm.String"/>
      </EntityType>
      <EntityType Name="ModelFamilies">
        <Key>
          <PropertyRef Name="ID"/>
        </Key>
        <Property Name="ID" Type="Edm.Guid" Nullable="false"/>
        <Property Name="createdAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="createdBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="modifiedAt" Type="Edm.DateTimeOffset" Precision="7"/>
        <Property Name="modifiedBy" Type="Edm.String" MaxLength="255"/>
        <Property Name="familyName" Type="Edm.String" MaxLength="100" Nullable="false"/>
        <Property Name="description" Type="Edm.String" MaxLength="255"/>
        <Property Name="modelGroups_ID" Type="Edm.Guid"/>
      </EntityType>
      <Annotations Target="CKDService.Plants/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.Plants/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Plants/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Plants/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Plants/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Plants/plantType">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="MANUFACTURING"/>
              <PropertyValue Property="Value" String="MANUFACTURING"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="ASSEMBLY"/>
              <PropertyValue Property="Value" String="ASSEMBLY"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="WAREHOUSE"/>
              <PropertyValue Property="Value" String="WAREHOUSE"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.Plants/status">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="ACTIVE"/>
              <PropertyValue Property="Value" String="ACTIVE"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="INACTIVE"/>
              <PropertyValue Property="Value" String="INACTIVE"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.Department/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.Department/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Department/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Department/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Department/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Department/departmentType">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="ORDER_DEALER"/>
              <PropertyValue Property="Value" String="ORDER_DEALER"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="RETURN_DEALER"/>
              <PropertyValue Property="Value" String="RETURN_DEALER"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.Department/status">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="ACTIVE"/>
              <PropertyValue Property="Value" String="ACTIVE"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="INACTIVE"/>
              <PropertyValue Property="Value" String="INACTIVE"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.Employees/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/email">
        <Annotation Term="Validation.Pattern" String="^[A-Za-z0-9_]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/phone">
        <Annotation Term="Validation.Pattern" String="^\\+[1-9][0-9]{7,14}$"/>
      </Annotations>
      <Annotations Target="CKDService.Employees/employeeType">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="PERMANENT"/>
              <PropertyValue Property="Value" String="PERMANENT"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="CONTRACT"/>
              <PropertyValue Property="Value" String="CONTRACT"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.Employees/status">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="ACTIVE"/>
              <PropertyValue Property="Value" String="ACTIVE"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="INACTIVE"/>
              <PropertyValue Property="Value" String="INACTIVE"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.SalesOrders/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrders/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrders/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrders/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrders/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrders/status">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="CREATED"/>
              <PropertyValue Property="Value" String="CREATED"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="CONFIRMED"/>
              <PropertyValue Property="Value" String="CONFIRMED"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="IN_PROGRESS"/>
              <PropertyValue Property="Value" String="IN_PROGRESS"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="COMPLETED"/>
              <PropertyValue Property="Value" String="COMPLETED"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="CANCELLED"/>
              <PropertyValue Property="Value" String="CANCELLED"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.SalesOrderItems/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrderItems/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrderItems/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrderItems/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.SalesOrderItems/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Invoices/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.Invoices/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Invoices/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Invoices/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.Invoices/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.Invoices/status">
        <Annotation Term="Validation.AllowedValues">
          <Collection>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="DRAFT"/>
              <PropertyValue Property="Value" String="DRAFT"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="POSTED"/>
              <PropertyValue Property="Value" String="POSTED"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="PAID"/>
              <PropertyValue Property="Value" String="PAID"/>
            </Record>
            <Record Type="Validation.AllowedValue">
              <Annotation Term="Core.SymbolicName" String="CANCELLED"/>
              <PropertyValue Property="Value" String="CANCELLED"/>
            </Record>
          </Collection>
        </Annotation>
      </Annotations>
      <Annotations Target="CKDService.ModelFamilies/ID">
        <Annotation Term="Core.ComputedDefaultValue" Bool="true"/>
      </Annotations>
      <Annotations Target="CKDService.ModelFamilies/createdAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.ModelFamilies/createdBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Immutable" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>CreatedBy}"/>
      </Annotations>
      <Annotations Target="CKDService.ModelFamilies/modifiedAt">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedAt}"/>
      </Annotations>
      <Annotations Target="CKDService.ModelFamilies/modifiedBy">
        <Annotation Term="UI.HiddenFilter" Bool="true"/>
        <Annotation Term="UI.ExcludeFromNavigationContext" Bool="true"/>
        <Annotation Term="Core.Computed" Bool="true"/>
        <Annotation Term="Core.Description" String="{i18n>UserID.Description}"/>
        <Annotation Term="Common.Label" String="{i18n>ChangedBy}"/>
      </Annotations>
    </Schema>
  </edmx:DataServices>
</edmx:Edmx>
user: ckd-qpr-service $  */