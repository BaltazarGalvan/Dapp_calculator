import Float "mo:base/Float";
import Bool "mo:base/Bool";


actor {
    
    var counter : Float = 0;
    let sqrtRoot : Float = 0.5;

    private func privatePower (x: Float, y: Float) : Float{
        return Float.pow(x, y);
    };

    public func add (x : Float) : async Float{
        if(Float.isNaN(x)){
            return counter;  
        };
        counter := Float.add(counter,x);
        return counter;
    };

    public func sub (x : Float) : async Float{
        if(Float.isNaN(x)){
            return counter;  
        };
        counter := Float.sub(counter,x);
        return counter;
    };

    public func mul (x : Float) : async Float{
        if(Float.isNaN(x)){
            return counter;  
        };
        counter := Float.mul(counter,x);
        return counter;
    };

    public func div (x : Float) : async Float{
        if(Float.isNaN(x)){
            return counter;  
        };
        if (x!=0){
            counter := Float.div(counter,x);
        };
        return counter;
    };

    public func reset () : async Float{
        counter := 0;
        return counter;
    };

    public query func see () : async Float{
        return counter;
    };

    public func power (x : Float) : async Float{
        if(Float.isNaN(x)){
            return counter;  
        };
        counter := privatePower(counter,x);
        return counter;
    };

    public func sqrt () : async Float{
        counter := privatePower(counter, sqrtRoot);
        return counter;
    };

    public func floor () : async Float{
        counter := Float.floor(counter);
        return counter;
    };
    
};
