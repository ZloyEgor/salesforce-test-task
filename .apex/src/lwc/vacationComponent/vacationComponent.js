import {LightningElement, track, api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {deleteRecord, updateRecord} from 'lightning/uiRecordApi';
import getRequestList from '@salesforce/apex/vacationComponentController.getRequestList';

import ID_FIELD from '@salesforce/schema/Vacation_request__c.Id';
import REQUEST_TYPE_FIELD from '@salesforce/schema/Vacation_request__c.Request_Type__c';
import START_DATE_FIELD from '@salesforce/schema/Vacation_request__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Vacation_request__c.End_Date__c';
import WORKING_DAYS_FIELD from '@salesforce/schema/Vacation_request__c.Working_Days__c';
import STATUS_FIELD from '@salesforce/schema/Vacation_request__c.Status__c';
import MANAGER_FIELD from '@salesforce/schema/Vacation_request__c.Manager__c';


export default class VacationComponent extends LightningElement {

    @track isShowAddWindow = false;
    @track requests = [];

    @api recordId;
    @api objectApiName;

    requestTypeField = REQUEST_TYPE_FIELD;
    startDateField = START_DATE_FIELD;
    endDateField = END_DATE_FIELD;
    workingDaysField = WORKING_DAYS_FIELD;
    statusField = STATUS_FIELD;
    managerField = MANAGER_FIELD;

    showAddWindow() {
        this.isShowAddWindow = true;
    }

    hideAddWindow() {
        this.isShowAddWindow = false;
    }

    handleSuccess() {

        getRequestList().then(result => {
            this.requests = result;
        })
            .catch(error => {
                console.error(error);
            });

        const event = new ShowToastEvent({
            title: "Success",
            message: "Vacation request added successfully",
            variant: 'success',
        });
        this.dispatchEvent(event);
        this.hideAddWindow();
    }

    submitRequest(event) {
        console.log('submit invocation')
        let id = event.target.value;
        const fields = {}
        fields[ID_FIELD.fieldApiName] = id;
        fields[STATUS_FIELD.fieldApiName] = "Submitted";
        const recordInput = {
            fields: fields
        };

        updateRecord(recordInput).then((record) => {
            console.log(record);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Request submitted',
                    variant: 'success'
                })
            );
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }
    deleteRequest(event) {
        let deletedId = event.target.value;
        deleteRecord(deletedId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
                for (let request in this.requests) {
                    if(this.requests[request].Id == deletedId) {
                        this.requests.splice(request, 1);
                        break;
                    }
                }
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });

    }


    connectedCallback() {
        console.log('connected callback')
        getRequestList()
            .then(result => {
                let newResult = result.map((item) =>
                    Object.assign({}, item, {selected:false})
                )
                for (let request of newResult) {
                    request.isNew = request.Status__c == "New";
                    request.isSubmitted = request.Status__c == "Submitted";
                    request.isApproved = request.Status__c == "Approved";
                }
                this.requests = newResult;
                console.log(newResult);
            })
            .catch(error => {
                console.error(error);
            });
    }
}