exports.objects_have_a_prototype_object_that_share_propertes = function(test) {
	test.equal('object', typeof(Object.prototype));
	test.equal('object', typeof(Array.prototype));
	test.equal('object', typeof(String.prototype));
	test.done();
};

exports.object_prototype_is_the_same_object_for_all_instances = function(test) {
	var a = new Object();
	var b = new Object();
	test.equal(true, Object.getPrototypeOf(a) === Object.getPrototypeOf(b));
	test.done();
};

exports.object_prototypes_can_be_extended_like_any_other_object = function(test) {
	// and apply to existing objects...!
	var existing = {};

	Object.prototype.salutation = "Hello";
	Object.prototype.sayHello = function() {
		return this.salutation + " there!";
	};

	test.equal('Hello there!', new Object().sayHello());
	test.equal('Hello there!', new Array().sayHello());
	test.equal('Hello there!', new Number().sayHello());
	test.equal('Hi there!', {salutation : "Hi"}.sayHello());
	test.equal('Hello there!', existing.sayHello());
	test.done();
};

exports.functions_combined_with_new_operator_are_contructors_for_new_objects = function(test) {
	// Define a function object to act as a constructor
	function Person() {
		this.name = "Dan";
		this.greet = function() {
			return this.name + " says hi";
		};
	}

	var dan = new Person();
	var sally = new Person();
	sally.name = "Sally";

	test.equal('object', typeof(dan));
	test.equal(true, dan instanceof Person);
	test.equal('Dan', dan.name);
	test.equal('Dan says hi', dan.greet());
	test.equal('Sally', sally.name);
	test.equal('Sally says hi', sally.greet());
	test.equal(false, dan.greet === sally.greet);
	test.done();
};

exports.properties_defined_on_the_prototype_object_are_shared = function(test) {
	// Define a function object to act as a constructor
	function Person(name) {
		this.name = name;
	}

	Person.prototype.greet = function() {
		return this.name + " says hi";
	}

	var dan = new Person("Dan");
	var sally = new Person("Sally");

	test.equal(true, dan instanceof Person);
	test.equal('Dan', dan.name);
	test.equal('Dan says hi', dan.greet());
	test.equal('Sally', sally.name);
	test.equal('Sally says hi', sally.greet());
	test.equal(true, dan.greet === sally.greet);
	test.done();
};

exports.missing_properties_on_a_object_are_looked_up_on_the_prototype_chain = function(test) {
	function Person(name) {
		this.name = name;
	}

	Person.prototype.greet = function() {
		return this.name + " says hi";
	};

	function Instructor(name) {
		this.name = name;
	}

	Instructor.prototype = new Person();
	Instructor.prototype.constructor = Instructor;

	var dan = new Instructor("Dan");

	test.equal(true, dan instanceof Person);
	test.equal(true, dan instanceof Instructor);
	test.equal('Dan', dan.name);
	test.equal('Dan says hi', dan.greet());
	test.equal(true, dan.hasOwnProperty('name'));
	test.equal(false, dan.hasOwnProperty('greet')); // Belongs to the parent
	test.done();
};

exports.modifying_prototypes_is_a_good_way_to_extend_objects = function(test) {
	Array.prototype.reverseEach = function(fn) {
		for(var i = this.length - 1; i >= 0; i--) {
			fn(this[i], i, this);
		}
	};

	var result = [];

	["a", "b", "c"].reverseEach(function(value, index, array) {
		result.push(value);
	});

	test.equal('c', result[0]);
	test.equal('b', result[1]);
	test.equal('a', result[2]);
	test.done();
};
