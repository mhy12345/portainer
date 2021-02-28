import angular from 'angular';

import BlockchainItemController from './blockchain-item-controller';

angular.module('portainer.app').component('blockchainItem', {
  templateUrl: './blockchainItem.html',
  bindings: {
    model: '<',
    onSelect: '<',
    onEdit: '<',
    isAdmin: '<',
    tags: '<',
  },
  controller: BlockchainItemController,
});
