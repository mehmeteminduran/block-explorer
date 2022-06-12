<template>
  <div class="grid">
    <div class="col-12">
      <div class="card align-items-center justify-content-center">
        <div class="formgroup-inline">
          <div class="field">
            <div class="field-radiobutton pt-2 mb-0">
              <RadioButton
                id="option1"
                name="option"
                :value="true"
                v-model="isSearchInRange"
              />
              <label for="option1">Block Range</label>
            </div>
          </div>
          <div class="field">
            <div class="field-radiobutton pt-2 mb-0">
              <RadioButton
                id="option2"
                name="option"
                :value="false"
                v-model="isSearchInRange"
              />
              <label for="option2">How far back from the present block? </label>
            </div>
          </div>
          <div class="field" v-if="isSearchInRange">
            <label for="startBlock" class="p-sr-only">Start Block</label>
            <InputNumber
              id="startBlock"
              v-model="startBlock"
              showButtons
              placeholder="Start Block"
              :min="0"
            >
            </InputNumber>
          </div>
          <div class="field" v-if="isSearchInRange">
            <label for="endBlock" class="p-sr-only">End Block</label>
            <InputNumber
              id="endBlock"
              v-model="endBlock"
              showButtons
              placeholder="End Block"
              :min="0"
            >
            </InputNumber>
          </div>
          <div class="field" v-if="!isSearchInRange">
            <label for="blockNumber" class="p-sr-only"
              >Back from the present block</label
            >
            <InputNumber
              id="blockNumber"
              v-model="blockNumber"
              placeholder="Back from the present"
              showButtons
              :min="0"
            ></InputNumber>
          </div>
          <Button
            type="button"
            class="mr-2 mb-2"
            label="Search"
            icon="pi pi-search"
            :loading="loading"
            @click="getBlocks"
          />
        </div>
      </div>
    </div>
  </div>
  <ReportDetail :blockDetail="blockDetail" :loading="loading" />
  <div class="grid">
    <div class="col-6">
      <div class="card">
        <h5>Receiver Addresses</h5>
        <AddressValue :addresses="receiverAddresses" />
      </div>
    </div>
    <div class="col-6">
      <div class="card">
        <h5>Sender Addresses</h5>
        <AddressValue :addresses="senderAddresses" />
      </div>
    </div>
  </div>
</template> 
<script>
import { getBlockData } from "../helpers/blockExplorer";
import web3 from "../helpers/initWeb3";
import AddressValue from "./../components/AddressValue";
import ReportDetail from "./../components/ReportDetail.vue";
export default {
  components: {
    AddressValue,
    ReportDetail,
  },
  data() {
    return {
      isSearchInRange: true,
      startBlock: null,
      endBlock: null,
      blockNumber: null,
      blockData: {},
      loading: true,
      receiverAddresses: [],
      senderAddresses: [],
      blockDetail: {},
    };
  },
  created() {},
  mounted() {
    this.loading = false;
  },
  methods: {
    async getBlocks() {
      this.loading = true;

      let startNumber, endNumber;
      if (this.isSearchInRange) {
        startNumber = parseInt(this.startBlock);
        endNumber = parseInt(this.endBlock);
      } else {
        await web3.eth.getBlockNumber().then((res) => {
          endNumber = parseInt(res);
          startNumber = endNumber - parseInt(this.blockNumber);
        });
      }

      const blockNumbers = Array.from(
        { length: endNumber - startNumber + 1  },
        (_, i) => startNumber + i
      );

      console.log(`startNumber : ${startNumber} - endNumber : ${endNumber}`);

      getBlockData(blockNumbers)
        .then((res) => { 
          this.blockData = res; 
          this.mapBlockDetail(); 
        })
        .catch((err) => {
          console.log(err)
        })
        .finally((this.loading = false)); 
    },
    mapBlockDetail() { 
      this.receiverAddresses = this.blockData.receiverAddresses;
      this.senderAddresses = this.blockData.senderAddresses;
      this.blockDetail = {
        contractPercentage: this.blockData.contractPercentage,
        uncleCount: this.blockData.uncleCount,
        contractCount: this.blockData.contractCount,
        receiverCount: this.blockData.receiverCount,
        senderCount: this.blockData.senderCount,
        eventCount: this.blockData.eventCount,
      };
    },
  },
};
</script>