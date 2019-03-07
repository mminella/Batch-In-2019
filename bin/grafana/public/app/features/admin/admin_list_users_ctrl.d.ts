/// <reference path="../../../../public/app/headers/common.d.ts" />
export default class AdminListUsersCtrl {
    private $scope;
    private backendSrv;
    users: any;
    pages: any[];
    perPage: number;
    page: number;
    totalPages: number;
    showPaging: boolean;
    query: any;
    /** @ngInject */
    constructor($scope: any, backendSrv: any);
    getUsers(): void;
    navigateToPage(page: any): void;
    deleteUser(user: any): void;
}
