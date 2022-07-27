public class vacationComponentController {

	@AuraEnabled
	public static List<Vacation_request__c> getRequestList() {
		return [SELECT Id, Start_Date__c, End_Date__c, Working_Days__c, Status__c, Request_Type__c, Manager__r.FirstName, Manager__r.LastName, CreatedBy.FirstName, CreatedBy.LastName
				FROM Vacation_request__c];
	}
}