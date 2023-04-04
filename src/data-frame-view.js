import { LitElement, css, html } from 'lit'
import { when } from 'lit/directives/when.js';
import { range, create } from "d3"

function webRDFToJS(obj) {
	return range(0, obj.values[ 0 ].values.length).map((ridx) => {
		let m = {};
		for (var cidx = 0; cidx < obj.names.length; cidx++) {
			m[ obj.names[ cidx ] ] = obj.values[ cidx ].values[ ridx ];
		}
		return m;
	});
}

function simple_table(data, columns) {

	const table = create('table')
	const thead = table.append('thead')
	const tbody = table.append('tbody');

	thead.append('tr')
		.selectAll('th')
		.data(columns).enter()
		.append('th')
		.text(function (column) { return column; });

	const rows = tbody.selectAll('tr')
		.data(data)
		.enter()
		.append('tr');

  rows.selectAll('td')
		.data(function (row) {
			return columns.map(function (column) {
				return { column: column, value: row[ column ] };
			});
		})
		.enter()
		.append('td')
		.text(function (d) { return d.value; });

	return table;

}

export class DataFrameView extends LitElement {

	static properties = {
		id: { type: String },
		label: { type: String },
		dataFrame: { type: Object },
		columns: { type: Array }
	};

	async _handleClick(e) {
		if (this.onClick) {
			await this.onClick(e)
		} 
	}

	constructor() {
		super()
		this.label = ''
		this.columns = [] 
		this.dataFrame = null
	}

	render() {

		let cols = this.columns;

		if (cols.length == 0) {
			if (this.dataFrame && Object.keys(this.dataFrame).includes("names")) {
				cols = this.dataFrame.names
			}
		}

		return when(

			this.dataFrame && Object.keys(this.dataFrame).includes("type"),

			() => html`<div id="${this.id}">
			<h3>${this.label}</h3>
			${simple_table(webRDFToJS(this.dataFrame), cols)}
			</div>`,

			() => html`<div id="${this.id}"></div>`

		)

	}

	static styles = [
		css`
			:host {
				display: block;
			}
			:host div {
				overflow-y: scroll;
				height: 300px;
				scrollbar-width: none;
			}
			:host div::-webkit-scrollbar { 
				display: none;
			}
			:host table {
				font-family: var(--font-family-monospace, monospace);
			}
			:host th {
				text-align: right;
			}
			:host td {
				text-align: right;
				padding-right: 6px;
				padding-left: 6px;
			}
		`
	];

}

window.customElements.define('data-frame-view', DataFrameView)
