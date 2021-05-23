import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'actuator Dashboard';

  constructor(private primengConfig: PrimeNGConfig,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  onActivate(componentReference) {
    componentReference.messageEvent?.subscribe(
      (message) => {
        this.messageService.add(message);
      }
    );
    componentReference.confirmEvent?.subscribe(
      (confirmation) => {
        this.confirmationService.confirm(confirmation);
      }
    );
  }

  onDeactivate(componentReference) {
    componentReference.messageEvent?.unsubscribe();
    componentReference.confirmEvent?.unsubscribe();
  }

}
