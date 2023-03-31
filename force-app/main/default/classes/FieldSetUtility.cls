/*********************************************************************************

Class Name      : FieldSetUtility

Description     : To read the field set from Sobject

Created By      : Vivek

Created Date    : 02-23-2022

Modification Log:

----------------------------------------------------------------------------------

Developer                   Date                   Description

-----------------------------------------------------------------------------------

XXXXXX         XXXXX            XXXXX 

*********************************************************************************/

public with sharing class FieldSetUtility {
    
    
/**
   * This method is used to get fieldSet details of the provided record,sobject,fieldset name
   * @param recordId Id of the record
   * @param objectName  sObject name
   * @param fieldSetName Name of field set
   * @return int This returns sum of numA and numB.
   */
   
    @AuraEnabled
    public static FieldSetForm getFieldSet(Id recordId, String objectName, String fieldSetName) {
        FieldSetForm form = new FieldSetForm();        
        form.Fields = getFields(recordId, objectName, fieldSetName);
        
        return form;
    }
    
    private static List<FormField> getFields(Id recordId, String objectName, String fieldSetName) {
        Schema.SObjectType objectType = null;
        
        if (recordId != null) {
            objectType = recordId.getSobjectType();
        }
        else if (String.isNotBlank(objectName)) {
            objectType = Schema.getGlobalDescribe().get(objectName);
        }
        
        Schema.DescribeSObjectResult objectDescribe = objectType.getDescribe();
        Map<String, Schema.FieldSet> fieldSetMap = objectDescribe.fieldSets.getMap();
        Schema.FieldSet fieldSet = fieldSetMap.get(fieldSetName);
        List<Schema.FieldSetMember> fieldSetMembers = fieldSet.getFields();
        
        List<FormField> fields = new List<FormField>();
        for(Schema.FieldSetMember fsm : fieldSetMembers) {
            FormField f = new FormField(fsm);
            fields.add(f);
        }
        
        return fields;
    }
    
    public class FieldSetForm {
        @AuraEnabled
        public List<FormField> Fields { get; set; }
        
        public FieldSetForm() {
            Fields = new List<FormField>();
        }
    }



}