import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Application } from 'src/app/interfaces/application';
import { ElectronService } from 'ngx-electron'
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppInfo } from 'src/app/interfaces/app-info';
import { Environments } from 'src/app/interfaces/property-sources';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  constructor(private electronService: ElectronService,
              private http: HttpClient) { }

  addApplication(app: Application): Observable<Application> {
    return of(this.electronService.ipcRenderer.sendSync('add-app', app))
    .pipe(
      map((newApp) => {
        if (newApp?.isActive) {
          return newApp;
        }
        throw new Error('Error trying to add the new application.')
      })
    )
  }

  findAllActiveApplication(): Observable<Application[]> {

    return of(this.electronService.ipcRenderer.sendSync('find-all-app'))
    .pipe(
      map((value: Application[])  => {
        value.forEach((app) => {
          if(!app?.isActive) {
            throw new Error('Error trying to get all active applications.');
          }
        });
        return value;
      })
    );
  }

  disableApplication(app: Application): Observable<Application> {

    return of(this.electronService.ipcRenderer.sendSync('disable-app', app))
    .pipe(
      map((disabledApp) => {
        if(disabledApp?.isActive) {
          throw new Error('Error trying to disable application.');
        }
        return disabledApp;
      })
    );
  }

  enableApplications(apps: Application[]): Observable<Application[]> {

    return of(this.electronService.ipcRenderer.sendSync('enable-apps', apps))
    .pipe(
      map((enabledApps) => {
        if(enabledApps?.length !== apps.length) {
          throw new Error('Error trying to enable applications.');
        }
        return enabledApps;
      })
    );
  }

  findAllInactiveApplication(): Observable<Application[]> {

    return of(this.electronService.ipcRenderer.sendSync('find-all-inactive-app'))
    .pipe(
      map((value: Application[])  => {
        value.forEach((app) => {
          if(app?.isActive) {
            throw new Error('Error trying to get all inactive applications.');
          }
        });
        return value;
      })
    );
  }

  updateApplication(app: Application): Observable<Application> {
    return of(this.electronService.ipcRenderer.sendSync('update-app', app))
    .pipe(
      map((newApp) => {
        if (newApp?.isActive) {
          return newApp;
        }
        throw new Error('Error trying to update the application.')
      })
    )
  }

  public getAppInfo(monitoringUrl: string): Observable<AppInfo> {
    return this.http.get<AppInfo>(`${monitoringUrl}/info`)
  }

  public getPropertiesEnv(monitoringUrl: string): Observable<Environments> {
    return this.http.get<Environments>(`${monitoringUrl}/env`)
  }
}
