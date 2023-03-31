import { LightningElement } from 'lwc';

export default class JestDemo extends LightningElement {
    inputValue;
    show=false;
    handleChange(event){
        this.inputValue = event.target.value;

        if(this.inputValue === 'Show'){
         this.show = true;
        }
    }
}