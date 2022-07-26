trigger ManagerSetterTrigger on Vacation_request__c (before insert) {
	if(Trigger.isInsert){
		if(Trigger.isBefore){
			for (Vacation_request__c vacationRequest: Trigger.new) {
				User manager = [SELECT Id FROM User WHERE Id = :UserInfo.getUserId()];
				if (manager != null) {
					vacationRequest.Manager__c = manager.Id;
				} else {
					vacationRequest.addError('Manager for current user isn\'t specified!');
				}
			}
		}
	}
}