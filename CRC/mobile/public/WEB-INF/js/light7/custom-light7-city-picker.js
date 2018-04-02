
/**
 * 不使用strict
 * 
 * proviceAndCitys格式为
 * "name":"广东",
        "sub":[
            {
                "name":"请选择",
                            },
            {
                "name":"广州",
             }
          ]
 */
+function($) {
  "use strict";
  
  $.fn.cityPicker = function(params,proviceAndCitys) {
    return this.each(function() {
      if(!this) return;
      var format = function(data) {
        var result = [];
        for(var i=0;i<data.length;i++) {
          var d = data[i];
          if(d.name === "请选择") continue;
          result.push(d.name);
        }
        if(result.length) return result;
        return [""];
      };

      var sub = function(data) {
        if(!data.sub) return [""];
        return format(data.sub);
      };

      var getCities = function(d) {
        for(var i=0;i< raw.length;i++) {
          if(raw[i].name === d) return sub(raw[i]);
        }
        return [""];
      };


      var raw = proviceAndCitys;
      var provinces = raw.map(function(d) {
        return d.name;
      });
      var initCities = sub(raw[0]);

      var currentProvince = provinces[0];
      var currentCity = initCities[0];

      var defaults = {

        cssClass: "city-picker",
        rotateEffect: false,  //为了性能

        onChange: function (picker, values, displayValues) {
          var newProvince = values[0];
          var newCity;
          if(newProvince !== currentProvince) {
            var newCities = getCities(newProvince);
            newCity = newCities[0];           
            picker.cols[1].replaceValues(newCities);
            currentProvince = newProvince;
            currentCity = newCity;
            picker.updateValue();
            return;
          }
          newCity = picker.cols[1].value;
        },
        //cssClass: 'picker_provinceandcity',
        cols: [
          {
            values: provinces,
            cssClass: "picker_provinceandcity'"
          },
          {
            values: initCities,
            cssClass: "picker_provinceandcity'"
          }
        ]
      };

      var p = $.extend(defaults, params);
      //计算value
      var val = $(this).val();
      if(val) {
        p.value = val.split(" ");
        if(p.value[0]) {
          currentProvince = p.value[0];
          p.cols[1].values = getCities(p.value[0]);
        }
        if(p.value[1]) {
          currentCity = p.value[1];
        } 
       }
      $(this).picker(p);
    });
  };
}($);