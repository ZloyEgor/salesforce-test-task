public class BusinessDayCalculation {
	public static Integer getNoOfBusinessDaysBetweenDates(DateTime startDate, DateTime endDate){
		Integer count = 0;

		BusinessHours bHours = [SELECT Id FROM BusinessHours WHERE IsDefault = true limit 1];

		while(startDate <= endDate){
			if(BusinessHours.isWithin(bHours.Id, startDate)){
				count++;
			}
			startDate = startDate.addDays(1);
		}
		return count;
	}
}