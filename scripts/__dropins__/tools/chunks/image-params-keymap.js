/*! Copyright 2025 Adobe
All Rights Reserved. */
var p=Object.defineProperty;var m=(e,a,t)=>a in e?p(e,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[a]=t;var s=(e,a,t)=>m(e,typeof a!="symbol"?a+"":a,t);class g{constructor(){s(this,"_map")}get map(){return this._map}set map(a){this._map=a}getMethods(){return{setMap:a=>{this.map=a},getMap:()=>this.map}}}const M=new g,{setMap:h,getMap:n}=M.getMethods();export{n as g,h as s};
