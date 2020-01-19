declare namespace WX {
  interface RequestObjectResult<T extends WechatMiniprogram.IAnyObject>
    extends WechatMiniprogram.RequestSuccessCallbackResult {
    data: T;
  }
}
