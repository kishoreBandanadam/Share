public class accListVf1 {
    
    Public List<Account> AccList {get; set;}
    public Account account{get; set;}
    
    Public accListVf1() {
        account = new Account();
        AccList = [Select Id, Name, Industry from account 
                                             Order by Name Asc NULLS LAST
                                             Limit 15];
    }
    
    public void save() {
        upsert account;
        AccList = [Select Id, Name, Industry from account 
                                             Order by Name Asc NULLS LAST
                                             Limit 15];
    }
    
    public void Edit() {
        
    }
        
}