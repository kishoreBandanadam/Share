({
	doinit : function(component, event, helper) {
		console.log("In Weather Init");
        var recId = component.get("v.recordId");
        console.log("RecordId::"+recId);
        var action = component.get("c.getWeatherForecast");
        action.setParams({
            "rId" : recId
        });
        
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("Weather state"+state);
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                component.set("v.weather", result);
                console.log("Weather result"+result);
                console.log(result);
                if(result.flag === "true"){
                    component.set("v.isTrue", true);
                }else{
                    component.set("v.isTrue", false);
                }
            }
        });
        $A.enqueueAction(action);
	},
    
    refreshWeather : function(component, event, helper) {
        var render = component.get("c.doinit");
        $A.enqueueAction(render);
    }
})