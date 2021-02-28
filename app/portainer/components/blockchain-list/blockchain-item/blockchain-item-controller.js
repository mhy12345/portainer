import angular from 'angular';
import _ from 'lodash-es';
import PortainerBlockchainTagHelper from 'Portainer/helpers/tagHelper';

class BlockchainItemController {
  /* @ngInject */
  constructor() {
    this.editBlockchain = this.editBlockchain.bind(this);
  }

  editBlockchain(event) {
    event.stopPropagation();
    this.onEdit(this.model.Id);
  }

  joinTags() {
    if (!this.tags) {
      return 'Loading tags...';
    }

    if (!this.model.TagIds || !this.model.TagIds.length) {
      return '';
    }

    const tagNames = PortainerBlockchainTagHelper.idsToTagNames(this.tags, this.model.TagIds);
    return _.join(tagNames, ',');
  }

  $onInit() {
    this.blockchainTags = this.joinTags();
  }

  $onChanges({ tags, model }) {
    if ((!tags && !model) || (!tags.currentValue && !model.currentValue)) {
      return;
    }
    this.blockchainTags = this.joinTags();
  }
}

angular.module('portainer.app').controller('BlockchainItemController', BlockchainItemController);
export default BlockchainItemController;
