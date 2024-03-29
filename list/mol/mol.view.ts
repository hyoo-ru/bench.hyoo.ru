namespace $.$$ {

	export interface $hyoo_bench_list_mol_data {
		sample : string
		items : {
			id : number
			title : string
			content : string
		}[]
	}

	export class $hyoo_bench_list_mol extends $.$hyoo_bench_list_mol {

		@ $mol_mem
		static listener() {
			return new $mol_dom_listener( window , 'message' , ( event : MessageEvent )=> {
				if( event.data[0] !== 'set data' ) return
				this.data( event.data[1] )
			} )
		}
		
		@ $mol_mem
		static data( next? : $hyoo_bench_list_mol_data ) {
			this.listener()
			return next || { sample : '' , items : [] }
		}

		items() {
			return $hyoo_bench_list_mol.data().items
		}
		
		@ $mol_mem
		rows() { return this.items().map( ( row , id ) => this.Row( id ) ) }
		
		@ $mol_mem_key
		row_title( id : number ) {
			return this.items()[ id ].title
		}
		
		@ $mol_mem_key
		row_content( id : number ) {
			return this.items()[ id ].content
		}
		
		@ $mol_mem_key
		row_selected( id : number , next? : boolean ) {
			if( next !== void 0 ) this.selected_id( next ? id : null )
			return this.selected_id() === id
		}
		
		@ $mol_mem
		selected_id( next? : number | null ) {
			this.items()
			if( next === void 0 ) return null
			return next
		}
		
	}

}
