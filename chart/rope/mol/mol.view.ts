namespace $.$$ {

	export interface $hyoo_bench_chart_rope_mol_data {
		sample : string
		graphs : number[][]
	}

	export class $hyoo_bench_chart_rope_mol extends $.$hyoo_bench_chart_rope_mol {
		
		@ $mol_mem
		static listener() {
			return new $mol_dom_listener( window , 'message' , ( event : MessageEvent )=> {
				switch( event.data[0] ) {
					case 'fill' :
					case 'update' :
						this.data( event.data[ 1 ] )
						break
				}
			} )
		}
		
		@ $mol_mem
		static data( next? : $hyoo_bench_chart_rope_mol_data ) : $hyoo_bench_chart_rope_mol_data {
			this.listener()
			return next || { sample : '' , graphs : [] }
		}
		
		graphs() {
			const data = $hyoo_bench_chart_rope_mol.data()

			return [
				...super.graphs(),
				...data.graphs.map( ( g , i )=> this.Graph( i ) ),
			]
		}
		
		graph_title( id : number ) {
			return `Graph #${ id }`
		}
		
		series( id : number ) {
			return $hyoo_bench_chart_rope_mol.data().graphs[ id ] ?? [] as number[]
		}
	}

}
