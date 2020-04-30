
function round(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
}

function indexOfMin(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var min = arr[0];
    var minIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            minIndex = i;
            min = arr[i];
        }
    }

    return minIndex;
}

function exponential_rms(data) {
   const sum = [0, 0, 0, 0, 0, 0];
   const precision = 3;

   for (let n = 0; n < data.length; n++) {
     if (data[n][1] !== null) {
       sum[0] += data[n][0];
       sum[1] += data[n][1];
       sum[2] += data[n][0] * data[n][0] * data[n][1];
       sum[3] += data[n][1] * Math.log(data[n][1]);
       sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
       sum[5] += data[n][0] * data[n][1];
     }
   }

   const denominator = ((sum[1] * sum[2]) - (sum[5] * sum[5]));
   const a = Math.exp(((sum[2] * sum[3]) - (sum[5] * sum[4])) / denominator);
   const b = ((sum[1] * sum[4]) - (sum[5] * sum[3])) / denominator;

   return {
     A: round(a, precision),
     B: round(b, precision)
   };
 }

 function exponential_rms_precision(data) {
  const sum = [0, 0, 0, 0, 0, 0];
  const precision = 6;

  for (let n = 0; n < data.length; n++) {
    if (data[n][1] !== null) {
      sum[0] += data[n][0];
      sum[1] += data[n][1];
      sum[2] += data[n][0] * data[n][0] * data[n][1];
      sum[3] += data[n][1] * Math.log(data[n][1]);
      sum[4] += data[n][0] * data[n][1] * Math.log(data[n][1]);
      sum[5] += data[n][0] * data[n][1];
    }
  }

  const denominator = ((sum[1] * sum[2]) - (sum[5] * sum[5]));
  const a = Math.exp(((sum[2] * sum[3]) - (sum[5] * sum[4])) / denominator);
  const b = ((sum[1] * sum[4]) - (sum[5] * sum[3])) / denominator;

  return {
    A: round(a, precision),
    B: round(b, precision)
  };
}

 function logarithmic_rms(data) {
     const sum = [0, 0, 0, 0];
     const precision = 3;
     const len = data.length;

     for (let n = 0; n < len; n++) {
       if (data[n][1] !== null) {
         sum[0] += Math.log(data[n][0]);
         sum[1] += data[n][1] * Math.log(data[n][0]);
         sum[2] += data[n][1];
         sum[3] += (Math.log(data[n][0]) ** 2);
       }
     }

     const a = ((len * sum[1]) - (sum[2] * sum[0])) / ((len * sum[3]) - (sum[0] * sum[0]));
     const coeffB = round(a, precision);
     const coeffA = round((sum[2] - (coeffB * sum[0])) / len, precision);
     return {
       A: coeffA,
       B: coeffB
     }
   }

   function logarithmic_rms_precision(data) {
    const sum = [0, 0, 0, 0];
    const precision = 6;
    const len = data.length;

    for (let n = 0; n < len; n++) {
      if (data[n][1] !== null) {
        sum[0] += Math.log(data[n][0]);
        sum[1] += data[n][1] * Math.log(data[n][0]);
        sum[2] += data[n][1];
        sum[3] += (Math.log(data[n][0]) ** 2);
      }
    }

    const a = ((len * sum[1]) - (sum[2] * sum[0])) / ((len * sum[3]) - (sum[0] * sum[0]));
    const coeffB = round(a, precision);
    const coeffA = round((sum[2] - (coeffB * sum[0])) / len, precision);
    return {
      A: coeffA,
      B: coeffB
    }
  }

   function linear_rms(data) {
       const sum = [0, 0, 0, 0, 0];
       let len = 0;
       const precision = 3;

       for (let n = 0; n < data.length; n++) {
         if (data[n][1] !== null) {
           len++;
           sum[0] += data[n][0];
           sum[1] += data[n][1];
           sum[2] += data[n][0] * data[n][0];
           sum[3] += data[n][0] * data[n][1];
           sum[4] += data[n][1] * data[n][1];
         }
       }

       const run = ((len * sum[2]) - (sum[0] * sum[0]));
       const rise = ((len * sum[3]) - (sum[0] * sum[1]));
       const gradient = run === 0 ? 0 : round(rise / run, precision);
       const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), precision);

       return {
         A: gradient,
         B: intercept
       };
     }

     function linear_rms_precision(data) {
      const sum = [0, 0, 0, 0, 0];
      let len = 0;
      const precision = 6;

      for (let n = 0; n < data.length; n++) {
        if (data[n][1] !== null) {
          len++;
          sum[0] += data[n][0];
          sum[1] += data[n][1];
          sum[2] += data[n][0] * data[n][0];
          sum[3] += data[n][0] * data[n][1];
          sum[4] += data[n][1] * data[n][1];
        }
      }

      const run = ((len * sum[2]) - (sum[0] * sum[0]));
      const rise = ((len * sum[3]) - (sum[0] * sum[1]));
      const gradient = run === 0 ? 0 : round(rise / run, precision);
      const intercept = round((sum[1] / len) - ((gradient * sum[0]) / len), precision);

      return {
        A: gradient,
        B: intercept
      };
    }

 function estimate_exp(data, days)
  {
      mydata = [];
      for(let i=0; i<data.length; i++){
        mydata.push([i, data[i]]);
      }
      coeffs = exponential_rms(mydata);
      estimated = coeffs.A * Math.exp(coeffs.B * (data.length - 1 + days) );
      return round(estimated, 0);
  }

  function estimate_log(data, days)
  {
      mydata = [];
      for(let i=0; i < data.length; i++)
      {
        mydata.push([i+1, data[i]]);
      }
      coeffs = logarithmic_rms(mydata);
      estimated = coeffs.A + coeffs.B*Math.log(data.length + days +1);
      return round(estimated, 0)
  }

  function estimate_lin(data, days)
  {
    mydata = [];
    for(let i=0; i<data.length; i++){
      mydata.push([i, data[i]]);
    }
    coeffs = linear_rms(mydata);
    estimated = coeffs.A * (data.length-1+days) + coeffs.B;
    return round(estimated, 0);
  }

  function estimate_exp_noround(data, days)
  {
      mydata = [];
      for(let i=0; i<data.length; i++){
        mydata.push([i, data[i]]);
      }
      coeffs = exponential_rms_precision(mydata);
      estimated = coeffs.A * Math.exp(coeffs.B * (data.length - 1 + days) );
      return estimated;
  }

  function estimate_log_noround(data, days)
  {
      mydata = [];
      for(let i=0; i < data.length; i++)
      {
        mydata.push([i+1, data[i]]);
      }
      coeffs = logarithmic_rms_precision(mydata);
      estimated = coeffs.A + coeffs.B*Math.log(data.length + days +1);
      return estimated;
  }

  function estimate_lin_noround(data, days)
  {
    mydata = [];
    for(let i=0; i<data.length; i++){
      mydata.push([i, data[i]]);
    }
    coeffs = linear_rms_precision(mydata);
    estimated = coeffs.A * (data.length-1+days) + coeffs.B;
    return estimated;
  }

  function estimate_select(data, days, type)
  {
    if(type == 0)
    {
      return estimate_exp(data, days);
    }
    else if(type == 1)
    {
      return estimate_lin(data, days);
    }
    else if(type == 2)
    {
      return estimate_log(data, days);
    }
  }

  function estimate_select_noround(data, days, type)
  {
    if(type == 0)
    {
      return estimate_exp_noround(data, days);
    }
    else if(type == 1)
    {
      return estimate_lin_noround(data, days);
    }
    else if(type == 2)
    {
      return estimate_log_noround(data, days);
    }
  }

  var fechas = ["2020-02-25", "2020-02-26", "2020-02-27", "2020-02-28", "2020-02-29", "2020-03-01", "2020-03-02",
                "2020-03-03", "2020-03-04", "2020-03-05", "2020-03-06", "2020-03-07", "2020-03-08", "2020-03-09",
                "2020-03-10", "2020-03-11", "2020-03-12", "2020-03-13", "2020-03-14", "2020-03-15", "2020-03-16",
                "2020-03-17", "2020-03-18", "2020-03-19", "2020-03-20", "2020-03-21", "2020-03-22", "2020-03-23",
                "2020-03-24", "2020-03-25", "2020-03-26", "2020-03-27", "2020-03-28", "2020-03-29", "2020-03-30", 
                "2020-03-31", "2020-04-01", "2020-04-02", "2020-04-03", "2020-04-04", "2020-04-05", "2020-04-06", 
                "2020-04-07", "2020-04-08", "2020-04-09", "2020-04-10", "2020-04-11", "2020-04-12", "2020-04-13",
                "2020-04-14", "2020-04-15", "2020-04-16", "2020-04-17", "2020-04-18", "2020-04-19", "2020-04-20",
                "2020-04-21", "2020-04-22", "2020-04-23", "2020-04-24", "2020-04-25", "2020-04-26", "2020-04-27",
                "2020-04-28", "2020-04-29", "2020-04-30"];
  var contagios = [3, 10, 16, 32, 44, 66, 114, 135, 198, 237, 365, 430, 589, 999, 1622, 2128, 2950,
                  4209, 5753, 7753, 9191, 11178, 13716, 17147, 19980, 24926, 28572, 33089, 39793, 47610, 56188, 64059, 72248, 78797, 85195,
                  94417, 102136, 110238, 117710, 124736, 130759, 135032, 140510, 146690, 152446, 157022, 161852, 166019, 169496, 172541,
                  177633, 182816, 188068, 191726, 188579, 191164, 194516, 188508, 191389, 202990, 205905, 207634, 209465, 210773, 212917,
                  213435];
  var muertos = [0,0,0,0,0,0,0,0,0,3,5,8,17,17,35,47,84,
                 120,136,288,309,491,598,767,1002,1326,1720,2182,2696,3434,4089,4858,5690,6528,7340,8189,
                 9053, 10003, 10935, 11744, 12418, 13055, 13798, 14555, 15238, 15843, 16353, 16972, 17489, 
                 18056, 18579, 19130, 19478, 20043, 20453, 20852, 21282, 21717, 22157, 22524, 22902, 23190, 23521, 23822, 24275, 24543];

  var chart_prediction_data = {
    dates : [],
    total_i : [],
    total_i_days_end : [],
    total_i_end_date : [],
    total_d : [],
    total_d_days_end : [],
    total_d_end_date : []    
  }

