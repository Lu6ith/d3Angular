(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('d3Bars', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          label: "@",
          onClick: "&"
        },
        link: function(scope, iElement, iAttrs) {
          var svg = d3.select(iElement[0])
              .append("svg")
              .attr("width", "100%");

          // on window resize, re-render d3 canvas
          window.onresize = function() {
            return scope.$apply();
          };
          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              return scope.render(scope.data);
            }
          );

          // watch for data changes and re-render
          scope.$watch('data', function(newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          // define render function
          scope.render = function(data){
            // remove all previous items before render
            svg.selectAll("*").remove();

            // setup variables
            var width, height, max, color;
            width = d3.select(iElement[0])[0][0].offsetWidth - 20;
              // 20 is for margins and can be changed
            height = scope.data.length * 35;
              // 35 = 30(bar height) + 5(margin between bars)
            max = 98;
              // this can also be found dynamically when the data is not static
              // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))
            color = d3.scale.category20();

            // set the height based on the calculations above
            svg.attr('height', height);

            //create the rectangles for the bar chart
            svg.selectAll("rect")
              .data(data)
              .enter()
                .append("rect")
                .on("click", function(d, i){return scope.onClick({item: d});})
                .attr("height", 30) // height of each bar
                .attr("width", 0) // initial width of 0 for transition
                .attr("x", 10) // half of the 20 side margin specified above
                .attr("y", function(d, i){
                  return i * 35;
                }) // height + margin between bars
                .attr('fill', function(d) { return color(d.score); })
                .transition()
                  .duration(1000) // time of duration
                  .attr("width", function(d){
                    return d.score/(max/width);
                  }); // width based on scale

            svg.selectAll("text")
              .data(data)
              .enter()
                .append("text")
                .attr("fill", "#fff")
                .attr("y", function(d, i){return i * 35 + 21;})
                .attr("x", 15)
                .text(function(d){return d[scope.label] + d.score;});

          };
        }
      };
    }])
    .directive('d3Bars1', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          label: "@",
          onClick: "&"
        },
        link: function(scope, iElement, iAttrs) {
            var svg;
            svg = d3.select(iElement[0])
                .append("svg")
                .attr("width", "100%");

          // on window resize, re-render d3 canvas
          window.onresize = function() {
            return scope.$apply();
          };
          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              return scope.render(scope.data);
            }
          );

          // watch for data changes and re-render
          scope.$watch('data', function(newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          // define render function
          scope.render = function(data){
            // remove all previous items before render
            svg.selectAll("*").remove();

            // setup variables
            var width, height, max, color;
            width = d3.select(iElement[0])[0][0].offsetWidth/3;
              // 20 is for margins and can be changed
            height = scope.data.length * 45;
              // 35 = 30(bar height) + 5(margin between bars)
            max = 98;
              // this can also be found dynamically when the data is not static
              // max = Math.max.apply(Math, _.map(data, ((val)-> val.count)))
            color = d3.scale.category20();

            // set the height based on the calculations above
            svg.attr('height', height);

            // filters go in defs element
            var defs = svg.append("defs");

            // create filter with id #drop-shadow
            // height=130% so that the shadow is not clipped
            var filter = defs.append("filter")
                  .attr("id", "drop-shadow")
                  .attr("height", "130%");

            // SourceAlpha refers to opacity of graphic that this filter will be applied to
            // convolve that with a Gaussian with standard deviation 3 and store result
            // in blur
            filter.append("feGaussianBlur")
                  .attr("in", "SourceAlpha")
                  .attr("stdDeviation", 5)
                  .attr("result", "blur");

            // translate output of Gaussian blur to the right and downwards with 2px
            // store result in offsetBlur
            filter.append("feOffset")
                  .attr("in", "blur")
                  .attr("dx", 5)
                  .attr("dy", 5)
                  .attr("result", "offsetBlur");

            // overlay original SourceGraphic over translated blurred opacity by using
            // feMerge filter. Order of specifying inputs is important!
            var feMerge = filter.append("feMerge");

            feMerge.append("feMergeNode")
                  .attr("in", "offsetBlur");
            feMerge.append("feMergeNode")
                  .attr("in", "SourceGraphic");


            svg.append("svg:defs").selectAll("marker")
                  .data(["arrow"])
                  .enter().append("svg:marker")
                  .attr("id", "arrowhead")
                  .attr("refX", 9) /*must be smarter way to calculate shift*/
                  .attr("refY", 3)
                  .attr("markerWidth", 8)
                  .attr("markerHeight", 6)
                  .attr("orient", "auto")
                  .style("stroke", "rgb(6,120,155)")
                  .style("fill", "rgb(6,120,155)")
                  .append("svg:path")
                  .attr("d", "M 0,0 V 6 L8,2 Z"); //this is actual shape for arrowhead

            //create the rectangles for the bar chart
            svg.selectAll("rect")
              .data(data)
              .enter()
                .append("rect")
                .on("click", function(d, i){return scope.onClick({item: d});})
                .attr("height", 40) // height of each bar
                .attr("width", 0) // initial width of 0 for transition
                .attr("y", 5) // half of the 20 side margin specified above
                .attr("x", function(d, i){
                  return (i * width) + 10;
                }) // height + margin between bars
                .attr("fill", function(d) { return color(d.score); })
                .attr("stroke-width", 2)
                .style("filter", "url(#drop-shadow)")
                .transition()
                  .duration(1000) // time of duration
                  .attr("width", function(d){
                    return d.score/(max/width);
                  }); // width based on scale

            svg.selectAll("text")
              .data(data)
              .enter()
                .append("text")
                .attr("fill", "#fff")
                .attr("x", function(d, i){return i * width + 21;})
                .attr("y", 28)
                .text(function(d){return d[scope.label] + ' - ' + d.score;});

            svg.selectAll(".arrow")
              .data(data)
              .enter()
                .append("text")
                .attr("fill", "#000")
                .attr("x", function(d, i){return (i + 1) * width - 61;})
                .attr("y", 20)
                .text(function(d){return d.arrlabel;})
                .attr("class", ".arrow");
                //.text('to jest label');

            svg.selectAll(".line")
              .data(data)
              .enter()
                .append("line")
                .style("stroke", "rgb(6,120,155)")
                .attr("x1", function(d, i){return (i * width) + d.score/(max/width) + 10;})
                .attr("y1", 28)
                .attr("x2", function(d, i){return (i + 1) * width + 10;})
                .attr("y2", 28)
                .attr("marker-end", "url(#arrowhead)");
            svg.append("use")
                .attr("xlink:href", "#cloud" );
            //svg.select("use").select("svg").style("display", "block");
          };
        }
      };
    }]);

}());
