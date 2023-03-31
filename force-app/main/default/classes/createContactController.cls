public class createContactController {

    @AuraEnabled
    public static Contact createContact(Contact contact){
        System.debug(contact);
        try{
            insert contact;
            return contact;
        }catch(Exception exc){
            System.debug('exc: '+exc.getMessage());
            return null;
        }
        
    }
    
    @AuraEnabled
    public static List<Contact> updateContacts( Object data ) {
        System.debug('data: '+data);
        List < Contact > conForUpdate = ( List < Contact > ) JSON.deserialize(JSON.serialize( data ),List < Contact >.class);
        Set<Id> conIds = new Set<Id>();
        try {
            update conForUpdate;
            for(Contact c : conForUpdate){
                conIds.add(c.Id);
            }
        }
        catch (Exception e) {
            System.debug('Error updating: '+e.getMessage());
        }
        return [SELECT Id, FirstName, LastName, Email, Status__c FROM Contact WHERE Id IN: conIds];

    }
}