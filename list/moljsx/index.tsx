/** @jsx $mol_jsx */
namespace $ {
	
	export class Text extends $mol_jsx_view {
		text() { return '' }
		render() { return (
			<div>
				{ this.text() }
			</div>
		) }
	}

	export class Item extends $mol_jsx_view {

		title() { return '' }

		content() { return '' }

		@ $mol_mem
		selected( next = false ) { return next }
		
		render() { return (
			<div
				class={ `Item__selected-${ this.selected() }` }
				onclick={ ()=> this.selected( true ) }
				>
				<Text id="title" text={ ()=> this.title() } />
				<Text id="content" text={ ()=> this.content() } />
			</div>
		) }

	}

	export class List extends $mol_jsx_view {

		@ $mol_mem
		receiver() {
			return new $mol_dom_listener(
				$mol_dom_context,
				'message',
				event => {

					switch( event.data[ 0 ] ) {
						case 'set data' :
							this.data( event.data[ 1 ] )
							break
					}
			
				}
			)	
		}

		@ $mol_mem
		data( next = {
			sample : '' ,
			items : [] as {
				id : number
				title : string
				content : string
			}[]	
		} ) {
			this.receiver()
			return next
		}
		
		@ $mol_mem
		dict() {
			return Object.fromEntries( this.data().items.map( item => [ item.id, item ] ) )
		}

		item( id : number ) {
			return this.dict()[ id ] ?? {}
		}
		
		@ $mol_mem
		selected( next = -1 ) { return next }
		
		@ $mol_mem_key
		item_selected( id : number , next? : boolean ) {
			return this.selected( next?.valueOf && ( next ? id : -1 ) ) === id
		}
		
		@ $mol_mem
		ids() {
			return this.data().items.map( item => item.id )
		}
		
		render() { return (
			<div>
				{ ... this.ids().map( id => (
					<Item
						id={ 'item/' + id }
						title={ ()=> this.item(id).title }
						content={ ()=> this.item(id).content }
						selected={ next => this.item_selected( id , next ) }
					/>
				) ) }
			</div>
		) }

	}

	$mol_jsx_attach( $mol_dom_context.document , ()=> <List id="list" /> )

}