var dt = new Date(fechas.slice(-1)[0]+"T19:00:00Z");
dt.setDate( dt.getDate() - 1 );
const milliseconds_a_day = 1000*3600*24;


ill = contagios.slice(-1)[0];
ill_exp = estimate_exp(contagios.slice(-6, -1), 1);
ill_lin = estimate_lin(contagios.slice(-6, -1), 1);
ill_log = estimate_log(contagios.slice(-6, -1), 1);

var ill_type = indexOfMin([Math.abs(ill_exp - ill),
                           Math.abs(ill_lin - ill),
                           Math.abs(ill_log - ill)]);

dead = muertos.slice(-1)[0];
dead_exp = estimate_exp(muertos.slice(-6, -1), 1);
dead_lin = estimate_lin(muertos.slice(-6, -1), 1);
dead_log = estimate_log(muertos.slice(-6, -1), 1);

var dead_type = indexOfMin([Math.abs(dead_exp - dead),
                            Math.abs(dead_lin - dead),
                            Math.abs(dead_log - dead)]);

// Previous day types
ill_previous = contagios.slice(-2)[0];
ill_exp_previous = estimate_exp(contagios.slice(-7, -2), 1);
ill_lin_previous = estimate_lin(contagios.slice(-7, -2), 1);
ill_log_previous = estimate_log(contagios.slice(-7, -2), 1);

