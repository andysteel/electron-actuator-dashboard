import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Application } from 'src/app/interfaces/application';
import { ApplicationService } from '../services/application.service';
import { faBug, faCheckCircle, faSync, faCog, faInfo,
  faPlus, faChartLine, faPencilAlt, faTrashAlt,
  faTachometerAlt, faBan, faSave, faPlug } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Message, Confirmation } from 'primeng/api';
import { SystemHealth } from 'src/app/interfaces/system-health';
import { HealthStatus } from 'src/app/enums/health-status';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { AppInfo } from 'src/app/interfaces/app-info';
import { PropertySources } from 'src/app/interfaces/property-sources';

  @Component({
    selector: 'app-application',
    templateUrl: './application.component.html',
    styleUrls: ['./application.component.css']
  })
  export class ApplicationComponent implements OnInit {

  display = false;
  displayEnableModal = false;
  displayUpdate = false;
  isModalInfoVisible = false;
  faBug = faBug;
  faCheckCircle = faCheckCircle;
  faSync = faSync;
  faCog = faCog;
  faPlus = faPlus;
  faChartLine = faChartLine;
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faTachometerAlt = faTachometerAlt;
  faBan = faBan;
  faSave = faSave;
  faPlug = faPlug;
  faInfo = faInfo;
  insertForm!: FormGroup;
  updateForm!: FormGroup;
  applications: Application[];
  updatedAt: Date | undefined = undefined;
  healthStatus = HealthStatus;
  renderApps = false;
  inactiveApplications: Application[] | undefined = undefined;
  updatableApp: Application | undefined = undefined;
  appInfo: AppInfo | undefined = undefined;
  appEnv: PropertySources | undefined = undefined;

  @Output() messageEvent = new EventEmitter<Message>();
  @Output() confirmEvent = new EventEmitter<Confirmation>();

  constructor(private applicationService: ApplicationService,
              private adminDashboardService: AdminDashboardService,
              private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.saveForm();
    this.modifyForm();
    this.findAllActiveApplication();
  }

  saveForm() {
    this.insertForm = this.formBuilder.group({
      name: ['', Validators.required],
      context: ['', Validators.required],
      monitoringUrl: ['', Validators.required]
    });
  }

  modifyForm() {
    this.updateForm = this.formBuilder.group({
      id: [this.updatableApp?.id, Validators.required],
      name: [this.updatableApp?.name, Validators.required],
      context: [this.updatableApp?.context, Validators.required],
      monitoringUrl: [this.updatableApp?.monitoringUrl, Validators.required]
    })
  }

  toogleModal() {
    if(this.display) {
      this.insertForm.reset();
      this.display = false;
    } else {
      this.display = true;
    }
  }

  toogleEnableModal() {
    if(this.displayEnableModal) {
      this.displayEnableModal = false;
    } else {
      this.findAllInactiveApplication();
      this.displayEnableModal = true;
    }
  }

  toogleUpdateModal(app?: Application) {
    if(this.displayUpdate) {
      this.updateForm.reset();
      this.displayUpdate = false;
    } else {
      this.updatableApp = app;
      this.modifyForm();
      this.displayUpdate = true;
    }
  }

  toogleModalInfo() {
    if(this.isModalInfoVisible) {
      this.isModalInfoVisible = false;
    } else {
      this.isModalInfoVisible = true;
    }
  }

  showEnableButton() {
    if(this.inactiveApplications?.length > 0) {
      return true;
    }
    return false;
  }

  async onAddApplication() {
    const { name, context, monitoringUrl } = this.insertForm!.value;
    if(!this.insertForm!.valid) {
      Object.entries(this.insertForm!.controls)
      .map(key => {
        this.insertForm!.controls[key[0]].markAsDirty();
        this.insertForm!.controls[key[0]].updateValueAndValidity();
      });
    } else {
      const app: Application = { name, context, monitoringUrl, isActive: true }
      this.applicationService.addApplication(app).subscribe(
        (appResponse) => {
          this.messageEvent.emit({key: 'messages', severity: 'success', life: 4000, summary: `Monitoring ${appResponse?.name} .`})
          this.findAllActiveApplication();
        },
        (error) => {
          this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
        }
      );
      this.display = false;
      this.insertForm.reset();
    }
  }

  async findAllActiveApplication() {
    const applications: Application[] | undefined = await this.applicationService.findAllActiveApplication()
    .toPromise()
    .then((response) => {
      this.applications = response;
      return response;
    })
    .catch((error: any) => {
      this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
      return undefined;
    });
    this.renderApps = false;
    if(applications) {
      const applicationsHealth = applications.map(async (app: Application) => {
        const health: SystemHealth = await this.adminDashboardService
          .getSystemHealth(app.monitoringUrl)
          .toPromise()
          .then((response) => {
            return response;
          }).catch(error => {
            const healthDown: SystemHealth = { status: HealthStatus.DOWN }
            return healthDown;
          });
        app.systemHealth = health;
        return app;
      });
      await Promise.all(applicationsHealth).then(healths => this.applications = healths)
      this.renderApps = true;
      this.updatedAt = new Date();
    }
  }

  async findAllInactiveApplication() {
    await this.applicationService.findAllInactiveApplication()
    .toPromise()
    .then((response) => {
      this.inactiveApplications = response;
    })
    .catch((error: any) => {
      this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
    });
  }

  async activeApplications() {
    const appsToUpdate = this.inactiveApplications.filter((app) => app.isActive);
    await this.applicationService.enableApplications(appsToUpdate)
    .toPromise()
    .then((responseApps) => {
      this.messageEvent.emit({key: 'messages', severity: 'success', life: 4000, summary: `${responseApps.length} Application(s) enabled.`});
    })
    .catch((error) => {
      this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
    });
    this.toogleEnableModal();
    this.findAllActiveApplication();
  }

  updateApplication() {
    const { name, context, monitoringUrl } = this.updateForm!.value;
    if(!this.updateForm!.valid) {
      Object.entries(this.updateForm!.controls)
      .map(key => {
        this.updateForm!.controls[key[0]].markAsDirty();
        this.updateForm!.controls[key[0]].updateValueAndValidity();
      });
    } else {
      const id = this.updatableApp.id;
      const appToUpdate: Application = { id, name, context, monitoringUrl, isActive: true };

      this.applicationService.updateApplication(appToUpdate).subscribe(
        (appResponse) => {
          this.messageEvent.emit({key: 'messages', severity: 'success', life: 4000, summary: `Updated ${appResponse?.name} .`})
          this.findAllActiveApplication();
        },
        (error) => {
          this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
        }
      );
      this.displayUpdate = false;
      this.updateForm.reset();
    }
  }

  deleteApplication(app: Application) {
    this.confirmEvent.emit({
      message: 'Do you want to disable this application monitoring ?',
      header: `Disable ${app.name} application`,
      icon: 'pi pi-info-circle',
      accept: () => {
        this.applicationService.disableApplication(app).subscribe(
          (response) => {
            this.messageEvent.emit({key: 'messages', severity: 'success', life: 4000, summary: `${response?.name} was disable.`})
            this.findAllActiveApplication();
          },
          (error) => {
            this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
          }
        )
      }
    })
  }

  async getAppInfoAndEnv(app: Application) {
    const info = await this.applicationService.getAppInfo(app.monitoringUrl)
    .toPromise()
    .then(infoResponse => {
      this.appInfo = infoResponse;
      return infoResponse;
    })
    .catch(error => {
      this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
    })

    if(info) {
      await this.applicationService.getPropertiesEnv(app.monitoringUrl)
      .toPromise()
      .then(envResponse => {
        this.appEnv = envResponse.propertySources[2];
        this.toogleModalInfo();
      })
      .catch(error => {
        this.messageEvent.emit({key: 'messages', severity: 'error', life: 4000, summary: `${error}`})
      })
    }
  }

  refreshList() {
    const button = document.querySelector('#refresh') as HTMLButtonElement;
    button.click();
  }

  isValidAppList() {
    return this.renderApps;
  }

  getHealthStatus() {
    return this.healthStatus;
  }
}

