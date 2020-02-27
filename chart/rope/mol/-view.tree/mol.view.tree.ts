namespace $ { export class $hyoo_bench_chart_rope_mol extends $mol_view {

	/**
	 *  ```
	 *  sub / <= Chart
	 *  ```
	 **/
	sub() {
		return [ this.Chart() ] as readonly any[]
	}

	/**
	 *  ```
	 *  Chart $mol_chart graphs <= graphs
	 *  ```
	 **/
	@ $mol_mem
	Chart() {
		return (( obj )=>{
			obj.graphs = () => this.graphs()
			return obj
		})( new this.$.$mol_chart(  ) )
	}

	/**
	 *  ```
	 *  graphs /$mol_plot_graph
	 *  	<= Vert
	 *  	<= Hor
	 *  ```
	 **/
	graphs() {
		return [ this.Vert() , this.Hor() ] as readonly ( $mol_plot_graph )[]
	}

	/**
	 *  ```
	 *  Vert $mol_plot_ruler_vert title \Val
	 *  ```
	 **/
	@ $mol_mem
	Vert() {
		return (( obj )=>{
			obj.title = () => "Val"
			return obj
		})( new this.$.$mol_plot_ruler_vert(  ) )
	}

	/**
	 *  ```
	 *  Hor $mol_plot_ruler_hor title \Iter
	 *  ```
	 **/
	@ $mol_mem
	Hor() {
		return (( obj )=>{
			obj.title = () => "Iter"
			return obj
		})( new this.$.$mol_plot_ruler_hor(  ) )
	}

	/**
	 *  ```
	 *  Graph!id $mol_plot_group
	 *  	title <= graph_title!id
	 *  	series_y <= series!id
	 *  	graphs /
	 *  		<= Line!id
	 *  		<= Dots!id
	 *  ```
	 **/
	@ $mol_mem_key
	Graph( id : any ) {
		return (( obj )=>{
			obj.title = () => this.graph_title(id)
			obj.series_y = () => this.series(id)
			obj.graphs = () => [ this.Line(id) , this.Dots(id) ] as readonly any[]
			return obj
		})( new this.$.$mol_plot_group(  ) )
	}

	/**
	 *  ```
	 *  graph_title!id \
	 *  ```
	 **/
	graph_title( id : any ) {
		return ""
	}

	/**
	 *  ```
	 *  series!id /
	 *  ```
	 **/
	series( id : any ) {
		return [  ] as readonly any[]
	}

	/**
	 *  ```
	 *  Line!id $mol_plot_line
	 *  ```
	 **/
	@ $mol_mem_key
	Line( id : any ) {
		return (( obj )=>{
			return obj
		})( new this.$.$mol_plot_line(  ) )
	}

	/**
	 *  ```
	 *  Dots!id $mol_plot_dot
	 *  ```
	 **/
	@ $mol_mem_key
	Dots( id : any ) {
		return (( obj )=>{
			return obj
		})( new this.$.$mol_plot_dot(  ) )
	}

} }