var ill_type_previous = indexOfMin([Math.abs(ill_exp_previous - ill_previous),
                                    Math.abs(ill_lin_previous - ill_previous),
                                    Math.abs(ill_log_previous - ill_previous)]);

dead_previous = muertos.slice(-2)[0];
dead_exp_previous = estimate_exp(muertos.slice(-7, -2), 1);
dead_lin_previous = estimate_lin(muertos.slice(-7, -2), 1);
dead_log_previous = estimate_log(muertos.slice(-7, -2), 1);

var dead_type_previous = indexOfMin([Math.abs(dead_exp_previous - dead_previous),
                                    Math.abs(dead_lin_previous - dead_previous),
                                    Math.abs(dead_log_previous - dead_previous)]);

function refresh_counters()
{
    difference = Date.now()-dt;
    factor = difference/milliseconds_a_day;
    est_i = estimate_select(contagios.slice(-5), factor, ill_type);
    est_d = estimate_select(muertos.slice(-5), factor, dead_type);
    rate_i = estimate_select(contagios.slice(-5), factor+(1/24), ill_type) - est_i;
    rate_d = estimate_select(muertos.slice(-5), factor+(1/24), dead_type) - est_d;
    est_i_21 = estimate_select(contagios.slice(-6,-1), 1, ill_type_previous);
    est_d_21 = estimate_select(muertos.slice(-6,-1), 1, dead_type_previous);
    est_i_n21 = estimate_select(contagios.slice(-5), 1, ill_type);
    est_d_n21 = estimate_select(muertos.slice(-5), 1, dead_type);
    est_i_p7 = estimate_select(contagios.slice(-5), 8, ill_type);
    est_d_p7 = estimate_select(muertos.slice(-5), 8, dead_type);

    return {
        ill: contagios.slice(-1)[0],
        dead: muertos.slice(-1)[0],
        est_ill: est_i,
        est_dead: est_d,
        rate_ill: rate_i,
        rate_dead: rate_d,
        est_ill_21: est_i_21,
        est_dead_21: est_d_21,
        est_ill_n21: est_i_n21,
        est_dead_n21: est_d_n21,
        est_ill_p7: est_i_p7,
        est_dead_p7: est_d_p7
    };
}


