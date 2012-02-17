function CstmDate() 
{
			var self = this;
			
            function isLeapYear (year) {
            	return ( year % 4) == 0 && ( year % 100 ) != 0 || ( year % 400 ) == 0;
            }
            
            function isValidYear (year) {
            	return year > 1900 && year <= new Date().getFullYear();
            }
            
            function isValidMonth ( month ) {
            	return month <= 12 && month > 0;
            }
            
            function isValidDay( year, month, day )
            {
            	return day > 0  && day <= self.maxDay( year, month );
            }     
            
            function getToday()
            {
            	var d = new Date();
            	
            	return { year: d.getFullYear(), month: ( d.getMonth() + 1), day: d.getDate() };
            }
                             
            this.maxDay = function ( year, month )
            {
            	var ret;
            	
            	switch( month )
            	{
            		case 2:
            			ret = ( isLeapYear(year) ) ? 29 : 28;
            			break;
            			
            		case 4 :
            		case 6 :
            		case 9 :
            		case 11:
            			ret = 30;
            			break;
            			
            		default:
            			ret = 31;
            			break;
            	
            	}
            	
            	return ( self.date.year == year && self.date.month == month ) ? self.date.day : ret;
            };
             
            this.validateDate = function( year, month, day )
            {
  				return ( isValidYear(year) && isValidMonth(month) && isValidDay(year,month,day ) );
            };
            
            var init = function() {
            	self.date = getToday(); 
            }();      
}

