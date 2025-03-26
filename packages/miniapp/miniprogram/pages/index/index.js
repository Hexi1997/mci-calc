Page({
  data: {
    AACT: '1.57',
    MMSE: '28',
    VFT: '14',
    DPNIndex: 0,
    DPNOptions: ['否 (NO)', '是 (YES)'],
    showResult: false,
    probability: '',
    riskLevel: '',
    riskClass: ''
  },

  onAACTInput(e) {
    this.setData({
      AACT: e.detail.value
    });
  },

  onMMSEInput(e) {
    this.setData({
      MMSE: e.detail.value
    });
  },

  onVFTInput(e) {
    this.setData({
      VFT: e.detail.value
    });
  },

  onDPNChange(e) {
    this.setData({
      DPNIndex: Number(e.detail.value)
    });
  },

  calculateRisk() {
    // 获取用户输入
    const AACT = parseFloat(this.data.AACT);
    const MMSE = parseFloat(this.data.MMSE);
    const VFT = parseFloat(this.data.VFT);
    const DPN = this.data.DPNIndex; // 0 或 1

    // 验证输入
    if (isNaN(AACT) || isNaN(MMSE) || isNaN(VFT)) {
      wx.showToast({
        title: '请输入有效的数值',
        icon: 'none'
      });
      return;
    }

    // 固定参数
    const mu_AACT = 4.38244224, sd_AACT = 1.086179713;
    const mu_MMSE = 27.86, sd_MMSE = 1.951;
    const mu_VFT = 17.76, sd_VFT = 4.980;

    // 标准化计算
    const Z_AACT = (AACT - mu_AACT) / sd_AACT;
    const Z_MMSE = (MMSE - mu_MMSE) / sd_MMSE;
    const Z_VFT = (VFT - mu_VFT) / sd_VFT;

    // 主成分计算
    const PC1 = 0.2754 * Z_AACT - 0.6361 * Z_VFT - 0.7207 * Z_MMSE;

    // 逻辑回归计算
    const linearPredictor = -1.3675 + 0.8198 * DPN + 1.8521 * PC1;
    const probability = Math.exp(linearPredictor) / (1 + Math.exp(linearPredictor));
    
    // 风险等级判断
    let riskLevel = '';
    let riskClass = '';
    
    if (probability > 0.5) {
      riskLevel = '高风险 - 建议进一步咨询专业医生';
      riskClass = 'risk-high';
    } else {
      riskLevel = '低风险 - 继续保持良好的认知健康';
      riskClass = 'risk-low';
    }

    // 显示结果
    this.setData({
      showResult: true,
      probability: (probability * 100).toFixed(2),
      riskLevel: riskLevel,
      riskClass: riskClass
    });
  },

  resetForm() {
    this.setData({
      AACT: '1.57',
      MMSE: '28',
      VFT: '14',
      DPNIndex: 0,
      showResult: false
    });
  }
}); 