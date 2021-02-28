import _ from 'lodash-es';

angular.module('portainer.app').controller('BlockchainListController', [
  'DatatableService',
  'PaginationService',
  function BlockchainListController(DatatableService, PaginationService) {
    this.state = {
      totalFilteredBlockchains: this.totalCount,
      textFilter: '',
      filteredBlockchains: [],
      paginatedItemLimit: '10',
      pageNumber: 1,
      loading: true,
    };

    this.$onChanges = function (changesObj) {
      this.handleBlockchainsChange(changesObj.blockchains);
    };

    this.handleBlockchainsChange = function (blockchains) {
      if (!blockchains || !blockchains.currentValue) {
        return;
      }
      this.onTextFilterChange();
    };

    this.onTextFilterChange = function () {
      this.state.loading = true;
      var filterValue = this.state.textFilter;
      DatatableService.setDataTableTextFilters(this.tableKey, filterValue);
      if (this.hasBackendPagination()) {
        this.paginationChangedAction();
      } else {
        this.state.filteredBlockchains = frontBlockchainFilter(this.blockchains, this.tags, filterValue);
        this.state.loading = false;
      }
    };

    function frontBlockchainFilter(blockchains, tags, filterValue) {
      if (!blockchains || !blockchains.length || !filterValue) {
        return blockchains;
      }
      var keywords = filterValue.split(' ');
      return _.filter(blockchains, function (blockchain) {
        var statusString = convertStatusToString(blockchain.Status);
        return _.every(keywords, function (keyword) {
          var lowerCaseKeyword = keyword.toLowerCase();
          return (
            _.includes(blockchain.Name.toLowerCase(), lowerCaseKeyword) ||
            _.includes(blockchain.GroupName.toLowerCase(), lowerCaseKeyword) ||
            _.includes(blockchain.URL.toLowerCase(), lowerCaseKeyword) ||
            _.some(blockchain.TagIds, (tagId) => {
              const tag = tags.find((t) => t.Id === tagId);
              if (!tag) {
                return false;
              }
              return _.includes(tag.Name.toLowerCase(), lowerCaseKeyword);
            }) ||
            _.includes(statusString, keyword)
          );
        });
      });
    }

    this.hasBackendPagination = function () {
      return this.totalCount && this.totalCount > 100;
    };

    this.paginationChangedAction = function () {
      if (this.hasBackendPagination()) {
        this.state.loading = true;
        this.state.filteredBlockchains = [];
        const start = (this.state.pageNumber - 1) * this.state.paginatedItemLimit + 1;
        this.retrievePage(start, this.state.paginatedItemLimit, this.state.textFilter).then((data) => {
          this.state.filteredBlockchains = data.blockchains;
          this.state.totalFilteredBlockchains = data.totalCount;
          this.state.loading = false;
        });
      }
    };

    this.pageChangeHandler = function (newPageNumber) {
      this.state.pageNumber = newPageNumber;
      this.paginationChangedAction();
    };

    this.changePaginationLimit = function () {
      PaginationService.setPaginationLimit(this.tableKey, this.state.paginatedItemLimit);
      this.paginationChangedAction();
    };

    function convertStatusToString(status) {
      return status === 1 ? 'up' : 'down';
    }

    this.$onInit = function () {
      var textFilter = DatatableService.getDataTableTextFilters(this.tableKey);
      this.state.paginatedItemLimit = PaginationService.getPaginationLimit(this.tableKey);
      if (textFilter !== null) {
        this.state.textFilter = textFilter;
      } else {
        this.paginationChangedAction();
      }
    };
  },
]);
