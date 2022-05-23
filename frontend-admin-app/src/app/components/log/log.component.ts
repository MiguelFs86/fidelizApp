import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { UserService } from '../../services/user.service';

@Component({
	selector: 'app-log',
	templateUrl: './log.component.html',
	styleUrls: [ './log.component.css' ]
})
export class LogComponent implements OnInit {
	logMessages: any[];
	oldLogMessages: any[];
	selectedTab = 0;
	selectedDate = new Date();

	constructor(private socketService: SocketService, private userService: UserService) {}

	ngOnInit() {
		let messageArray = [];
		this.socketService.emit('log message', { text: 'hey' });
		this.socketService.listen('log message').subscribe((message: string) => {
			if (message) {
				const date = message.split(' ')[0].split('[')[1];
				const hour = message.split(' ')[1].split(']')[0];
				const type = message.split(' - ')[1].split(': ')[0];
				const text = message.split(': ')[1];
				const user = message.split('"')[1];
				const splitMessage = { date, hour, type, text, user };
				messageArray.unshift(splitMessage);
			}
		});
		this.logMessages = messageArray;
	}

	getOldLogFile(date) {
		let messageArray = [];
		let newDate = new Date(date);
		newDate.setDate(date.getDate() + 1);
		this.userService.getLogger(newDate).subscribe((response: any) => {
			const messages = response.log;
			if (messages.length > 0) {
				for (let i = 0; i < messages.length; i++) {
					if (messages[i]) {
						let date = messages[i].split(' ')[0].split('[')[1];
						let hour = messages[i].split(' ')[1].split(']')[0];
						let type = messages[i].split(' - ')[1].split(': ')[0];
						let text = messages[i].split(': ')[1];
						let user = messages[i].split('"')[1];
						let splitMessage = { date, hour, type, text, user };
						messageArray.unshift(splitMessage);
					}
				}
				this.oldLogMessages = messageArray;
			} else {
				this.oldLogMessages = response.log;
			}
		});
	}
}
