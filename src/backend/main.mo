import Int "mo:core/Int";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Migration "migration";
import Runtime "mo:core/Runtime";

(with migration = Migration.run)
actor {
  // Contact Messages
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
      case (null) { Runtime.trap("Message with id " # id.toText() # " does not exist") };
      case (?message) { message };
    };
  };

  public query ({ caller }) func getAllMessagesByName(name : Text) : async [ContactMessage] {
    let messagesByName = messages.values().toArray().filter(
      func(message) { message.name == name }
    );
    messagesByName.sort().reverse();
  };

  // Gallery Images
  type GalleryImage = {
    id : Nat;
    url : Text;
    caption : Text;
    order : Nat;
  };

  module GalleryImage {
    public func compare(img1 : GalleryImage, img2 : GalleryImage) : Order.Order {
      Int.compare(img1.order, img2.order);
    };
  };

  var nextImageId = 7;
  let images = Map.empty<Nat, GalleryImage>();

  public shared ({ caller }) func addImage(url : Text, caption : Text) : async Nat {
    let id = nextImageId;
    nextImageId += 1;

    let newImage : GalleryImage = {
      id;
      url;
      caption;
      order = id;
    };

    images.add(id, newImage);
    id;
  };

  public shared ({ caller }) func removeImage(id : Nat) : async () {
    switch (images.get(id)) {
      case (null) { Runtime.trap("Image with id " # id.toText() # " does not exist") };
      case (_) { images.remove(id) };
    };
  };

  public shared ({ caller }) func editImage(id : Nat, url : Text, caption : Text) : async () {
    switch (images.get(id)) {
      case (null) { Runtime.trap("Image with id " # id.toText() # " does not exist") };
      case (?existingImage) {
        let updatedImage : GalleryImage = {
          existingImage with url;
          caption;
        };
        images.add(id, updatedImage);
      };
    };
  };

  public query ({ caller }) func getAllImages() : async [GalleryImage] {
    images.values().toArray().sort();
  };

  // About Image
  var aboutImage : ?Text = null;

  public shared ({ caller }) func setAboutImage(url : Text) : async () {
    aboutImage := ?url;
  };

  public query ({ caller }) func getAboutImage() : async ?Text {
    aboutImage;
  };
};
