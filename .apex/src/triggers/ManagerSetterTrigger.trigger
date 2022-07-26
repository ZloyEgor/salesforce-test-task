trigger ManagerSetterTrigger on Vacation_request__c (before insert) {
	if(Trigger.isInsert){
		if(Trigger.isBefore){
			for (Vacation_request__c vacationRequest: Trigger.new) {
				User currentUser = [SELECT Id, ManagerId FROM User WHERE Id = :UserInfo.getUserId()];
				if (currentUser.ManagerId != null) {
					vacationRequest.Manager__c = currentUser.ManagerId;
				} else {
					vacationRequest.addError('Manager for current user isn\'t specified!');
				}
			}
		}
	}
}