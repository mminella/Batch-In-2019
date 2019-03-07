import coreModule from 'app/core/core_module';
import { appEvents } from 'app/core/app_events';
import locationUtil from 'app/core/utils/location_util';
import { DashboardModel } from '../state/DashboardModel';
import { removePanel } from '../utils/panel';

export class DashboardSrv {
  dashboard: DashboardModel;

  /** @ngInject */
  constructor(private backendSrv, private $rootScope, private $location) {
    appEvents.on('save-dashboard', this.saveDashboard.bind(this), $rootScope);
    appEvents.on('panel-change-view', this.onPanelChangeView);
    appEvents.on('remove-panel', this.onRemovePanel);
  }

  create(dashboard, meta) {
    return new DashboardModel(dashboard, meta);
  }

  setCurrent(dashboard: DashboardModel) {
    this.dashboard = dashboard;
  }

  getCurrent(): DashboardModel {
    return this.dashboard;
  }

  onRemovePanel = (panelId: number) => {
    const dashboard = this.getCurrent();
    removePanel(dashboard, dashboard.getPanelById(panelId), true);
  };

  onPanelChangeView = options => {
    const urlParams = this.$location.search();

    // handle toggle logic
    if (options.fullscreen === urlParams.fullscreen) {
      // I hate using these truthy converters (!!) but in this case
      // I think it's appropriate. edit can be null/false/undefined and
      // here i want all of those to compare the same
      if (!!options.edit === !!urlParams.edit) {
        delete urlParams.fullscreen;
        delete urlParams.edit;
        delete urlParams.panelId;
        this.$location.search(urlParams);
        return;
      }
    }

    if (options.fullscreen) {
      urlParams.fullscreen = true;
    } else {
      delete urlParams.fullscreen;
    }

    if (options.edit) {
      urlParams.edit = true;
    } else {
      delete urlParams.edit;
    }

    if (options.panelId || options.panelId === 0) {
      urlParams.panelId = options.panelId;
    } else {
      delete urlParams.panelId;
    }

    this.$location.search(urlParams);
  };

  handleSaveDashboardError(clone, options, err) {
    options = options || {};
    options.overwrite = true;

    if (err.data && err.data.status === 'version-mismatch') {
      err.isHandled = true;

      this.$rootScope.appEvent('confirm-modal', {
        title: 'Conflict',
        text: 'Someone else has updated this dashboard.',
        text2: 'Would you still like to save this dashboard?',
        yesText: 'Save & Overwrite',
        icon: 'fa-warning',
        onConfirm: () => {
          this.save(clone, options);
        },
      });
    }

    if (err.data && err.data.status === 'name-exists') {
      err.isHandled = true;

      this.$rootScope.appEvent('confirm-modal', {
        title: 'Conflict',
        text: 'A dashboard with the same name in selected folder already exists.',
        text2: 'Would you still like to save this dashboard?',
        yesText: 'Save & Overwrite',
        icon: 'fa-warning',
        onConfirm: () => {
          this.save(clone, options);
        },
      });
    }

    if (err.data && err.data.status === 'plugin-dashboard') {
      err.isHandled = true;

      this.$rootScope.appEvent('confirm-modal', {
        title: 'Plugin Dashboard',
        text: err.data.message,
        text2: 'Your changes will be lost when you update the plugin. Use Save As to create custom version.',
        yesText: 'Overwrite',
        icon: 'fa-warning',
        altActionText: 'Save As',
        onAltAction: () => {
          this.showSaveAsModal();
        },
        onConfirm: () => {
          this.save(clone, { overwrite: true });
        },
      });
    }
  }

  postSave(clone, data) {
    this.dashboard.version = data.version;

    // important that these happens before location redirect below
    this.$rootScope.appEvent('dashboard-saved', this.dashboard);
    this.$rootScope.appEvent('alert-success', ['Dashboard saved']);

    const newUrl = locationUtil.stripBaseFromUrl(data.url);
    const currentPath = this.$location.path();

    if (newUrl !== currentPath) {
      this.$location.url(newUrl).replace();
    }

    return this.dashboard;
  }

  save(clone, options) {
    options = options || {};
    options.folderId = options.folderId >= 0 ? options.folderId : this.dashboard.meta.folderId || clone.folderId;

    return this.backendSrv
      .saveDashboard(clone, options)
      .then(this.postSave.bind(this, clone))
      .catch(this.handleSaveDashboardError.bind(this, clone, options));
  }

  saveDashboard(options?, clone?) {
    if (clone) {
      this.setCurrent(this.create(clone, this.dashboard.meta));
    }

    if (this.dashboard.meta.provisioned) {
      return this.showDashboardProvisionedModal();
    }

    if (!this.dashboard.meta.canSave && options.makeEditable !== true) {
      return Promise.resolve();
    }

    if (this.dashboard.title === 'New dashboard') {
      return this.showSaveAsModal();
    }

    if (this.dashboard.version > 0) {
      return this.showSaveModal();
    }

    return this.save(this.dashboard.getSaveModelClone(), options);
  }

  saveJSONDashboard(json: string) {
    return this.save(JSON.parse(json), {});
  }

  showDashboardProvisionedModal() {
    this.$rootScope.appEvent('show-modal', {
      templateHtml: '<save-provisioned-dashboard-modal dismiss="dismiss()"></save-provisioned-dashboard-modal>',
    });
  }

  showSaveAsModal() {
    this.$rootScope.appEvent('show-modal', {
      templateHtml: '<save-dashboard-as-modal dismiss="dismiss()"></save-dashboard-as-modal>',
      modalClass: 'modal--narrow',
    });
  }

  showSaveModal() {
    this.$rootScope.appEvent('show-modal', {
      templateHtml: '<save-dashboard-modal dismiss="dismiss()"></save-dashboard-modal>',
      modalClass: 'modal--narrow',
    });
  }

  starDashboard(dashboardId, isStarred) {
    let promise;

    if (isStarred) {
      promise = this.backendSrv.delete('/api/user/stars/dashboard/' + dashboardId).then(() => {
        return false;
      });
    } else {
      promise = this.backendSrv.post('/api/user/stars/dashboard/' + dashboardId).then(() => {
        return true;
      });
    }

    return promise.then(res => {
      if (this.dashboard && this.dashboard.id === dashboardId) {
        this.dashboard.meta.isStarred = res;
      }
      return res;
    });
  }
}

coreModule.service('dashboardSrv', DashboardSrv);