function calculate_multipliers()
{
  let multipliers_i = [];
  let multipliers_d = [];
  
  let number_points = 5;
  let ill_type = 1;
  let dead_type = 1; 

  for (let i = 0; i < number_points - 1 ; i++) {       
    let est_i_0 = estimate_select(contagios.slice(-9 + i, -4 + i), 1, ill_type);
    let est_d_0 = estimate_select(muertos.slice(-9 + i, -4 + i), 1, dead_type);
    
    let est_i_1 = estimate_select(contagios.slice(-9 + i, -4 + i), 2, ill_type);  
    let est_d_1 = estimate_select(muertos.slice(-9 + i, -4 + i), 2, dead_type);

    let multiplier_i = est_i_1 / est_i_0;
    let multiplier_d = est_d_1 / est_d_0;

    multipliers_i.push(multiplier_i);
    multipliers_d.push(multiplier_d);
  } 

  let est_i_0 = estimate_select(contagios.slice(-number_points), 1, ill_type);
  let est_d_0 = estimate_select(muertos.slice(-number_points), 1, dead_type);
    
  let est_i_1 = estimate_select(contagios.slice(-number_points), 2, ill_type);  
  let est_d_1 = estimate_select(muertos.slice(-number_points), 2, dead_type);

  let multiplier_i = est_i_1 / est_i_0;
  let multiplier_d = est_d_1 / est_d_0;
    
  multipliers_i.push(multiplier_i);
  multipliers_d.push(multiplier_d);

  let mult_i_pred = [];
  let mult_d_pred = [];
  for (let i = 0; i < 180; i++) {
    // force linear estimation
    mult_i_pred.push(estimate_select_noround(multipliers_i, i + 1, 1));
    mult_d_pred.push(estimate_select_noround(multipliers_d, i + 1, 1));
  }

  return {
    mult_i : mult_i_pred,
    mult_d : mult_d_pred
  };    
}

function calculate_adders(number_points, shift = 0)
{
  let adders_i = [];
  let adders_d = [];
  
  let points_i = [];
  let points_d = [];

  if (shift > 0) {
    points_i = contagios.slice(- number_points - shift - 1 , - shift);
    points_d = muertos.slice(- number_points - shift - 1 , - shift);
  } else {
    points_i = contagios.slice(- number_points - 1);
    points_d = muertos.slice(- number_points - 1);
  }

  for (let i = 0; i < number_points; i++) {
    adders_i.push(points_i[i + 1] - points_i[i]);
    adders_d.push(points_d[i + 1] - points_d[i]);
  }

  let adder_i_pred = [];
  let adder_d_pred = [];
  for (let i = 0; i < 180; i++) {
    // force linear estimation
    adder_i_pred.push(estimate_select_noround(adders_i, i + 1, 1));
    adder_d_pred.push(estimate_select_noround(adders_d, i + 1, 1));
  }

  return {
    adders_i : adder_i_pred,
    adders_d : adder_d_pred
  };   
}

