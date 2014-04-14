(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('d3Trees', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          label: "@",
          line: "@",
          onClick: "&"
        },
        link: function(scope, iElement, iAttrs) {
          var margin = {top: 0, right: 220, bottom: 20, left: 20},
              width = 960 - margin.left - margin.right,
              height = 240 - margin.top - margin.bottom,
              duration = 750;
              //rectW = 85,
              //rectH = 85;

          var tree = d3.layout.tree()
              .separation(function(a, b) { return (a.linie === b.linie ) ? 1 : 1; })
              .children(function(d) { return d.linie; })
              .size([height, width]);
              //.nodeSize([200, 40]);
          
/*          var diagonal = d3.svg.diagonal()
              .projection(function (d) {
                return [d.x + rectW / 2, d.y + rectH / 2];
              });
*/
          var svg;
          svg = d3.select(iElement[0])
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // on window resize, re-render d3 canvas
          window.onresize = function() {
            return scope.$apply();
          };
          scope.$watch(function(){
              return angular.element(window)[0].innerWidth;
            }, function(){
              return scope.render();
            }
          );

          // define render function
          scope.render = function(data){
            // remove all previous items before render
            svg.selectAll("*").remove();

            var color = d3.scale.category20();

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
                  .attr("id", "arrowhead1")
                  .attr("refX", 9) /*must be smarter way to calculate shift*/
                  .attr("refY", 3)
                  .attr("markerWidth", 8)
                  .attr("markerHeight", 6)
                  .attr("orient", "auto")
                  .style("stroke", "#84b647")
                  .style("fill", "#84b647")
                  .append("svg:path")
                  .attr("d", "M 0,0 V 6 L8,2 Z"); //this is actual shape for arrowhead

            //d3.json("lines/PDE.json", function(json) {
            d3.json(scope.line, function(json) {
              var nodes = tree.nodes(json);

              // Normalize for fixed-depth.
              //nodes.forEach(function (d) {
              //  d.x = (d.depth * 120);
              //});
              
              var node = svg.selectAll(".node")
                  .data(nodes)
                  .enter().append("g")
                  .attr("class", "node")
                  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

              // Add rectangles to nodes
              node.append("rect")
                  .attr("width", Wrect)
                  .attr("height", Hrect)
                  //.attr("y", function (d) { 
                  //    if (d.typ == "cfe" || d.typ == "wanbb") {return 50};
                  //  })
                  .attr("class", function (d) {
                      return "rect-" + d.typ;
                    })
                  .attr("stroke-width", 2)
                  .style("filter", "url(#drop-shadow)");
                  

              node.append("text")
                  .attr("class", "name")
                  .attr("x", 40)
                  .attr("y", 20)
                  .attr("dy", ".35em")
                  .attr("text-anchor", "middle")
                  .text(function (d) {
                    return d.stacja;
                  });

              node.append("text")
                  .attr("x", 8)
                  .attr("y", -18)
                  .attr("dy", ".71em")
                  .attr("class", "about lifespan")
                  .text(function(d) { return d.typ; });

              node.append("text")
                  .attr("x", -200)
                  .attr("y", 8)
                  .attr("dy", "1.86em")
                  .attr("class", "about location")
                  .text(function(d) { return d.terma + " -> " + d.termb; });

              var link = svg.selectAll(".link")
                  .data(tree.links(nodes));

              link.enter().insert("path", "g")
                  .attr("class", function (d) {return "link " + d.target.typ;})
                  .attr("d", elbow)
                  .attr("marker-end", "url(#arrowhead1)")
                  .style("filter", "url(#drop-shadow)");

              function elbow(d, i) {
                var Wd, Hd, k;
                Wd = parseInt(node.select("rect").attr("width")); 
                Hd = parseInt(node.select("rect").attr("height"));
                k = (d.target.children ? 0 : i);
                //console.log("source.x - " + d.source.x, "source.y - " + d.source.y, Wd, Hd, i);
                //console.log("target.x - " + d.target.x, "target.y - " + d.target.y);
                return "M" + (d.source.y + Wd) + "," + (d.source.x + (Hd /4) * (i + 1) )
                     + "H" + (d.target.y - 200) + "V" + (d.target.x + Hd / 2 )
                     //+ (d.target.children ? "" : "h" + 200); //margin.right);
                     + "h" + 200;
              };
            
              function Wrect(d) {
                if (d.typ == "exmst2") {return 80};
                if (d.typ == "cfe") {return 80};
                if (d.typ == "wanbb") {return 80};
              };

              function Hrect(d) {
                if (d.typ == "exmst2") {return 40};
                if (d.typ == "cfe") {return 40};
                if (d.typ == "wanbb") {return 40};
              }

            });
            
          };
        }
      };
    }]);

}());
