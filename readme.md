# $hyoo_bench

Common benchmarking interface, that can be added to any of benchmarks.

## Known benchmarks

* [list](list) - Rendering of lists by frameworks ([online](http://bench.hyoo.ru/list/#bench=list/sort=fill/sample=angularjs~mol~native-dom~react~native-html))
* [elements](elements) - Rendering of HTML elements ([online](http://bench.hyoo.ru/elements/#sample=audio~button~details~div~fieldset~hr~img~input~keygen~marquee~meter~object~optgroup~q~select~style~textarea~video#sort=fill#))
* [geometry](geometry) - Rendering of simple geometry by graphics libraries ([online](http://bench.hyoo.ru/geometry/#sort=render#))
* [chart/rope](chart/rope) - Line graphs rendering by charts libraries ([online](http://bench.hyoo.ru/chart/rope/#sort=fill/sample=hcharts~mol))
* [chart/bar](chart/bar) - Bar graphs rendering by charts libraries ([online](http://bench.hyoo.ru/chart/bar/#sort=fill/sample=hcharts~mol))
* [todomvc](https://github.com/hyoo-ru/todomvc/tree/master/benchmark) - ToDoMVC workflow by frameworks ([online](https://hyoo-ru/todomvc/benchmark/#sample=angular2%7Eangularjs%7Eknockoutjs%7Emol%7Epolymer%7Ereact-alt%7Evanillajs%7Evue#sort=fill#))
* [Unified todomvc](https://github.com/zerkalica/utb) - ToDoMVC workflow by react-like libraries ([online](https://zerkalica.github.io/utb/benchmark/#sample=inferno-lom_atom~inferno-mobx~inferno-raw~inferno-reactive-di~preact-lom_atom~preact-mobx~preact-raw~preact-reactive-di~react-lom_atom~react-mobx~react-raw~react-reactive-di/sort=fill))

## Create your benchmark

Benchmark is html page, opened in iframe, and communicates with $hyoo_bench by RPC.
 
Benchmark must receive messages as array of values. First value is procedure name. Other values is procedure arguments.

```js
window.addEventListener( 'message' , function( event ) {
	window[ event.data[0] ].apply( null , event.data.slice( 1 ) )
} )
```

To return result, benchmark must send message to parent frame.

```js
function done( result ) {
	if( parent === window ) console.log( result )
	else parent.postMessage( [ 'done' , result ] , '*' )
}
```

At start $hyoo_bench sends ```[ 'meta' ]``` to get benchmark meta information in this format:

```ts
type meta = {
	title : { [ lang : string ] : string }
	descr : { [ lang : string ] : string }
	samples : { [ sample : string ] : {
		title : { [ lang : string ] : string }
	} }
	steps : { [ step : string ] : { 
		title : { [ lang : string ] : string }
	} }
	params : { [ param : string ] : {
		title : { [ lang : string ] : string }
		default : number
		type : string
		precision : number 
	} }
}
```

Description supports markdown. For every sample and step benchmark will receive message ```[ step , sample, params ]```.

Deploy benchmark to web server. In example: ```//localhost:9080/hyoo/bench/geometry/```

Open [$hyoo_bench_app](http://bench.hyoo.ru/) and type in developer console command like this to switch to your benchmark:

```
$hyoo_bench_app.root(0).bench( '//localhost:9080/hyoo/bench/geometry/' )
```

## Running custom benches from localhost

Pass url to benchmark in `bench` parameter to `http://localhost:9080/hyoo/bench/app/`

Example:

```
http://localhost:9080/hyoo/bench/app/#bench=..%2Fgeometry
```

## Articles

- [$mol_app_bench: готовим JS бенчмарки быстро и просто](https://habrahabr.ru/post/322162/)