function calculate_projections_with_multipliers(multipliers)
{
  let est_i_n21 = estimate_select(contagios.slice(-5), 1, ill_type);
  let est_d_n21 = estimate_select(muertos.slice(-5), 1, dead_type);

  let proj_i = [];
  let proj_d = [];

  for (let i = 0; i < multipliers.mult_i.length; i++) {   
    proj_i.push(est_i_n21*multipliers.mult_i[i]);
    est_i_n21 = est_i_n21*multipliers.mult_i[i];

    proj_d.push(est_d_n21*multipliers.mult_d[i]);
    est_d_n21 = est_d_n21*multipliers.mult_d[i];
  }
  
  let index_max_i = proj_i.indexOf(Math.max(...proj_i));
  let index_max_d = proj_d.indexOf(Math.max(...proj_d));
  let max_i = Math.round(proj_i[index_max_i]);
  let max_d = Math.round(proj_d[index_max_d]);
  
  return {
    total_days_i : index_max_i + 1,
    total_days_d : index_max_d + 1,
    total_i : max_i,
    total_d : max_d
  }
}

function calculate_projections_with_adders(adders, shift = 0)
{  
  let ill = contagios.slice(-1 - shift)[0];
  let dead = muertos.slice(-1 - shift)[0];

  let proj_i = [];
  let proj_d = [];

  for (let i = 0; i < adders.adders_d.length; i++) {   
    proj_i.push(ill + adders.adders_i[i]);
    ill = ill + adders.adders_i[i]

    proj_d.push(dead + adders.adders_d[i]);
    dead = dead + adders.adders_d[i];
  }

  let index_max_i = proj_i.indexOf(Math.max(...proj_i));
  let index_max_d = proj_d.indexOf(Math.max(...proj_d));
  let max_i = Math.round(proj_i[index_max_i]);
  let max_d = Math.round(proj_d[index_max_d]);

  return {
    total_days_i : index_max_i + 1,
    total_days_d : index_max_d + 1,
    total_i : max_i,
    total_d : max_d
  }
}

function create_table_param(rotulo, datos)
{
  header =`<tr><th>Fecha</th><th>${rotulo}</th><th>Estimación exponencial</th><th>Estimación lineal</th><th>Estimación logarítmica</th></tr>`;

  body = "";
  //alert(estimate(contagios.slice(3, 8), 1));
  for(var i=5; i<fechas.length; i++)
  {
    expe = estimate_exp(datos.slice(i-5, i), 1);
    line = estimate_lin(datos.slice(i-5, i), 1);
    loge = estimate_log(datos.slice(i-5, i), 1);

    expd = "";
    lind = "";
    logd = "";
    odd = "";

    if(isNaN(expe))
    {
      expe = "-";
      expd = "";
    }
    else if(expe == datos[i])
    {
      expd = "";
    }
    else if(expe > datos[i])
    {
      expd = ` (+${(expe - datos[i]).toString()})`;
    }
    else
    {
      expd = ` (${(expe - datos[i]).toString()})`;
    }

    if(isNaN(line))
    {
      line = "-";
      lind = "";
    }
    else if(line == datos[i])
    {
      lind = "";
    }
    else if(line > datos[i])
    {
      lind = ` (+${(line - datos[i]).toString()})`;
    }
    else
    {
      lind = ` (${(line - datos[i]).toString()})`;
    }

    if(isNaN(loge))
    {
      loge = "-";
      logd = "";
    }
    else if(loge == datos[i])
    {
      logd = "";
    }
    else if(loge > datos[i])
    {
      logd = ` (+${(loge - datos[i]).toString()})`;
    }
    else
    {
      logd = ` (${(loge - datos[i]).toString()})`;
    }

    if(i > 1)
    {
      if(datos[i-1] == 0)
      {
        odd = "";
      }
      else {
        odd = ` [${round(datos[i]/datos[i-1], 2).toString()}]`;
      }
    }

    fila = "<tr>";
    fila += "<td>" + fechas[i] + "</td>";
    fila += "<td>" + datos[i] + odd + "</td>";
    fila += "<td>" + expe.toString() + expd + "</td>";
    fila += "<td>" + line.toString() + lind + "</td>";
    fila += "<td>" + loge.toString() + logd + "</td>";
    fila += "</tr>";
    body += fila;
  }

  table = "<table class='table'>";
  table += "<thead>" + header + "</thead>";
  table += "<tbody>" + body + "</tbody>";
  table += "</table>";

  return table;
}

