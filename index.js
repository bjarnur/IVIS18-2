/*
	Project trying to best visualize student attributes in order to enable
	optimal decision making when grouping students together. 

	Used Parallel-Coordinates library (and some examples):
  	http://syntagmatic.github.io/parallel-coordinates/ 
*/



/*
Parallell Coordinates model is bound to this */
var paracords;
/*
Keeps track of what features should currently be hidden */
var hidden_features = [];
/*
When true data is color coded by 'Major' attribute*/
var use_colors = false;
/*
List of available features*/
var features = ['Country', 'leisure_very_important',
                'leisure_rather_important','job_security_important',
                'job_achievement_important','family_very_important',
                'family_rather_important','very_happy','quite_happy',
                'child_manners_important','child_hard_work_important',
                'child_independence_important']
                
var filename = "http://localhost:8000/data/1994-1998.csv";


/*
Loads all records of all entries in dataset */
function load_full_records(data) {
	
    var family1 = (+data.family_very_important);
    var family2 = (+data.family_rather_important);
    var family = family1 + family2;
    
    var leisure1 = (+data.leisure_very_important);
    var leisure2 = (+data.leisure_rather_important);
    var leisure = leisure1 + leisure2;
    
    var happy1 = (+data.very_happy);
    var happy2 = (+data.quite_happy);
    var happy = happy1 + happy2;

    return {        
        //very_happy : +data.very_happy,
        //quite_happy : +data.quite_happy,
        //family_very_important : +data.family_very_important,
        //family_rather_important : +data.family_rather_important,
        //leisure_very_important : +data.leisure_very_important,
        //leisure_rather_important : + data.leisure_rather_important,
        Country : data.Country,        
        leisure_important : +leisure,
        job_security_important : +data.job_security_important,
        job_achievement_important : +data.job_achievement_important,
        family_important : +family,
        happy : + happy,
        child_manners_important : +data.child_manners_important,
        child_hard_work_important : +data.child_hard_work_important,
        child_independence_important : +data.child_independence_important		
	};
}

/*
Set color based on user selection */
function get_color(major) { 
  	/*
    if(use_colors) {
	  	switch(major) {
	  		case "Computer Science":
	  			return "red";
	  		case "Media Technology":
	  			return "green";
	  		case "Human-Computer Interaction":
	  			return "blue";
	  		default:
	  			return "cyan";
	  	}
  	}
  	else {
  		return "steelblue";
  	}*/
    return "steelblue";
 }

//TODO could be useful 
function get_attr_value(data, attribute_name) {
	var result = [];
	for(var i = 0; i < data.length; i++) {
		result.push(data[i][attribute_name]);	
	}
	return result;
}

/*
Filters data based on query selection */
function filter_data(data) {
	var filtered = [];
	for(var i = 0; i < data.length; i++) {
        console.log(data[i]['Country']);
	}
}

/*
Load data from .csv file, and render Parallell Coordinates*/
function load_parallell_coordinates() {
	
	d3.csv(	
		filename, 
		function(d) { return load_full_records(d); }, 
		function(error, data) {
			filter_data(data);
            console.log(data.Country);
			paracords = d3.parcoords()("#canvas")				
			    .color(function(d) { return get_color(d['Country']); })
			    .data(data)
			    .hideAxis(hidden_features)
			    .composite("darker")
			    .render()
			    .shadows()
			    .reorderable()
			    .brushMode("1D-axes");			    

			paracords.svg.selectAll(".dimension")
				//.on("click", change_color)
			paracords.svg.selectAll(".label")
				 .attr("transform", "translate(-5,-10) rotate(0)")
	});
}  

/*
Displayed instead of model if there is nothing to visualize */
function print_empty_selection() {
	d3.select("#canvas").html("");
	d3.select("#canvas")
      .append("p")
      .attr("id", "emptySelectionError")
      .append("text")
      .text("Add features and/or Majors to visualize! :)");
}

/*
Returns true if there is no data to print */
function is_empty_data() {
	return hidden_features.length == 9;
}

/*
Called from angular controller to update list of hidden features, and redraw model */
function update_feature_selection(features_to_hide) {		
	hidden_features = features_to_hide;
	if(is_empty_data()) {
		print_empty_selection();		
	}
	else {
		redraw_model();
	}
}

/*
Completely redraws Parallell Coordinates model */
function redraw_model() {
	//TODO: Currently redrawing whole model, might be a better way to do this
	d3.select("#canvas").html("");
	load_parallell_coordinates();
}


var app = angular.module("myApp", []); 
app.controller('featureSelectionController', ['$scope', 'filterFilter', function ($scope, filterFilter) {
	  // Dimensions
    
	  $scope.features = [
		{ name: 'Country', key: 'Country', selected: true},		
        { name: 'Leisure', key: 'leisure_important', selected: true},
		{ name: 'Job Security', key: 'job_security_important', selected: true},
		{ name: 'Job Achievement', key: 'job_achievement_important', selected: true},
        { name: 'Family', key: 'family_important', selected: true},
        { name: 'Overall happiness', key: 'happy', selected: false},
		{ name: 'Child manners', key: 'child_manners_important', selected: false},
		{ name: 'Child industriousness', key: 'child_hard_work_important', selected: true},
		{ name: 'Child independence', key: 'child_independence_important', selected: false},
        //{ name: 'very_happy', selected: false},
		//{ name: 'quite_happy', selected: false},
        //{ name: 'family_very_important', selected: false},
		//{ name: 'family_rather_important', selected: false},
        //{ name: 'leisure_very_important', selected: false},	
		//{ name: 'leisure_rather_important', selected: true},
	  ];
      
	  // Features that are not included 
	  $scope.features_to_hide = [];

	  // Helper method to get selected features
	  $scope.selectedFeatures = function selectedFeatures() {	  	
          return filterFilter($scope.features, { selected: true });
	  };

	  //Update list of hidden features, update PC model
	  $scope.$watch('features|filter:{selected:false}', function (nv) {	    
	    $scope.features_to_hide = nv.map(function (feature) {	      
	      return feature.key;
	    });
	    update_feature_selection($scope.features_to_hide);        
	  }, true);
      
    $scope.intervals = [
        {name: '1994-1998', key: '1'},
        {name: '1999-2004', key: '2'},
        {name: '2005-2009', key: '3'},
        {name: '2010-2014', key: '4'},
    ];
    $scope.selectedInterval = $scope.intervals[0];
    
    $scope.updateInterval = function() {        
        filename = "http://localhost:8000/data/" + $scope.selectedInterval.name + ".csv"        
        redraw_model();
    }
}]);


/*
Iniital construction of Parallell Coordinates */
document.addEventListener('DOMContentLoaded', function() { console.log('hello'); load_parallell_coordinates(); });
