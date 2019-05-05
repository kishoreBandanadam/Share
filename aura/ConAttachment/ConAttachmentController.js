({
    doinit : function(component, event, helper) {
        console.log("In Init");
        var action = component.get("c.getConAttachments");
        //action.setStorable();
        console.log("action");
        console.log(action);
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log("state");
            console.log(state);
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                console.log("result");
                console.log(result);
                component.set("v.wrapperList", result);
            }
        });
        $A.enqueueAction(action);
    },
    handleClick : function(component, event, helper) {
        console.log("In Handleclick");
        var lis = event.getSource().get("v.value");
        console.log(lis);
        $A.get('e.lightning:openFiles').fire({
            recordIds: [lis],
            //selectedRecordId: lis[1]
        });
    },
    
    handleComponentEvent : function(component, event, helper) {
        
        var callDoinit = component.get('c.doinit');
        $A.enqueueAction(callDoinit);
    },
    
    handleDelete : function(component, event, helper) {
        //Open modal event
        var OpenModalEvent = component.getEvent("OpenModalEvent");
        OpenModalEvent.fire();
        
        var childcomponent= component.find("childComp");
        console.log("In handle delete");
        var Ids = event.getSource().get("v.value");
        console.log("To be deleted Ids::::::");
        console.log(Ids);
        childcomponent.childmethod(Ids);
        
        /*var DeleteAttachmentsEvent = $A.get("e.c:DeleteAttachmentsEvent");
        DeleteAttachmentsEvent.setParams({
            toDeleteIds : Ids
        });*/
        //console.log("Event");
        //console.log(DeleteAttachmentsEvent);
        //DeleteAttachmentsEvent.fire();
    },
    
    detailPage : function(component, event, helper) {
        var detailId1 = event.currentTarget.title;
        console.log("detailId1:::::"+detailId1);
        //var detailId2 = event.getSource().getLocalId();
        //console.log("detailId2:::::"+detailId2);
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": detailId1,
            "slideDevName": "detail"
        });
        navEvt.fire();
    },
    openDetail : function(component, event, helper) {
        console.log("Event fired");
        
        // getting here the wrapper obj from iteration
        var files = event.getSource().get("v.value");
        console.log("files are: ", JSON.stringify(files));
                
        var appEvent = $A.get("e.c:DeleteAttachmentsEvent");
        appEvent.setParams({
            "toDeleteIds" :  files
        });
        appEvent.fire();
    },
    
    DeleteNotify : function(component, event, helper) {
        
        var init = component.get("c.doinit");
        $A.enqueueAction(init);
    },
    
    showSpinner : function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    
    hideSpinner : function(component, event, helper) {
        component.set("v.Spinner", false); 
    },
    
    openNotify : function(component, event, helper) {
        console.log("In open notify in poc");
        

        var rec = event.getSource().get("v.value");
        console.log(rec);
        component.set("v.recordId", rec);
        
        var open = component.get("v.isOpen");
        console.log(open);
        
        component.set("v.isOpen", true);
    },
    
    closeModal : function(component, event, helper) {
;
        
        component.set("v.isOpen", false);
        console.log("In close notify");
        
    },
})