function create_table_outbreak_end(fecha_desde, number_points)
{
  
  let initial_index = fechas.findIndex((e) => e == fecha_desde);
  
  let header =`<tr><th>Fecha</th><th>Total contagiados</th><th>Días - Fecha fin</th><th>Total muertes</th><th>Días - Fecha fin</th></tr>`;

  let body = "";
  
  for (let i = initial_index; i < fechas.length; i++) {
    let shift = fechas.length - i - 1;

    let adders = calculate_adders(number_points, shift)
    let projections = calculate_projections_with_adders(adders, shift)

    let date_end_i = new Date(fechas[i]+"T19:00:00Z");
    date_end_i.setDate(date_end_i.getDate() + projections.total_days_i - 1);

    let date_end_d = new Date(fechas[i]+"T19:00:00Z");
    date_end_d.setDate(date_end_d.getDate() + projections.total_days_d - 1);

    let fila = "<tr>";
    fila += "<td>" + fechas[i] + "</td>";
    fila += "<td>" + projections.total_i + "</td>";
    fila += "<td>" + projections.total_days_i + ' - ' + date_end_i.toLocaleDateString() + "</td>";
    fila += "<td>" + projections.total_d + "</td>";
    fila += "<td>" + projections.total_days_d + ' - ' + date_end_d.toLocaleDateString() +"</td>";
    fila += "</tr>";
    body += fila;

    chart_prediction_data.dates.push(fechas[i]);
    chart_prediction_data.total_i.push(projections.total_i);
    chart_prediction_data.total_i_days_end.push(projections.total_days_i);
    chart_prediction_data.total_i_end_date.push(date_end_i.toLocaleDateString())
    chart_prediction_data.total_d.push(projections.total_d);
    chart_prediction_data.total_d_days_end.push(projections.total_days_d);
    chart_prediction_data.total_d_end_date.push(date_end_d.toLocaleDateString())
  }

  let table = "<table class='table'>";
  table += "<thead>" + header + "</thead>";
  table += "<tbody>" + body + "</tbody>";
  table += "</table>";

  return table;
}

function display_results()
{
      counters = refresh_counters();
      if($("#estimated_dead").text() != counters.est_dead.toString())
      {
          $("#estimated_dead").text(counters.est_dead);
      }
      else
      {
          $("#estimated_dead").text(counters.est_dead);
      }

      if($("#estimated_ill").text() != counters.est_ill.toString())
      {
          $("#estimated_ill").text(counters.est_ill);
      }
      else
      {
          $("#estimated_ill").text(counters.est_ill);
      }

      $("#official_dead").text(counters.dead);
      $("#official_ill").text(counters.ill);


      datestring = ("0" + dt.getDate()).slice(-2) + "-" + ("0"+(dt.getMonth()+1)).slice(-2) + "-" +
    dt.getFullYear() + " " + ("0" + dt.getHours()).slice(-2) + ":" + ("0" + dt.getMinutes()).slice(-2);
      $("#official_date").text(datestring);
      nd = new Date();
      datestring2 = ("0" + nd.getHours()).slice(-2) + ":" + ("0" + nd.getMinutes()).slice(-2);
      datestring3 = ("0" + nd.getDate()).slice(-2) + "-" + ("0"+(nd.getMonth()+1)).slice(-2) + "-" +
    dt.getFullYear();

      $("#official_date").text(datestring);
      $("#current_date").text(datestring2);
      $("#current_daymonth").text(datestring3);

      $("#estimated_dead_21").text(counters.est_dead_21);
      $("#estimated_ill_21").text(counters.est_ill_21);
      $("#estimated_dead_n21").text(counters.est_dead_n21);
      $("#estimated_ill_n21").text(counters.est_ill_n21);
      $("#estimated_dead_p7").text(counters.est_dead_p7);
      $("#estimated_ill_p7").text(counters.est_ill_p7);
      $("#rate_ill").text(counters.rate_ill);
      $("#rate_dead").text(counters.rate_dead);
      $("#accuracy_ill").text(Math.min(round(100*counters.est_ill_21/counters.ill, 2),
                                       round(100*counters.ill/counters.est_ill_21, 2)).toString()+"%");
      $("#accuracy_dead").text(Math.min(round(100*counters.est_dead_21/counters.dead, 2),
                                        round(100*counters.dead/counters.est_dead_21, 2)).toString()+"%");      
}

