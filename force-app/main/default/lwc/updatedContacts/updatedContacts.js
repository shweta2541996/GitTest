import { LightningElement, api, wire} from 'lwc';

// import BOATMC from the message channel
import CONTACTMC from '@salesforce/messageChannel/ContactMessageChannel__c';
import { subscribe, APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
const columns = [
    { label: "First Name", fieldName: "FirstName", editable: true },
    { label: "Last Name", fieldName: "LastName", editable: true },
    { label: "Email", fieldName: "Email", type: "email", editable: true },
    { label: "Status", fieldName: "Status__c", type: "Picklist", editable: true },
];
export default class UpdatedContacts extends LightningElement {
     updatedContacts =[];
    columns =columns; 
    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;
    contacts=[];

    

    connectedCallback(){
        console.log('updatedContacts :',this.updatedContacts);

        this.subscription = subscribe(
            this.messageContext,
            CONTACTMC,
            (message) => { 
                console.log('msg',message);
                console.log('msg',this.updatedContacts);
                
                let updateContacts = message.contacts;
                message.contacts.forEach(contact =>{
                    updateContacts.forEach(c =>{
                        if(contact.Id === c.Id){
                            Object.assign(c,contact);
                        }
                    })
                });
                this.updatedContacts =updateContacts;
                console.log('this.updatedContacts lmc',this.updatedContacts);
             },
            { scope: APPLICATION_SCOPE }
        );
    }
}