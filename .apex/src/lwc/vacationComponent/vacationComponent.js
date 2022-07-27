import {LightningElement, track, api, wire} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {deleteRecord, updateRecord} from 'lightning/uiRecordApi';
import getRequestList from '@salesforce/apex/vacationComponentController.getRequestList';
import Id from '@salesforce/user/Id';

import ID_FIELD from '@salesforce/schema/Vacation_request__c.Id';
import REQUEST_TYPE_FIELD from '@salesforce/schema/Vacation_request__c.Request_Type__c';
import START_DATE_FIELD from '@salesforce/schema/Vacation_request__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Vacation_request__c.End_Date__c';
import STATUS_FIELD from '@salesforce/schema/Vacation_request__c.Status__c';

export default class VacationComponent extends LightningElement {

    @track isShowAddWindow = false;
    @track showOtherRequests = true;

    requests = [];

    @api recordId;
    @api objectApiName;

    requestTypeField = REQUEST_TYPE_FIELD;
    startDateField = START_DATE_FIELD;
    endDateField = END_DATE_FIELD;

    userId = Id;

    showAddWindow() {
        this.isShowAddWindow = true;
    }

    hideAddWindow() {
        this.isShowAddWindow = false;
    }

    changeShowingRequestsMode() {
        this.showOtherRequests = !this.showOtherRequests;
    }

    handleAdd() {
        const event = new ShowToastEvent({
            title: "Success",
            message: "Vacation request added successfully",
            variant: 'success',
        });
        this.dispatchEvent(event);
        this.hideAddWindow();
        this.updateView();
    }

    submitRequest(event) {
        let id = event.target.value;
        const fields = {}
        fields[ID_FIELD.fieldApiName] = id;
        fields[STATUS_FIELD.fieldApiName] = "Submitted";
        const recordInput = {
            fields: fields
        };

        updateRecord(recordInput).then((record) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Request submitted',
                    variant: 'success'
                })
            );
            this.updateView();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error submitting record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    approveRequest(event) {
        let id = event.target.value;
        const fields = {}
        fields[ID_FIELD.fieldApiName] = id;
        fields[STATUS_FIELD.fieldApiName] = "Approved";
        const recordInput = {
            fields: fields
        };

        updateRecord(recordInput).then((record) => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Request approved',
                    variant: 'success'
                })
            );
            this.updateView();
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error approving record',
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
                this.updateView();
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
        this.updateRequests();
        // console.log('In callback:');
        // console.log(this.requests);
    }

    updateView() {
        //TODO: need to opimize
        window.location.reload();
        // this.updateRequests();
        // eval("$A.get('e.force:refreshView').fire();");
    }

    updateRequests() {
        getRequestList()
            .then(result => {
                let newResult = result.map((item) =>
                    Object.assign({}, item, {selected: false})
                )
                for (let request of newResult) {
                    request.isNew = request.Status__c == "New";
                    request.isSubmitted = request.Status__c == "Submitted";
                    request.isApproved = request.Status__c == "Approved";

                    request.canDeleteRequest = request.CreatedById == this.userId && request.Status__c == "New";
                    request.canSubmitRequest = request.CreatedById == this.userId && request.Status__c == "New";
                    request.canApproveRequest = request.Manager__c == this.userId && request.Status__c == "Submitted";

                    request.belongsToCurrentUser = request.CreatedById == this.userId;
                }
                this.requests = newResult;


            })
            .catch(error => {
                console.error(error);
            });
    }
}