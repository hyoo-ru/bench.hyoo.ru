/** @jsx $mol_jsx */
namespace $ {

	@ $mol_fiber.class
	export class Item extends $mol_jsx_view {

		title() { return '' }

		content() { return '' }

		selected( next = false ) { return next }

		@ $mol_mem
		valueOf() { return super.valueOf() }

		render() { return (
			<div
				classList={[ `list-item list-item-selected-${ this.selected() }` ]}
				onclick={ $mol_fiber_root( ()=> this.selected( true ) ) }
				>
				<div
					id="/title"
					classList={[ 'list-item-title' ]}
					>
					{ this.title() }
				</div>
				<div
					id="/content"
					classList={[ 'list-item-content' ]}
					>
					{ this.content() }
				</div>
			</div>
		) }

	}

	@ $mol_fiber.class
	export class List extends $mol_jsx_view {

		constructor() {
			
			super()

			$mol_dom_context.addEventListener( 'message' , event => {

				switch( event.data[ 0 ] ) {
					case 'set data' :
						this.data( event.data[ 1 ] )
						break
				}
		
			} )
				
		}

		@ $mol_mem
		data( next = {
			sample : '' ,
			items : [] as {
				id : number
				title : string
				content : string
			}[]	
		} ) { return next }

		@ $mol_mem_key
		item( index : number ) {
			return this.data().items[ index ] ?? {}
		}
		
		@ $mol_mem
		selected( next = -1 ) { return next }
		
		@ $mol_mem_key
		item_selected( id : number , next? : boolean ) {
			return this.selected( next === undefined ? undefined : next ? id : -1 ) === id
		}
		
		@ $mol_mem
		valueOf() { return super.valueOf() }

		render() { return (
			<div classList={[ 'list' ]} >
				{ ... this.data().items.map( (item,index) => (
					<Item
						id={ '/item:' + item.id }
						title={ ()=> this.item(index).title }
						content={ ()=> this.item(index).content }
						selected={ next => this.item_selected( item.id , next ) }
					/>
				) ) }
			</div>
		) }

	}

	$mol_atom2_autorun( ()=>
		$mol_jsx_attach( $mol_dom_context.document , ()=>
			<List id="/list" />
		)
	)

}
