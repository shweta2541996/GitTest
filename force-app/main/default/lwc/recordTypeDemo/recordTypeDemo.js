import { LightningElement, track } from 'lwc';

export default class RecordTypeDemo extends LightningElement {
    tax;
    @track options = [
      {label:'All' , value:'All'},
      {label:'Active' , value:'Active'},
      {label:'Inactive' , value:'Inactive'}

    ];
    @track columns = [
        { label: 'SAP ID', fieldName: 'id',type: 'text'},
        { label: 'SAP NAME', fieldName: 'name',type: 'text' },
        { label: 'DBA NAME', fieldName: 'dba',type: 'text' },
        { label: 'Status', fieldName: 'status',type: 'text'},
        { label: 'Sales District', fieldName: 'district',type: 'text'},
        { label: 'Tax Exempt', fieldName: 'exempt',type: 'text',sortable: true }
    ];
    @track listItems =[{"id":"685946","name":"sap 2","dba":"Eastern Iowa","status":"Active","district":"ED03","exempt":"Yes","address":"US","checked":false},
                     {"id":"567896","name":"sap 3","dba":"Western Iowa","status":"Inactive","district":"ED02","exempt":"No","address":"INDIA","checked":false},
                     {"id":"53797","name":"sap 4","dba":"Western Iowa","status":"Active","district":"ED01","exempt":"Yes","address":"CHINA","checked":false},
                     {"id":"25972","name":"sap 5","dba":"Western Iowa","status":"Active","district":"RB01","exempt":"No","address":"INDIA","checked":false}] ;
    @track accList =this.listItems;
    handleClick(evt){
        alert('inside child');
        const value = true;
        this.dispatchEvent(new CustomEvent('valuechange'));
    }

    handleChange(evt)
    {
        this.tax = evt.target.value;

        let lst = this.listItems.filter(listitem => listitem.status === this.tax);
        this.accList = lst;

        if(this.tax === 'All'){
            this.accList = this.listItems;
        }
    }

                    }