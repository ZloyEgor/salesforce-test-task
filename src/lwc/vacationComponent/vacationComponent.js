import {LightningElement, track, api} from 'lwc';

// import VACATION_OBJECT from '@salesforce/schema/Vacation_request__c';

import REQUEST_TYPE_FIELD from '@salesforce/schema/Vacation_request__c.Request_Type__c';
import START_DATE_FIELD from '@salesforce/schema/Vacation_request__c.Start_Date__c';
import END_DATE_FIELD from '@salesforce/schema/Vacation_request__c.End_Date__c';
import WORKING_DAYS_FIELD from '@salesforce/schema/Vacation_request__c.Working_Days__c';
import STATUS_FIELD from '@salesforce/schema/Vacation_request__c.Status__c';
import MANAGER_FIELD from '@salesforce/schema/Vacation_request__c.Manager__c';






export default class VacationComponent extends LightningElement {

    @track isShowAddWindow = false;

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
}