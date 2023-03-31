import { LightningElement, api } from 'lwc';

import getContacts from "@salesforce/apex/contactController.getContacts";
import { subscribe, unsubscribe, onError, setDebugFlag, isEmpEnabled } from 'lightning/empApi';

export default class PlatformEvent extends LightningElement {
     //Imparative call for data
      showButton=true;
     isLoading = true;
     subscription = {};
    @api channelName = '/event/Contact_Status__e';
    connectedCallback() {
        this.handleSubscribe();
        this.registerErrorListener();
        this.handleLoad();
    }
    handleSubscribe(){
        const self = this;
        const messageCallback = function (response) {
            console.log('New message received 1: ', JSON.stringify(response));
            console.log('New message received 2: ', response);
            var obj = JSON.parse(JSON.stringify(response));
            console.log('obj', obj);
            this.isLoading = true;
            this.handleLoad();
        };
 
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('subscribe');
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.isLoading = true;
            this.handleLoad();
            this.subscription = response;
        });
    }
 
    //handle Error
    registerErrorListener() {
        onError(error => {
            console.log('Received error from server: ', JSON.stringify(error));
        });
    }
     handleLoad() {
        getContacts()
            .then(result => {
                // this.data = result;
                // console.log('all data: ' + this.data);
                var contactData = [];
                result.forEach(address => {
                    var modifiedData = {};
                    modifiedData.Id = address.Id;
                    modifiedData.Name = address.Name;
                    modifiedData.Email = address.Email;
                    modifiedData.Phone = address.Phone;
                    modifiedData.Status = address.Status__c;
                    

                    if (address.Status__c === "Transferred") {
                        modifiedData.DisableLink = false;
                    } else {
                        modifiedData.DisableLink = true;
                    }

                    contactData.push(modifiedData);
                })
                this.data = contactData;
                this.isLoading = false;
                console.log('Data ' + JSON.stringify(this.data));
            })
            .catch(error => {
                this.error = error;
            });
    }
 
    // handleSubscribe() {
    //     subscribe(this.channelName, -1, this.messageCallback).then(response => {
    //         // Response contains the subscription information on subscribe call
    //         console.log('Subscription request sent to: ', JSON.stringify(response.channel));
    //         this.subscription = response;
    //         this.isLoading = true;
    //         this.handleLoad();
    //     });
    // }
   
}