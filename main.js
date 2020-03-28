
function round(number, precision) {
  const factor = 10 ** precision;
  return Math.round(number * factor) / factor;
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

 function estimate(data, days)
  {
      mydata = [];
      for(i=0; i<data.length; i++){
        mydata.push([i, data[i]]);
      }
      coeffs = exponential_rms(mydata);
      estimated = coeffs.A * Math.exp(coeffs.B * (data.length - 1 + days) );
      return round(estimated, 0);
  }

var fechas = ["2020-02-25", "2020-02-26", "2020-02-27", "2020-02-28", "2020-02-29", "2020-03-01", "2020-03-02", 
              "2020-03-03", "2020-03-04", "2020-03-05", "2020-03-06", "2020-03-07", "2020-03-08", "2020-03-09",
              "2020-03-10", "2020-03-11", "2020-03-12", "2020-03-13", "2020-03-14", "2020-03-15", "2020-03-16",
              "2020-03-17", "2020-03-18", "2020-03-19", "2020-03-20", "2020-03-21", "2020-03-22", "2020-03-23",
              "2020-03-24", "2020-03-25", "2020-03-26", "2020-03-27", "2020-03-28"];
var contagios = [3,10,16,32,44,66,114,135,198,237,365,430,589,999,1622,2128,2950,
                 4209,5753,7753,9191,11178,13716,17147,19980,24926,28572,33089,39793,47610,56188,64059,72248];
var muertos = [0,0,0,0,0,0,0,0,0,3,5,8,17,17,35,47,84,
               120,136,288,309,491,598,767,1002,1326,1720,2182,2696,3434,4089,4858,5690];
 
var dt = new Date(fechas.slice(-1)[0]+"T20:00:00Z");
dt.setDate( dt.getDate() - 1 );
const milliseconds_a_day = 1000*3600*24;

function refresh_counters()
{
    difference = Date.now()-dt;
    factor = difference/milliseconds_a_day;
    est_i = estimate(contagios.slice(-5), factor);
    est_d = estimate(muertos.slice(-5), factor);
    rate_i = estimate(contagios.slice(-5), factor+(1/24)) - est_i;
    rate_d = estimate(muertos.slice(-5), factor+(1/24)) - est_d; 
    est_i_21 = estimate(contagios.slice(-6,-1), 1);
    est_d_21 = estimate(muertos.slice(-6,-1), 1);
    est_i_n21 = estimate(contagios.slice(-5), 1);
    est_d_n21 = estimate(muertos.slice(-5), 1);
    est_i_p7 = estimate(contagios.slice(-5), 8);
    est_d_p7 = estimate(muertos.slice(-5), 8);
    
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

function create_table()
{
  header ="<tr><th>Fecha</th><th>Contagios oficiales</th><th>Contagios estimados</th><th>Muertes oficiales</th><th>Muertes estimadas</th></tr>";
  
  body = "";
  //alert(estimate(contagios.slice(3, 8), 1));
  for(var i=5; i<fechas.length; i++)
  {
    ce = estimate(contagios.slice(i-5, i), 1);
    me = estimate(muertos.slice(i-5, i), 1);
    
    cd = "";
    
    if(isNaN(ce))
    {
      ce = "-";
      cd = "";
    }
    else if(ce == contagios[i])
    {
       cd = "";
    }
    else if(ce > contagios[i])
    {
       cd = " (+" + (ce-contagios[i]).toString() + ")";
    }
    else
    {
       cd = " (" + (ce - contagios[i]).toString() + ")";
    }
    
    md = "";
    
    if(isNaN(me))
    {
      me = "-";
      md = "";
    }
    else if(me == muertos[i])
    {
      md = "";
    }
    else if(me > muertos[i])
    {
      md = " (+" + (me-muertos[i]).toString() + ")";
    }
    else
    {
      md = " (" + (me - muertos[i]).toString() + ")";
    }
    
    ocd = "";
    omd = "";
    
    if(i > 1)
    {
      if(muertos[i-1] == 0)
      {
        omd = "";
      }
      else {
        omd = " [" + round(muertos[i]/muertos[i-1], 2).toString() + "]";
      }
      if(contagios[i-1] == 0)
      {
        ocd = "";
      }
      else
      {
        ocd = " [" + round(contagios[i]/contagios[i-1], 2).toString() + "]";
      }
    }
  
    /*
    ocd = "";
    cd = "";
    omd = "";
    md = "";*/
    
    fila = "<tr>";
    fila += "<td>" + fechas[i] + "</td>";
    fila += "<td>" + contagios[i] + ocd + "</td>";
    fila += "<td>" + ce.toString() + cd + "</td>";
    fila += "<td>" + muertos[i] + omd + "</td>";
    fila += "<td>" + me.toString() + md + "</td>";
    fila += "</tr>";
    body += fila;
  }
  
  table = "<table class='table'>";
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
          //Y$("#estimated_dead").fadeOut("slow");
          $("#estimated_dead").text(counters.est_dead);
          //$("#estimated_dead").fadeIn("slow");
      }
      else
      {
          $("#estimated_dead").text(counters.est_dead);
      }
      
      if($("#estimated_ill").text() != counters.est_ill.toString())
      {
          //$("#estimated_ill").fadeOut("slow");
          $("#estimated_ill").text(counters.est_ill);
          //$("#estimated_ill").fadeIn("slow");
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

$( document ).ready(function() {
  display_results();
  $("#prediction_table").html(create_table());
  setInterval(display_results, 5000);
  setInterval('window.location.reload()', 600000);
});

