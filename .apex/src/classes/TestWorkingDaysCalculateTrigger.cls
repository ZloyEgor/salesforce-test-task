@isTest
private class TestWorkingDaysCalculateTrigger {
	@isTest
	static void testCalculation() {
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

		System.runAs(user) {
			Test.startTest();
			Vacation_request__c request1 = new Vacation_request__c(Request_Type__c = 'Vacation',
					Start_Date__c = Date.newInstance(2030, 1, 10),
					End_Date__c = Date.newInstance(2030, 1, 16));

			Vacation_request__c request2 = new Vacation_request__c(Request_Type__c = 'Sick',
					Start_Date__c = Date.newInstance(2030, 5, 11),
					End_Date__c = Date.newInstance(2030, 5, 31));

			Vacation_request__c request3 = new Vacation_request__c(Request_Type__c = 'Unpaid',
					Start_Date__c = Date.newInstance(2030, 8, 1),
					End_Date__c = Date.newInstance(2030, 9, 30));

			Vacation_request__c[] requests = new List<Vacation_request__c>();

			requests.add(request1);
			requests.add(request2);
			requests.add(request3);

			List<Database.SaveResult> results = Database.insert(requests);
			Integer[] numberDays = new List<Integer>();
			for (Database.SaveResult result: results) {
				numberDays.add([SELECT Id, Working_Days__c FROM Vacation_request__c WHERE Id = :result.getId()].Working_Days__c?.intValue());
			}
			Integer[] expectedNumberDays = new List<Integer>();
			expectedNumberDays.add( 5);
			expectedNumberDays.add( 15);
			expectedNumberDays.add( 43);
			Test.stopTest();
			System.assertEquals(numberDays, expectedNumberDays);

		}
	}
}