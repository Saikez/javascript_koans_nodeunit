// Define a Constructor function for Animal Objects
function Animal(name) {
  this.name = name;
}

// Create an Object to act as a template for future instances of Animal Objects.
// As this Object contains functions, we can think of these as methods on all
// future Animal objects.
//
Animal.prototype = {
  speak: function() {
  },

  getName: function() {
    return this.name;
  },

  whoAmI: function() {
    return this;
  },

  myPrototype: function() {
    return Object.getPrototypeOf(this);
  }
}

// =============================================================================

// Define a Constructor function for Dog Objects
function Dog(name) {
  this.name = name;
};

// Use an Animal Object as the template for future Dog objects. In a sense, as
// we will consequently have the same methods as an Animal, we can think of Dog
// Objects as having inherited the methods from Animal.
//
Dog.prototype = new Animal();

// Override the behaviour of the speak method.
Dog.prototype.speak = function() {
  return "Woof!";
}

// Same for Ducks
function Duck(name) {
  this.name = name;
};
Duck.prototype = new Animal();
Duck.prototype.speak = function() {
  return "Quack!";
}

// Instantiate some Dog and Duck Objects

var dog = new Dog("Buddy");
var duck = new Duck("Donald");

// =============================================================================

exports.test_inheritance_means_using_a_parent_object_as_the_prototype = function(test) {
  test.equal('object', typeof(duck));
  test.equal(true, Object.getPrototypeOf(duck) instanceof Animal);
  test.done();
};

// At this point, the 'prototype chain' of a Duck object is as follows:
// Duck -> Animal -> Object -> Object.prototype -> null
//
exports.test_objects_ultimately_use_object_as_the_prototype = function(test) {
  var duckPrototype = Object.getPrototypeOf(duck);
  var animalPrototype = Object.getPrototypeOf(duckPrototype);
  var objectPrototype = Object.getPrototypeOf(animalPrototype);
  var noMorePrototypes = Object.getPrototypeOf(objectPrototype);

  test.equal(true, duckPrototype instanceof Animal);
  test.equal(true, animalPrototype instanceof Object);
  test.equal(true, objectPrototype === Object.prototype);
  test.equal(undefined, noMorePrototypes);
  test.done();
};

exports.test_objects_inherit_methods_from_parent_prototype = function(test) {
  test.equal('Woof!', dog.speak());
  test.equal('Buddy', dog.getName());
  test.equal(dog, dog.whoAmI());
  test.equal('Quack!', duck.speak());
  test.equal('Donald', duck.getName());
  test.equal(duck, duck.whoAmI());
  test.done();
}

exports.test_duck_typing_is_good_enough = function(test) {
  var animals = [dog, duck];
  var length = 0;

  for(var i = 0; i < animals.length; i++) {
    length += animals[i].getName().length;
  }

  test.equal(11, length);
  test.done();
}

exports.test_inherited_objects_can_change_behaviour = function(test) {
  Dog.prototype.getName = function() {
    return 5 * 5;
  }

  dog = new Dog();

  test.equal(25, dog.getName());
  test.equal('Barney', new Animal("Barney").getName());
  test.done();
}

exports.test_inherited_objects_can_call_their_parent_method_statically = function(test) {
  Dog.prototype.getName = function() {
    return 5 * 5;
  }

  dog = new Dog("Buddy");
  var animal = dog.myPrototype().myPrototype();

  test.equal(25, dog.getName());
  test.equal('Buddy', animal.getName.call(dog));
  test.done();
}