function display_end_results_with_multipliers()
{
  let multipliers = calculate_multipliers();  
  let projections = calculate_projections_with_multipliers(multipliers);
  
  $("#ill_type").text(ill_type == 0 ? 'Estimación exponencial' : ill_type == 1 ? 'Estimación lineal' : 'Estimación logarítmica');
  $("#dead_type").text(dead_type == 0 ? 'Estimación exponencial' : dead_type == 1 ? 'Estimación lineal' : 'Estimación logarítmica');

  $("#total_i").text(projections.total_i);
  $("#total_d").text(projections.total_d);
  $("#total_days_i").text(projections.total_days_i);
  $("#total_days_d").text(projections.total_days_d);

  let date_end_i = new Date(fechas.slice(-1)[0]+"T19:00:00Z");
  date_end_i.setDate(date_end_i.getDate() + projections.total_days_i - 1);
  $("#date_end_i").text(date_end_i.toLocaleDateString());
  let date_end_d = new Date(fechas.slice(-1)[0]+"T19:00:00Z");
  date_end_d.setDate(date_end_d.getDate() + projections.total_days_d - 1);
  $("#date_end_d").text(date_end_d.toLocaleDateString());
}

function display_end_results_with_adders(number_points)
{
  let adders = calculate_adders(number_points);
  let projections = calculate_projections_with_adders(adders);
  
  $("#ill_type").text(ill_type == 0 ? 'Estimación exponencial' : ill_type == 1 ? 'Estimación lineal' : 'Estimación logarítmica');
  $("#dead_type").text(dead_type == 0 ? 'Estimación exponencial' : dead_type == 1 ? 'Estimación lineal' : 'Estimación logarítmica');

  $("#total_i").text(projections.total_i);
  $("#total_d").text(projections.total_d);

  $("#total_days_i").text(projections.total_days_i);
  $("#total_days_d").text(projections.total_days_d);

  let date_end_i = new Date(fechas.slice(-1)[0]+"T19:00:00Z");
  date_end_i.setDate(date_end_i.getDate() + projections.total_days_i - 1);
  $("#date_end_i").text(date_end_i.toLocaleDateString());
  let date_end_d = new Date(fechas.slice(-1)[0]+"T19:00:00Z");
  date_end_d.setDate(date_end_d.getDate() + projections.total_days_d - 1);
  $("#date_end_d").text(date_end_d.toLocaleDateString());
}

function plot_i() {
  Highcharts.chart('chart_i', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Curva epidemiológica - Contagios'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: {
        categories: fechas
    },
    yAxis: {
        title: {
            text: 'Cantidad acumulada'
        },
        type: 'linear',
        max: 180000
    },
    tooltip: {
        crosshairs: true,
        shared: true
    },
    series: [{
        name: 'Contagios',        
        data: contagios
    }],
  });
};

function plot_d() {
  Highcharts.chart('chart_d', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Curva epidemiológica - Muertes'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: {
        categories: fechas
    },
    yAxis: {
        title: {
            text: 'Cantidad acumulada'
        },
        type: 'linear',
        max: 20000
    },
    tooltip: {
        crosshairs: true,
        shared: true
    },
    series: [{
        name: 'Muertes',        
        data: muertos
    }],
    plotOptions: {
      series: {
          color: 'black'
      }
    },
  });
};

function plot_i_d() {
  Highcharts.chart('chart_i_d', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Curva epidemiológica - Contagios y Muertes'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: [{
        categories: fechas,
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        title: {
            text: 'Contagios',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Muertes',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        labels: {
            format: '',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 120,
        verticalAlign: 'top',
        y: 100,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Contagios',
        type: 'column',        
        data: contagios,
        tooltip: {
            valueSuffix: ''
        },
    }, {
        name: 'Muertes',
        type: 'column',
        data: muertos,
        yAxis: 1,
        tooltip: {
            valueSuffix: ''
        }
    }]
  });
}

