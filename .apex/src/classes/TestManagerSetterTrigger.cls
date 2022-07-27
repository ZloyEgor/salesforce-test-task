@isTest
private class TestManagerSetterTrigger {
	@isTest
	static void testSuccessInsertion() {

		Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];

		User manager = new User(Alias = 'standt', Email = 'manager@testorg.com',
				EmailEncodingKey = 'UTF-8', LastName = 'Testing', LanguageLocaleKey = 'en_US',
				LocaleSidKey = 'en_US', ProfileId = p.Id,
				TimeZoneSidKey = 'America/Los_Angeles', UserName = 'testmanager@zloyegor.com');
		insert manager;

		User user = new User(Alias = 'standt', Email = 'user@testorg.com',
				EmailEncodingKey = 'UTF-8', LastName = 'Testing', LanguageLocaleKey = 'en_US',
				LocaleSidKey = 'en_US', ProfileId = p.Id,
				TimeZoneSidKey = 'America/Los_Angeles', UserName = 'testuser@zloyegor.com');
		user.ManagerID = manager.Id;
		insert user;


		System.runAs(user){
			Test.startTest();
			Vacation_request__c request = new Vacation_request__c(Request_Type__c = 'Vacation',
					Start_Date__c = Date.newInstance(2022, 9, 1),
					End_Date__c = Date.newInstance(2022, 9, 13));
			Database.SaveResult result = Database.insert(request);
			Test.stopTest();
			System.assert(result.isSuccess());
		}
	}

	@isTest
	static void testFailInsertion() {
		Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
		User user = new User(Alias = 'standt', Email = 'user@testorg.com',
				EmailEncodingKey = 'UTF-8', LastName = 'Testing', LanguageLocaleKey = 'en_US',
				LocaleSidKey = 'en_US', ProfileId = p.Id,
				TimeZoneSidKey = 'America/Los_Angeles', UserName = 'testuser@zloyegor.com');
		user.ManagerID = null;
		insert user;

		System.runAs(user){
			Vacation_request__c request = new Vacation_request__c(Request_Type__c = 'Vacation',
			Start_Date__c = Date.newInstance(2022, 9, 1),
			End_Date__c = Date.newInstance(2022, 9, 13));

			Test.startTest();
			Database.SaveResult result = Database.insert(request, false);
			Test.stopTest();

			System.assert(!result.isSuccess());
			System.assert(result.getErrors().size() > 0);
			System.assertEquals('Manager for current user isn\'t specified!', result.getErrors()[0].getMessage());
		}
	}
}