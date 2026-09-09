using ckd_qpr.db as db from '../db/schema';

service QPRService {

    entity ModelFamilies as projection on db.ModelFamilies;

    entity ModelGroups as projection on db.ModelGroups;

    entity HUContainers as projection on db.HUContainers;

    entity Parts as projection on db.Parts;
}