function plot_daily_charts() {
  let dates = [];
  let daily_i = [];
  let daily_d = [];
  let initial_index = fechas.findIndex((e) => e == '2020-03-08');

  for (let i = initial_index; i < fechas.length - 1; i++) {
    dates.push(fechas[i]);
    daily_i.push(contagios[i+1] - contagios[i]);
    daily_d.push(muertos[i+1] - muertos[i]);
  }

  Highcharts.chart('chart_daily_i', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Curva acumulados - Contagios'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: {
        categories: dates
    },
    yAxis: {
        title: {
            text: 'Cantidad acumulada'
        },
        type: 'linear',
        max: 9000
    },
    tooltip: {
        crosshairs: true,
        shared: true
    },
    series: [{
        name: 'Contagios',        
        data: daily_i
    }],
    plotOptions: {
      series: {
          color: Highcharts.getOptions().colors[0]
      }
    },
  });

  Highcharts.chart('chart_daily_d', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Curva acumulados - Muertes'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: {
        categories: dates
    },
    yAxis: {
        title: {
            text: 'Cantidad acumulada'
        },
        type: 'linear',
        max: 1000
    },
    tooltip: {
        crosshairs: true,
        shared: true
    },
    series: [{
        name: 'Muertes',        
        data: daily_d
    }],
    plotOptions: {
      series: {
          color: Highcharts.getOptions().colors[1]
      }
    },
  });
}

function plot_predictions() {
  Highcharts.chart('chart_predictions_i', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Predicciones final de la primera ola - Contagios'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: [{
        categories: chart_prediction_data.dates,
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        title: {
            text: 'Total contagiados',
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Días para el final',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        labels: {
            format: '',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        opposite: true,
        allowDecimals: false
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 800,
        verticalAlign: 'top',
        y: 0,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
      name: 'Días para el final',
      type: 'column',
      data: chart_prediction_data.total_i_days_end,
      yAxis: 1,
      tooltip: {
          valueSuffix: ''
      },
      color: Highcharts.getOptions().colors[2]
    },      
    {
      name: 'Total contagiados',
      type: 'spline',        
      data: chart_prediction_data.total_i,
      tooltip: {
          valueSuffix: ''
      },
    }]
  });

  Highcharts.chart('chart_predictions_d', {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Predicciones final de la primera ola - Muertes'
    },
    subtitle: {
        text: 'Source: https://covid19.isciii.es/'
    },
    xAxis: [{
        categories: chart_prediction_data.dates,
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        },
        title: {
            text: 'Total muertes',
            style: {
                color: Highcharts.getOptions().colors[1]
            }
        }
    }, { // Secondary yAxis
        title: {
            text: 'Días para el final',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        labels: {
            format: '',
            style: {
                color: Highcharts.getOptions().colors[2]
            }
        },
        opposite: true,
        allowDecimals: false
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 800,
        verticalAlign: 'top',
        y: 0,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Días para el final',
        type: 'column',
        data: chart_prediction_data.total_d_days_end,
        yAxis: 1,   
        tooltip: {
            valueSuffix: ''
        },
        color: Highcharts.getOptions().colors[2]
    },
    {
        name: 'Total muertos',
        type: 'spline',        
        data: chart_prediction_data.total_d,        
        tooltip: {
            valueSuffix: ''
        },
        color: Highcharts.getOptions().colors[1]
    }]
  });
}

$( document ).ready(function() {
  let number_points = 23;
  display_results();
  //display_end_results_with_multipliers();
  display_end_results_with_adders(number_points);
  $("#prediction_table_ill").html(create_table_param("Contagios", contagios));
  $("#prediction_table_dead").html(create_table_param("Víctimas mortales", muertos));
  $("#prediction_table_outbreak_end").html(create_table_outbreak_end('2020-04-14', number_points));
  setInterval(display_results, 1000);
  setInterval('window.location.reload()', 600000);
  //plot_i();
  //plot_d();
  plot_i_d();
  plot_daily_charts();
  plot_predictions();
});
