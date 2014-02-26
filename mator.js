/* jshint strict: true, undef: true */
/* global window */
// Animator
var mator = (function() {
  "use strict";
  
  var requestFrame = (function() {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            fallback();
    
    function fallback() {
      var start = +new Date();
      return function fallbackAnimationFrame(callback) {
        window.setTimeout(function() {
          callback.call(this, (+new Date()) - start);
        }, 1000 / 60);
      };
    }
  })();
  
  // Animate
  var fn = function(total, easing) {
    easing = easing || fn.easing.linear;
    
    var updates = [];
    var ctx, completed = false, start, worker = function(now) {
      var percent, elapsed, val,i,l;
      
      if(!start) start = now;
      
      elapsed = now - start;
      
      if(elapsed > total) {
        completed=true;
        elapsed=total;
      }
      
      percent = elapsed/total;
      val = easing(percent, elapsed, 0, 1, total);
      
      for(i=0,l=updates.length;i<l;i++) updates[i](val);
      
      if(!completed) return requestFrame(worker);
    };
    
    ctx = {
      start: function() { requestFrame(worker); return ctx; },
      reset: function() { completed = false; start = undefined; return ctx; },
      restart: function() { return ctx.reset().start(); },
      update: function(fn, start, end, tr) {
        var transformed = tr ? function(val) { fn(tr(val)); } : fn;
        var result = (start !== undefined) && (end !== undefined) ?
            function(val) { transformed(val*(end-start)+start); } : transformed;
        updates.push(result);
        return ctx;
      }
    };
    return ctx;
  };
  
  var toUnits = function(units) { return function(v) { return v+units; }; };
  fn.pixels = toUnits("px");
  fn.em = toUnits("em");
  
  var noop = function() {};
  fn.with = function(ctx, target) {
    if (target && target.call == Function.prototype.call) 
      return function callback(val) { target.call(ctx, val); };
    if(ctx && target)
      return function(val) { ctx[target] = val; };
    return noop;
  };
               
  // Easing functions.
  /* jshint ignore:start */
  fn.easing = (function() {
    var quad = {
      in: function (n,e,t,a,r) { return a*(e/=r)*e+t; },
      out: function (n,e,t,a,r) { return-a*(e/=r)*(e-2)+t; },
      both: function (n,e,t,a,r) { return(e/=r/2)<1?a/2*e*e+t:-a/2*(--e*(e-2)-1)+t; }
    };
               
    return {
      "linear": function(n,e,t,a,r) { return n*(a-t)+t; },
      "quad": quad
    };
  }());
  /* jshint ignore:end */
  
  return fn;
}());