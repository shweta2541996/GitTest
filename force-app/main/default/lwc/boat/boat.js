import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class Boat extends NavigationMixin(LightningElement) {
    @api boat;
    handleBoatRecord(){
        alert('Hi');
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.boat.Id,
                objectApiName: 'Boat__c',
                actionName: 'view'
            },
        });
    }
}