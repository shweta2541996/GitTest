import { LightningElement, wire } from 'lwc';

import createNewContact from '@salesforce/apex/createContactController.createContact';
import updateContacts from '@salesforce/apex/createContactController.updateContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import { publish, MessageContext } from 'lightning/messageService';
import CONTACTMC from '@salesforce/messageChannel/ContactMessageChannel__c';

const columns = [
    { label: "First Name", fieldName: "FirstName", editable: true },
    { label: "Last Name", fieldName: "LastName", editable: true },
    { label: "Email", fieldName: "Email", type: "email", editable: true },
    { label: "Status", fieldName: "Status__c", type: "Picklist", editable: true },
];

export default class ConatctWIthInlineEdit extends LightningElement {


    contactObj = { SObjectType: 'Contact' };
    columns = columns;
    contacts = [];
    isContactCreated = false;
    value = 'New';
    tabStatus = 'New';
    tabId;
    data = [];
    saveDraftValues = [];
    updatedContacts =[]; //updated contacts from UI

    // wired message context
    @wire(MessageContext)
    messageContext;

    get options() {
        return [
            { label: 'New ', value: 'New' },
            { label: 'Existing', value: 'Existing' },
            { label: 'Referred', value: 'Referred' },
            { label: 'Transferred', value: 'Transferred' },
        ];
    }

    handleStatusChange(event) {
        this.contactObj.Status__c = event.detail.value;
    }

    handleInputChange(event) {
        this.contactObj.FirstName = (event.target.label === 'First Name') ? event.target.value : this.contactObj.FirstName;
        this.contactObj.LastName = (event.target.label === 'Last Name') ? event.target.value : this.contactObj.LastName;
        this.contactObj.Email = (event.target.label === 'Email') ? event.target.value : this.contactObj.Email;

    }

    handleSave() {
        if (this.template.querySelector(".lName").checkValidity()) {
            if (this.contactObj.Status__c == null || this.contactObj.Status__c === undefined)
                this.contactObj.Status__c = 'New';
            createNewContact({ contact: this.contactObj })
                .then(result => {
                    console.log('OUTPUT : ', result);
                    if(result !== null){
                        this.isContactCreated = true;
                        let newContact = [result];
                        this.contacts = [...newContact, ...this.contacts];
                        this.handleCancel();
                        this.handleTabData(this.contacts);
                        this.showToast('Success', 'Contact created successfully!', 'success');
                    }                    
                }).catch(error => {
                    console.log('Error OUTPUT : ', JSON.stringify(error));
                    this.showToast('Error inserting Contact', 'Unable to insert Contact. Please try again', 'error');
                })
        } else {
            this.template.querySelector(".lName").reportValidity();
        }
    }

    handleCancel() {
        this.template.querySelectorAll("lightning-input").forEach(inp => {
            inp.value = null;
        });
    }

    handleTabData(contactData) {
        if (this.tabStatus === 'New') {
            this.data = contactData.filter(contact => contact.Status__c === 'New');
        }else if (this.tabStatus === 'Existing') {
            this.data = contactData.filter(contact => contact.Status__c === 'Existing');
        }else if (this.tabStatus === 'Referred') {
            this.data = contactData.filter(contact => contact.Status__c === 'Referred');
        }else if (this.tabStatus === 'Transferred') {
            this.data = contactData.filter(contact => contact.Status__c === 'Transferred');
        }
    }

    handleTabChange(event) {
       /*  this.template.querySelectorAll('li').forEach(d => {
            console.log('OUTPUT : ', d.classList);
        }) */
        let tabId = event.target.id.includes('-') ? event.target.id.split('-')[0] : event.target.id;
        this.tabId = tabId;
        // event.target.classList.add('slds-is-active');
        // console.log('Tab change: ', tabId);
        this.tabStatus = tabId === 'tab1' ? 'New' : tabId === 'tab2' ? 'Existing' : tabId === 'tab3' ? 'Referred' : tabId === 'tab4' ? 'Transferred' : '';

        // console.log('Status: ', this.tabStatus);
        this.handleTabData(this.contacts);
        console.log('OUTPUT : ', this.data);
    }

    async handleEdit(event) {
        const updatedFields = event.detail.draftValues;
       
        await updateContacts({ data: updatedFields })
            .then(result => {
                //this.contacts;                            //[{"Id":"0035g00000tb00XAAQ","Status__c":"New","FirstName": "", "LastName":""}]
                console.log(JSON.stringify(result));        //[{"Id":"0035g00000tb05NAAQ","FirstName":"rest","LastName":"api","Email":"rest@api.iun","Status__c":"Existing"}]
                result.forEach(r =>{
                    this.contacts.forEach(c =>{
                        if(r.Id === c.Id){
                            this.updatedContacts.push(r);
                            Object.assign(c,r);
                        }
                    })
                })
                this.handleTabData(this.contacts);
                console.log('this.updatedContacts :',this.updatedContacts);
                publish(this.messageContext, CONTACTMC, { contacts: this.updatedContacts });
                this.updatedContacts =[];
                this.showToast('Success', 'Contacts updated', 'success');
            }).catch(error => {
                console.log('Error : ',JSON.stringify(error));
                this.showToast('Error updating records', error.body.message, 'error');
            });
            this.template.querySelector('lightning-datatable').draftValues= null;
    }

    showToast(title, message, variant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: title,
                message: message,
                variant: variant
            })
        );
    }
}