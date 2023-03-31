import { LightningElement, wire, track } from 'lwc';
import getBoatsType from '@salesforce/apex/BoatController.getBoatsType'
export default class SearchBoat extends LightningElement {
    @track options;
    @track error;
    selectedValue;
    @wire (getBoatsType)
    wiredBoatType({data, error}){
       if(data){
        this.options =data.map(res => {
           return { label : res.Name, value : res.Id };
        });
        console.log('options',this.options);
       }
       else if (error) {
        this.searchOptions = undefined;
        this.error = error;
    }
    }

    handleBoatTypeChange(event){
        this.selectedValue = event.target.value;
        console.log('Event call',this.selectedValue);
        // const searchEvent = new CustomEvent('search', { 
        //     detail: this.selectedValue
        // });
        // this.dispatchEvent(searchEvent);
    }



}