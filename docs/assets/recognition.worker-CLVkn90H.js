(function(){"use strict";/*!
 * ONNX Runtime Web v1.22.0
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var Lr=Object.defineProperty,Af=Object.getOwnPropertyDescriptor,Bf=Object.getOwnPropertyNames,Rf=Object.prototype.hasOwnProperty,Mf=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,r)=>(typeof require<"u"?require:t)[r]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),P=(e,t)=>()=>(e&&(t=e(e=0)),t),It=(e,t)=>{for(var r in t)Lr(e,r,{get:t[r],enumerable:!0})},Nf=(e,t,r,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Bf(t))!Rf.call(e,a)&&a!==r&&Lr(e,a,{get:()=>t[a],enumerable:!(i=Af(t,a))||i.enumerable});return e},Mt=e=>Nf(Lr({},"__esModule",{value:!0}),e),Nt,it,Et,tn,rn,an=P(()=>{Nt=new Map,it=[],Et=(e,t,r)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let i=Nt.get(e);if(i===void 0)Nt.set(e,{backend:t,priority:r});else{if(i.priority>r)return;if(i.priority===r&&i.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${r}`)}if(r>=0){let a=it.indexOf(e);a!==-1&&it.splice(a,1);for(let n=0;n<it.length;n++)if(Nt.get(it[n]).priority<=r){it.splice(n,0,e);return}it.push(e)}return}throw new TypeError("not a valid backend")},tn=async e=>{let t=Nt.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let r=!!t.initPromise;try{return r||(t.initPromise=t.backend.init(e)),await t.initPromise,t.initialized=!0,t.backend}catch(i){return r||(t.error=`${i}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},rn=async e=>{let t=e.executionProviders||[],r=t.map(l=>typeof l=="string"?l:l.name),i=r.length===0?it:r,a,n=[],s=new Set;for(let l of i){let d=await tn(l);typeof d=="string"?n.push({name:l,err:d}):(a||(a=d),a===d&&s.add(l))}if(!a)throw new Error(`no available backend found. ERR: ${n.map(l=>`[${l.name}] ${l.err}`).join(", ")}`);for(let{name:l,err:d}of n)r.includes(l)&&console.warn(`removing requested execution provider "${l}" from session options because it is not available: ${d}`);let u=t.filter(l=>s.has(typeof l=="string"?l:l.name));return[a,new Proxy(e,{get:(l,d)=>d==="executionProviders"?u:Reflect.get(l,d)})]}}),Df=P(()=>{an()}),nn,Pf=P(()=>{nn="1.22.0"}),Vr,Re,sn=P(()=>{Pf(),Vr="warning",Re={wasm:{},webgl:{},webgpu:{},versions:{common:nn},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Vr=e}},get logLevel(){return Vr}},Object.defineProperty(Re,"logLevel",{enumerable:!0})}),ge,Uf=P(()=>{sn(),ge=Re}),on,un,qf=P(()=>{on=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);r.width=e.dims[3],r.height=e.dims[2];let i=r.getContext("2d");if(i!=null){let a,n;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[3]):(a=e.dims[3],n=e.dims[2]);let s=t?.format!==void 0?t.format:"RGB",u=t?.norm,l,d;u===void 0||u.mean===void 0?l=[255,255,255,255]:typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:(l=[u.mean[0],u.mean[1],u.mean[2],0],u.mean[3]!==void 0&&(l[3]=u.mean[3])),u===void 0||u.bias===void 0?d=[0,0,0,0]:typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:(d=[u.bias[0],u.bias[1],u.bias[2],0],u.bias[3]!==void 0&&(d[3]=u.bias[3]));let c=n*a,f=0,h=c,g=c*2,_=-1;s==="RGBA"?(f=0,h=c,g=c*2,_=c*3):s==="RGB"?(f=0,h=c,g=c*2):s==="RBG"&&(f=0,g=c,h=c*2);for(let b=0;b<n;b++)for(let k=0;k<a;k++){let v=(e.data[f++]-d[0])*l[0],w=(e.data[h++]-d[1])*l[1],S=(e.data[g++]-d[2])*l[2],x=_===-1?255:(e.data[_++]-d[3])*l[3];i.fillStyle="rgba("+v+","+w+","+S+","+x+")",i.fillRect(k,b,1,1)}if("toDataURL"in r)return r.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},un=(e,t)=>{let r=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),i;if(r!=null){let a,n,s;t?.tensorLayout!==void 0&&t.tensorLayout==="NHWC"?(a=e.dims[2],n=e.dims[1],s=e.dims[3]):(a=e.dims[3],n=e.dims[2],s=e.dims[1]);let u=t!==void 0&&t.format!==void 0?t.format:"RGB",l=t?.norm,d,c;l===void 0||l.mean===void 0?d=[255,255,255,255]:typeof l.mean=="number"?d=[l.mean,l.mean,l.mean,l.mean]:(d=[l.mean[0],l.mean[1],l.mean[2],255],l.mean[3]!==void 0&&(d[3]=l.mean[3])),l===void 0||l.bias===void 0?c=[0,0,0,0]:typeof l.bias=="number"?c=[l.bias,l.bias,l.bias,l.bias]:(c=[l.bias[0],l.bias[1],l.bias[2],0],l.bias[3]!==void 0&&(c[3]=l.bias[3]));let f=n*a;if(t!==void 0&&(t.format!==void 0&&s===4&&t.format!=="RGBA"||s===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let h=4,g=0,_=1,b=2,k=3,v=0,w=f,S=f*2,x=-1;u==="RGBA"?(v=0,w=f,S=f*2,x=f*3):u==="RGB"?(v=0,w=f,S=f*2):u==="RBG"&&(v=0,S=f,w=f*2),i=r.createImageData(a,n);for(let T=0;T<n*a;g+=h,_+=h,b+=h,k+=h,T++)i.data[g]=(e.data[v++]-c[0])*d[0],i.data[_]=(e.data[w++]-c[1])*d[1],i.data[b]=(e.data[S++]-c[2])*d[2],i.data[k]=x===-1?255:(e.data[x++]-c[3])*d[3]}else throw new Error("Can not access image data");return i}}),sr,ln,dn,pn,cn,fn,Wf=P(()=>{Hr(),sr=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:r,width:i}=t,a=t.norm??{mean:255,bias:0},n,s;typeof a.mean=="number"?n=[a.mean,a.mean,a.mean,a.mean]:n=[a.mean[0],a.mean[1],a.mean[2],a.mean[3]??255],typeof a.bias=="number"?s=[a.bias,a.bias,a.bias,a.bias]:s=[a.bias[0],a.bias[1],a.bias[2],a.bias[3]??0];let u=t.format!==void 0?t.format:"RGBA",l=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",d=r*i,c=l==="RGBA"?new Float32Array(d*4):new Float32Array(d*3),f=4,h=0,g=1,_=2,b=3,k=0,v=d,w=d*2,S=-1;u==="RGB"&&(f=3,h=0,g=1,_=2,b=-1),l==="RGBA"?S=d*3:l==="RBG"?(k=0,w=d,v=d*2):l==="BGR"&&(w=0,v=d,k=d*2);for(let x=0;x<d;x++,h+=f,_+=f,g+=f,b+=f)c[k++]=(e[h]+s[0])/n[0],c[v++]=(e[g]+s[1])/n[1],c[w++]=(e[_]+s[2])/n[2],S!==-1&&b!==-1&&(c[S++]=(e[b]+s[3])/n[3]);return l==="RGBA"?new Oe("float32",c,[1,4,r,i]):new Oe("float32",c,[1,3,r,i])},ln=async(e,t)=>{let r=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,i=typeof ImageData<"u"&&e instanceof ImageData,a=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,n=typeof e=="string",s,u=t??{},l=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},d=c=>typeof HTMLCanvasElement<"u"&&c instanceof HTMLCanvasElement||c instanceof OffscreenCanvas?c.getContext("2d"):null;if(r){let c=l();c.width=e.width,c.height=e.height;let f=d(c);if(f!=null){let h=e.height,g=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(h=t.resizedHeight,g=t.resizedWidth),t!==void 0){if(u=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");u.tensorFormat="RGBA",u.height=h,u.width=g}else u.tensorFormat="RGBA",u.height=h,u.width=g;f.drawImage(e,0,0),s=f.getImageData(0,0,g,h).data}else throw new Error("Can not access image data")}else if(i){let c,f;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(c=t.resizedHeight,f=t.resizedWidth):(c=e.height,f=e.width),t!==void 0&&(u=t),u.format="RGBA",u.height=c,u.width=f,t!==void 0){let h=l();h.width=f,h.height=c;let g=d(h);if(g!=null)g.putImageData(e,0,0),s=g.getImageData(0,0,f,c).data;else throw new Error("Can not access image data")}else s=e.data}else if(a){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let c=l();c.width=e.width,c.height=e.height;let f=d(c);if(f!=null){let h=e.height,g=e.width;return f.drawImage(e,0,0,g,h),s=f.getImageData(0,0,g,h).data,u.height=h,u.width=g,sr(s,u)}else throw new Error("Can not access image data")}else{if(n)return new Promise((c,f)=>{let h=l(),g=d(h);if(!e||!g)return f();let _=new Image;_.crossOrigin="Anonymous",_.src=e,_.onload=()=>{h.width=_.width,h.height=_.height,g.drawImage(_,0,0,h.width,h.height);let b=g.getImageData(0,0,h.width,h.height);u.height=h.height,u.width=h.width,c(sr(b.data,u))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(s!==void 0)return sr(s,u);throw new Error("Input data provided is not supported - aborted tensor creation")},dn=(e,t)=>{let{width:r,height:i,download:a,dispose:n}=t,s=[1,i,r,4];return new Oe({location:"texture",type:"float32",texture:e,dims:s,download:a,dispose:n})},pn=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Oe({location:"gpu-buffer",type:r??"float32",gpuBuffer:e,dims:i,download:a,dispose:n})},cn=(e,t)=>{let{dataType:r,dims:i,download:a,dispose:n}=t;return new Oe({location:"ml-tensor",type:r??"float32",mlTensor:e,dims:i,download:a,dispose:n})},fn=(e,t,r)=>new Oe({location:"cpu-pinned",type:e,data:t,dims:r??[t.length]})}),ht,Dt,Gr,hn,Lf=P(()=>{ht=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Dt=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Gr=!1,hn=()=>{if(!Gr){Gr=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,r=globalThis.Float16Array,i=typeof r<"u"&&r.from;e&&(ht.set("int64",BigInt64Array),Dt.set(BigInt64Array,"int64")),t&&(ht.set("uint64",BigUint64Array),Dt.set(BigUint64Array,"uint64")),i?(ht.set("float16",r),Dt.set(r,"float16")):ht.set("float16",Uint16Array)}}}),mn,gn,Vf=P(()=>{Hr(),mn=e=>{let t=1;for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!="number"||!Number.isSafeInteger(i))throw new TypeError(`dims[${r}] must be an integer, got: ${i}`);if(i<0)throw new RangeError(`dims[${r}] must be a non-negative integer, got: ${i}`);t*=i}return t},gn=(e,t)=>{switch(e.location){case"cpu":return new Oe(e.type,e.data,t);case"cpu-pinned":return new Oe({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new Oe({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new Oe({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new Oe({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),Oe,Hr=P(()=>{qf(),Wf(),Lf(),Vf(),Oe=class{constructor(e,t,r){hn();let i,a;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,i=e.type,a=e.dims,e.location){case"cpu-pinned":{let s=ht.get(i);if(!s)throw new TypeError(`unsupported type "${i}" to create tensor from pinned buffer`);if(!(e.data instanceof s))throw new TypeError(`buffer should be of type ${s.name}`);this.cpuData=e.data;break}case"texture":{if(i!=="float32")throw new TypeError(`unsupported type "${i}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(i!=="float32"&&i!=="float16"&&i!=="int32"&&i!=="int64"&&i!=="uint32"&&i!=="uint64"&&i!=="int8"&&i!=="uint8"&&i!=="bool"&&i!=="uint4"&&i!=="int4")throw new TypeError(`unsupported type "${i}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let s,u;if(typeof e=="string")if(i=e,u=r,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");s=t}else{let l=ht.get(e);if(l===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&l===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${l.name} as data.`);e==="uint64"||e==="int64"?s=l.from(t,BigInt):s=l.from(t)}else if(t instanceof l)s=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")s=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&l!==Uint16Array)s=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${i} tensor's data must be type of ${l}`)}else if(u=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let l=typeof e[0];if(l==="string")i="string",s=e;else if(l==="boolean")i="bool",s=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${l}.`)}else if(e instanceof Uint8ClampedArray)i="uint8",s=Uint8Array.from(e);else{let l=Dt.get(e.constructor);if(l===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);i=l,s=e}if(u===void 0)u=[s.length];else if(!Array.isArray(u))throw new TypeError("A tensor's dims must be a number array");a=u,this.cpuData=s,this.dataLocation="cpu"}let n=mn(a);if(this.cpuData&&n!==this.cpuData.length&&!((i==="uint4"||i==="int4")&&Math.ceil(n/2)===this.cpuData.length))throw new Error(`Tensor's size(${n}) does not match data length(${this.cpuData.length}).`);this.type=i,this.dims=a,this.size=n}static async fromImage(e,t){return ln(e,t)}static fromTexture(e,t){return dn(e,t)}static fromGpuBuffer(e,t){return pn(e,t)}static fromMLTensor(e,t){return cn(e,t)}static fromPinnedBuffer(e,t,r){return fn(e,t,r)}toDataURL(e){return on(this,e)}toImageData(e){return un(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return gn(this,e)}}}),Pe,_n=P(()=>{Hr(),Pe=Oe}),or,Fr,je,Ue,yn=P(()=>{sn(),or=(e,t)=>{(typeof Re.trace>"u"?!Re.wasm.trace:!Re.trace)||console.timeStamp(`${e}::ORT::${t}`)},Fr=(e,t)=>{let r=new Error().stack?.split(/\r\n|\r|\n/g)||[],i=!1;for(let a=0;a<r.length;a++){if(i&&!r[a].includes("TRACE_FUNC")){let n=`FUNC_${e}::${r[a].trim().split(" ")[1]}`;t&&(n+=`::${t}`),or("CPU",n);return}r[a].includes("TRACE_FUNC")&&(i=!0)}},je=e=>{(typeof Re.trace>"u"?!Re.wasm.trace:!Re.trace)||Fr("BEGIN",e)},Ue=e=>{(typeof Re.trace>"u"?!Re.wasm.trace:!Re.trace)||Fr("END",e)}}),bn,Gf=P(()=>{an(),_n(),yn(),bn=class Cf{constructor(t){this.handler=t}async run(t,r,i){je();let a={},n={};if(typeof t!="object"||t===null||t instanceof Pe||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let s=!0;if(typeof r=="object"){if(r===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(r instanceof Pe)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(r)){if(r.length===0)throw new TypeError("'fetches' cannot be an empty array.");s=!1;for(let d of r){if(typeof d!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(d)===-1)throw new RangeError(`'fetches' contains invalid output name: ${d}.`);a[d]=null}if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else{let d=!1,c=Object.getOwnPropertyNames(r);for(let f of this.outputNames)if(c.indexOf(f)!==-1){let h=r[f];(h===null||h instanceof Pe)&&(d=!0,s=!1,a[f]=h)}if(d){if(typeof i=="object"&&i!==null)n=i;else if(typeof i<"u")throw new TypeError("'options' must be an object.")}else n=r}}else if(typeof r<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let d of this.inputNames)if(typeof t[d]>"u")throw new Error(`input '${d}' is missing in 'feeds'.`);if(s)for(let d of this.outputNames)a[d]=null;let u=await this.handler.run(t,a,n),l={};for(let d in u)if(Object.hasOwnProperty.call(u,d)){let c=u[d];c instanceof Pe?l[d]=c:l[d]=new Pe(c.type,c.data,c.dims)}return Ue(),l}async release(){return this.handler.dispose()}static async create(t,r,i,a){je();let n,s={};if(typeof t=="string"){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(n=t,typeof r=="object"&&r!==null)s=r;else if(typeof r<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let c=t,f=0,h=t.byteLength;if(typeof r=="object"&&r!==null)s=r;else if(typeof r=="number"){if(f=r,!Number.isSafeInteger(f))throw new RangeError("'byteOffset' must be an integer.");if(f<0||f>=c.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${c.byteLength}).`);if(h=t.byteLength-f,typeof i=="number"){if(h=i,!Number.isSafeInteger(h))throw new RangeError("'byteLength' must be an integer.");if(h<=0||f+h>c.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${c.byteLength-f}].`);if(typeof a=="object"&&a!==null)s=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else if(typeof i<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof r<"u")throw new TypeError("'options' must be an object.");n=new Uint8Array(c,f,h)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[u,l]=await rn(s),d=await u.createInferenceSessionHandler(n,l);return Ue(),new Cf(d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),jr,Hf=P(()=>{Gf(),jr=bn}),Ff=P(()=>{}),jf=P(()=>{}),Kf=P(()=>{}),Zf=P(()=>{}),Qf={};It(Qf,{InferenceSession:()=>jr,TRACE:()=>or,TRACE_FUNC_BEGIN:()=>je,TRACE_FUNC_END:()=>Ue,Tensor:()=>Pe,env:()=>ge,registerBackend:()=>Et});var qe=P(()=>{Df(),Uf(),Hf(),_n(),Ff(),jf(),yn(),Kf(),Zf()}),Kr=P(()=>{}),wn={};It(wn,{default:()=>$n});var Zr,Qr,$n,Xf=P(()=>{tc(),mt(),ai(),Zr="ort-wasm-proxy-worker",Qr=globalThis.self?.name===Zr,Qr&&(self.onmessage=e=>{let{type:t,in:r}=e.data;try{switch(t){case"init-wasm":oi(r.wasm).then(()=>{wa(r).then(()=>{postMessage({type:t})},i=>{postMessage({type:t,err:i})})},i=>{postMessage({type:t,err:i})});break;case"init-ep":{let{epName:i,env:a}=r;$a(a,i).then(()=>{postMessage({type:t})},n=>{postMessage({type:t,err:n})});break}case"copy-from":{let{buffer:i}=r,a=Tr(i);postMessage({type:t,out:a});break}case"create":{let{model:i,options:a}=r;xa(i,a).then(n=>{postMessage({type:t,out:n})},n=>{postMessage({type:t,err:n})});break}case"release":ka(r),postMessage({type:t});break;case"run":{let{sessionId:i,inputIndices:a,inputs:n,outputIndices:s,options:u}=r;Ta(i,a,n,s,new Array(s.length).fill(null),u).then(l=>{l.some(d=>d[3]!=="cpu")?postMessage({type:t,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:t,out:l},Ea([...n,...l]))},l=>{postMessage({type:t,err:l})});break}case"end-profiling":Ia(r),postMessage({type:t});break;default:}}catch(i){postMessage({type:t,err:i})}}),$n=Qr?null:e=>new Worker(e??Ae,{type:"module",name:Zr})}),vn={};It(vn,{default:()=>xn});var Xr,Yr,xn,kn,Yf=P(()=>{Yr=(Xr=self.location.href,async function(e={}){var t,r,i=e,a=new Promise((o,p)=>{t=o,r=p}),n=typeof window=="object",s=typeof WorkerGlobalScope<"u",u=s&&self.name?.startsWith("em-pthread");i.mountExternalData=(o,p)=>{o.startsWith("./")&&(o=o.substring(2)),(i.Fb||(i.Fb=new Map)).set(o,p)},i.unmountExternalData=()=>{delete i.Fb};var l=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,qc:!0}).buffer.constructor;let d=o=>async(...p)=>{try{if(i.Gb)throw Error("Session already started");let m=i.Gb={ec:p[0],errors:[]},y=await o(...p);if(i.Gb!==m)throw Error("Session mismatch");i.Kb?.flush();let $=m.errors;if(0<$.length){let I=await Promise.all($);if(I=I.filter(R=>R),0<I.length)throw Error(I.join(`
`))}return y}finally{i.Gb=null}};i.jsepInit=(o,p)=>{if(o==="webgpu"){[i.Kb,i.Vb,i.Zb,i.Lb,i.Yb,i.kb,i.$b,i.bc,i.Wb,i.Xb,i.ac]=p;let m=i.Kb;i.jsepRegisterBuffer=(y,$,I,R)=>m.registerBuffer(y,$,I,R),i.jsepGetBuffer=y=>m.getBuffer(y),i.jsepCreateDownloader=(y,$,I)=>m.createDownloader(y,$,I),i.jsepOnCreateSession=y=>{m.onCreateSession(y)},i.jsepOnReleaseSession=y=>{m.onReleaseSession(y)},i.jsepOnRunStart=y=>m.onRunStart(y),i.cc=(y,$)=>{m.upload(y,$)}}else if(o==="webnn"){let m=p[0];[i.oc,i.Ob,i.webnnEnsureTensor,i.Pb,i.webnnDownloadTensor]=p.slice(1),i.webnnReleaseTensorId=i.Ob,i.webnnUploadTensor=i.Pb,i.webnnOnRunStart=y=>m.onRunStart(y),i.webnnOnRunEnd=m.onRunEnd.bind(m),i.webnnRegisterMLContext=(y,$)=>{m.registerMLContext(y,$)},i.webnnOnReleaseSession=y=>{m.onReleaseSession(y)},i.webnnCreateMLTensorDownloader=(y,$)=>m.createMLTensorDownloader(y,$),i.webnnRegisterMLTensor=(y,$,I,R)=>m.registerMLTensor(y,$,I,R),i.webnnCreateMLContext=y=>m.createMLContext(y),i.webnnRegisterMLConstant=(y,$,I,R,D,W)=>m.registerMLConstant(y,$,I,R,D,i.Fb,W),i.webnnRegisterGraphInput=m.registerGraphInput.bind(m),i.webnnIsGraphInput=m.isGraphInput.bind(m),i.webnnRegisterGraphOutput=m.registerGraphOutput.bind(m),i.webnnIsGraphOutput=m.isGraphOutput.bind(m),i.webnnCreateTemporaryTensor=m.createTemporaryTensor.bind(m),i.webnnIsGraphInputOutputTypeSupported=m.isGraphInputOutputTypeSupported.bind(m)}};let c=()=>{let o=(p,m,y)=>(...$)=>{let I=Qe,R=m?.();$=p(...$);let D=m?.();return R!==D&&(p=D,y(R),m=y=null),Qe!=I?new Promise((W,K)=>{ja={resolve:W,reject:K}}):$};(()=>{for(let p of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])i[p]=o(i[p],()=>i[p],m=>i[p]=m)})(),d!==void 0&&(i._OrtRun=d(i._OrtRun),i._OrtRunWithBinding=d(i._OrtRunWithBinding)),c=void 0};i.asyncInit=()=>{c?.()};var f,h,g=Object.assign({},i),_=(o,p)=>{throw p},b="";(n||s)&&(s?b=self.location.href:typeof document<"u"&&document.currentScript&&(b=document.currentScript.src),Xr&&(b=Xr),b=b.startsWith("blob:")?"":b.slice(0,b.replace(/[?#].*/,"").lastIndexOf("/")+1),s&&(h=o=>{var p=new XMLHttpRequest;return p.open("GET",o,!1),p.responseType="arraybuffer",p.send(null),new Uint8Array(p.response)}),f=async o=>{if(j(o))return new Promise((m,y)=>{var $=new XMLHttpRequest;$.open("GET",o,!0),$.responseType="arraybuffer",$.onload=()=>{$.status==200||$.status==0&&$.response?m($.response):y($.status)},$.onerror=y,$.send(null)});var p=await fetch(o,{credentials:"same-origin"});if(p.ok)return p.arrayBuffer();throw Error(p.status+" : "+p.url)});var k=console.log.bind(console),v=console.error.bind(console),w=k,S=v;Object.assign(i,g),g=null;var x,T,z,E,A,N,L,Y,F,ee,U,ie,Q,V=i.wasmBinary,oe=!1,j=o=>o.startsWith("file://");function ue(){return x.buffer!=E.buffer&&$e(),E}function M(){return x.buffer!=E.buffer&&$e(),A}function q(){return x.buffer!=E.buffer&&$e(),N}function te(){return x.buffer!=E.buffer&&$e(),L}function O(){return x.buffer!=E.buffer&&$e(),Y}function ae(){return x.buffer!=E.buffer&&$e(),F}function ze(){return x.buffer!=E.buffer&&$e(),ee}function Ne(){return x.buffer!=E.buffer&&$e(),Q}if(u){let o=function(p){try{var m=p.data,y=m.Cb;if(y==="load"){let $=[];self.onmessage=I=>$.push(I),self.startWorker=()=>{postMessage({Cb:"loaded"});for(let I of $)o(I);self.onmessage=o};for(let I of m.Sb)i[I]&&!i[I].proxy||(i[I]=(...R)=>{postMessage({Cb:"callHandler",Rb:I,args:R})},I=="print"&&(w=i[I]),I=="printErr"&&(S=i[I]));x=m.lc,$e(),ve(m.mc)}else if(y==="run"){im(m.Bb),Xa(m.Bb,0,0,1,0,0),xc(),Ha(m.Bb),_e||(yf(),_e=!0);try{am(m.hc,m.Ib)}catch($){if($!="unwind")throw $}}else m.target!=="setimmediate"&&(y==="checkMailbox"?_e&&Cr():y&&(S(`worker: received unknown command ${y}`),S(m)))}catch($){throw bf(),$}};var ve,_e=!1;S=function(...p){p=p.join(" "),console.error(p)},self.alert=function(...p){postMessage({Cb:"alert",text:p.join(" "),jc:Pr()})},self.onunhandledrejection=p=>{throw p.reason||p},self.onmessage=o}function $e(){var o=x.buffer;i.HEAP8=E=new Int8Array(o),i.HEAP16=N=new Int16Array(o),i.HEAPU8=A=new Uint8Array(o),i.HEAPU16=L=new Uint16Array(o),i.HEAP32=Y=new Int32Array(o),i.HEAPU32=F=new Uint32Array(o),i.HEAPF32=ee=new Float32Array(o),i.HEAPF64=Q=new Float64Array(o),i.HEAP64=U=new BigInt64Array(o),i.HEAPU64=ie=new BigUint64Array(o)}function zr(){u?startWorker(i):X.Da()}u||(x=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),$e());var Jt,er=0,tr=null;function gc(){if(--er==0&&tr){var o=tr;tr=null,o()}}function ut(o){throw S(o="Aborted("+o+")"),oe=!0,o=new WebAssembly.RuntimeError(o+". Build with -sASSERTIONS for more info."),r(o),o}function _c(){return{a:{L:rm,Aa:tm,b:sm,$:Ic,A:Cc,pa:Oc,X:Bc,Z:Rc,qa:Mc,na:Nc,ga:Dc,ma:Pc,J:Uc,Y:qc,V:Wc,oa:Lc,W:Vc,va:om,E:um,Q:lm,O:pm,D:fm,v:hm,r:mm,P:gm,z:xm,R:km,ja:Sm,T:Tm,aa:Im,M:Em,F:zm,ia:Ha,sa:Cm,t:Om,Ca:Am,w:Mm,o:Nm,m:Pm,c:La,Ba:Um,n:qm,j:Vm,u:Gm,p:Hm,f:Fm,s:jm,l:Km,e:Zm,k:Qm,h:Xm,g:Ym,d:Jm,da:eg,ea:tg,fa:rg,ba:af,ca:nf,N:sf,xa:ag,ua:sg,i:og,C:ug,G:lg,ta:ng,x:dg,ra:pg,U:cg,q:ig,y:fg,K:hg,S:mg,za:gg,ya:_g,ka:df,la:pf,_:Pa,B:cf,I:ff,ha:hf,H:mf,a:x,wa:Da}}}var Ra={840156:(o,p,m,y,$)=>{if(i===void 0||!i.Fb)return 1;if((o=xe(Number(o>>>0))).startsWith("./")&&(o=o.substring(2)),!(o=i.Fb.get(o)))return 2;if(p=Number(p>>>0),m=Number(m>>>0),y=Number(y>>>0),p+m>o.byteLength)return 3;try{let I=o.subarray(p,p+m);switch($){case 0:M().set(I,y>>>0);break;case 1:i.nc?i.nc(y,I):i.cc(y,I);break;default:return 4}return 0}catch{return 4}},840980:(o,p,m)=>{i.Pb(o,M().subarray(p>>>0,p+m>>>0))},841044:()=>i.oc(),841086:o=>{i.Ob(o)},841123:()=>{i.Wb()},841154:()=>{i.Xb()},841183:()=>{i.ac()},841208:o=>i.Vb(o),841241:o=>i.Zb(o),841273:(o,p,m)=>{i.Lb(Number(o),Number(p),Number(m),!0)},841336:(o,p,m)=>{i.Lb(Number(o),Number(p),Number(m))},841393:()=>typeof wasmOffsetConverter<"u",841450:o=>{i.kb("Abs",o,void 0)},841501:o=>{i.kb("Neg",o,void 0)},841552:o=>{i.kb("Floor",o,void 0)},841605:o=>{i.kb("Ceil",o,void 0)},841657:o=>{i.kb("Reciprocal",o,void 0)},841715:o=>{i.kb("Sqrt",o,void 0)},841767:o=>{i.kb("Exp",o,void 0)},841818:o=>{i.kb("Erf",o,void 0)},841869:o=>{i.kb("Sigmoid",o,void 0)},841924:(o,p,m)=>{i.kb("HardSigmoid",o,{alpha:p,beta:m})},842003:o=>{i.kb("Log",o,void 0)},842054:o=>{i.kb("Sin",o,void 0)},842105:o=>{i.kb("Cos",o,void 0)},842156:o=>{i.kb("Tan",o,void 0)},842207:o=>{i.kb("Asin",o,void 0)},842259:o=>{i.kb("Acos",o,void 0)},842311:o=>{i.kb("Atan",o,void 0)},842363:o=>{i.kb("Sinh",o,void 0)},842415:o=>{i.kb("Cosh",o,void 0)},842467:o=>{i.kb("Asinh",o,void 0)},842520:o=>{i.kb("Acosh",o,void 0)},842573:o=>{i.kb("Atanh",o,void 0)},842626:o=>{i.kb("Tanh",o,void 0)},842678:o=>{i.kb("Not",o,void 0)},842729:(o,p,m)=>{i.kb("Clip",o,{min:p,max:m})},842798:o=>{i.kb("Clip",o,void 0)},842850:(o,p)=>{i.kb("Elu",o,{alpha:p})},842908:o=>{i.kb("Gelu",o,void 0)},842960:o=>{i.kb("Relu",o,void 0)},843012:(o,p)=>{i.kb("LeakyRelu",o,{alpha:p})},843076:(o,p)=>{i.kb("ThresholdedRelu",o,{alpha:p})},843146:(o,p)=>{i.kb("Cast",o,{to:p})},843204:o=>{i.kb("Add",o,void 0)},843255:o=>{i.kb("Sub",o,void 0)},843306:o=>{i.kb("Mul",o,void 0)},843357:o=>{i.kb("Div",o,void 0)},843408:o=>{i.kb("Pow",o,void 0)},843459:o=>{i.kb("Equal",o,void 0)},843512:o=>{i.kb("Greater",o,void 0)},843567:o=>{i.kb("GreaterOrEqual",o,void 0)},843629:o=>{i.kb("Less",o,void 0)},843681:o=>{i.kb("LessOrEqual",o,void 0)},843740:(o,p,m,y,$)=>{i.kb("ReduceMean",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},843915:(o,p,m,y,$)=>{i.kb("ReduceMax",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},844089:(o,p,m,y,$)=>{i.kb("ReduceMin",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},844263:(o,p,m,y,$)=>{i.kb("ReduceProd",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},844438:(o,p,m,y,$)=>{i.kb("ReduceSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},844612:(o,p,m,y,$)=>{i.kb("ReduceL1",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},844785:(o,p,m,y,$)=>{i.kb("ReduceL2",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},844958:(o,p,m,y,$)=>{i.kb("ReduceLogSum",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},845135:(o,p,m,y,$)=>{i.kb("ReduceSumSquare",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},845315:(o,p,m,y,$)=>{i.kb("ReduceLogSumExp",o,{keepDims:!!p,noopWithEmptyAxes:!!m,axes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},845495:o=>{i.kb("Where",o,void 0)},845548:(o,p,m)=>{i.kb("Transpose",o,{perm:p?Array.from(O().subarray(Number(p)>>>0,Number(m)>>>0)):[]})},845672:(o,p,m,y)=>{i.kb("DepthToSpace",o,{blocksize:p,mode:xe(m),format:y?"NHWC":"NCHW"})},845805:(o,p,m,y)=>{i.kb("DepthToSpace",o,{blocksize:p,mode:xe(m),format:y?"NHWC":"NCHW"})},845938:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te,Rt)=>{i.kb("ConvTranspose",o,{format:W?"NHWC":"NCHW",autoPad:p,dilations:[m],group:y,kernelShape:[$],pads:[I,R],strides:[D],wIsConst:()=>!!ue()[K>>>0],outputPadding:se?Array.from(O().subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:he?Array.from(O().subarray(Number(he)>>>0,Number(Te)>>>0)):[],activation:xe(Rt)})},846371:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te)=>{i.kb("ConvTranspose",o,{format:D?"NHWC":"NCHW",autoPad:p,dilations:Array.from(O().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:y,kernelShape:Array.from(O().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(O().subarray(Number(I)>>>0,4+(Number(I)>>>0)>>>0)),strides:Array.from(O().subarray(Number(R)>>>0,2+(Number(R)>>>0)>>>0)),wIsConst:()=>!!ue()[W>>>0],outputPadding:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from(O().subarray(Number(pe)>>>0,Number(he)>>>0)):[],activation:xe(Te)})},847032:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te,Rt)=>{i.kb("ConvTranspose",o,{format:W?"NHWC":"NCHW",autoPad:p,dilations:[m],group:y,kernelShape:[$],pads:[I,R],strides:[D],wIsConst:()=>!!ue()[K>>>0],outputPadding:se?Array.from(O().subarray(Number(se)>>>0,Number(pe)>>>0)):[],outputShape:he?Array.from(O().subarray(Number(he)>>>0,Number(Te)>>>0)):[],activation:xe(Rt)})},847465:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te)=>{i.kb("ConvTranspose",o,{format:D?"NHWC":"NCHW",autoPad:p,dilations:Array.from(O().subarray(Number(m)>>>0,2+(Number(m)>>>0)>>>0)),group:y,kernelShape:Array.from(O().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),pads:Array.from(O().subarray(Number(I)>>>0,4+(Number(I)>>>0)>>>0)),strides:Array.from(O().subarray(Number(R)>>>0,2+(Number(R)>>>0)>>>0)),wIsConst:()=>!!ue()[W>>>0],outputPadding:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],outputShape:pe?Array.from(O().subarray(Number(pe)>>>0,Number(he)>>>0)):[],activation:xe(Te)})},848126:(o,p)=>{i.kb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},848217:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te)=>{i.kb("AveragePool",o,{format:Te?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:$,dilations:I?Array.from(O().subarray(Number(I)>>>0,Number(R)>>>0)):[],kernel_shape:D?Array.from(O().subarray(Number(D)>>>0,Number(W)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:pe?Array.from(O().subarray(Number(pe)>>>0,Number(he)>>>0)):[]})},848696:(o,p)=>{i.kb("GlobalAveragePool",o,{format:p?"NHWC":"NCHW"})},848787:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te)=>{i.kb("AveragePool",o,{format:Te?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:$,dilations:I?Array.from(O().subarray(Number(I)>>>0,Number(R)>>>0)):[],kernel_shape:D?Array.from(O().subarray(Number(D)>>>0,Number(W)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:pe?Array.from(O().subarray(Number(pe)>>>0,Number(he)>>>0)):[]})},849266:(o,p)=>{i.kb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},849353:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te)=>{i.kb("MaxPool",o,{format:Te?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:$,dilations:I?Array.from(O().subarray(Number(I)>>>0,Number(R)>>>0)):[],kernel_shape:D?Array.from(O().subarray(Number(D)>>>0,Number(W)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:pe?Array.from(O().subarray(Number(pe)>>>0,Number(he)>>>0)):[]})},849828:(o,p)=>{i.kb("GlobalMaxPool",o,{format:p?"NHWC":"NCHW"})},849915:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te)=>{i.kb("MaxPool",o,{format:Te?"NHWC":"NCHW",auto_pad:p,ceil_mode:m,count_include_pad:y,storage_order:$,dilations:I?Array.from(O().subarray(Number(I)>>>0,Number(R)>>>0)):[],kernel_shape:D?Array.from(O().subarray(Number(D)>>>0,Number(W)>>>0)):[],pads:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],strides:pe?Array.from(O().subarray(Number(pe)>>>0,Number(he)>>>0)):[]})},850390:(o,p,m,y,$)=>{i.kb("Gemm",o,{alpha:p,beta:m,transA:y,transB:$})},850494:o=>{i.kb("MatMul",o,void 0)},850548:(o,p,m,y)=>{i.kb("ArgMax",o,{keepDims:!!p,selectLastIndex:!!m,axis:y})},850656:(o,p,m,y)=>{i.kb("ArgMin",o,{keepDims:!!p,selectLastIndex:!!m,axis:y})},850764:(o,p)=>{i.kb("Softmax",o,{axis:p})},850827:(o,p)=>{i.kb("Concat",o,{axis:p})},850887:(o,p,m,y,$)=>{i.kb("Split",o,{axis:p,numOutputs:m,splitSizes:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},851043:o=>{i.kb("Expand",o,void 0)},851097:(o,p)=>{i.kb("Gather",o,{axis:Number(p)})},851168:(o,p)=>{i.kb("GatherElements",o,{axis:Number(p)})},851247:(o,p)=>{i.kb("GatherND",o,{batch_dims:Number(p)})},851326:(o,p,m,y,$,I,R,D,W,K,se)=>{i.kb("Resize",o,{antialias:p,axes:m?Array.from(O().subarray(Number(m)>>>0,Number(y)>>>0)):[],coordinateTransformMode:xe($),cubicCoeffA:I,excludeOutside:R,extrapolationValue:D,keepAspectRatioPolicy:xe(W),mode:xe(K),nearestMode:xe(se)})},851688:(o,p,m,y,$,I,R)=>{i.kb("Slice",o,{starts:p?Array.from(O().subarray(Number(p)>>>0,Number(m)>>>0)):[],ends:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[],axes:I?Array.from(O().subarray(Number(I)>>>0,Number(R)>>>0)):[]})},851952:o=>{i.kb("Tile",o,void 0)},852004:(o,p,m)=>{i.kb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},852118:(o,p,m)=>{i.kb("InstanceNormalization",o,{epsilon:p,format:m?"NHWC":"NCHW"})},852232:o=>{i.kb("Range",o,void 0)},852285:(o,p)=>{i.kb("Einsum",o,{equation:xe(p)})},852366:(o,p,m,y,$)=>{i.kb("Pad",o,{mode:p,value:m,pads:y?Array.from(O().subarray(Number(y)>>>0,Number($)>>>0)):[]})},852509:(o,p,m,y,$,I)=>{i.kb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!$,trainingMode:!!y,format:I?"NHWC":"NCHW"})},852678:(o,p,m,y,$,I)=>{i.kb("BatchNormalization",o,{epsilon:p,momentum:m,spatial:!!$,trainingMode:!!y,format:I?"NHWC":"NCHW"})},852847:(o,p,m)=>{i.kb("CumSum",o,{exclusive:Number(p),reverse:Number(m)})},852944:(o,p,m)=>{i.kb("DequantizeLinear",o,{axis:p,blockSize:m})},853034:(o,p,m,y,$)=>{i.kb("GridSample",o,{align_corners:p,mode:xe(m),padding_mode:xe(y),format:$?"NHWC":"NCHW"})},853204:(o,p,m,y,$)=>{i.kb("GridSample",o,{align_corners:p,mode:xe(m),padding_mode:xe(y),format:$?"NHWC":"NCHW"})},853374:(o,p)=>{i.kb("ScatterND",o,{reduction:xe(p)})},853459:(o,p,m,y,$,I,R,D,W)=>{i.kb("Attention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:y,scale:$,doRotary:I,qkvHiddenSizes:R?Array.from(O().subarray(Number(D)>>>0,Number(D)+R>>>0)):[],pastPresentShareBuffer:!!W})},853731:o=>{i.kb("BiasAdd",o,void 0)},853786:o=>{i.kb("BiasSplitGelu",o,void 0)},853847:o=>{i.kb("FastGelu",o,void 0)},853903:(o,p,m,y,$,I,R,D,W,K,se,pe,he,Te,Rt,wg)=>{i.kb("Conv",o,{format:pe?"NHWC":"NCHW",auto_pad:p,dilations:m?Array.from(O().subarray(Number(m)>>>0,Number(y)>>>0)):[],group:$,kernel_shape:I?Array.from(O().subarray(Number(I)>>>0,Number(R)>>>0)):[],pads:D?Array.from(O().subarray(Number(D)>>>0,Number(W)>>>0)):[],strides:K?Array.from(O().subarray(Number(K)>>>0,Number(se)>>>0)):[],w_is_const:()=>!!ue()[Number(he)>>>0],activation:xe(Te),activation_params:Rt?Array.from(ze().subarray(Number(Rt)>>>0,Number(wg)>>>0)):[]})},854487:o=>{i.kb("Gelu",o,void 0)},854539:(o,p,m,y,$,I,R,D,W)=>{i.kb("GroupQueryAttention",o,{numHeads:p,kvNumHeads:m,scale:y,softcap:$,doRotary:I,rotaryInterleaved:R,smoothSoftmax:D,localWindowSize:W})},854756:(o,p,m,y)=>{i.kb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!y})},854867:(o,p,m,y)=>{i.kb("LayerNormalization",o,{axis:p,epsilon:m,simplified:!!y})},854978:(o,p,m,y,$,I)=>{i.kb("MatMulNBits",o,{k:p,n:m,accuracyLevel:y,bits:$,blockSize:I})},855105:(o,p,m,y,$,I)=>{i.kb("MultiHeadAttention",o,{numHeads:p,isUnidirectional:m,maskFilterValue:y,scale:$,doRotary:I})},855264:(o,p)=>{i.kb("QuickGelu",o,{alpha:p})},855328:(o,p,m,y,$)=>{i.kb("RotaryEmbedding",o,{interleaved:!!p,numHeads:m,rotaryEmbeddingDim:y,scale:$})},855467:(o,p,m)=>{i.kb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},855569:(o,p,m)=>{i.kb("SkipLayerNormalization",o,{epsilon:p,simplified:!!m})},855671:(o,p,m,y)=>{i.kb("GatherBlockQuantized",o,{gatherAxis:p,quantizeAxis:m,blockSize:y})},855792:o=>{i.$b(o)},855826:(o,p)=>i.bc(Number(o),Number(p),i.Gb.ec,i.Gb.errors)};function tm(o,p,m){return Xc(async()=>{await i.Yb(Number(o),Number(p),Number(m))})}function rm(){return typeof wasmOffsetConverter<"u"}class Ma{name="ExitStatus";constructor(p){this.message=`Program terminated with exit(${p})`,this.status=p}}var yc=o=>{o.terminate(),o.onmessage=()=>{}},Na=[],bc=o=>{dt.length==0&&(Sc(),kc(dt[0]));var p=dt.pop();if(!p)return 6;rr.push(p),Tt[o.Bb]=p,p.Bb=o.Bb;var m={Cb:"run",hc:o.fc,Ib:o.Ib,Bb:o.Bb};return p.postMessage(m,o.Nb),0},lt=0,ye=(o,p,...m)=>{for(var y=2*m.length,$=en(),I=Ja(8*y),R=I>>>3,D=0;D<m.length;D++){var W=m[D];typeof W=="bigint"?(U[R+2*D]=1n,U[R+2*D+1]=W):(U[R+2*D]=0n,Ne()[R+2*D+1>>>0]=W)}return o=wf(o,0,y,I,p),qr($),o};function Da(o){if(u)return ye(0,1,o);if(z=o,!(0<lt)){for(var p of rr)yc(p);for(p of dt)yc(p);dt=[],rr=[],Tt={},oe=!0}_(0,new Ma(o))}function wc(o){if(u)return ye(1,0,o);Pa(o)}var Pa=o=>{if(z=o,u)throw wc(o),"unwind";Da(o)},dt=[],rr=[],$c=[],Tt={},vc=o=>{var p=o.Bb;delete Tt[p],dt.push(o),rr.splice(rr.indexOf(o),1),o.Bb=0,$f(p)};function xc(){$c.forEach(o=>o())}var kc=o=>new Promise(p=>{o.onmessage=$=>{var I=($=$.data).Cb;if($.Hb&&$.Hb!=Pr()){var R=Tt[$.Hb];R?R.postMessage($,$.Nb):S(`Internal error! Worker sent a message "${I}" to target pthread ${$.Hb}, but that thread no longer exists!`)}else I==="checkMailbox"?Cr():I==="spawnThread"?bc($):I==="cleanupThread"?vc(Tt[$.ic]):I==="loaded"?(o.loaded=!0,p(o)):I==="alert"?alert(`Thread ${$.jc}: ${$.text}`):$.target==="setimmediate"?o.postMessage($):I==="callHandler"?i[$.Rb](...$.args):I&&S(`worker sent an unknown command ${I}`)},o.onerror=$=>{throw S(`worker sent an error! ${$.filename}:${$.lineno}: ${$.message}`),$};var m,y=[];for(m of[])i.propertyIsEnumerable(m)&&y.push(m);o.postMessage({Cb:"load",Sb:y,lc:x,mc:T})});function Sc(){var o=new Worker((()=>{let p=URL;return self.location.href>"file:"&&self.location.href<"file;"?new p("ort.bundle.min.mjs",self.location.href):new URL(self.location.href)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});dt.push(o)}var im=o=>{$e();var p=ae()[o+52>>>2>>>0];o=ae()[o+56>>>2>>>0],kf(p,p-o),qr(p)},am=(o,p)=>{lt=0,o=Sf(o,p),0<lt?z=o:Ya(o)};class nm{constructor(p){this.Jb=p-24}}function sm(o,p,m){var y=new nm(o>>>=0);throw p>>>=0,m>>>=0,ae()[y.Jb+16>>>2>>>0]=0,ae()[y.Jb+4>>>2>>>0]=p,ae()[y.Jb+8>>>2>>>0]=m,o}function Tc(o,p,m,y){return u?ye(2,1,o,p,m,y):Ic(o,p,m,y)}function Ic(o,p,m,y){if(o>>>=0,m>>>=0,y>>>=0,l===void 0)return 6;var $=[];return u&&$.length===0?Tc(o,p>>>=0,m,y):(o={fc:m,Bb:o,Ib:y,Nb:$},u?(o.Cb="spawnThread",postMessage(o,$),0):bc(o))}var Ec=typeof TextDecoder<"u"?new TextDecoder:void 0,zc=(o,p=0,m=NaN)=>{var y=(p>>>=0)+m;for(m=p;o[m]&&!(m>=y);)++m;if(16<m-p&&o.buffer&&Ec)return Ec.decode(o.buffer instanceof ArrayBuffer?o.subarray(p,m):o.slice(p,m));for(y="";p<m;){var $=o[p++];if(128&$){var I=63&o[p++];if((224&$)==192)y+=String.fromCharCode((31&$)<<6|I);else{var R=63&o[p++];65536>($=(240&$)==224?(15&$)<<12|I<<6|R:(7&$)<<18|I<<12|R<<6|63&o[p++])?y+=String.fromCharCode($):($-=65536,y+=String.fromCharCode(55296|$>>10,56320|1023&$))}}else y+=String.fromCharCode($)}return y},xe=(o,p)=>(o>>>=0)?zc(M(),o,p):"";function Cc(o,p,m){return u?ye(3,1,o,p,m):0}function Oc(o,p){if(u)return ye(4,1,o,p)}var Ac=o=>{for(var p=0,m=0;m<o.length;++m){var y=o.charCodeAt(m);127>=y?p++:2047>=y?p+=2:55296<=y&&57343>=y?(p+=4,++m):p+=3}return p},Bt=(o,p,m)=>{var y=M();if(p>>>=0,0<m){var $=p;m=p+m-1;for(var I=0;I<o.length;++I){var R=o.charCodeAt(I);if(55296<=R&&57343>=R&&(R=65536+((1023&R)<<10)|1023&o.charCodeAt(++I)),127>=R){if(p>=m)break;y[p++>>>0]=R}else{if(2047>=R){if(p+1>=m)break;y[p++>>>0]=192|R>>6}else{if(65535>=R){if(p+2>=m)break;y[p++>>>0]=224|R>>12}else{if(p+3>=m)break;y[p++>>>0]=240|R>>18,y[p++>>>0]=128|R>>12&63}y[p++>>>0]=128|R>>6&63}y[p++>>>0]=128|63&R}}y[p>>>0]=0,o=p-$}else o=0;return o};function Bc(o,p){if(u)return ye(5,1,o,p)}function Rc(o,p,m){if(u)return ye(6,1,o,p,m)}function Mc(o,p,m){return u?ye(7,1,o,p,m):0}function Nc(o,p){if(u)return ye(8,1,o,p)}function Dc(o,p,m){if(u)return ye(9,1,o,p,m)}function Pc(o,p,m,y){if(u)return ye(10,1,o,p,m,y)}function Uc(o,p,m,y){if(u)return ye(11,1,o,p,m,y)}function qc(o,p,m,y){if(u)return ye(12,1,o,p,m,y)}function Wc(o){if(u)return ye(13,1,o)}function Lc(o,p){if(u)return ye(14,1,o,p)}function Vc(o,p,m){if(u)return ye(15,1,o,p,m)}var Gc,pt,om=()=>ut(""),Ze=o=>{for(var p="";M()[o>>>0];)p+=Gc[M()[o++>>>0]];return p},Ua={},qa={};function tt(o,p,m={}){return function(y,$,I={}){var R=$.name;if(!y)throw new pt(`type "${R}" must have a positive integer typeid pointer`);if(qa.hasOwnProperty(y)){if(I.Tb)return;throw new pt(`Cannot register type '${R}' twice`)}qa[y]=$,Ua.hasOwnProperty(y)&&($=Ua[y],delete Ua[y],$.forEach(D=>D()))}(o,p,m)}var Hc=(o,p,m)=>{switch(p){case 1:return m?y=>ue()[y>>>0]:y=>M()[y>>>0];case 2:return m?y=>q()[y>>>1>>>0]:y=>te()[y>>>1>>>0];case 4:return m?y=>O()[y>>>2>>>0]:y=>ae()[y>>>2>>>0];case 8:return m?y=>U[y>>>3]:y=>ie[y>>>3];default:throw new TypeError(`invalid integer width (${p}): ${o}`)}};function um(o,p,m){m>>>=0,tt(o>>>=0,{name:p=Ze(p>>>0),fromWireType:y=>y,toWireType:function(y,$){if(typeof $!="bigint"&&typeof $!="number")throw $=$===null?"null":(y=typeof $)=="object"||y==="array"||y==="function"?$.toString():""+$,new TypeError(`Cannot convert "${$}" to ${this.name}`);return typeof $=="number"&&($=BigInt($)),$},Db:ct,readValueFromPointer:Hc(p,m,p.indexOf("u")==-1),Eb:null})}var ct=8;function lm(o,p,m,y){tt(o>>>=0,{name:p=Ze(p>>>0),fromWireType:function($){return!!$},toWireType:function($,I){return I?m:y},Db:ct,readValueFromPointer:function($){return this.fromWireType(M()[$>>>0])},Eb:null})}var Wa=[],rt=[];function La(o){9<(o>>>=0)&&--rt[o+1]==0&&(rt[o]=void 0,Wa.push(o))}var Ce=o=>{if(!o)throw new pt("Cannot use deleted val. handle = "+o);return rt[o]},De=o=>{switch(o){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let p=Wa.pop()||rt.length;return rt[p]=o,rt[p+1]=1,p}};function Va(o){return this.fromWireType(ae()[o>>>2>>>0])}var dm={name:"emscripten::val",fromWireType:o=>{var p=Ce(o);return La(o),p},toWireType:(o,p)=>De(p),Db:ct,readValueFromPointer:Va,Eb:null};function pm(o){return tt(o>>>0,dm)}var cm=(o,p)=>{switch(p){case 4:return function(m){return this.fromWireType(ze()[m>>>2>>>0])};case 8:return function(m){return this.fromWireType(Ne()[m>>>3>>>0])};default:throw new TypeError(`invalid float width (${p}): ${o}`)}};function fm(o,p,m){m>>>=0,tt(o>>>=0,{name:p=Ze(p>>>0),fromWireType:y=>y,toWireType:(y,$)=>$,Db:ct,readValueFromPointer:cm(p,m),Eb:null})}function hm(o,p,m,y,$){if(o>>>=0,m>>>=0,p=Ze(p>>>0),$===-1&&($=4294967295),$=D=>D,y===0){var I=32-8*m;$=D=>D<<I>>>I}var R=p.includes("unsigned")?function(D,W){return W>>>0}:function(D,W){return W};tt(o,{name:p,fromWireType:$,toWireType:R,Db:ct,readValueFromPointer:Hc(p,m,y!==0),Eb:null})}function mm(o,p,m){function y(I){var R=ae()[I>>>2>>>0];return I=ae()[I+4>>>2>>>0],new $(ue().buffer,I,R)}var $=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][p];tt(o>>>=0,{name:m=Ze(m>>>0),fromWireType:y,Db:ct,readValueFromPointer:y},{Tb:!0})}function gm(o,p){tt(o>>>=0,{name:p=Ze(p>>>0),fromWireType:function(m){for(var y,$=ae()[m>>>2>>>0],I=m+4,R=I,D=0;D<=$;++D){var W=I+D;D!=$&&M()[W>>>0]!=0||(R=xe(R,W-R),y===void 0?y=R:(y+="\0",y+=R),R=W+1)}return Xe(m),y},toWireType:function(m,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var $=typeof y=="string";if(!($||y instanceof Uint8Array||y instanceof Uint8ClampedArray||y instanceof Int8Array))throw new pt("Cannot pass non-string to std::string");var I=$?Ac(y):y.length,R=Ur(4+I+1),D=R+4;if(ae()[R>>>2>>>0]=I,$)Bt(y,D,I+1);else if($)for($=0;$<I;++$){var W=y.charCodeAt($);if(255<W)throw Xe(R),new pt("String has UTF-16 code units that do not fit in 8 bits");M()[D+$>>>0]=W}else for($=0;$<I;++$)M()[D+$>>>0]=y[$];return m!==null&&m.push(Xe,R),R},Db:ct,readValueFromPointer:Va,Eb(m){Xe(m)}})}var Fc=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,_m=(o,p)=>{for(var m=o>>1,y=m+p/2;!(m>=y)&&te()[m>>>0];)++m;if(32<(m<<=1)-o&&Fc)return Fc.decode(M().slice(o,m));for(m="",y=0;!(y>=p/2);++y){var $=q()[o+2*y>>>1>>>0];if($==0)break;m+=String.fromCharCode($)}return m},ym=(o,p,m)=>{if(m??=2147483647,2>m)return 0;var y=p;m=(m-=2)<2*o.length?m/2:o.length;for(var $=0;$<m;++$){var I=o.charCodeAt($);q()[p>>>1>>>0]=I,p+=2}return q()[p>>>1>>>0]=0,p-y},bm=o=>2*o.length,wm=(o,p)=>{for(var m=0,y="";!(m>=p/4);){var $=O()[o+4*m>>>2>>>0];if($==0)break;++m,65536<=$?($-=65536,y+=String.fromCharCode(55296|$>>10,56320|1023&$)):y+=String.fromCharCode($)}return y},$m=(o,p,m)=>{if(p>>>=0,m??=2147483647,4>m)return 0;var y=p;m=y+m-4;for(var $=0;$<o.length;++$){var I=o.charCodeAt($);if(55296<=I&&57343>=I&&(I=65536+((1023&I)<<10)|1023&o.charCodeAt(++$)),O()[p>>>2>>>0]=I,(p+=4)+4>m)break}return O()[p>>>2>>>0]=0,p-y},vm=o=>{for(var p=0,m=0;m<o.length;++m){var y=o.charCodeAt(m);55296<=y&&57343>=y&&++m,p+=4}return p};function xm(o,p,m){if(o>>>=0,p>>>=0,m=Ze(m>>>=0),p===2)var y=_m,$=ym,I=bm,R=D=>te()[D>>>1>>>0];else p===4&&(y=wm,$=$m,I=vm,R=D=>ae()[D>>>2>>>0]);tt(o,{name:m,fromWireType:D=>{for(var W,K=ae()[D>>>2>>>0],se=D+4,pe=0;pe<=K;++pe){var he=D+4+pe*p;pe!=K&&R(he)!=0||(se=y(se,he-se),W===void 0?W=se:(W+="\0",W+=se),se=he+p)}return Xe(D),W},toWireType:(D,W)=>{if(typeof W!="string")throw new pt(`Cannot pass non-string to C++ string type ${m}`);var K=I(W),se=Ur(4+K+p);return ae()[se>>>2>>>0]=K/p,$(W,se+4,K+p),D!==null&&D.push(Xe,se),se},Db:ct,readValueFromPointer:Va,Eb(D){Xe(D)}})}function km(o,p){tt(o>>>=0,{Ub:!0,name:p=Ze(p>>>0),Db:0,fromWireType:()=>{},toWireType:()=>{}})}function Sm(o){Xa(o>>>0,!s,1,!n,131072,!1),xc()}var Ga=o=>{if(!oe)try{if(o(),!(0<lt))try{u?Ya(z):Pa(z)}catch(p){p instanceof Ma||p=="unwind"||_(0,p)}}catch(p){p instanceof Ma||p=="unwind"||_(0,p)}};function Ha(o){o>>>=0,typeof Atomics.kc=="function"&&(Atomics.kc(O(),o>>>2,o).value.then(Cr),o+=128,Atomics.store(O(),o>>>2,1))}var Cr=()=>{var o=Pr();o&&(Ha(o),Ga(xf))};function Tm(o,p){(o>>>=0)==p>>>0?setTimeout(Cr):u?postMessage({Hb:o,Cb:"checkMailbox"}):(o=Tt[o])&&o.postMessage({Cb:"checkMailbox"})}var Fa=[];function Im(o,p,m,y,$){for(p>>>=0,y/=2,Fa.length=y,m=$>>>0>>>3,$=0;$<y;$++)Fa[$]=U[m+2*$]?U[m+2*$+1]:Ne()[m+2*$+1>>>0];return(p?Ra[p]:bg[o])(...Fa)}var Em=()=>{lt=0};function zm(o){o>>>=0,u?postMessage({Cb:"cleanupThread",ic:o}):vc(Tt[o])}function Cm(o){}var Or=(o,p)=>{var m=qa[o];if(m===void 0)throw o=_f(o),m=Ze(o),Xe(o),new pt(`${p} has unknown type ${m}`);return m},jc=(o,p,m)=>{var y=[];return o=o.toWireType(y,m),y.length&&(ae()[p>>>2>>>0]=De(y)),o};function Om(o,p,m){return p>>>=0,m>>>=0,o=Ce(o>>>0),p=Or(p,"emval::as"),jc(p,m,o)}function Am(o,p){return p>>>=0,o=Ce(o>>>0),(p=Or(p,"emval::as")).toWireType(null,o)}var Ar=o=>{try{o()}catch(p){ut(p)}},ft=0,Qe=null,Kc=0,Br=[],Zc={},Qc={},Bm=0,ja=null,Rm=[];function Xc(o){return function(p){if(!oe){if(ft===0){var m=!1,y=!1;p(($=0)=>{if(!oe&&(Kc=$,m=!0,y)){ft=2,Ar(()=>Ef(Qe)),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.resume(),$=!1;try{var I=function(){var W=O()[Qe+8>>>2>>>0];return W=X[Qc[W]],--lt,W()}()}catch(W){I=W,$=!0}var R=!1;if(!Qe){var D=ja;D&&(ja=null,($?D.reject:D.resolve)(I),R=!0)}if($&&!R)throw I}}),y=!0,m||(ft=1,Qe=function(){var $=Ur(65548),I=$+12;ae()[$>>>2>>>0]=I,ae()[$+4>>>2>>>0]=I+65536,I=Br[0];var R=Zc[I];return R===void 0&&(R=Bm++,Zc[I]=R,Qc[R]=I),I=R,O()[$+8>>>2>>>0]=I,$}(),typeof MainLoop<"u"&&MainLoop.Qb&&MainLoop.pause(),Ar(()=>Tf(Qe)))}else ft===2?(ft=0,Ar(zf),Xe(Qe),Qe=null,Rm.forEach(Ga)):ut(`invalid state: ${ft}`);return Kc}}(p=>{o().then(p)})}function Mm(o){return o>>>=0,Xc(async()=>{var p=await Ce(o);return De(p)})}var Rr=[];function Nm(o,p,m,y){return m>>>=0,y>>>=0,(o=Rr[o>>>0])(null,p=Ce(p>>>0),m,y)}var Dm={},Mr=o=>{var p=Dm[o];return p===void 0?Ze(o):p};function Pm(o,p,m,y,$){return m>>>=0,y>>>=0,$>>>=0,(o=Rr[o>>>0])(p=Ce(p>>>0),p[m=Mr(m)],y,$)}function Um(o,p){return p>>>=0,(o=Ce(o>>>0))==Ce(p)}var Yc=()=>typeof globalThis=="object"?globalThis:Function("return this")();function qm(o){return(o>>>=0)==0?De(Yc()):(o=Mr(o),De(Yc()[o]))}var Wm=o=>{var p=Rr.length;return Rr.push(o),p},Lm=(o,p)=>{for(var m=Array(o),y=0;y<o;++y)m[y]=Or(ae()[p+4*y>>>2>>>0],"parameter "+y);return m},Jc=(o,p)=>Object.defineProperty(p,"name",{value:o});function Vm(o,p,m){var y=(p=Lm(o,p>>>0)).shift();o--;var $=`return function (obj, func, destructorsRef, args) {
`,I=0,R=[];m===0&&R.push("obj");for(var D=["retType"],W=[y],K=0;K<o;++K)R.push("arg"+K),D.push("argType"+K),W.push(p[K]),$+=`  var arg${K} = argType${K}.readValueFromPointer(args${I?"+"+I:""});
`,I+=p[K].Db;return $+=`  var rv = ${m===1?"new func":"func.call"}(${R.join(", ")});
`,y.Ub||(D.push("emval_returnValue"),W.push(jc),$+=`  return emval_returnValue(retType, destructorsRef, rv);
`),D.push($+`};
`),o=function(se){var pe=Function;if(!(pe instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof pe} which is not a function`);var he=Jc(pe.name||"unknownFunctionName",function(){});return he.prototype=pe.prototype,he=new he,(se=pe.apply(he,se))instanceof Object?se:he}(D)(...W),m=`methodCaller<(${p.map(se=>se.name).join(", ")}) => ${y.name}>`,Wm(Jc(m,o))}function Gm(o){return o=Mr(o>>>0),De(i[o])}function Hm(o,p){return p>>>=0,o=Ce(o>>>0),p=Ce(p),De(o[p])}function Fm(o){9<(o>>>=0)&&(rt[o+1]+=1)}function jm(){return De([])}function Km(o){o=Ce(o>>>0);for(var p=Array(o.length),m=0;m<o.length;m++)p[m]=o[m];return De(p)}function Zm(o){return De(Mr(o>>>0))}function Qm(){return De({})}function Xm(o){for(var p=Ce(o>>>=0);p.length;){var m=p.pop();p.pop()(m)}La(o)}function Ym(o,p,m){p>>>=0,m>>>=0,o=Ce(o>>>0),p=Ce(p),m=Ce(m),o[p]=m}function Jm(o,p){return p>>>=0,o=(o=Or(o>>>0,"_emval_take_value")).readValueFromPointer(p),De(o)}function eg(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),O()[p>>>2>>>0]=o.getUTCSeconds(),O()[p+4>>>2>>>0]=o.getUTCMinutes(),O()[p+8>>>2>>>0]=o.getUTCHours(),O()[p+12>>>2>>>0]=o.getUTCDate(),O()[p+16>>>2>>>0]=o.getUTCMonth(),O()[p+20>>>2>>>0]=o.getUTCFullYear()-1900,O()[p+24>>>2>>>0]=o.getUTCDay(),o=(o.getTime()-Date.UTC(o.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,O()[p+28>>>2>>>0]=o}var ef=o=>o%4==0&&(o%100!=0||o%400==0),tf=[0,31,60,91,121,152,182,213,244,274,305,335],rf=[0,31,59,90,120,151,181,212,243,273,304,334];function tg(o,p){o=-9007199254740992>o||9007199254740992<o?NaN:Number(o),p>>>=0,o=new Date(1e3*o),O()[p>>>2>>>0]=o.getSeconds(),O()[p+4>>>2>>>0]=o.getMinutes(),O()[p+8>>>2>>>0]=o.getHours(),O()[p+12>>>2>>>0]=o.getDate(),O()[p+16>>>2>>>0]=o.getMonth(),O()[p+20>>>2>>>0]=o.getFullYear()-1900,O()[p+24>>>2>>>0]=o.getDay();var m=(ef(o.getFullYear())?tf:rf)[o.getMonth()]+o.getDate()-1|0;O()[p+28>>>2>>>0]=m,O()[p+36>>>2>>>0]=-60*o.getTimezoneOffset(),m=new Date(o.getFullYear(),6,1).getTimezoneOffset();var y=new Date(o.getFullYear(),0,1).getTimezoneOffset();o=0|(m!=y&&o.getTimezoneOffset()==Math.min(y,m)),O()[p+32>>>2>>>0]=o}function rg(o){o>>>=0;var p=new Date(O()[o+20>>>2>>>0]+1900,O()[o+16>>>2>>>0],O()[o+12>>>2>>>0],O()[o+8>>>2>>>0],O()[o+4>>>2>>>0],O()[o>>>2>>>0],0),m=O()[o+32>>>2>>>0],y=p.getTimezoneOffset(),$=new Date(p.getFullYear(),6,1).getTimezoneOffset(),I=new Date(p.getFullYear(),0,1).getTimezoneOffset(),R=Math.min(I,$);return 0>m?O()[o+32>>>2>>>0]=+($!=I&&R==y):0<m!=(R==y)&&($=Math.max(I,$),p.setTime(p.getTime()+6e4*((0<m?R:$)-y))),O()[o+24>>>2>>>0]=p.getDay(),m=(ef(p.getFullYear())?tf:rf)[p.getMonth()]+p.getDate()-1|0,O()[o+28>>>2>>>0]=m,O()[o>>>2>>>0]=p.getSeconds(),O()[o+4>>>2>>>0]=p.getMinutes(),O()[o+8>>>2>>>0]=p.getHours(),O()[o+12>>>2>>>0]=p.getDate(),O()[o+16>>>2>>>0]=p.getMonth(),O()[o+20>>>2>>>0]=p.getYear(),o=p.getTime(),BigInt(isNaN(o)?-1:o/1e3)}function af(o,p,m,y,$,I,R){return u?ye(16,1,o,p,m,y,$,I,R):-52}function nf(o,p,m,y,$,I){if(u)return ye(17,1,o,p,m,y,$,I)}var ir={},ig=()=>performance.timeOrigin+performance.now();function sf(o,p){if(u)return ye(18,1,o,p);if(ir[o]&&(clearTimeout(ir[o].id),delete ir[o]),!p)return 0;var m=setTimeout(()=>{delete ir[o],Ga(()=>vf(o,performance.timeOrigin+performance.now()))},p);return ir[o]={id:m,rc:p},0}function ag(o,p,m,y){o>>>=0,p>>>=0,m>>>=0,y>>>=0;var $=new Date().getFullYear(),I=new Date($,0,1).getTimezoneOffset();$=new Date($,6,1).getTimezoneOffset();var R=Math.max(I,$);ae()[o>>>2>>>0]=60*R,O()[p>>>2>>>0]=+(I!=$),o=(p=D=>{var W=Math.abs(D);return`UTC${0<=D?"-":"+"}${String(Math.floor(W/60)).padStart(2,"0")}${String(W%60).padStart(2,"0")}`})(I),p=p($),$<I?(Bt(o,m,17),Bt(p,y,17)):(Bt(o,y,17),Bt(p,m,17))}var ng=()=>Date.now();function sg(o,p,m){return 0<=o&&3>=o?(o===0?o=Date.now():o=performance.timeOrigin+performance.now(),U[m>>>0>>>3]=BigInt(Math.round(1e6*o)),0):28}var Ka=[],of=(o,p)=>{Ka.length=0;for(var m;m=M()[o++>>>0];){var y=m!=105;p+=(y&=m!=112)&&p%8?4:0,Ka.push(m==112?ae()[p>>>2>>>0]:m==106?U[p>>>3]:m==105?O()[p>>>2>>>0]:Ne()[p>>>3>>>0]),p+=y?8:4}return Ka};function og(o,p,m){return o>>>=0,p=of(p>>>0,m>>>0),Ra[o](...p)}function ug(o,p,m){return o>>>=0,p=of(p>>>0,m>>>0),Ra[o](...p)}var lg=()=>{};function dg(o,p){return S(xe(o>>>0,p>>>0))}var pg=()=>{throw lt+=1,"unwind"};function cg(){return 4294901760}var fg=()=>navigator.hardwareConcurrency;function hg(){return ut("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function mg(o){o>>>=0;var p=M().length;if(o<=p||4294901760<o)return!1;for(var m=1;4>=m;m*=2){var y=p*(1+.2/m);y=Math.min(y,o+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(o,y)/65536))-x.buffer.byteLength+65535)/65536|0;try{x.grow(y),$e();var $=1;break e}catch{}$=void 0}if($)return!0}return!1}var Nr=()=>(ut("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),ar={},uf=o=>{o.forEach(p=>{Nr()})};function gg(){var o=Error().stack.toString().split(`
`);return o[0]=="Error"&&o.shift(),uf(o),ar.Mb=Nr(),ar.dc=o,ar.Mb}function _g(o,p,m){if(o>>>=0,p>>>=0,ar.Mb==o)var y=ar.dc;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),uf(y);for(var $=3;y[$]&&Nr()!=o;)++$;for(o=0;o<m&&y[o+$];++o)O()[p+4*o>>>2>>>0]=Nr();return o}var Za,Qa={},lf=()=>{if(!Za){var o,p={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(o in Qa)Qa[o]===void 0?delete p[o]:p[o]=Qa[o];var m=[];for(o in p)m.push(`${o}=${p[o]}`);Za=m}return Za};function df(o,p){if(u)return ye(19,1,o,p);o>>>=0,p>>>=0;var m=0;return lf().forEach((y,$)=>{var I=p+m;for($=ae()[o+4*$>>>2>>>0]=I,I=0;I<y.length;++I)ue()[$++>>>0]=y.charCodeAt(I);ue()[$>>>0]=0,m+=y.length+1}),0}function pf(o,p){if(u)return ye(20,1,o,p);o>>>=0,p>>>=0;var m=lf();ae()[o>>>2>>>0]=m.length;var y=0;return m.forEach($=>y+=$.length+1),ae()[p>>>2>>>0]=y,0}function cf(o){return u?ye(21,1,o):52}function ff(o,p,m,y){return u?ye(22,1,o,p,m,y):52}function hf(o,p,m,y){return u?ye(23,1,o,p,m,y):70}var yg=[null,[],[]];function mf(o,p,m,y){if(u)return ye(24,1,o,p,m,y);p>>>=0,m>>>=0,y>>>=0;for(var $=0,I=0;I<m;I++){var R=ae()[p>>>2>>>0],D=ae()[p+4>>>2>>>0];p+=8;for(var W=0;W<D;W++){var K=M()[R+W>>>0],se=yg[o];K===0||K===10?((o===1?w:S)(zc(se)),se.length=0):se.push(K)}$+=D}return ae()[y>>>2>>>0]=$,0}u||function(){for(var o=i.numThreads-1;o--;)Sc();Na.unshift(()=>{er++,function(p){u?p():Promise.all(dt.map(kc)).then(p)}(()=>gc())})}();for(var gf=Array(256),Dr=0;256>Dr;++Dr)gf[Dr]=String.fromCharCode(Dr);Gc=gf,pt=i.BindingError=class extends Error{constructor(o){super(o),this.name="BindingError"}},i.InternalError=class extends Error{constructor(o){super(o),this.name="InternalError"}},rt.push(0,1,void 0,1,null,1,!0,1,!1,1),i.count_emval_handles=()=>rt.length/2-5-Wa.length;var X,bg=[Da,wc,Tc,Cc,Oc,Bc,Rc,Mc,Nc,Dc,Pc,Uc,qc,Wc,Lc,Vc,af,nf,sf,df,pf,cf,ff,hf,mf];(async function(){function o(y,$){return X=y.exports,X=function(){var I=X,R={};for(let[D,W]of Object.entries(I))R[D]=typeof W=="function"?(...K)=>{Br.push(D);try{return W(...K)}finally{oe||(Br.pop(),Qe&&ft===1&&Br.length===0&&(ft=0,lt+=1,Ar(If),typeof Fibers<"u"&&Fibers.sc()))}}:W;return R}(),X=function(){var I=X,R=W=>K=>W(K)>>>0,D=W=>()=>W()>>>0;return(I=Object.assign({},I)).Ea=R(I.Ea),I.gb=D(I.gb),I.ib=R(I.ib),I.ub=R(I.ub),I.vb=D(I.vb),I.__cxa_get_exception_ptr=R(I.__cxa_get_exception_ptr),I}(),$c.push(X.jb),T=$,gc(),X}er++;var p=_c();if(i.instantiateWasm)return new Promise(y=>{i.instantiateWasm(p,($,I)=>{o($,I),y($.exports)})});if(u)return new Promise(y=>{ve=$=>{var I=new WebAssembly.Instance($,_c());y(o(I,$))}});Jt??=i.locateFile?i.locateFile?i.locateFile("ort-wasm-simd-threaded.jsep.wasm",b):b+"ort-wasm-simd-threaded.jsep.wasm":new URL("/client-ocr/assets/ort-wasm-simd-threaded.jsep-CLPRrI3A.wasm",self.location.href).href;try{var m=await async function(y){var $=Jt;if(!V&&typeof WebAssembly.instantiateStreaming=="function"&&!j($))try{var I=fetch($,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(I,y)}catch(R){S(`wasm streaming compile failed: ${R}`),S("falling back to ArrayBuffer instantiation")}return async function(R,D){try{var W=await async function(K){if(!V)try{var se=await f(K);return new Uint8Array(se)}catch{}if(K==Jt&&V)K=new Uint8Array(V);else{if(!h)throw"both async and sync fetching of the wasm failed";K=h(K)}return K}(R);return await WebAssembly.instantiate(W,D)}catch(K){S(`failed to asynchronously prepare wasm: ${K}`),ut(K)}}($,y)}(p);return o(m.instance,m.module)}catch(y){return r(y),Promise.reject(y)}})();var _f=o=>(_f=X.Ea)(o),yf=()=>(yf=X.Fa)();i._OrtInit=(o,p)=>(i._OrtInit=X.Ga)(o,p),i._OrtGetLastError=(o,p)=>(i._OrtGetLastError=X.Ha)(o,p),i._OrtCreateSessionOptions=(o,p,m,y,$,I,R,D,W,K)=>(i._OrtCreateSessionOptions=X.Ia)(o,p,m,y,$,I,R,D,W,K),i._OrtAppendExecutionProvider=(o,p,m,y,$)=>(i._OrtAppendExecutionProvider=X.Ja)(o,p,m,y,$),i._OrtAddFreeDimensionOverride=(o,p,m)=>(i._OrtAddFreeDimensionOverride=X.Ka)(o,p,m),i._OrtAddSessionConfigEntry=(o,p,m)=>(i._OrtAddSessionConfigEntry=X.La)(o,p,m),i._OrtReleaseSessionOptions=o=>(i._OrtReleaseSessionOptions=X.Ma)(o),i._OrtCreateSession=(o,p,m)=>(i._OrtCreateSession=X.Na)(o,p,m),i._OrtReleaseSession=o=>(i._OrtReleaseSession=X.Oa)(o),i._OrtGetInputOutputCount=(o,p,m)=>(i._OrtGetInputOutputCount=X.Pa)(o,p,m),i._OrtGetInputOutputMetadata=(o,p,m,y)=>(i._OrtGetInputOutputMetadata=X.Qa)(o,p,m,y),i._OrtFree=o=>(i._OrtFree=X.Ra)(o),i._OrtCreateTensor=(o,p,m,y,$,I)=>(i._OrtCreateTensor=X.Sa)(o,p,m,y,$,I),i._OrtGetTensorData=(o,p,m,y,$)=>(i._OrtGetTensorData=X.Ta)(o,p,m,y,$),i._OrtReleaseTensor=o=>(i._OrtReleaseTensor=X.Ua)(o),i._OrtCreateRunOptions=(o,p,m,y)=>(i._OrtCreateRunOptions=X.Va)(o,p,m,y),i._OrtAddRunConfigEntry=(o,p,m)=>(i._OrtAddRunConfigEntry=X.Wa)(o,p,m),i._OrtReleaseRunOptions=o=>(i._OrtReleaseRunOptions=X.Xa)(o),i._OrtCreateBinding=o=>(i._OrtCreateBinding=X.Ya)(o),i._OrtBindInput=(o,p,m)=>(i._OrtBindInput=X.Za)(o,p,m),i._OrtBindOutput=(o,p,m,y)=>(i._OrtBindOutput=X._a)(o,p,m,y),i._OrtClearBoundOutputs=o=>(i._OrtClearBoundOutputs=X.$a)(o),i._OrtReleaseBinding=o=>(i._OrtReleaseBinding=X.ab)(o),i._OrtRunWithBinding=(o,p,m,y,$)=>(i._OrtRunWithBinding=X.bb)(o,p,m,y,$),i._OrtRun=(o,p,m,y,$,I,R,D)=>(i._OrtRun=X.cb)(o,p,m,y,$,I,R,D),i._OrtEndProfiling=o=>(i._OrtEndProfiling=X.db)(o),i._JsepOutput=(o,p,m)=>(i._JsepOutput=X.eb)(o,p,m),i._JsepGetNodeName=o=>(i._JsepGetNodeName=X.fb)(o);var Pr=()=>(Pr=X.gb)(),Xe=i._free=o=>(Xe=i._free=X.hb)(o),Ur=i._malloc=o=>(Ur=i._malloc=X.ib)(o),Xa=(o,p,m,y,$,I)=>(Xa=X.lb)(o,p,m,y,$,I),bf=()=>(bf=X.mb)(),wf=(o,p,m,y,$)=>(wf=X.nb)(o,p,m,y,$),$f=o=>($f=X.ob)(o),Ya=o=>(Ya=X.pb)(o),vf=(o,p)=>(vf=X.qb)(o,p),xf=()=>(xf=X.rb)(),kf=(o,p)=>(kf=X.sb)(o,p),qr=o=>(qr=X.tb)(o),Ja=o=>(Ja=X.ub)(o),en=()=>(en=X.vb)(),Sf=i.dynCall_ii=(o,p)=>(Sf=i.dynCall_ii=X.wb)(o,p),Tf=o=>(Tf=X.xb)(o),If=()=>(If=X.yb)(),Ef=o=>(Ef=X.zb)(o),zf=()=>(zf=X.Ab)();return i.stackSave=()=>en(),i.stackRestore=o=>qr(o),i.stackAlloc=o=>Ja(o),i.setValue=function(o,p,m="i8"){switch(m.endsWith("*")&&(m="*"),m){case"i1":case"i8":ue()[o>>>0]=p;break;case"i16":q()[o>>>1>>>0]=p;break;case"i32":O()[o>>>2>>>0]=p;break;case"i64":U[o>>>3]=BigInt(p);break;case"float":ze()[o>>>2>>>0]=p;break;case"double":Ne()[o>>>3>>>0]=p;break;case"*":ae()[o>>>2>>>0]=p;break;default:ut(`invalid type for setValue: ${m}`)}},i.getValue=function(o,p="i8"){switch(p.endsWith("*")&&(p="*"),p){case"i1":case"i8":return ue()[o>>>0];case"i16":return q()[o>>>1>>>0];case"i32":return O()[o>>>2>>>0];case"i64":return U[o>>>3];case"float":return ze()[o>>>2>>>0];case"double":return Ne()[o>>>3>>>0];case"*":return ae()[o>>>2>>>0];default:ut(`invalid type for getValue: ${p}`)}},i.UTF8ToString=xe,i.stringToUTF8=Bt,i.lengthBytesUTF8=Ac,function o(){if(0<er)tr=o;else if(u)t(i),zr();else{for(;0<Na.length;)Na.shift()(i);0<er?tr=o:(i.calledRun=!0,oe||(zr(),t(i)))}}(),i.PTR_SIZE=4,a}),xn=Yr,kn=globalThis.self?.name?.startsWith("em-pthread"),kn&&Yr()}),Jr,ei,Sn,Ae,Tn,ur,In,En,ti,zn,ri,Cn,ii,On,ai=P(()=>{Kr(),Jr=typeof location>"u"?void 0:location.origin,ei=self.location.href>"file:"&&self.location.href<"file;",Sn=()=>{{if(ei){let e=URL;return new URL(new e("ort.bundle.min.mjs",self.location.href).href,Jr).href}return self.location.href}},Ae=Sn(),Tn=()=>{if(Ae&&!Ae.startsWith("blob:"))return Ae.substring(0,Ae.lastIndexOf("/")+1)},ur=(e,t)=>{try{let r=t??Ae;return(r?new URL(e,r):new URL(e)).origin===Jr}catch{return!1}},In=(e,t)=>{let r=t??Ae;try{return(r?new URL(e,r):new URL(e)).href}catch{return}},En=(e,t)=>`${t??"./"}${e}`,ti=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},zn=async e=>(await import(e)).default,ri=(Xf(),Mt(wn)).default,Cn=async()=>{if(!Ae)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(ur(Ae))return[void 0,ri()];let e=await ti(Ae);return[e,ri(e)]},ii=(Yf(),Mt(vn)).default,On=async(e,t,r)=>{if(!e&&!t&&ii&&Ae&&ur(Ae))return[void 0,ii];{let i="ort-wasm-simd-threaded.jsep.mjs",a=e??In(i,t),n=r&&a&&!ur(a,t),s=n?await ti(a):a??En(i,t);return[n?s:void 0,await zn(s)]}}}),ni,lr,Pt,si,An,Bn,Rn,oi,me,mt=P(()=>{ai(),lr=!1,Pt=!1,si=!1,An=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Bn=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Rn=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},oi=async e=>{if(lr)return Promise.resolve();if(Pt)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(si)throw new Error("previous call to 'initializeWebAssembly()' failed.");Pt=!0;let t=e.initTimeout,r=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Rn())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Bn())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let i=An();r>1&&!i&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+r+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=r=1);let a=e.wasmPaths,n=typeof a=="string"?a:void 0,s=a?.mjs,u=s?.href??s,l=a?.wasm,d=l?.href??l,c=e.wasmBinary,[f,h]=await On(u,n,r>1),g=!1,_=[];if(t>0&&_.push(new Promise(b=>{setTimeout(()=>{g=!0,b()},t)})),_.push(new Promise((b,k)=>{let v={numThreads:r};if(c)v.wasmBinary=c;else if(d||n)v.locateFile=w=>d??n+w;else if(u&&u.indexOf("blob:")!==0)v.locateFile=w=>new URL(w,u).href;else if(f){let w=Tn();w&&(v.locateFile=S=>w+S)}h(v).then(w=>{Pt=!1,lr=!0,ni=w,b(),f&&URL.revokeObjectURL(f)},w=>{Pt=!1,si=!0,k(w)})})),await Promise.race(_),g)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},me=()=>{if(lr&&ni)return ni;throw new Error("WebAssembly is not initialized yet.")}}),We,dr,fe,ui=P(()=>{mt(),We=(e,t)=>{let r=me(),i=r.lengthBytesUTF8(e)+1,a=r._malloc(i);return r.stringToUTF8(e,a,i),t.push(a),a},dr=(e,t,r,i)=>{if(typeof e=="object"&&e!==null){if(r.has(e))throw new Error("Circular reference in options");r.add(e)}Object.entries(e).forEach(([a,n])=>{let s=t?t+a:a;if(typeof n=="object")dr(n,s+".",r,i);else if(typeof n=="string"||typeof n=="number")i(s,n.toString());else if(typeof n=="boolean")i(s,n?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof n}`)})},fe=e=>{let t=me(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetLastError(a,a+i);let n=Number(t.getValue(a,i===4?"i32":"i64")),s=t.getValue(a+i,"*"),u=s?t.UTF8ToString(s):"";throw new Error(`${e} ERROR_CODE: ${n}, ERROR_MESSAGE: ${u}`)}finally{t.stackRestore(r)}}}),Mn,Jf=P(()=>{mt(),ui(),Mn=e=>{let t=me(),r=0,i=[],a=e||{};try{if(e?.logSeverityLevel===void 0)a.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${e.logSeverityLevel}`);if(e?.logVerbosityLevel===void 0)a.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);e?.terminate===void 0&&(a.terminate=!1);let n=0;return e?.tag!==void 0&&(n=We(e.tag,i)),r=t._OrtCreateRunOptions(a.logSeverityLevel,a.logVerbosityLevel,!!a.terminate,n),r===0&&fe("Can't create run options."),e?.extra!==void 0&&dr(e.extra,"",new WeakSet,(s,u)=>{let l=We(s,i),d=We(u,i);t._OrtAddRunConfigEntry(r,l,d)!==0&&fe(`Can't set a run config entry: ${s} - ${u}.`)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseRunOptions(r),i.forEach(s=>t._free(s)),n}}}),Nn,Dn,Pn,Ut,Un,qn,eh=P(()=>{mt(),ui(),Nn=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Dn=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},Pn=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(r=>(typeof r=="string"?r:r.name)==="webgpu")&&(e.enableMemPattern=!1)},Ut=(e,t,r,i)=>{let a=We(t,i),n=We(r,i);me()._OrtAddSessionConfigEntry(e,a,n)!==0&&fe(`Can't set a session config entry: ${t} - ${r}.`)},Un=async(e,t,r)=>{for(let i of t){let a=typeof i=="string"?i:i.name,n=[];switch(a){case"webnn":if(a="WEBNN",typeof i!="string"){let c=i?.deviceType;c&&Ut(e,"deviceType",c,r)}break;case"webgpu":if(a="JS",typeof i!="string"){let c=i;if(c?.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);Ut(e,"preferredLayout",c.preferredLayout,r)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${a}`)}let s=We(a,r),u=n.length,l=0,d=0;if(u>0){l=me()._malloc(u*me().PTR_SIZE),r.push(l),d=me()._malloc(u*me().PTR_SIZE),r.push(d);for(let c=0;c<u;c++)me().setValue(l+c*me().PTR_SIZE,n[c][0],"*"),me().setValue(d+c*me().PTR_SIZE,n[c][1],"*")}await me()._OrtAppendExecutionProvider(e,s,l,d,u)!==0&&fe(`Can't append execution provider: ${a}.`)}},qn=async e=>{let t=me(),r=0,i=[],a=e||{};Pn(a);try{let n=Nn(a.graphOptimizationLevel??"all"),s=Dn(a.executionMode??"sequential"),u=typeof a.logId=="string"?We(a.logId,i):0,l=a.logSeverityLevel??2;if(!Number.isInteger(l)||l<0||l>4)throw new Error(`log serverity level is not valid: ${l}`);let d=a.logVerbosityLevel??0;if(!Number.isInteger(d)||d<0||d>4)throw new Error(`log verbosity level is not valid: ${d}`);let c=typeof a.optimizedModelFilePath=="string"?We(a.optimizedModelFilePath,i):0;if(r=t._OrtCreateSessionOptions(n,!!a.enableCpuMemArena,!!a.enableMemPattern,s,!!a.enableProfiling,0,u,l,d,c),r===0&&fe("Can't create session options."),a.executionProviders&&await Un(r,a.executionProviders,i),a.enableGraphCapture!==void 0){if(typeof a.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${a.enableGraphCapture}`);Ut(r,"enableGraphCapture",a.enableGraphCapture.toString(),i)}if(a.freeDimensionOverrides)for(let[f,h]of Object.entries(a.freeDimensionOverrides)){if(typeof f!="string")throw new Error(`free dimension override name must be a string: ${f}`);if(typeof h!="number"||!Number.isInteger(h)||h<0)throw new Error(`free dimension override value must be a non-negative integer: ${h}`);let g=We(f,i);t._OrtAddFreeDimensionOverride(r,g,h)!==0&&fe(`Can't set a free dimension override: ${f} - ${h}.`)}return a.extra!==void 0&&dr(a.extra,"",new WeakSet,(f,h)=>{Ut(r,f,h,i)}),[r,i]}catch(n){throw r!==0&&t._OrtReleaseSessionOptions(r)!==0&&fe("Can't release session options."),i.forEach(s=>t._free(s)),n}}}),gt,Ye,_t,pr,cr,li,di,pi,J=P(()=>{gt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Ye=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},_t=(e,t)=>{let r=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],i=typeof t=="number"?t:t.reduce((a,n)=>a*n,1);return r>0?Math.ceil(i*r):void 0},pr=e=>{switch(e){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},cr=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},li=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",di=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",pi=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),ci,Wn=P(()=>{Kr(),ci=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let r=t.headers.get("Content-Length"),i=r?parseInt(r,10):0;if(i<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let a=t.body.getReader(),n;try{n=new ArrayBuffer(i)}catch(u){if(u instanceof RangeError){let l=Math.ceil(i/65536);n=new WebAssembly.Memory({initial:l,maximum:l}).buffer}else throw u}let s=0;for(;;){let{done:u,value:l}=await a.read();if(u)break;let d=l.byteLength;new Uint8Array(n,s,d).set(l),s+=d}return new Uint8Array(n,0,i)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ln,Vn,Gn,Hn,fi,Fn,le,Je=P(()=>{J(),Ln=["V","I","W","E","F"],Vn=(e,t)=>{console.log(`[${Ln[e]},${new Date().toISOString()}]${t}`)},fi=(e,t)=>{Gn=e,Hn=t},Fn=(e,t)=>{let r=cr(e),i=cr(Gn);r>=i&&Vn(r,typeof t=="function"?t():t)},le=(...e)=>{Hn&&Fn(...e)}}),jn,zt,C,fr,Kn,Zn,Qn,re=P(()=>{jn=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},zt=class{static calcShape(e,t,r=!1){let i=e.length,a=t.length;if(i===0)return t;if(a===0)return e;let n=Math.max(e.length,t.length),s=new Array(n);if(r){if(i<2||a<2)return;let u=jn.calcMatMulShape([e[i-2],e[i-1]],[t[a-2],t[a-1]]);if(u===void 0)return;[s[n-2],s[n-1]]=u}for(let u=r?3:1;u<=n;u++){let l=i-u<0?1:e[i-u],d=a-u<0?1:t[a-u];if(l!==d&&l>1&&d>1)return;let c=Math.max(l,d);if(l&&d)s[n-u]=Math.max(l,d);else{if(c>1)return;s[n-u]=0}}return s}static isValidBroadcast(e,t){let r=e.length,i=t.length;if(r>i)return!1;for(let a=1;a<=r;a++)if(e[r-a]!==1&&e[r-a]!==t[i-a])return!1;return!0}},C=class Wr{static size(t){return Wr.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,r=4){let i=t.length;if(i===0)return[];let a=new Array(i),n=i-1;for(;n>=0;){if(t[n]%r===0){a[n]=t[n]/r;break}if(r%t[n]!==0)throw new Error("cannot convert shape");a[n]=1,r/=t[n],n--}for(n--;n>=0;n--)a[n]=t[n];return a}static sizeFromDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Wr.getSizeFromDimensionRange(t,r,t.length)}static sizeToDimension(t,r){if(r<0||r>t.length)throw new Error(`invalid dimension of ${r} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Wr.getSizeFromDimensionRange(t,0,r)}static getSizeFromDimensionRange(t,r,i){let a=1;for(let n=r;n<i;n++){if(t[n]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");a*=Number(t[n])}return a}static computeStrides(t){let r=t.length;if(r===0)return[];if(r===1)return[1];let i=new Array(r);i[r-1]=1,i[r-2]=t[r-1];for(let a=r-3;a>=0;--a)i[a]=i[a+1]*t[a+1];return i}static normalizeAxis(t,r){if(t<-r&&t>=r)throw new Error("unsupported axis for this operation.");return t<0?t+r:t}static normalizeAxes(t,r){return t.map(i=>this.normalizeAxis(i,r??t.length))}static sortBasedOnPerm(t,r){return r?r.map(i=>t[i]):t.slice().reverse()}static padShape(t,r){let i=t.length;return t.map((a,n)=>a+r[n]+r[n+i])}static areEqual(t,r){return t.length!==r.length?!1:t.every((i,a)=>i===r[a])}},fr=class nr{static adjustPoolAttributes(t,r,i,a,n,s){if(!t&&i.length!==r.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let u=0;u<r.length-2;u++)u>=i.length?i.push(r[u+2]):i[u]=r[u+2];for(let u=0;u<i.length;u++)if(u<a.length){if(a[u]<0)throw new Error("strides should be greater than or equal to 1")}else a.push(1);for(let u=0;u<i.length;u++)if(u<n.length){if(n[u]<0)throw new Error("dilations should be greater than or equal to 1")}else n.push(1);for(let u=0;u<i.length*2;u++)if(u<s.length){if(s[u]<0)throw new Error("pad should be greater than or equal to 1")}else s.push(0);for(let u=0;u<i.length;u++){if(i[u]<=0)throw new Error("kernel shapes need to be greater than 0");if(s[u]>=i[u]||s[u+i.length]>=i[u])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,r,i,a,n,s,u){if(u){if(n.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(r.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(a.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let l=0;l<t.length-2;l++)nr.adjustPadAndReturnShape(t[l+(s?1:2)],r[l],i[l],a[l],n,l,l+t.length-2,u)}}static computePoolOutputShape(t,r,i,a,n,s,u){if(r.length<=0)throw new Error("input shape must be of size greater than 0");let l=[r[0],r[1]];return nr.computeShapeHelper(t,r,l,i,a,n,s,u),l}static computeConvOutputShape(t,r,i,a,n,s,u){if(t.length<=0||r.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let l=[t[0],r[0]];return nr.computeShapeHelper(!1,t,l,i,a,n,s,u),l}static computeShapeHelper(t,r,i,a,n,s,u,l){if(t)for(let d=0;d<r.length-2;d++)i.push(1);else for(let d=0;d<r.length-2;d++)i.push(nr.adjustPadAndReturnShape(r[d+2],a[d],n[d],s[d],u,d,d+r.length-2,l))}static adjustPadAndReturnShape(t,r,i,a,n,s,u,l){let d=i*(a-1)+1;if(l&&l!=="NOTSET")switch(l){case"VALID":return n[s]=0,n[u]=0,Math.floor((t-d)/r+1);case"SAME_LOWER":case"SAME_UPPER":if(i!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let c=((t+r-1)/r-1)*r+a-t;return n[s]=Math.floor(l==="SAME_LOWER"?(c+1)/2:c/2),n[u]=c-n[s],Math.floor((t+c-a)/r+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((t+n[s]+n[u]-d)/r+1)}},Kn=class{static getShapeOfGemmResult(e,t,r,i,a){if(e.length!==2||r.length!==2)throw new Error("shape need to be of size 2");let n,s,u;t?(n=e[1],s=e[0]):(n=e[0],s=e[1]);let l=-1;if(i?(u=r[0],l=1):(u=r[1],l=0),r[l]!==s)throw new Error("dimension mismatch");if(n<=0||u<=0||s<=0)throw new Error("invalid shape specified");if(a&&!zt.isValidBroadcast(a,[n,u]))throw new Error("gemm: invalid bias shape for broadcast");return[n,u,s]}},Zn=-34028234663852886e22,Qn=34028234663852886e22}),hi,Xn=P(()=>{J(),hi=(e,t)=>new(pr(t))(e)}),mi,gi,_i,Yn,yi,Jn,bi,wi,$i,es,ts,th=P(()=>{J(),Je(),mi=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),gi=(e,t)=>{if(t==="int32")return e;let r=mi.get(t);if(!r)throw new Error(`WebNN backend does not support data type: ${t}`);let i=r/8;if(e.byteLength%i!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${i}.`);let a=e.byteLength/i,n=new(pr(t))(e.buffer,e.byteOffset,a);switch(t){case"int64":case"uint64":{let s=new Int32Array(a);for(let u=0;u<a;u++){let l=n[u];if(l>2147483647n||l<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");s[u]=Number(l)}return new Uint8Array(s.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&n.some(u=>u>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let s=Int32Array.from(n,Number);return new Uint8Array(s.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},_i=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let r=e.byteLength/4,i=new Int32Array(e.buffer,e.byteOffset,r);switch(t){case"int64":{let a=BigInt64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"uint64":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let a=BigUint64Array.from(i,BigInt);return new Uint8Array(a.buffer)}case"int8":{if(i.some(n=>n<-128||n>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let a=Int8Array.from(i,Number);return new Uint8Array(a.buffer)}case"uint8":{if(i.some(a=>a<0||a>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(i,Number)}case"uint32":{if(i.some(n=>n<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let a=Uint32Array.from(i,Number);return new Uint8Array(a.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Yn=1,yi=()=>Yn++,Jn=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),bi=(e,t)=>{let r=mi.get(e);if(!r)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((i,a)=>i*a)*r/8):0},wi=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:r,tensor:i,dataType:a,shape:n,fallbackDataType:s}=e;this.sessionId=t,this.mlContext=r,this.mlTensor=i,this.dataType=a,this.tensorShape=n,this.fallbackDataType=s}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return bi(this.dataType,this.tensorShape)}destroy(){le("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),r=_i(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(r);return}else return r.buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,r){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===r.length&&this.tensorShape.every((i,a)=>i===r[a])}setIsDataConverted(e){this.isDataConverted=e}},$i=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,r,i){let a=this.tensorManager.getMLContext(e),n;if(!a.opSupportLimits().input.dataTypes.includes(t)){if(n=Jn.get(t),!n||!a.opSupportLimits().input.dataTypes.includes(n))throw new Error(`WebNN backend does not support data type: ${t}`);le("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${n}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(a,t,r))return this.wrapper.tensor;if(i){if(this.wrapper.byteLength!==bi(t,r))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let s=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,r,s,!0,!0,n),i&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=gi(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else le("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){if(this.activeUpload){let t=this.wrapper?.isDataConverted?_i(this.activeUpload,this.wrapper?.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(t):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(t);return}else return t.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},es=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}reserveTensorId(){let e=yi();return this.tensorTrackersById.set(e,new $i(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,r,i,a){le("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${r}, shape: ${i}, copyOld: ${a}}`);let n=this.tensorTrackersById.get(t);if(!n)throw new Error("Tensor not found.");return n.ensureTensor(e,r,i,a)}upload(e,t){let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");r.upload(t)}async download(e,t){le("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t?.byteLength}}`);let r=this.tensorTrackersById.get(e);if(!r)throw new Error("Tensor not found.");return r.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,r,i){let a=this.getMLContext(e),n=yi(),s=new wi({sessionId:e,context:a,tensor:t,dataType:r,shape:i});return this.tensorTrackersById.set(n,new $i(this,s)),this.externalTensors.add(s),n}async getCachedTensor(e,t,r,i,a,n,s){let u=this.getMLContext(e);for(let[d,c]of this.freeTensors.entries())if(c.canReuseTensor(u,t,r)){le("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}`);let f=this.freeTensors.splice(d,1)[0];return f.sessionId=e,f}le("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${s?`fallbackDataType: ${s},`:""} shape: ${r}}`);let l=await u.createTensor({dataType:s??t,shape:r,dimensions:r,usage:i,writable:a,readable:n});return new wi({sessionId:e,context:u,tensor:l,dataType:t,shape:r,fallbackDataType:s})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},ts=(...e)=>new es(...e)}),qt,rs,is,rh=P(()=>{J(),mt(),Xn(),th(),Je(),qt=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),rs=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let r=Object.keys(e).sort(),i=Object.keys(t).sort();return r.length===i.length&&r.every((a,n)=>a===i[n]&&e[a]===t[a])},is=class{constructor(e){this.tensorManager=ts(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,fi(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){le("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){le("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let r of t)le("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${r}}`),this.tensorManager.releaseTensorId(r);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let r=this.mlContextCache.findIndex(i=>i.gpuDevice===e);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:i}),i}}else if(e===void 0){let r=this.mlContextCache.findIndex(i=>i.options===void 0&&i.gpuDevice===void 0);if(r!==-1)return this.mlContextCache[r].mlContext;{let i=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:i}),i}}let t=this.mlContextCache.findIndex(r=>rs(r.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let r=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:r}),r}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let r=this.sessionIdsByMLContext.get(t);r||(r=new Set,this.sessionIdsByMLContext.set(t,r)),r.add(e),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e);let r=this.sessionIdsByMLContext.get(t);if(r.delete(e),r.size===0){this.sessionIdsByMLContext.delete(t);let i=this.mlContextCache.findIndex(a=>a.mlContext===t);i!==-1&&this.mlContextCache.splice(i,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){le("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,r,i,a){let n=qt.get(r);if(!n)throw new Error(`Unsupported ONNX data type: ${r}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,n,i,a)}async createTemporaryTensor(e,t,r){le("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${r}}`);let i=qt.get(t);if(!i)throw new Error(`Unsupported ONNX data type: ${t}`);let a=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,a,i,r,!1);let n=this.temporarySessionTensorIds.get(e);return n?n.push(a):this.temporarySessionTensorIds.set(e,[a]),a}uploadTensor(e,t){if(!me().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");le("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let r=await this.tensorManager.download(e);return hi(r,t)}}registerMLTensor(e,t,r,i){let a=qt.get(r);if(!a)throw new Error(`Unsupported ONNX data type: ${r}`);let n=this.tensorManager.registerTensor(e,t,a,i);return le("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${a}, dimensions: ${i}} -> {tensorId: ${n}}`),n}registerMLConstant(e,t,r,i,a,n,s=!1){if(!n)throw new Error("External mounted files are not available.");let u=e;e.startsWith("./")&&(u=e.substring(2));let l=n.get(u);if(!l)throw new Error(`File with name ${u} not found in preloaded files.`);if(t+r>l.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let d=l.slice(t,t+r).buffer,c;switch(a.dataType){case"float32":c=new Float32Array(d);break;case"float16":c=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(d):new Uint16Array(d);break;case"int32":c=new Int32Array(d);break;case"uint32":c=new Uint32Array(d);break;case"int64":if(s){let f=gi(new Uint8Array(d),"int64");c=new Int32Array(f.buffer),a.dataType="int32"}else c=new BigInt64Array(d);break;case"uint64":c=new BigUint64Array(d);break;case"int8":c=new Int8Array(d);break;case"int4":case"uint4":case"uint8":c=new Uint8Array(d);break;default:throw new Error(`Unsupported data type: ${a.dataType} in creating WebNN Constant from external data.`)}return le("verbose",()=>`[WebNN] registerMLConstant {dataType: ${a.dataType}, shape: ${a.shape}}} ${s?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),i.constant(a,c)}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let r=this.sessionGraphInputs.get(e);return r?r.includes(t):!1}isGraphOutput(e,t){let r=this.sessionGraphOutputs.get(e);return r?r.includes(t):!1}isGraphInputOutputTypeSupported(e,t,r=!0){let i=this.mlContextBySessionId.get(e),a=qt.get(gt(t));return typeof a>"u"?!1:r?!!i?.opSupportLimits().input.dataTypes.includes(a):!!i?.opSupportLimits().output.dataTypes.includes(a)}flush(){}}}),vi=P(()=>{}),xi,hr,mr,as,ns,ki,Si,ss,os,ih=P(()=>{Je(),vi(),xi=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),hr=[],mr=e=>Math.ceil(Number(e)/16)*16,as=e=>{for(let t=0;t<hr.length;t++){let r=hr[t];if(e<=r)return r}return Math.ceil(e/16)*16},ns=1,ki=()=>ns++,Si=async(e,t,r,i)=>{let a=mr(r),n=e.device.createBuffer({size:a,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let s=e.getCommandEncoder();e.endComputePass(),s.copyBufferToBuffer(t,0,n,0,a),e.flush(),await n.mapAsync(GPUMapMode.READ);let u=n.getMappedRange();if(i){let l=i();return l.set(new Uint8Array(u,0,r)),l}else return new Uint8Array(u.slice(0,r))}finally{n.destroy()}},ss=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of xi)hr.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let r=t.buffer,i=t.byteOffset,a=t.byteLength,n=mr(a),s=this.storageCache.get(e);if(!s)throw new Error("gpu data for uploading does not exist");if(Number(s.originalSize)!==a)throw new Error(`inconsistent data size. gpu data size=${s.originalSize}, data size=${a}`);let u=this.backend.device.createBuffer({mappedAtCreation:!0,size:n,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),l=u.getMappedRange();new Uint8Array(l).set(new Uint8Array(r,i,a)),u.unmap();let d=this.backend.device.createCommandEncoder();d.copyBufferToBuffer(u,0,s.gpuData.buffer,0,n),this.backend.device.queue.submit([d.finish()]),u.destroy(),le("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let r=this.storageCache.get(e);if(!r)throw new Error("source gpu data for memcpy does not exist");let i=this.storageCache.get(t);if(!i)throw new Error("destination gpu data for memcpy does not exist");if(r.originalSize!==i.originalSize)throw new Error("inconsistent source and destination gpu data size");let a=mr(r.originalSize),n=this.backend.getCommandEncoder();this.backend.endComputePass(),n.copyBufferToBuffer(r.gpuData.buffer,0,i.gpuData.buffer,0,a)}registerExternalBuffer(e,t,r){let i;if(r){if(i=r[0],e===r[1])return le("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, buffer is the same, skip.`),i;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else i=ki();return this.storageCache.set(i,{gpuData:{id:i,type:0,buffer:e},originalSize:t}),le("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${i}, registered.`),i}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),le("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let r=as(e),i,a=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,n=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(a||n){let u=(a?this.freeBuffers:this.freeUniformBuffers).get(r);u?u.length>0?i=u.pop():i=this.backend.device.createBuffer({size:r,usage:t}):i=this.backend.device.createBuffer({size:r,usage:t})}else i=this.backend.device.createBuffer({size:r,usage:t});let s={id:ki(),type:0,buffer:i};return this.storageCache.set(s.id,{gpuData:s,originalSize:Number(e)}),le("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${s.id}`),s}get(e){return this.storageCache.get(e)?.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,r=this.storageCache.get(t);if(!r){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return le("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${r.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(r.gpuData.buffer),r.originalSize}async download(e,t){let r=this.storageCache.get(Number(e));if(!r)throw new Error("data does not exist");await Si(this.backend,r.gpuData.buffer,r.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=xi.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let r=this.freeBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let r=this.freeUniformBuffers.get(e.size)||[];t===void 0||r.length>=t?e.destroy():r.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(r=>{r.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(le("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(r=>{r.gpuData.buffer.destroy()}),this.storageCache=new Map)}},os=(...e)=>new ss(...e)}),us,ce,we=P(()=>{us=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},ce=e=>new us(e)}),Ct,gr,ke,Ie,Z,be,Ti,Ot,at,H,Wt,B,G,ls,Ii,ds,ps,ne=P(()=>{J(),re(),Ct=64,gr=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},ke=(e,t=1)=>{let r=gr(e,t);return typeof r=="string"?r:r[0]},Ie=(e,t=1)=>{let r=gr(e,t);return typeof r=="string"?r:r[1]},Z=(...e)=>{let t=[];return e.forEach(r=>{r.length!==0&&t.push({type:12,data:r},{type:12,data:C.computeStrides(r)})}),t},be=e=>e%4===0?4:e%2===0?2:1,Ti=(e="f32",t,r="0")=>!t||t===1?`${e}(${r})`:`vec${t}<${e}>(${r})`,Ot=(e,t,r)=>e==="f32"?r:t===1?`f32(${r})`:`vec${t}<f32>(${r})`,at=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,H=(e,t,r,i)=>e.startsWith("uniforms.")&&r>4?typeof t=="string"?i==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:i==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:r>1?`${e}[${t}]`:e,Wt=(e,t,r,i,a)=>{let n=typeof r=="number",s=n?r:r.length,u=[...new Array(s).keys()],l=s<2?"u32":s<=4?`vec${s}<u32>`:`array<u32, ${s}>`,d=gr(t,a),c=typeof d=="string"?d:d[1],f=typeof d=="string"?d:d[0],h={indices:l,value:c,storage:f,tensor:t},g=M=>typeof M=="string"?M:`${M}u`,_={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=n?"uniforms.":"",k=`${b}${e}_shape`,v=`${b}${e}_strides`,w="";for(let M=0;M<s-1;M++)w+=`
    let dim${M} = current / ${H(v,M,s)};
    let rest${M} = current % ${H(v,M,s)};
    indices[${M}] = dim${M};
    current = rest${M};
    `;w+=`indices[${s-1}] = current;`;let S=s<2?"":`
  fn o2i_${e}(offset: u32) -> ${h.indices} {
    var indices: ${h.indices};
    var current = offset;
    ${w}
    return indices;
  }`,x=M=>(_.offsetToIndices=!0,s<2?M:`o2i_${e}(${M})`),T=[];if(s>=2)for(let M=s-1;M>=0;M--)T.push(`${H(v,M,s)} * (indices[${M}])`);let z=s<2?"":`
  fn i2o_${e}(indices: ${h.indices}) -> u32 {
    return ${T.join("+")};
  }`,E=M=>(_.indicesToOffset=!0,s<2?M:`i2o_${e}(${M})`),A=(...M)=>s===0?"0u":`${h.indices}(${M.map(g).join(",")})`,N=(M,q)=>s<2?`${M}`:`${H(M,q,s)}`,L=(M,q,te)=>s<2?`${M}=${te};`:`${H(M,q,s)}=${te};`,Y={},F=(M,q)=>{_.broadcastedIndicesToOffset=!0;let te=`${q.name}broadcastedIndicesTo${e}Offset`;if(te in Y)return`${te}(${M})`;let O=[];for(let ae=s-1;ae>=0;ae--){let ze=q.indicesGet("outputIndices",ae+q.rank-s);O.push(`${N(v,ae)} * (${ze} % ${N(k,ae)})`)}return Y[te]=`fn ${te}(outputIndices: ${q.type.indices}) -> u32 {
             return ${O.length>0?O.join("+"):"0u"};
           }`,`${te}(${M})`},ee=(M,q)=>(()=>{if(h.storage===h.value)return`${e}[${M}]=${q};`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`${e}[${M}]=vec2<u32>(u32(${q}), select(0u, 0xFFFFFFFFu, ${q} < 0));`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`${e}[${M}]=vec2<u32>(u32(${q}), 0u);`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`${e}[${M}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${q}));`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),U=M=>(()=>{if(h.storage===h.value)return`${e}[${M}]`;if(h.storage==="vec2<u32>"&&h.value==="i32")return`i32(${e}[${M}].x)`;if(h.storage==="vec2<u32>"&&h.value==="u32")return`u32(${e}[${M}].x)`;if(h.storage==="u32"&&h.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${M}] & 0xFFu), bool(${e}[${M}] & 0xFF00u), bool(${e}[${M}] & 0xFF0000u), bool(${e}[${M}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${h.storage} and value type ${h.value} yet`)})(),ie=s<2?"":`
  fn get_${e}ByIndices(indices: ${h.indices}) -> ${c} {
    return ${U(`i2o_${e}(indices)`)};
  }`,Q=s<2?"":(()=>{let M=u.map(te=>`d${te}: u32`).join(", "),q=u.map(te=>`d${te}`).join(", ");return`
  fn get_${e}(${M}) -> ${c} {
    return get_${e}ByIndices(${A(q)});
  }`})(),V=(...M)=>{if(M.length!==s)throw new Error(`indices length must be ${s}`);let q=M.map(g).join(",");return s===0?U("0u"):s===1?U(q[0]):(_.get=!0,_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}(${q})`)},oe=M=>s<2?U(M):(_.getByIndices=!0,_.indicesToOffset=!0,`get_${e}ByIndices(${M})`),j=s<2?"":`
  fn set_${e}ByIndices(indices: ${h.indices}, value: ${c}) {
    ${ee(`i2o_${e}(indices)`,"value")}
  }`,ue=s<2?"":(()=>{let M=u.map(te=>`d${te}: u32`).join(", "),q=u.map(te=>`d${te}`).join(", ");return`
  fn set_${e}(${M}, value: ${c}) {
    set_${e}ByIndices(${A(q)}, value);
  }`})();return{impl:()=>{let M=[],q=!1;return _.offsetToIndices&&(M.push(S),q=!0),_.indicesToOffset&&(M.push(z),q=!0),_.broadcastedIndicesToOffset&&(Object.values(Y).forEach(te=>M.push(te)),q=!0),_.set&&(M.push(ue),q=!0),_.setByIndices&&(M.push(j),q=!0),_.get&&(M.push(Q),q=!0),_.getByIndices&&(M.push(ie),q=!0),!n&&q&&M.unshift(`const ${k} = ${h.indices}(${r.join(",")});`,`const ${v} = ${h.indices}(${C.computeStrides(r).join(",")});`),M.join(`
`)},type:h,offsetToIndices:x,indicesToOffset:E,broadcastedIndicesToOffset:F,indices:A,indicesGet:N,indicesSet:L,set:(...M)=>{if(M.length!==s+1)throw new Error(`indices length must be ${s}`);let q=M[s];if(typeof q!="string")throw new Error("value must be string");let te=M.slice(0,s).map(g).join(",");return s===0?ee("0u",q):s===1?ee(te[0],q):(_.set=!0,_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}(${te}, ${q})`)},setByOffset:ee,setByIndices:(M,q)=>s<2?ee(M,q):(_.setByIndices=!0,_.indicesToOffset=!0,`set_${e}ByIndices(${M}, ${q});`),get:V,getByOffset:U,getByIndices:oe,usage:i,name:e,strides:v,shape:k,rank:s}},B=(e,t,r,i=1)=>Wt(e,t,r,"input",i),G=(e,t,r,i=1)=>Wt(e,t,r,"output",i),ls=(e,t,r)=>Wt(e,t,r,"atomicOutput",1),Ii=(e,t,r,i=1)=>Wt(e,t,r,"internal",i),ds=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Ct){let t=typeof e=="number"?e:e[0],r=typeof e=="number"?1:e[1],i=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||r>this.limits.maxComputeWorkgroupSizeY||i>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*r*i>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${r}, ${i}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let a=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,n=a?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,s=a?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*r*i}u + local_idx;`;return`@compute @workgroup_size(${t}, ${r}, ${i})
  fn main(${n}) {
    ${s}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let r=e.usage==="input"?"read":"read_write",i=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${r}> ${e.name}: array<${i}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,r=1){return this.uniforms.push({name:e,type:t,length:r}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:r,length:i}of this.uniforms)if(i&&i>4)r==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${r}>, ${Math.ceil(i/8)}>`):e.push(`${t}:array<vec4<${r}>, ${Math.ceil(i/4)}>`);else{let a=i==null||i===1?r:`vec${i}<${r}>`;e.push(`${t}:${a}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},ps=(e,t)=>new ds(e,t)}),cs,Ei,fs,hs,ms,gs,Be,_s,ys,nt=P(()=>{J(),re(),we(),ne(),cs=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Ei=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),fs=(e,t)=>C.sortBasedOnPerm(e,Ei(e.length,t)),hs=(e,t,r,i)=>{let a=`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`;for(let n=0;n<t;++n)a+=`a[${e[n]}]=i[${n}];`;return a+="return a;}"},ms=(e,t)=>{let r=[],i=[];for(let a=0;a<e.length;++a)e[a]!==1&&r.push(e[a]),e[t[a]]!==1&&i.push(t[a]);return{newShape:r,newPerm:i}},gs=(e,t)=>{let r=0;for(let i=0;i<e.length;++i)if(t[e[i]]!==1){if(e[i]<r)return!1;r=e[i]}return!0},Be=(e,t)=>{let r=e.dataType,i=e.dims.length,a=Ei(i,t),n=fs(e.dims,a),s=e.dims,u=n,l=i<2||gs(a,e.dims),d;if(l)return d=_=>{let b=B("input",r,s,4),k=G("output",r,u,4);return`
  ${_.registerUniform("output_size","u32").declareVariables(b,k)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let _=C.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(_/4)}]}},getShaderSource:d};let{newShape:c,newPerm:f}=ms(e.dims,a),h=C.areEqual(f,[2,3,1]),g=C.areEqual(f,[3,1,2]);if(c.length===2||h||g){s=h?[c[0],c[1]*c[2]]:g?[c[0]*c[1],c[2]]:c,u=[s[1],s[0]];let _=16;return d=b=>{let k=B("a",r,s.length),v=G("output",r,u.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(k,v)}
  var<workgroup> tile : array<array<${v.type.value}, ${_+1}>, ${_}>;
  ${b.mainStart([_,_,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${_} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${_}u + local_id.x;
    let input_row = workgroup_id_x * ${_}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${k.getByIndices(`${k.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${_}u + local_id.x;
    let output_row = workgroup_id_y * ${_}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${v.setByIndices(`${v.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=C.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(u[1]/_),y:Math.ceil(u[0]/_)},programUniforms:[{type:12,data:b},...Z(s,u)]}},getShaderSource:d}}return d=_=>{let b=B("a",r,s.length),k=G("output",r,u.length);return`
  ${_.registerUniform("output_size","u32").declareVariables(b,k)}

  ${hs(a,i,b,k)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${k.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${k.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let _=C.size(n);return{outputs:[{dims:n,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Z(s,u)]}},getShaderSource:d}},_s=(e,t)=>{cs(e.inputs,t.perm),e.compute(Be(e.inputs[0],t.perm))},ys=e=>ce({perm:e.perm})}),bs,ws,$s,vs,xs,ks,Ss,Ts,Is,Es,Le,zs,Cs,Os,As,Bs,Rs,Ms,Ns,Ds,Ps,ah=P(()=>{J(),re(),ne(),Ci(),nt(),bs={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},ws={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},$s={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},vs={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},xs=(e,t)=>{let r=[];for(let i=t-e;i<t;++i)r.push(i);return r},ks=(e,t)=>{let r=[],i=e.length;for(let n=0;n<i;n++)t.indexOf(n)===-1&&r.push(e[n]);let a=t.map(n=>e[n]);return[r,a]},Ss=(e,t)=>{let r=e.length+t.length,i=[],a=0;for(let n=0;n<r;n++)t.indexOf(n)===-1?i.push(e[a++]):i.push(1);return i},Ts=(e,t)=>{for(let r=0;r<e.length;++r)if(e[e.length-r-1]!==t-1-r)return!1;return!0},Is=(e,t)=>{let r=[];if(!Ts(e,t)){for(let i=0;i<t;++i)e.indexOf(i)===-1&&r.push(i);e.forEach(i=>r.push(i))}return r},Es=(e,t,r,i,a,n,s)=>{let u=r[0].dims,l=C.size(n),d=C.size(s),c=B("_A",r[0].dataType,u),f=G("output",a,n),h=64;l===1&&(h=256);let g=`
          var<workgroup> aBestValues : array<f32, ${h}>;
       `,_=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(c,f)}
        ${g}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(h)}

          let outputIndex = global_idx / ${h};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${$s[i]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${h}) {
           let candidate = f32(${c.getByOffset("offset + k")});
           bestValue = ${bs[i]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${h}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${ws[i]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${f.setByOffset("outputIndex",`${i==="mean"?`${f.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${f.type.storage}(${vs[i]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${h}`,inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:l},programUniforms:[{type:12,data:d}]})}},Le=(e,t,r,i)=>{let a=e.inputs.length===1?r:zi(e.inputs,r),n=a.axes;n.length===0&&!a.noopWithEmptyAxes&&(n=e.inputs[0].dims.map((g,_)=>_));let s=C.normalizeAxes(n,e.inputs[0].dims.length),u=s,l=e.inputs[0],d=Is(u,e.inputs[0].dims.length);d.length>0&&(l=e.compute(Be(e.inputs[0],d),{inputs:[0],outputs:[-1]})[0],u=xs(u.length,l.dims.length));let[c,f]=ks(l.dims,u),h=c;a.keepDims&&(h=Ss(c,s)),e.compute(Es(t,a.cacheKey,[l],i,e.inputs[0].dataType,h,f),{inputs:[l]})},zs=(e,t)=>{Le(e,"ReduceMeanShared",t,"mean")},Cs=(e,t)=>{Le(e,"ReduceL1Shared",t,"l1")},Os=(e,t)=>{Le(e,"ReduceL2Shared",t,"l2")},As=(e,t)=>{Le(e,"ReduceLogSumExpShared",t,"logSumExp")},Bs=(e,t)=>{Le(e,"ReduceMaxShared",t,"max")},Rs=(e,t)=>{Le(e,"ReduceMinShared",t,"min")},Ms=(e,t)=>{Le(e,"ReduceProdShared",t,"prod")},Ns=(e,t)=>{Le(e,"ReduceSumShared",t,"sum")},Ds=(e,t)=>{Le(e,"ReduceSumSquareShared",t,"sumSquare")},Ps=(e,t)=>{Le(e,"ReduceLogSumShared",t,"logSum")}}),Ve,Us,_r,zi,Ge,qs,Ws,Ls,Vs,Gs,Hs,Fs,js,Ks,Zs,He,Qs,Xs,Ys,Js,eo,to,ro,io,ao,no,Ci=P(()=>{J(),re(),we(),ne(),ah(),Ve=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Us=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],_r=(e,t,r,i,a,n,s=!1,u=!1)=>{let l=[],d=r[0].dims,c=d.length,f=C.normalizeAxes(a,c),h=!u&&f.length===0;d.forEach((b,k)=>{h||f.indexOf(k)>=0?s&&l.push(1):l.push(b)});let g=l.length,_=C.size(l);return{name:e,shaderCache:t,getShaderSource:b=>{let k=[],v=B("_A",r[0].dataType,c),w=G("output",n,g),S=i(v,w,f),x=S[2];for(let T=0,z=0;T<c;T++)h||f.indexOf(T)>=0?(s&&z++,x=`for(var j${T}: u32 = 0; j${T} < ${d[T]}; j${T}++) {
                  ${S[2].includes("last_index")?`let last_index = j${T};`:""}
                  ${v.indicesSet("input_indices",T,`j${T}`)}
                  ${x}
                }`):(k.push(`${v.indicesSet("input_indices",T,w.indicesGet("output_indices",z))};`),z++);return`

        ${b.registerUniform("output_size","u32").declareVariables(v,w)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${v.type.indices};
          let output_indices = ${w.offsetToIndices("global_idx")};

          ${k.join(`
`)}
          ${S[0]}       // init ops for reduce max/min
          ${S[1]}
          ${x}
          ${S[3]}
          ${S.length===4?w.setByOffset("global_idx","value"):S.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:l,dataType:n}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:[{type:12,data:_},...Z(d,l)]})}},zi=(e,t)=>{let r=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(i=>r.push(Number(i))),ce({axes:r,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ge=(e,t,r,i)=>{let a=e.inputs,n=a.length===1?r:zi(a,r);e.compute(_r(t,{hint:n.cacheKey,inputDependencies:["rank"]},[a[0]],n.noopWithEmptyAxes&&n.axes.length===0?Us:i,n.axes,a[0].dataType,n.keepDims,n.noopWithEmptyAxes),{inputs:[0]})},qs=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceLogSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,"value = log(value);"])},Ws=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceL1",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += abs(${r.getByIndices("input_indices")});`,""])},Ls=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceL2",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Vs=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceLogSumExp",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += exp(${r.getByIndices("input_indices")});`,"value = log(value);"])},Gs=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceMax",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(r.indicesSet("input_indices",s,0));return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = max(value, ${r.getByIndices("input_indices")});`,""]})},Hs=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceMean",t,(r,i,a)=>{let n=1;for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&(n*=e.inputs[0].dims[s]);return["var sum = f32(0);","",`sum += f32(${r.getByIndices("input_indices")});`,`let value = ${i.type.value}(sum / ${n});`]})},Fs=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceMin",t,(r,i,a)=>{let n=[];for(let s=0;s<r.rank;s++)(a.indexOf(s)>=0||a.length===0)&&n.push(`input_indices[${s}] = 0;`);return[`${n.join(`
`)}`,`var value = ${r.getByIndices("input_indices")};`,`value = min(value, ${r.getByIndices("input_indices")});`,""]})},js=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceProd",t,(r,i)=>[`var value = ${i.type.storage}(1);`,"",`value *= ${r.getByIndices("input_indices")};`,""])},Ks=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceSum",t,(r,i)=>[`var value = ${i.type.storage}(0);`,"",`value += ${r.getByIndices("input_indices")};`,""])},Zs=(e,t)=>{Ve(e.inputs),Ge(e,"ReduceSumSquare",t,(r,i)=>[`var t = ${i.type.value}(0); var value = ${i.type.value}(0);`,"",`t = ${r.getByIndices("input_indices")}; value += t * t;`,""])},He=(e,t,r)=>{if(t.length===0)return r;let i=1,a=1;for(let n=0;n<t.length;n++)t.indexOf(n)===-1?i*=e[n]:a*=e[n];return a<32&&i>1024},Qs=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Hs(e,t):zs(e,t)},Xs=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ws(e,t):Cs(e,t)},Ys=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ls(e,t):Os(e,t)},Js=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Vs(e,t):As(e,t)},eo=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Gs(e,t):Bs(e,t)},to=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Fs(e,t):Rs(e,t)},ro=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?js(e,t):Ms(e,t)},io=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ks(e,t):Ns(e,t)},ao=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Zs(e,t):Ds(e,t)},no=(e,t)=>{He(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?qs(e,t):Ps(e,t)}}),Oi,so,oo,Ai,nh=P(()=>{J(),we(),Ci(),Oi=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},so=(e,t)=>{Oi(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(_r("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},oo=(e,t)=>{Oi(e.inputs);let r=(i,a,n)=>{let s=[];for(let u=0;u<i.rank;u++)(n.indexOf(u)>=0||n.length===0)&&s.push(`input_indices[${u}] = 0;`);return[`${s.join(`
`)}`,`var value = ${i.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${i.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${i.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",a.setByOffset("global_idx","best_index")]};e.compute(_r("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],r,[t.axis],7,t.keepDims),{inputs:[0]})},Ai=e=>ce(e)}),uo,yr,lo,po,co,Lt,fo,ho,Bi=P(()=>{J(),re(),vi(),ne(),uo=(e,t)=>{let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4],u=e[5];if(s&&u)throw new Error("Attention cannot have both past and attention_bias");if(r.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let l=r.dims[0],d=r.dims[1],c=r.dims[2];if(a.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(i.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(i.dims[0]!==c)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(a.dims[0]!==i.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let f=a.dims[0]/3,h=f,g=h;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let S of t.qkvHiddenSizes)if(S%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");f=t.qkvHiddenSizes[0],h=t.qkvHiddenSizes[1],g=t.qkvHiddenSizes[2]}let _=d;if(f!==h)throw new Error("qkv_hidden_sizes first element should be same as the second");if(a.dims[0]!==f+h+g)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(s){if(h!==g)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(s.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(s.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(s.dims[1]!==l)throw new Error('Input "past" second dimension must be batch_size');if(s.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(s.dims[4]!==h/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=s.dims[3])}let k=_+b,v=-1,w=0;if(n)throw new Error("Mask not supported");if(s)throw new Error("past is not supported");if(u){if(u.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(u.dims[0]!==l||u.dims[1]!==t.numHeads||u.dims[2]!==d||u.dims[3]!==k)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:l,sequenceLength:d,pastSequenceLength:b,kvSequenceLength:_,totalSequenceLength:k,maxSequenceLength:v,inputHiddenSize:c,hiddenSize:f,vHiddenSize:g,headSize:Math.floor(f/t.numHeads),vHeadSize:Math.floor(g/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},yr=(e,t,r)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${r?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,lo=(e,t,r,i,a,n,s,u)=>{let l=be(s?1:n),d=64,c=n/l;c<d&&(d=32);let f=Math.ceil(n/l/d),h=[{type:12,data:t},{type:12,data:r},{type:12,data:i},{type:12,data:a},{type:12,data:c},{type:12,data:f}],g=ke(e.dataType,l),_=Ie(1,l),b=["type"];s&&b.push("type"),u&&b.push("type");let k=v=>{let w=G("x",e.dataType,e.dims,l),S=[w],x=s?B("seq_lens",s.dataType,s.dims):void 0;x&&S.push(x);let T=u?B("total_sequence_length_input",u.dataType,u.dims):void 0;T&&S.push(T);let z=Ie(e.dataType),E=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${d}>;
  var<workgroup> thread_sum: array<f32, ${d}>;
  ${v.registerUniforms(E).declareVariables(...S)}
  ${v.mainStart([d,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${yr(x,T,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${d}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${s?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${_}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${_}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(l){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${d}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${_}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${_}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(l){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${l}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${d}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${w.type.value}(${z}(1.0) / ${z}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${_}(x[offset + i]);
        x[offset + i] = ${w.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${s?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${w.type.value}(${z}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${d};${g};${l}`,inputDependencies:b},getShaderSource:k,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:a,z:t*r},programUniforms:h})}},po=(e,t,r,i,a,n,s,u,l)=>{let d=s+n.kvSequenceLength,c=[n.batchSize,n.numHeads,n.sequenceLength,d],f=e>1&&i,h=n.kvNumHeads?n.kvNumHeads:n.numHeads,g=f?[n.batchSize,h,d,n.headSize]:void 0,_=n.nReps?n.nReps:1,b=n.scale===0?1/Math.sqrt(n.headSize):n.scale,k=be(n.headSize),v=n.headSize/k,w=12,S={x:Math.ceil(d/w),y:Math.ceil(n.sequenceLength/w),z:n.batchSize*n.numHeads},x=[{type:12,data:n.sequenceLength},{type:12,data:v},{type:12,data:d},{type:12,data:n.numHeads},{type:12,data:n.headSize},{type:1,data:b},{type:12,data:s},{type:12,data:n.kvSequenceLength},{type:12,data:_}],T=f&&i&&C.size(i.dims)>0,z=["type","type"];T&&z.push("type"),a&&z.push("type"),u&&z.push("type"),l&&z.push("type");let E=[{dims:c,dataType:t.dataType,gpuDataType:0}];f&&E.push({dims:g,dataType:t.dataType,gpuDataType:0});let A=N=>{let L=B("q",t.dataType,t.dims,k),Y=B("key",r.dataType,r.dims,k),F=[L,Y];if(T){let j=B("past_key",i.dataType,i.dims,k);F.push(j)}a&&F.push(B("attention_bias",a.dataType,a.dims));let ee=u?B("seq_lens",u.dataType,u.dims):void 0;ee&&F.push(ee);let U=l?B("total_sequence_length_input",l.dataType,l.dims):void 0;U&&F.push(U);let ie=G("output",t.dataType,c),Q=[ie];f&&Q.push(G("present_key",t.dataType,g,k));let V=Ie(1,k),oe=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${w}u;

  var<workgroup> tileQ: array<${L.type.storage}, ${w*w}>;
  var<workgroup> tileK: array<${L.type.storage}, ${w*w}>;
  ${N.registerUniforms(oe).declareVariables(...F,...Q)}
  ${N.mainStart([w,w,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${_===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${_===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${yr(ee,U,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${T&&f?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${f?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${V}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${T&&f?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${f?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${V}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(k){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${k}`)}})()};
        output[outputIdx] = ${ie.type.value} (sum * uniforms.alpha) + ${a?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${k};${a!==void 0};${i!==void 0};${e}`,inputDependencies:z},getRunData:()=>({outputs:E,dispatchGroup:S,programUniforms:x}),getShaderSource:A}},co=(e,t,r,i,a,n,s=void 0,u=void 0)=>{let l=n+a.kvSequenceLength,d=a.nReps?a.nReps:1,c=a.vHiddenSize*d,f=e>1&&i,h=a.kvNumHeads?a.kvNumHeads:a.numHeads,g=f?[a.batchSize,h,l,a.headSize]:void 0,_=[a.batchSize,a.sequenceLength,c],b=12,k={x:Math.ceil(a.vHeadSize/b),y:Math.ceil(a.sequenceLength/b),z:a.batchSize*a.numHeads},v=[{type:12,data:a.sequenceLength},{type:12,data:l},{type:12,data:a.vHeadSize},{type:12,data:a.numHeads},{type:12,data:a.headSize},{type:12,data:c},{type:12,data:n},{type:12,data:a.kvSequenceLength},{type:12,data:d}],w=f&&i&&C.size(i.dims)>0,S=["type","type"];w&&S.push("type"),s&&S.push("type"),u&&S.push("type");let x=[{dims:_,dataType:t.dataType,gpuDataType:0}];f&&x.push({dims:g,dataType:t.dataType,gpuDataType:0});let T=z=>{let E=B("probs",t.dataType,t.dims),A=B("v",r.dataType,r.dims),N=[E,A];w&&N.push(B("past_value",i.dataType,i.dims));let L=s?B("seq_lens",s.dataType,s.dims):void 0;s&&N.push(L);let Y=u?B("total_sequence_length_input",u.dataType,u.dims):void 0;u&&N.push(Y);let F=[G("output",t.dataType,_)];f&&F.push(G("present_value",t.dataType,g));let ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${E.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${E.type.value}, ${b*b}>;
  ${z.registerUniforms(ee).declareVariables(...N,...F)}
  ${z.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${d===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${d===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${yr(L,Y,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${w&&f?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${f?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${E.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${w&&f?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${f?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${i!==void 0};${e}`,inputDependencies:S},getRunData:()=>({outputs:x,dispatchGroup:k,programUniforms:v}),getShaderSource:T}},Lt=(e,t,r,i,a,n,s,u,l,d,c=void 0,f=void 0)=>{let h=Math.min(e.outputCount,1+(s?1:0)+(u?1:0)),g=h>1?d.pastSequenceLength:0,_=g+d.kvSequenceLength,b=l&&C.size(l.dims)>0?l:void 0,k=[t,r];h>1&&s&&C.size(s.dims)>0&&k.push(s),b&&k.push(b),c&&k.push(c),f&&k.push(f);let v=e.compute(po(h,t,r,s,b,d,g,c,f),{inputs:k,outputs:h>1?[-1,1]:[-1]})[0];e.compute(lo(v,d.batchSize,d.numHeads,g,d.sequenceLength,_,c,f),{inputs:c&&f?[v,c,f]:[v],outputs:[]});let w=[v,i];h>1&&u&&C.size(u.dims)>0&&w.push(u),c&&w.push(c),f&&w.push(f),e.compute(co(h,v,i,u,d,g,c,f),{inputs:w,outputs:h>1?[0,2]:[0]})},fo=(e,t)=>{let r=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],i=t.sequenceLength,a=t.inputHiddenSize,n=t.headSize,s=12,u={x:Math.ceil(t.headSize/s),y:Math.ceil(t.sequenceLength/s),z:t.batchSize*t.numHeads},l=[e.inputs[0],e.inputs[1],e.inputs[2]],d=[{type:12,data:i},{type:12,data:a},{type:12,data:n},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],c=f=>{let h=G("output_q",l[0].dataType,r),g=G("output_k",l[0].dataType,r),_=G("output_v",l[0].dataType,r),b=B("input",l[0].dataType,l[0].dims),k=B("weight",l[1].dataType,l[1].dims),v=B("bias",l[2].dataType,l[2].dims),w=b.type.storage,S=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${s}u;
  var<workgroup> tileInput: array<${w}, ${s*s}>;
  var<workgroup> tileWeightQ: array<${w}, ${s*s}>;
  var<workgroup> tileWeightK: array<${w}, ${s*s}>;
  var<workgroup> tileWeightV: array<${w}, ${s*s}>;
  ${f.registerUniforms(S).declareVariables(b,k,v,h,g,_)}
  ${f.mainStart([s,s,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${w}(0);
    var valueK = ${w}(0);
    var valueV = ${w}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:r,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:u,programUniforms:d}),getShaderSource:c},{inputs:l,outputs:[-1,-1,-1]})},ho=(e,t)=>{let r=uo(e.inputs,t),[i,a,n]=fo(e,r);return Lt(e,i,a,n,e.inputs[4],void 0,void 0,void 0,e.inputs[5],r)}}),mo,go,_o,yo,sh=P(()=>{qe(),J(),re(),we(),ne(),mo=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let r=(i,a,n)=>{let s=a.length;if(s!==i.length)throw new Error(`${n}: num dimensions != ${s}`);a.forEach((u,l)=>{if(u!==i[l])throw new Error(`${n}: dim[${l}] do not match`)})};if(e[0].dims.length>1){let i=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);r(e[1].dims,i,"Invalid input scale"),r(e[2].dims,i,"Invalid input B"),r(e[3].dims,i,"Invalid input mean"),r(e[4].dims,i,"Invalid input var")}else r(e[1].dims,[1],"Invalid input scale"),r(e[2].dims,[1],"Invalid input B"),r(e[3].dims,[1],"Invalid input mean"),r(e[4].dims,[1],"Invalid input var")},go=(e,t)=>{let{epsilon:r,spatial:i,format:a}=t,n=e[0].dims,s=i?be(n[n.length-1]):1,u=a==="NHWC"&&n.length>1?s:1,l=C.size(n)/s,d=i,c=d?n.length:n,f=B("x",e[0].dataType,e[0].dims,s),h=B("scale",e[1].dataType,e[1].dims,u),g=B("bias",e[2].dataType,e[2].dims,u),_=B("inputMean",e[3].dataType,e[3].dims,u),b=B("inputVar",e[4].dataType,e[4].dims,u),k=G("y",e[0].dataType,c,s),v=()=>{let S="";if(i)S=`let cOffset = ${n.length===1?"0u":a==="NHWC"?`outputIndices[${n.length-1}] / ${s}`:"outputIndices[1]"};`;else if(a==="NCHW")S=`
            ${k.indicesSet("outputIndices","0","0")}
            let cOffset = ${k.indicesToOffset("outputIndices")};`;else{S=`var cIndices = ${h.type.indices}(0);
                       cIndices[0] = outputIndices[${n.length-1}];`;for(let x=1;x<h.rank;x++)S+=`cIndices[${x}] = outputIndices[${x}];`;S+=`let cOffset = ${h.indicesToOffset("cIndices")};`}return S},w=S=>`
  const epsilon = ${r};
  ${S.registerUniform("outputSize","u32").declareVariables(f,h,g,_,b,k)}
  ${S.mainStart()}
  ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${k.offsetToIndices(`global_idx * ${s}`)};
    ${v()}
    let scale = ${h.getByOffset("cOffset")};
    let bias = ${g.getByOffset("cOffset")};
    let inputMean = ${_.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${f.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${k.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${i}_${s}`,inputDependencies:d?["rank","type","type","type","type"]:void 0},getShaderSource:w,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d?[{type:12,data:l},...Z(n)]:[{type:12,data:l}]})}},_o=e=>ce(e),yo=(e,t)=>{let{inputs:r,outputCount:i}=e,a=_o({...t,outputCount:i});if(ge.webgpu.validateInputContent&&mo(r,a),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(go(r,a))}}),bo,wo,$o,oh=P(()=>{re(),ne(),bo=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},wo=e=>{let t=e[0].dims,r=e[0].dims[2],i=C.size(t)/4,a=e[0].dataType,n=B("input",a,t,4),s=B("bias",a,[r],4),u=B("residual",a,t,4),l=G("output",a,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)}}),getShaderSource:d=>`
  const channels = ${r}u / 4;
  ${d.declareVariables(n,s,u,l)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(i)}
    let value = ${n.getByOffset("global_idx")}
      + ${s.getByOffset("global_idx % channels")} + ${u.getByOffset("global_idx")};
    ${l.setByOffset("global_idx","value")}
  }`}},$o=e=>{bo(e.inputs),e.compute(wo(e.inputs))}}),vo,de,xo,ko,So,To,Io,Eo,zo,Co,Oo,Ao,Bo,Ro,Mo,No,Vt,Do,br,Po,Uo,qo,Wo,Lo,Vo,Go,Ho,Fo,jo,Ko,Zo,Qo,Xo,Yo,Jo,Ri,eu,Mi,Ni,tu,ru,iu,au,nu,su,Di=P(()=>{J(),re(),we(),ne(),vo=(e,t,r,i,a,n,s)=>{let u=Math.ceil(t/4),l="";typeof a=="string"?l=`${a}(a)`:l=a("a");let d=B("inputData",r,[u],4),c=G("outputData",i,[u],4),f=[{name:"vec_size",type:"u32"}];return s&&f.push(...s),`
      ${e.registerUniforms(f).declareVariables(d,c)}

  ${n??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${d.getByOffset("global_idx")};
    ${c.setByOffset("global_idx",l)}
  }`},de=(e,t,r,i,a,n=e.dataType,s,u)=>{let l=[{type:12,data:Math.ceil(C.size(e.dims)/4)}];return s&&l.push(...s),{name:t,shaderCache:{hint:a,inputDependencies:["type"]},getShaderSource:d=>vo(d,C.size(e.dims),e.dataType,n,r,i,u),getRunData:d=>({outputs:[{dims:e.dims,dataType:n}],dispatchGroup:{x:Math.ceil(C.size(d[0].dims)/64/4)},programUniforms:l})}},xo=e=>{e.compute(de(e.inputs[0],"Abs","abs"))},ko=e=>{e.compute(de(e.inputs[0],"Acos","acos"))},So=e=>{e.compute(de(e.inputs[0],"Acosh","acosh"))},To=e=>{e.compute(de(e.inputs[0],"Asin","asin"))},Io=e=>{e.compute(de(e.inputs[0],"Asinh","asinh"))},Eo=e=>{e.compute(de(e.inputs[0],"Atan","atan"))},zo=e=>{e.compute(de(e.inputs[0],"Atanh","atanh"))},Co=e=>ce(e),Oo=(e,t)=>{let r;switch(t.to){case 10:r="vec4<f16>";break;case 1:r="vec4<f32>";break;case 12:r="vec4<u32>";break;case 6:r="vec4<i32>";break;case 9:r="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(de(e.inputs[0],"Cast",r,void 0,t.cacheKey,t.to))},Ao=e=>{let t,r,i=e.length>=2&&e[1].data!==0,a=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=i?e[1].getFloat32Array()[0]:-34028234663852886e22,r=a?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=i?e[1].getUint16Array()[0]:64511,r=a?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return ce({min:t,max:r})},Bo=(e,t)=>{let r=t||Ao(e.inputs),i=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Clip",a=>`clamp(${a}, vec4<${i}>(uniforms.min), vec4<${i}>(uniforms.max))`,void 0,r.cacheKey,void 0,[{type:e.inputs[0].dataType,data:r.min},{type:e.inputs[0].dataType,data:r.max}],[{name:"min",type:i},{name:"max",type:i}]),{inputs:[0]})},Ro=e=>{e.compute(de(e.inputs[0],"Ceil","ceil"))},Mo=e=>{e.compute(de(e.inputs[0],"Cos","cos"))},No=e=>{e.compute(de(e.inputs[0],"Cosh","cosh"))},Vt=e=>ce(e),Do=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Elu",i=>`elu_vf32(${i})`,`
  const elu_alpha_ = ${r}(${t.alpha});

  fn elu_f32(a: ${r}) -> ${r} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${r}>) -> vec4<${r}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},br=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Po=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Erf",r=>`erf_vf32(${r})`,br(t)))},Uo=e=>{e.compute(de(e.inputs[0],"Exp","exp"))},qo=e=>{e.compute(de(e.inputs[0],"Floor","floor"))},Wo=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Gelu",r=>`0.5 * ${r} * (1.0 + erf_vf32(${r} * 0.7071067811865475))`,br(t)))},Lo=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"LeakyRelu",i=>`select(leaky_relu_alpha_ * ${i}, ${i}, ${i} >= vec4<${r}>(0.0))`,`const leaky_relu_alpha_ = ${r}(${t.alpha});`,t.cacheKey))},Vo=e=>{e.compute(de(e.inputs[0],"Not",t=>`!${t}`))},Go=e=>{e.compute(de(e.inputs[0],"Neg",t=>`-${t}`))},Ho=e=>{e.compute(de(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Fo=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"Relu",r=>`select(vec4<${t}>(0.0), ${r}, ${r} > vec4<${t}>(0.0))`))},jo=e=>{e.compute(de(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Ko=e=>ce(e),Zo=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"HardSigmoid",i=>`max(vec4<${r}>(0.0), min(vec4<${r}>(1.0), ${t.alpha} * ${i} + vec4<${r}>(${t.beta})))`,void 0,t.cacheKey))},Qo=e=>{e.compute(de(e.inputs[0],"Sin","sin"))},Xo=e=>{e.compute(de(e.inputs[0],"Sinh","sinh"))},Yo=e=>{e.compute(de(e.inputs[0],"Sqrt","sqrt"))},Jo=e=>{e.compute(de(e.inputs[0],"Tan","tan"))},Ri=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,eu=e=>{e.compute(de(e.inputs[0],"Tanh",Ri))},Mi=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ri("v")};
}
`,Ni=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,tu=e=>{let t=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"FastGelu",Ni,Mi(t),void 0,e.inputs[0].dataType))},ru=(e,t)=>{let r=Ie(e.inputs[0].dataType);return e.compute(de(e.inputs[0],"ThresholdedRelu",i=>`select(vec4<${r}>(0.0), ${i}, ${i} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${r}>(${t.alpha});`,t.cacheKey)),0},iu=e=>{e.compute(de(e.inputs[0],"Log","log"))},au=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,nu=e=>`quick_gelu_impl(${e})`,su=(e,t)=>{let r=Ie(e.inputs[0].dataType);e.compute(de(e.inputs[0],"QuickGelu",nu,au(r,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),ou,uu,lu,uh=P(()=>{re(),ne(),Di(),ou=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},uu=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let r=B("input",e[0].dataType,e[0].dims,4),i=B("bias",e[0].dataType,[e[0].dims[2]],4),a=G("output",e[0].dataType,t,4),n=C.size(t)/4,s=ke(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)}}),getShaderSource:u=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${u.declareVariables(r,i,a)}

  ${br(s)}

  ${u.mainStart()}
    ${u.guardAgainstOutOfBoundsWorkgroupSizes(n)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${a.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},lu=e=>{ou(e.inputs),e.compute(uu(e.inputs))}}),du,pu,Fe,cu,fu,hu,mu,gu,_u,yu,bu,wu,$u,lh=P(()=>{J(),re(),ne(),du=(e,t,r,i,a,n,s,u,l,d,c,f)=>{let h,g;typeof u=="string"?h=g=(w,S)=>`${u}((${w}),(${S}))`:typeof u=="function"?h=g=u:(h=u.scalar,g=u.vector);let _=G("outputData",c,i.length,4),b=B("aData",l,t.length,4),k=B("bData",d,r.length,4),v;if(a)if(n){let w=C.size(t)===1,S=C.size(r)===1,x=t.length>0&&t[t.length-1]%4===0,T=r.length>0&&r[r.length-1]%4===0;w||S?v=_.setByOffset("global_idx",g(w?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),S?`${k.type.value}(${k.getByOffset("0")}.x)`:k.getByOffset("global_idx"))):v=`
            let outputIndices = ${_.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",_)};
            let offsetB = ${k.broadcastedIndicesToOffset("outputIndices",_)};
            ${_.setByOffset("global_idx",g(s||x?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,s||T?k.getByOffset("offsetB / 4u"):`${k.type.value}(${k.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else v=_.setByOffset("global_idx",g(b.getByOffset("global_idx"),k.getByOffset("global_idx")));else{if(!n)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let w=(S,x,T="")=>{let z=`aData[indexA${x}][componentA${x}]`,E=`bData[indexB${x}][componentB${x}]`;return`
            let outputIndices${x} = ${_.offsetToIndices(`global_idx * 4u + ${x}u`)};
            let offsetA${x} = ${b.broadcastedIndicesToOffset(`outputIndices${x}`,_)};
            let offsetB${x} = ${k.broadcastedIndicesToOffset(`outputIndices${x}`,_)};
            let indexA${x} = offsetA${x} / 4u;
            let indexB${x} = offsetB${x} / 4u;
            let componentA${x} = offsetA${x} % 4u;
            let componentB${x} = offsetB${x} % 4u;
            ${S}[${x}] = ${T}(${h(z,E)});
          `};c===9?v=`
            var data = vec4<u32>(0);
            ${w("data",0,"u32")}
            ${w("data",1,"u32")}
            ${w("data",2,"u32")}
            ${w("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:v=`
            ${w("outputData[global_idx]",0)}
            ${w("outputData[global_idx]",1)}
            ${w("outputData[global_idx]",2)}
            ${w("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,k,_)}

        ${f??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${v}
      }`},pu=(e,t,r,i,a,n,s=r.dataType)=>{let u=r.dims.map(b=>Number(b)??1),l=i.dims.map(b=>Number(b)??1),d=!C.areEqual(u,l),c=u,f=C.size(u),h=!1,g=!1,_=[d];if(d){let b=zt.calcShape(u,l,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");c=b.slice(),f=C.size(c);let k=C.size(u)===1,v=C.size(l)===1,w=u.length>0&&u[u.length-1]%4===0,S=l.length>0&&l[l.length-1]%4===0;_.push(k),_.push(v),_.push(w),_.push(S);let x=1;for(let T=1;T<c.length;T++){let z=u[u.length-T],E=l[l.length-T];if(z===E)x*=z;else break}x%4===0?(g=!0,h=!0):(k||v||w||S)&&(h=!0)}else h=!0;return _.push(h),{name:e,shaderCache:{hint:t+_.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>du(b,u,l,c,h,d,g,a,r.dataType,i.dataType,s,n),getRunData:()=>({outputs:[{dims:c,dataType:s}],dispatchGroup:{x:Math.ceil(f/64/4)},programUniforms:[{type:12,data:Math.ceil(C.size(c)/4)},...Z(u,l,c)]})}},Fe=(e,t,r,i,a,n)=>{e.compute(pu(t,a??"",e.inputs[0],e.inputs[1],r,i,n))},cu=e=>{Fe(e,"Add",(t,r)=>`${t}+${r}`)},fu=e=>{Fe(e,"Div",(t,r)=>`${t}/${r}`)},hu=e=>{Fe(e,"Equal",{scalar:(t,r)=>`u32(${t}==${r})`,vector:(t,r)=>`vec4<u32>(${t}==${r})`},void 0,void 0,9)},mu=e=>{Fe(e,"Mul",(t,r)=>`${t}*${r}`)},gu=e=>{let t=B("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Fe(e,"Pow",{scalar:(r,i)=>`pow_custom(${r},${i})`,vector:(r,i)=>`pow_vector_custom(${r},${i})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},_u=e=>{Fe(e,"Sub",(t,r)=>`${t}-${r}`)},yu=e=>{Fe(e,"Greater",{scalar:(t,r)=>`u32(${t}>${r})`,vector:(t,r)=>`vec4<u32>(${t}>${r})`},void 0,void 0,9)},bu=e=>{Fe(e,"Less",{scalar:(t,r)=>`u32(${t}<${r})`,vector:(t,r)=>`vec4<u32>(${t}<${r})`},void 0,void 0,9)},wu=e=>{Fe(e,"GreaterOrEqual",{scalar:(t,r)=>`u32(${t}>=${r})`,vector:(t,r)=>`vec4<u32>(${t}>=${r})`},void 0,void 0,9)},$u=e=>{Fe(e,"LessOrEqual",{scalar:(t,r)=>`u32(${t}<=${r})`,vector:(t,r)=>`vec4<u32>(${t}<=${r})`},void 0,void 0,9)}}),vu,xu,ku,Su,Tu,Iu,dh=P(()=>{J(),re(),we(),ne(),vu=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let r=0,i=e[r],a=i.dataType,n=i.dims.length;e.forEach((s,u)=>{if(u!==r){if(s.dataType!==a)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape");s.dims.forEach((l,d)=>{if(d!==t&&l!==i.dims[d])throw new Error("non concat dimensions must match")})}})},xu=(e,t)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${e}u>(${t});
    for (var i: u32 = 0u; i < ${e}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${e}u;
  }`,ku=(e,t)=>{let r=e.length,i=[];for(let a=0;a<r;++a){let n=t.setByOffset("global_idx",e[a].getByIndices("indices"));r===1?i.push(n):a===0?i.push(`if (inputIndex == ${a}u) { ${n} }`):a===r-1?i.push(`else { ${n} }`):i.push(`else if (inputIndex == ${a}) { ${n} }`)}return i.join(`
`)},Su=(e,t,r,i)=>{let a=C.size(r),n=new Array(e.length),s=new Array(e.length),u=0,l=[],d=[],c=[{type:12,data:a}];for(let b=0;b<e.length;++b)u+=e[b].dims[t],n[b]=u,d.push(e[b].dims.length),s[b]=B(`input${b}`,i,d[b]),l.push("rank"),c.push({type:12,data:n[b]});for(let b=0;b<e.length;++b)c.push(...Z(e[b].dims));c.push(...Z(r));let f=G("output",i,r.length),h=f.indicesGet("indices",t),g=Array.from(Array(n.length).keys()).map(b=>`uniforms.sizeInConcatAxis${b}`).join(","),_=b=>`

  ${(()=>{b.registerUniform("outputSize","u32");for(let k=0;k<e.length;k++)b.registerUniform(`sizeInConcatAxis${k}`,"u32");return b.declareVariables(...s,f)})()}

  ${xu(n.length,g)}

  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${f.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${h});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${n.length}u>(${g});
      ${h} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${ku(s,f)}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:r,dataType:i}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:c}),getShaderSource:_}},Tu=(e,t)=>{let r=e.inputs,i=r[0].dims,a=C.normalizeAxis(t.axis,i.length);vu(r,a);let n=i.slice();n[a]=r.reduce((u,l)=>u+(l.dims.length>a?l.dims[a]:0),0);let s=r.filter(u=>C.size(u.dims)>0);e.compute(Su(s,a,n,r[0].dataType),{inputs:s})},Iu=e=>ce({axis:e.axis})}),yt,bt,wt,Pi,$t=P(()=>{J(),re(),yt=(e,t,r="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${r}(uniforms.clip_min)), ${t}(${r}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${r}(uniforms.alpha) * value + ${r}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${r}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},bt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},wt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Pi=e=>{let t=e?.activation||"";if(t==="HardSigmoid"){let[r,i]=e?.activation_params||[.2,.5];return{activation:t,alpha:r,beta:i}}else if(t==="Clip"){let[r,i]=e?.activation_params||[Zn,Qn];return{activation:t,clipMax:i,clipMin:r}}else if(t==="LeakyRelu"){let[r]=e?.activation_params||[.01];return{activation:t,alpha:r}}return{activation:t}}}),Se,Eu,Ui=P(()=>{Se=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Eu=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),zu,ph=P(()=>{zu=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Gt,qi,Wi=P(()=>{J(),re(),ne(),$t(),Gt=(e,t,r,i,a)=>{let n=i-r;return`
      ${Array.from({length:r}).map((s,u)=>`
      if (${H(t.shape,u,t.rank)} != 1) {
        ${t.indicesSet(e,u,H(a,u+n,i))}
      } else {
        ${t.indicesSet(e,u,0)}
      }`).join("")}
`},qi=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s[s.length-2],d=u[u.length-1],c=s[s.length-1],f=be(d),h=be(c),g=be(l),_=C.size(r)/f/g,b=e.length>2,k=i?i.slice(0,-2):r.slice(0,-2),v=[C.size(k),l,d],w=[{type:12,data:_},{type:12,data:l},{type:12,data:d},{type:12,data:c}];bt(t,w),w.push(...Z(k,s,u)),b&&w.push(...Z(e[2].dims)),w.push(...Z(v));let S=x=>{let T=Ii("batch_dims",e[0].dataType,k.length),z=B("a",e[0].dataType,s.length,h),E=B("b",e[1].dataType,u.length,f),A=G("output",e[0].dataType,v.length,f),N=ke(A.type.tensor),L=yt(t,A.type.value,N),Y=[z,E],F="";if(b){let ie=a?f:1;Y.push(B("bias",e[2].dataType,e[2].dims.length,ie)),F=`${a?`value += bias[col / ${ie}];`:`value += ${A.type.value}(bias[row + i]);`}`}let ee=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];wt(t,ee);let U=()=>{let ie=`var a_data: ${z.type.value};`;for(let Q=0;Q<h;Q++)ie+=`
              let b_data${Q} = b[(b_offset + (k + ${Q}) * uniforms.N + col) / ${f}];`;for(let Q=0;Q<g;Q++){ie+=`a_data = a[(a_offset + (row + ${Q}) * uniforms.K + k) / ${h}];`;for(let V=0;V<h;V++)ie+=`
            values[${Q}] = fma(${E.type.value}(a_data${h===1?"":`[${V}]`}), b_data${V}, values[${Q}]);
`}return ie};return`
  ${x.registerUniforms(ee).registerInternalVariables(T).declareVariables(...Y,A)}
  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${f})) * ${f};
    var index1 = global_idx / (uniforms.N / ${f});
    let stride1 = uniforms.M / ${g};
    let row = (index1 % stride1) * ${g};
    let batch = index1 / stride1;

    ${r.length===2?"":`let batch_indices = ${T.offsetToIndices("batch")};`}

    var a_indices: ${z.type.indices};
    ${Gt("a_indices",z,z.rank-2,T.rank,"batch_indices")}
    ${z.indicesSet("a_indices",z.rank-2,0)}
    ${z.indicesSet("a_indices",z.rank-1,0)}
    let a_offset = ${z.indicesToOffset("a_indices")};

    var b_indices: ${E.type.indices};
    ${Gt("b_indices",E,E.rank-2,T.rank,"batch_indices")}
    ${E.indicesSet("b_indices",E.rank-2,0)}
    ${E.indicesSet("b_indices",E.rank-1,0)}
    let b_offset = ${E.indicesToOffset("b_indices")};
    var values: array<${A.type.value}, ${g}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${h}) {
      ${U()}
    }
    for (var i = 0u; i < ${g}u; i++) {
      var value = values[i];
      ${F}
      ${L}
      let cur_indices = ${A.type.indices}(batch, row + i, col);
      let offset = ${A.indicesToOffset("cur_indices")};
      ${A.setByOffset(`offset / ${f}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${f};${h};${g};${a}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(_/64)},programUniforms:w}),getShaderSource:S}}}),Cu,Ou,Li,Vi,Au,Gi,Bu,wr,Hi=P(()=>{J(),re(),ne(),$t(),Wi(),Ui(),Cu=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Ou=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Li=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32)=>{let l=t[1]*e[1],d=t[0]*e[0],c=a?l:n,f=a?n:l,h=c/t[0],g=n/t[1];if(!((a&&h===4&&e[1]===4||!a&&(h===3||h===4))&&c%t[0]===0&&n%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${a} is true, innerElementSize ${h} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${h} must be 3 or 4.
  tileAWidth ${c} must be divisible by workgroupSize[0]${t[0]}. tileInner ${n} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${h}<${r}>, ${c/h}>, ${f}>;
var<workgroup> mm_Bsub: array<array<vec4<${r}>, ${d/e[0]}>, ${n}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${h};
const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${s?"0":"i32(globalId.z)"};
  ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${l};

  let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

  var acc: array<vec4<${r}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${g};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Cu(a,i)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${i?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${h===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Ou(a,h)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Vi=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Au=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Gi=(e,t,r="f32",i,a=!1,n=32,s=!1,u=32,l=!1)=>{let d=e[1]*t[1],c=e[0]*t[0],f=a?d:n,h=a?n:d;if(!(h%t[1]===0&&f%t[0]===0&&n%t[1]===0))throw new Error(`tileAHight ${h} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${f} must be divisible by workgroupSize[0]${t[0]}, tileInner ${n} must be divisible by workgroupSize[1]${t[1]}`);let g=h/t[1],_=f/t[0],b=n/t[1],k=l?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${d};
    let globalColStart = i32(workgroupId.x) * ${c};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${h}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${f}; inputCol = inputCol + ${t[0]}) {
          ${Vi(a,i)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${n}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${c}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${i?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${r}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${a?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${d};

let tileRowA = i32(localId.y) * ${g};
let tileColA = i32(localId.x) * ${_};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${g}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${_}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Vi(a,i)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${i?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${r}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Au(a)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${r}, ${f}>, ${h}>;
  var<workgroup> mm_Bsub : array<array<${r}, ${c}>, ${n}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${n};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${s?"0":"i32(globalId.z)"};
    ${i?`let batchIndices = ${i.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${s?`${Math.ceil(u/n)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${s?`i32(globalId.z) * ${u}`:"0"};

    var acc : array<array<${r}, colPerThread>, rowPerThread>;
    ${k}
  }
`},Bu=(e,t,r,i,a=!1)=>{let[n,s,u,l]=i,d=ke(i[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Se(e,d)} {
      var value = ${Se(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${s.type.indices};
        ${Gt("aIndices",s,s.rank-2,n.rank,"batchIndices")}
        ${s.indicesSet("aIndices",s.rank-2,"u32(row)")}
        ${s.indicesSet("aIndices",s.rank-1,"u32(colIn)")}
        value = ${s.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${n.type.indices}) -> ${Se(e,d)} {
      var value = ${Se(e,d)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${u.type.indices};
        ${Gt("bIndices",u,u.rank-2,n.rank,"batchIndices")}
        ${u.indicesSet("bIndices",u.rank-2,"u32(row)")}
        ${u.indicesSet("bIndices",u.rank-1,"u32(colIn)")}
        value = ${u.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Se(e,d)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${a?"bias[colIn]":`${Se(e,d)}(bias[row])`};`:""}
        ${r}
        ${l.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},wr=(e,t,r,i,a=!1,n)=>{let s=e[0].dims,u=e[1].dims,l=s.slice(0,-2),d=u.slice(0,-2),c=i?i.slice(0,-2):r.slice(0,-2),f=C.size(c),h=s[s.length-2],g=s[s.length-1],_=u[u.length-1],b=g%4===0&&_%4===0,k=h<=8?[4,1,1]:[4,4,1],v=[8,8,1],w=[Math.ceil(_/v[0]/k[0]),Math.ceil(h/v[1]/k[1]),Math.ceil(f/v[2]/k[2])],S=b?4:1,x=[...l,h,g/S],T=x.length,z=[...d,g,_/S],E=z.length,A=[f,h,_/S],N=[{type:6,data:h},{type:6,data:_},{type:6,data:g}];bt(t,N),N.push(...Z(c,x,z));let L=["rank","rank"],Y=e.length>2;Y&&(N.push(...Z(e[2].dims)),L.push("rank")),N.push(...Z(A));let F=ee=>{let U=c.length,ie=Ii("batchDims",e[0].dataType,U,1),Q=ke(e[0].dataType),V=B("a",e[0].dataType,T,S),oe=B("b",e[1].dataType,E,S),j=G("result",e[0].dataType,A.length,S),ue=[V,oe];if(Y){let ae=a?S:1;ue.push(B("bias",e[2].dataType,e[2].dims.length,ae))}let M=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];wt(t,M);let q=ke(j.type.tensor),te=yt(t,j.type.value,q),O=Bu(S,Y,te,[ie,V,oe,j],a);return`
  ${ee.registerUniforms(M).registerInternalVariables(ie).declareVariables(...ue,j)}
  ${O}
  ${b?Li(k,v,Q,ie):Gi(k,v,Q,ie)}
                   `};return{name:"MatMul",shaderCache:{hint:`${k};${t.activation};${b};${a}`,inputDependencies:L},getRunData:()=>({outputs:[{dims:n?n(r):r,dataType:e[0].dataType}],dispatchGroup:{x:w[0],y:w[1],z:w[2]},programUniforms:N}),getShaderSource:F}}}),Ru,Mu,ch=P(()=>{J(),Je(),ne(),$t(),Ui(),ph(),Hi(),Ru=(e,t,r,i,a=!1,n,s=4,u=4,l=4,d="f32")=>{let c=N=>{switch(N){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${d}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},f=N=>{switch(N){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${N} is not supported.`)}},h=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,g=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,_=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",k=e?"row":"col",v=e?"col":"row",w=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${k} / outWidth;
    let outCol = ${k} % outWidth;

    let WRow = ${v} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${v} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${v} % inChannels;
    var resData = ${Se(s,d)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${_} && xCol >= 0 && xCol < ${b}) {
      ${h}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${c(s)}
    }
    return resData;`,S=e?t&&i?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${w}
    }
    return ${Se(s,d)}(0.0);`:i&&r?`
    let col = colIn * ${s};
    ${w}`:`
    let col = colIn * ${s};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${w}
    }
    return ${Se(s,d)}(0.0);`,x=e?i&&r?f(u):`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${f(u)}
    }
    return ${Se(u,d)}(0.0);`:`
    let col = colIn * ${u};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${f(u)}
    }
    return ${Se(u,d)}(0.0);`,T=Se(l,d),z=Se(e?s:u,d),E=Se(e?u:s,d),A=yt(n,T,d);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${z} {
      ${e?S:x}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${E} {
      ${e?x:S}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${T}) {
      let col = colIn * ${l};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${g}
      ${Eu(a)}
      ${A}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Mu=(e,t,r,i,a,n,s,u,l)=>{let d=t.format==="NHWC",c=d?e[0].dims[3]:e[0].dims[1],f=r[0],h=d?r[2]:r[3],g=d?r[1]:r[2],_=d?r[3]:r[1],b=d&&(c%4===0||c%3===0)&&_%4===0,k=d?_:h*g,v=d?h*g:_,w=[8,8,1],S=i<=8?[4,1,1]:[4,4,1],x=[Math.ceil(k/w[0]/S[0]),Math.ceil(v/w[1]/S[1]),Math.ceil(f/w[2]/S[2])];le("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${x}`);let T=b?d&&c%4!==0?3:4:1,z=w[1]*S[1],E=w[0]*S[0],A=Math.max(w[0]*T,w[1]),N=i%z===0,L=a%E===0,Y=n%A===0,F=b?[T,4,4]:[1,1,1],ee=[{type:6,data:i},{type:6,data:a},{type:6,data:n},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];bt(t,ee),ee.push(...Z(e[0].dims,e[1].dims));let U=["rank","rank"];s&&(ee.push(...Z(e[2].dims)),U.push("rank")),ee.push(...Z(r));let ie=Q=>{let V=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];wt(t,V);let oe=b?4:1,j=ke(e[0].dataType),ue=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${j}>`:j}) {
        result[flatIndex] = ${b?`vec4<${j}>`:j}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${j}>`:j}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,M=B("x",e[0].dataType,e[0].dims.length,T===3?1:T),q=B("w",e[1].dataType,e[1].dims.length,oe),te=[M,q],O=G("result",e[0].dataType,r.length,oe);if(s){let ae=B("bias",e[2].dataType,e[2].dims.length,oe);te.push(ae),ue+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${j}>`:j} {
          return bias[coords.${d?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${zu("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Q.registerUniforms(V).declareVariables(...te,O)}
        ${ue}
        ${Ru(d,N,L,Y,s,t,F[0],F[1],F[2],j)}
        ${b?Li(S,w,j,void 0,!d,A):Gi(S,w,j,void 0,!d,A,!1,void 0,u)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${T};${b};${N};${L};${Y};${z};${E};${A}`,inputDependencies:U},getRunData:()=>({outputs:[{dims:l?l(r):r,dataType:e[0].dataType}],dispatchGroup:{x:x[0],y:x[1],z:x[2]},programUniforms:ee}),getShaderSource:ie}}}),Nu,Fi,Ht,Du,ji,Pu,Uu,qu,fh=P(()=>{J(),Je(),re(),ne(),$t(),Ui(),Nu=e=>{let t=1;for(let r=0;r<e.length;r++)t*=e[r];return t},Fi=e=>typeof e=="number"?[e,e,e]:e,Ht=(e,t)=>t<=1?e:e+(e-1)*(t-1),Du=(e,t,r,i=1)=>{let a=Ht(t,i);return Math.floor((e[0]*(r-1)-r+a)/2)},ji=(e,t,r,i,a)=>{a==null&&(a=Du(e,t[0],i[0]));let n=[0,0,0,r];for(let s=0;s<3;s++)e[s]+2*a>=t[s]&&(n[s]=Math.trunc((e[s]-t[s]+2*a)/i[s]+1));return n},Pu=(e,t,r,i,a,n,s,u,l,d)=>{let c,f,h,g;if(e==="VALID"&&(e=0),typeof e=="number"){c={top:e,bottom:e,left:e,right:e,front:e,back:e};let _=ji([t,r,i,1],[u,l,d],1,[a,n,s],e);f=_[0],h=_[1],g=_[2]}else if(Array.isArray(e)){if(!e.every((b,k,v)=>b===v[0]))throw Error(`Unsupported padding parameter: ${e}`);c={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let _=ji([t,r,i,1],[u,l,d],1,[a,n,s],e[0]);f=_[0],h=_[1],g=_[2]}else if(e==="SAME_UPPER"){f=Math.ceil(t/a),h=Math.ceil(r/n),g=Math.ceil(i/s);let _=(f-1)*a+u-t,b=(h-1)*n+l-r,k=(g-1)*s+d-i,v=Math.floor(_/2),w=_-v,S=Math.floor(b/2),x=b-S,T=Math.floor(k/2),z=k-T;c={top:S,bottom:x,left:T,right:z,front:v,back:w}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:c,outDepth:f,outHeight:h,outWidth:g}},Uu=(e,t,r,i,a,n=!1,s="channelsLast")=>{let u,l,d,c,f;if(s==="channelsLast")[u,l,d,c,f]=e;else if(s==="channelsFirst")[u,f,l,d,c]=e;else throw new Error(`Unknown dataFormat ${s}`);let[h,,g,_,b]=t,[k,v,w]=Fi(r),[S,x,T]=Fi(i),z=Ht(g,S),E=Ht(_,x),A=Ht(b,T),{padInfo:N,outDepth:L,outHeight:Y,outWidth:F}=Pu(a,l,d,c,k,v,w,z,E,A),ee=n?h*f:h,U=[0,0,0,0,0];return s==="channelsFirst"?U=[u,ee,L,Y,F]:s==="channelsLast"&&(U=[u,L,Y,F,ee]),{batchSize:u,dataFormat:s,inDepth:l,inHeight:d,inWidth:c,inChannels:f,outDepth:L,outHeight:Y,outWidth:F,outChannels:ee,padInfo:N,strideDepth:k,strideHeight:v,strideWidth:w,filterDepth:g,filterHeight:_,filterWidth:b,effectiveFilterDepth:z,effectiveFilterHeight:E,effectiveFilterWidth:A,dilationDepth:S,dilationHeight:x,dilationWidth:T,inShape:e,outShape:U,filterShape:t}},qu=(e,t,r,i,a,n)=>{let s=n==="channelsLast";s?e[0].dims[3]:e[0].dims[1];let u=[64,1,1],l={x:r.map((k,v)=>v)},d=[Math.ceil(Nu(l.x.map(k=>r[k]))/u[0]),1,1];le("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${d}`);let c=1,f=C.size(r),h=[{type:12,data:f},{type:12,data:i},{type:12,data:a},{type:12,data:t.strides},{type:12,data:t.dilations}];bt(t,h),h.push(...Z(e[0].dims,e[1].dims));let g=["rank","rank"],_=e.length===3;_&&(h.push(...Z(e[2].dims)),g.push("rank")),h.push(...Z(r));let b=k=>{let v=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:i.length},{name:"pads",type:"u32",length:a.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];wt(t,v);let w=1,S=ke(e[0].dataType),x=B("x",e[0].dataType,e[0].dims.length,c),T=B("W",e[1].dataType,e[1].dims.length,w),z=[x,T],E=G("result",e[0].dataType,r.length,w),A="";if(_){let Y=B("bias",e[2].dataType,e[2].dims.length,w);z.push(Y),A+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${S} {
          return bias[${s?H("coords",4,5):H("coords",1,5)}];
        }`}let N=Se(c,S),L=yt(t,N,S);return`
            ${A}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${x.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${T.getByIndices("aIndices")};
            }
          ${k.registerUniforms(v).declareVariables(...z,E)}
          ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${E.offsetToIndices("global_idx")};
              let batch = ${H("coords",0,x.rank)};
              let d2 = ${s?H("coords",x.rank-1,x.rank):H("coords",1,x.rank)};
              let xFRCCorner = vec3<u32>(${s?H("coords",1,x.rank):H("coords",2,x.rank)},
              ${s?H("coords",2,x.rank):H("coords",3,x.rank)},
              ${s?H("coords",3,x.rank):H("coords",4,x.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${s?H("uniforms.x_shape",1,x.rank):H("uniforms.x_shape",2,x.rank)};
              let xShapeZ = ${s?H("uniforms.x_shape",2,x.rank):H("uniforms.x_shape",3,x.rank)};
              let xShapeW = ${s?H("uniforms.x_shape",3,x.rank):H("uniforms.x_shape",4,x.rank)};
              let xShapeU = ${s?H("uniforms.x_shape",4,x.rank):H("uniforms.x_shape",1,x.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${s?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${s?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${s?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${s?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${_?"value = value + getBiasByOutputCoords(coords)":""};
              ${L}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${s};${c};${_}`,inputDependencies:g},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:d[0],y:d[1],z:d[2]},programUniforms:h}),getShaderSource:b}}}),Wu,Lu,hh=P(()=>{J(),re(),ne(),$t(),Wu=(e,t,r,i)=>{let a=e.length>2,n=a?"value += b[output_channel];":"",s=e[0].dims,u=e[1].dims,l=t.format==="NHWC",d=l?r[3]:r[1],c=d/t.group,f=l&&c>=4?be(d):1,h=C.size(r)/f,g=[{type:12,data:h},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:c}];bt(t,g),g.push(...Z(s,[u[0],u[1],u[2],u[3]/f]));let _=a?["rank","rank","rank"]:["rank","rank"];g.push(...Z([r[0],r[1],r[2],r[3]/f]));let b=k=>{let v=G("output",e[0].dataType,r.length,f),w=ke(v.type.tensor),S=yt(t,v.type.value,w),x=B("x",e[0].dataType,s.length),T=B("w",e[1].dataType,u.length,f),z=[x,T];a&&z.push(B("b",e[2].dataType,e[2].dims,f));let E=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];wt(t,E);let A=l?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${x.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${T.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${x.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${T.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${k.registerUniforms(E).declareVariables(...z,v)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${v.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${l?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${l?1:2}], outputIndices[${l?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${f} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${l?2:1}];

    var value: ${v.type.value} = ${v.type.value}(0);
    ${A}
    ${n}
    ${S}
    ${v.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${f}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:b}},Lu=(e,t,r,i)=>{let a=e.length>2,n=be(r[3]),s=be(r[2]),u=C.size(r)/n/s,l=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/n],d=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/n],c=[r[0],r[1],r[2],r[3]/n],f=[{type:12,data:u},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];bt(t,f),f.push(...Z(l,d,c));let h=(s-1)*t.strides[1]+d[1],g=_=>{let b=G("output",e[0].dataType,c.length,n),k=ke(b.type.tensor),v=yt(t,b.type.value,k),w=B("x",e[0].dataType,l.length,n),S=B("w",e[1].dataType,d.length,n),x=[w,S];a&&x.push(B("b",e[2].dataType,e[2].dims,n));let T=a?"value += b[output_channel];":"",z=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return wt(t,z),`
  ${_.registerUniforms(z).declareVariables(...x,b)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${s}u;
    let col = (index1 % width1) * ${s}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${w.type.value}, ${h}>;
    var values: array<${b.type.value}, ${s}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${d[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${h}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${w.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${w.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${d[1]}; w_width++) {
          let w_val = ${S.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${s}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${s}u; i++) {
      var value = values[i];
      ${T}
      ${v}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${n};${s};${h};${d[0]};${d[1]}`,inputDependencies:a?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:i?i(r):r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:f}),getShaderSource:g}}}),Vu,$r,Gu,vr,Ki,Zi,Hu,Fu,Qi,mh=P(()=>{re(),ch(),fh(),Hi(),hh(),$t(),Wi(),nt(),Vu=(e,t,r,i,a,n)=>{let s=e[0],u=e.slice(n?1:2,n?3:4),l=u.length,d=t[0],c=t.slice(2).map((h,g)=>h+(h-1)*(r[g]-1)),f=u.map((h,g)=>h+i[g]+i[g+l]).map((h,g)=>Math.floor((h-c[g]+a[g])/a[g]));return f.splice(0,0,s),f.splice(n?3:1,0,d),f},$r=[2,3,1,0],Gu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[1]*t.group;if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let a=e[0].dims.length-2;if(t.dilations.length!==a)throw new Error(`dilations should be ${a}D`);if(t.strides.length!==a)throw new Error(`strides should be ${a}D`);if(t.pads.length!==a*2)throw new Error(`pads should be ${a*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},vr=(e,t)=>{let r=e.kernelShape.slice();r.length<t[1].dims.length-2&&r.push(...Array(t[1].dims.length-2-r.length).fill(0));for(let n=2;n<t[1].dims.length;++n)r[n-2]===0&&(r[n-2]=t[1].dims[n]);let i=e.pads.slice();fr.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,r,i,e.format==="NHWC",e.autoPad);let a=Object.assign({},e);return Object.assign(a,{kernelShape:r,pads:i}),a},Ki=e=>{let t=Pi(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],a=e.dilations,n=e.group,s=e.kernel_shape,u=e.pads,l=e.strides,d=e.w_is_const();return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Zi=(e,t,r,i)=>{let a=r.format==="NHWC",n=Vu(t[0].dims,t[1].dims,r.dilations,r.pads,r.strides,a);if(r.group!==1){let z=[t[0]];if(a){let E=e.kernelCustomData.wT??e.compute(Be(t[1],$r),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=E),z.push(E)}else z.push(t[1]);t.length===3&&z.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&a&&t[1].dims[0]===r.group&&t[1].dims[1]===1&&r.dilations[0]===1&&r.dilations[1]===1?e.compute(Lu(z,r,n,i),{inputs:z}):e.compute(Wu(z,r,n,i),{inputs:z});return}let s=t.length===3,u=t[0].dims[a?1:2],l=t[0].dims[a?2:3],d=t[0].dims[a?3:1],c=t[1].dims[2],f=t[1].dims[3],h=n[a?1:2],g=n[a?2:3],_=n[a?3:1],b=a&&c===u&&f===l&&r.pads[0]===0&&r.pads[1]===0;if(b||c===1&&f===1&&r.dilations[0]===1&&r.dilations[1]===1&&r.strides[0]===1&&r.strides[1]===1&&r.pads[0]===0&&r.pads[1]===0){let z=n[0],E,A,N,L=[];if(a){let ee=e.kernelCustomData.wT??e.compute(Be(t[1],$r),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];if(r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=ee),b){let U=u*l*d;E=t[0].reshape([1,z,U]),A=ee.reshape([1,U,_]),N=[1,z,_]}else E=t[0].reshape([z,u*l,d]),A=ee.reshape([1,d,_]),N=[z,h*g,_];L.push(E),L.push(A)}else E=t[0].reshape([z,d,u*l]),A=t[1].reshape([1,_,d]),N=[z,_,h*g],L.push(A),L.push(E);s&&L.push(t[2]);let Y=N[2],F=L[0].dims[L[0].dims.length-1];Y<8&&F<8?e.compute(qi(L,r,n,N,a,i),{inputs:L}):e.compute(wr(L,r,n,N,a,i),{inputs:L});return}let k=!0,v=e.kernelCustomData.wT??e.compute(Be(t[1],$r),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=v);let w=[t[0],v];s&&w.push(t[2]);let S=a?h*g:_,x=a?_:h*g,T=c*f*d;e.compute(Mu(w,r,n,S,x,T,s,k,i),{inputs:w})},Hu=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=[0,t.pads[0],0,t.pads[1]],n=[1].concat(t.strides),s=[1].concat(t.dilations),u=[1].concat(t.kernelShape),l=vr({...t,pads:a,strides:n,dilations:s,kernelShape:u},i);Zi(e,i,l,d=>r?[d[0],d[2],d[3]]:[d[0],d[1],d[3]])},Fu=(e,t,r)=>{let i=r.format==="NHWC"?"channelsLast":"channelsFirst",a=vr(r,t),n=r.autoPad==="NOTSET"?r.pads:r.autoPad,s=Uu(t[0].dims,t[1].dims,r.strides,r.dilations,n,!1,i);e.compute(qu(t,a,s.outShape,[s.filterDepth,s.filterHeight,s.filterWidth],[s.padInfo.front,s.padInfo.top,s.padInfo.left],i))},Qi=(e,t)=>{if(Gu(e.inputs,t),e.inputs[0].dims.length===3)Hu(e,t);else if(e.inputs[0].dims.length===5)Fu(e,e.inputs,t);else{let r=vr(t,e.inputs);Zi(e,e.inputs,r)}}}),ju,gh=P(()=>{J(),Je(),re(),ne(),ju=(e,t,r)=>{let i=e.length>2,a=t.outputShape,n=t.format==="NHWC",s=t.group,u=e[1].dims,l=u[2]/s,d=u[3],c=n?be(l):1,f=n&&d===1&&l>=4,h=f?Math.floor(l/4)*4:Math.floor(l/c)*c,g=l-h,_=n?be(d):1,b=n?d===1?c:_:1,k=C.size(a)/_,v=[Math.ceil(k/64),1,1];le("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${v}`);let w=["rank","rank"],S=[t.strides[0],t.strides[1]],x=[t.kernelShape[n?1:2],t.kernelShape[n?2:3]],T=[t.dilations[0],t.dilations[1]],z=[x[0]+(t.dilations[0]<=1?0:(t.kernelShape[n?1:2]-1)*(t.dilations[0]-1)),x[1]+(t.dilations[1]<=1?0:(t.kernelShape[n?2:3]-1)*(t.dilations[1]-1))],E=[z[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),z[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],A=[{type:12,data:k},{type:12,data:S},{type:12,data:x},{type:12,data:T},{type:12,data:z},{type:6,data:E},{type:12,data:h},{type:12,data:l},{type:12,data:d},...Z(e[0].dims,e[1].dims)];i&&(A.push(...Z(e[2].dims)),w.push("rank")),A.push(...Z(a));let N=L=>{let Y=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:S.length},{name:"filter_dims",type:"u32",length:x.length},{name:"dilations",type:"u32",length:x.length},{name:"effective_filter_dims",type:"u32",length:z.length},{name:"pads",type:"i32",length:E.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],F=ke(e[0].dataType),ee=n?1:2,U=n?2:3,ie=n?3:1,Q=B("W",e[1].dataType,e[1].dims.length,b),V=B("Dy",e[0].dataType,e[0].dims.length,c),oe=[V,Q];i&&oe.push(B("bias",e[2].dataType,[a[ie]].length,_));let j=G("result",e[0].dataType,a.length,_),ue=()=>{let te="";if(f)c===4?te+=`
        let xValue = ${V.getByOffset("x_offset")};
        let wValue = ${Q.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:c===2?te+=`
          dotProd = dotProd + dot(vec4<${F}>(${V.getByOffset("x_offset")}, ${V.getByOffset("x_offset + 1u")}), vec4<${F}>(${Q.getByOffset("w_offset")}, ${Q.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:c===1&&(te+=`
          dotProd = dotProd + dot(vec4<${F}>(${V.getByOffset("x_offset")}, ${V.getByOffset("x_offset + 1u")}, ${V.getByOffset("x_offset + 2u")}, ${V.getByOffset("x_offset + 3u")}), vec4<${F}>(${Q.getByOffset("w_offset")}, ${Q.getByOffset("w_offset + 1u")}, ${Q.getByOffset("w_offset + 2u")}, ${Q.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(te+=`
                  let xValue = ${n?V.getByOffset(`${V.indicesToOffset(`${V.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c}`):V.get("batch","inputChannel","idyR","idyC")};
        `,c===1)te+=`
          let w_offset = ${Q.indicesToOffset(`${Q.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Q.getByOffset(`w_offset / ${b}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let O=0;O<c;O++)te+=`
            let wValue${O} = ${Q.getByOffset(`${Q.indicesToOffset(`${Q.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${O}, wOutChannel)`)} / ${b}`)};
            dotProd = dotProd + xValue[${O}] * wValue${O};`;return te},M=()=>{if(g===0)return"";if(!f)throw new Error(`packInputAs4 ${f} is not true.`);let te="";if(c===1){te+="dotProd = dotProd";for(let O=0;O<g;O++)te+=`
            + ${V.getByOffset(`x_offset + ${O}`)} * ${Q.getByOffset(`w_offset + ${O}`)}`;te+=";"}else if(c===2){if(g!==2)throw new Error(`Invalid inputChannelsRemainder ${g}.`);te+=`
          let xValue = ${V.getByOffset("x_offset")};
          let wValue = ${Q.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return te},q=`
            let outputIndices = ${j.offsetToIndices(`global_idx * ${_}`)};
            let batch = ${j.indicesGet("outputIndices",0)};
            let d1 = ${j.indicesGet("outputIndices",ie)};
            let r = ${j.indicesGet("outputIndices",ee)};
            let c = ${j.indicesGet("outputIndices",U)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${j.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${F}(dyRCorner) + ${F}(wR)) / ${F}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${F}(uniforms.Dy_shape[${ee}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${F}(dyCCorner) + ${F}(wC)) / ${F}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${F}(uniforms.Dy_shape[${U}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${f?`
                var x_offset = ${V.indicesToOffset(`${V.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${c};
                var w_offset = ${Q.indicesToOffset(`${Q.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${b};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${f?4:c}) {
                  ${ue()}
                  inputChannel = inputChannel + ${f?4:c};
                }
                ${M()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${i?` + bias[d1 / ${_}]`:""};
            ${j.setByOffset("global_idx","value")};
          `;return`
    ${L.registerUniforms(Y).declareVariables(...oe,j)}
      ${L.mainStart()}
      ${L.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${q}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${c}${b}${_}${f}${g}`,inputDependencies:w},getRunData:()=>({dispatchGroup:{x:v[0],y:v[1],z:v[2]},outputs:[{dims:r?r(a):a,dataType:e[0].dataType}],programUniforms:A}),getShaderSource:N}}}),Ku,Zu,Qu,Xi,Xu,Yu,Yi,Ju,el,_h=P(()=>{gh(),$t(),nt(),Ku=(e,t,r,i,a,n)=>(e-1)*t+r+(i-1)*a+1-n,Zu=(e,t,r,i,a)=>{let n=Math.floor(e/2);t==="SAME_UPPER"?(r[i]=n,r[a]=e-n):t==="SAME_LOWER"&&(r[i]=e-n,r[a]=n)},Qu=(e,t,r,i,a,n,s,u,l,d)=>{let c=e.length-2,f=d.length===0;l.length<c&&l.push(...Array(c-l.length).fill(0));let h=e[0],g=t[u?3:1]*a;for(let _=0,b=e.length-c-(u?1:0);_<c;++_,++b){let k=e[b],v=f?k*s[_]:d[_],w=Ku(k,s[_],n[_],t[b],r[_],v);Zu(w,i,n,_,_+c),f&&d.push(s[_]*(k-1)+l[_]+(t[b]-1)*r[_]+1-n[_]-n[_+c])}d.splice(0,0,h),d.splice(u?3:1,0,g)},Xi=(e,t)=>{let r=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((f,h)=>f*h,1)===0){r.length=0;for(let f=2;f<t[1].dims.length;++f)r.push(t[1].dims[f])}let i=e.format==="NHWC";r.splice(0,0,t[1].dims[0]),r.splice(i?3:1,0,t[1].dims[1]);let a=e.pads.slice(),n=e.outputShape.slice(),s=e.outputPadding.slice(),u=t[0].dims,l=e.dilations.slice();if(l.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;l=new Array(f).fill(1)}let d=e.strides.slice();if(d.reduce((f,h)=>f+h,0)===0){let f=t[0].dims.length-2;d=new Array(f).fill(1)}Qu(u,r,l,e.autoPad,e.group,a,d,i,s,n);let c=Object.assign({},e);return Object.assign(c,{kernelShape:r,pads:a,outputPadding:s,outputShape:n,dilations:l,strides:d}),c},Xu=e=>{let t=Pi(e),r=e.format,i=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],a=e.dilations,n=e.group,s=e.kernelShape,u=e.pads,l=e.strides,d=e.wIsConst(),c=e.outputPadding,f=e.outputShape;return{autoPad:i,format:r,dilations:a,group:n,kernelShape:s,outputPadding:c,outputShape:f,pads:u,strides:l,wIsConst:d,...t,cacheKey:`${e.format};${t.activation};`}},Yu=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let r=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],i=e[1].dims[0];if(r!==i)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let a=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==a))throw new Error("invalid bias");let n=e[0].dims.length-2;if(t.dilations.reduce((s,u)=>s+u,0)>0&&t.dilations.length!==n)throw new Error(`dilations should be ${n}D`);if(t.strides.reduce((s,u)=>s+u,0)>0&&t.strides.length!==n)throw new Error(`strides should be ${n}D`);if(t.pads.reduce((s,u)=>s+u,0)>0&&t.pads.length!==n*2)throw new Error(`pads should be ${n*2}D`);if(t.outputPadding.length!==n&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${n}D`);if(t.kernelShape.reduce((s,u)=>s+u,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Yi=(e,t,r,i)=>{let a=e.kernelCustomData.wT??e.compute(Be(t[1],[2,3,0,1]),{inputs:[1],outputs:[r.wIsConst?-2:-1]})[0];r.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=a);let n=[t[0],a];t.length===3&&n.push(t[2]),e.compute(ju(n,r,i),{inputs:n})},Ju=(e,t)=>{let r=t.format==="NHWC",i=[e.inputs[0].reshape(r?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&i.push(e.inputs[2]);let a=t.kernelShape;(a.length===0||a[0]===0)&&(a=[e.inputs[1].dims[2]]);let n=t.dilations;(n.length===0||n[0]===0)&&(n=[1]);let s=t.strides;(s.length===0||s[0]===0)&&(s=[1]);let u=t.pads;u.length===0&&(u=[0,0]),u=[0,u[0],0,u[1]],s=[1].concat(s),n=[1].concat(n),a=[1].concat(a);let l=t.outputPadding;l=[0].concat(l);let d=Xi({...t,pads:u,strides:s,dilations:n,kernelShape:a,outputPadding:l},i);Yi(e,i,d,c=>r?[c[0],c[2],c[3]]:[c[0],c[1],c[3]])},el=(e,t)=>{if(Yu(e.inputs,t),e.inputs[0].dims.length===3)Ju(e,t);else{let r=Xi(t,e.inputs);Yi(e,e.inputs,r)}}}),tl,rl,il,yh=P(()=>{J(),re(),we(),ne(),tl=(e,t,r,i)=>{let a=C.size(t),n=t.length,s=B("input",e,n),u=G("output",e,n),l=r.dataType===6?r.getInt32Array()[0]:Number(r.getBigInt64Array()[0]),d=C.normalizeAxis(l,n),c=f=>{let h=` i32(${s.indicesGet("inputIndices","uniforms.axis")}) `,g=H("uniforms.input_shape","uniforms.axis",n),_=i.reverse?h+(i.exclusive?" + 1":""):"0",b=i.reverse?g:h+(i.exclusive?"":" + 1");return`
                ${f.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(s,u)}
                ${f.mainStart()}
                  ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${u.offsetToIndices("global_idx")};
                  var sum = ${u.type.value}(0);
                  let first : i32 = ${_};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${s.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${s.getByIndices("inputIndices")};
                  }
                  ${u.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:[{type:12,data:a},{type:12,data:d},...Z(t,t)]}),getShaderSource:c}},rl=(e,t)=>{let r=e.inputs[0].dims,i=e.inputs[0].dataType,a=e.inputs[1];e.compute(tl(i,r,a,t),{inputs:[0]})},il=e=>{let t=e.exclusive===1,r=e.reverse===1;return ce({exclusive:t,reverse:r})}}),al,nl,sl,ol,ul,bh=P(()=>{J(),re(),we(),ne(),al=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},nl=(e,t,r,i)=>{let a=[];a.push(`fn perm(i: ${i.type.indices}) -> ${r.type.indices} {
    var a: ${r.type.indices};`);for(let n=0;n<t;++n)a.push(r.indicesSet("a",e[n],`i[${n}]`));return a.push("return a;}"),a.join(`
`)},sl=(e,t)=>{let r,i,a,n,s,u,l=t.format==="NHWC",d=t.blocksize,c=t.mode==="DCR";l?([r,i,a,n]=e.dims,s=c?[r,i,a,d,d,n/d**2]:[r,i,a,n/d**2,d,d],u=c?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([r,i,a,n]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],s=c?[r,d,d,n/d**2,i,a]:[r,n/d**2,d,d,i,a],u=c?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let f=e.reshape(s),h=f.dims.length,g=e.dataType,_=B("a",g,h),b=G("output",g,h),k=v=>`
  ${v.registerUniform("output_size","u32").declareVariables(_,b)}

  ${nl(u,h,_,b)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",_.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:v=>{let w=l?[r,i*d,a*d,n/d**2]:[r,n/d**2,i*d,a*d],S=C.size(w),x=f.dims,T=C.sortBasedOnPerm(x,u);return{outputs:[{dims:w,dataType:v[0].dataType}],dispatchGroup:{x:Math.ceil(S/64)},programUniforms:[{type:12,data:S},...Z(x,T)]}},getShaderSource:k}},ol=(e,t)=>{al(e.inputs),e.compute(sl(e.inputs[0],t))},ul=e=>ce({blocksize:e.blocksize,mode:e.mode,format:e.format})}),xr,Ft,Ji,ll,dl,pl,cl,ea,fl,hl,ml,wh=P(()=>{J(),re(),we(),ne(),xr="[a-zA-Z]|\\.\\.\\.",Ft="("+xr+")+",Ji="^"+Ft+"$",ll="("+Ft+",)*"+Ft,dl="^"+ll+"$",pl=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let r=this.symbolToIndices.get(e);r===void 0?r=[t]:r.push(t),this.symbolToIndices.set(e,r)}},cl=class{constructor(e,t){this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[r,i]=t.includes("->")?t.split("->",2):[t,""];if(!r.match(RegExp(dl)))throw new Error("Invalid LHS term");if(r.split(",").forEach((a,n)=>{let s=e[n].dims.slice();if(!a.match(RegExp(Ji)))throw new Error("Invalid LHS term");let u=this.processTerm(a,!0,s,n);this.lhs.push(u)}),i==="")i+=[...this.symbolToInfo.entries()].filter(([a,n])=>n.count===1||a==="...").map(([a])=>a).join("");else if(!i.match(RegExp(Ft)))throw new Error("Invalid RHS");i.match(RegExp(xr,"g"))?.forEach(a=>{if(a==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let n=this.symbolToInfo.get(a);if(n===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(n.dimValue)}}),this.rhs=this.processTerm(i,!1,this.outputDims)}addSymbol(e,t,r){let i=this.symbolToInfo.get(e);if(i!==void 0){if(i.dimValue!==t&&i.count!==1)throw new Error("Dimension mismatch");i.count++,i.inputIndices.push(r)}else i={count:1,dimValue:t,inputIndices:[r]};this.symbolToInfo.set(e,i)}processTerm(e,t,r,i=-1){let a=r.length,n=!1,s=[],u=0;if(!e.match(RegExp(Ji))&&!t&&e!=="")throw new Error("Invalid LHS term");let l=e.match(RegExp(xr,"g")),d=new pl(i);return l?.forEach((c,f)=>{if(c==="..."){if(n)throw new Error("Only one ellipsis is allowed per input term");n=!0;let h=a-l.length+1;if(h<0)throw new Error("Ellipsis out of bounds");if(s=r.slice(u,u+h),this.hasEllipsis){if(this.ellipsisDims.length!==s.length||this.ellipsisDims.toString()!==s.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=s;else throw new Error("Ellipsis must be specified in the LHS");for(let g=0;g<s.length;g++){let _=String.fromCharCode(48+g);d.addSymbol(_,f+g),this.addSymbol(_,r[u++],i)}}else d.addSymbol(c,f+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(c,r[u++],i)}),d}},ea=e=>e+"_max",fl=(e,t,r,i)=>{let a=e.map(d=>d.length).map((d,c)=>B(`input${c}`,t,d)),n=C.size(i),s=G("output",t,i.length),u=[...r.symbolToInfo.keys()].filter(d=>!r.rhs.symbolToIndices.has(d)),l=d=>{let c=[],f="var prod = 1.0;",h="var sum = 0.0;",g="sum += prod;",_=[],b=[],k=[],v=[],w=r.symbolToInfo.size===r.rhs.symbolToIndices.size;r.symbolToInfo.forEach((x,T)=>{if(r.rhs.symbolToIndices.has(T)){let z=r.rhs.symbolToIndices.get(T)?.[0];z!==void 0&&r.lhs.forEach((E,A)=>{if(x.inputIndices.includes(A)){let N=E.symbolToIndices.get(T);if(N===void 0)throw new Error("Invalid symbol error");N.forEach(L=>{c.push(`${a[A].indicesSet(`input${A}Indices`,L,s.indicesGet("outputIndices",z))}`)})}})}else r.lhs.forEach((z,E)=>{if(x.inputIndices.includes(E)){let A=z.symbolToIndices.get(T);if(A===void 0)throw new Error("Invalid symbol error");A.forEach(N=>{_.push(`${a[E].indicesSet(`input${E}Indices`,N,`${T}`)}`)}),v.push(`prod *= ${a[E].getByIndices(`input${E}Indices`)};`)}}),b.push(`for(var ${T}: u32 = 0; ${T} < uniforms.${ea(T)}; ${T}++) {`),k.push("}")});let S=w?[...c,`let sum = ${a.map((x,T)=>x.getByIndices(`input${T}Indices`)).join(" * ")};`]:[...c,h,...b,..._,f,...v,g,...k];return`
            ${d.registerUniforms(u.map(x=>({name:`${ea(x)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...a,s)}

            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${s.offsetToIndices("global_idx")};
            ${a.map((x,T)=>`var input${T}Indices: ${a[T].type.indices};`).join(`
`)}
            ${S.join(`
`)};
            ${s.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:r.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let d=u.filter(f=>r.symbolToInfo.has(f)).map(f=>({type:12,data:r.symbolToInfo.get(f)?.dimValue||0}));d.push({type:12,data:n});let c=e.map((f,h)=>[...Z(f)]).reduce((f,h)=>f.concat(h),d);return c.push(...Z(i)),{outputs:[{dims:i,dataType:t}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:c}},getShaderSource:l}},hl=(e,t)=>{let r=new cl(e.inputs,t.equation),i=r.outputDims,a=e.inputs.map((n,s)=>n.dims);e.compute(fl(a,e.inputs[0].dataType,r,i))},ml=e=>{let t=e.equation.replace(/\s+/g,"");return ce({equation:t})}}),gl,ta,_l,yl,bl,$h=P(()=>{J(),re(),ne(),gl=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=r.length<t.length?0:r.length-t.length,a=t.length<r.length?0:t.length-r.length;for(;i<r.length&&a<t.length;++i,++a)if(r[i]!==t[a]&&r[i]!==1&&t[a]!==1)throw new Error("Expand requires shape to be broadcastable to input")},ta=(e,t)=>{let r=e.length-t.length,i=[];for(let a=0;a<r;++a)i.push(e[a]);for(let a=0;a<t.length;++a)i.push(t[a]===1?e[a+r]:t[a]);return i},_l=(e,t)=>e.length>t.length?ta(e,t):ta(t,e),yl=e=>{let t=e[0].dims,r=Array.from(e[1].getBigInt64Array(),Number),i=_l(t,r),a=e[0].dataType,n=a===9||C.size(t)===1,s=a===9||t.length>0&&t[t.length-1]%4===0?4:1,u=n||i.length>0&&i[i.length-1]%4===0?4:1,l=Math.ceil(C.size(i)/u),d=f=>{let h=B("input",a,t.length,s),g=G("output",a,i.length,u),_;if(a===9){let b=(k,v,w="")=>`
          let outputIndices${v} = ${g.offsetToIndices(`outputOffset + ${v}u`)};
          let offset${v} = ${h.broadcastedIndicesToOffset(`outputIndices${v}`,g)};
          let index${v} = offset${v} / 4u;
          let component${v} = offset${v} % 4u;
          ${k}[${v}] = ${w}(${h.getByOffset(`index${v}`)}[component${v}]);
        `;_=`
        let outputOffset = global_idx * ${u};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${g.setByOffset("global_idx","data")}
      }`}else _=`
        let outputIndices = ${g.offsetToIndices(`global_idx * ${u}`)};
        let inputOffset = ${h.broadcastedIndicesToOffset("outputIndices",g)};
        let data = ${g.type.value}(${h.getByOffset(`inputOffset / ${s}`)});
        ${g.setByOffset("global_idx","data")}
      }`;return`
    ${f.registerUniform("vec_size","u32").declareVariables(h,g)}
    ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${_}`},c=[{type:12,data:l},...Z(t,i)];return{name:"Expand",shaderCache:{hint:`${i.length};${s}${u}`,inputDependencies:["rank"]},getShaderSource:d,getRunData:()=>({outputs:[{dims:i,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:c})}},bl=e=>{gl(e.inputs),e.compute(yl(e.inputs),{inputs:[0]})}}),wl,$l,vh=P(()=>{J(),re(),ne(),Di(),wl=e=>{let t=e[0].dataType,r=C.size(e[0].dims),i=C.size(e[1].dims),a=i%4===0,n=s=>{let u=B("x",t,[1],4),l=B("bias",t,[1],4),d=G("y",t,[1],4),c=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],f=g=>`
      let bias${g}_offset: u32 = (global_idx * 4 + ${g}) % uniforms.bias_size;
      let bias${g} = ${l.getByOffset(`bias${g}_offset / 4`)}[bias${g}_offset % 4];`,h=a?`
      let bias = ${l.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${f(0)}${f(1)}${f(2)}${f(3)}
      let bias = ${u.type.value}(bias0, bias1, bias2, bias3);`;return`${s.registerUniforms(c).declareVariables(u,l,d)}

    ${Mi(Ie(t))}

    ${s.mainStart(Ct)}
      ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${u.getByOffset("global_idx")};
      ${h}
      let x_in = x + bias;
      ${d.setByOffset("global_idx",Ni("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${a}`,inputDependencies:["type","type"]},getShaderSource:n,getRunData:s=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],programUniforms:[{type:12,data:Math.ceil(r/4)},{type:12,data:i}],dispatchGroup:{x:Math.ceil(r/Ct/4)}})}},$l=e=>{e.inputs.length<2||C.size(e.inputs[1].dims)===0?tu(e):e.compute(wl(e.inputs))}}),vl,xl,kl,Sl,xh=P(()=>{J(),re(),we(),ne(),vl=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},xl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=C.normalizeAxis(t.axis,a),s=r.slice(0);s.splice(n,1,...i);let u=r[n],l=e[0].dataType===9?4:1,d=Math.ceil(C.size(s)/l),c=[{type:12,data:d},{type:6,data:u},{type:12,data:n},...Z(e[0].dims,e[1].dims,s)],f=h=>{let g=B("data",e[0].dataType,e[0].dims.length,l),_=B("inputIndices",e[1].dataType,e[1].dims.length),b=G("output",e[0].dataType,s.length,l),k=w=>{let S=i.length,x=`var indicesIndices${w}  = ${_.type.indices}(0);`;for(let T=0;T<S;T++)x+=`${S>1?`indicesIndices${w}[${T}]`:`indicesIndices${w}`} = ${s.length>1?`outputIndices${w}[uniforms.axis + ${T}]`:`outputIndices${w}`};`;x+=`
          var idx${w} = ${_.getByIndices(`indicesIndices${w}`)};
          if (idx${w} < 0) {
            idx${w} = idx${w} + uniforms.axisDimLimit;
          }
          var dataIndices${w} : ${g.type.indices};
        `;for(let T=0,z=0;T<a;T++)T===n?(x+=`${a>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = u32(idx${w});`,z+=S):(x+=`${a>1?`dataIndices${w}[${T}]`:`dataIndices${w}`} = ${s.length>1?`outputIndices${w}[${z}]`:`outputIndices${w}`};`,z++);return x},v;if(e[0].dataType===9){let w=(S,x,T="")=>`
          let outputIndices${x} = ${b.offsetToIndices(`outputOffset + ${x}u`)};
          ${k(x)};
          let offset${x} = ${g.indicesToOffset(`dataIndices${x}`)};
          let index${x} = offset${x} / 4u;
          let component${x} = offset${x} % 4u;
          ${S}[${x}] = ${T}(${g.getByOffset(`index${x}`)}[component${x}]);
        `;v=`
        let outputOffset = global_idx * ${l};
        var value = vec4<u32>(0);
        ${w("value",0,"u32")}
        ${w("value",1,"u32")}
        ${w("value",2,"u32")}
        ${w("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else v=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${k("")};
      let value = ${g.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${h.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(g,_,b)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${v}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:f}},kl=e=>ce({axis:e.axis}),Sl=(e,t)=>{let r=e.inputs;vl(r),e.compute(xl(e.inputs,t))}}),Tl,Il,El,kh=P(()=>{J(),re(),ne(),Tl=(e,t,r,i,a,n,s,u,l)=>{let d=[{type:12,data:n},{type:12,data:i},{type:12,data:a},{type:12,data:r},{type:12,data:s},{type:12,data:u},{type:12,data:l}],c=[n];d.push(...Z(t.dims,c));let f=h=>{let g=B("indices_data",t.dataType,t.dims.length),_=G("input_slice_offsets_data",12,1,1),b=[g,_],k=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:a.length},{name:"sizes_from_slice_dims_data",type:"u32",length:r.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${h.registerUniforms(k).declareVariables(...b)}
  ${h.mainStart()}
    ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${a.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${r.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${a.length}_${r.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:c,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:d}),getShaderSource:f},{inputs:[t],outputs:[-1]})[0]},Il=(e,t)=>{let r=e.inputs,i=r[0].dims,a=r[0].dataType,n=r[1].dims,s=n[n.length-1],u=C.sizeToDimension(n,n.length-1),l=C.sizeFromDimension(i,t.batchDims+s),d=C.sizeToDimension(i,t.batchDims),c=C.sizeFromDimension(i,t.batchDims),f=u/d,h=new Array(s),g=l;for(let x=0;x<s;++x)h[s-1-x]=g,g*=i[t.batchDims+s-1-x];let _=Tl(e,r[1],h,t.batchDims,i,u,f,c,s),b=t.batchDims+s;if(b>i.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let k=n.slice(0,-1).concat(i.slice(b)),v=C.size(k),w=[{type:12,data:v},{type:12,data:l},...Z(r[0].dims,_.dims,k)],S=x=>{let T=B("data",r[0].dataType,r[0].dims.length),z=B("slice_offsets",12,_.dims.length),E=G("output",r[0].dataType,k.length);return`
          ${x.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(T,z,E)}
            ${x.mainStart()}
            ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:k,dataType:a}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:w}),getShaderSource:S},{inputs:[r[0],_]})},El=e=>({batchDims:e.batch_dims,cacheKey:""})}),zl,Cl,Ol,Al,Sh=P(()=>{J(),re(),we(),ne(),zl=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let r=C.normalizeAxis(t.quantizeAxis,e[0].dims.length),i=t.blockSize,a=e[0],n=e[2],s=e.length===4?e[3]:void 0;if(n.dims.length!==a.dims.length||!a.dims.map((u,l)=>l===r?Math.ceil(u/i)===n.dims[l]:u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(s){if(s.dataType!==a.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(s.dims.length!==n.dims.length||!s.dims.map((u,l)=>u===n.dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Cl=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r.length,n=C.normalizeAxis(t.gatherAxis,a),s=C.normalizeAxis(t.quantizeAxis,a),u=r.slice(0);u.splice(n,1,...i);let l=C.size(u),d=e[2].dataType,c=e[0].dataType===22,f=[{type:12,data:l},{type:12,data:s},{type:12,data:n},{type:12,data:t.blockSize},...Z(...e.map((g,_)=>g.dims),u)],h=g=>{let _=B("data",e[0].dataType,e[0].dims.length),b=B("inputIndices",e[1].dataType,e[1].dims.length),k=B("scales",e[2].dataType,e[2].dims.length),v=e.length>3?B("zeroPoint",e[3].dataType,e[3].dims.length):void 0,w=G("output",d,u.length),S=[_,b,k];v&&S.push(v);let x=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${g.registerUniforms(x).declareVariables(...S,w)}
        ${g.mainStart()}
        let output_indices = ${w.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${i.length>1?`
          for (var i: u32 = 0; i < ${i.length}; i++) {
            let index = ${w.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${w.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${_.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${w.indicesGet("output_indices","i")};
          ${_.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${r[n]};
        }
        ${_.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${u.length}; i++) {
          let index = ${w.indicesGet("output_indices",`i + ${i.length} - 1`)};
          ${_.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${_.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${_.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${k.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${k.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${k.getByIndices("scale_indices")};
        ${v?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${v.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${v.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${c?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Ie(d)}(quantized_data - zero_point) * scale;
        ${w.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((g,_)=>_!==1).map(g=>g.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(g,_)=>"rank")},getRunData:()=>({outputs:[{dims:u,dataType:d}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:h}},Ol=(e,t)=>{let r=e.inputs;zl(r,t),e.compute(Cl(e.inputs,t))},Al=e=>ce({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Bl,Rl,Ml,Nl,Th=P(()=>{J(),re(),we(),ne(),Bl=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Rl=(e,t)=>{let r=e[0].dims,i=e[0].dataType,a=r.length,n=e[1].dims,s=e[1].dataType,u=C.normalizeAxis(t.axis,a),l=r[u],d=n.slice(0),c=C.size(d),f=B("input",i,a),h=B("indicesInput",s,n.length),g=G("output",i,d.length),_=[{type:12,data:c},{type:6,data:l},{type:12,data:u}];return _.push(...Z(r,n,d)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:_}),getShaderSource:b=>`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(f,h,g)}
      ${b.mainStart()}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${g.offsetToIndices("global_idx")};

      var idx = ${h.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${f.type.indices}(outputIndices);
      ${f.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${f.getByIndices("inputIndices")};

      ${g.setByOffset("global_idx","value")};
  }`}},Ml=e=>ce({axis:e.axis}),Nl=(e,t)=>{let r=e.inputs;Bl(r),e.compute(Rl(e.inputs,t))}}),Dl,Pl,Ul,ql,Ih=P(()=>{J(),re(),ne(),Dl=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Pl=(e,t)=>{let r=e[0].dims.slice(),i=e[1].dims.slice(),[a,n,s]=Kn.getShapeOfGemmResult(r,t.transA,i,t.transB,e.length===3?e[2].dims:void 0),u=[a,n];if(!u)throw new Error("Can't use gemm on the given tensors");let l=16,d=Math.ceil(n/l),c=Math.ceil(a/l),f=!0,h=C.size(u),g=[{type:12,data:f?d:h},{type:12,data:a},{type:12,data:n},{type:12,data:s},{type:1,data:t.alpha},{type:1,data:t.beta}],_=["type","type"];e.length===3&&(g.push(...Z(e[2].dims)),_.push("rank")),g.push(...Z(u));let b=v=>{let w="";t.transA&&t.transB?w="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?w="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?w="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(w="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let S=t.alpha===1?"":"value *= uniforms.alpha;",x=B("a",e[0].dataType,e[0].dims),T=B("b",e[1].dataType,e[1].dims),z=x.type.value,E=null,A=[x,T];e.length===3&&(E=B("c",e[2].dataType,e[2].dims.length),A.push(E));let N=G("output",e[0].dataType,u.length);A.push(N);let L=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${v.registerUniforms(L).declareVariables(...A)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${z}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${w}
    }

    ${S}
    ${E!=null?`let cOffset = ${E.broadcastedIndicesToOffset("vec2(m, n)",N)}; value += ${z}(uniforms.beta) * ${E.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},k=v=>{let w=B("a",e[0].dataType,e[0].dims),S=B("b",e[1].dataType,e[1].dims),x=null,T=[w,S];e.length===3&&(x=B("c",e[2].dataType,e[2].dims.length),T.push(x));let z=G("output",e[0].dataType,u.length);T.push(z);let E=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],A="",N="";t.transA&&t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,A="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(N=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,A="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,A="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(N=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${w.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${S.type.value}(0);
      }
      `,A="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let L=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${v.registerUniforms(E).declareVariables(...T)}
  var<workgroup> tile_a: array<array<${w.type.storage}, ${l}>, ${l}>;
  var<workgroup> tile_b: array<array<${S.type.storage}, ${l}>, ${l}>;
  ${v.mainStart([l,l,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${l};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${l};
    let num_tiles = (uniforms.K - 1) / ${l} + 1;
    var k_start = 0u;
    var value = ${z.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${N}
      k_start = k_start + ${l};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${l}; k++) {
        ${A}
      }
      workgroupBarrier();
    }

    ${L}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${x!=null?`let cOffset = ${x.broadcastedIndicesToOffset("vec2(m, n)",z)}; value += ${z.type.value}(uniforms.beta) * ${x.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return f?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:d*c},programUniforms:g}),getShaderSource:k}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g}),getShaderSource:b}},Ul=e=>{let t=e.transA,r=e.transB,i=e.alpha,a=e.beta;return{transA:t,transB:r,alpha:i,beta:a,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},ql=(e,t)=>{Dl(e.inputs),e.compute(Pl(e.inputs,t))}}),Ke,et,vt,xt,Wl,Ll,Vl,Gl,Hl,Fl,jl,Kl,Zl,Ql,Eh=P(()=>{J(),re(),we(),ne(),[Ke,et,vt,xt]=[0,1,2,3],Wl=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Ll=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,Vl=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Gl=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Hl=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Fl=(e,t,r)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Ke}] = batch;
     indices[${et}] = channel;`+(()=>{switch(r.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${vt}] = u32(r);
            indices[${xt}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${vt}] = u32(clamp(r, 0, H - 1));
          indices[${xt}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${vt}] = gs_reflect(r, border[1], border[3]);
          indices[${xt}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${r.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,jl=(e,t,r)=>(()=>{switch(r.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Ke}], indices[${et}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Ke}], indices[${et}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Ke}], indices[${et}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Ke}], indices[${et}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Ke}], indices[${et}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Ke}], indices[${et}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${r.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Kl=(e,t)=>{let r=B("x",e[0].dataType,e[0].dims.length),i=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],a=B("grid",e[1].dataType,i.length,2),n=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(n=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Ke,et,vt,xt]=[0,3,1,2]);let s=G("output",e[0].dataType,n.length),u=r.type.value,l=C.size(n),d=[{type:12,data:l},...Z(e[0].dims,i,n)],c=f=>`
  ${f.registerUniform("output_size","u32").declareVariables(r,a,s)}
  ${Ll}
  ${Vl(u)}
  ${Gl(t)}
  ${Hl(t)}
  ${Fl(r,u,t)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${vt}]);
      let W_in = i32(uniforms.x_shape[${xt}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${s.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Ke}], indices[${vt}], indices[${xt}]);
      let nxy = ${a.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${jl(s,u,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:f=>{let h=C.size(n);return{outputs:[{dims:n,dataType:f[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:d}},getShaderSource:c}},Zl=(e,t)=>{Wl(e.inputs),e.compute(Kl(e.inputs,t))},Ql=e=>ce({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Ee,Xl,Yl,ra,Jl,jt,ed,td=P(()=>{J(),re(),we(),vi(),Bi(),ne(),nt(),Ee=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Xl=(e,t)=>{let r=e[0],i=Ee(e,1),a=Ee(e,2),n=Ee(e,3),s=Ee(e,4),u=Ee(e,5),l=Ee(e,6),d=Ee(e,7);if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=r.dims[0],f=r.dims[1],h=r.dims.length===3?r.dims[2]:t.numHeads*r.dims[4],g=f,_=0,b=0,k=Math.floor(h/t.numHeads);if(l&&d&&C.size(l.dims)&&C.size(d.dims)){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(l.dims[0]!==c||l.dims[1]!==t.numHeads||l.dims[3]!==k)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(d.dims[0]!==c||d.dims[1]!==t.numHeads||d.dims[3]!==k)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(l.dims[2]!==d.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');_=l.dims[2],b=l.dims[2]}else if(l&&C.size(l.dims)||d&&C.size(d.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v;if(i&&C.size(i.dims)>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(i.dims[2]!==r.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');v=2,g=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==k)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');v=5,g=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==k)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');v=0,g=i.dims[2]}}else{if(r.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(r.dims[2]!==t.numHeads||r.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}if(n&&C.size(n.dims)>0){if(n.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(i&&i.dims.length===5&&i.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let w=_+g,S=0;if(s&&C.size(s.dims)>0){S=8;let E=s.dims;throw E.length===1?E[0]===c?S=1:E[0]===3*c+2&&(S=3):E.length===2&&E[0]===c&&E[1]===w&&(S=5),S===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let x=!1,T=h;if(a&&C.size(a.dims)>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(g!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');T=a.dims[2]}else{if(g!==a.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');T=a.dims[1]*a.dims[3],x=!0}}let z=!1;if(s&&C.size(s.dims)>0)throw new Error("Key padding mask is not supported");if(u&&C.size(u.dims)>0){if(u.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(u.dims[0]!==c||u.dims[1]!==t.numHeads||u.dims[2]!==f||u.dims[3]!==w)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:c,sequenceLength:f,pastSequenceLength:_,kvSequenceLength:g,totalSequenceLength:w,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:h,vHiddenSize:T,headSize:k,vHeadSize:Math.floor(T/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:S,scale:t.scale,broadcastResPosBias:z,passPastInKv:x,qkvFormat:v}},Yl=e=>ce({...e}),ra=ce({perm:[0,2,1,3]}),Jl=(e,t,r,i,a,n,s)=>{let u=[i,a,n],l=C.size(u),d=[{type:12,data:l},{type:12,data:s},{type:12,data:n}],c=f=>{let h=G("qkv_with_bias",t.dataType,u),g=B("qkv",t.dataType,u),_=B("bias",r.dataType,u),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${f.registerUniforms(b).declareVariables(g,_,h)}
  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:u,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:d}),getShaderSource:c},{inputs:[t,r],outputs:[-1]})[0]},jt=(e,t,r,i,a,n,s,u)=>{let l=n;if(s&&C.size(s.dims)>0){if(i===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return l=Jl(e,n,s,t,i,r*a,u),l=l.reshape([t,i,r,a]),r===1||i===1?l:e.compute(Be(l,ra.perm),{inputs:[l],outputs:[-1]})[0]}else return n.dims.length===3&&(l=n.reshape([t,i,r,a])),r===1||i===1?l:e.compute(Be(l,ra.perm),{inputs:[l],outputs:[-1]})[0]},ed=(e,t)=>{let r=Xl(e.inputs,t),i=e.inputs[0],a=Ee(e.inputs,1),n=Ee(e.inputs,2),s=Ee(e.inputs,3),u=Ee(e.inputs,4),l=Ee(e.inputs,5),d=Ee(e.inputs,6),c=Ee(e.inputs,7);if(i.dims.length===5)throw new Error("Packed QKV is not implemented");if(a?.dims.length===5)throw new Error("Packed KV is not implemented");let f=a&&n&&a.dims.length===4&&n.dims.length===4,h=jt(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,i,s,0);if(f)return Lt(e,h,a,n,u,void 0,d,c,l,r);if(!a||!n)throw new Error("key and value must be provided");let g=jt(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.headSize,a,s,r.hiddenSize),_=jt(e,r.batchSize,r.numHeads,r.kvSequenceLength,r.vHeadSize,n,s,2*r.hiddenSize);Lt(e,h,g,_,u,void 0,d,c,l,r)}}),rd,id,ad,nd,ia,sd,od,ud=P(()=>{J(),re(),we(),ne(),rd=e=>{if(!e||e.length<1)throw new Error("too few inputs")},id=(e,t)=>{let r=[],i=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(a=>r.push(Number(a))),i=r.length),ce({numOutputs:i,axis:t.axis,splitSizes:r})},ad=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${H("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,nd=e=>{let t=e.length,r=[];for(let i=0;i<t;++i){let a=e[i].setByIndices("indices","input[global_idx]");t===1?r.push(a):i===0?r.push(`if (output_number == ${i}u) { ${a} }`):i===t-1?r.push(`else { ${a} }`):r.push(`else if (output_number == ${i}) { ${a} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${r.join(`
`)}
      }`},ia=(e,t)=>{let r=e[0].dims,i=C.size(r),a=e[0].dataType,n=C.normalizeAxis(t.axis,r.length),s=new Array(t.numOutputs),u=B("input",a,r.length),l=new Array(t.numOutputs),d=[],c=[],f=0,h=[{type:12,data:i}];for(let _=0;_<t.numOutputs;_++){f+=t.splitSizes[_],l[_]=f;let b=r.slice();b[n]=t.splitSizes[_],c.push(b),s[_]=G(`output${_}`,a,b.length),d.push({dims:c[_],dataType:e[0].dataType})}h.push({type:12,data:l},...Z(r,...c));let g=_=>`
  ${_.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",l.length).declareVariables(u,...s)}
  ${ad(l.length)}
  ${nd(s)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${u.offsetToIndices("global_idx")};
    var index = ${u.indicesGet("indices",n)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${H("uniforms.size_in_split_axis","output_number - 1u",l.length)};
      ${u.indicesSet("indices",n,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:g,getRunData:()=>({outputs:d,dispatchGroup:{x:Math.ceil(i/64)},programUniforms:h})}},sd=(e,t)=>{rd(e.inputs);let r=e.inputs.length===1?t:id(e.inputs,t);e.compute(ia(e.inputs,r),{inputs:[0]})},od=e=>{let t=e.axis,r=e.splitSizes,i=e.numOutputs<0?r.length:e.numOutputs;if(i!==r.length)throw new Error("numOutputs and splitSizes lengh must be equal");return ce({axis:t,numOutputs:i,splitSizes:r})}}),ld,kr,dd,pd=P(()=>{J(),re(),we(),ne(),ld=(e,t)=>{let[r,i,a,n]=e,{numHeads:s,rotaryEmbeddingDim:u}=t;if(r.dims.length!==3&&r.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${r.dims.length}`);if(!C.areEqual(i.dims,[])&&!C.areEqual(i.dims,[1])&&i.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${i.dims.length}`);if(a.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${a.dims.length}`);if(n.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${n.dims.length}`);if(!C.areEqual(a.dims,n.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(u>0&&s===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let l=r.dims[0],d=r.dims[r.dims.length-2],c=a.dims[0],f=C.sizeFromDimension(r.dims,1)/d,h=u===0?a.dims[1]*2:f/s;if(u>h)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(i.dims.length===2){if(l!==i.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${i.dims[0]}`);if(d!==i.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${i.dims[1]}`)}if(h/2!==a.dims[1]&&u/2!==a.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${a.dims[1]}`);if(d>c)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},kr=(e,t)=>{let{interleaved:r,numHeads:i,rotaryEmbeddingDim:a,scale:n}=t,s=e[0].dims[0],u=C.sizeFromDimension(e[0].dims,1),l=e[0].dims[e[0].dims.length-2],d=u/l,c=e[2].dims[1],f=a===0?c*2:d/i,h=new Array(s,l,d/f,f-c),g=C.computeStrides(h),_=[{type:1,data:n},{type:12,data:h},{type:12,data:g},...e[0].dims.length===3?new Array({type:12,data:[u,d,f,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[u,f,l*f,1]}):[],...Z(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=k=>{let v=B("input",e[0].dataType,e[0].dims.length),w=B("position_ids",e[1].dataType,e[1].dims.length),S=B("cos_cache",e[2].dataType,e[2].dims.length),x=B("sin_cache",e[3].dataType,e[3].dims.length),T=G("output",e[0].dataType,e[0].dims.length);return k.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:h.length},{name:"global_strides",type:"u32",length:g.length},{name:"input_output_strides",type:"u32",length:g.length}]),`
        ${k.declareVariables(v,w,S,x,T)}

        ${k.mainStart(Ct)}
          let half_rotary_emb_dim = uniforms.${S.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${w.broadcastedIndicesToOffset("bsnh.xy",G("",w.type.tensor,2))};
            let position_id =
                u32(${w.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${r});
            let j = i + select(half_rotary_emb_dim, 1, ${r});
            let re = ${v.getByOffset("i")} * ${S.get("position_id","bsnh[3]")} -
                ${v.getByOffset("j")} * ${x.get("position_id","bsnh[3]")};
            ${T.setByOffset("i","re")}
            let im = ${v.getByOffset("i")} * ${x.get("position_id","bsnh[3]")} +
                ${v.getByOffset("j")} * ${S.get("position_id","bsnh[3]")};
            ${T.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${T.setByOffset("k",v.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:ce({interleaved:r}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(h)/Ct)},programUniforms:_})}},dd=(e,t)=>{ld(e.inputs,t),e.compute(kr(e.inputs,t))}}),cd,fd,aa,hd,md,zh=P(()=>{we(),J(),Bi(),td(),ud(),nt(),pd(),ne(),cd=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let r=e[0],i=e[1],a=e[2],n=e[3],s=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(r.dims.length!==3&&r.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let u=!1,l=r.dims[0],d=r.dims[1],c=r.dims.length===3?u?r.dims[2]/3:r.dims[2]:t.numHeads*r.dims[4],f=d,h=0,g=!i||i.dims.length===0,_=Math.floor(g?c/(t.numHeads+2*t.kvNumHeads):c/t.numHeads);g&&(c=_*t.numHeads);let b=n&&n.dims.length!==0,k=s&&s.dims.length!==0;if(b&&n.dims.length===4&&n.dims[0]===l&&n.dims[1]!==t.kvNumHeads&&n.dims[2]===t.kvNumHeads&&n.dims[3]===_)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&k){if(n.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(s.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');h=n.dims[2]}else if(b||k)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let v=1;if(i&&i.dims.length>0){if(r.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(i.dims.length<3||i.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(r.dims[0]!==i.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(i.dims.length===3){if(r.dims[2]%i.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');f=i.dims[1]}else if(i.dims.length===5){if(i.dims[2]!==t.numHeads||i.dims[3]!==2||i.dims[4]!==_)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(a)throw new Error('Expect "value" be none when "key" has packed kv format.');f=i.dims[1]}else{if(i.dims[1]!==t.numHeads||i.dims[3]!==_)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');f=i.dims[2]}}else{if(r.dims.length!==3&&r.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(r.dims.length===5&&(r.dims[2]!==t.numHeads||r.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');v=3}let w=0,S=!1,x=t.kvNumHeads?_*t.kvNumHeads:c;if(a&&a.dims.length>0){if(a.dims.length!==3&&a.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(r.dims[0]!==a.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(a.dims.length===3){if(f!==a.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');x=a.dims[2]}else{if(f!==a.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');x=a.dims[1]*a.dims[3],S=!0}}let T=e.length>4?e[5]:void 0;if(T&&T.dims.length!==1&&T.dims[0]!==l)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:l,sequenceLength:d,pastSequenceLength:h,kvSequenceLength:f,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:c,vHiddenSize:x,headSize:_,vHeadSize:Math.floor(x/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:w,scale:t.scale,broadcastResPosBias:!1,passPastInKv:S,qkvFormat:v}},fd=ce({perm:[0,2,1,3]}),aa=(e,t,r)=>{let i=t,a=r.kvNumHeads;return t.dims.length===3&&r.kvSequenceLength!==0&&(i=t.reshape([r.batchSize,r.kvSequenceLength,a,r.headSize]),i=e.compute(Be(i,fd.perm),{inputs:[i],outputs:[-1]})[0]),i},hd=(e,t,r,i)=>{let a=7,n=["type","type"],s=[e*t],u=e*t,l=[{type:12,data:u},{type:12,data:t},{type:12,data:e}],d=c=>{let f=B("seq_lens",r.dataType,r.dims),h=B("total_seq_lens",i.dataType,i.dims),g=G("pos_ids",a,s),_=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${c.registerUniforms(_).declareVariables(f,h,g)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${h.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${f.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${g.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${g.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:n},getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:l}),getShaderSource:d}},md=(e,t)=>{let r=cd(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(e.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let i=e.inputs[0],a=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,n=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,s=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,u=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,l=e.inputs.length>4?e.inputs[5]:void 0,d=e.inputs.length>5?e.inputs[6]:void 0,c=r.kvNumHeads?r.kvNumHeads:r.numHeads,f=ce({axis:2,numOutputs:3,splitSizes:[r.numHeads*r.headSize,c*r.headSize,c*r.headSize]}),[h,g,_]=!a&&!n?e.compute(ia([i],f),{inputs:[i],outputs:[-1,-1,-1]}):[i,a,n],b,k;if(t.doRotary){let x=e.compute(hd(r.batchSize,r.sequenceLength,l,d),{inputs:[l,d],outputs:[-1]})[0],T=e.inputs[7],z=e.inputs[8],E=ce({interleaved:t.rotaryInterleaved!==0,numHeads:r.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),A=[h,x,T,z],N=[-1];b=e.compute(kr(A,E),{inputs:A,outputs:N})[0],A.splice(0,1,g);let L=ce({interleaved:t.rotaryInterleaved!==0,numHeads:r.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});k=e.compute(kr(A,L),{inputs:A,outputs:N})[0]}let v=jt(e,r.batchSize,r.numHeads,r.sequenceLength,r.headSize,t.doRotary?b:h,void 0,0),w=aa(e,t.doRotary?k:g,r),S=aa(e,_,r);Lt(e,v,w,S,void 0,void 0,s,u,void 0,r,l,d)}}),na,gd,_d,yd,Ch=P(()=>{J(),re(),nt(),ne(),na=(e,t,r,i,a,n,s,u)=>{let l=be(n),d=l===1?"f32":`vec${l}f`,c=l===1?"vec2f":`mat2x${l}f`,f=a*s,h=64;f===1&&(h=256);let g=[a,s,n/l],_=[a,s,2],b=["rank","type","type"],k=[];k.push(...Z(g,_));let v=w=>{let S=B("x",t.dataType,3,l),x=B("scale",r.dataType,r.dims),T=B("bias",i.dataType,i.dims),z=G("output",1,3,2),E=[S,x,T,z];return`
  var<workgroup> workgroup_shared : array<${c}, ${h}>;
  const workgroup_size = ${h}u;
  ${w.declareVariables(...E)}
  ${w.mainStart(h)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${d}(0);
    var squared_sum = ${d}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${d}(${S.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${c}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${at("workgroup_shared[0][0]",l)} / f32(hight * ${l});
      let squared_sum_final = ${at("workgroup_shared[0][1]",l)} / f32(hight * ${l});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${u}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${l};${u};${h}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:_,dataType:1}],dispatchGroup:{x:f},programUniforms:k}),getShaderSource:v},{inputs:[t,r,i],outputs:[-1]})[0]},gd=(e,t,r)=>{let i=t[0].dims,a=i,n=2,s=i[0],u=i[1],l=C.sizeFromDimension(i,n),d=be(l),c=C.size(a)/d,f=na(e,t[0],t[1],t[2],s,l,u,r.epsilon),h=[s,u,l/d],g=[s,u],_=["type","none"],b=k=>{let v=B("x",t[0].dataType,h.length,d),w=B("scale_shift",1,g.length,2),S=G("output",t[0].dataType,h.length,d),x=[v,w,S];return`
  ${k.registerUniform("output_size","u32").declareVariables(...x)}
  ${k.mainStart()}
  ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${S.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${w.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${v.getByOffset("global_idx")} * ${S.type.value}(scale_shift.x) + ${S.type.value}(scale_shift.y);
      ${S.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${d}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},...Z(h,g,h)]}),getShaderSource:b},{inputs:[t[0],f]})},_d=(e,t,r)=>{let i=t[0].dims,a=i,n=i[0],s=i[i.length-1],u=C.sizeFromDimension(i,1)/s,l=be(s),d=C.size(a)/l,c=[{type:12,data:u},{type:12,data:Math.floor(s/l)}],f=["type","type"],h=!1,g=[0,i.length-1];for(let v=0;v<i.length-2;v++)h=h||i[v+1]!==1,g.push(v+1);h=h&&i[i.length-1]!==1;let _=h?e.compute(Be(e.inputs[0],g),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:i.length},(v,w)=>i[g[w]])),b=na(e,_,t[1],t[2],n,u,s,r.epsilon),k=v=>{let w=ke(t[0].dataType),S=l===1?"vec2f":`mat${l}x2f`,x=E=>{let A=E===0?"x":"y",N=l===1?"f32":`vec${l}f`;switch(l){case 1:return`${w}(${N}(scale.${A}))`;case 2:return`vec2<${w}>(${N}(scale[0].${A}, scale[1].${A}))`;case 4:return`vec4<${w}>(${N}(scale[0].${A}, scale[1].${A}, scale[2].${A}, scale[3].${A}))`;default:throw new Error(`Not supported compoents ${l}`)}},T=B("input",t[0].dataType,t[0].dims,l),z=G("output",t[0].dataType,a,l);return`
  @group(0) @binding(0) var<storage, read> input : array<${T.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${S}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${z.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${v.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${x(0)}, ${x(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${l}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:a,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c}),getShaderSource:k},{inputs:[t[0],b]})},yd=(e,t)=>{t.format==="NHWC"?_d(e,e.inputs,t):gd(e,e.inputs,t)}}),bd,wd,$d,Oh=P(()=>{J(),re(),ne(),bd=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},wd=(e,t,r)=>{let i=t.simplified,a=e[0].dims,n=e[1],s=!i&&e[2],u=a,l=C.normalizeAxis(t.axis,a.length),d=C.sizeToDimension(a,l),c=C.sizeFromDimension(a,l),f=C.size(n.dims),h=s?C.size(s.dims):0;if(f!==c||s&&h!==c)throw new Error(`Size of X.shape()[axis:] == ${c}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${f} and bias size of ${h}`);let g=[];for(let T=0;T<a.length;++T)T<l?g.push(a[T]):g.push(1);let _=be(c),b=["type","type"],k=[{type:12,data:d},{type:1,data:c},{type:12,data:Math.floor(c/_)},{type:1,data:t.epsilon}];s&&b.push("type");let v=r>1,w=r>2,S=T=>{let z=ke(e[0].dataType),E=[B("x",e[0].dataType,e[0].dims,_),B("scale",n.dataType,n.dims,_)];s&&E.push(B("bias",s.dataType,s.dims,_)),E.push(G("output",e[0].dataType,u,_)),v&&E.push(G("mean_data_output",1,g)),w&&E.push(G("inv_std_output",1,g));let A=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${T.registerUniforms(A).declareVariables(...E)}
  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Ti("f32",_)};
    var mean_square_vector = ${Ti("f32",_)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Ot(z,_,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${at("mean_vector",_)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${at("mean_square_vector",_)} / uniforms.norm_size ${i?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Ot(z,_,"x[j + offset]")};
      let f32scale = ${Ot(z,_,"scale[j]")};
      output[j + offset] = ${E[0].type.value}((f32input ${i?"":"- mean"}) * inv_std_dev * f32scale
        ${s?`+ ${Ot(z,_,"bias[j]")}`:""}
      );
    }

    ${v?"mean_data_output[global_idx] = mean":""};
    ${w?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},x=[{dims:u,dataType:e[0].dataType}];return v&&x.push({dims:g,dataType:1}),w&&x.push({dims:g,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${_};${r};${i}`,inputDependencies:b},getRunData:()=>({outputs:x,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:k}),getShaderSource:S}},$d=(e,t)=>{bd(e.inputs),e.compute(wd(e.inputs,t,e.outputCount))}}),vd,xd,Ah=P(()=>{re(),Wi(),Hi(),vd=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},xd=e=>{vd(e.inputs);let t=zt.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let r=t[t.length-1],i=e.inputs[0].dims[e.inputs[0].dims.length-1];if(r<8&&i<8)e.compute(qi(e.inputs,{activation:""},t));else{let a=t[t.length-2],n=C.size(e.inputs[0].dims.slice(0,-2)),s=C.size(e.inputs[1].dims.slice(0,-2));if(n!==1&&a===1&&s===1){let u=e.inputs[0].reshape([1,n,i]),l=e.inputs[1].reshape([1,i,r]),d=[1,n,r],c=[u,l];e.compute(wr(c,{activation:""},t,d),{inputs:c})}else e.compute(wr(e.inputs,{activation:""},t))}}}),kd,Sd,Td,Id,Ed,Bh=P(()=>{J(),re(),we(),ne(),kd=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let r=e[0],i=r.dims.length;if(r.dims[i-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let a=Math.floor((t.k+t.blockSize-1)/t.blockSize),n=t.blockSize/8*t.bits,s=e[1];if(!C.areEqual(s.dims,[t.n,a,n]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let u=e[2].dims;if(C.size(u)!==t.n*a)throw new Error("scales input size error.");if(e.length===4){let l=e[3].dims,d=t.bits>4?t.n*a:t.n*Math.floor((a+1)/2);if(C.size(l)!==d)throw new Error("zeroPoints input size error.")}},Sd=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=C.size(u),d=e[1].dims[2]/4,c=e[0].dataType,f=be(t.k),h=be(d),g=be(s),_=u.concat([a,s]),b=a>1&&s/g%2===0?2:1,k=C.size(_)/g/b,v=64,w=[],S=[l,a,n/f],x=C.convertShape(e[1].dims).slice();x.splice(-1,1,d/h),w.push(...Z(S)),w.push(...Z(x)),w.push(...Z(e[2].dims)),e.length===4&&w.push(...Z(C.convertShape(e[3].dims)));let T=[l,a,s/g];w.push(...Z(T));let z=E=>{let A=S.length,N=B("a",e[0].dataType,A,f),L=B("b",12,x.length,h),Y=B("scales",e[2].dataType,e[2].dims.length),F=[N,L,Y],ee=e.length===4?B("zero_points",12,e[3].dims.length):void 0;ee&&F.push(ee);let U=T.length,ie=G("output",e[0].dataType,U,g),Q=ke(e[0].dataType),V=(()=>{switch(f){case 1:return`array<${Q}, 8>`;case 2:return`mat4x2<${Q}>`;case 4:return`mat2x4<${Q}>`;default:throw new Error(`${f}-component is not supported.`)}})(),oe=()=>{let M=`
          // reuse a data
            var input_offset = ${N.indicesToOffset(`${N.type.indices}(batch, row, word_offset)`)};
            var a_data: ${V};
            for (var j: u32 = 0; j < ${8/f}; j++) {
              a_data[j] = ${N.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let q=0;q<g*b;q++)M+=`
            b_value = ${h===1?`b${q}_data`:`b${q}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${V}(${Array.from({length:4},(te,O)=>`${Q}(b_value_lower[${O}]), ${Q}(b_value_upper[${O}])`).join(", ")});
            b_dequantized_values = ${f===1?`${V}(${Array.from({length:8},(te,O)=>`(b_quantized_values[${O}] - ${ee?`zero_point${q}`:"zero_point"}) * scale${q}`).join(", ")});`:`(b_quantized_values - ${V}(${Array(8).fill(`${ee?`zero_point${q}`:"zero_point"}`).join(",")})) * scale${q};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(q/g)}]${g>1?`[${q%g}]`:""} += ${Array.from({length:8/f},(te,O)=>`${f===1?`a_data[${O}] * b_dequantized_values[${O}]`:`dot(a_data[${O}], b_dequantized_values[${O}])`}`).join(" + ")};
          `;return M},j=()=>{let M=`
            var col_index = col * ${g};
            ${ee?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Q}(8);`}
            `;for(let q=0;q<g*b;q++)M+=`
            let scale${q} = ${Y.getByOffset("col_index * nBlocksPerCol + block")};
            ${ee?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${ee.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${q} = ${Q}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return M},ue=()=>{let M=`col_index = col * ${g};`;for(let q=0;q<g*b;q++)M+=`
            let b${q}_data = ${L.getByIndices(`${L.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return M+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${V};
            var b_dequantized_values: ${V};`,M};return`
        var<workgroup> workgroup_shared: array<${ie.type.value}, ${b*v}>;
        ${E.declareVariables(...F,ie)}
        ${E.mainStart([v,1,1])}
          let output_indices = ${ie.offsetToIndices(`(global_idx / ${v}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${v}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/f};
            ${j()}
            for (var word: u32 = 0; word < ${d}; word += ${h}) {
              ${ue()}
              for (var i: u32 = 0; i < ${h}; i++) {
                ${oe()}
                word_offset += ${8/f};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${ie.type.value} = ${ie.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${v}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${ie.setByIndices(`${ie.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${f};${h};${g};${b};${v}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:_,dataType:c}],dispatchGroup:{x:k},programUniforms:w}),getShaderSource:z}},Td=(e,t)=>{let r=e[0].dims,i=r.length,a=r[i-2],n=t.k,s=t.n,u=r.slice(0,i-2),l=C.size(u),d=e[1].dims[2]/4,c=e[0].dataType,f=be(t.k),h=be(d),g=u.concat([a,s]),_=128,b=s%8===0?8:s%4===0?4:1,k=_/b,v=k*h*8,w=v/f,S=v/t.blockSize,x=C.size(g)/b,T=[],z=[l,a,n/f],E=C.convertShape(e[1].dims).slice();E.splice(-1,1,d/h),T.push(...Z(z)),T.push(...Z(E)),T.push(...Z(e[2].dims)),e.length===4&&T.push(...Z(C.convertShape(e[3].dims)));let A=[l,a,s];T.push(...Z(A));let N=L=>{let Y=z.length,F=B("a",e[0].dataType,Y,f),ee=B("b",12,E.length,h),U=B("scales",e[2].dataType,e[2].dims.length),ie=[F,ee,U],Q=e.length===4?B("zero_points",12,e[3].dims.length):void 0;Q&&ie.push(Q);let V=A.length,oe=G("output",e[0].dataType,V),j=ke(e[0].dataType),ue=()=>{switch(f){case 1:return`
          let a_data0 = vec4<${j}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${j}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${j}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${j}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${f}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${F.type.value}, ${w}>;
        var<workgroup> inter_results: array<array<${oe.type.value}, ${k}>, ${b}>;
        ${L.declareVariables(...ie,oe)}
        ${L.mainStart([k,b,1])}
          let output_indices = ${oe.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${S} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${w};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${w}; a_offset += ${_})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${F.getByIndices(`${F.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${F.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${S} + local_id.x;
            ${Q?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Q.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${j}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${j}(8);`}
            let scale = ${U.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${ee.getByIndices(`${ee.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/f};
            for (var i: u32 = 0; i < ${h}; i++) {
              ${ue()}
              let b_value = ${h===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${j}>(${Array.from({length:4},(M,q)=>`${j}(b_value_lower[${q}]), ${j}(b_value_upper[${q}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${j}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(M,q)=>`${`dot(a_data${q}, b_dequantized_values[${q}])`}`).join(" + ")};
              word_offset += ${8/f};
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${oe.type.value} = ${oe.type.value}(0);
            for (var b = 0u; b < ${k}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${oe.setByIndices(`${oe.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${f};${h};${k};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:g,dataType:c}],dispatchGroup:{x},programUniforms:T}),getShaderSource:N}},Id=(e,t)=>{kd(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Td(e.inputs,t)):e.compute(Sd(e.inputs,t))},Ed=e=>ce(e)}),zd,Cd,Od,Ad,Bd,Rd,Md,Nd,Dd,Rh=P(()=>{J(),re(),ne(),zd=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Cd=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
            k = i32(${e.indicesGet("indices",a)}) - ${H("uniforms.pads",a,r)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${H("uniforms.x_shape",a,t)})) {
              break;
            }
            offset += k * i32(${H("uniforms.x_strides",a,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${i}
            value = x[offset];
          }
      `},Od=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${H("uniforms.pads",a,r)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${H("uniforms.x_shape",a,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${H("uniforms.x_shape",a,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${H("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Ad=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${H("uniforms.pads",a,r)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${H("uniforms.x_shape",a,t)})) {
                  k = i32(${H("uniforms.x_shape",a,t)}) - 1;
                }
                offset += k * i32(${H("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Bd=(e,t,r)=>{let i="";for(let a=t-1;a>=0;--a)i+=`
                k = i32(${e.indicesGet("indices",a)}) - ${H("uniforms.pads",a,r)};
                if (k < 0)  {
                  k += i32(${H("uniforms.x_shape",a,t)}]);
                }
                if (k >= i32(${H("uniforms.x_shape",a,t)})) {
                  k -= i32(${H("uniforms.x_shape",a,t)});
                }
                offset += k * i32(${H("uniforms.x_strides",a,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${i}
              value = x[offset];
          `},Rd=(e,t,r)=>{switch(r.mode){case 0:return Cd(e,t,r.pads.length);case 1:return Od(e,t,r.pads.length);case 2:return Ad(e,t,r.pads.length);case 3:return Bd(e,t,r.pads.length);default:throw new Error("Invalid mode")}},Md=(e,t)=>{let r=C.padShape(e[0].dims.slice(),t.pads),i=e[0].dims,a=C.size(r),n=[{type:12,data:a},{type:6,data:t.pads}],s=e.length>=3&&e[2].data;t.mode===0&&n.push({type:s?e[2].dataType:1,data:t.value}),n.push(...Z(e[0].dims,r));let u=["rank"],l=d=>{let c=G("output",e[0].dataType,r.length),f=B("x",e[0].dataType,i.length),h=f.type.value,g=Rd(c,i.length,t),_=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&_.push({name:"constant_value",type:s?h:"f32"}),`
            ${d.registerUniforms(_).declareVariables(f,c)}
            ${d.mainStart()}
            ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${c.offsetToIndices("global_idx")};

            var value = ${h}(0);
            ${g}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${s}`,inputDependencies:u},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(C.size(r)/64)},programUniforms:n}),getShaderSource:l}},Nd=(e,t)=>{if(e.length>1){let r=e[1].getBigInt64Array(),i=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,a=e[0].dims.length,n=new Int32Array(2*a).fill(0);if(e.length>=4){let u=e[3].getBigInt64Array();for(let l=0;l<u.length;l++)n[Number(u[l])]=Number(r[l]),n[Number(u[l])+a]=Number(r[l+u.length])}else r.forEach((u,l)=>n[Number(l)]=Number(u));let s=[];return n.forEach(u=>s.push(u)),{mode:t.mode,value:i,pads:s}}else return t},Dd=(e,t)=>{zd(e.inputs);let r=Nd(e.inputs,t);e.compute(Md(e.inputs,r),{inputs:[0]})}}),Kt,sa,oa,ua,la,Pd,Ud,da,pa,qd,Wd,ca,Ld,Vd,fa,Gd,Hd,Fd,jd,Mh=P(()=>{qe(),J(),re(),ne(),Kt=e=>{if(ge.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},sa=(e,t,r)=>{let i=t.format==="NHWC",a=e.dims.slice();i&&a.splice(1,0,a.pop());let n=Object.hasOwnProperty.call(t,"dilations"),s=t.kernelShape.slice(),u=t.strides.slice(),l=n?t.dilations.slice():[],d=t.pads.slice();fr.adjustPoolAttributes(r,a,s,u,l,d);let c=fr.computePoolOutputShape(r,a,u,l,s,d,t.autoPad),f=Object.assign({},t);n?Object.assign(f,{kernelShape:s,strides:u,pads:d,dilations:l,cacheKey:t.cacheKey}):Object.assign(f,{kernelShape:s,strides:u,pads:d,cacheKey:t.cacheKey});let h=c.slice();return h.push(h.splice(1,1)[0]),[f,i?h:c]},oa=(e,t)=>{let r=t.format==="NHWC",i=C.size(e),a=C.size(t.kernelShape),n=[{type:12,data:i},{type:12,data:a}],s=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let u=t.kernelShape[t.kernelShape.length-1],l=t.strides[t.strides.length-1],d=t.pads[t.pads.length/2-1],c=t.pads[t.pads.length-1],f=!!(d+c);n.push({type:12,data:u},{type:12,data:l},{type:12,data:d},{type:12,data:c}),s.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let h=!1;if(t.kernelShape.length===2){let g=t.kernelShape[t.kernelShape.length-2],_=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],k=t.pads[t.pads.length-2];h=!!(b+k),n.push({type:12,data:g},{type:12,data:_},{type:12,data:b},{type:12,data:k}),s.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[n,s,!0,f,h]}else{if(r)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let u=C.computeStrides(t.kernelShape);n.push({type:12,data:u},{type:12,data:t.pads},{type:12,data:t.strides}),s.push({name:"kernelStrides",type:"u32",length:u.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let l=t.pads.reduce((d,c)=>d+c);return[n,s,!!l,!1,!1]}},ua=(e,t,r,i,a,n,s,u,l,d,c,f)=>{let h=a.format==="NHWC",g=t.type.value,_=G("output",t.type.tensor,i);if(a.kernelShape.length<=2){let b="",k="",v="",w=r-(h?2:1);if(c?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${w}] < 0 || xIndices[${w}]
                      >= uniforms.x_shape[${w}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${w}] = indices[${w}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${n}
                }`,a.kernelShape.length===2){let S=r-(h?3:2);f?k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${S}] < 0 || xIndices[${S}] >= uniforms.x_shape[${S}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:k=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${S}] = indices[${S}] * uniforms.sh - uniforms.phStart + j;
                `,v=`
              }
            `}return`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var value = ${g}(${u});
              var pad = 0;
              ${k}
              ${b}
              ${v}
              ${s}

              output[global_idx] = value;
            }`}else{if(h)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=a.kernelShape.length,k=a.pads.length,v="";return d?v=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${n}
              }`:v=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${n}
            `,`
            ${e.registerUniforms(l).declareVariables(t,_)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${_.offsetToIndices("global_idx")};
              var xIndices = ${_.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${g}(${u});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${H("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${H("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${r-b}u; j < ${r}u; j++) {
                  xIndices[j] = indices[j] * ${H("uniforms.strides",`j - ${r-b}u`,b)}
                    + offsets[j - ${r-b}u] - ${H("uniforms.pads","j - 2u",k)};
                  ${v}
              }
              ${s}

              output[global_idx] = value;
            }`}},la=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Pd=e=>`${la(e)};${e.countIncludePad}`,Ud=e=>`${la(e)};${e.storageOrder};${e.dilations}`,da=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),pa=(e,t,r,i)=>{let[a,n]=sa(t,i,r),s=B("x",t.dataType,t.dims.length),u=s.type.value,l="value += x_val;",d="";a.countIncludePad?d+=`value /= ${u}(uniforms.kernelSize);`:d+=`value /= ${u}(i32(uniforms.kernelSize) - pad);`;let[c,f,h,g,_]=oa(n,a);c.push(...Z(t.dims,n));let b=["rank"];return{name:e,shaderCache:{hint:`${i.cacheKey};${h};${g};${_}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(n)/64)},programUniforms:c}),getShaderSource:k=>ua(k,s,t.dims.length,n.length,a,l,d,0,f,h,g,_)}},qd=e=>{let t=e.count_include_pad!==0,r=da(e);if(r.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let i={countIncludePad:t,...r,cacheKey:""};return{...i,cacheKey:Pd(i)}},Wd=(e,t)=>{Kt(e.inputs),e.compute(pa("AveragePool",e.inputs[0],!1,t))},ca={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Ld=e=>{let t=e.format;return{format:t,...ca,cacheKey:t}},Vd=(e,t)=>{Kt(e.inputs),e.compute(pa("GlobalAveragePool",e.inputs[0],!0,t))},fa=(e,t,r,i)=>{let[a,n]=sa(t,i,r),s=`
      value = max(x_val, value);
    `,u="",l=B("x",t.dataType,t.dims.length),d=["rank"],[c,f,h,g,_]=oa(n,a);return c.push(...Z(t.dims,n)),{name:e,shaderCache:{hint:`${i.cacheKey};${h};${g};${_}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(C.size(n)/64)},programUniforms:c}),getShaderSource:b=>ua(b,l,t.dims.length,n.length,a,s,u,t.dataType===10?-65504:-1e5,f,h,g,_)}},Gd=(e,t)=>{Kt(e.inputs),e.compute(fa("MaxPool",e.inputs[0],!1,t))},Hd=e=>{let t=e.storage_order,r=e.dilations,i=da(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(i.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let a={storageOrder:t,dilations:r,...i,cacheKey:""};return{...a,cacheKey:Ud(a)}},Fd=e=>{let t=e.format;return{format:t,...ca,cacheKey:t}},jd=(e,t)=>{Kt(e.inputs),e.compute(fa("GlobalMaxPool",e.inputs[0],!0,t))}}),Kd,Zd,Qd,Xd,Nh=P(()=>{J(),re(),we(),ne(),Kd=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[0].dataType===6&&e.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((r,i)=>r===e[2].dims[i]).reduce((r,i)=>r&&i,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((a,n)=>n===t.axis||a===e[0].dims[n]).reduce((a,n)=>a&&n,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let r=e[0].dims[t.axis],i=e[1].dims[t.axis];if(t.blockSize<Math.ceil(r/i)||t.blockSize>Math.ceil(r/(i-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Zd=(e,t)=>{let r=C.normalizeAxis(t.axis,e[0].dims.length),i=e[0].dataType,a=i===3,n=e[0].dims,s=e[1].dataType,u=C.size(n),l=i===3||i===2,d=l?[Math.ceil(C.size(e[0].dims)/4)]:e[0].dims,c=e[1].dims,f=e.length>2?e[2]:void 0,h=f?l?[Math.ceil(C.size(f.dims)/4)]:f.dims:void 0,g=c.length===0||c.length===1&&c[0]===1,_=g===!1&&c.length===1,b=be(u),k=g&&(!l||b===4),v=k?b:1,w=k&&!l?b:1,S=B("input",l?12:i,d.length,w),x=B("scale",s,c.length),T=f?B("zero_point",l?12:i,h.length):void 0,z=G("output",s,n.length,v),E=[S,x];T&&E.push(T);let A=[d,c];f&&A.push(h);let N=[{type:12,data:u/v},{type:12,data:r},{type:12,data:t.blockSize},...Z(...A,n)],L=Y=>{let F=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${Y.registerUniforms(F).declareVariables(...E,z)}
      ${Y.mainStart()}
          ${Y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${z.offsetToIndices("global_idx")};

          // Set input x
          ${l?`
            let input = ${S.getByOffset("global_idx / 4")};
            let x_vec = ${a?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${v===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${S.getByOffset("global_idx")};`};

          // Set scale input
          ${g?`let scale_value= ${x.getByOffset("0")}`:_?`
            let scale_index = ${z.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${x.getByOffset("scale_index")};`:`
            var scale_indices: ${x.type.indices} = output_indices;
            let index = ${x.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${x.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${x.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${T?g?l?`
                let zero_point_input = ${T.getByOffset("0")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${T.getByOffset("0")}`:_?l?`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${T.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${z.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${T.getByOffset("zero_point_index")};`:l?`
                let zero_point_offset = ${x.indicesToOffset("scale_indices")};
                let zero_point_input = ${T.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${a?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${T.getByIndices("scale_indices")};`:`let zero_point_value = ${l?a?"i32":"u32":S.type.value}(0);`};
      // Compute and write output
      ${z.setByOffset("global_idx",`${z.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:T?["rank","rank","rank"]:["rank","rank"]},getShaderSource:L,getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(u/v/64),y:1,z:1},programUniforms:N})}},Qd=(e,t)=>{Kd(e.inputs,t),e.compute(Zd(e.inputs,t))},Xd=e=>ce({axis:e.axis,blockSize:e.blockSize})}),Yd,Jd,ep,Dh=P(()=>{qe(),J(),ne(),Yd=(e,t,r)=>{let i=e===t,a=e<t&&r<0,n=e>t&&r>0;if(i||a||n)throw new Error("Range these inputs' contents are invalid.")},Jd=(e,t,r,i)=>{let a=Math.abs(Math.ceil((t-e)/r)),n=[a],s=a,u=[{type:12,data:s},{type:i,data:e},{type:i,data:r},...Z(n)],l=d=>{let c=G("output",i,n.length),f=c.type.value,h=[{name:"outputSize",type:"u32"},{name:"start",type:f},{name:"delta",type:f}];return`
        ${d.registerUniforms(h).declareVariables(c)}
        ${d.mainStart()}
        ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${f}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${i}`},getShaderSource:l,getRunData:()=>({outputs:[{dims:n,dataType:i}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:u})}},ep=e=>{let t=0,r=0,i=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],r=e.inputs[1].getInt32Array()[0],i=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],r=e.inputs[1].getFloat32Array()[0],i=e.inputs[2].getFloat32Array()[0]),ge.webgpu.validateInputContent&&Yd(t,r,i),e.compute(Jd(t,r,i,e.inputs[0].dataType),{inputs:[]})}}),tp,ha,ma,rp,ip,ap,Ph=P(()=>{J(),re(),we(),ne(),tp=(e,t,r,i)=>{if(e!=="none"&&i!=="i32"&&i!=="u32"&&i!=="f32")throw new Error(`Input ${i} is not supported with reduction ${e}.`);let a=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,n=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${r};`;case"add":return i==="i32"||i==="u32"?`atomicAdd(&${t}, bitcast<${i}>(${r}));`:`
              ${a}bitcast<${i}>(oldValue) + (${r})${n}`;case"max":return i==="i32"||i==="u32"?`atomicMax(&${t}, bitcast<${i}>(${r}));`:`
                ${a}max(bitcast<f32>(oldValue), (${r}))${n}`;case"min":return i==="i32"||i==="u32"?`atomicMin(&${t}, bitcast<${i}>(${r}));`:`${a}min(bitcast<${i}>(oldValue), (${r}))${n}`;case"mul":return`${a}(bitcast<${i}>(oldValue) * (${r}))${n}`;default:throw new Error(`Reduction ${e} is not supported.`)}},ha=(e,t)=>`${e===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${t?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${t?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,ma=(e,t,r)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${r?"global_idx":"idx"} + i];
        ${tp(e.reduction,"output[data_offset + i]","value",t)}
      }`,rp=(e,t)=>{let r=e[0].dims,i=e[1].dims,a=r,n=1,s=Math.ceil(C.size(i)/n),u=i[i.length-1],l=C.sizeFromDimension(r,u),d=C.sizeFromDimension(i,0)/u,c=[{type:12,data:s},{type:12,data:u},{type:12,data:l},...Z(e[1].dims,e[2].dims,a)],f=h=>{let g=B("indices",e[1].dataType,e[1].dims.length),_=B("updates",e[2].dataType,e[2].dims.length,n),b=t.reduction!=="none"&&t.reduction!==""?ls("output",e[0].dataType,a.length):G("output",e[0].dataType,a.length,n);return`
      ${h.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(g,_,b)}
      ${h.mainStart()}
        ${h.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${t.reduction==="none"}) {
    for (var i = 0; i < ${d}; i = i + 1) {
      for (var j = i + 1; j < ${d}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${t.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${d}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${ha(r.length,!1)}
      }
      ${ma(t,b.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${ha(r.length,!0)}
  }
  ${ma(t,b.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c}),getShaderSource:f}},ip=e=>ce({reduction:e.reduction}),ap=(e,t)=>{e.compute(rp(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),np,sp,op,ga,up,lp,dp,pp,cp,fp,hp,mp,_a,gp,_p,yp,bp,wp,$p,vp,Uh=P(()=>{J(),re(),we(),ne(),np=(e,t)=>{if(e.every(r=>r>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},sp=(e,t,r)=>{t.every(a=>a>=0&&a<r||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let i=new Array(r).fill(1);return t.forEach((a,n)=>i[a]=e[n]),i},op=(e,t,r,i,a,n)=>{let[s,u,l]=r>10?[1,2,3]:[-1,e.length>1?1:-1,-1],d=e[0].dims.length;if(s>0&&e.length>s&&e[s].dims.length>0)e[s].getFloat32Array().forEach(c=>n.push(c));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(u>0&&e.length>u&&e[u].dims.length===1&&e[u].dims[0]>0){if(e[u].getFloat32Array().forEach(c=>i.push(c)),i.length!==0&&i.length!==d&&r>=18&&i.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");np(i,t),t.axes.length>0&&sp(i,t.axes,d).forEach((c,f)=>i[f]=c)}if(l>0&&e.length>l&&e[l].dims.length===1&&e[l].dims[0]>0&&(e[l].getBigInt64Array().forEach(c=>a.push(Number(c))),a.length!==0&&a.length!==d&&r>=18&&a.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(i.length!==0&&i.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof i<"u"&&typeof a<"u"&&i.length>0&&a.length>d)throw new Error("Resize requires only of scales or sizes to be specified")},ga=(e,t,r,i)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${i}(big / (${r}));
  let fract = ${i}(big % (${r})) / ${i}(${r});
  return whole + fract;
`,up=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ga("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ga("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",lp=(e,t,r)=>`fn getNearestPixelFromOriginal(xOriginal: ${r}, isDownSample: bool) -> ${r} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";case"simple":default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",dp=(e,t,r)=>{let i=new Array(r).fill(0).concat(new Array(r).fill(1)),a=e.length===0?i:e.slice();return t.length>0?(t.forEach((n,s)=>{i[n]=a[s],i[s+r]=a[t.length+s]}),i):a},pp=(e,t,r,i)=>{let a=[];if(r.length>0)if(i.length>0){if(e.forEach(n=>a.push(n)),Math.max(...i)>e.length)throw new Error("axes is out of bound");i.forEach((n,s)=>a[n]=r[s])}else r.forEach(n=>a.push(n));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");a=e.map((n,s)=>Math.round(n*t[s]))}return a},cp=(e,t,r)=>{let i=(()=>{switch(r.keepAspectRatioPolicy){case"not_larger":return r.axes.length>0?Math.min(...r.axes.map(n=>t[n]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return r.axes.length>0?Math.max(...r.axes.map(n=>t[n]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${r.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let a=e.slice();return r.axes.length>0?(r.axes.forEach(n=>t[n]=i),r.axes.forEach(n=>a[n]=Math.round(e[n]*t[n]))):(t.fill(i,0,t.length),a.forEach((n,s)=>a[s]=Math.round(n*t[s]))),a},fp=(e,t,r,i,a)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${r.length}> {
      var original_indices: array<${e.type.value}, ${r.length}>;
      for (var i:u32 = 0; i < ${r.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${H("uniforms.scales","i",i)};
        var roi_low = ${H("uniforms.roi","i",a)};
        var roi_hi = ${H("uniforms.roi",`i + ${t.length}`,a)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${H("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${H("uniforms.output_shape","i",r.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,hp=(e,t,r,i,a,n,s)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${H("uniforms.scales","i",a)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${H("uniforms.roi","i",n)};
          var roi_hi = ${H("uniforms.roi",`i + ${r.length}`,n)};
          var input_shape_i = ${H("uniforms.input_shape","i",r.length)};
          var output_shape_i = ${H("uniforms.output_shape","i",i.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${s} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,mp=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${H("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,_a=(e,t,r,i)=>e.rank>i?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",r,"batch")};
`:"",gp=(e,t,r,i,a)=>{let[n,s,u,l]=r.length===2?[-1,0,1,-1]:[0,2,3,1],d=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${d} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(row, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(col, ${r[u]} - 1))`)};
      ${_a(e,l,n,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${d} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${d} = originalIndices[${s}];
      var col:${d} = originalIndices[${u}];
      ${i?`if (row < 0 || row > (${r[s]} - 1) || col < 0 || col > (${r[u]} - 1)) {
        return ${a};
      }`:""};
      row = max(0, min(row, ${r[s]} - 1));
      col = max(0, min(col, ${r[u]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${r.length>2?`u32(originalIndices[${l}])`:"0"};
      var batch: u32 =  ${r.length>2?`u32(originalIndices[${n}])`:"0"};
      var x11: ${d} = getInputValue(batch, channel, row1, col1);
      var x12: ${d} = getInputValue(batch, channel, row1, col2);
      var x21: ${d} = getInputValue(batch, channel, row2, col1);
      var x22: ${d} = getInputValue(batch, channel, row2, col2);
      var dx1: ${d} = abs(row - ${d}(row1));
      var dx2: ${d} = abs(${d}(row2) - row);
      var dy1: ${d} = abs(col - ${d}(col1));
      var dy2: ${d} = abs(${d}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},_p=(e,t,r,i,a,n,s,u,l,d)=>{let c=r.length===2,[f,h]=c?[0,1]:[2,3],g=e.type.value,_=b=>{let k=b===f?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${g} {
        var output_index = ${t.indicesGet("output_indices",b)};
        var originalIdx: ${g} = getOriginalCoordinateFromResizedCoordinate(output_index, ${a[b]},
        ${i[b]}, ${r[b]}, ${n[b]}, ${n[b]} + ${r.length});
        var fractOriginalIdx: ${g} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${u} && (originalIdx < 0 || originalIdx > (${r[b]} - 1))) {
          return ${l};
        }
        var data: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${g} = originalIdx + ${g}(i);
          if (${k} < 0 || ${k} >= ${r[b]}) {
            ${d?`coefs[i + 1] = 0.0;
                        continue;`:u?`return ${l};`:`${k} = max(0, min(${k}, ${r[b]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",b,`u32(${k})`)};
          data[i + 1] = ${b===f?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${_(f)};
    ${_(h)};
  fn getCubicInterpolationCoefs(s: ${g}) -> array<${g}, 4> {
    var absS = abs(s);
    var coeffs: array<${g}, 4> = array<${g}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${g} = 1.0 - absS;
    var twoMinusAbsS: ${g} = 2.0 - absS;
    var onePlusAbsS: ${g} = 1.0 + absS;
    coeffs[0] = ((${s} * onePlusAbsS - 5 * ${s}) * onePlusAbsS + 8 * ${s}) * onePlusAbsS - 4 * ${s};
    coeffs[1] = ((${s} + 2) * absS - (${s} + 3)) * absS * absS + 1;
    coeffs[2] = ((${s} + 2) * oneMinusAbsS - (${s} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${s} * twoMinusAbsS - 5 * ${s}) * twoMinusAbsS + 8 * ${s}) * twoMinusAbsS - 4 * ${s};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${g}, 4>, coefs: array<${g}, 4>) -> ${g} {
    var coefsSum: ${g} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${g} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},yp=(e,t,r,i,a)=>{let[n,s,u,l,d]=r.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],c=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${c} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",s,`max(0, min(depth, ${r[s]} - 1))`)};
      ${e.indicesSet("input_indices",u,`max(0, min(height, ${r[u]} - 1))`)};
      ${e.indicesSet("input_indices",l,`max(0, min(width, ${r[l]} - 1))`)};
      ${_a(e,d,n,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${c} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${c} = originalIndices[${s}];
      var height:${c} = originalIndices[${u}];
      var width:${c} = originalIndices[${l}];
      ${i?`if (depth < 0 || depth > (${r[s]} - 1) || height < 0 || height > (${r[u]} - 1) || width < 0 || (width > ${r[l]} - 1)) {
      return ${a};
        }`:""};

    depth = max(0, min(depth, ${r[s]} - 1));
      height = max(0, min(height, ${r[u]} - 1));
      width = max(0, min(width, ${r[l]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${r.length>3?`u32(originalIndices[${d}])`:"0"};
      var batch: u32 =  ${r.length>3?`u32(originalIndices[${n}])`:"0"};

      var x111: ${c} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${c} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${c} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${c} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${c} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${c} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${c} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${c} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${c} = abs(depth - ${c}(depth1));
      var dx2: ${c} = abs(${c}(depth2) - depth);
      var dy1: ${c} = abs(height - ${c}(height1));
      var dy2: ${c} = abs(${c}(height2) - height);
      var dz1: ${c} = abs(width - ${c}(width1));
      var dz2: ${c} = abs(${c}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},bp=(e,t,r,i,a,n)=>{let s=e.dims,u=dp(n,t.axes,s.length),l=pp(s,i,a,t.axes),d=i.slice();i.length===0&&(d=s.map((w,S)=>w===0?1:l[S]/w),t.keepAspectRatioPolicy!=="stretch"&&(l=cp(s,d,t)));let c=G("output",e.dataType,l.length),f=B("input",e.dataType,s.length),h=C.size(l),g=s.length===l.length&&s.every((w,S)=>w===l[S]),_=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,k=f.type.value,v=w=>`
      ${g?"":`
      ${up(t.coordinateTransformMode,k)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${mp(f,s)};
              ${lp(t.nearestMode,r,k)};
              ${hp(f,c,s,l,d.length,u.length,_)};
              `;case"linear":return`
              ${fp(c,s,l,d.length,u.length)};
              ${(()=>{if(s.length===2||s.length===4)return`${gp(f,c,s,_,b)}`;if(s.length===3||s.length===5)return`${yp(f,c,s,_,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(s.length===2||s.length===4)return`${_p(f,c,s,l,d,u,t.cubicCoeffA,_,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${w.registerUniform("output_size","u32").registerUniform("scales","f32",d.length).registerUniform("roi","f32",u.length).declareVariables(f,c)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${g?"output[global_idx] = input[global_idx];":`
        let output_indices = ${c.offsetToIndices("global_idx")};
        var input_indices: ${f.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${f.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${s.length===2||s.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${r}|${d.length>0?t.mode==="cubic"?d:d.length:""}|${a.length>0?a:""}|${u.length>0?u:""}|${g}|${t.mode==="nearest"?s.length:s}`,inputDependencies:["rank"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:[{type:12,data:h},{type:1,data:d},{type:1,data:u},...Z(s,l)]})}},wp=e=>{let t=e.customDataBuffer;return new Uint32Array(t,t.byteOffset,1)[0]},$p=(e,t)=>{let r=[],i=[],a=[],n=wp(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");op(e.inputs,t,n,r,i,a),e.compute(bp(e.inputs[0],t,n,r,i,a),{inputs:[0]})},vp=e=>{let t=e.antialias,r=e.axes,i=e.coordinateTransformMode,a=e.cubicCoeffA,n=e.excludeOutside!==0,s=e.extrapolationValue,u=e.keepAspectRatioPolicy,l=e.mode,d=e.nearestMode===""?"simple":e.nearestMode;return ce({antialias:t,axes:r,coordinateTransformMode:i,cubicCoeffA:a,excludeOutside:n,extrapolationValue:s,keepAspectRatioPolicy:u,mode:l,nearestMode:d})}}),xp,kp,Sp,qh=P(()=>{J(),re(),ne(),xp=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],r=e[1],i=e[2];if(t.dataType!==r.dataType||t.dataType!==i.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(r.dims.length!==3&&r.dims.length!==2)throw new Error("Skip must be 2D or 3D");let a=t.dims[t.dims.length-1],n=t.dims[t.dims.length-2];if(r.dims[r.dims.length-1]!==a)throw new Error("Skip must have the same hidden size as input");if(r.dims[r.dims.length-2]!==n)throw new Error("Skip must have the same sequence length as input");if(i.dims.length!==1)throw new Error("Gamma must be 1D");if(i.dims[i.dims.length-1]!==a)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let s=e[3];if(s.dims.length!==1)throw new Error("Beta must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let s=e[4];if(s.dims.length!==1)throw new Error("Bias must be 1D");if(s.dims[s.dims.length-1]!==a)throw new Error("Bias must have the same hidden size as input")}},kp=(e,t,r,i)=>{let a=t.simplified,n=e[0].dims,s=C.size(n),u=n,l=s,d=n.slice(-1)[0],c=i?n.slice(0,-1).concat(1):[],f=!a&&e.length>3,h=e.length>4,g=i&&r>1,_=i&&r>2,b=r>3,k=64,v=be(d),w=[{type:12,data:l},{type:12,data:v},{type:12,data:d},{type:1,data:t.epsilon}],S=T=>{let z=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],E=[B("x",e[0].dataType,e[0].dims,v),B("skip",e[1].dataType,e[1].dims,v),B("gamma",e[2].dataType,e[2].dims,v)];f&&E.push(B("beta",e[3].dataType,e[3].dims,v)),h&&E.push(B("bias",e[4].dataType,e[4].dims,v)),E.push(G("output",e[0].dataType,u,v)),g&&E.push(G("mean_output",1,c)),_&&E.push(G("inv_std_output",1,c)),b&&E.push(G("input_skip_bias_sum",e[0].dataType,u,v));let A=ke(e[0].dataType),N=ke(1,v);return`

      ${T.registerUniforms(z).declareVariables(...E)}
      var<workgroup> sum_shared : array<${N}, ${k}>;
      var<workgroup> sum_squared_shared : array<${N}, ${k}>;

      ${T.mainStart([k,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${k};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${k};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${k-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${h?"bias[offset1d + i]":A+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Ot(A,v,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${k};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${at("sum",v)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${at("square_sum",v)} / f32(uniforms.hidden_size) ${a?"":"- mean * mean"} + uniforms.epsilon);
        ${g?"mean_output[global_idx] = mean;":""}
        ${_?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${a?"":`- ${A}(mean)`}) *
            ${A}(inv_std_dev) * gamma[offset1d + i]
            ${f?"+ beta[offset1d + i]":""};
        }
      }`},x=[{dims:u,dataType:e[0].dataType}];return r>1&&x.push({dims:c,dataType:1}),r>2&&x.push({dims:c,dataType:1}),r>3&&x.push({dims:n,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${v};${g};${_};${b}`,inputDependencies:e.map((T,z)=>"type")},getShaderSource:S,getRunData:()=>({outputs:x,dispatchGroup:{x:Math.ceil(l/d)},programUniforms:w})}},Sp=(e,t)=>{xp(e.inputs);let r=[0];e.outputCount>1&&r.push(-3),e.outputCount>2&&r.push(-3),e.outputCount>3&&r.push(3),e.compute(kp(e.inputs,t,e.outputCount,!1),{outputs:r})}}),Tp,Zt,Ip,ya,Ep,zp,Cp,Op,Wh=P(()=>{J(),re(),we(),ne(),Tp=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((r,i)=>{if(e[i+1].dataType!==6&&e[i+1].dataType!==7)throw new Error(`Input ${i} must be an array of int32 or int64`)})},Zt=(e,t)=>{let r=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(i=>r.push(Number(i)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(i=>r.push(Number(i)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return r},Ip=(e,t)=>{if(e.length>1){let r=Zt(e,1),i=Zt(e,2),a=Zt(e,3);return a.length===0&&(a=[...Array(e[0].dims.length).keys()]),ce({starts:r,ends:i,axes:a})}else return t},ya=(e,t,r,i,a)=>{let n=e;return e<0&&(n+=r[i[t]]),a[t]<0?Math.max(0,Math.min(n,r[i[t]]-1)):Math.max(0,Math.min(n,r[i[t]]))},Ep=(e,t,r)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${r.length}; i >= 0; i--) {
            let input_shape_i = ${H("uniforms.input_shape","i",r.length)};
            let steps_i = ${H("uniforms.steps","i",r.length)};
            let signs_i = ${H("uniforms.signs","i",r.length)};
            let starts_i = ${H("uniforms.starts","i",r.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,zp=(e,t)=>{let r=e[0].dims,i=C.size(r),a=t.axes.length>0?C.normalizeAxes(t.axes,r.length):[...Array(r.length).keys()],n=Zt(e,4);n.forEach(v=>v!==0||(()=>{throw new Error("step cannot be 0")})),n.length===0&&(n=Array(a.length).fill(1));let s=t.starts.map((v,w)=>ya(v,w,r,a,n)),u=t.ends.map((v,w)=>ya(v,w,r,a,n));if(a.length!==s.length||a.length!==u.length)throw new Error("start, ends and axes should have the same number of elements");if(a.length!==r.length)for(let v=0;v<r.length;++v)a.includes(v)||(s.splice(v,0,0),u.splice(v,0,r[v]),n.splice(v,0,1));let l=n.map(v=>Math.sign(v));n.forEach((v,w,S)=>{if(v<0){let x=(u[w]-s[w])/v,T=s[w],z=T+x*n[w];s[w]=z,u[w]=T,S[w]=-v}});let d=r.slice(0);a.forEach((v,w)=>{d[v]=Math.ceil((u[v]-s[v])/n[v])});let c={dims:d,dataType:e[0].dataType},f=G("output",e[0].dataType,d.length),h=B("input",e[0].dataType,e[0].dims.length),g=C.size(d),_=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:s.length},{name:"signs",type:"i32",length:l.length},{name:"steps",type:"u32",length:n.length}],b=[{type:12,data:g},{type:12,data:s},{type:6,data:l},{type:12,data:n},...Z(e[0].dims,d)],k=v=>`
      ${v.registerUniforms(_).declareVariables(h,f)}
        ${Ep(h,f,r)}
        ${v.mainStart()}
          ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${f.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${f.setByOffset("global_idx",h.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${l.length}_${s.length}_${n.length}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[c],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:b})}},Cp=(e,t)=>{Tp(e.inputs,t);let r=Ip(e.inputs,t);e.compute(zp(e.inputs,r),{inputs:[0]})},Op=e=>{let t=e.starts,r=e.ends,i=e.axes;return ce({starts:t,ends:r,axes:i})}}),Ap,Bp,Rp,Mp,Lh=P(()=>{J(),re(),we(),nt(),ne(),Ap=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Bp=(e,t)=>{let r=e.inputs[0],i=r.dims,a=C.size(i),n=i.length,s=C.normalizeAxis(t.axis,n),u=s<i.length-1,l,d=[];u?(d=Array.from({length:n},(E,A)=>A),d[s]=n-1,d[n-1]=s,l=e.compute(Be(r,d),{inputs:[r],outputs:[-1]})[0]):l=r;let c=l.dims,f=c[n-1],h=a/f,g=be(f),_=f/g,b=64;h===1&&(b=256);let k=(E,A)=>A===4?`max(max(${E}.x, ${E}.y), max(${E}.z, ${E}.w))`:A===2?`max(${E}.x, ${E}.y)`:A===3?`max(max(${E}.x, ${E}.y), ${E}.z)`:E,v=B("x",l.dataType,l.dims,g),w=G("result",l.dataType,l.dims,g),S=v.type.value,x=ke(l.dataType)==="f32"?`var threadMax = ${S}(-3.402823e+38f);`:`var threadMax = ${S}(-65504.0h);`,T=E=>`
      var<workgroup> rowMaxShared : ${S};
      var<workgroup> rowSumShared : ${S};
      var<workgroup> threadShared : array<${S}, ${b}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${S} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${S}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${E.registerUniform("packedCols","i32").declareVariables(v,w)}
      ${E.mainStart(b)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${b};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${x}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${S}(${k("threadShared[0]",g)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${S}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${S}(${at("threadShared[0]",g)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,z=e.compute({name:"Softmax",shaderCache:{hint:`${g};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:c,dataType:l.dataType}],dispatchGroup:{x:h},programUniforms:[{type:6,data:_}]}),getShaderSource:T},{inputs:[l],outputs:[u?-1:0]})[0];u&&e.compute(Be(z,d),{inputs:[z]})},Rp=(e,t)=>{Ap(e.inputs),Bp(e,t)},Mp=e=>ce({axis:e.axis})}),ba,Np,Dp,Pp,Up,Vh=P(()=>{J(),re(),ne(),ba=e=>Array.from(e.getBigInt64Array(),Number),Np=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(ba(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Dp=(e,t)=>{let r=[];for(let i=0;i<e.length;++i)r.push(e[i]*t[i]);return r},Pp=(e,t)=>{let r=e[0].dims,i=t??ba(e[1]),a=Dp(r,i),n=C.size(a),s=e[0].dataType,u=B("input",s,r.length),l=G("output",s,a.length),d=c=>`
      const inputShape = ${u.indices(...r)};
      ${c.registerUniform("output_size","u32").declareVariables(u,l)}
      ${c.mainStart()}
      ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${l.offsetToIndices("global_idx")};
      var input_indices: ${u.type.indices};
      for (var i = 0; i < ${r.length}; i++) {
        let input_dim_i = ${u.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${l.indicesGet("output_indices","i")}  % input_dim_i;

        ${u.indicesSet("input_indices","i","input_dim_value")}
      }
      ${l.setByOffset("global_idx",u.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(n/64)},programUniforms:[{type:12,data:n},...Z(e[0].dims,a)]}),getShaderSource:d}},Up=e=>{Np(e.inputs),e.compute(Pp(e.inputs),{inputs:[0]})}}),qp,Wp,Lp,Gh=P(()=>{J(),re(),ne(),qp=(e,t,r,i,a)=>{let n=G("output_data",a,r.length,4),s=B("a_data",t[1].dataType,t[1].dims.length,4),u=B("b_data",t[2].dataType,t[2].dims.length,4),l=B("c_data",t[0].dataType,t[0].dims.length,4),d,c=(f,h,g)=>`select(${h}, ${f}, ${g})`;if(!i)d=n.setByOffset("global_idx",c(s.getByOffset("global_idx"),u.getByOffset("global_idx"),l.getByOffset("global_idx")));else{let f=(h,g,_="")=>{let b=`a_data[index_a${g}][component_a${g}]`,k=`b_data[index_b${g}][component_b${g}]`,v=`bool(c_data[index_c${g}] & (0xffu << (component_c${g} * 8)))`;return`
            let output_indices${g} = ${n.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offset_a${g} = ${s.broadcastedIndicesToOffset(`output_indices${g}`,n)};
            let offset_b${g} = ${u.broadcastedIndicesToOffset(`output_indices${g}`,n)};
            let offset_c${g} = ${l.broadcastedIndicesToOffset(`output_indices${g}`,n)};
            let index_a${g} = offset_a${g} / 4u;
            let index_b${g} = offset_b${g} / 4u;
            let index_c${g} = offset_c${g} / 4u;
            let component_a${g} = offset_a${g} % 4u;
            let component_b${g} = offset_b${g} % 4u;
            let component_c${g} = offset_c${g} % 4u;
            ${h}[${g}] = ${_}(${c(b,k,v)});
          `};a===9?d=`
            var data = vec4<u32>(0);
            ${f("data",0,"u32")}
            ${f("data",1,"u32")}
            ${f("data",2,"u32")}
            ${f("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:d=`
            ${f("output_data[global_idx]",0)}
            ${f("output_data[global_idx]",1)}
            ${f("output_data[global_idx]",2)}
            ${f("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(l,s,u,n)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${d}
      }`},Wp=e=>{let t=e[1].dims,r=e[2].dims,i=e[0].dims,a=e[1].dataType,n=!(C.areEqual(t,r)&&C.areEqual(r,i)),s=t,u=C.size(t);if(n){let d=zt.calcShape(zt.calcShape(t,r,!1),i,!1);if(!d)throw new Error("Can't perform where op on the given tensors");s=d,u=C.size(s)}let l=Math.ceil(u/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:d=>qp(d,e,s,n,a),getRunData:()=>({outputs:[{dims:s,dataType:a}],dispatchGroup:{x:Math.ceil(u/64/4)},programUniforms:[{type:12,data:l},...Z(i,t,r,s)]})}},Lp=e=>{e.compute(Wp(e.inputs))}}),Vp,Hh=P(()=>{nh(),Bi(),sh(),oh(),uh(),lh(),dh(),mh(),_h(),yh(),bh(),wh(),$h(),vh(),xh(),kh(),Sh(),Th(),Ih(),Eh(),zh(),Ch(),Oh(),Ah(),Bh(),td(),Rh(),Mh(),Nh(),Dh(),Ph(),Ci(),Uh(),pd(),qh(),Wh(),Lh(),ud(),Vh(),nt(),Di(),Gh(),Vp=new Map([["Abs",[xo]],["Acos",[ko]],["Acosh",[So]],["Add",[cu]],["ArgMax",[oo,Ai]],["ArgMin",[so,Ai]],["Asin",[To]],["Asinh",[Io]],["Atan",[Eo]],["Atanh",[zo]],["Attention",[ho]],["AveragePool",[Wd,qd]],["BatchNormalization",[yo]],["BiasAdd",[$o]],["BiasSplitGelu",[lu]],["Cast",[Oo,Co]],["Ceil",[Ro]],["Clip",[Bo]],["Concat",[Tu,Iu]],["Conv",[Qi,Ki]],["ConvTranspose",[el,Xu]],["Cos",[Mo]],["Cosh",[No]],["CumSum",[rl,il]],["DepthToSpace",[ol,ul]],["DequantizeLinear",[Qd,Xd]],["Div",[fu]],["Einsum",[hl,ml]],["Elu",[Do,Vt]],["Equal",[hu]],["Erf",[Po]],["Exp",[Uo]],["Expand",[bl]],["FastGelu",[$l]],["Floor",[qo]],["FusedConv",[Qi,Ki]],["Gather",[Sl,kl]],["GatherElements",[Nl,Ml]],["GatherBlockQuantized",[Ol,Al]],["GatherND",[Il,El]],["Gelu",[Wo]],["Gemm",[ql,Ul]],["GlobalAveragePool",[Vd,Ld]],["GlobalMaxPool",[jd,Fd]],["Greater",[yu]],["GreaterOrEqual",[wu]],["GridSample",[Zl,Ql]],["GroupQueryAttention",[md]],["HardSigmoid",[Zo,Ko]],["InstanceNormalization",[yd]],["LayerNormalization",[$d]],["LeakyRelu",[Lo,Vt]],["Less",[bu]],["LessOrEqual",[$u]],["Log",[iu]],["MatMul",[xd]],["MatMulNBits",[Id,Ed]],["MaxPool",[Gd,Hd]],["Mul",[mu]],["MultiHeadAttention",[ed,Yl]],["Neg",[Go]],["Not",[Vo]],["Pad",[Dd]],["Pow",[gu]],["QuickGelu",[su,Vt]],["Range",[ep]],["Reciprocal",[Ho]],["ReduceMin",[to]],["ReduceMean",[Qs]],["ReduceMax",[eo]],["ReduceSum",[io]],["ReduceProd",[ro]],["ReduceL1",[Xs]],["ReduceL2",[Ys]],["ReduceLogSum",[no]],["ReduceLogSumExp",[Js]],["ReduceSumSquare",[ao]],["Relu",[Fo]],["Resize",[$p,vp]],["RotaryEmbedding",[dd]],["ScatterND",[ap,ip]],["Sigmoid",[jo]],["Sin",[Qo]],["Sinh",[Xo]],["Slice",[Cp,Op]],["SkipLayerNormalization",[Sp]],["Split",[sd,od]],["Sqrt",[Yo]],["Softmax",[Rp,Mp]],["Sub",[_u]],["Tan",[Jo]],["Tanh",[eu]],["ThresholdedRelu",[ru,Vt]],["Tile",[Up]],["Transpose",[_s,ys]],["Where",[Lp]]])}),Gp,Fh=P(()=>{qe(),Je(),ne(),Gp=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,r,i,a){je(e.programInfo.name);let n=this.backend.device,s=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let u=[];for(let d of t)u.push({binding:u.length,resource:{buffer:d.buffer}});for(let d of r)u.push({binding:u.length,resource:{buffer:d.buffer}});a&&u.push({binding:u.length,resource:a});let l=n.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:u,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let d={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:l,dispatchGroup:i};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(d)}s.setPipeline(e.computePipeline),s.setBindGroup(0,l),s.dispatchWorkgroups(...i),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Ue(e.programInfo.name)}dispose(){}build(e,t){je(e.name);let r=this.backend.device,i=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(d=>{r.features.has(d.feature)&&i.push(`enable ${d.extension};`)});let a=ps(t,this.backend.device.limits),n=e.getShaderSource(a),s=`${i.join(`
`)}
${a.additionalImplementations}
${n}`,u=r.createShaderModule({code:s,label:e.name});le("verbose",()=>`[WebGPU] ${e.name} shader code: ${s}`);let l=r.createComputePipeline({compute:{module:u,entryPoint:"main"},layout:"auto",label:e.name});return Ue(e.name),{programInfo:e,computePipeline:l,uniformVariablesInfo:a.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,r=typeof e=="number"?1:e.y||1,i=typeof e=="number"?1:e.z||1,a=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=a&&r<=a&&i<=a)return[t,r,i];let n=t*r*i,s=Math.ceil(Math.sqrt(n));if(s>a){if(s=Math.ceil(Math.cbrt(n)),s>a)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[s,s,s]}else return[s,s,1]}}}),Hp={};It(Hp,{WebGpuBackend:()=>Zp});var Fp,jp,Kp,Zp,jh=P(()=>{qe(),J(),Je(),Xn(),ih(),Hh(),Fh(),Fp=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let r=[];for(let i=0;i<e.length;++i){let a=e[i].dataType;switch(t[i]){case"none":{r.push("");break}case"type":{r.push(`${a}`);break}case"rank":{let n=e[i].dims.length;r.push(`${a};${n}`);break}case"dims":{let n=e[i].dims.join(",");r.push(`${a};${n}`);break}default:throw new Error(`unsupported input dependency: ${t[i]}`)}}return r.join("|")},jp=(e,t,r)=>{let i=e.name;return e.shaderCache?.hint&&(i+="["+e.shaderCache.hint+"]"),i+=":"+r+`:${Fp(t,e.shaderCache?.inputDependencies??new Array(t.length).fill("dims"))}`,i},Kp=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Zp=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let r=[],i={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:r},a=n=>t.features.has(n)&&r.push(n)&&!0;a("chromium-experimental-timestamp-query-inside-passes")||a("timestamp-query"),a("shader-f16"),a("subgroups"),this.device=await t.requestDevice(i),this.adapterInfo=new Kp(t.info||await t.requestAdapterInfo()),this.gpuDataManager=os(this),this.programManager=new Gp(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,fi(e.logLevel,!!e.debug),this.device.onuncapturederror=n=>{n.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${n.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;je(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{let t=new BigUint64Array(e.getMappedRange()),r=this.pendingQueries.get(e);for(let i=0;i<t.length/2;i++){let a=r[i],n=a.kernelId,s=this.kernels.get(n),u=s.kernelType,l=s.kernelName,d=a.programName,c=a.inputTensorViews,f=a.outputTensorViews,h=t[i*2],g=t[i*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=h);let _=Number(h-this.queryTimeBase),b=Number(g-this.queryTimeBase);if(!Number.isSafeInteger(_)||!Number.isSafeInteger(b))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:c.map(k=>({dims:k.dims,dataType:Ye(k.dataType)})),outputsMetadata:f.map(k=>({dims:k.dims,dataType:Ye(k.dataType)})),kernelId:n,kernelType:u,kernelName:l,programName:d,startTime:_,endTime:b});else{let k="";c.forEach((w,S)=>{k+=`input[${S}]: [${w.dims}] | ${Ye(w.dataType)}, `});let v="";f.forEach((w,S)=>{v+=`output[${S}]: [${w.dims}] | ${Ye(w.dataType)}, `}),console.log(`[profiling] kernel "${n}|${u}|${l}|${d}" ${k}${v}execution time: ${b-_} ns`)}or("GPU",`${d}::${h}::${g}`)}e.unmap(),this.pendingQueries.delete(e)}),Ue()}run(e,t,r,i,a,n){je(e.name);let s=[];for(let w=0;w<t.length;++w){let S=t[w].data;if(S===0)continue;let x=this.gpuDataManager.get(S);if(!x)throw new Error(`no GPU data for input: ${S}`);s.push(x)}let{outputs:u,dispatchGroup:l,programUniforms:d}=e.getRunData(t),c=r.length===0?u.map((w,S)=>S):r;if(c.length!==u.length)throw new Error(`Output size ${c.length} must be equal to ${u.length}.`);let f=[],h=[];for(let w=0;w<u.length;++w){if(!Number.isInteger(c[w])||c[w]<-3||c[w]>=n)throw new Error(`Invalid output index: ${c[w]}`);if(c[w]===-3)continue;let S=c[w]===-1,x=c[w]===-2,T=S||x?a(u[w].dataType,u[w].dims):i(c[w],u[w].dataType,u[w].dims);if(f.push(T),T.data===0)continue;let z=this.gpuDataManager.get(T.data);if(!z)throw new Error(`no GPU data for output: ${T.data}`);if(S&&this.temporaryData.push(z),x){let E=this.kernelPersistentData.get(this.currentKernelId);E||(E=[],this.kernelPersistentData.set(this.currentKernelId,E)),E.push(z)}h.push(z)}if(s.length!==t.length||h.length!==f.length){if(h.length===0)return Ue(e.name),f;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let g;if(d){let w=0,S=[];d.forEach(E=>{let A=typeof E.data=="number"?[E.data]:E.data;if(A.length===0)return;let N=E.type===10?2:4,L,Y;E.type===10?(Y=A.length>4?16:A.length>2?8:A.length*N,L=A.length>4?16:N*A.length):(Y=A.length<=2?A.length*N:16,L=16),w=Math.ceil(w/Y)*Y,S.push(w);let F=E.type===10?8:4;w+=A.length>4?Math.ceil(A.length/F)*L:A.length*N});let x=16;w=Math.ceil(w/x)*x;let T=new ArrayBuffer(w);d.forEach((E,A)=>{let N=S[A],L=typeof E.data=="number"?[E.data]:E.data;if(E.type===6)new Int32Array(T,N,L.length).set(L);else if(E.type===12)new Uint32Array(T,N,L.length).set(L);else if(E.type===10)new Uint16Array(T,N,L.length).set(L);else if(E.type===1)new Float32Array(T,N,L.length).set(L);else throw new Error(`Unsupported uniform type: ${Ye(E.type)}`)});let z=this.gpuDataManager.create(w,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(z.buffer,0,T,0,w),this.gpuDataManager.release(z.id),g={offset:0,size:w,buffer:z.buffer}}let _=this.programManager.normalizeDispatchGroupSize(l),b=_[1]===1&&_[2]===1,k=jp(e,t,b),v=this.programManager.getArtifact(k);if(v||(v=this.programManager.build(e,_),this.programManager.setArtifact(k,v),le("info",()=>`[artifact] key: ${k}, programName: ${e.name}`)),d&&v.uniformVariablesInfo){if(d.length!==v.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${v.uniformVariablesInfo.length}, got ${d.length} in program "${v.programInfo.name}".`);for(let w=0;w<d.length;w++){let S=d[w],x=S.type,T=typeof S.data=="number"?1:S.data.length,[z,E]=v.uniformVariablesInfo[w];if(x!==z||T!==E)throw new Error(`Uniform variable ${w} mismatch: expect type ${z} with size ${E}, got type ${x} with size ${T} in program "${v.programInfo.name}".`)}}if(le("info",()=>`[ProgramManager] run "${e.name}" (key=${k}) with ${_[0]}x${_[1]}x${_[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let w={kernelId:this.currentKernelId,programName:v.programInfo.name,inputTensorViews:t,outputTensorViews:f};this.pendingKernels.push(w),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(w)}return this.programManager.run(v,s,h,_,g),Ue(e.name),f}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,r,i){let a=Vp.get(e);if(!a)throw new Error(`kernel not implemented: ${e}`);let n={kernelType:e,kernelName:i,kernelEntry:a[0],attributes:[a[1],r]};this.kernels.set(t,n)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let r of t)this.gpuDataManager.release(r.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,r){let i=this.kernels.get(e);if(!i)throw new Error(`kernel not created: ${e}`);let a=i.kernelType,n=i.kernelName,s=i.kernelEntry,u=i.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${a}] ${n}" is not allowed to be called recursively`);this.currentKernelId=e,u[0]&&(u[1]=u[0](u[1]),u[0]=void 0),le("info",()=>`[WebGPU] Start to run kernel "[${a}] ${n}"...`);let l=this.env.debug;this.temporaryData=[];try{return l&&this.device.pushErrorScope("validation"),s(t,u[1]),0}catch(d){return r.push(Promise.resolve(`[WebGPU] Kernel "[${a}] ${n}" failed. ${d}`)),1}finally{l&&r.push(this.device.popErrorScope().then(d=>d?`GPU validation error for kernel "[${a}] ${n}": ${d.message}`:null));for(let d of this.temporaryData)this.gpuDataManager.release(d.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,r,i){let a=this.sessionExternalDataMapping.get(e);a||(a=new Map,this.sessionExternalDataMapping.set(e,a));let n=a.get(t),s=this.gpuDataManager.registerExternalBuffer(r,i,n);return a.set(t,[s,r]),s}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(r=>this.gpuDataManager.unregisterExternalBuffer(r[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,r){return async()=>{let i=await Si(this,e,t);return hi(i.buffer,r)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){this.queryType="none",(this.env.webgpu.profiling?.mode==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){le("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){le("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){le("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),r=e.length;this.pendingKernels=[];for(let i=0;i<r;i++){let a=this.getComputePassEncoder(),n=e[i];this.writeTimestamp(this.pendingDispatchNumber*2),a.setPipeline(n.computePipeline),a.setBindGroup(0,n.bindGroup),a.dispatchWorkgroups(...n.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[i]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Qp={};It(Qp,{init:()=>Yp});var Sr,Xp,Yp,Kh=P(()=>{J(),Je(),re(),rh(),Sr=class Of{constructor(t,r,i,a){this.module=t,this.dataType=r,this.data=i,this.dims=a}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=C.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(C.size(t)!==C.size(this.dims))throw new Error("Invalid new shape");return new Of(this.module,this.dataType,this.data,t)}},Xp=class{constructor(e,t,r){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo;let i=e.PTR_SIZE,a=r/e.PTR_SIZE,n=i===4?"i32":"i64";this.opKernelContext=Number(e.getValue(i*a++,n));let s=Number(e.getValue(i*a++,n));this.outputCount=Number(e.getValue(i*a++,n)),this.customDataOffset=Number(e.getValue(i*a++,"*")),this.customDataSize=Number(e.getValue(i*a++,n));let u=[];for(let l=0;l<s;l++){let d=Number(e.getValue(i*a++,n)),c=Number(e.getValue(i*a++,"*")),f=Number(e.getValue(i*a++,n)),h=[];for(let g=0;g<f;g++)h.push(Number(e.getValue(i*a++,n)));u.push(new Sr(e,d,c,h))}this.inputs=u}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){let r=t?.inputs?.map(s=>typeof s=="number"?this.inputs[s]:s)??this.inputs,i=t?.outputs??[],a=(s,u,l)=>new Sr(this.module,u,this.output(s,l),l),n=(s,u)=>{let l=_t(s,u);if(!l)throw new Error(`Unsupported data type: ${s}`);let d=l>0?this.backend.gpuDataManager.create(l).id:0;return new Sr(this.module,s,d,u)};return this.backend.run(e,r,i,a,n,this.outputCount)}output(e,t){let r=this.module.stackSave();try{let i=this.module.PTR_SIZE,a=i===4?"i32":"i64",n=this.module.stackAlloc((1+t.length)*i);this.module.setValue(n,t.length,a);for(let s=0;s<t.length;s++)this.module.setValue(n+i*(s+1),t[s],a);return this.module._JsepOutput(this.opKernelContext,e,n)}catch(i){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${i}`)}finally{this.module.stackRestore(r)}}},Yp=async(e,t,r,i)=>{let a=t.jsepInit;if(!a)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let n=(jh(),Mt(Hp)).WebGpuBackend,s=new n;await s.initialize(r,i),a("webgpu",[s,u=>s.alloc(Number(u)),u=>s.free(u),(u,l,d,c=!1)=>{if(c)le("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(u)}, dst=${Number(l)}, size=${Number(d)}`),s.memcpy(Number(u),Number(l));else{le("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(u)}, gpuDataId=${Number(l)}, size=${Number(d)}`);let f=t.HEAPU8.subarray(Number(u>>>0),Number(u>>>0)+Number(d));s.upload(Number(l),f)}},async(u,l,d)=>{le("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${u}, dataOffset=${l}, size=${d}`),await s.download(Number(u),()=>t.HEAPU8.subarray(Number(l)>>>0,Number(l+d)>>>0))},(u,l,d)=>s.createKernel(u,Number(l),d,t.UTF8ToString(t._JsepGetNodeName(Number(l)))),u=>s.releaseKernel(u),(u,l,d,c)=>{le("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${d}, kernel=${u}, contextDataOffset=${l}`);let f=new Xp(t,s,Number(l));return s.computeKernel(Number(u),f,c)},()=>s.captureBegin(),()=>s.captureEnd(),()=>s.replay()])}else{let n=new is(r);a("webnn",[n,()=>n.reserveTensorId(),s=>n.releaseTensorId(s),async(s,u,l,d,c)=>n.ensureTensor(s,u,l,d,c),(s,u)=>{n.uploadTensor(s,u)},async(s,u)=>n.downloadTensor(s,u)])}}}),Jp,wa,$a,st,ec,va,Tr,xa,ka,Sa,Ta,Ia,Ea,tc=P(()=>{Jf(),eh(),J(),mt(),ui(),Wn(),Jp=(e,t)=>{me()._OrtInit(e,t)!==0&&fe("Can't initialize onnxruntime.")},wa=async e=>{Jp(e.wasm.numThreads,cr(e.logLevel))},$a=async(e,t)=>{me().asyncInit?.();{let r=(Kh(),Mt(Qp)).init;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");let i=e.webgpu.adapter;if(i){if(typeof i.limits!="object"||typeof i.features!="object"||typeof i.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let a=e.webgpu.powerPreference;if(a!==void 0&&a!=="low-power"&&a!=="high-performance")throw new Error(`Invalid powerPreference setting: "${a}"`);let n=e.webgpu.forceFallbackAdapter;if(n!==void 0&&typeof n!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${n}"`);if(i=await navigator.gpu.requestAdapter({powerPreference:a,forceFallbackAdapter:n}),!i)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}await r("webgpu",me(),e,i)}if(t==="webnn"){if(typeof navigator>"u"||!navigator.ml)throw new Error("WebNN is not supported in current environment");await r("webnn",me(),e)}}},st=new Map,ec=e=>{let t=me(),r=t.stackSave();try{let i=t.PTR_SIZE,a=t.stackAlloc(2*i);t._OrtGetInputOutputCount(e,a,a+i)!==0&&fe("Can't get session input/output count.");let n=i===4?"i32":"i64";return[Number(t.getValue(a,n)),Number(t.getValue(a+i,n))]}finally{t.stackRestore(r)}},va=(e,t)=>{let r=me(),i=r.stackSave(),a=0;try{let n=r.PTR_SIZE,s=r.stackAlloc(2*n);r._OrtGetInputOutputMetadata(e,t,s,s+n)!==0&&fe("Can't get session input/output metadata.");let u=Number(r.getValue(s,"*"));a=Number(r.getValue(s+n,"*"));let l=r.HEAP32[a/4];if(l===0)return[u,0];let d=r.HEAPU32[a/4+1],c=[];for(let f=0;f<d;f++){let h=Number(r.getValue(a+8+f*n,"*"));c.push(h!==0?r.UTF8ToString(h):Number(r.getValue(a+8+(f+d)*n,"*")))}return[u,l,c]}finally{r.stackRestore(i),a!==0&&r._OrtFree(a)}},Tr=e=>{let t=me(),r=t._malloc(e.byteLength);if(r===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,r),[r,e.byteLength]},xa=async(e,t)=>{let r,i,a=me();Array.isArray(e)?[r,i]=e:e.buffer===a.HEAPU8.buffer?[r,i]=[e.byteOffset,e.byteLength]:[r,i]=Tr(e);let n=0,s=0,u=0,l=[],d=[],c=[];try{if([s,l]=await qn(t),t?.externalData&&a.mountExternalData){let x=[];for(let T of t.externalData){let z=typeof T=="string"?T:T.path;x.push(ci(typeof T=="string"?T:T.data).then(E=>{a.mountExternalData(z,E)}))}await Promise.all(x)}for(let x of t?.executionProviders??[])if((typeof x=="string"?x:x.name)==="webnn"){if(a.shouldTransferToMLTensor=!1,typeof x!="string"){let T=x,z=T?.context,E=T?.gpuDevice,A=T?.deviceType,N=T?.powerPreference;z?a.currentContext=z:E?a.currentContext=await a.webnnCreateMLContext(E):a.currentContext=await a.webnnCreateMLContext({deviceType:A,powerPreference:N})}else a.currentContext=await a.webnnCreateMLContext();break}n=await a._OrtCreateSession(r,i,s),a.webgpuOnCreateSession?.(n),n===0&&fe("Can't create a session."),a.jsepOnCreateSession?.(),a.currentContext&&(a.webnnRegisterMLContext(n,a.currentContext),a.currentContext=void 0,a.shouldTransferToMLTensor=!0);let[f,h]=ec(n),g=!!t?.enableGraphCapture,_=[],b=[],k=[],v=[],w=[];for(let x=0;x<f;x++){let[T,z,E]=va(n,x);T===0&&fe("Can't get an input name."),d.push(T);let A=a.UTF8ToString(T);_.push(A),k.push(z===0?{name:A,isTensor:!1}:{name:A,isTensor:!0,type:Ye(z),shape:E})}for(let x=0;x<h;x++){let[T,z,E]=va(n,x+f);T===0&&fe("Can't get an output name."),c.push(T);let A=a.UTF8ToString(T);b.push(A),v.push(z===0?{name:A,isTensor:!1}:{name:A,isTensor:!0,type:Ye(z),shape:E});{if(g&&t?.preferredOutputLocation===void 0){w.push("gpu-buffer");continue}let N=typeof t?.preferredOutputLocation=="string"?t.preferredOutputLocation:t?.preferredOutputLocation?.[A]??"cpu",L=a.webnnIsGraphOutput;if(N==="cpu"&&L&&L(n,A)){w.push("ml-tensor-cpu-output");continue}if(N!=="cpu"&&N!=="cpu-pinned"&&N!=="gpu-buffer"&&N!=="ml-tensor")throw new Error(`Not supported preferred output location: ${N}.`);if(g&&N!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${N}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);w.push(N)}}let S=null;return w.some(x=>x==="gpu-buffer"||x==="ml-tensor"||x==="ml-tensor-cpu-output")&&(u=a._OrtCreateBinding(n),u===0&&fe("Can't create IO binding."),S={handle:u,outputPreferredLocations:w,outputPreferredLocationsEncoded:w.map(x=>x==="ml-tensor-cpu-output"?"ml-tensor":x).map(x=>pi(x))}),st.set(n,[n,d,c,S,g,!1]),[n,_,b,k,v]}catch(f){throw d.forEach(h=>a._OrtFree(h)),c.forEach(h=>a._OrtFree(h)),u!==0&&a._OrtReleaseBinding(u)!==0&&fe("Can't release IO binding."),n!==0&&a._OrtReleaseSession(n)!==0&&fe("Can't release session."),f}finally{a._free(r),s!==0&&a._OrtReleaseSessionOptions(s)!==0&&fe("Can't release session options."),l.forEach(f=>a._free(f)),a.unmountExternalData?.()}},ka=e=>{let t=me(),r=st.get(e);if(!r)throw new Error(`cannot release session. invalid session id: ${e}`);let[i,a,n,s,u]=r;s&&(u&&t._OrtClearBoundOutputs(s.handle)!==0&&fe("Can't clear bound outputs."),t._OrtReleaseBinding(s.handle)!==0&&fe("Can't release IO binding.")),t.jsepOnReleaseSession?.(e),t.webnnOnReleaseSession?.(e),t.webgpuOnReleaseSession?.(e),a.forEach(l=>t._OrtFree(l)),n.forEach(l=>t._OrtFree(l)),t._OrtReleaseSession(i)!==0&&fe("Can't release session."),st.delete(e)},Sa=async(e,t,r,i,a,n,s=!1)=>{if(!e){t.push(0);return}let u=me(),l=u.PTR_SIZE,d=e[0],c=e[1],f=e[3],h=f,g,_;if(d==="string"&&(f==="gpu-buffer"||f==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(s&&f!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${n} when enableGraphCapture is true.`);if(f==="gpu-buffer"){let v=e[2].gpuBuffer;_=_t(gt(d),c);{let w=u.jsepRegisterBuffer;if(!w)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');g=w(i,n,v,_)}}else if(f==="ml-tensor"){let v=e[2].mlTensor;_=_t(gt(d),c);let w=u.webnnRegisterMLTensor;if(!w)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');g=w(i,v,gt(d),c)}else{let v=e[2];if(Array.isArray(v)){_=l*v.length,g=u._malloc(_),r.push(g);for(let w=0;w<v.length;w++){if(typeof v[w]!="string")throw new TypeError(`tensor data at index ${w} is not a string`);u.setValue(g+w*l,We(v[w],r),"*")}}else{let w=u.webnnIsGraphInput,S=u.webnnIsGraphOutput;if(d!=="string"&&w&&S){let x=u.UTF8ToString(a);if(w(i,x)||S(i,x)){let T=gt(d);_=_t(T,c),h="ml-tensor";let z=u.webnnCreateTemporaryTensor,E=u.webnnUploadTensor;if(!z||!E)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let A=await z(i,T,c);E(A,new Uint8Array(v.buffer,v.byteOffset,v.byteLength)),g=A}else _=v.byteLength,g=u._malloc(_),r.push(g),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,_),g)}else _=v.byteLength,g=u._malloc(_),r.push(g),u.HEAPU8.set(new Uint8Array(v.buffer,v.byteOffset,_),g)}}let b=u.stackSave(),k=u.stackAlloc(4*c.length);try{c.forEach((w,S)=>u.setValue(k+S*l,w,l===4?"i32":"i64"));let v=u._OrtCreateTensor(gt(d),g,_,k,c.length,pi(h));v===0&&fe(`Can't create tensor for input/output. session=${i}, index=${n}.`),t.push(v)}finally{u.stackRestore(b)}},Ta=async(e,t,r,i,a,n)=>{let s=me(),u=s.PTR_SIZE,l=st.get(e);if(!l)throw new Error(`cannot run inference. invalid session id: ${e}`);let d=l[0],c=l[1],f=l[2],h=l[3],g=l[4],_=l[5],b=t.length,k=i.length,v=0,w=[],S=[],x=[],T=[],z=s.stackSave(),E=s.stackAlloc(b*u),A=s.stackAlloc(b*u),N=s.stackAlloc(k*u),L=s.stackAlloc(k*u);try{[v,w]=Mn(n);for(let U=0;U<b;U++)await Sa(r[U],S,T,e,c[t[U]],t[U],g);for(let U=0;U<k;U++)await Sa(a[U],x,T,e,f[i[U]],b+i[U],g);for(let U=0;U<b;U++)s.setValue(E+U*u,S[U],"*"),s.setValue(A+U*u,c[t[U]],"*");for(let U=0;U<k;U++)s.setValue(N+U*u,x[U],"*"),s.setValue(L+U*u,f[i[U]],"*");if(h&&!_){let{handle:U,outputPreferredLocations:ie,outputPreferredLocationsEncoded:Q}=h;if(c.length!==b)throw new Error(`input count from feeds (${b}) is expected to be always equal to model's input count (${c.length}).`);for(let V=0;V<b;V++){let oe=t[V];await s._OrtBindInput(U,c[oe],S[V])!==0&&fe(`Can't bind input[${V}] for session=${e}.`)}for(let V=0;V<k;V++){let oe=i[V];a[V]?.[3]?s._OrtBindOutput(U,f[oe],x[V],0)!==0&&fe(`Can't bind pre-allocated output[${V}] for session=${e}.`):s._OrtBindOutput(U,f[oe],0,Q[oe])!==0&&fe(`Can't bind output[${V}] to ${ie[V]} for session=${e}.`)}st.set(e,[d,c,f,h,g,!0])}s.jsepOnRunStart?.(d),s.webnnOnRunStart?.(d);let Y;h?Y=await s._OrtRunWithBinding(d,h.handle,k,N,v):Y=await s._OrtRun(d,A,E,b,L,k,N,v),Y!==0&&fe("failed to call OrtRun().");let F=[],ee=[];for(let U=0;U<k;U++){let ie=Number(s.getValue(N+U*u,"*"));if(ie===x[U]){F.push(a[U]);continue}let Q=s.stackSave(),V=s.stackAlloc(4*u),oe=!1,j,ue=0;try{s._OrtGetTensorData(ie,V,V+u,V+2*u,V+3*u)!==0&&fe(`Can't access output tensor data on index ${U}.`);let M=u===4?"i32":"i64",q=Number(s.getValue(V,M));ue=s.getValue(V+u,"*");let te=s.getValue(V+u*2,"*"),O=Number(s.getValue(V+u*3,M)),ae=[];for(let ve=0;ve<O;ve++)ae.push(Number(s.getValue(te+ve*u,M)));s._OrtFree(te)!==0&&fe("Can't free memory for tensor dims.");let ze=ae.reduce((ve,_e)=>ve*_e,1);j=Ye(q);let Ne=h?.outputPreferredLocations[i[U]];if(j==="string"){if(Ne==="gpu-buffer"||Ne==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let ve=[];for(let _e=0;_e<ze;_e++){let $e=s.getValue(ue+_e*u,"*"),zr=s.getValue(ue+(_e+1)*u,"*"),Jt=_e===ze-1?void 0:zr-$e;ve.push(s.UTF8ToString($e,Jt))}F.push([j,ae,ve,"cpu"])}else if(Ne==="gpu-buffer"&&ze>0){let ve=s.jsepGetBuffer;if(!ve)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let _e=ve(ue),$e=_t(q,ze);if($e===void 0||!li(j))throw new Error(`Unsupported data type: ${j}`);oe=!0,F.push([j,ae,{gpuBuffer:_e,download:s.jsepCreateDownloader(_e,$e,j),dispose:()=>{s._OrtReleaseTensor(ie)!==0&&fe("Can't release tensor.")}},"gpu-buffer"])}else if(Ne==="ml-tensor"&&ze>0){let ve=s.webnnEnsureTensor,_e=s.webnnIsGraphInputOutputTypeSupported;if(!ve||!_e)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(_t(q,ze)===void 0||!di(j))throw new Error(`Unsupported data type: ${j}`);if(!_e(e,j,!1))throw new Error(`preferredLocation "ml-tensor" for ${j} output is not supported by current WebNN Context.`);let $e=await ve(e,ue,q,ae,!1);oe=!0,F.push([j,ae,{mlTensor:$e,download:s.webnnCreateMLTensorDownloader(ue,j),dispose:()=>{s.webnnReleaseTensorId(ue),s._OrtReleaseTensor(ie)}},"ml-tensor"])}else if(Ne==="ml-tensor-cpu-output"&&ze>0){let ve=s.webnnCreateMLTensorDownloader(ue,j)(),_e=F.length;oe=!0,ee.push((async()=>{let $e=[_e,await ve];return s.webnnReleaseTensorId(ue),s._OrtReleaseTensor(ie),$e})()),F.push([j,ae,[],"cpu"])}else{let ve=pr(j),_e=new ve(ze);new Uint8Array(_e.buffer,_e.byteOffset,_e.byteLength).set(s.HEAPU8.subarray(ue,ue+_e.byteLength)),F.push([j,ae,_e,"cpu"])}}finally{s.stackRestore(Q),j==="string"&&ue&&s._free(ue),oe||s._OrtReleaseTensor(ie)}}h&&!g&&(s._OrtClearBoundOutputs(h.handle)!==0&&fe("Can't clear bound outputs."),st.set(e,[d,c,f,h,g,!1]));for(let[U,ie]of await Promise.all(ee))F[U][2]=ie;return F}finally{s.webnnOnRunEnd?.(d),s.stackRestore(z),S.forEach(Y=>s._OrtReleaseTensor(Y)),x.forEach(Y=>s._OrtReleaseTensor(Y)),T.forEach(Y=>s._free(Y)),v!==0&&s._OrtReleaseRunOptions(v),w.forEach(Y=>s._free(Y))}},Ia=e=>{let t=me(),r=st.get(e);if(!r)throw new Error("invalid session id");let i=r[0],a=t._OrtEndProfiling(i);a===0&&fe("Can't get an profile file name."),t._OrtFree(a)},Ea=e=>{let t=[];for(let r of e){let i=r[2];!Array.isArray(i)&&"buffer"in i&&t.push(i.buffer)}return t}}),ot,Me,At,Qt,Xt,Ir,za,Er,kt,St,rc,ic,ac,nc,sc,oc,uc,lc,dc=P(()=>{qe(),tc(),mt(),ai(),ot=()=>!!ge.wasm.proxy&&typeof document<"u",At=!1,Qt=!1,Xt=!1,Er=new Map,kt=(e,t)=>{let r=Er.get(e);r?r.push(t):Er.set(e,[t])},St=()=>{if(At||!Qt||Xt||!Me)throw new Error("worker not ready")},rc=e=>{switch(e.data.type){case"init-wasm":At=!1,e.data.err?(Xt=!0,za[1](e.data.err)):(Qt=!0,za[0]()),Ir&&(URL.revokeObjectURL(Ir),Ir=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Er.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}}},ic=async()=>{if(!Qt){if(At)throw new Error("multiple calls to 'initWasm()' detected.");if(Xt)throw new Error("previous call to 'initWasm()' failed.");if(At=!0,ot())return new Promise((e,t)=>{Me?.terminate(),Cn().then(([r,i])=>{try{Me=i,Me.onerror=n=>t(n),Me.onmessage=rc,za=[e,t];let a={type:"init-wasm",in:ge};!a.in.wasm.wasmPaths&&(r||ei)&&(a.in.wasm.wasmPaths={wasm:new URL("/client-ocr/assets/ort-wasm-simd-threaded.jsep-CLPRrI3A.wasm",self.location.href).href}),Me.postMessage(a),Ir=r}catch(a){t(a)}},t)});try{await oi(ge.wasm),await wa(ge),Qt=!0}catch(e){throw Xt=!0,e}finally{At=!1}}},ac=async e=>{if(ot())return St(),new Promise((t,r)=>{kt("init-ep",[t,r]);let i={type:"init-ep",in:{epName:e,env:ge}};Me.postMessage(i)});await $a(ge,e)},nc=async e=>ot()?(St(),new Promise((t,r)=>{kt("copy-from",[t,r]);let i={type:"copy-from",in:{buffer:e}};Me.postMessage(i,[e.buffer])})):Tr(e),sc=async(e,t)=>{if(ot()){if(t?.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return St(),new Promise((r,i)=>{kt("create",[r,i]);let a={type:"create",in:{model:e,options:{...t}}},n=[];e instanceof Uint8Array&&n.push(e.buffer),Me.postMessage(a,n)})}else return xa(e,t)},oc=async e=>{if(ot())return St(),new Promise((t,r)=>{kt("release",[t,r]);let i={type:"release",in:e};Me.postMessage(i)});ka(e)},uc=async(e,t,r,i,a,n)=>{if(ot()){if(r.some(s=>s[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(a.some(s=>s))throw new Error("pre-allocated output tensor is not supported for proxy.");return St(),new Promise((s,u)=>{kt("run",[s,u]);let l=r,d={type:"run",in:{sessionId:e,inputIndices:t,inputs:l,outputIndices:i,options:n}};Me.postMessage(d,Ea(l))})}else return Ta(e,t,r,i,a,n)},lc=async e=>{if(ot())return St(),new Promise((t,r)=>{kt("end-profiling",[t,r]);let i={type:"end-profiling",in:e};Me.postMessage(i)});Ia(e)}}),Ca,pc,cc,Zh=P(()=>{qe(),dc(),J(),Kr(),Wn(),Ca=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},pc=e=>{switch(e[3]){case"cpu":return new Pe(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!li(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:r,download:i,dispose:a}=e[2];return Pe.fromGpuBuffer(r,{dataType:t,dims:e[1],download:i,dispose:a})}case"ml-tensor":{let t=e[0];if(!di(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:r,download:i,dispose:a}=e[2];return Pe.fromMLTensor(r,{dataType:t,dims:e[1],download:i,dispose:a})}default:throw new Error(`invalid data location: ${e[3]}`)}},cc=class{async fetchModelAndCopyToWasmMemory(e){return nc(await ci(e))}async loadModel(e,t){je();let r;typeof e=="string"?r=await this.fetchModelAndCopyToWasmMemory(e):r=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await sc(r,t),Ue()}async dispose(){return oc(this.sessionId)}async run(e,t,r){je();let i=[],a=[];Object.entries(e).forEach(f=>{let h=f[0],g=f[1],_=this.inputNames.indexOf(h);if(_===-1)throw new Error(`invalid input '${h}'`);i.push(g),a.push(_)});let n=[],s=[];Object.entries(t).forEach(f=>{let h=f[0],g=f[1],_=this.outputNames.indexOf(h);if(_===-1)throw new Error(`invalid output '${h}'`);n.push(g),s.push(_)});let u=i.map((f,h)=>Ca(f,()=>`input "${this.inputNames[a[h]]}"`)),l=n.map((f,h)=>f?Ca(f,()=>`output "${this.outputNames[s[h]]}"`):null),d=await uc(this.sessionId,a,u,s,l,r),c={};for(let f=0;f<d.length;f++)c[this.outputNames[s[f]]]=n[f]??pc(d[f]);return Ue(),c}startProfiling(){}endProfiling(){lc(this.sessionId)}}}),fc={};It(fc,{OnnxruntimeWebAssemblyBackend:()=>Aa,initializeFlags:()=>Oa,wasmBackend:()=>hc});var Oa,Aa,hc,Qh=P(()=>{qe(),dc(),Zh(),Oa=()=>{(typeof ge.wasm.initTimeout!="number"||ge.wasm.initTimeout<0)&&(ge.wasm.initTimeout=0);let e=ge.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ge.wasm.simd=!1),typeof ge.wasm.proxy!="boolean"&&(ge.wasm.proxy=!1),typeof ge.wasm.trace!="boolean"&&(ge.wasm.trace=!1),typeof ge.wasm.numThreads!="number"||!Number.isInteger(ge.wasm.numThreads)||ge.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ge.wasm.numThreads=1;else{let t=typeof navigator>"u"?Mf("node:os").cpus().length:navigator.hardwareConcurrency;ge.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Aa=class{async init(e){Oa(),await ic(),await ac(e)}async createInferenceSessionHandler(e,t){let r=new cc;return await r.loadModel(e,t),r}},hc=new Aa});qe(),qe(),qe();var Xh="1.22.0";{let e=(Qh(),Mt(fc)).wasmBackend;Et("webgpu",e,5),Et("webnn",e,5),Et("cpu",e,10),Et("wasm",e,10)}Object.defineProperty(ge.versions,"web",{value:Xh,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let Ba=null,Yt=[];self.addEventListener("message",async e=>{const{type:t,data:r}=e.data;switch(t){case"INIT":try{if(Ba=await jr.create(r.modelPath,{executionProviders:["wasm"],graphOptimizationLevel:"all"}),r.dictPath)try{Yt=["<blank>",...(await(await fetch(r.dictPath)).text()).trim().split(`
`)]}catch(i){console.warn("Failed to load dictionary, using default:",i),Yt=mc()}else Yt=r.charDict||mc();self.postMessage({type:"RESULT",data:{initialized:!0}})}catch(i){self.postMessage({type:"ERROR",error:i.message})}break;case"PROCESS":if(!Ba){self.postMessage({type:"ERROR",error:"Model not initialized"});return}try{const{imageData:i,width:a,height:n,boxes:s}=r,u=[];for(const l of s){const d=Yh(i,a,n,l),c=Jh(d.data,d.width,d.height),f=await Ba.run({input:c}),{text:h,confidence:g}=em(f);u.push({box:l,text:h,confidence:g}),self.postMessage({type:"PROGRESS",progress:u.length/s.length})}self.postMessage({type:"RESULT",data:{results:u}})}catch(i){self.postMessage({type:"ERROR",error:i.message})}break}});function mc(){const e=["<blank>"];for(let t=0;t<=9;t++)e.push(t.toString());for(let t=65;t<=90;t++)e.push(String.fromCharCode(t));for(let t=97;t<=122;t++)e.push(String.fromCharCode(t));return e.push(".",",","!","?","-","'",'"'," "),e}function Yh(e,t,r,i){const a=Math.min(i.topLeft.x,i.bottomLeft.x),n=Math.max(i.topRight.x,i.bottomRight.x),s=Math.min(i.topLeft.y,i.topRight.y),u=Math.max(i.bottomLeft.y,i.bottomRight.y),l=Math.round(n-a),d=Math.round(u-s),c=new Uint8ClampedArray(l*d*4);for(let f=0;f<d;f++)for(let h=0;h<l;h++){const g=((Math.round(s)+f)*t+Math.round(a)+h)*4,_=(f*l+h)*4;for(let b=0;b<4;b++)c[_+b]=e[g+b]}return{data:c,width:l,height:d}}function Jh(e,t,r){const a=48/r;let n=Math.round(t*a);n=Math.max(n,4),n=Math.ceil(n/4)*4;const s=320;n>s&&(n=s);const l=new OffscreenCanvas(n,48).getContext("2d"),d=new ImageData(new Uint8ClampedArray(e),t,r),c=new OffscreenCanvas(t,r);c.getContext("2d").putImageData(d,0,0),l.drawImage(c,0,0,t,r,0,0,n,48);const h=l.getImageData(0,0,n,48).data,g=new Float32Array(144*n);for(let _=0;_<48;_++)for(let b=0;b<n;b++){const k=(_*n+b)*4,v=_*n+b;g[v]=(h[k]/255-.5)/.5,g[48*n+v]=(h[k+1]/255-.5)/.5,g[96*n+v]=(h[k+2]/255-.5)/.5}return new Pe("float32",g,[1,3,48,n])}function em(e){const t=e["softmax_5.tmp_0"]||e["softmax_0.tmp_0"]||e.output||e.logits||Object.values(e)[0];if(!t)return{text:"",confidence:0};const r=t.data,i=t.dims;let a,n,s=!1;if(i.length===3)i[2]>i[1]?(a=i[1],n=i[2]):(a=i[2],n=i[1],s=!0);else return console.error("Unexpected output shape:",i),{text:"",confidence:0};const u=[],l=[];let d=-1;for(let g=0;g<a;g++){let _=0,b=-1/0;for(let k=0;k<n;k++){const v=s?k*a+g:g*n+k,w=r[v];w>b&&(b=w,_=k)}_!==0&&_!==d&&(u.push(_),l.push(b)),d=_}let c="",f=0;for(let g=0;g<u.length;g++){const _=u[g];_<Yt.length&&(c+=Yt[_],f+=l[g])}const h=u.length>0?f/u.length:0;return{text:c.trim(),confidence:h}}})();
