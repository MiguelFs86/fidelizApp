import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: [ './editor.component.css' ]
})
export class EditorComponent implements OnInit {
	editorForm: FormGroup;
	// @Input() qr: string;
	@Output() updatePreview = new EventEmitter<string>();

	editorStyle = {
		height: '500px'
	};

	constructor() {}

	ngOnInit() {
		this.editorForm = new FormGroup({
			editor: new FormControl(null)
		});
	}

	ngOnChanges(changes: [{ qr: string }]): void {
		// if (changes['qr'].currentValue) {
		// 	let qrcode = changes['qr'].currentValue;
		// 	qrcode = `<p><img src="${qrcode}"></p>`;
		// 	console.log(qrcode);
		// 	this.editorForm.get('editor').setValue(qrcode);
		// }
	}

	onSubmit() {
		this.updatePreview.emit(this.editorForm.get('editor').value);
	}

	updateChanges() {
		this.updatePreview.emit(this.editorForm.get('editor').value);
	}
}
