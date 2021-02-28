angular.module('portainer.app').component('blockchainList', {
  templateUrl: './blockchainList.html',
  controller: 'BlockchainListController',
  bindings: {
    titleText: '@',
    titleIcon: '@',
    blockchains: '<',
    tags: '<',
    tableKey: '@',
    dashboardAction: '<',
    snapshotAction: '<',
    showSnapshotAction: '<',
    editAction: '<',
    isAdmin: '<',
    totalCount: '<',
    retrievePage: '<',
  },
});
