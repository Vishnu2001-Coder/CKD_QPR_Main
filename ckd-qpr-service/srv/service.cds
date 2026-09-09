using { ckd_qpr.db as db } from '../db/schema';

@readonly
service QPRService {
    entity ModelGroups   as projection on db.ModelGroups;
    entity ModelFamilies as projection on db.ModelFamilies;
    entity HUContainers  as projection on db.HUContainers;
    entity Parts         as projection on db.Parts;
}