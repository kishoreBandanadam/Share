public class ContactAttachWrapperUsingContentVersion {
    
    // Wrapper method with contact and its attachment list "content versions"
    @AuraEnabled
    public static List<attachWrap> getConAttachments(){
        
        //List<Contact> conList = [Select id, Name from Contact where Name LIKE '%Ki%'];
        map<Id, List<ContentVersion>> mapParentIdFiles = new map<Id, List<ContentVersion>>();
        //Map of Contact Id and Contact sObject
        //Map<Id,Contact> conList = new Map<Id,Contact>([Select id, Name, Account.Name, Phone from Contact where Name LIKE '%Ki%']);
        Map<Id,Contact> conList = new Map<Id,Contact>([Select id, Name, FirstName, LastName, Email, Account.Name, Phone from Contact LIMIT 50]);
        System.debug(':::conList:::'+conList);
        List<ContentDocumentLink> CDLs = new List<ContentDocumentLink>();
        //map of contact and list of ContentDocumentIds
        Map<String, List<Id>> cvMap = new Map<String, List<Id>>();
        //Set of contact Ids
        set<Id> conIds = conList.keySet();
        System.debug(':::conIds:::'+conIds);
        
        if(conList.Size() > 0 && conList != NULL){
            CDLs = [Select ContentDocumentId, LinkedEntityId 
                    from ContentDocumentLink 
                    where LinkedEntityId IN : conIds];
            System.debug(':::CDLs:::'+CDLs);
        }
        
        if(CDLs.Size() > 0 && CDLs != NULL){
            for(ContentDocumentLink c : CDLs){
                if(cvMap.containsKey(c.LinkedEntityId)){
                    List<Id> cd = cvMap.get(c.LinkedEntityId);
                    if(c.ContentDocumentId != NULL)
                        cd.add(c.ContentDocumentId);
                    System.debug(':::cd:::'+cd);
                    cvMap.put(c.LinkedEntityId, cd);
                }else{
                    cvMap.put(c.LinkedEntityId, new List<Id> { c.ContentDocumentId });
                }
            }
            System.debug(':::cvMap:::'+cvMap);
        }
        
        //Set of document Ids
        set<Id> setDocumentIds = new set<Id>();
        List<ContentDocumentLink> fileLinks = [select Id, LinkedEntityId, ContentDocumentId from ContentDocumentLink where LinkedEntityId in: conIds];
        for(ContentDocumentLink fileLink: fileLinks){
            setDocumentIds.add(fileLink.ContentDocumentId);
        }
        
        //creating map of ContentDocumentId and content version
        map<Id, ContentVersion> mapContentVersion = new map<Id, ContentVersion>();
        for(ContentVersion cv: [select Id, title, ContentDocumentId from ContentVersion where ContentDocumentId in: setDocumentIds]){
            mapContentVersion.put(cv.ContentDocumentId, cv);
        }
        
        //Map of contact Ids and content version
        for(ContentDocumentLink fileLink: fileLinks){
            if(mapContentVersion.containsKey(fileLink.ContentDocumentId)){
                if(mapParentIdFiles.containsKey(fileLink.LinkedEntityId)){
                    mapParentIdFiles.get(fileLink.LinkedEntityId).add(mapContentVersion.get(fileLink.ContentDocumentId));
                }else{
                    mapParentIdFiles.put(fileLink.LinkedEntityId, new List<ContentVersion>{mapContentVersion.get(fileLink.ContentDocumentId)});
                }
            }
        }
        
        
        List<attachWrap> wrapList = new List<attachWrap>();
        
        
        for(Contact c : conList.values()){
            wrapList.add(new attachWrap(c, mapParentIdFiles.get(c.id)));
        }
        
        System.debug(':::wrapList:::'+wrapList);
        return wrapList;
    }
    // End of wrapper method
    
    //Wrapper class
    public class attachWrap{
        
        @AuraEnabled public Contact  wCon {get;set;}
        @AuraEnabled public List<ContentVersion> wCV {get;set;}
        
        public attachWrap(Contact con, List<ContentVersion> CV){
            wCon = con;
            wCV =  CV;
        }
    }
    
    //Attachment delete method
    @AuraEnabled
    public static boolean deleteAttachments(Id attachId){
        
        if(attachId != NULL){
            ContentDocument file = [Select Id from ContentDocument where Id = :attachId];
            delete file;
            return true;
        }
        else{
            return false;
        }
    }
    
    @AuraEnabled
    public static boolean updateContact(Contact con){
        
        if(con != NULL){
            //Contact con = [Select Id from ContentDocument where Id = :attachId];
            update con;
            return true;
        }
        else{
            return false;
        }
    }
  
}