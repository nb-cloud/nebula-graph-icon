!function(e){var t,n,d,o,i,a,r=`${svgElement}`;function c(){i||(i=!0,d())}t=function(){var e,t,n;(n=document.createElement("div")).innerHTML=r,r=null,(t=n.getElementsByTagName("svg")[0])&&(t.setAttribute("aria-hidden","true"),t.style.position="absolute",t.style.width=0,t.style.height=0,t.style.overflow="hidden",e=t,(n=document.body).firstChild?(t=n.firstChild).parentNode.insertBefore(e,t):n.appendChild(e))},document.addEventListener?["complete","loaded","interactive"].indexOf(document.readyState)>-1?setTimeout(t,0):(n=function(){document.removeEventListener("DOMContentLoaded",n,!1),t()},document.addEventListener("DOMContentLoaded",n,!1)):document.attachEvent&&(d=t,o=e.document,i=!1,(a=function(){try{o.documentElement.doScroll("left")}catch(e){return void setTimeout(a,50)}c()})(),o.onreadystatechange=function(){"complete"==o.readyState&&(o.onreadystatechange=null,c())})}(window);