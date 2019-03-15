"use strict";
exports.__esModule = true;
var d3 = require("d3");
var Line = /** @class */ (function () {
    function Line(tree) {
        this._name = 'Line';
        this._tree = tree;
    }
    Object.defineProperty(Line.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "links", {
        get: function () {
            return this._tree.mappedData.descendants().slice(1);
        },
        enumerable: true,
        configurable: true
    });
    Line.prototype._straightLine = function (source, target) {
        var y = (source.y + target.y) / 2;
        var diagonal = "M" + source.x + "," + (source.y - this._tree.node.height / 2) + "\n    L" + source.x + "," + y + " L" + target.x + "," + y + " L" + target.x + "," + (target.y + this._tree.node.height / 2);
        return diagonal;
    };
    Line.prototype._curveLine = function (source, target) {
        var data = {
            source: source,
            target: {
                x: target.x,
                y: target.y + this._tree.node.height / 2 + 5
            }
        };
        var link = d3.linkHorizontal()
            .x(function (d) {
            return d.x;
        })
            .y(function (d) {
            return d.y;
        });
        return link(data);
    };
    Line.prototype._diagonal = function (source, target, type) {
        if (type === void 0) { type = 'straight'; }
        var map = {
            straight: this._straightLine,
            curve: this._curveLine
        };
        var typeFunc = map[type] || 'straight';
        return typeFunc.call(this, source, target);
    };
    Line.prototype.load = function (previousNode) {
        var _this = this;
        var preNode = previousNode || this._tree.hierarchy.instance;
        // Update the links...
        var link = this._tree.canvas.selectAll('path.link')
            .data(this.links, function (d) {
            return d.id;
        });
        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('d', function (d) {
            var o = {
                x: preNode.x0,
                y: preNode.y0
            };
            return _this._diagonal(o, o);
        })
            .style('fill', 'none')
            .style('strock', '#ccc')
            .style('stroke-width', 2);
        // UPDATE
        var linkUpdate = linkEnter.merge(link);
        // Transition back to the parent element position
        linkUpdate
            .transition()
            .duration(this._tree.animationTimeout)
            .attr('d', function (d) {
            return _this._diagonal(d, d.parent);
        });
        // Remove any exiting links
        var linkExit = link.exit();
        linkExit
            .transition()
            .duration(this._tree.animationTimeout)
            .attr('d', function (d) {
            var o = {
                x: preNode.x,
                y: preNode.y
            };
            return _this._diagonal(o, o);
        })
            .remove();
    };
    return Line;
}());
exports["default"] = Line;
