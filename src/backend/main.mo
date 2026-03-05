import Int "mo:core/Int";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type ContactMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  module ContactMessage {
    public func compare(msg1 : ContactMessage, msg2 : ContactMessage) : Order.Order {
      Int.compare(msg1.timestamp, msg2.timestamp);
    };
  };

  var nextMessageId = 0;
  let messages = Map.empty<Nat, ContactMessage>();

  public shared ({ caller }) func submitMessage(name : Text, email : Text, message : Text) : async () {
    let newMessage : ContactMessage = {
      name;
      email;
      message;
      timestamp = Time.now();
    };

    messages.add(nextMessageId, newMessage);
    nextMessageId += 1;
  };

  public query ({ caller }) func getAllMessages() : async [ContactMessage] {
    messages.values().toArray().sort().reverse();
  };

  public query ({ caller }) func getMessageById(id : Nat) : async ContactMessage {
    switch (messages.get(id)) {
      case (null) {
        Runtime.trap("Message with id " # id.toText() # " does not exist");
      };
      case (?message) { message };
    };
  };

  public query ({ caller }) func getAllMessagesByName(name : Text) : async [ContactMessage] {
    let messagesByName = messages.values().toArray().filter(
      func(message) {
        message.name == name;
      }
    );
    messagesByName.sort().reverse();
  };
};
