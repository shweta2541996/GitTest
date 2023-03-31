import { LightningElement,api,track, wire } from 'lwc';
import getBoats from '@salesforce/apex/BoatController.getBoats'

export default class MainShipComp extends LightningElement {


 @wire(getBoats) boats;
 boatType;


 handleSearch(event){
    this.boatType= event.detail;
    console.log('boattype',boatType);
 }
 
}