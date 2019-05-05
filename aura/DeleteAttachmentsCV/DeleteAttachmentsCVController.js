({
    handleDeleteEvent : function(component, event, helper) {
        var deleteFiles = event.getParam("toDeleteIds");
        if(deleteFiles.wCon){
        component.set("v.fileIds", deleteFiles.wCon);
        }
        console.log("deleteFiles",JSON.stringify(deleteFiles));
        
        if(deleteFiles.wCV != null){
            var attachIds = [];
            for(var i = 0; i < deleteFiles.wCV.length; i++){
                attachIds.push({
                    Title : deleteFiles.wCV[i].Title, Id : deleteFiles.wCV[i].Title, ContentDocumentId : deleteFiles.wCV[i].ContentDocumentId
                });
            }
            component.set("v.aIds", attachIds);
            console.log("attachIds",attachIds);
        }
        else{
            var attachIds = [];
            component.set("v.aIds", attachIds);
        }
        //console.log("deleteFiles[0].Title::::"+deleteFiles.wCV[0].Title);
        if(deleteFiles.wCon === null){
            
            //Toast message on deletion if there are no records in list
            var toastEvent = $A.get("e.force:showToast");
            
            toastEvent.setParams({
                "title": "Attention!",
                "message": "There are no files to delete",
                "type" : "ERROR"
            });
            toastEvent.fire();
        }else{
            component.set("v.isOpen", true);
        }
        /*var deleteFiles = component.get("v.fileIds");
        console.log("deleteFiles");
        console.log(deleteFiles);*/
        
    },
    
    closeModal : function(component, event, helper) {
        component.set("v.isOpen", false);
    },
    
    openModal : function(component, event, helper) {
        component.set("v.isOpen", true);
    },
    
    deleteFile : function(component, event, helper) {       
        var fileToDelete = event.getSource().get("v.value");       
        var action = component.get("c.deleteAttachments");
        action.setParams({
            attachId : fileToDelete
        });
        action.setCallback(this, function(response){            
            var state = response.getState();           
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                console.log(result);
                if(result === true){
                    
                    //alert(component.get("v.rowIndex"));
                    var index = component.getEvent("deleteRow");
                    index.setParams({
                        "rowIndex" : component.get("v.sNo")
                    });
                    index.fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    deleteRow : function(component, event, helper) {
        var index = event.getParams("v.sNo");
        //alert(index);
        var AllRowsList = component.get("v.aIds");
        AllRowsList.splice(index, 1);
        component.set("v.aIds", AllRowsList);
        
        //Close Modal
        //component.set("v.isOpen", false);
        
        var delEvntNotify = component.getEvent("DeleteNotifyComponentEvent");
        delEvntNotify.fire();
        
        //Toast message on deletion
        var toastEvent = $A.get("e.force:showToast");
        
        toastEvent.setParams({
            "title": "Success!",
            "message": "File deleted successfully.",
            "type" : "SUCCESS"
        });
        toastEvent.fire();
    },
    
    UpdateContact : function(component, event, helper) {
        
        var updatedCon = component.get("v.fileIds")
        console.log("updatedCon::");
        console.log(JSON.stringify(updatedCon));
        
        var action = component.get("c.updateContact");
        action.setParams({
            con : updatedCon
        });
        
        action.setCallback(this, function(response){
            console.log("In call back");
            var state = response.getState();
            console.log(state);
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                console.log(result);
                if(result == true){
                    //Toast message on deletion
                    var toastEvent = $A.get("e.force:showToast");
                    
                    toastEvent.setParams({
                        "title": "Success!",
                        "message": "File Updated successfully.",
                        "type" : "SUCCESS"
                    });
                    toastEvent.fire();
                    // Event to notify parent about update
                    var delEvntNotify = component.getEvent("DeleteNotifyComponentEvent");
                    delEvntNotify.fire();
                    //To close modal
                    component.set("v.isOpen", false);
                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    
                    toastEvent.setParams({
                        "title": "Failed!",
                        "message": "File Updated Error.",
                        "type" : "ERROR"
                    });
                }
            }
        });
        $A.enqueueAction(action);
    }
})