namespace $.$$ {

	export interface $mol_app_bench_chart_rope_mol_data {
		sample : string
		graphs : number[][]
	}

	export class $mol_app_bench_chart_rope_mol extends $.$mol_app_bench_chart_rope_mol {
		
		@ $mol_mem
		static data( next? : $mol_app_bench_chart_rope_mol_data , force? : $mol_mem_force ) : $mol_app_bench_chart_rope_mol_data {
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
			const data = $mol_app_bench_chart_rope_mol.data()

			return [
				...super.graphs(),
				...data.graphs.map( ( g , i )=> this.Graph( i ) ),
			]
		}
		
		graph_title( id : number ) {
			return `Graph #${ id }`
		}
		
		series( id : number ) {
			return $mol_app_bench_chart_rope_mol.data().graphs[ id ] ?? [] as number[]
		}
	}

}
