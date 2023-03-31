import { LightningElement } from 'lwc';

export default class CreateAcc extends LightningElement {
    account ={};
    handleChange(evt){
        this.template.querySelectorAll('lightning-input').forEach(element => {
            if(element.name === 'Name'){
                element.value = evt.target.value;
            }else if(element.name === 'Phone'){
                element.value = evt.target.value;
            }
        });
    }
    onSubmit(){
        console.log('Account ::',this.account)
       
    }
    handleReset(){
        this.template.querySelectorAll('lightning-input').forEach(element => {
          if(element.type === 'checkbox' || element.type === 'checkbox-button'){
            element.checked = false;
          }else{
            element.value = null;
          }      
        });
            /* you can also reset one by one by id
                this.template.querySelector('lightning-input[data-id="form"]').value = null; 
                this.template.querySelector('lightning-input[data-id="form"]').checked = false; 
            * */   
      }

}