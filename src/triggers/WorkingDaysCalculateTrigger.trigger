trigger WorkingDaysCalculateTrigger on Vacation_request__c (before insert) {
//	for (Vacation_request__c : Trigger.new) {
//
//	}
	if(Trigger.isInsert){
		if(Trigger.isBefore){
			for (Vacation_request__c vacationRequest: Trigger.new) {
				vacationRequest.Working_Days__c =
						BusinessDayCalculation.getNoOfBusinessDaysBetweenDates(vacationRequest.Start_Date__c,
						vacationRequest.End_Date__c);
			}
		}
	}
}