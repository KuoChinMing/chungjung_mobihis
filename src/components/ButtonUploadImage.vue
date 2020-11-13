<template>
  <div>
    <label class="action d-flex align-items-center" for="uploadImage">
      <v-icon color="primary">mdi-cloud-upload</v-icon>
      <span class="ml-2">照片上傳</span>
      <input
        type="file"
        id="uploadImage"
        ref="image"
        hidden
        accept="image/jpeg, image/png"
        @change="uploadImage"
      />
    </label>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "@/plugins/axios";

export default {
  name: "ButtonUploadImage",

  props: {
    text: {
      type: String,
      default: "",
      required: false
    }
  },

  data() {
    return {
      // image: null
    };
  },

  computed: {
    ...mapState(["token"])
  },

  created() {},

  methods: {
    async uploadImage() {
      const image = this.$refs.image.files[0];
      const BASE_URL = process.env.VUE_APP_BASE_URL;
      const formData = new FormData();
      formData.append("file", image);

      const params = {
        mrno: this.$route.params.patientId,
        patientName: "EBM",
        section: "CRS",
        time: "手術前",
        imageType: "傷口治療前",
        bodyPart: "頭部"
      };

      const res = await axios.post(`${BASE_URL}/api/UploadOP`, formData, {
        params,
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log(res);
    },

    // 子榮寫的
    async fileReaderAnalyze(blob) {
      const vm = this;
      const reader = new FileReader();

      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          //取得旋轉資訊
          //判斷圖片資訊有旋轉且符合ipad或ipad pro,若有則進行旋轉,若沒有則進行一般操作
          vm.picOrient = vm.getPhotoOrientation(img);
          if (
            vm.picOrient == 6 &&
            (navigator.platform.match(/iPad/i) || navigator.platform.match("MacIntel"))
          ) {
            vm.imgRealWidth = img.width;
            vm.imgRealHight = img.height;
            vm.canvasSizeRatio = vm.imgRealHight / vm.canvasMaxWidth; //canvas座標轉成真實圖片座標倍率
            vm.canvas.width = img.height;
            vm.canvas.height = img.width;
            vm.imgCanvasHeight = (1 / vm.canvasSizeRatio) * vm.canvas.height; //真實圖片轉成canvas

            vm.ctx.save();
            vm.ctx.rotate((Math.PI * 90) / 180);
            vm.ctx.drawImage(img, 0, -img.height, img.width, img.height); //旋轉完後dx/dy會相反
            vm.ctx.restore();
          } else {
            vm.imgRealWidth = img.width;
            vm.imgRealHight = img.height;
            vm.canvasSizeRatio = vm.imgRealWidth / vm.canvasMaxWidth; //canvas座標轉成真實圖片座標倍率(必須用寬度,因為有預設寬度上限)
            vm.canvas.width = img.width;
            vm.canvas.height = img.height;
            vm.imgCanvasHeight = (1 / vm.canvasSizeRatio) * img.height; //真實圖片轉成canvas
            vm.ctx.drawImage(img, 0, 0);
          }
          //圖片加載完後存進存入history[0]
          vm.currentImgsIdx = vm.historyImgs.length; //上傳圖片後從0開始
          const base64 = vm.canvas.toDataURL();
          vm.base64 = base64;
          vm.historyImgs.push(base64);
          vm.enableDraw = true;
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(blob); //轉base64

      //上傳圖片後Canvas顏色線條跟寬度會被重製,需重新寫入
      setTimeout(() => {
        if (vm.strokeColor !== vm.selectColor) {
          //判斷是否有切換過顏色
          vm.ctx.strokeStyle = vm.selectColor;
        } else {
          vm.ctx.strokeStyle = vm.strokeColor;
        }
        vm.ctx.lineWidth = vm.strokeWidth;
        vm.ctx.lineCap = "round";
        vm.ctx.lineJoin = "round";
      }, 300);
    }
  }
};
</script>
