(function () {
  'use strict';

  angular.module('myApp.directives')
    .directive('d3Trees', ['d3', '$compile', function(d3, $compile) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          label: "@",
          line: "@",
          stacja: "@",
          onClick: "&"
        },
        link: function(scope, iElement, iAttrs) {
          var margin = {top: 0, right: 220, bottom: 20, left: 20},
              width = 960 - margin.left - margin.right,
              height = 220 - margin.top - margin.bottom,
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
                //.attr("class", " caption")
                .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var div = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

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
                  .attr("stdDeviation", 3)
                  .attr("result", "blur");

            // translate output of Gaussian blur to the right and downwards with 2px
            // store result in offsetBlur
            filter.append("feOffset")
                  .attr("in", "blur")
                  .attr("dx", 4)
                  .attr("dy", 4)
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
                  .attr("d", "M 0,0 V 6 L8,3 Z"); //this is actual shape for arrowhead

            svg.append("svg:defs").selectAll("marker")
                  .data(["arrow"])
                  .enter().append("svg:marker")
                  .attr("id", "arrowhead2")
                  .attr("refX", 9) /*must be smarter way to calculate shift*/
                  .attr("refY", 3)
                  .attr("markerWidth", 8)
                  .attr("markerHeight", 6)
                  .attr("orient", "auto")
                  .style("stroke", "#ee502a")
                  .style("fill", "#ee502a")
                  .append("svg:path")
                  .attr("d", "M 0,0 V 6 L8,3 Z"); //this is actual shape for arrowhead

            //d3.json("lines/PDE.json", function(json) {
            d3.json(scope.line, function(json) {
              var nodes = tree.nodes(json);

              var node = svg.selectAll(".node")
                  .data(nodes)
                  .enter().append("g")
                  .attr("class", "node") //caption
                  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
                  //.attr("data-title", "To jest tytuł !!!")
                  //.attr("data-description", "sd jnd lggf dfhghdfg sd fglkdf glkdf gfldskgldfgldfh dfh d");

              // Add rectangles to nodes
              var rectnd = node.append("rect")
                  .on("click", function(d){return scope.onClick({item: d, st: d.parent.stacja});})
                  .attr("width", Wrect)
                  .attr("height", Hrect)
                  .on("mouseover", function(d, i) {
                      div.transition()
                          .duration(200)
                          .style("opacity", .9);
                      div .html( "Kliknij po więcej informacji !")
                          .style("left", (d3.event.pageX) + "px") //(d3.event.pageX) + "px")
                          .style("top", (d3.event.pageY) + "px"); //(d3.event.pageY - 28) + "px");
                      //console.log( rectnd[0][i].getScreenCTM().e, rectnd[0][i].getScreenCTM().f, rectnd[0][i].getCTM().e, rectnd[0][i].getCTM().f );
                  })
                  .on("mouseout", function(d) {
                      div.transition()
                          .duration(500)
                          .style("opacity", 0);
                  })
                  .attr("class", function (d) {
                      return "rect-" + d.typ;
                    })
                  .attr("stroke-width", 2)
                  .style("filter", "url(#drop-shadow)");

                // var boxnode = node.node();
                //var bbox = boxnode.getBBox();
                //console.log(svg.select("rect").position());

              node.append("text")
                  .attr("class", "name")
                  .attr("x", 40)
                  .attr("y", 20)
                  .attr("dy", ".35em")
                  .attr("text-anchor", "middle")
                  .text(function (d) {
                    return d.system;
                  });

              //if (nodes.typ == 'cfe') {
              node.append("text")
                  .attr("class", "cfe")
                  .attr("x", 40)
                  .attr("y", 20)
                  .attr("dy", ".35em")
                  .attr("text-anchor", "middle")
                  .text(function (d) {
                      return d.cfe + " " + d.port;
                  });
              //};

              node.append("text")
                  .attr("x", -200)
                  .attr("y", 10)
                  .attr("dy", "1.86em")
                  .attr("class", "about terms")
                  .text(function(d) { return d.terma + " -> " + d.termb; });

              node.append("text")
                  .attr("x", -200)
                  .attr("y", -4)
                  .attr("dy", "1.86em")
                  .attr("class", "about opis")
                  .text(function(d) { return d.opis; });

                node.append("ellipse")
                    //.data(tree.links(nodes))
                    .attr("cx", -250)
                    .attr("cy", 19)
                    .attr("rx", function (d) { if (d.typ == "wanbb") {return (30);} else {return 0;}})
                    .attr("ry", function (d) { if (d.typ == "wanbb") {return (15);} else {return 0;}})
                    .attr("stroke-width", 2)
                    .attr("stroke", "#ee502a")
                    .attr("fill", "#dc905e")
                    .style("filter", "url(#drop-shadow)");

                node.append("text")
                    .attr("x", -272)
                    .attr("y", 2)
                    .attr("dy", "1.86em")
                    .attr("class", "about ip")
                    .text(function (d) { if (d.typ == "wanbb") {return "WAN BB";}});

                var link = svg.selectAll(".link")
                  .data(tree.links(nodes));

              link.enter().insert("path", "g")
                  .attr("class", function (d) {return "link " + d.target.typ;})
                  .attr("d", elbow)
                  .attr("marker-end", function (d) {
                      return (d.target.typ == "cfe" ? "url(#arrowhead1)" : "url(#arrowhead2)");
                  })
                  .style("filter", "url(#drop-shadow)");

              function elbow(d, i) {
                  var Wd, Hd;
                  Wd = parseInt(node.select("rect").attr("width"));
                  Hd = parseInt(node.select("rect").attr("height"));
                    //k = (d.target.children ? 0 : i);
                    //console.log("source.x - " + d.source.x, "source.y - " + d.source.y, Wd, Hd, i);
                    //console.log("target.x - " + d.target.x, "target.y - " + d.target.y);
                  return "M" + (d.source.y + Wd) + "," + (d.source.x + (Hd /4) * (i + 1) )
                       + "H" + (d.target.y - 340) + "L" + (d.target.y - 300) + "," + (d.target.x + Hd / 2 )
                       + "h" + 300;
              };
            
              function Wrect(d) {
                if (d.typ == "exmst2" || d.typ == 'mikro') {return 80};
                if (d.typ == "cfe") {return 80};
                if (d.typ == "wanbb") {return 80};
                if (d.typ == "utj" || d.typ == "convutj") {return 80};
              };

              function Hrect(d) {
                if (d.typ == "exmst2" || d.typ == 'mikro') {return 40};
                if (d.typ == "cfe") {return 40};
                if (d.typ == "wanbb") {return 40};
                if (d.typ == "utj" || d.typ == "convutj") {return 40};
              };

            });

          };
        }
      };
    }]);

}());
