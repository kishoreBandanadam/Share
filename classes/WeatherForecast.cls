public class WeatherForecast {
    @AuraEnabled
    public static Map<String, Object> getWeatherForecast(Id rId) {
        
        contact c = [Select MailingCity, MailingCountry, OtherCity from Contact where Id = :rId];
        String contactCity = c.MailingCity;
        String conCountry = c.MailingCountry;
        Http http = new Http();
        
        String apiKey = 'ea81367a0aef9c264903bbf45f986a88';
        
        String requestEndpoint = 'http://api.openweathermap.org/data/2.5/weather';
        requestEndpoint += '?q=' + contactCity;
        //requestEndpoint += ',' + conCountry;
        requestEndpoint += '&units=metric';
        requestEndpoint += '&APPID=' + apiKey;
        
        HttpRequest request = new HttpRequest();
        request.setEndpoint(requestEndpoint);
        request.setMethod('GET');
        
        HttpResponse response = http.send(request);
        
        Map<String, Object> mainResults = new Map<String, Object>();
        if(contactCity != NULL){
            if(response.getStatusCode() == 200){
                
                Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
                system.debug('result::::'+JSON.serialize(results));
                String city = String.valueOf(results.get('name'));
                system.debug('city::::'+city);
                mainResults = (Map<String, Object>)(results.get('main'));
                mainResults.put('flag', 'true');
                system.debug('mainResults::::'+mainResults);
                String temp = String.valueOf(mainResults.get('temp'));
                String pressure = String.valueOf(mainResults.get('pressure'));
                String humidity = String.valueOf(mainResults.get('humidity'));
                String temp_min = String.valueOf(mainResults.get('temp_min'));
                String temp_max = String.valueOf(mainResults.get('temp_max'));
                system.debug('temp::::'+temp);
                system.debug('pressure::::'+pressure);
                system.debug('humidity::::'+humidity);
                system.debug('temp_min::::'+temp_min);
                system.debug('temp_max::::'+temp_max);
                List<Object> weatherResult = (List<Object>)(results.get('weather'));
                system.debug('weatherResult::::'+weatherResult);
                mainResults.put('weather', weatherResult);
            }
            else {
                mainResults.put('flag', 'false');
                system.debug('response.getStatusCode():::'+response.getStatusCode());
            }
            
        }
        
        else {
            mainResults.put('flag', 'false');
            system.debug('No address info');
        }
        return mainResults;
    }
    
}