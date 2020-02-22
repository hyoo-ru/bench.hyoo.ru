namespace $.$$ {

	export interface $hyoo_bench_chart_bar_mol_data {
		sample : string
		graphs : number[][]
	}

	export class $hyoo_bench_chart_bar_mol extends $.$hyoo_bench_chart_bar_mol {
		
		@ $mol_mem
		static data( next? : $hyoo_bench_chart_bar_mol_data , force? : $mol_mem_force ) : $hyoo_bench_chart_bar_mol_data {
			window.addEventListener( 'message' , event => {
				switch( event.data[0] ) {
					case 'fill' :
					case 'update' :
						this.data( event.data[ 1 ] , $mol_mem_force_cache )
						break
				}
			} )
			return { sample : '' , graphs : [] }
		}
		
		graphs() {
			const data = $hyoo_bench_chart_bar_mol.data()

			return [
				...super.graphs(),
				...data.graphs.map( ( g , i )=> this.Graph( i ) ),
			]
		}
		
		graph_title( id : number ) {
			return `Graph #${ id }`
		}
		
		series( id : number ) {
			return $hyoo_bench_chart_bar_mol.data().graphs[ id ] ?? [] as number[]
		}
		
		hor_series() {
			return $mol_range2().slice( 0 , this.series( 0 ).length )
		}
		
	}

}
